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
    this.addQueryFilter(queryBuilder, path);
    this.addCategoryFacetRequest(queryBuilder, path, maximumNumberOfValues);
    return positionInQuery;
  }

  public async searchFacetValues(value: string, numberOfValues: number): Promise<IGroupByValue[]> {
    const lastQuery = { ...this.categoryFacet.queryController.getLastQuery() };

    const groupByRequest: IGroupByRequest = {
      allowedValues: [this.getAllowedValuesPattern(value)],
      allowedValuesPatternType: AllowedValuesPatternType.Wildcards,
      maximumNumberOfValues: numberOfValues,
      field: this.categoryFacet.options.field as string,
      sortCriteria: 'occurrences',
      injectionDepth: this.categoryFacet.options.injectionDepth
    };

    lastQuery.groupBy = [groupByRequest];
    lastQuery.categoryFacets.splice(this.categoryFacet.positionInQuery, 1);
    const results = await this.categoryFacet.queryController.getEndpoint().search(lastQuery);

    const sortByNumberOfResultsThenPathLength = (firstGroupByValue: IGroupByValue, secondGroupByValue: IGroupByValue) => {
      if (firstGroupByValue.numberOfResults == secondGroupByValue.numberOfResults) {
        return firstGroupByValue.value.length - secondGroupByValue.value.length;
      }
      return secondGroupByValue.numberOfResults - firstGroupByValue.numberOfResults;
    };

    return results.groupByResults[0].values.sort(sortByNumberOfResultsThenPathLength);
  }

  public addDebugGroupBy(queryBuilder: QueryBuilder, value: string) {
    queryBuilder.groupByRequests.push({
      field: this.categoryFacet.options.field as string,
      allowedValues: [`.*${Utils.escapeRegexCharacter(value)}.*`],
      allowedValuesPatternType: AllowedValuesPatternType.Regex
    });
  }

  private shouldAddFilterToQuery(path: string[]) {
    return path.length != 0 && !Utils.arrayEqual(path, this.categoryFacet.options.basePath);
  }

  private addQueryFilter(queryBuilder: QueryBuilder, path: string[]) {
    if (this.shouldAddFilterToQuery(path)) {
      queryBuilder.advancedExpression.addFieldExpression(this.categoryFacet.options.field as string, '==', [
        path.join(this.categoryFacet.options.delimitingCharacter)
      ]);
    }
  }

  private addCategoryFacetRequest(queryBuilder: QueryBuilder, path: string[], maximumNumberOfValues: number) {
    const categoryFacetsRequest: ICategoryFacetRequest = {
      field: this.categoryFacet.options.field as string,
      path,
      injectionDepth: this.categoryFacet.options.injectionDepth,
      maximumNumberOfValues,
      delimitingCharacter: this.categoryFacet.options.delimitingCharacter
    };
    queryBuilder.categoryFacets.push(categoryFacetsRequest);
  }

  private getAllowedValuesPattern(value: string) {
    const basePath = this.categoryFacet.options.basePath;
    const delimiter = this.categoryFacet.options.delimitingCharacter;

    if (Utils.isNonEmptyArray(basePath)) {
      return `${basePath.join(delimiter)}${delimiter}*${value}*`;
    }
    return `*${value}*`;
  }
}
