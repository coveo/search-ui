import * as axe from 'axe-core';
import { $$, ChatterPostAttachment, Component } from 'coveo-search-ui';
import { addFieldEqualFilter, afterQuerySuccess, getRoot, testResultElement } from './Testing';

export const AccessibilityChatterPostAttachment = () => {
  describe('ChatterPostAttachment', () => {
    beforeEach(() => {
      addFieldEqualFilter('@objecttype', ['FeedItem', 'FeedComment']);
    });

    it('should be accessible', async done => {
      const chatterLikedBy = $$('div', {
        className: Component.computeCssClassName(ChatterPostAttachment)
      });

      testResultElement(chatterLikedBy.el);

      $$(getRoot()).on('preprocessResults', (e, args) => {
        args.results.results.forEach(res => {
          res.raw.sfcontentversionid = Math.random().toString();
        });
      });

      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
