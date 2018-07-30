import * as axe from 'axe-core';
import { $$, Component, FieldValue, Facet } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement, getResultsColumn } from './Testing';

export const AccessibilityFieldValue = () => {
  describe('FieldValue', () => {
    it('should be accessible', async done => {
      const fieldValueElement = $$('div', {
        className: Component.computeCssClassName(FieldValue),
        'data-field': '@filetype'
      });

      testResultElement(fieldValueElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible with an associated facet', async done => {
      const fieldValueElement = $$('div', {
        className: Component.computeCssClassName(FieldValue),
        'data-field': '@filetype'
      });

      const facetElement = $$('div', {
        className: Component.computeCssClassName(Facet),
        'data-field': '@filetype'
      });
      getResultsColumn().appendChild(facetElement.el);
      testResultElement(fieldValueElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
