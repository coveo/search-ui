import { customMatcher } from './CustomMatcher';
import { AccessibilityQuerybox } from './AccessibilityQuerybox';
import { defaultPage } from './DefaultTestPage';
import { $$ } from '../src/utils/Dom';
import { AccessibilityPager } from './AccessibilityPager';
import { AccessibilityFacet } from './AccessibilityFacet';
import { Simulate } from '../unitTests/Simulate';
declare const Coveo;

const initialHTMLSetup = () => {
  const body = jasmine['getGlobal']().document.body;

  if (!$$(body).find('#jasmine-report')) {
    const jasmineReport = $$('div', { id: 'jasmine-report' });
    $$(body).append(jasmineReport.el);
  }

  if (!$$(body).find('#search-page')) {
    const searchPage = $$('div', { id: 'search-page' });
    $$(body).append(searchPage.el);
  }
};

export const setupPageBetweenTest = () => {
  document.querySelector('#search-page').innerHTML = defaultPage;
};

export const teardownPageBetweenTest = () => {
  $$($$(document.body).find('#search-page')).empty();
};

describe('Testing ...', () => {
  beforeAll(done => {
    initialHTMLSetup();

    if (Simulate.isChromeHeadless()) {
      Coveo.Logger.disable();
    }

    Coveo.SearchEndpoint.configureSampleEndpointV2();
    done();
  });

  beforeEach(() => {
    jasmine.addMatchers(customMatcher);
    setupPageBetweenTest();
  });

  afterEach(() => {
    Coveo.nuke($$(document.body).find('.CoveoSearchInterface'));
    teardownPageBetweenTest();
  });

  AccessibilityQuerybox();
  AccessibilityPager();
  AccessibilityFacet();
});
