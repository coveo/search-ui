import { Dom } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryValue, CategoryValueParent } from './CategoryValue';
import { CategoryFacet } from './CategoryFacet';
import { QueryEvents, IBuildingQueryEventArgs, IQuerySuccessEventArgs } from '../../events/QueryEvents';
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
    this.categoryFacet.bind.onRootElement<IBuildingQueryEventArgs>(QueryEvents.buildingQuery, args => {
      this.positionInQuery = args.queryBuilder.categoryFacets.length;
      this.categoryFacet.categoryFacetQueryController.putCategoryFacetInQueryBuilder(args.queryBuilder, this.categoryValueParent.getPath());
    });
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
    const categoryFacetsResult = args.results.categoryFacets[this.positionInQuery];
    if (categoryFacetsResult.notImplemented) {
      this.categoryFacet.logger.error('Category Facets are not supported by your current search endpoint. Disabling this component.');
      this.categoryFacet.disable();
      return;
    }
    this.renderChildren(categoryFacetsResult.values);
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
}
