import { Dom } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryValue, CategoryJsonValues, CategoryValueParent } from './CategoryValue';
import { CategoryFacet } from './CategoryFacet';
import { QueryEvents, IBuildingQueryEventArgs, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { ICategoryFacetsRequest } from '../../rest/CategoryFacetsRequest';

export class CategoryChildrenValueRenderer {
  private children = [];
  private listOfChildValues: Dom;
  private positionInQuery: number;

  constructor(
    private element: Dom,
    private categoryFacetTemplates: CategoryFacetTemplates,
    private categoryValueParent: CategoryValueParent,
    private categoryFacet: CategoryFacet
  ) {
    this.categoryFacet.bind.onRootElement<IBuildingQueryEventArgs>(QueryEvents.buildingQuery, () => this.putCategoryFacetInQueryBuilder);
    this.categoryFacet.bind.onRootElement<IQuerySuccessEventArgs>(QueryEvents.querySuccess, () => this.renderChildren);
  }

  public clearChildrenExceptOne(except: CategoryValue) {
    const newChildren = [];
    this.children.forEach(categoryValue => {
      if (except !== categoryValue) {
        categoryValue.clear();
      } else {
        newChildren.push(categoryValue);
      }
    });
    this.children = newChildren;
  }

  public clearChildren() {
    this.children.forEach(child => {
      child.clear();
    });
    this.children = [];
  }

  public async renderChildren(querySuccessEventArgs: IQuerySuccessEventArgs) {
    if (!this.listOfChildValues) {
      this.listOfChildValues = this.categoryFacetTemplates.buildListRoot();
    }
    const values = querySuccessEventArgs.
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const { values } = await fetch('http://localhost:8085/api', {
      headers,
      method: 'POST',
      body: JSON.stringify({ path: this.categoryValueParent.getPath() })
    })
      .then<CategoryJsonValues>(response => response.json())
      .catch(e => {
        console.log(e);
        return { values: [] } as CategoryJsonValues;
      });

    this.clearChildren();
    this.element.append(this.listOfChildValues.el);

    values.forEach(value => {
      const categoryValue = new CategoryValue(this.listOfChildValues, value, this.categoryValueParent, this.categoryFacetTemplates);
      categoryValue.render();
      this.children.push(categoryValue);
    });
  }

  private putCategoryFacetInQueryBuilder(buildingQueryEventArgs: IBuildingQueryEventArgs) {
    this.positionInQuery = buildingQueryEventArgs.queryBuilder.categoryFacets.length;
    buildingQueryEventArgs.queryBuilder.categoryFacets.push({
      field: this.categoryFacet.options.field,
      path: this.categoryValueParent.getPath()
    } as ICategoryFacetsRequest);
  }
}
