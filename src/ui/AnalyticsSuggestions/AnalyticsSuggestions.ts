import { ISuggestionForOmniboxOptions, SuggestionForOmnibox, ISuggestionForOmniboxTemplate } from '../Misc/SuggestionForOmnibox';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Component } from '../Base/Component';
import { Assert } from '../../misc/Assert';
import { OmniboxEvents, IPopulateOmniboxEventArgs } from '../../events/OmniboxEvents';
import { QueryEvents } from '../../events/QueryEvents';
import { l } from '../../strings/Strings';
import { QueryStateModel } from '../../models/QueryStateModel';
import { analyticsActionCauseList, IAnalyticsTopSuggestionMeta } from '../Analytics/AnalyticsActionListMeta';
import { Initialization } from '../Base/Initialization';
import { $$ } from '../../utils/Dom';
import { StandaloneSearchInterface } from '../SearchInterface/SearchInterface';
import { IStringMap } from '../../rest/GenericParam';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';

export interface IAnalyticsSuggestionsOptions extends ISuggestionForOmniboxOptions {}

/**
 * The AnalyticsSuggestion component provides query suggestions based on the queries that a Coveo Analytics service most
 * commonly logs.
 *
 * This component orders possible query suggestions by their respective number of successful item views, thus
 * prioritizing the most relevant query suggestions. Consequently, when better options are available, this component
 * does not suggest queries resulting in no clicks from users or requiring refinements.
 *
 * The query suggestions appear in the {@link Omnibox} Component. The AnalyticsSuggestion component strongly
 * relates to the {@link Analytics} component. While a user is typing in a query box, the AnalyticsSuggestion component
 * allows them to see and select the most commonly used and relevant queries.
 *
 * @deprecated This component is exposed for legacy reasons. If possible, you should avoid using this component.
 * Instead, you should use the [`Omnibox`]{@link Omnibox}
 * [`enableQuerySuggesAddon`]{@link Omnibox.options.enableQuerySuggestAddon} option.
 */
export class AnalyticsSuggestions extends Component {
  static ID = 'AnalyticsSuggestions';

