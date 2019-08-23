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
  constructor(private dependableFacet: IDependentFacet) {
    this.dependableFacet.bind.onRootElement(QueryEvents.newQuery, () => this.handleNewQuery());
    this.updateVisibilityBasedOnDependsOn();
  }

  public listenToParentIfDependentFacet() {
    if (!this.isDependentFacet) {
      return;
    }
    this.dependableFacet.bind.onQueryState(MODEL_EVENTS.CHANGE, undefined, () => this.resetIfdependableFacetHasNoSelectedValues());
  }

  public updateVisibilityBasedOnDependsOn() {
    if (!this.isDependentFacet) {
      return;
    }

    if ($$(this.dependableFacet.element).hasClass('coveo-facet-empty')) {
      return;
    }

    this.dependableFacetHasSelectedValues ? $$(this.dependableFacet.element).show() : $$(this.dependableFacet.element).hide();
  }

  private get isDependentFacet() {
    return Utils.isNonEmptyString(this.facetDependsOnField);
  }

  private get facetDependsOnField() {
    return this.dependableFacet.dependsOn;
  }

  public resetIfdependableFacetHasNoSelectedValues() {
    if (this.dependableFacetHasSelectedValues) {
      return;
    }

    this.dependableFacet.reset();
  }

  private get dependableFacetHasSelectedValues() {
    const parentSelectedValuesId = QueryStateModel.getFacetId(this.facetDependsOnField);
    return this.valuesExistForFacetWithId(parentSelectedValuesId);
  }

  private valuesExistForFacetWithId(id: string) {
    const values = this.dependableFacet.queryStateModel.get(id);
    return values != null && values.length != 0;
  }

  private handleNewQuery() {
    const facets = ComponentsTypes.getAllFacetsInstance(this.dependableFacet.root);
    const dependentFacets = facets.filter(facet => {
      return this.dependableFacet.id === facet.options.dependsOn;
    });

    dependentFacets.forEach(dependentFacet => {
      this.dependableFacet.toggleDependentFacet(dependentFacet);
    });
  }
}
