import {ISuggestionForOmniboxOptions, SuggestionForOmnibox, ISuggestionForOmniboxTemplate} from '../Misc/SuggestionForOmnibox';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Component} from '../Base/Component';
import {Assert} from '../../misc/Assert';
import {OmniboxEvents, IPopulateOmniboxEventArgs} from '../../events/OmniboxEvents';
import {IOmniboxDataRow} from '../Omnibox/OmniboxInterface';
import {QueryEvents} from '../../events/QueryEvents';
import {l} from '../../strings/Strings';
import {QueryStateModel} from '../../models/QueryStateModel';
import {analyticsActionCauseList, IAnalyticsTopSuggestionMeta} from '../Analytics/AnalyticsActionListMeta';
import {Initialization} from '../Base/Initialization';
import {$$} from '../../utils/Dom';

export interface IAnalyticsSuggestionsOptions extends ISuggestionForOmniboxOptions {
}

/**
 * This component is used to provide query suggestions based on the most commonly logged queries by a Coveo Analytics service.
 * In order to provide relevant suggestions, they are shown in order of successful document views: thus, queries resulting in no clicks from users or that require refinements are not suggested if better options exist.
 * These suggestions appear in the Omnibox Component. This component is thus highly related to the {@link Analytics} Component.
 * While a user is typing in a query box, he will be able to see and select the most commonly used queries.
 * See also : {@link Omnibox.enableTopQueryAddon}, which does sensibly the same thing, except with less (none, actually) customization option, but easier to setup.
 */
export class AnalyticsSuggestions extends Component {
  static ID = 'AnalyticsSuggestions';
  /**
   * The options for the component
   * @componentOptions
   */
  static options: IAnalyticsSuggestionsOptions = {
    /**
     * The index at which the suggestions should render in the omnibox. Higher value = placed first.<br/>
     * The default value is `52`
     */
    omniboxZIndex: ComponentOptions.buildNumberOption({ defaultValue: 52, min: 0 }),
    headerTitle: ComponentOptions.buildLocalizedStringOption({ defaultValue: l('SuggestedQueries') }),
    /**
     * The number of suggestions that should be requested and displayed in the omnibox.<br/>
     * The default value is `5`
     */
    numberOfSuggestions: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 })
  };

  private suggestionForOmnibox: SuggestionForOmnibox;
  private partialQueries: string[] = [];
  private lastSuggestions: string[] = [];
  private resultsToBuildWith = [];
  private currentlyDisplayedSuggestions: { [suggestion: string]: { element: HTMLElement, pos: number } };

  constructor(element: HTMLElement, public options: IAnalyticsSuggestionsOptions, bindings?: IComponentBindings) {
    super(element, AnalyticsSuggestions.ID, bindings);


    if (this.options && 'omniboxSuggestionOptions' in this.options) {
      this.options = _.extend(this.options, this.options['omniboxSuggestionOptions'])
    }

    this.options = ComponentOptions.initComponentOptions(element, AnalyticsSuggestions, this.options);

    let rowTemplate = _.template(`<div class='magic-box-suggestion coveo-omnibox-selectable coveo-top-analytics-suggestion-row'><%= data %></div>`);
    this.options.onSelect = this.options.onSelect || this.onRowSelection;

    let suggestionStructure: ISuggestionForOmniboxTemplate;
    if (this.searchInterface.isNewDesign()) {
      suggestionStructure = {
        row: rowTemplate
      };
    } else {
      let headerTemplate = _.template(`<div class='coveo-top-analytics-suggestion-header'><span class='coveo-icon-top-analytics'></span><span class='coveo-caption'><%= headerTitle %></span></div>`);
      suggestionStructure = {
        header: { template: headerTemplate, title: this.options.headerTitle },
        row: rowTemplate
      };
    }

    this.suggestionForOmnibox = new SuggestionForOmnibox(suggestionStructure, (value: string, args: IPopulateOmniboxEventArgs) => {
      this.options.onSelect.call(this, value, args);
    });
    this.bind.onRootElement(OmniboxEvents.populateOmnibox, (args: IPopulateOmniboxEventArgs) => this.handlePopulateOmnibox(args));
    this.bind.onRootElement(QueryEvents.querySuccess, () => this.partialQueries = []);
  }

  /**
   * Select a currently displayed suggestion. This means that at least one suggestion must have been returned at least once.
   * The suggestion parameter can either be a number (0 based index of the suggestion to select) or a string that match the suggestion
   * @param suggestion
   */
  public selectSuggestion(suggestion: number);
  public selectSuggestion(suggestion: string);
  public selectSuggestion(suggestion: any) {
    if (this.currentlyDisplayedSuggestions) {
      if (isNaN(suggestion)) {
        if (this.currentlyDisplayedSuggestions[suggestion]) {
          $$(this.currentlyDisplayedSuggestions[suggestion].element).trigger('click');
        }
      } else {
        let currentlySuggested = <{ element: HTMLElement, pos: number }>_.findWhere(<any>this.currentlyDisplayedSuggestions, { pos: suggestion });
        if (currentlySuggested) {
          $$(currentlySuggested.element).trigger('click');
        }
      }
    }
  }

  private handlePopulateOmnibox(args: IPopulateOmniboxEventArgs) {
    Assert.exists(args);

    var promise = new Promise((resolve, reject) => {
      let searchPromise = this.usageAnalytics.getTopQueries({
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
        let element = this.suggestionForOmnibox.buildOmniboxElement(this.resultsToBuildWith, args);
        this.currentlyDisplayedSuggestions = {};
        _.map($$(element).findAll('.coveo-omnibox-selectable'), (selectable, i?) => {
          this.currentlyDisplayedSuggestions[$$(selectable).text()] = {
            element: selectable,
            pos: i
          }
        })
        resolve({
          element: element,
          zIndex: this.options.omniboxZIndex
        })
      });
      searchPromise.catch(() => {
        resolve({
          element: undefined
        })
      });
    })

    args.rows.push({ deferred: promise });
  }

  private onRowSelection(value: string, args: IPopulateOmniboxEventArgs) {
    args.clear();
    args.closeOmnibox();
    this.queryStateModel.set(QueryStateModel.attributesEnum.q, value);
    this.usageAnalytics.logSearchEvent<IAnalyticsTopSuggestionMeta>(analyticsActionCauseList.omniboxAnalytics, {
      partialQueries: this.cleanCustomData(this.partialQueries),
      suggestionRanking: _.indexOf(_.pluck(this.resultsToBuildWith, 'value'), value),
      suggestions: this.cleanCustomData(this.lastSuggestions),
      partialQuery: args.completeQueryExpression.word
    });
    this.queryController.executeQuery();
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
    let reducedToRejectLengthOrLess = [];
    _.reduceRight(toClean, (memo: number, partial: string) => {
      let totalSoFar = memo + partial.length;
      if (totalSoFar <= rejectLength) {
        reducedToRejectLengthOrLess.push(partial);
      }
      return totalSoFar;
    }, 0);
    toClean = reducedToRejectLengthOrLess.reverse();
    let ret = toClean.join(';');

    // analytics service can store max 256 char in a custom event
    // if we're over that, call cleanup again with an arbitrary 10 less char accepted
    if (ret.length >= 256) {
      return this.cleanCustomData(toClean, rejectLength - 10);
    }

    return toClean.join(';');
  }
}
Initialization.registerAutoCreateComponent(AnalyticsSuggestions);
