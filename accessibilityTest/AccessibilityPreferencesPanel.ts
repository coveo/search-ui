import * as axe from 'axe-core';
import { $$, Component, PreferencesPanel, Settings, get } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testSettingsElement } from './Testing';

export const AccessibilityPreferencesPanel = () => {
  describe('PreferencesPanel', () => {
    it('should be accessible in settings menu', async done => {
      const preferencesPanelElement = $$('div', { className: Component.computeCssClassName(PreferencesPanel) });
      const settingsElement = testSettingsElement(preferencesPanelElement.el);
      await afterQuerySuccess();
      (get(settingsElement.el) as Settings).open();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible when opened', async done => {
      const preferencesPanelElement = $$(
        'div',
        {
          className: Component.computeCssClassName(PreferencesPanel)
        },
        `
        <div class="CoveoResultsPreferences"></div>
        <div class="CoveoResultsFiltersPreferences"></div>
      `
      );

      testSettingsElement(preferencesPanelElement.el);
      await afterQuerySuccess();
      (get(preferencesPanelElement.el) as PreferencesPanel).open();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
