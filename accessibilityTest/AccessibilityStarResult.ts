import * as axe from 'axe-core';
import { $$, Component, StarRating } from 'coveo-search-ui';
import { addQueryFilter, addFieldEqualFilter, afterQuerySuccess, getRoot, testResultElement } from './Testing';

export const AccessibilityStarResult = () => {
  describe('StarResult', () => {
    beforeEach(() => {
      addFieldEqualFilter('@objecttype', 'ccrz__E_Product__c');
      addQueryFilter('@sfaveragerating');
    });

    it('should be accessible', async done => {
      const starRatingElement = $$('div', {
        className: Component.computeCssClassName(StarRating),
        'data-rating-field': '@sfaveragerating'
      });

      testResultElement(starRatingElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
