import { ComponentsTypes } from '../../src/utils/ComponentsTypes';
import { Dom, $$ } from '../../src/utils/Dom';
import { Initialization, Component } from '../../src/Core';
import { MockEnvironmentBuilder } from '../MockEnvironment';

export function ComponentsTypesTest() {
  describe('ComponentsTypes', () => {
    const expectedFacets = ['Facet', 'FacetSlider', 'FacetRange', 'TimespanFacet', 'HierarchicalFacet', 'CategoryFacet', 'DynamicFacet'];

    it('should be able to return a list of different type of facets identifier', () => {
      expectedFacets.forEach(expectedFacet => {
        expect(ComponentsTypes.allFacetsType).toContain(expectedFacet);
      });
    });

    it('should be able to return a list of properly named facets classnames', () => {
      expectedFacets.forEach(expectedFacet => {
        expect(ComponentsTypes.allFacetsClassname).toContain(`Coveo${expectedFacet}`);
      });
    });

    describe('with an HTML element containing live facets component', () => {
      let root: Dom;
      beforeEach(() => {
        root = $$('div');

        expectedFacets.forEach(expectedFacet => {
          root.append(
            $$('div', {
              className: `Coveo${expectedFacet}`,
              'data-field': '@a_magnificient_field'
            }).el
          );
        });

        Initialization.automaticallyCreateComponentsInside(root.el, {
          bindings: new MockEnvironmentBuilder().build(),
          options: {}
        });
      });

      it('should be able to return all top level facets element', () => {
        const allFacetsElements = ComponentsTypes.getAllFacetsElements(root);

        expect(allFacetsElements.length).toBe(expectedFacets.length);
        allFacetsElements.forEach(element => expect(element instanceof HTMLDivElement).toBe(true));
      });

      it('should be able to return all top level facets instance', () => {
        const allFacetsInstance = ComponentsTypes.getAllFacetsInstance(root);

        expect(allFacetsInstance.length).toBe(expectedFacets.length);
        allFacetsInstance.forEach(facetInstance => expect(facetInstance instanceof Component).toBe(true));
      });
    });
  });
}
