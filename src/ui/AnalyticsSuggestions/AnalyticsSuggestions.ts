


module Coveo {
  export interface AnalyticsSuggestionsOptions extends SuggestionForOmniboxOptions {
  }

  export class AnalyticsSuggestions extends Coveo.Component {
    static ID = "AnalyticsSuggestions";
    static options: AnalyticsSuggestionsOptions = {
      omniboxZIndex: ComponentOptions.buildNumberOption({ defaultValue: 52, min: 0 }),
      headerTitle: ComponentOptions.buildLocalizedStringOption({ defaultValue: l("SuggestedQueries") }),
      numberOfSuggestions: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 })
    };

    private suggestionForOmnibox: SuggestionForOmnibox;
    private partialQueries: string[] = [];
    private lastSuggestions: string[] = []

    private topAnalyticsElementHeaderTemplate = _.template(
      "<div class='coveo-top-analytics-suggestion-header'>\
          <span class='coveo-icon-top-analytics'></span> \
          <span class='coveo-caption'><%= headerTitle %></span> \
        </div>"
    );
    private topAnalyticsElementRowTemplate = _.template(
      "<div class='magic-box-suggestion coveo-omnibox-selectable coveo-top-analytics-suggestion-row'> \
          <%= data %> \
        </div>"
    );

    constructor(element: HTMLElement,
      public options: AnalyticsSuggestionsOptions,
      bindings?: IComponentBindings) {
      super(element, AnalyticsSuggestions.ID, bindings);

      // TODO remove on v1
      // this was really confusing but back in time, all the option need to be set in an object omniboxSuggestionOptions like this :
      // var option = { "omniboxSuggestionOptions": { "omniboxZIndex": 10 } };
      if ('omniboxSuggestionOptions' in this.options) {
        this.options = _.extend(this.options, this.options['omniboxSuggestionOptions'])
      }

      ComponentOptions.initComponentOptions(element, AnalyticsSuggestions, this.options);

      this.options.onSelect = this.options.onSelect || this.onRowSelection;

      var suggestionStructure: SuggestionForOmniboxTemplate;
      if (this.searchInterface.isNewDesign()) {
        suggestionStructure = {
          row: this.topAnalyticsElementRowTemplate
        };
      } else {
        suggestionStructure = {
          header: { template: this.topAnalyticsElementHeaderTemplate, title: this.options.headerTitle },
          row: this.topAnalyticsElementRowTemplate
        };
      }

      this.suggestionForOmnibox = new SuggestionForOmnibox(suggestionStructure, $.proxy(this.options.onSelect, this));
      $(this.root).on(OmniboxEvents.populateOmnibox, $.proxy(this.handlePopulateOmnibox, this));
      this.bind.onRoot(QueryEvents.querySuccess, () => this.partialQueries = []);
    }

    private resultsToBuildWith = [];

    private handlePopulateOmnibox(e: JQueryEventObject, args: IPopulateOmniboxEventArgs) {
      Assert.exists(args);

      if (!this.disabled) {

        var deferred = $.Deferred<OmniboxDataRow>();
        var searchPromise = this.usageAnalytics.getTopQueries({
          pageSize: this.options.numberOfSuggestions,
          queryText: args.completeQueryExpression.word
        });

        searchPromise.then((results: string[]) => {
          this.resultsToBuildWith = _.map(results, (result) => {
            return {
              value: result
            }
          });
          this.lastSuggestions = results;
          if (!_.isEmpty(this.resultsToBuildWith) && args.completeQueryExpression.word != '') {
            this.partialQueries.push(args.completeQueryExpression.word);
          }
          var element = this.suggestionForOmnibox.buildOmniboxElement(this.resultsToBuildWith, args);
          deferred.resolve({
            element: element == undefined ? undefined : element.get(0),
            zIndex: this.options.omniboxZIndex
          })
        });
        searchPromise.catch(() => {
          this.resolveWithUndefined(deferred);
        });
        args.rows.push({ deferred: deferred });
      }
    }

    private onRowSelection(value: string, args: IPopulateOmniboxEventArgs) {
      args.clear();
      args.closeOmnibox();
      this.queryStateModel.set(QueryStateModel.attributesEnum.q, value);
      this.queryController.deferExecuteQuery({
        beforeExecuteQuery: () => {
          this.usageAnalytics.logSearchEvent<IAnalyticsTopSuggestionMeta>(AnalyticsActionCauseList.omniboxAnalytics, {
            partialQueries: this.cleanCustomData(this.partialQueries),
            suggestionRanking: _.indexOf(_.pluck(this.resultsToBuildWith, 'value'), value),
            suggestions: this.cleanCustomData(this.lastSuggestions),
            partialQuery: args.completeQueryExpression.word
          });
        }
      });
    }

    private cleanCustomData(toClean: string[], rejectLength = 256) {
      // Filter out only consecutive values that are the identical
      toClean = _.filter(toClean, (partial: string, pos?: number, array?: string[]) => {
        return pos === 0 || partial !== array[pos - 1];
      });

      // Custom dimensions cannot be an array in analytics service: Send a string joined by ; instead.
      // Need to replace ;
      toClean = _.map(toClean, (partial) => {
        return partial.replace(/;/g, '');
      });

      // Reduce right to get the last X words that adds to less then rejectLength
      var reducedToRejectLengthOrLess = [];
      _.reduceRight(toClean, (memo: number, partial: string) => {
        var totalSoFar = memo + partial.length;
        if (totalSoFar <= rejectLength) {
          reducedToRejectLengthOrLess.push(partial);
        }
        return totalSoFar;
      }, 0);
      toClean = reducedToRejectLengthOrLess.reverse();
      var ret = toClean.join(';');

      // analytics service can store max 256 char in a custom event
      // if we're over that, call cleanup again with an arbitrary 10 less char accepted
      if (ret.length >= 256) {
        return this.cleanCustomData(toClean, rejectLength - 10);
      }

      return toClean.join(';');
    }


    private resolveWithUndefined(deferred: JQueryDeferred<any>) {
      deferred.resolve({
        element: undefined
      })
    }
  }
  Initialization.registerAutoCreateComponent(AnalyticsSuggestions)
}
