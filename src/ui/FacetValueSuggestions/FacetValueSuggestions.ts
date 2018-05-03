import { Omnibox, IOmniboxSuggestion } from '../Omnibox/Omnibox';
import { Component } from '../Base/Component';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { OmniboxEvents, IPopulateOmniboxSuggestionsEventArgs } from '../../events/OmniboxEvents';
import { Initialization } from '../Base/Initialization';
import { analyticsActionCauseList, IAnalyticsNoMeta } from '../Analytics/AnalyticsActionListMeta';
import { $$ } from '../../utils/Dom';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_FieldSuggestions';
import * as _ from 'underscore';
import { SuggestionsCache } from '../../misc/SuggestionsCache';
import { QueryStateModel } from '../../ModelsModules';
import { DomUtils } from '../../UtilsModules';
import { IFacetValueSuggestionRow, FacetValueSuggestionsProvider, IFacetValueSuggestionsProvider } from './FacetValueSuggestionsProvider';
import { l } from '../../MiscModules';

export interface IFacetValueSuggestionsOptions {
  numberOfSuggestions: number;
  field?: IFieldOption;
  useQuerySuggestions?: boolean;
  useValueFromSearchbox?: boolean;
  displayEstimateNumberOfResults?: boolean;
  templateHelper?: (row: IFacetValueSuggestionRow, omnibox: Omnibox) => string;
}

