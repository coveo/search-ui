import * as axe from 'axe-core';
import { $$, Component, Pager } from 'coveo-search-ui';
import { afterQuerySuccess, getResultsColumn, getRoot } from './Testing';
import { ContrastChecker } from './ContrastChecker';

export const AccessibilityPager = () => {
  describe('Pager', () => {
    let pagerElement: HTMLElement;
    beforeEach(async done => {
      getResultsColumn().appendChild((pagerElement = $$('div', { className: Component.computeCssClassName(Pager) }).el));
      await afterQuerySuccess();
      done();
    });

    it('should be accessible', async done => {
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should have a conformant contrast ratio on the border of each button', () => {
      $$(pagerElement)
        .findClass('coveo-pager-list-item')
        .forEach(button => {
          expect(ContrastChecker.getContrastWithBackground(button.parentElement, 'borderBottomColor')).not.toBeLessThan(
            ContrastChecker.MinimumContrastRatio,
            `Button "${button.innerText}" must have a conformant contrast ratio on the border`
          );
        });
    });
  });
};
