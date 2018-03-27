import { IIndexFieldValue } from '../../rest/FieldValue';
import { IListFieldValuesRequest } from '../../rest/ListFieldValuesRequest';
import { QueryController, QueryStateModel } from '../../Core';

export interface IFacetValueSuggestionRow {
  score: IFacetValueSuggestionScore;
  value: string;
  numberOfResults: number;
  keyword: string;
}

interface IFacetValueSuggestionScore {
  distanceFromTotalForField: number;
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

export interface IFacetValueSuggestionsProviderOptions {
  field: string;
}

export interface IFacetValueSuggestionsProvider {
  getSuggestions(valuesToSearch: string[]): Promise<IFacetValueSuggestionRow[]>;
}

export class FacetValueSuggestionsProvider {
  private queryStateFieldFacetId;

  constructor(
    private queryController: QueryController,
    private queryStateModel: QueryStateModel,
    private options: IFacetValueSuggestionsProviderOptions
  ) {
    this.queryStateFieldFacetId = `f:${this.options.field}`;
  }

  public async getSuggestions(valuesToSearch: string[]): Promise<IFacetValueSuggestionRow[]> {
    const fieldsToQuery = await this.getFieldValuesToQuery(valuesToSearch);
    return this.getResultsExcludingSelectedValue(fieldsToQuery.responses, fieldsToQuery.reference);
  }

  private getResultsExcludingSelectedValue(
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

    return resultsWithoutSelectedValues;
  }

  private async getFieldValuesToQuery(valuesToSearch: string[]): Promise<IFacetValueSuggestionsResponse> {
    // The reference request will be used to get the maximum number of values for a given facet value.
    const referenceValuesRequest = this.buildReferenceFieldValueRequest();
    const queryParts = this.getQueryToExecuteParts();
    const suggestionValuesRequests = valuesToSearch.map(value => this.buildListFieldValueRequest(queryParts.concat(value).join(' ')));
    const requests = [].concat(suggestionValuesRequests).concat(referenceValuesRequest);
    const values = await this.queryController.getEndpoint().listFieldValuesBatch({
      batch: requests
    });

    const reference = this.computeReferenceFromBatch(values.pop());
    const responses: IFacetValueBatchResponse[] = values.map((value, i) => {
      return <IFacetValueBatchResponse>{
        keyword: valuesToSearch[i],
        values: value
      };
    });

    return <IFacetValueSuggestionsResponse>{
      responses,
      reference
    };
  }

  private computeScoreForSuggestionRow(fieldValue: IIndexFieldValue, reference: IFacetValueReference): IFacetValueSuggestionScore {
    const totalNumberForFieldValue = reference.fieldsTotal[fieldValue.value] || reference.smallestTotal;
    const distanceFromTotalForField: number = (totalNumberForFieldValue - fieldValue.numberOfResults) / totalNumberForFieldValue * 100;
    return {
      distanceFromTotalForField
    };
  }

  private computeReferenceFromBatch(batch: IIndexFieldValue[]): IFacetValueReference {
    const fieldsTotal = {};
    batch.forEach(value => (fieldsTotal[value.value] = value.numberOfResults));
    return {
      fieldsTotal: fieldsTotal,
      smallestTotal: batch[batch.length - 1].numberOfResults
    };
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
    const expressionWithParenthesis = '([^)]*)';
    const expressionAsSingleValue = '[^ ]*';
    return expression
      .replace(new RegExp(`${field}==${expressionWithParenthesis}`, 'gi'), '')
      .replace(new RegExp(`${field}==${expressionAsSingleValue}`, 'gi'), '');
  }
}
