import { QueryBuilder } from '../Base/QueryBuilder';
import { Omnibox, IOmniboxSuggestion } from '../Omnibox/Omnibox';
import { Component } from '../Base/Component';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Assert } from '../../misc/Assert';
import { Utils } from '../../utils/Utils';
import { OmniboxEvents, IPopulateOmniboxEventArgs } from '../../events/OmniboxEvents';
import { IIndexFieldValue } from '../../rest/FieldValue';
import { IListFieldValuesRequest } from '../../rest/ListFieldValuesRequest';
import { QueryStateModel } from '../../models/QueryStateModel';
import { Initialization } from '../Base/Initialization';
import { analyticsActionCauseList, IAnalyticsNoMeta } from '../Analytics/AnalyticsActionListMeta';
import { l } from '../../strings/Strings';
import { $$, Dom } from '../../utils/Dom';
import { IStringMap } from '../../rest/GenericParam';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_FieldSuggestions';
import { DomUtils } from '../../UtilsModules';
import { Facet } from '../Facet/Facet';
import {
  IOmniboxSuggestionsOptions,
  IOnSelectSuggestion,
  onSelectionUpdateOmnibox,
  IOmniboxSuggestionBuilder,
  OmniboxSuggestionBuilder
} from '../Misc/OmniboxSuggestion';
import { IOmniboxDataRow } from '../Omnibox/OmniboxInterface';
import { IGroupByRequest } from '../../rest/GroupByRequest';
import { IQueryOptions } from '../../controllers/QueryController';

export interface IOnSelectingFacetValueSuggestion extends IOnSelectSuggestion<IFacetValueSuggestionRow> {}

export interface IFacetValueSuggestionRow {
  score: IFacetValueSuggestionScore;
  value: string;
  numberOfResults: number;
  keyword: string;
}

export interface IFacetValueSuggestionScore {
  total: number;
  distanceFromHighestNumber: number;
  distanceFromTotalForField: number;
}

export interface IFacetValueSuggestionsOptions extends IOmniboxSuggestionsOptions {
  field?: IFieldOption;
  onSelect?: IOnSelectingFacetValueSuggestion;
  useQuerySuggestions?: boolean;
  displayEstimateNumberOfResults?: boolean;
}

export interface IFacetValueSuggestionsResponse {
  responses: IFacetValueBatchResponse[];
  reference: IFacetValueReference;
}

export interface IFacetValueBatchResponse {
  values: IIndexFieldValue[];
  keyword: string;
}

