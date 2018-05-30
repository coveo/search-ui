/// <reference types="../bin/ts/CoveoJsSearch" />

import { customMatcher } from './CustomMatcher';
import { AccessibilityQuerybox } from './AccessibilityQuerybox';
import { defaultPage } from './DefaultTestPage';
import { $$ } from '../src/utils/Dom';
import { AccessibilityPager } from './AccessibilityPager';
import { AccessibilityFacet } from './AccessibilityFacet';
import { Simulate } from '../unitTests/Simulate';

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
  jasmine.addMatchers(customMatcher);
  document.querySelector('#search-page').innerHTML = defaultPage;
};

export const teardownPageBetweenTest = () => {
  Coveo.nuke($$(document.body).find('.CoveoSearchInterface'));
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
    setupPageBetweenTest();
  });

  afterEach(() => {
    teardownPageBetweenTest();
  });

  AccessibilityQuerybox();
  AccessibilityPager();
  AccessibilityFacet();
});
