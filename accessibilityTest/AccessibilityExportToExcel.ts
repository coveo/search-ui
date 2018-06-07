import * as axe from 'axe-core';
import { $$, Component, ExportToExcel, Settings, get } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testSettingsElement } from './Testing';

export const AccessibilityExportToExcel = () => {
  describe('ExportToExcel', () => {
    it('should be accessible', async done => {
      const exportToExcelElement = $$('div', { className: Component.computeCssClassName(ExportToExcel) });
      const settingsElement = testSettingsElement(exportToExcelElement.el);
      await afterQuerySuccess();
      (get(settingsElement.el) as Settings).open();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
