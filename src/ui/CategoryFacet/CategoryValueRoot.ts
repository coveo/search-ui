import { CategoryValueParent, CategoryValue } from './CategoryValue';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { Dom } from '../../utils/Dom';
import { CategoryChildrenValueRenderer } from './CategoryValueChildrenRenderer';
import { CategoryFacet } from './CategoryFacet';
import { QueryEvents, IBuildingQueryEventArgs, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { each, last } from 'underscore';
import { ICategoryFacetValue } from '../../rest/CategoryFacetValue';

export class CategoryValueRoot implements CategoryValueParent {
  private positionInQuery: number;
  private activePath: string[] = [];
  public categoryChildrenValueRenderer: CategoryChildrenValueRenderer;

  constructor(element: Dom, categoryFacetTemplates: CategoryFacetTemplates, private categoryFacet: CategoryFacet) {
    this.categoryChildrenValueRenderer = new CategoryChildrenValueRenderer(element, categoryFacetTemplates, this, categoryFacet);
    this.categoryFacet.bind.onRootElement<IBuildingQueryEventArgs>(QueryEvents.buildingQuery, args => this.handleBuildingQuery(args));
    this.categoryFacet.bind.onRootElement<IQuerySuccessEventArgs>(QueryEvents.querySuccess, args => this.handleQuerySuccess(args));
  }

  public setActivePath(path: string[]) {
    this.activePath = path;
  }

  public handleBuildingQuery(args: IBuildingQueryEventArgs) {
    this.positionInQuery = this.categoryFacet.categoryFacetQueryController.putCategoryFacetInQueryBuilder(
      args.queryBuilder,
      this.activePath
    );
  }

  public handleQuerySuccess(args: IQuerySuccessEventArgs) {
    const categoryFacetResults = args.results.categoryFacets[this.positionInQuery];
    if (categoryFacetResults.notImplemented) {
      this.notImplementedError();
    } else if (categoryFacetResults.values.length != 0) {
      this.categoryFacet.show();
      this.clear();
      let currentParentValue: CategoryValueParent;
      currentParentValue = this;
      each(categoryFacetResults.parentValues, categoryFacetParentValue => {
        currentParentValue = currentParentValue.renderAsParent(categoryFacetParentValue);
      });
      currentParentValue.categoryChildrenValueRenderer.renderChildren(categoryFacetResults.values);
    } else if (categoryFacetResults.parentValues.length != 0) {
      let currentParentValue: CategoryValueParent = this;
      each(categoryFacetResults.parentValues.slice(0, categoryFacetResults.parentValues.length - 1), categoryFacetParentValue => {
        currentParentValue = currentParentValue.renderAsParent(categoryFacetParentValue);
      });
      currentParentValue.renderChildren([last(categoryFacetResults.parentValues)]);
    } else {
      this.categoryFacet.hide();
    }
  }

  public renderChildren(values: ICategoryFacetValue[]) {
    this.categoryChildrenValueRenderer.renderChildren(values);
  }

  public renderAsParent(value: ICategoryFacetValue) {
    return this.categoryChildrenValueRenderer.renderAsParent(value);
  }

  public hideChildrenExceptOne(categoryValue: CategoryValue) {
    this.categoryChildrenValueRenderer.clearChildrenExceptOne(categoryValue);
  }

  public getPath(partialPath: string[] = []) {
    return partialPath;
  }

  public getChildren() {
    return this.categoryChildrenValueRenderer.getChildren();
  }

  public clear() {
    this.categoryChildrenValueRenderer.getListOfChildValues().detach();
    this.categoryChildrenValueRenderer.clearChildren();
  }

  private notImplementedError() {
    const errorMessage = 'Category Facets are not supported by your current search endpoint. Disabling this component.';
    this.categoryFacet.logger.error(errorMessage);
    this.categoryFacet.disable();
  }
}
