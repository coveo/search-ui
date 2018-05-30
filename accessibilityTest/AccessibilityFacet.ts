/// <reference path="./CustomMatcher.d.ts" />
import * as axe from 'axe-core';
import { $$ } from '../src/utils/Dom';
import { getRoot, afterDeferredQuerySuccess, getFacetColumn } from './Testing';
import { Component, get } from '../src/Core';
import { Facet } from '../src/ui/Facet/Facet';

export const AccessibilityFacet = () => {
  describe('Facet', () => {
    it('should be accessible', async done => {
      getFacetColumn().appendChild($$('div', { className: Component.computeCssClassName(Facet), 'data-field': '@objecttype' }).el);
      await afterDeferredQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('search should be accessible', async done => {
      const facetElement = $$('div', { className: Component.computeCssClassName(Facet), 'data-field': '@objecttype' });
      getFacetColumn().appendChild(facetElement.el);
      await afterDeferredQuerySuccess();
      (get(facetElement.el) as Facet).facetSearch.focus();
      setTimeout(async () => {
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      }, 500);
    });
  });
};
