import { Omnibox, IOmniboxSuggestion } from '../Omnibox/Omnibox';
import { Component } from '../Base/Component';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Assert } from '../../misc/Assert';
import { Utils } from '../../utils/Utils';
import { OmniboxEvents, IPopulateOmniboxSuggestionsEventArgs } from '../../events/OmniboxEvents';
import { IIndexFieldValue } from '../../rest/FieldValue';
import { IListFieldValuesRequest } from '../../rest/ListFieldValuesRequest';
import { Initialization } from '../Base/Initialization';
import { analyticsActionCauseList, IAnalyticsNoMeta } from '../Analytics/AnalyticsActionListMeta';
import { $$ } from '../../utils/Dom';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_FieldSuggestions';
import { DomUtils } from '../../UtilsModules';
import * as _ from 'underscore';
import { SuggestionsCache } from '../Misc/SuggestionsCache';

interface IFacetValueSuggestionRow {
  score: IFacetValueSuggestionScore;
  value: string;
  numberOfResults: number;
  keyword: string;
}

interface IFacetValueSuggestionScore {
  distanceFromTotalForField: number;
}

export interface IFacetValueSuggestionsOptions {
  numberOfSuggestions: number;
  field?: IFieldOption;
  onSelect?: () => void;
  useQuerySuggestions?: boolean;
  useValueFromSearchbox?: boolean;
  displayEstimateNumberOfResults?: boolean;
}

interface IFacetValueSuggestionsResponse {
  responses: IFacetValueBatchResponse[];
  reference: IFacetValueReference;
}

interface IFacetValueBatchResponse {
  values: IIndexFieldValue[];
  keyword: string;
}

