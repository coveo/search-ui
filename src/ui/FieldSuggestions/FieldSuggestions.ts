



module Coveo {
  export interface FieldSuggestionsOptions extends SuggestionForOmniboxOptions {
    field?: string;
    queryOverride?: string;

    omniboxDelay?: number;
  }

  export class FieldSuggestions extends Coveo.Component {
    static ID = "FieldSuggestions";
    static options: FieldSuggestionsOptions = {
      field: ComponentOptions.buildFieldOption({required: true}),
      queryOverride: ComponentOptions.buildStringOption({defaultValue: ''}),
      omniboxZIndex: ComponentOptions.buildNumberOption({defaultValue: 51, min: 0}),
      headerTitle: ComponentOptions.buildLocalizedStringOption({defaultValue: l("SuggestedResults")}),
      numberOfSuggestions: ComponentOptions.buildNumberOption({defaultValue: 5, min: 1}),

      omniboxDelay: ComponentOptions.buildNumberOption({defaultValue: 500, min: 0})
    };

    private suggestionForOmnibox: SuggestionForOmnibox;

    private topFieldElementHeaderTemplate = _.template(
        "<div class='coveo-top-field-suggestion-header'>\
          <span class='coveo-icon-top-field'></span> \
          <span class='coveo-caption'><%= headerTitle %></span> \
        </div>"
    );
    private topFieldElementRowTemplate = _.template(
        "<div class='magic-box-suggestion coveo-omnibox-selectable coveo-top-field-suggestion-row'> \
          <%= data %> \
        </div>"
    );

    constructor(element: HTMLElement, public options: FieldSuggestionsOptions, bindings?: IComponentBindings) {
      super(element, FieldSuggestions.ID, bindings);

      // TODO remove on v1
      // this was really confusing but back in time, all the option need to be set in an object omniboxSuggestionOptions like this :
      // var option = { "omniboxSuggestionOptions": { "omniboxZIndex": 10 } };
      if ('omniboxSuggestionOptions' in this.options) {
        this.options = _.extend(this.options, this.options['omniboxSuggestionOptions'])
      }

      this.options = ComponentOptions.initComponentOptions(element, FieldSuggestions, options);

      Assert.check(Utils.isCoveoField(this.options.field), this.options.field + ' is not a valid field');

      this.options.onSelect = this.options.onSelect || this.onRowSelection;

      var suggestionStructure: SuggestionForOmniboxTemplate;
      if (this.searchInterface.isNewDesign()) {
        suggestionStructure = {
          row: this.topFieldElementRowTemplate
        };
      } else {
        suggestionStructure = {
          header: {template: this.topFieldElementHeaderTemplate, title: this.options.headerTitle},
          row: this.topFieldElementRowTemplate
        };
      }

      this.suggestionForOmnibox = new SuggestionForOmnibox(suggestionStructure, $.proxy(this.options.onSelect, this));

      $(this.root).on(OmniboxEvents.populateOmnibox, $.proxy(this.handlePopulateOmnibox, this));
    }

    private lastDeferred: JQueryDeferred<any>;
    private lastTimeout: number;

    private handlePopulateOmnibox(e: JQueryEventObject, args: IPopulateOmniboxEventArgs) {
      Assert.exists(args);

      if (!this.disabled) {
        var valueToSearch = args.completeQueryExpression.word;
        if (this.lastDeferred != null) {
          this.resolveWithUndefined(this.lastDeferred)
        }
        this.lastDeferred = $.Deferred<OmniboxDataRow>();
        clearTimeout(this.lastTimeout);
        var triggerQuery = ()=> {
          this.lastTimeout = null;
          var searchPromise = this.queryController.getEndpoint().listFieldValues(this.buildListFieldValueRequest(valueToSearch));

          searchPromise.then((results: IIndexFieldValue[]) => {
            var element = this.suggestionForOmnibox.buildOmniboxElement(results, args);
            this.lastDeferred.resolve({
              element: element == undefined ? undefined : element.get(0),
              zIndex: this.options.omniboxZIndex
            });
          });

          searchPromise.catch(() => {
            this.resolveWithUndefined(this.lastDeferred)
          });
        }
        if (this.options.omniboxDelay > 0) {
          this.lastTimeout = setTimeout(triggerQuery, this.options.omniboxDelay);
        } else {
          triggerQuery();
        }
        args.rows.push({
          deferred: this.lastDeferred
        })
      }
    }

    private resolveWithUndefined(deferred: JQueryDeferred<any>) {
      deferred.resolve({
        element: undefined
      })
    }

    private onRowSelection(value: string, args: IPopulateOmniboxEventArgs) {
      args.clear();
      args.closeOmnibox();
      this.queryStateModel.set(QueryStateModel.attributesEnum.q, value);
      this.queryController.deferExecuteQuery({
        beforeExecuteQuery: () => this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(AnalyticsActionCauseList.omniboxField, {})
      });
    }

    private buildListFieldValueRequest(valueToSearch: string): IListFieldValuesRequest {
      return {
        field: this.options.field,
        ignoreAccents: true,
        sortCriteria: 'occurrences',
        maximumNumberOfValues: this.options.numberOfSuggestions,
        patternType: "Wildcards",
        pattern: "*" + valueToSearch + "*",
        queryOverride: this.options.queryOverride
      };
    }
  }

  Coveo.Initialization.registerAutoCreateComponent(FieldSuggestions);
}
