import * as axe from 'axe-core';
import { $$, Component, ChatterLikedBy } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement, addFieldEqualFilter } from './Testing';
import { range, map } from 'underscore';

export const AccessibilityChatterLikedBy = () => {
  describe('ChatterLikedBy', () => {
    beforeEach(() => {
      addFieldEqualFilter('@objecttype', ['FeedItem', 'FeedComment']);
    });

    it('should be accessible', async done => {
      const chatterLikedBy = $$('div', {
        className: Component.computeCssClassName(ChatterLikedBy)
      });

      testResultElement(chatterLikedBy.el);

      $$(getRoot()).on('preprocessResults', (e, args) => {
        args.results.results.forEach(res => {
          const amountOfLike = Math.floor(Math.random() * 15);
          const likedBy = map(range(0, amountOfLike), val => val).join(';') || null;
          res.raw.sflikedby = likedBy;
          res.raw.sflikedbyid = likedBy;
          res.raw.sflikecount = amountOfLike;
        });
      });

      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
