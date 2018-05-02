import { CategoryFacet } from '../ui/CategoryFacet/CategoryFacet';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { ICategoryFacetsRequest } from '../rest/CategoryFacetsRequest';
import { IGroupByRequest } from '../rest/GroupByRequest';
import { AllowedValuesPatternType } from '../rest/AllowedValuesPatternType';
import { IGroupByValue } from '../rest/GroupByValue';

export class CategoryFacetQueryController {
  constructor(private categoryFacet: CategoryFacet) {}

  public putCategoryFacetInQueryBuilder(queryBuilder: QueryBuilder, path: string[], numberOfValues: number): number {
    const positionInQuery = queryBuilder.categoryFacets.length;
    if (path.length != 0) {
      queryBuilder.advancedExpression.addFieldExpression(this.categoryFacet.options.field as string, '==', [path.join('|')]);
    }
    queryBuilder.categoryFacets.push({
      field: this.categoryFacet.options.field as string,
      path,
      injectionDepth: this.categoryFacet.options.injectionDepth,
      maximumNumberOfValues: numberOfValues
    } as ICategoryFacetsRequest);
    return positionInQuery;
  }

  public searchFacetValues(value: string): Promise<IGroupByValue[]> {
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
    return this.categoryFacet.queryController
      .getEndpoint()
      .search(lastQuery)
      .then(queryResults => {
        return queryResults.groupByResults[0].values;
      });
  }
}
