import { Facet } from './Facet';
import { Utils } from '../../utils/Utils';
import { MODEL_EVENTS } from '../../models/Model';
import { QueryStateModel } from '../../models/QueryStateModel';
import { $$ } from '../../utils/Dom';

export class DependentFacetManager {
  constructor(private facet: Facet) {}

  public listenToParentIfDependentFacet() {
    if (!this.isDependentFacet) {
      return;
    }

    this.facet.bind.onQueryState(MODEL_EVENTS.CHANGE, undefined, () => this.resetIfParentFacetHasNoSelectedValues());
  }

  public updateVisibilityBasedOnDependsOn() {
    if (this.isDependentFacet) {
      $$(this.facet.element).toggleClass('coveo-facet-dependent', !this.parentFacetHasSelectedValues);
    }
  }

  private get isDependentFacet() {
    return Utils.isNonEmptyString(this.facetDependsOnField);
  }

  private get facetDependsOnField() {
    return this.facet.options.dependsOn;
  }

  private resetIfParentFacetHasNoSelectedValues() {
    if (this.parentFacetHasSelectedValues) {
      return;
    }

    this.facet.reset();
  }

  private get parentFacetHasSelectedValues() {
    const parentSelectedValuesId = QueryStateModel.getFacetId(this.facetDependsOnField);
    return this.valuesExistForFacetWithId(parentSelectedValuesId);
  }

  private valuesExistForFacetWithId(id: string) {
    const values = this.facet.queryStateModel.get(id);
    return values != null && values.length != 0;
  }
}
