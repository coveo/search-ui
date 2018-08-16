import * as axe from 'axe-core';
import { $$, Component, ErrorReport } from 'coveo-search-ui';
import { addQueryFilter, afterQueryError, getResultsColumn, getRoot, afterQuerySuccess } from './Testing';

export const AccessibilityErrorReport = () => {
  describe('ErrorReport', () => {
    const buildErrortReportElement = () => {
      const errorReportElement = $$('div', {
        className: Component.computeCssClassName(ErrorReport)
      });

      getResultsColumn().appendChild(errorReportElement.el);
    };

    it('should be accessible when a query triggers an error', async done => {
      // !BOOM
      addQueryFilter('$qre()');
      buildErrortReportElement();
      await afterQueryError();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible when a query does not trigger an error', async done => {
      addQueryFilter('@uri');
      buildErrortReportElement();
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
