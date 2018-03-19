import { CategoryFacet } from '../ui/CategoryFacet/CategoryFacet';
import { ICategoryFacetValue } from '../rest/CategoryFacetValue';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { ICategoryFacetsRequest } from '../rest/CategoryFacetsRequest';
import { QueryEvents, IBuildingQueryEventArgs, IQuerySuccessEventArgs, IQueryErrorEventArgs } from '../events/QueryEvents';

export class CategoryFacetQueryController {
  constructor(private categoryFacet: CategoryFacet) {}

  public async getValues(path: string[], isFirstQuery: Boolean = false): Promise<ICategoryFacetValue[]> {
    let positionInQuery;
    this.categoryFacet.bind.oneRootElement<IBuildingQueryEventArgs>(QueryEvents.buildingQuery, args => {
      positionInQuery = args.queryBuilder.categoryFacets.length;
      this.putCategoryFacetInQueryBuilder(args.queryBuilder, path);
    });

    const valuesPromise = new Promise<ICategoryFacetValue[]>((resolve, reject) => {
      this.categoryFacet.bind.oneRootElement<IQuerySuccessEventArgs>(QueryEvents.querySuccess, args => {
        const categoryFacetResults = args.results.categoryFacets[positionInQuery];
        if (categoryFacetResults.notImplemented) {
          const errorMessage = 'Category Facets are not supported by your current search endpoint. Disabling this component.';
          this.categoryFacet.logger.error(errorMessage);
          this.categoryFacet.disable();
          reject(errorMessage);
        } else {
          resolve(args.results.categoryFacets[positionInQuery].values);
        }
      });

      this.categoryFacet.bind.oneRootElement<IQueryErrorEventArgs>(QueryEvents.queryError, args => {
        reject(args.error);
      });
    });
    if (!isFirstQuery) {
      this.categoryFacet.queryController.executeQuery();
    }
    return valuesPromise;
  }

  public putCategoryFacetInQueryBuilder(queryBuilder: QueryBuilder, path): number {
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
}
