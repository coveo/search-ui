import * as axe from 'axe-core';
import { $$, Component, YouTubeThumbnail, get } from 'coveo-search-ui';
import { addFieldEqualFilter, afterQuerySuccess, getRoot, testResultElement, getModal, waitUntilSelectorIsPresent } from './Testing';

export const AccessibilityYouTubeThumbnail = () => {
  describe('YouTubeThumbnail', () => {
    function openVideo() {
      (get(document.querySelector(`.${Component.computeCssClassName(YouTubeThumbnail)}`)) as YouTubeThumbnail).openResultLink();
    }

    beforeEach(async done => {
      addFieldEqualFilter('@filetype', 'youtubevideo');
      const badgeElement = $$('div', {
        className: Component.computeCssClassName(YouTubeThumbnail),
        'data-field': '@filetype'
      });

      testResultElement(badgeElement.el);
      await afterQuerySuccess();
      done();
    });

    it('should be accessible', async done => {
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible when opened', async done => {
      openVideo();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should open an accessible modal', async done => {
      openVideo();
      if (!getModal().querySelector('iframe[title]')) {
        await waitUntilSelectorIsPresent(getModal(), 'iframe[title]');
      }
      const axeResults = await axe.run(getModal());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
