import * as axe from 'axe-core';
import { $$, Component, ChatterPostedBy } from 'coveo-search-ui';
import { addFieldEqualFilter, afterQuerySuccess, getRoot, testResultElement } from './Testing';

export const AccessibilityChatterPostedBy = () => {
  describe('ChatterPostedBy', () => {
    beforeEach(() => {
      addFieldEqualFilter('@objecttype', ['FeedItem', 'FeedComment']);
    });

    it('should be accessible', async done => {
      const chatterPostedBy = $$('div', {
        className: Component.computeCssClassName(ChatterPostedBy)
      });

      testResultElement(chatterPostedBy.el);

      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
