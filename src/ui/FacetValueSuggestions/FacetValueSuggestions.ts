import 'styling/_FieldSuggestions';
import * as _ from 'underscore';
import { IPopulateOmniboxSuggestionsEventArgs, OmniboxEvents } from '../../events/OmniboxEvents';
import { exportGlobally } from '../../GlobalExports';
import { l } from '../../MiscModules';
import { QueryStateModel } from '../../ModelsModules';
import { $$ } from '../../utils/Dom';
import { DomUtils } from '../../UtilsModules';
import { analyticsActionCauseList, IAnalyticsNoMeta } from '../Analytics/AnalyticsActionListMeta';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IFieldOption } from '../Base/IComponentOptions';
import { Initialization } from '../Base/Initialization';
import { IOmniboxSuggestion, Omnibox } from '../Omnibox/Omnibox';
import { FacetValueSuggestionsProvider, IFacetValueSuggestionRow, IFacetValueSuggestionsProvider } from './FacetValueSuggestionsProvider';

export interface IFacetValueSuggestionsOptions {
  numberOfSuggestions: number;
  field?: IFieldOption;
  isCategoryField?: boolean;
  categoryFieldDelimitingCharacter?: string;
  useQuerySuggestions?: boolean;
  useValueFromSearchbox?: boolean;
  displayEstimateNumberOfResults?: boolean;
  expression?: string;
  templateHelper?: (row: IFacetValueSuggestionRow, omnibox: Omnibox) => string;
}

export interface IQuerySuggestionKeyword {
  text: string;
  html: string;
}

