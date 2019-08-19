import { Dom, $$ } from './Dom';
import { get } from '../ui/Base/RegisteredNamedMethods';
import { Component } from '../ui/Base/Component';

export class ComponentsTypes {
  public static get allFacetsType() {
    return ['Facet', 'FacetSlider', 'FacetRange', 'TimespanFacet', 'HierarchicalFacet', 'CategoryFacet', 'DynamicFacet'];
  }

  public static get allFacetsClassname() {
    return ComponentsTypes.allFacetsType.map(type => Component.computeCssClassNameForType(type));
  }

  public static getAllFacetsElements(root: HTMLElement | Dom) {
    const selectors = ComponentsTypes.allFacetsClassname.map(className => `.${className}`).join(', ');
    const hasNoFacetChild = (element: HTMLElement) => !$$(element).findAll(selectors).length;

    return $$(root as HTMLElement)
      .findAll(selectors)
      .filter(hasNoFacetChild);
  }

  public static getAllFacetsInstance(root: HTMLElement | Dom) {
    return ComponentsTypes.getAllFacetsElements(root).map(element => get(element) as Component);
  }
}
