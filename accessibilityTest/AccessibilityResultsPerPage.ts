import * as axe from 'axe-core';
import { $$, Component, ResultsPerPage } from 'coveo-search-ui';
import { afterQuerySuccess, getResultsColumn, getRoot } from './Testing';
import { ContrastChecker } from './ContrastChecker';

export const AccessibilityResultsPerPage = () => {
  describe('ResultsPerPage', () => {
    let resultsPerPageElement: HTMLElement;
    beforeEach(async done => {
      getResultsColumn().appendChild((resultsPerPageElement = $$('div', { className: Component.computeCssClassName(ResultsPerPage) }).el));
      await afterQuerySuccess();
      done();
    });

    it('should be accessible', async done => {
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should have a conformant contrast ratio on the border of each button', () => {
      $$(resultsPerPageElement)
        .findClass('coveo-results-per-page-list-item')
        .forEach(button => {
          expect(ContrastChecker.getContrastWithBackground(button.parentElement, 'borderBottomColor')).not.toBeLessThan(
            ContrastChecker.MinimumContrastRatio,
            `Button "${button.innerText}" must have a conformant contrast ratio on the border`
          );
        });
    });
  });
};