/**
 * The `FieldValueSuggestions` component provides query suggestions based on a particular field values.
 *
 * For example, if you use a `@category` field, this component will provide suggestions for categories that returns results for the given keywords.
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
     * Specifying a value for this option is required for the `FieldValueSuggestions` component to work.
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
     *
     * **Note:**
     * This option requires that the `enableQuerySuggestAddon` is set to `true` in the [`Omnibox`]{@link Omnibox} component.
     */
    useQuerySuggestions: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether to use the current value from the search box to get facet values suggestions.
     *
     * Default value is `true` if [`useQuerySuggestions`]{@link useQuerySuggestions} is disabled, `false` otherwise.
     */
    useValueFromSearchbox: ComponentOptions.buildBooleanOption({
      postProcessing: (value, options: IFacetValueSuggestionsOptions) => {
        return value || !options.useQuerySuggestions;
      }
    }),

    /**
     * Specifies whether to display the number of results in each of the suggestions.
     *
     * Default value is `false`.
     *
     * **Note:**
     * The number of results is an estimate.
     *
     * On a Standalone Search Interface, if you are redirecting on a Search Interface that has different filters,
     *  the number of results on the Standalone Search Interface will be inaccurate.
     *
     * Setting this option has no effect when the `templateHelper` options is set.
     */
    displayEstimateNumberOfResults: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies the helper function to execute when generating suggestions shown to the end user in the
     * [`Omnibox`]{@link Omnibox}.
     *
     * If not specified, a default template will be used.
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
     * var suggestionTemplate = function(row, omnibox) {
     *   return "Searching for " + row.keyword + " in category " + row.value;
     * };
     *
     * // You can set the option in the 'init' call:
     * Coveo.init(document.querySelector("#search"), {
     *    FacetValueSuggestions : {
     *      templateHelper : suggestionTemplate
     *    }
     * });
     *
     * // Or before the 'init' call, using the 'options' top-level function:
     * // Coveo.options(document.querySelector("#search"), {
     * //   FacetValueSuggestions : {
     * //     templateHelper : suggestionTemplate
     * //   }
     * // });
     * ```
     */
    templateHelper: ComponentOptions.buildCustomOption<(row: IFacetValueSuggestionRow, omnibox: Omnibox) => string>(() => {
      return null;
    })
  };

  public fieldValueCache: SuggestionsCache<IFacetValueSuggestionRow[]> = new SuggestionsCache();

  public facetValueSuggestionsProvider: IFacetValueSuggestionsProvider;

  private queryStateFieldFacetId;

  static defaultTemplate(this: FacetValueSuggestions, row: IFacetValueSuggestionRow, omnibox: Omnibox): string {
    const keyword = DomUtils.highlightElement(row.keyword, omnibox.getText(), 'coveo-omnibox-hightlight2');
    const facetValue = DomUtils.highlightElement(row.value, row.value, 'coveo-omnibox-hightlight');
    const details = this.options.displayEstimateNumberOfResults ? ` (${l('ResultCount', row.numberOfResults.toString())})` : '';
    return `${l('KeywordInCategory', keyword, facetValue)}${details}`;
  }

  /**
   * Creates a new `FieldSuggestions` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `FieldSuggestions` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(element: HTMLElement, public options: IFacetValueSuggestionsOptions, bindings?: IComponentBindings) {
    super(element, FacetValueSuggestions.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, FacetValueSuggestions, options);

    this.facetValueSuggestionsProvider = new FacetValueSuggestionsProvider(this.queryController, {
      field: <string>this.options.field
    });
    this.queryStateFieldFacetId = `f:${this.options.field}`;

    if (!this.options.templateHelper) {
      this.options.templateHelper = FacetValueSuggestions.defaultTemplate;
    }

    $$(this.root).on(OmniboxEvents.populateOmniboxSuggestions, (e: Event, args: IPopulateOmniboxSuggestionsEventArgs) => {
      args.suggestions.push(this.getSuggestions(args.omnibox));
    });
  }

  public async getSuggestions(omnibox: Omnibox): Promise<IOmniboxSuggestion[]> {
    if (this.options.numberOfSuggestions == 0) {
      return [];
    }

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

    const suggestionsKeywords: string[] = await this.getQuerySuggestionsKeywords(omnibox);
    const allWordsToQuery = _.unique(wordsToQuery.concat(suggestionsKeywords).filter(value => value != ''));

    if (allWordsToQuery.length === 0) {
      return [];
    }

    return this.getSuggestionsForWords(allWordsToQuery, omnibox);
  }

  private async getSuggestionsForWords(wordsToQuery: string[], omnibox: Omnibox): Promise<IOmniboxSuggestion[]> {
    try {
      const suggestions = await this.fieldValueCache.getSuggestions(`fv${wordsToQuery.join('')}`, () =>
        this.facetValueSuggestionsProvider.getSuggestions(wordsToQuery)
      );

      this.logger.debug('FacetValue Suggestions Results', suggestions);

      const currentSelectedValues: string[] = this.queryStateModel.get(this.queryStateFieldFacetId) || [];
      const filteredSuggestions = suggestions.filter(suggestion =>
        this.isSuggestionRowAlreadyCheckedInFacet(suggestion, currentSelectedValues)
      );
      return this.rankSuggestionRows(filteredSuggestions).map(result => this.mapFacetValueSuggestion(result, omnibox));
    } catch (error) {
      this.logger.error(error);
      return [];
    }
  }

  private isSuggestionRowAlreadyCheckedInFacet(suggestion: IFacetValueSuggestionRow, currentlySelectedValues: string[]): boolean {
    return !currentlySelectedValues.some(value => value == suggestion.value);
  }

  private rankSuggestionRows(suggestions: IFacetValueSuggestionRow[]): IFacetValueSuggestionRow[] {
    const rankedResults = [...suggestions.sort((a, b) => b.score.distanceFromTotalForField - a.score.distanceFromTotalForField)];
    const firstSlice = Math.ceil(this.options.numberOfSuggestions / 2);
    const lastSlice = -Math.floor(this.options.numberOfSuggestions / 2);

    const firstResultsToReturn = rankedResults.splice(0, firstSlice);

    if (lastSlice != 0) {
      const lastResultsToReturn = rankedResults.slice(lastSlice);
      return [...firstResultsToReturn, ...lastResultsToReturn];
    }

    return firstResultsToReturn;
  }

  private mapFacetValueSuggestion(resultToShow: IFacetValueSuggestionRow, omnibox: Omnibox) {
    return <IOmniboxSuggestion>{
      html: this.buildDisplayNameForRow(resultToShow, omnibox),
      onSelect: () => this.onRowSelection(resultToShow, omnibox)
    };
  }

  private buildDisplayNameForRow(row: IFacetValueSuggestionRow, omnibox: Omnibox): string {
    try {
      return this.options.templateHelper.call(this, row, omnibox);
    } catch (ex) {
      this.logger.error('Could not apply template from options for the given row. Will use default template.', ex, row, omnibox);
      return FacetValueSuggestions.defaultTemplate.call(this, row, omnibox);
    }
  }

  private onRowSelection(row: IFacetValueSuggestionRow, omnibox: Omnibox): void {
    omnibox.setText(row.keyword);
    // Copy the state here, else it will directly modify queryStateModel.defaultAttributes.fv.
    const fvState: { [key: string]: string[] } = { ...this.queryStateModel.get(QueryStateModel.attributesEnum.fv) };
    const existingValues: string[] = fvState[this.options.field.toString()] || [];
    fvState[this.options.field.toString()] = existingValues.concat([row.value]);
    this.queryStateModel.set(QueryStateModel.attributesEnum.fv, fvState);
    omnibox.magicBox.blur();
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.omniboxField, {});
    this.queryController.executeQuery();
  }
}

Initialization.registerAutoCreateComponent(FacetValueSuggestions);
