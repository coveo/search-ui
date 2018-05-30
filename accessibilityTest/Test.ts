import { customMatcher } from './CustomMatcher';
import { AccessibilityQuerybox } from './AccessibilityQuerybox';
import { defaultPage } from './DefaultTestPage';
import { $$ } from '../src/utils/Dom';
import { AccessibilityPager } from './AccessibilityPager';
import { AccessibilityFacet } from './AccessibilityFacet';
declare const Coveo;

export const setupPage = () => {
  document.querySelector('#search-page').innerHTML = defaultPage;
};

export const teardownPage = () => {
  $$($$(document.body).find('#search-page')).empty();
};

document.addEventListener('DOMContentLoaded', function() {
  Coveo.SearchEndpoint.configureSampleEndpointV2();

  describe('Testing ...', () => {
    beforeEach(() => {
      jasmine.addMatchers(customMatcher);
      setupPage();
    });
    afterEach(() => {
      Coveo.nuke($$(document.body).find('.CoveoSearchInterface'));
      teardownPage();
    });
    AccessibilityQuerybox();
    AccessibilityPager();
    AccessibilityFacet();
  });
});
