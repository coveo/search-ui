import { inDesktopMode, resetMode, getSearchSection, afterDeferredQuerySuccess, getRoot } from './Testing';
import { $$, Component, Settings, get } from 'coveo-search-ui';
import axe = require('axe-core');
import { ContrastChecker } from './ContrastChecker';

export const AccessibilitySettings = () => {
  describe('Settings', () => {
    function getSettingsElement() {
      return $$('div', {
        className: Component.computeCssClassName(Settings)
      }).el;
    }

    function getSettings() {
      return get(settingsElement, Settings) as Settings;
    }

    let settingsElement: HTMLElement;
    beforeEach(async done => {
      inDesktopMode();
      getSearchSection().appendChild((settingsElement = getSettingsElement()));
      await afterDeferredQuerySuccess();
      done();
    });

    afterEach(() => {
      resetMode();
    });

    it('should be accessible', async done => {
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should have good contrast on the border', () => {
      const borderContrast = ContrastChecker.getContrastWithBackground(settingsElement, 'borderBottomColor');
      expect(borderContrast).toBeGreaterThan(ContrastChecker.MinimumContrastRatio);
    });

    describe('when expanded', () => {
      beforeEach(() => {
        settingsElement.click();
      });

      it('should be accessible', async done => {
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });

      it('should have good contrast on the border of the popup', () => {
        const borderContrast = ContrastChecker.getContrastWithBackground(getSettings()['menu'], 'borderBottomColor', getSearchSection());
        expect(borderContrast).toBeGreaterThan(ContrastChecker.MinimumContrastRatio);
      });
    });
  });
};
