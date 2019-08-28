import { IFacetSearchRequest } from '../rest/Facet/FacetSearchRequest';
import { DynamicFacet } from '../ui/DynamicFacet/DynamicFacet';
import { IFacetSearchResponse } from '../rest/Facet/FacetSearchResponse';
import { FileTypes } from '../ui/Misc/FileTypes';
import { QueryUtils } from '../utils/QueryUtils';
import { IStringMap } from '../rest/GenericParam';
import { DateUtils } from '../utils/DateUtils';

export class FacetSearchController {
  constructor(private facet: DynamicFacet) {}

  private getMonthsValueCaptions() {
    const monthsValueCaptions: IStringMap<string> = {};
    for (let month = 1; month <= 12; month++) {
      const key = `0${month}`.substr(-2);
      monthsValueCaptions[key] = DateUtils.monthToString(month - 1);
    }

    return monthsValueCaptions;
  }

  private addTypesCaptionsIfNecessary(): IStringMap<string> {
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

  private get captions(): IStringMap<string> {
    return {
      ...this.addTypesCaptionsIfNecessary(),
      ...this.facet.options.valueCaption
    };
  }

  public search(terms?: string): Promise<IFacetSearchResponse> {
    const optionalLeadingWildcard = this.facet.options.useLeadingWildcardInFacetSearch ? '*' : '';

    const request: IFacetSearchRequest = {
      field: this.facet.fieldName,
      numberOfValues: this.facet.options.numberOfValues,
      ignoreValues: this.facet.values.allValues,
      captions: this.captions,
      searchContext: this.facet.queryController.getLastQuery(),
      query: `${optionalLeadingWildcard}${terms}*`
    };

    return this.facet.queryController.getEndpoint().facetSearch(request);
  }
}
