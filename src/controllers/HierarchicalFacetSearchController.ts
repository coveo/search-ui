import { IDynamicHierarchicalFacet } from '../ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { FacetSearchType, IFacetSearchRequest } from '../rest/Facet/FacetSearchRequest';
import { IFacetSearchResponse } from '../rest/Facet/FacetSearchResponse';
import { QueryUtils, DateUtils } from '../Core';
import { FileTypes } from '../ui/Misc/FileTypes';

export class HierarchicalFacetSearchController {
  constructor(private facet: IDynamicHierarchicalFacet) {}

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

  public search(terms?: string): Promise<IFacetSearchResponse> {
    const request: IFacetSearchRequest = {
      field: this.facet.fieldName,
      type: FacetSearchType.hierarchical,
      numberOfValues: this.facet.options.numberOfValues,
      ignorePaths: [this.facet.values.selectedPath],
      basePath: this.facet.options.basePath,
      captions: this.captions,
      searchContext: this.facet.queryController.getLastQuery(),
      delimitingCharacter: this.facet.options.delimitingCharacter,
      query: terms.length ? `*${terms}*` : '*'
    };

    return this.facet.queryController.getEndpoint().facetSearch(request);
  }
}
