import * as axe from 'axe-core';
import { $$, Component, ErrorReport } from 'coveo-search-ui';
import { addQueryFilter, afterQueryError, getResultsColumn, getRoot } from './Testing';

export const AccessibilityErrorReport = () => {
  describe('ErrorReport', () => {
    beforeEach(() => {
      // !BOOM
      addQueryFilter('$qre()');
    });

    it('should be accessible', async done => {
      const errorReportElement = $$('div', {
        className: Component.computeCssClassName(ErrorReport)
      });

      getResultsColumn().appendChild(errorReportElement.el);
      await afterQueryError();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
