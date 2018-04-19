import { CategoryFacet } from '../ui/CategoryFacet/CategoryFacet';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { ICategoryFacetsRequest } from '../rest/CategoryFacetsRequest';
import { ICategoryFacetValue } from '../rest/CategoryFacetValue';
import { IGroupByRequest } from '../rest/GroupByRequest';
import { AllowedValuesPatternType } from '../rest/AllowedValuesPatternType';
import { clone } from 'underscore';

export class CategoryFacetQueryController {
  constructor(private categoryFacet: CategoryFacet) {}

  public putCategoryFacetInQueryBuilder(queryBuilder: QueryBuilder, path: string[]): number {
    const positionInQuery = queryBuilder.categoryFacets.length;
    if (path.length != 0) {
      queryBuilder.advancedExpression.addFieldExpression(this.categoryFacet.options.field as string, '==', [path.join('|')]);
    }
    queryBuilder.categoryFacets.push({
      field: this.categoryFacet.options.field as string,
      path
    } as ICategoryFacetsRequest);
    return positionInQuery;
  }

  public async searchFacetValues(value: string): Promise<ICategoryFacetValue[]> {
    let lastQuery = clone(this.categoryFacet.queryController.getLastQuery());
    if (!lastQuery) {
      lastQuery = new QueryBuilder().build();
    }

    const groupByRequest: IGroupByRequest = {
      allowedValues: [`*${value}*`],
      allowedValuesPatternType: AllowedValuesPatternType.Wildcards,
      maximumNumberOfValues: this.categoryFacet.options.numberOfResultsInFacetSearch,
      field: this.categoryFacet.options.field as string
    };
    lastQuery.groupBy = [groupByRequest];
    return this.categoryFacet.queryController
      .getEndpoint()
      .search(lastQuery)
      .then(queryResults => {
        return queryResults.groupByResults[0].values as ICategoryFacetValue[];
      });
  }
}
