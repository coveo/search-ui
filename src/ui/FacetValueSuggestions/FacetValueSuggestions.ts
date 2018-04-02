import { Omnibox, IOmniboxSuggestion } from '../Omnibox/Omnibox';
import { Component } from '../Base/Component';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Assert } from '../../misc/Assert';
import { Utils } from '../../utils/Utils';
import { OmniboxEvents, IPopulateOmniboxSuggestionsEventArgs } from '../../events/OmniboxEvents';
import { Initialization } from '../Base/Initialization';
import { analyticsActionCauseList, IAnalyticsNoMeta } from '../Analytics/AnalyticsActionListMeta';
import { $$ } from '../../utils/Dom';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_FieldSuggestions';
import * as _ from 'underscore';
import { SuggestionsCache } from '../../Misc/SuggestionsCache';
import { QueryStateModel } from '../../ModelsModules';
import { DomUtils } from '../../UtilsModules';
import { IFacetValueSuggestionRow, FacetValueSuggestionsProvider, IFacetValueSuggestionsProvider } from './FacetValueSuggestionsProvider';

export interface IFacetValueSuggestionsOptions {
  numberOfSuggestions: number;
  field?: IFieldOption;
  onSelect?: () => void;
  useQuerySuggestions?: boolean;
  useValueFromSearchbox?: boolean;
  displayEstimateNumberOfResults?: boolean;
}

/**
 * The `FieldSuggestions` component provides query suggestions based on a particular facet field. For example, you could
 * use this component to provide auto-complete suggestions while the end user is typing the title of an item.
 *
 * The query suggestions provided by this component appear in the [`Omnibox`]{@link Omnibox} component.
 */
export class FacetValueSuggestions extends Component {
  static ID = 'FacetValueSuggestions';

  static doExport = () => {
    exportGlobally({
      FacetValueSuggestions: FacetValueSuggestions
    });
  };

