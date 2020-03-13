import * as axe from 'axe-core';
import { $$, Component, QuerySummary } from 'coveo-search-ui';
import { getSummarySection, afterQuerySuccess, addBasicExpression } from './Testing';

export const AccessibilityQuerySummary = () => {
  describe('QuerySummary', () => {
    let querySummaryElement: HTMLElement;
    beforeEach(() => {
      getSummarySection().appendChild((querySummaryElement = $$('span', { className: Component.computeCssClassName(QuerySummary) }).el));
    });

    it('should be accessible', async done => {
      await afterQuerySuccess();
      const axeResults = await axe.run(getSummarySection());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible with no results', async done => {
      addBasicExpression('b48897e9a2fbf13bc1c3f1455339a74d');
      await afterQuerySuccess();
      const axeResults = await axe.run(getSummarySection());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
