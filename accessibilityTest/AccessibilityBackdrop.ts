import * as axe from 'axe-core';
import { $$, Backdrop, Component } from 'coveo-search-ui';
import { addFieldEqualFilter, afterDelay, afterQuerySuccess, getRoot, testResultElement } from './Testing';

export const AccessibilityBackdrop = () => {
  describe('Backdrop', () => {
    beforeEach(() => {
      addFieldEqualFilter('@filetype', 'youtubevideo');
    });

    it('should be accessible', async done => {
      const backdrop = $$('div', {
        className: Component.computeCssClassName(Backdrop),
        'data-image-field': '@ytthumbnailurl',
        'data-overlay-gradient': true,
        'data-overlay-color': 'rgb(38, 62, 85)'
      });

      backdrop.el.style.width = '100px';
      backdrop.el.style.height = '100px';

      testResultElement(backdrop.el);
      await afterQuerySuccess();
      // Give some time for images to load
      await afterDelay(500);
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
