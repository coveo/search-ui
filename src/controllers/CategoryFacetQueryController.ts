import { CategoryFacet } from '../ui/CategoryFacet/CategoryFacet';
import { ICategoryFacetValue } from '../rest/CategoryFacetValue';
import { QueryBuilder } from '../ui/Base/QueryBuilder';
import { ICategoryFacetsRequest } from '../rest/CategoryFacetsRequest';

export class CategoryFacetQueryController {
  constructor(private categoryFacet: CategoryFacet) {}

  public async getValues(path: string[]): Promise<ICategoryFacetValue[]> {
    const queryBuilder = new QueryBuilder();
    this.putCategoryFacetInQueryBuilder(queryBuilder, path);
    const { categoryFacets } = await this.categoryFacet.queryController.getEndpoint().search(queryBuilder.build());
    return categoryFacets[0].values;
  }

  public putCategoryFacetInQueryBuilder(queryBuilder: QueryBuilder, path) {
    queryBuilder.categoryFacets.push({
      field: this.categoryFacet.options.field as string,
      path
    } as ICategoryFacetsRequest);
  }
}
