import { Dom } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryValue, CategoryValueParent } from './CategoryValue';
import { CategoryFacet } from './CategoryFacet';
import { QueryEvents, IBuildingQueryEventArgs, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { ICategoryFacetsRequest } from '../../rest/CategoryFacetsRequest';
import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';

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
    this.categoryFacet.bind.onRootElement<IBuildingQueryEventArgs>(QueryEvents.buildingQuery, args =>
      this.putCategoryFacetInQueryBuilder(args)
    );
    this.categoryFacet.bind.onRootElement<IQuerySuccessEventArgs>(QueryEvents.querySuccess, args => this.handleQuerySuccess(args));
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

  private handleQuerySuccess(args: IQuerySuccessEventArgs) {
    this.renderChildren(args.results.categoryFacets[this.positionInQuery].values);
  }

  public async renderChildren(values: ICategoryFacetValue[]) {
    if (!this.listOfChildValues) {
      this.listOfChildValues = this.categoryFacetTemplates.buildListRoot();
    }
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    this.clearChildren();
    this.element.append(this.listOfChildValues.el);

    values.forEach(value => {
      const categoryValue = new CategoryValue(
        this.listOfChildValues,
        value.value,
        this.categoryValueParent,
        this.categoryFacetTemplates,
        this.categoryFacet
      );
      categoryValue.render();
      this.children.push(categoryValue);
    });
  }

  private putCategoryFacetInQueryBuilder(buildingQueryEventArgs: IBuildingQueryEventArgs) {
    this.positionInQuery = buildingQueryEventArgs.queryBuilder.categoryFacets.length;
    buildingQueryEventArgs.queryBuilder.categoryFacets.push({
      field: this.categoryFacet.options.field as string,
      path: this.categoryValueParent.getPath()
    } as ICategoryFacetsRequest);
  }
}
