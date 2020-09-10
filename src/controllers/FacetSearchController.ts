import { IFacetSearchResponse } from '../rest/Facet/FacetSearchResponse';
import { FileTypes } from '../ui/Misc/FileTypes';
import { QueryUtils } from '../utils/QueryUtils';
import { DateUtils } from '../utils/DateUtils';
import { IDynamicFacet } from '../ui/DynamicFacet/IDynamicFacet';
import { IFacetSearchRequest } from '../rest/Facet/FacetSearchRequest';

export class FacetSearchController {
  private terms = '';
  private pageCount = 1;
  private numberOfValuesMultiplier = 3;

  public moreValuesAvailable = true;

  constructor(private facet: IDynamicFacet) {}

  private getMonthsValueCaptions() {
    const monthsValueCaptions: Record<string, string> = {};
    for (let month = 1; month <= 12; month++) {
      const key = `0${month}`.substr(-2);
      monthsValueCaptions[key] = DateUtils.monthToString(month - 1);
    }

    return monthsValueCaptions;
  }

  private addTypesCaptionsIfNecessary(): Record<string, string> {
    const field = this.facet.options.field.toLowerCase();
    const isFileType = QueryUtils.isStratusAgnosticField(field, '@filetype');
    const isObjectType = QueryUtils.isStratusAgnosticField(field, '@objecttype');
    const isMonth = QueryUtils.isStratusAgnosticField(field, '@month');

    if (isFileType || isObjectType) {
      return FileTypes.getFileTypeCaptions();
    }

    if (isMonth) {
      return this.getMonthsValueCaptions();
    }

    return {};
  }

  private get captions(): Record<string, string> {
    return {
      ...this.addTypesCaptionsIfNecessary(),
      ...this.facet.options.valueCaption
    };
  }

  private get numberOfValues() {
    return this.facet.values.allValues.length * this.numberOfValuesMultiplier * this.pageCount;
  }

  private get request(): IFacetSearchRequest {
    const optionalLeadingWildcard = this.facet.options.useLeadingWildcardInFacetSearch ? '*' : '';
    return {
      field: this.facet.fieldName,
      numberOfValues: this.numberOfValues,
      ignoreValues: this.facet.values.activeValues.map(value => value.value),
      captions: this.captions,
      searchContext: this.facet.queryController.getLastQuery(),
      query: `${optionalLeadingWildcard}${this.terms}*`
    };
  }

  private async triggerRequest() {
    const response = await this.facet.queryController.getEndpoint().facetSearch(this.request);
    this.moreValuesAvailable = response.moreValuesAvailable;
    return response;
  }

  public search(terms: string): Promise<IFacetSearchResponse> {
    this.terms = terms;
    this.pageCount = 1;
    return this.triggerRequest();
  }

  public fetchMoreResults(): Promise<IFacetSearchResponse> {
    this.pageCount++;
    return this.triggerRequest();
  }
}