  /**
   * @componentOptions
   */
  static options: IFacetValueSuggestionsOptions = {
    /**
     * Specifies the facet field from which to provide suggestions.
     *
     * Specifying a value for this option is required for the `FieldSuggestions` component to work.
     */
    field: ComponentOptions.buildFieldOption({ required: true }),

    /**
     * Specifies the number of suggestions to render in the [`Omnibox`]{@link Omnibox}.
     *
     * Default value is `5`. Minimum value is `1`.
     */
    numberOfSuggestions: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 }),

    /**
     * Specifies whether to use query suggestions as keywords to get facet values suggestions.
     *
     * Default value is `true`.
     */
    useQuerySuggestions: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether to use the current value from the search box to get facet values suggestions.
     *
     * Default value is `false`.
     */
    useValueFromSearchbox: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies whether to display the number of results in the suggestion.
     *
     * Default value is `false`.
     *
     * **Note:**
     * The number of results is an estimate.
     *
     * On a Standalone Search Interface, if you are redirecting on a Search Interface that has different filters,
     *  the number of results on the Standalone Search Interface will be inaccurate.
     */
    displayEstimateNumberOfResults: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies the event handler function to execute when the end user selects a suggested value in the
     * [`Omnibox`]{@link Omnibox}. By default, the query box text is replaced by what the end user selected and a new
     * query is executed. You can, however, replace this default behavior by providing a callback function to execute
     * when the value is selected.
     *
     * **Note:**
     * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
     * > [`init`]{@link init} call of your search interface (see
     * > [Components - Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
     * > or before the `init` call, using the `options` top-level function (see
     * > [Components - Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
     *
     * **Example:**
     *
     * ```javascript
     *
     * var myOnSelectFunction = function(selectedValue, populateOmniboxEventArgs) {
     *
     *   // Close the suggestion list when the user clicks a suggestion.
     *   populateOmniboxEventArgs.closeOmnibox();
     *
     *   // Search for matching title results in the default endpoint.
     *   Coveo.SearchEndpoint.endpoints["default"].search({
     *     q: "@title=='" + selectedValue + "'"
     *   }).done(function(results) {
     *
     *     // If more than one result is found, select a result that matches the selected title.
     *     var foundResult = Coveo._.find(results.results, function(result) {
     *       return selectedValue == result.raw.title;
     *     });
     *
     *     // Open the found result in the current window, or log an error.
     *     if (foundResult) {
     *       window.location = foundResult.clickUri;
     *     }
     *     else {
     *       new Coveo.Logger.warn("Selected suggested result '" + selectedValue + "' not found.");
     *     }
     *   });
     * };
     *
     * // You can set the option in the 'init' call:
     * Coveo.init(document.querySelector("#search"), {
     *    FieldSuggestions : {
     *      onSelect : myOnSelectFunction
     *    }
     * });
     *
     * // Or before the 'init' call, using the 'options' top-level function:
     * // Coveo.options(document.querySelector("#search"), {
     * //   FieldSuggestions : {
     * //     onSelect : myOnSelectFunction
     * //   }
     * // });
     * ```
     */
    onSelect: ComponentOptions.buildCustomOption<() => void>(() => {
      return null;
    })
  };

  public fieldValueCache: SuggestionsCache<IFacetValueSuggestionRow[]> = new SuggestionsCache();

  public facetValueSuggestionsProvider: IFacetValueSuggestionsProvider;

  /**
   * Creates a new `FieldSuggestions` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `FieldSuggestions` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(element: HTMLElement, public options: IFacetValueSuggestionsOptions, bindings?: IComponentBindings) {
    super(element, FacetValueSuggestions.ID, bindings);

    this.facetValueSuggestionsProvider = new FacetValueSuggestionsProvider(this.queryController, this.queryStateModel, {
      field: <string>this.options.field
    });

    this.options = ComponentOptions.initComponentOptions(element, FacetValueSuggestions, options);

    Assert.check(Utils.isCoveoField(<string>this.options.field), `${this.options.field} is not a valid field`);

    $$(this.root).on(OmniboxEvents.populateOmniboxSuggestions, (e: Event, args: IPopulateOmniboxSuggestionsEventArgs) => {
      args.suggestions.push(this.getSuggestions(args.omnibox));
    });
  }

  public async getSuggestions(omnibox: Omnibox): Promise<IOmniboxSuggestion[]> {
    const text = omnibox.getText();

    const suggestions: IOmniboxSuggestion[] = await this.getFacetValueSuggestions(text, omnibox);

    return suggestions || [];
  }

  private async getQuerySuggestionsKeywords(omnibox: Omnibox): Promise<string[]> {
    if (this.options.useQuerySuggestions && omnibox.suggestionAddon) {
      const suggestions = (await omnibox.suggestionAddon.getSuggestion()) || [];
      return suggestions.map(s => s.text);
    } else {
      return [];
    }
  }

  private async getFacetValueSuggestions(text: string, omnibox: Omnibox): Promise<IOmniboxSuggestion[]> {
    const wordsToQuery = this.options.useValueFromSearchbox ? [text] : [];

    const suggestions: string[] = await this.getQuerySuggestionsKeywords(omnibox);
    const allWordsToQuery = _.unique(wordsToQuery.concat(suggestions));
    try {
      const suggestions = await this.fieldValueCache.getSuggestions(`fv${allWordsToQuery.join('')}`, () =>
        this.facetValueSuggestionsProvider.getSuggestions(allWordsToQuery)
      );

      this.logger.debug('FacetValue Suggestions Results', suggestions);

      return this.rankSuggestionRows(suggestions).map(result => this.mapFacetValueSuggestion(result, omnibox));
    } catch (error) {
      console.error(error, this);
      return [];
    }
  }

  private rankSuggestionRows(suggestions: IFacetValueSuggestionRow[]): IFacetValueSuggestionRow[] {
    const rankedResults = suggestions.sort((a, b) => b.score.distanceFromTotalForField - a.score.distanceFromTotalForField);
    const preciseResults = rankedResults.splice(0, Math.ceil(this.options.numberOfSuggestions / 2));
    const broadResults = rankedResults.slice(-1, Math.floor(this.options.numberOfSuggestions / 2));

    return [].concat(preciseResults).concat(broadResults);
  }

  private mapFacetValueSuggestion(resultToShow: IFacetValueSuggestionRow, omnibox: Omnibox) {
    return <IOmniboxSuggestion>{
      html: this.buildDisplayNameForRow(resultToShow, omnibox),
      onSelect: () => this.onRowSelection(resultToShow, omnibox)
    };
  }

  private buildDisplayNameForRow(row: IFacetValueSuggestionRow, omnibox: Omnibox): string {
    const keyword = DomUtils.highlightElement(row.keyword, omnibox.getText(), 'coveo-omnibox-hightlight2');
    const facetValue = DomUtils.highlightElement(row.value, row.value, 'coveo-omnibox-hightlight');
    const details = this.options.displayEstimateNumberOfResults ? ` (${row.numberOfResults} results)` : '';
    return `${keyword} in ${facetValue}${details}`;
  }

  private onRowSelection(row: IFacetValueSuggestionRow, omnibox: Omnibox): void {
    omnibox.setText(row.keyword);
    // Use .extendDeep here, else it will modify queryStateModel.defaultAttributes.fv.
    const fvState: { [key: string]: string[] } = Utils.extendDeep({}, this.queryStateModel.get(QueryStateModel.attributesEnum.fv));
    const existingValues: string[] = fvState[this.options.field.toString()] || [];
    fvState[this.options.field.toString()] = existingValues.concat([row.value]);
    this.queryStateModel.set(QueryStateModel.attributesEnum.fv, fvState);
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.omniboxField, {});
    this.queryController.executeQuery();
  }
}

Initialization.registerAutoCreateComponent(FacetValueSuggestions);
