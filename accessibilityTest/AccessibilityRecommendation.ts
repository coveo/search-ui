import * as axe from 'axe-core';
import { $$, Recommendation, Component, initRecommendation, ResultList } from 'coveo-search-ui';
import { afterQuerySuccess, getResultsColumn, getRoot, afterDelay } from './Testing';

export const AccessibilityRecommendation = () => {
  describe('Recommendation', () => {
    it('should be accessible', async done => {
      const recommendationElement = $$(
        'div',
        {
          className: Component.computeCssClassName(Recommendation)
        },
        $$('div', {
          className: Component.computeCssClassName(ResultList)
        })
      );

      getResultsColumn().appendChild(recommendationElement.el);

      initRecommendation(recommendationElement.el);

      await afterQuerySuccess();
      await afterDelay(1000);

      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
