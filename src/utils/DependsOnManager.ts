import { Utils } from './Utils';
import { $$ } from './Dom';
import { QueryStateModel, QueryEvents, Component } from '../Core';
import { ComponentEvents } from '../ui/Base/Component';
import { MODEL_EVENTS } from '../models/Model';
import { ComponentsTypes } from './ComponentsTypes';

export interface IDependentFacet {
  reset: () => void;
  enableDisableDependentFacet: (dependentFacet: Component) => void;
  element: HTMLElement;
  root: HTMLElement;
  dependsOn: string;
  id: string;
  queryStateModel: QueryStateModel;
  bind: ComponentEvents;
}

export class DependsOnManager {
  constructor(private dependentFacet: IDependentFacet) {
    dependentFacet.bind.onRootElement(QueryEvents.newQuery, () => this.handleNewQuery());
  }

  public listenToParentIfDependentFacet() {
    if (!this.isDependentFacet) {
      return;
    }
    this.dependentFacet.bind.onQueryState(MODEL_EVENTS.CHANGE, undefined, () => this.resetIfParentFacetHasNoSelectedValues());
  }

  public updateVisibilityBasedOnDependsOn() {
    if (this.isDependentFacet) {
      $$(this.dependentFacet.element).toggleClass('coveo-facet-dependent', !this.parentFacetHasSelectedValues);
    }
  }

  private get isDependentFacet() {
    return Utils.isNonEmptyString(this.facetDependsOnField);
  }

  private get facetDependsOnField() {
    return this.dependentFacet.dependsOn;
  }

  public resetIfParentFacetHasNoSelectedValues() {
    if (this.parentFacetHasSelectedValues) {
      return;
    }

    this.dependentFacet.reset();
  }

  private get parentFacetHasSelectedValues() {
    const parentSelectedValuesId = QueryStateModel.getFacetId(this.facetDependsOnField);
    return this.valuesExistForFacetWithId(parentSelectedValuesId);
  }

  private valuesExistForFacetWithId(id: string) {
    const values = this.dependentFacet.queryStateModel.get(id);
    return values != null && values.length != 0;
  }

  private handleNewQuery() {
    const facets = ComponentsTypes.getAllFacetsInstance(this.dependentFacet.root);
    const dependentFacet = facets.filter(facet => {
      return this.dependentFacet.id === facet.options.dependsOn;
    })[0];

    if (!dependentFacet) {
      return;
    }

    this.dependentFacet.enableDisableDependentFacet(dependentFacet);
  }
}
