import { Component } from '../ui/Base/Component';
import { $$, Dom } from './Dom';

export interface IComponentsTypesSearchInterface {
  getComponents: (type: string) => Component[];
}

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

  public static getAllFacetElementsFromElement(root: HTMLElement | Dom) {
    const selectors = ComponentsTypes.allFacetsClassname.map(className => `.${className}`).join(', ');
    const hasNoFacetChild = (element: HTMLElement) => !$$(element).findAll(selectors).length;

    return $$(root as HTMLElement)
      .findAll(selectors)
      .filter(hasNoFacetChild);
  }

  public static getAllFacetInstancesFromElement(root: HTMLElement | Dom) {
    return ComponentsTypes.getAllFacetElementsFromElement(root).map(element => Component.get(element) as Component);
  }

  public static getAllFacetsFromSearchInterface(searchInterface: IComponentsTypesSearchInterface) {
    return ComponentsTypes.allFacetsType.reduce(
      (facets: Component[], facetType: string) => facets.concat(searchInterface.getComponents(facetType)),
      []
    );
  }
}
