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

    describe('with a query that triggers an error', () => {
      beforeEach(() => {
        // !BOOM
        addQueryFilter('$qre()');
      });

      it('should be accessible', async done => {
        buildErrortReportElement();
        await afterQueryError();
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });
    });

    describe('with a query that does not trigger an error', () => {
      beforeEach(() => {
        addQueryFilter('@uri');
      });

      it('should be accessible', async done => {
        buildErrortReportElement();
        await afterQuerySuccess();
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });
    });
  });
};
