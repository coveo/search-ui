import { Component } from '../ui/Base/Component';
import { $$, Dom } from './Dom';

export class ComponentsTypes {
  public static get allFacetsType() {
    return [
      'Facet',
      'FacetSlider',
      'FacetRange',
      'TimespanFacet',
      'HierarchicalFacet',
      'CategoryFacet',
      'DynamicFacet',
      'DynamicFacetRange',
      'DynamicHierarchicalFacet'
    ];
  }

  public static get allFacetsClassname() {
    return ComponentsTypes.allFacetsType.map(type => `Coveo${type}`);
  }

  public static getAllFacetsElements(root: HTMLElement | Dom) {
    const selectors = ComponentsTypes.allFacetsClassname.map(className => `.${className}`).join(', ');
    const hasNoFacetChild = (element: HTMLElement) => !$$(element).findAll(selectors).length;

    return $$(root as HTMLElement)
      .findAll(selectors)
      .filter(hasNoFacetChild);
  }

  public static getAllFacetsInstance(root: HTMLElement | Dom) {
    return ComponentsTypes.getAllFacetsElements(root)
      .map(element => Component.get(element) as Component)
      .filter(component => !!component);
  }
}
