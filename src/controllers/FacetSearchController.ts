import { IFacetSearchRequest } from '../rest/Facet/FacetSearchRequest';
import { DynamicFacet } from '../ui/DynamicFacet/DynamicFacet';
import { IFacetSearchResponse } from '../rest/Facet/FacetSearchResponse';
import { FileTypes } from '../ui/Misc/FileTypes';
import { QueryUtils } from '../utils/QueryUtils';

export class FacetSearchController {
  constructor(private facet: DynamicFacet) {}

  private addTypesCaptionsIfNecessary() {
    const field = this.facet.options.field.toLowerCase();
    const isFileType = QueryUtils.isStratusAgnosticField(field, '@filetype');
    const isObjectType = QueryUtils.isStratusAgnosticField(field, '@objecttype');

    if (isFileType || isObjectType) {
      return FileTypes.getFileTypeCaptions();
    }

    return {};
  }

  private get captions() {
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
