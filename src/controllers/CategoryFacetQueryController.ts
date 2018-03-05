import { CategoryFacet } from '../ui/CategoryFacet/CategoryFacet';
import { ICategoryFacetValue } from '../rest/CategoryFacetValue';
import { QueryBuilder } from '../ui/Base/QueryBuilder';

export class CategoryFacetQueryController {
  constructor(private categoryFacet: CategoryFacet) {}

  public async getValues(path: string[]): Promise<ICategoryFacetValue[]> {
    const queryBuilder = new QueryBuilder();
    queryBuilder.categoryFacets.push({
      field: this.categoryFacet.options.field as string,
      path: path
    });
    const { categoryFacets } = await this.categoryFacet.queryController.getEndpoint().search(queryBuilder.build());
    return categoryFacets[0].values;
  }
}
