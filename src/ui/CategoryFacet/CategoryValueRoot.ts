import { CategoryValueParent, CategoryValue } from './CategoryValue';
import { CategoryFacetTemplates } from './CategoryFacetTemplates';
import { Dom } from '../../utils/Dom';
import { CategoryChildrenValueRenderer } from './CategoryValueChildrenRenderer';
import { CategoryFacet } from './CategoryFacet';
import { IQueryResults } from '../../rest/QueryResults';
import { Utils } from '../../utils/Utils';
import { QueryEvents, IBuildingQueryEventArgs, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { each } from 'underscore';

export class CategoryValueRoot implements CategoryValueParent {
  public isActive = true;
  public categoryChildrenValueRenderer: CategoryChildrenValueRenderer;

  constructor(element: Dom, private categoryFacetTemplates: CategoryFacetTemplates, private categoryFacet: CategoryFacet) {
    this.categoryChildrenValueRenderer = new CategoryChildrenValueRenderer(element, categoryFacetTemplates, this, categoryFacet);
  }

  public buildFromPath(path: string[]) {
    if (Utils.isNonEmptyArray(path)) {
      let positionInQuery: number;
      this.isActive = false;
      this.categoryFacet.bind.oneRootElement<IBuildingQueryEventArgs>(QueryEvents.buildingQuery, args => {
        positionInQuery = this.categoryFacet.categoryFacetQueryController.putCategoryFacetInQueryBuilder(args.queryBuilder, path);
      });
      this.categoryFacet.bind.oneRootElement<IQuerySuccessEventArgs>(QueryEvents.querySuccess, args => {
        const categoryFacetResults = args.results.categoryFacets[positionInQuery];
        if (categoryFacetResults.notImplemented) {
          const errorMessage = 'Category Facets are not supported by your current search endpoint. Disabling this component.';
          this.categoryFacet.logger.error(errorMessage);
          this.categoryFacet.disable();
        } else if (categoryFacetResults.values.length != 0) {
          let currentParentValue: CategoryValueParent = this;
          const categoryFacetParentValues = categoryFacetResults.parentValues;
          each(categoryFacetParentValues, categoryFacetParentValue => {
            currentParentValue = new CategoryValue(
              currentParentValue.categoryChildrenValueRenderer.getListOfChildValues(),
              categoryFacetParentValue.value,
              categoryFacetParentValue.numberOfResults,
              currentParentValue,
              this.categoryFacetTemplates,
              this.categoryFacet
            );
          });
          currentParentValue.categoryChildrenValueRenderer.renderChildren(categoryFacetResults.values);
          currentParentValue.isActive = true;
        } else {
          this.categoryFacet.hide();
        }
      });
    }
  }

  public renderChildren(): Promise<IQueryResults> {
    this.isActive = true;
    return this.categoryFacet.queryController.executeQuery().then(queryResults => {
      if (queryResults.categoryFacets.length == 0) {
        this.categoryFacet.hide();
      }
      return queryResults;
    });
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
}