export type IFacetValueReference = {
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
     * Specifies the z-index position at which the suggestions render themselves in the [`Omnibox`]{@link Omnibox}.
     *
     * When there are multiple suggestion providers, components with higher `omniboxZIndex` values render themselves
     * first.
     *
     * Default value is `51`. Minimum value is `0`.
     */
    omniboxZIndex: ComponentOptions.buildNumberOption({ defaultValue: 51, min: 0 }),

    /**
     * Specifies the title of the result suggestions group in the [`Omnibox`]{@link Omnibox} component.
     * If not provided, the component will simply not output any title.
     *
     * Default value is `null`.
     */
    headerTitle: ComponentOptions.buildLocalizedStringOption(),

    /**
     * Specifies the number of suggestions to render in the [`Omnibox`]{@link Omnibox}.
     *
     * Default value is `5`. Minimum value is `1`.
     */
    numberOfSuggestions: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 }),

    /**
     * Specifies whether to also use query suggestions as keywords to get facet values suggestions.
     */
    useQuerySuggestions: ComponentOptions.buildBooleanOption({ defaultValue: false }),

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
    onSelect: ComponentOptions.buildCustomOption<IOnSelectingFacetValueSuggestion>(() => {
      return null;
    })
  };

  private suggestionBuilder: IOmniboxSuggestionBuilder<IFacetValueSuggestionRow>;
  private queryStateFieldFacetId;
  private queryStateFieldValueId;

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

    Assert.check(Utils.isCoveoField(<string>this.options.field), this.options.field + ' is not a valid field');

    this.queryStateFieldFacetId = `f:${this.options.field}`;
    this.queryStateFieldValueId = `fv:${this.options.field}`;
    if (this.queryStateModel.getAttributes()[this.queryStateFieldValueId] === undefined) {
      this.queryStateModel.registerNewAttribute(this.queryStateFieldValueId, []);
    }

    this.options.onSelect = this.options.onSelect || this.onRowSelection;
    this.suggestionBuilder = new OmniboxSuggestionBuilder();

    this.bind.onRootElement(OmniboxEvents.populateOmnibox, (args: IPopulateOmniboxEventArgs) => this.handlePopulateOmnibox(args));
  }

  private handlePopulateOmnibox(populateOmniboxEventArgs: IPopulateOmniboxEventArgs) {
    Assert.exists(populateOmniboxEventArgs);

    const wordsToQuery = [populateOmniboxEventArgs.completeQueryExpression.word];

    const promise: Promise<IOmniboxDataRow> = this.getQuerySuggestionsKeywords()
      .then(suggestions => {
        return this.listFieldValuesBatch(wordsToQuery.concat(suggestions));
      })
      .then((response: IFacetValueSuggestionsResponse) => {
        const resultsToShow = this.filterCurrentlySelectedValuesFromResults(response.responses, response.reference);

        if (resultsToShow.length > 0) {
          const container: Dom = $$('div');

          if (this.options.headerTitle) {
            container.append(this.suggestionBuilder.createHeader(this.options.headerTitle));
          }

          const resultsElements = resultsToShow
            .map(resultToShow => {
              return this.suggestionBuilder.createResultRow(
                resultToShow,
                this.buildDisplayNameForRow(resultToShow, populateOmniboxEventArgs),
                populateOmniboxEventArgs,
                this.options.onSelect.bind(this)
              );
            })
            .forEach(element => container.append(element));

          return <IOmniboxDataRow>{
            element: container.el,
            zIndex: this.options.omniboxZIndex
          };
        } else {
          return {
            element: undefined
          };
        }
      })
      .catch(() => {
        return {
          element: undefined
        };
      });
    populateOmniboxEventArgs.rows.push({
      deferred: promise
    });
  }

  private buildDisplayNameForRow(row: IFacetValueSuggestionRow, populateOmniboxEventArgs: IPopulateOmniboxEventArgs): string {
    const keyword = DomUtils.highlightElement(row.keyword, populateOmniboxEventArgs.currentQueryExpression.word);
    const facetValue = DomUtils.highlightElement(row.value, row.value);
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
      const highestNumber = Math.max(...filteredResults.map(result => result.numberOfResults));

      const suggestionRows = filteredResults.map(indexFieldValue => {
        return <IFacetValueSuggestionRow>{
          numberOfResults: indexFieldValue.numberOfResults,
          keyword: fieldResponse.keyword,
          value: indexFieldValue.value,
          score: this.computeScoreForSuggestionRow(indexFieldValue, fieldTotalReference, highestNumber)
        };
      });
      return allValues.concat(suggestionRows);
    }, []);

    this.logger.debug('FacetValue Suggestions Results', resultsWithoutSelectedValues);

    return resultsWithoutSelectedValues.sort((a, b) => b.score.total - a.score.total).slice(0, this.options.numberOfSuggestions);
  }

  private getQuerySuggestionsKeywords(): Promise<string[]> {
    const omnibox = this.searchInterface.getComponents<Omnibox>(Omnibox.ID)[0];
    if (omnibox.suggestionAddon) {
      return omnibox.suggestionAddon.getSuggestion().then(suggestions => suggestions.map(s => s.text));
    } else {
      return Promise.resolve();
    }
  }

  private computeScoreForSuggestionRow(
    fieldValue: IIndexFieldValue,
    reference: IFacetValueReference,
    highestNumber: number
  ): IFacetValueSuggestionScore {
    const totalNumberForFieldValue = reference.fieldsTotal[fieldValue.value] || reference.smallestTotal;
    const distanceFromHighestNumber: number = (highestNumber - fieldValue.numberOfResults) / highestNumber * 100;
    const distanceFromTotalForField: number = fieldValue.numberOfResults / totalNumberForFieldValue * 100;
    return {
      distanceFromHighestNumber: distanceFromHighestNumber,
      distanceFromTotalForField: distanceFromTotalForField,
      total: distanceFromHighestNumber + distanceFromTotalForField
    };
  }

  private listFieldValuesBatch(valuesToSearch: string[]): Promise<IFacetValueSuggestionsResponse> {
    // The reference request will be used to get the maximum number of values for a given facet value.
    const referenceValuesRequests = this.buildReferenceFieldValueRequest();
    const queryParts = this.getQueryToExecuteParts();
    const suggestionValuesRequests = valuesToSearch.map(value => this.buildListFieldValueRequest(queryParts.concat(value).join(' ')));
    const requests = suggestionValuesRequests.concat(referenceValuesRequests);
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

  private onRowSelection(row: IFacetValueSuggestionRow, args: IPopulateOmniboxEventArgs) {
    // We need to use `set` here, or `clear()` will trigger a query with an empty `q` parameters.
    // Then the `QueryboxQueryParameters.queryIsBlocked` kicks in and forbids every other `q` update from the same stack.
    args.set(row.keyword);
    args.closeOmnibox();
    args.clearSuggestions();
    this.queryStateModel.set(this.queryStateFieldValueId, [row.value]);
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.omniboxField, {});
    this.queryController.executeQuery();
  }

  private buildListFieldValueRequest(queryToExecute: string): IListFieldValuesRequest {
    return {
      field: <string>this.options.field,
      ignoreAccents: true,
      sortCriteria: 'occurrences',
      maximumNumberOfValues: this.options.numberOfSuggestions,
      queryOverride: queryToExecute
    };
  }

  private buildReferenceFieldValueRequest(): IListFieldValuesRequest {
    return {
      field: <string>this.options.field,
      sortCriteria: 'occurrences'
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