type IFacetValueReference = {
  fieldsTotal: { [value: string]: number };
  smallestTotal: number;
};

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
     */
    useQuerySuggestions: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether to use the current value from the search box to get facet values suggestions.
     */
    useValueFromSearchbox: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies whether to display the number of results in the suggestion.
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

  private queryStateFieldFacetId;
  private queryStateFieldValueId;
  private cache: SuggestionsCache = new SuggestionsCache();

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

    Assert.check(Utils.isCoveoField(<string>this.options.field), `${this.options.field} is not a valid field`);

    this.queryStateFieldFacetId = `f:${this.options.field}`;
    this.queryStateFieldValueId = `fv:${this.options.field}`;
    if (this.queryStateModel.getAttributes()[this.queryStateFieldValueId] === undefined) {
      this.queryStateModel.registerNewAttribute(this.queryStateFieldValueId, []);
    }

    $$(this.root).on(OmniboxEvents.populateOmniboxSuggestions, (e: Event, args: IPopulateOmniboxSuggestionsEventArgs) => {
      args.suggestions.push(this.getSuggestion(args.omnibox));
    });
  }

  public getSuggestion(omnibox: Omnibox): Promise<IOmniboxSuggestion[]> {
    const text = omnibox.getText();

    return this.cache.getSuggestions(text, () => this.getFacetValueSuggestions(text, omnibox));
  }

  private getFacetValueSuggestions(text: string, omnibox: Omnibox): Promise<IOmniboxSuggestion[]> {
    const wordsToQuery = this.options.useValueFromSearchbox ? [text] : [];

    const promise: Promise<IOmniboxSuggestion[]> = this.getQuerySuggestionsKeywords(omnibox)
      .then(suggestions => {
        return this.listFieldValuesBatch(_.unique(wordsToQuery.concat(suggestions)));
      })
      .then((response: IFacetValueSuggestionsResponse) => {
        return this.filterCurrentlySelectedValuesFromResults(response.responses, response.reference).map(resultToShow => {
          return <IOmniboxSuggestion>{
            html: this.buildDisplayNameForRow(resultToShow, omnibox),
            onSelect: () => this.onRowSelection(resultToShow, omnibox)
          };
        });
      })
      .catch(() => []);
    return promise;
  }

  private buildDisplayNameForRow(row: IFacetValueSuggestionRow, omnibox: Omnibox): string {
    const keyword = DomUtils.highlightElement(row.keyword, omnibox.getText(), 'coveo-omnibox-hightlight2');
    const facetValue = DomUtils.highlightElement(row.value, row.value, 'coveo-omnibox-hightlight');
    const details = this.options.displayEstimateNumberOfResults ? ` (${row.numberOfResults} results)` : '';
    return `${keyword} in ${facetValue}${details}`;
  }

  private filterCurrentlySelectedValuesFromResults(
    fieldResponses: IFacetValueBatchResponse[],
    fieldTotalReference: IFacetValueReference
  ): IFacetValueSuggestionRow[] {
    const currentSelectedValues: string[] = this.queryStateModel.get(this.queryStateFieldFacetId) || [];
    const resultsWithoutSelectedValues: IFacetValueSuggestionRow[] = fieldResponses.reduce((allValues, fieldResponse) => {
      // Remove suggestions that are already checked.
      const filteredResults = fieldResponse.values.filter(result => !currentSelectedValues.some(value => value == result.value));

      const suggestionRows = filteredResults.map(indexFieldValue => {
        return <IFacetValueSuggestionRow>{
          numberOfResults: indexFieldValue.numberOfResults,
          keyword: fieldResponse.keyword,
          value: indexFieldValue.value,
          score: this.computeScoreForSuggestionRow(indexFieldValue, fieldTotalReference)
        };
      });
      return allValues.concat(suggestionRows);
    }, []);

    this.logger.debug('FacetValue Suggestions Results', resultsWithoutSelectedValues);

    const rankedResults = resultsWithoutSelectedValues.sort(
      (a, b) => b.score.distanceFromTotalForField - a.score.distanceFromTotalForField
    );
    const preciseResults = rankedResults.splice(0, Math.ceil(this.options.numberOfSuggestions / 2));
    const broadResults = rankedResults.slice(-1, Math.floor(this.options.numberOfSuggestions / 2));

    return [].concat(preciseResults).concat(broadResults);
  }

  private getQuerySuggestionsKeywords(omnibox: Omnibox): Promise<string[]> {
    if (this.options.useQuerySuggestions && omnibox.suggestionAddon) {
      const suggestions = omnibox.suggestionAddon.getSuggestion();
      return suggestions ? suggestions.then(suggestions => suggestions.map(s => s.text)) : Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }

  private computeScoreForSuggestionRow(fieldValue: IIndexFieldValue, reference: IFacetValueReference): IFacetValueSuggestionScore {
    const totalNumberForFieldValue = reference.fieldsTotal[fieldValue.value] || reference.smallestTotal;
    const distanceFromTotalForField: number = (totalNumberForFieldValue - fieldValue.numberOfResults) / totalNumberForFieldValue * 100;
    return {
      distanceFromTotalForField: distanceFromTotalForField
    };
  }

  private listFieldValuesBatch(valuesToSearch: string[]): Promise<IFacetValueSuggestionsResponse> {
    // The reference request will be used to get the maximum number of values for a given facet value.
    const referenceValuesRequest = this.buildReferenceFieldValueRequest();
    const queryParts = this.getQueryToExecuteParts();
    const suggestionValuesRequests = valuesToSearch.map(value => this.buildListFieldValueRequest(queryParts.concat(value).join(' ')));
    const requests = [].concat(suggestionValuesRequests).concat(referenceValuesRequest);
    return this.queryController
      .getEndpoint()
      .listFieldValuesBatch({
        batch: requests
      })
      .then(values => {
        const reference = this.computeReferenceFromBatch(values.pop());
        const remainingResponses: IFacetValueBatchResponse[] = values.map((value, i) => {
          return <IFacetValueBatchResponse>{
            keyword: valuesToSearch[i],
            values: value
          };
        });
        return <IFacetValueSuggestionsResponse>{
          responses: remainingResponses,
          reference: reference
        };
      });
  }

  private computeReferenceFromBatch(batch: IIndexFieldValue[]): IFacetValueReference {
    const reference: IFacetValueReference = {
      fieldsTotal: {},
      smallestTotal: batch[batch.length - 1].numberOfResults
    };
    batch.forEach(value => (reference.fieldsTotal[value.value] = value.numberOfResults));
    return reference;
  }

  private onRowSelection(row: IFacetValueSuggestionRow, omnibox: Omnibox): void {
    omnibox.setText(row.keyword);
    /*args.closeOmnibox();
    args.clearSuggestions();*/
    this.queryStateModel.set(this.queryStateFieldValueId, [row.value]);
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.omniboxField, {});
    this.queryController.executeQuery();
  }

  private buildListFieldValueRequest(queryToExecute: string): IListFieldValuesRequest {
    return {
      field: <string>this.options.field,
      ignoreAccents: true,
      maximumNumberOfValues: 3,
      queryOverride: queryToExecute
    };
  }

  private buildReferenceFieldValueRequest(): IListFieldValuesRequest {
    return {
      field: <string>this.options.field
    };
  }

  private getQueryToExecuteParts(): string[] {
    const lastQuery = this.queryController.getLastQuery();
    const aqWithoutCurrentField =
      lastQuery && lastQuery.aq ? this.removeFieldExpressionFromExpression(this.options.field.toString(), lastQuery.aq) : '';

    return [aqWithoutCurrentField, lastQuery.cq].filter(part => !!part);
  }

  private removeFieldExpressionFromExpression(field: string, expression: string): string {
    return expression.replace(new RegExp(`${field}==([^)]*)`, 'gi'), '').replace(new RegExp(`${field}==[^ ]*`, 'gi'), '');
  }
}

Initialization.registerAutoCreateComponent(FacetValueSuggestions);
