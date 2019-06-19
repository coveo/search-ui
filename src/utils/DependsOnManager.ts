import { Utils } from './Utils';
import { $$ } from './Dom';
import { QueryStateModel } from '../Core';
import { ComponentEvents } from '../ui/Base/Component';
import { MODEL_EVENTS } from '../models/Model';

export interface IDependentFacet {
  reset: () => void;
  element: HTMLElement;
  dependsOn: string;
  queryStateModel: QueryStateModel;
  bind: ComponentEvents;
}

export class DependsOnManager {
  constructor(private dependantFacet: IDependentFacet) {}

  public listenToParentIfDependentFacet() {
    if (!this.isDependentFacet) {
      return;
    }

    this.dependantFacet.bind.onQueryState(MODEL_EVENTS.CHANGE, undefined, () => this.resetIfParentFacetHasNoSelectedValues());
  }

  public updateVisibilityBasedOnDependsOn() {
    if (this.isDependentFacet) {
      $$(this.dependantFacet.element).toggleClass('coveo-facet-dependent', !this.parentFacetHasSelectedValues);
    }
  }

  private get isDependentFacet() {
    return Utils.isNonEmptyString(this.facetDependsOnField);
  }

  private get facetDependsOnField() {
    return this.dependantFacet.dependsOn;
  }

  public resetIfParentFacetHasNoSelectedValues() {
    if (this.parentFacetHasSelectedValues) {
      return;
    }

    this.dependantFacet.reset();
  }

  private get parentFacetHasSelectedValues() {
    const parentSelectedValuesId = QueryStateModel.getFacetId(this.facetDependsOnField);
    return this.valuesExistForFacetWithId(parentSelectedValuesId);
  }

  private valuesExistForFacetWithId(id: string) {
    const values = this.dependantFacet.queryStateModel.get(id);
    return values != null && values.length != 0;
  }
}
