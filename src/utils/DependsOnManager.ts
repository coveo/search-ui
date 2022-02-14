import { isFunction } from 'underscore';
import { QueryStateModel, QueryEvents, Component } from '../Core';
//import { MODEL_EVENTS } from '../models/Model';
import { ComponentsTypes } from './ComponentsTypes';
import { $$ } from './Dom';
import { InitializationEvents } from '../events/InitializationEvents';

export interface IDependsOnCompatibleFacetOptions {
  id?: string;
  dependsOn?: string;
  dependsOnCondition?: IDependentFacetCondition;
}

export interface IDependsOnCompatibleFacet extends Component {
  options: IDependsOnCompatibleFacetOptions;
}

export interface IDependentFacet {
  reset: () => void;
  ref: IDependsOnCompatibleFacet;
}

export interface IDependentFacetCondition {
  (facet: IDependsOnCompatibleFacet): boolean;
}

export class DependsOnManager {
  private parentFacetRef: IDependsOnCompatibleFacet;

  constructor(private facet: IDependentFacet) {
    $$(this.facet.ref.searchInterface.element).on(QueryEvents.buildingQuery, () => this.handleBuildingQuery());

    if (this.getDependsOn(this.facet.ref)) {
      this.facet.ref.bind.onRootElement(InitializationEvents.afterComponentsInitialization, () => this.setupDependentFacet());
    }
  }

  private setupDependentFacet() {
    $$(this.facet.ref.element).addClass('coveo-hidden-dependant-facet');
    this.parentFacetRef = this.getParentFacet(this.facet.ref);

    if (this.parentFacetRef) {
      $$(this.facet.ref.root).on('state:change', () => this.resetIfConditionUnfullfiled());
    }
  }

  private resetIfConditionUnfullfiled() {
    const condition = this.getDependsOnCondition(this.facet.ref);

    if (!condition(this.parentFacetRef)) {
      this.facet.reset();
    }
  }

  private getId(component: IDependsOnCompatibleFacet) {
    const id = component.options.id;
    return id ? `${id}` : null;
  }

  private getDependsOn(component: IDependsOnCompatibleFacet) {
    const dependsOn = component.options.dependsOn;
    return dependsOn ? `${dependsOn}` : null;
  }

  private getDependsOnCondition(component: IDependsOnCompatibleFacet): IDependentFacetCondition {
    const conditionOption = component.options.dependsOnCondition;
    return conditionOption && isFunction(conditionOption)
      ? conditionOption
      : () => this.parentHasSelectedValues(component) && this.parentIsEnabled(component);
  }

  private parentHasSelectedValues(component: IDependsOnCompatibleFacet) {
    const parent = this.getParentFacet(component);
    return parent && this.valuesExistForFacetWithId(this.getId(parent));
  }

  private parentIsEnabled(component: IDependsOnCompatibleFacet) {
    const parent = this.getParentFacet(component);
    return parent && !parent.disabled;
  }

  private valuesExistForFacetWithId(facetId: string) {
    const values = this.facet.ref.queryStateModel.get(QueryStateModel.getFacetId(facetId));
    return !!values && !!values.length;
  }

  private get allFacetsInInterface() {
    return ComponentsTypes.getAllFacetsFromSearchInterface(this.facet.ref.searchInterface) as IDependsOnCompatibleFacet[];
  }

  private getParentFacet(component: IDependsOnCompatibleFacet) {
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

  private handleBuildingQuery() {
    this.dependentFacets.forEach(dependentFacet => {
      const condition = this.getDependsOnCondition(dependentFacet);
      if (condition(this.facet.ref)) {
        $$(dependentFacet.element).removeClass('coveo-hidden-dependant-facet');
        return dependentFacet.enable();
      }

      dependentFacet.disable();
      $$(dependentFacet.element).addClass('coveo-hidden-dependant-facet');
    });
  }

  public get hasDependentFacets() {
    return !!this.dependentFacets.length;
  }

  public get dependentFacetsHaveSelectedValues() {
    return this.dependentFacets.some(dependentFacet => this.valuesExistForFacetWithId(this.getId(dependentFacet)));
  }
}