/**
 * This component provides [`Omnibox`]{@link Omnibox} query suggestions scoped to distinct categories based on the values of a specific [`field`]{@link FacetValueSuggestions.options.field}.
 *
 * See @externaldocs [Providing Facet Value Suggestions](https://docs.coveo.com/en/340/#providing-facet-value-suggestions)
 *
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
     * The field on whose values the scoped query suggestions should be based.
     *
     * Specifying a value for this option is required for the component to work.
     *
     * @examples @productcategory
     */
    field: ComponentOptions.buildFieldOption({ required: true }),

    /**
     * The maximum number of suggestions to render in the [`Omnibox`]{@link Omnibox}.
     *
     * **Default:** `5`
     * **Minimum:** `1`
     */
    numberOfSuggestions: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 }),

    /**
     * Whether to get scoped query suggestions from the current Coveo ML query suggestions.
     *
     * **Note:** If this options is set to `true` the [`enableQuerySuggestAddon`]{@link Omnibox.options.enableQuerySuggestAddon} option of the [`Omnibox`]{@link Omnibox.option.enableQuerySuggestAddon} component must be set to `true` as well.
     *
     * **Default:** `true`
     */
    useQuerySuggestions: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Whether to get scoped query suggestions from the current user query entered in the search box.
     *
     * **Default:** `true` if [`useQuerySuggestions`]{@link FacetValueSuggestions.options.useQuerySuggestions} is `false`; `false` otherwise
     */
    useValueFromSearchbox: ComponentOptions.buildBooleanOption({
      postProcessing: (value, options: IFacetValueSuggestionsOptions) => {
        return value || !options.useQuerySuggestions;
      }
    }),

    /**
     * Whether to display an estimate of the number of results for each scoped query suggestions.
     *
     * **Default:** `false`
     *
     * **Notes:**
     * - Setting this option to `true` has no effect when the [`templateHelper`]{@link FacetValueSuggestions.options.templateHelper} options is set.
     * - When displaying scoped query suggestions for a standalone search box whose queries are redirected to a search interface enforcing other filters, the number of results will be inaccurate.
     */
    displayEstimateNumberOfResults: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * The template helper function to execute when rendering each scoped query suggestion.
     *
     * If specified, the function must have the following signature: (row: [IFacetValueSuggestionRow]{@link IFacetValueSuggestionRow}, omnibox: Omnibox) => string
     *
     * If not specified, a default function will be used.
     *
     * **Note:** You cannot set this option directly in the component markup as an HTML attribute. You must either set it:
     * - In the [`init`]{@link init} call of your search interface (see [Passing Component Options in the init Call](https://docs.coveo.com/en/346/#passing-component-options-in-the-init-call)
     * - Before the `init` call, using the [`options`](@link options) top-level function (see [Passing Component Options Before the init Call](https://docs.coveo.com/en/346/#passing-component-options-before-the-init-call)).
     *
     * **Example:**
     *
     * ```javascript
     * Coveo.init(document.getElementById('search'), {
     *   FacetValueSuggestions: {
     *     templateHelper: (row, omnibox) => { return `Searching for <strong>${row.keyword}</strong> in category <em>${row.value}</em>`; }
     *   }
     * })
     * ```
     */
    templateHelper: ComponentOptions.buildCustomOption<(row: IFacetValueSuggestionRow, omnibox: Omnibox) => string>(() => {
      return null;
    }),

    /**
     * Whether the [`field`]{@link FacetValueSuggestions.options.field} option references a multi value field.
     *
     * Setting this option to `true` if appropriate will allow the corresponding [`CategoryFacet`]{@link CategoryFacet} or [`DynamicHierarchicalFacet`]{@link DynamicHierarchicalFacet} component (if present) to properly handle the filter format.
     *
     * See also the [`categoryFieldDelimitingCharacter`]{@link FacetValueSuggestions.options.categoryFieldDelimitingCharacter} option.
     *
     * **Default:** `false`.
     */
    isCategoryField: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * The delimiting character used for the multi value field referenced by the [`field`]{@link field} option, assuming the [`isCategoryField`]{@link FacetValueSuggestions.options.isCategoryField} option is set to `true`.
     *
     * **Default:** `|`.
     *
     * @examples ;, #
     */
    categoryFieldDelimitingCharacter: ComponentOptions.buildStringOption({ defaultValue: '|', depend: 'isCategoryField' }),
    /**
     * Specifies an expression to add when looking for suggestions on the facet values
     *
     * **Example:**
     *
     * `@objecttype==Message`
     *
     */
    expression: ComponentOptions.buildQueryExpressionOption()
  };

  public facetValueSuggestionsProvider: IFacetValueSuggestionsProvider;

  private queryStateFieldFacetId;

  static defaultTemplate(this: FacetValueSuggestions, row: IFacetValueSuggestionRow, omnibox: Omnibox): string {
    const keyword = row.keyword.html;
    const facetValue = DomUtils.highlight(row.value, 'coveo-omnibox-hightlight');
    const details = this.options.displayEstimateNumberOfResults
      ? DomUtils.highlight(
          ` (${l('ResultCount', row.numberOfResults.toString(), row.numberOfResults)})`,
          'coveo-omnibox-suggestion-results-count',
          true
        )
      : '';
    return `${l('KeywordInCategory', keyword, facetValue)}${details}`;
  }

  private static getQuerySuggestionKeywordFromText(text: string): IQuerySuggestionKeyword {
    return {
      text,
      html: DomUtils.highlight(text, 'coveo-omnibox-hightlight')
    };
  }

  /**
   * Creates a new `FacetValueSuggestions` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `FacetValueSuggestions` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(element: HTMLElement, public options: IFacetValueSuggestionsOptions, bindings?: IComponentBindings) {
    super(element, FacetValueSuggestions.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, FacetValueSuggestions, options);

    this.facetValueSuggestionsProvider = new FacetValueSuggestionsProvider(this.queryController, {
      field: <string>this.options.field,
      expression: this.options.expression
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

  private async getQuerySuggestionsKeywords(omnibox: Omnibox): Promise<IQuerySuggestionKeyword[]> {
    if (this.options.useQuerySuggestions && omnibox.suggestionAddon) {
      const suggestions = await omnibox.suggestionAddon.getSuggestion();
      return suggestions.map(({ text, html }) => <IQuerySuggestionKeyword>{ text: text || '', html });
    } else {
      return [];
    }
  }

  private async getFacetValueSuggestions(text: string, omnibox: Omnibox): Promise<IOmniboxSuggestion[]> {
    const wordsToQuery = this.options.useValueFromSearchbox ? [FacetValueSuggestions.getQuerySuggestionKeywordFromText(text)] : [];

    const suggestionsKeywords: IQuerySuggestionKeyword[] = await this.getQuerySuggestionsKeywords(omnibox);
    const allKeywordsToQuery = _.unique(
      wordsToQuery.concat(suggestionsKeywords).filter(keyword => keyword.text != ''),
      keyword => keyword.text
    );

    if (allKeywordsToQuery.length === 0) {
      return [];
    }

    return this.getSuggestionsForWords(allKeywordsToQuery, omnibox);
  }

  private async getSuggestionsForWords(keywordToQuery: IQuerySuggestionKeyword[], omnibox: Omnibox): Promise<IOmniboxSuggestion[]> {
    try {
      const suggestions = await this.facetValueSuggestionsProvider.getSuggestions(keywordToQuery);

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
    omnibox.setText(row.keyword.text);
    // Copy the state here, else it will directly modify queryStateModel.defaultAttributes.fv.
    const fvState: { [key: string]: string[] } = { ...this.queryStateModel.get(QueryStateModel.attributesEnum.fv) };
    const existingValues: string[] = fvState[this.options.field.toString()] || [];

    const valuesToSetInState = this.options.isCategoryField ? row.value.split(this.options.categoryFieldDelimitingCharacter) : [row.value];
    fvState[this.options.field.toString()] = existingValues.concat(valuesToSetInState);

    this.queryStateModel.set(QueryStateModel.attributesEnum.fv, fvState);
    omnibox.magicBox.blur();
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.omniboxField, {});
    this.queryController.executeQuery();
  }
}

Initialization.registerAutoCreateComponent(FacetValueSuggestions);
