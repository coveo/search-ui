import { CategoryFacet } from '../ui/CategoryFacet/CategoryFacet';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { ICategoryFacetRequest } from '../rest/CategoryFacetRequest';
import { IGroupByRequest } from '../rest/GroupByRequest';
import { AllowedValuesPatternType } from '../rest/AllowedValuesPatternType';
import { IGroupByValue } from '../rest/GroupByValue';
import { Utils } from '../utils/Utils';

export class CategoryFacetQueryController {
  constructor(private categoryFacet: CategoryFacet) {}

  public putCategoryFacetInQueryBuilder(queryBuilder: QueryBuilder, path: string[], maximumNumberOfValues: number): number {
    const positionInQuery = queryBuilder.categoryFacets.length;
    if (path.length != 0) {
      queryBuilder.advancedExpression.addFieldExpression(this.categoryFacet.options.field as string, '==', [
        path.join(this.categoryFacet.options.delimitingCharacter)
      ]);
    }
    const categoryFacetsRequest: ICategoryFacetRequest = {
      field: this.categoryFacet.options.field as string,
      path,
      injectionDepth: this.categoryFacet.options.injectionDepth,
      maximumNumberOfValues,
      delimitingCharacter: this.categoryFacet.options.delimitingCharacter
    };
    queryBuilder.categoryFacets.push(categoryFacetsRequest);
    return positionInQuery;
  }

  public async searchFacetValues(value: string): Promise<IGroupByValue[]> {
    let lastQuery = { ...this.categoryFacet.queryController.getLastQuery() };

    const groupByRequest: IGroupByRequest = {
      allowedValues: [`*${value}*`],
      allowedValuesPatternType: AllowedValuesPatternType.Wildcards,
      maximumNumberOfValues: this.categoryFacet.options.numberOfResultsInFacetSearch,
      field: this.categoryFacet.options.field as string,
      sortCriteria: 'occurrences',
      injectionDepth: this.categoryFacet.options.injectionDepth
    };

    lastQuery.groupBy = [groupByRequest];
    lastQuery.categoryFacets.splice(this.categoryFacet.positionInQuery, 1);
    const results = await this.categoryFacet.queryController.getEndpoint().search(lastQuery);
    return results.groupByResults[0].values;
  }

  public addDebugGroupBy(queryBuilder: QueryBuilder, value: string) {
    queryBuilder.groupByRequests.push({
      field: this.categoryFacet.options.field as string,
      allowedValues: [`.*${Utils.escapeRegexCharacter(value)}.*`],
      allowedValuesPatternType: AllowedValuesPatternType.Regex
    });
  }
}
