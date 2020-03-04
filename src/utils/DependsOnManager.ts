import { isFunction } from 'underscore';
import { QueryStateModel, QueryEvents, Component } from '../Core';
import { MODEL_EVENTS } from '../models/Model';
import { ComponentsTypes } from './ComponentsTypes';
import { $$ } from './Dom';

export interface IDependentFacet {
  reset: () => void;
  ref: Component;
}

export interface IDependentFacetCondition {
  (facet: Component): boolean;
}

export class DependsOnManager {
  private parentFacet: Component;

  constructor(private facet: IDependentFacet) {
    this.facet.ref.bind.onRootElement(QueryEvents.newQuery, () => this.handleNewQuery());

    if (this.getDependsOn(this.facet.ref)) {
      this.setupDependentFacet();
    }
  }

  private setupDependentFacet() {
    this.parentFacet = this.getParentFacet(this.facet.ref);

    if (this.parentFacet) {
      this.facet.ref.bind.onQueryState(MODEL_EVENTS.CHANGE, undefined, () => this.resetIfConditionUnfullfiled());
    }
  }

  private resetIfConditionUnfullfiled() {
    const condition = this.getDependsOnCondition(this.facet.ref);

    if (!condition(this.parentFacet)) {
      this.facet.reset();
    }
  }

  private getId(component: Component) {
    const id = component.options.id;
    return id ? `${id}` : null;
  }

  private getDependsOn(component: Component) {
    const dependsOn = component.options.dependsOn;
    return dependsOn ? `${dependsOn}` : null;
  }

  private getDependsOnCondition(component: Component): IDependentFacetCondition {
    const conditionOption = component.options.dependsOnCondition;
    return conditionOption && isFunction(conditionOption) ? conditionOption : () => this.parentHasSelectedValues(component);
  }

  private parentHasSelectedValues(component: Component) {
    const parent = this.getParentFacet(component);
    return parent && this.valuesExistForFacetWithId(this.getId(parent));
  }

  private valuesExistForFacetWithId(facetId: string) {
    const values = this.facet.ref.queryStateModel.get(QueryStateModel.getFacetId(facetId));
    return !!values && !!values.length;
  }

  private get allFacetsInInterface() {
    return ComponentsTypes.getAllFacetsInstance(this.facet.ref.root);
  }

  private getParentFacet(component: Component) {
    const parent = this.allFacetsInInterface.filter(
      potentialParentFacet => this.getId(potentialParentFacet) === this.getDependsOn(component)
    );

    if (!parent.length) {
      component.logger.warn('DependsOn reference does not exist', this.getDependsOn(this.facet.ref));
      return null;
    }

    return parent[0];
  }

  private get dependentFacets() {
    return this.allFacetsInInterface.filter(
      potentialDependentFacet => this.getId(this.facet.ref) === this.getDependsOn(potentialDependentFacet)
    );
  }

  private handleNewQuery() {
    this.dependentFacets.forEach(dependentFacet => {
      const condition = this.getDependsOnCondition(dependentFacet);
      if (condition(this.facet.ref)) {
        return dependentFacet.enable();
      }

      dependentFacet.disable();
      $$(dependentFacet.element).addClass('coveo-hidden');
    });
  }

  public get hasDependentFacets() {
    return !!this.dependentFacets.length;
  }

  public get dependentFacetsHaveSelectedValues() {
    return this.dependentFacets.some(dependentFacet => this.valuesExistForFacetWithId(this.getId(dependentFacet)));
  }
}
