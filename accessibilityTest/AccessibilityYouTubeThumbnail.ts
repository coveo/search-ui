import * as axe from 'axe-core';
import { $$, Component, YouTubeThumbnail } from 'coveo-search-ui';
import { addFieldEqualFilter, afterQuerySuccess, getRoot, testResultElement } from './Testing';

export const AccessibilityYouTubeThumbnail = () => {
  describe('YouTubeThumbnail', () => {
    beforeEach(() => {
      addFieldEqualFilter('@filetype', 'youtubevideo');
    });

    it('should be accessible', async done => {
      const badgeElement = $$('div', {
        className: Component.computeCssClassName(YouTubeThumbnail),
        'data-field': '@filetype'
      });

      testResultElement(badgeElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
