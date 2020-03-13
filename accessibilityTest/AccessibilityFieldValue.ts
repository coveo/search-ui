import * as axe from 'axe-core';
import { $$, Component, FieldValue, Facet } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement, getResultsColumn } from './Testing';
import { ContrastChecker } from './ContrastChecker';

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

    describe('with an associated facet', () => {
      function getFirstFieldValue() {
        return getResultsColumn().querySelector<HTMLElement>(Component.computeSelectorForType(FieldValue.ID));
      }

      beforeEach(() => {
        const fieldValueElement = $$('div', {
          className: Component.computeCssClassName(FieldValue),
          'data-field': '@filetype',
          'data-text-caption': 'File'
        });

        const facetElement = $$('div', {
          className: Component.computeCssClassName(Facet),
          'data-field': '@filetype'
        });
        getResultsColumn().appendChild(facetElement.el);
        testResultElement(fieldValueElement.el);
      });

      it('should be accessible with an associated facet', async done => {
        await afterQuerySuccess();
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });

      it('should have enough contrast between the label and link', async done => {
        await afterQuerySuccess();
        const fieldValueElement = getFirstFieldValue();
        const labelColor = ContrastChecker.getColor(fieldValueElement.querySelector('.coveo-field-caption'));
        const linkColor = ContrastChecker.getColor(fieldValueElement.querySelector('.coveo-clickable'));
        expect(ContrastChecker.getContrastBetweenColors(labelColor, linkColor)).not.toBeLessThan(ContrastChecker.MinimumContrastRatio);
        done();
      });
    });
  });
};
