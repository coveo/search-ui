import { Utils } from './Utils';
import { QueryStateModel, QueryEvents, Component, $$ } from '../Core';
import { ComponentEvents } from '../ui/Base/Component';
import { MODEL_EVENTS } from '../models/Model';
import { ComponentsTypes } from './ComponentsTypes';

export interface IDependentFacet {
  reset: () => void;
  toggleDependentFacet: (dependentFacet: Component) => void;
  element: HTMLElement;
  root: HTMLElement;
  dependsOn: string;
  id: string;
  queryStateModel: QueryStateModel;
  bind: ComponentEvents;
}

export class DependsOnManager {
  constructor(private facet: IDependentFacet) {
    this.facet.bind.onRootElement(QueryEvents.newQuery, () => this.handleNewQuery());
    this.updateVisibilityBasedOnDependsOn();
  }

  public listenToParentIfDependentFacet() {
    if (!this.isDependentFacet) {
      return;
    }
    this.facet.bind.onQueryState(MODEL_EVENTS.CHANGE, undefined, () => this.resetIfdependableFacetHasNoSelectedValues());
  }

  public updateVisibilityBasedOnDependsOn() {
    if (!this.isDependentFacet) {
      return;
    }

    if ($$(this.facet.element).hasClass('coveo-facet-empty')) {
      return;
    }

    this.dependableFacetHasSelectedValues ? $$(this.facet.element).show() : $$(this.facet.element).hide();
  }

  private get isDependentFacet() {
    return Utils.isNonEmptyString(this.facetDependsOnField);
  }

  private get facetDependsOnField() {
    return this.facet.dependsOn;
  }

  public resetIfdependableFacetHasNoSelectedValues() {
    if (this.dependableFacetHasSelectedValues) {
      return;
    }

    this.facet.reset();
  }

  private get dependableFacetHasSelectedValues() {
    const parentSelectedValuesId = QueryStateModel.getFacetId(this.facetDependsOnField);
    return this.valuesExistForFacetWithId(parentSelectedValuesId);
  }

  private valuesExistForFacetWithId(id: string) {
    const values = this.facet.queryStateModel.get(id);
    return values != null && values.length != 0;
  }

  private handleNewQuery() {
    const facets = ComponentsTypes.getAllFacetsInstance(this.facet.root);
    const dependentFacets = facets.filter(facet => {
      return this.facet.id === facet.options.dependsOn;
    });

    dependentFacets.forEach(dependentFacet => {
      this.facet.toggleDependentFacet(dependentFacet);
    });
  }
}