  static doExport() {
    exportGlobally({
      AnalyticsSuggestions: AnalyticsSuggestions
    });
  }

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IAnalyticsSuggestionsOptions = {
    /**
     * Specifies the z-index position at which the query suggestions render themselves in the {@link Omnibox}
     * component. Higher values are placed first.
     *
     * Default value is `52` and minimum value is `0`.
     */
    omniboxZIndex: ComponentOptions.buildNumberOption({ defaultValue: 52, min: 0 }),

    /**
     * Specifies the title of the query suggestions group in the {@link Omnibox} component. This option is not available
     * when using the default Lightning Friendly Theme (see
     * [Lightning Friendly Theme](https://developers.coveo.com/x/Y4EAAg)).
     *
     * Default value is the localized string for `"Suggested Queries"`.
     */
    headerTitle: ComponentOptions.buildLocalizedStringOption({ defaultValue: l('SuggestedQueries') }),

    /**
     * Specifies the number of query suggestions to request and display in the {@link Omnibox} component.
     *
     * Default value is `5` and minimum value is `1`.
     */
    numberOfSuggestions: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 })
  };

  private suggestionForOmnibox: SuggestionForOmnibox;
  private partialQueries: string[] = [];
  private lastSuggestions: string[] = [];
  private resultsToBuildWith = [];
  private currentlyDisplayedSuggestions: { [suggestion: string]: { element: HTMLElement; pos: number } };

  /**
   * Creates a new AnalyticsSuggestions component.
   *
   * Also binds event handlers so that when a user selects a suggestion, an `omniboxFromLink` usage analytics event is
   * logged if the suggestion comes from a standalone search box, or an `omniboxAnalytics` usage analytics
   * event is logged otherwise.
   *
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the AnalyticsSuggestions component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(element: HTMLElement, public options: IAnalyticsSuggestionsOptions, bindings?: IComponentBindings) {
    super(element, AnalyticsSuggestions.ID, bindings);

    if (this.options && 'omniboxSuggestionOptions' in this.options) {
      this.options = _.extend(this.options, this.options['omniboxSuggestionOptions']);
    }

    this.options = ComponentOptions.initComponentOptions(element, AnalyticsSuggestions, this.options);

    let rowTemplate = (toRender: IStringMap<any>) => {
      let rowElement = $$('div', {
        className: 'magic-box-suggestion coveo-omnibox-selectable coveo-top-analytics-suggestion-row'
      });
      if (toRender['data']) {
        rowElement.el.innerHTML = toRender['data'];
      }
      return rowElement.el.outerHTML;
    };

    this.options.onSelect = this.options.onSelect || this.onRowSelection;

    let suggestionStructure: ISuggestionForOmniboxTemplate = {
      row: rowTemplate
    };

    this.suggestionForOmnibox = new SuggestionForOmnibox(
      suggestionStructure,
      (value: string, args: IPopulateOmniboxEventArgs) => {
        this.options.onSelect.call(this, value, args);
      },
      (value: string, args: IPopulateOmniboxEventArgs) => {
        this.onRowTab.call(this, value, args);
      }
    );
    this.bind.onRootElement(OmniboxEvents.populateOmnibox, (args: IPopulateOmniboxEventArgs) => this.handlePopulateOmnibox(args));
    this.bind.onRootElement(QueryEvents.querySuccess, () => (this.partialQueries = []));
  }

  /**
   * Selects a currently displayed query suggestion. This implies that at least one suggestion must have been returned
   * at least once. The suggestion parameter can either be a number (0-based index position of the query suggestion to
   * select) or a string that matches the suggestion.
   *
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
        let currentlySuggested = <{ element: HTMLElement; pos: number }>_.findWhere(<any>this.currentlyDisplayedSuggestions, {
          pos: suggestion
        });
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
        this.resultsToBuildWith = _.map(results, result => {
          return {
            value: result
          };
        });
        this.lastSuggestions = results;
        if (!_.isEmpty(this.resultsToBuildWith) && args.completeQueryExpression.word != '') {
          this.partialQueries.push(args.completeQueryExpression.word);
        }
        let element = this.suggestionForOmnibox.buildOmniboxElement(this.resultsToBuildWith, args);
        this.currentlyDisplayedSuggestions = {};
        if (element) {
          _.map($$(element).findAll('.coveo-omnibox-selectable'), (selectable, i?) => {
            this.currentlyDisplayedSuggestions[$$(selectable).text()] = {
              element: selectable,
              pos: i
            };
          });
        }
        resolve({
          element: element,
          zIndex: this.options.omniboxZIndex
        });
      });
      searchPromise.catch(() => {
        resolve({
          element: undefined
        });
      });
    });

    args.rows.push({ deferred: promise });
  }

  private onRowSelection(value: string, args: IPopulateOmniboxEventArgs) {
    args.clear();
    args.closeOmnibox();
    this.queryStateModel.set(QueryStateModel.attributesEnum.q, value);
    this.usageAnalytics.logSearchEvent<IAnalyticsTopSuggestionMeta>(this.getOmniboxAnalyticsEventCause(), {
      partialQueries: this.cleanCustomData(this.partialQueries),
      suggestionRanking: _.indexOf(_.pluck(this.resultsToBuildWith, 'value'), value),
      suggestions: this.cleanCustomData(this.lastSuggestions),
      partialQuery: args.completeQueryExpression.word
    });
    this.queryController.executeQuery();
  }

  private onRowTab(value: string, args: IPopulateOmniboxEventArgs) {
    args.clear();
    args.closeOmnibox();
    this.queryStateModel.set(QueryStateModel.attributesEnum.q, `${value}`);
    this.usageAnalytics.logCustomEvent<IAnalyticsTopSuggestionMeta>(
      this.getOmniboxAnalyticsEventCause(),
      {
        partialQueries: this.cleanCustomData(this.partialQueries),
        suggestionRanking: _.indexOf(_.pluck(this.resultsToBuildWith, 'value'), value),
        suggestions: this.cleanCustomData(this.lastSuggestions),
        partialQuery: args.completeQueryExpression.word
      },
      this.element
    );
  }

  private cleanCustomData(toClean: string[], rejectLength = 256) {
    // Filter out only consecutive values that are the identical
    toClean = _.compact(
      _.filter(toClean, (partial: string, pos?: number, array?: string[]) => {
        return pos === 0 || partial !== array[pos - 1];
      })
    );

    // Custom dimensions cannot be an array in analytics service: Send a string joined by ; instead.
    // Need to replace ;
    toClean = _.map(toClean, partial => {
      return partial.replace(/;/g, '');
    });

    // Reduce right to get the last X words that adds to less then rejectLength
    let reducedToRejectLengthOrLess = [];
    _.reduceRight(
      toClean,
      (memo: number, partial: string) => {
        let totalSoFar = memo + partial.length;
        if (totalSoFar <= rejectLength) {
          reducedToRejectLengthOrLess.push(partial);
        }
        return totalSoFar;
      },
      0
    );
    toClean = reducedToRejectLengthOrLess.reverse();
    let ret = toClean.join(';');

    // analytics service can store max 256 char in a custom event
    // if we're over that, call cleanup again with an arbitrary 10 less char accepted
    if (ret.length >= 256) {
      return this.cleanCustomData(toClean, rejectLength - 10);
    }

    return toClean.join(';');
  }

  private getOmniboxAnalyticsEventCause() {
    if (this.searchInterface instanceof StandaloneSearchInterface) {
      return analyticsActionCauseList.omniboxFromLink;
    }
    return analyticsActionCauseList.omniboxAnalytics;
  }
}
Initialization.registerAutoCreateComponent(AnalyticsSuggestions);
