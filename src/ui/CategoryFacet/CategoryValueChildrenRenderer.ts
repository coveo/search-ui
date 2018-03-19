import { Dom } from '../../utils/Dom';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { CategoryValue, CategoryValueParent } from './CategoryValue';
import { CategoryFacet } from './CategoryFacet';
import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';
import { IBuildingQueryEventArgs, IQuerySuccessEventArgs, QueryEvents } from '../../events/QueryEvents';

export class CategoryChildrenValueRenderer {
  private children: CategoryValue[] = [];
  private listOfChildValues: Dom;
  private positionInQuery: number;

  constructor(
    private element: Dom,
    private categoryFacetTemplates: CategoryFacetTemplates,
    private categoryValue: CategoryValueParent,
    private categoryFacet: CategoryFacet
  ) {
    this.categoryFacet.bind.onRootElement<IBuildingQueryEventArgs>(QueryEvents.buildingQuery, args => this.handleBuildingQuery(args));
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
    this.element.removeClass('coveo-active-category-facet-parent');
  }

  public clearChildren() {
    this.element.removeClass('coveo-active-category-facet-parent');
    this.children.forEach(child => {
      child.clear();
    });
    this.children = [];
  }

  public async renderChildren(values: ICategoryFacetValue[]) {
    if (!this.listOfChildValues) {
      this.listOfChildValues = this.categoryFacetTemplates.buildListRoot();
    }

    this.clearChildren();
    this.element.append(this.listOfChildValues.el);

    values.forEach(value => {
      const categoryValue = new CategoryValue(
        this.listOfChildValues,
        value.value,
        value.numberOfResults,
        this.categoryValue,
        this.categoryFacetTemplates,
        this.categoryFacet
      );
      categoryValue.render();
      this.element.addClass('coveo-active-category-facet-parent');
      this.children.push(categoryValue);
    });
    this.categoryFacet.hideWaitAnimation();
  }
  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    if (this.categoryValue.isActive) {
      this.positionInQuery = args.queryBuilder.categoryFacets.length;
      this.categoryFacet.categoryFacetQueryController.putCategoryFacetInQueryBuilder(args.queryBuilder, this.categoryValue.getPath());
    }
  }

  private handleQuerySuccess(args: IQuerySuccessEventArgs) {
    if (this.categoryValue.isActive) {
      const categoryFacetResults = args.results.categoryFacets[this.positionInQuery];
      if (categoryFacetResults.notImplemented) {
        const errorMessage = 'Category Facets are not supported by your current search endpoint. Disabling this component.';
        this.categoryFacet.logger.error(errorMessage);
        this.categoryFacet.disable();
      } else {
        this.renderChildren(categoryFacetResults.values);
      }
    }
  }
}
