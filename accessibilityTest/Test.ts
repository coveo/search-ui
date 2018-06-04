/// <reference types="../bin/ts/CoveoJsSearch" />
/// <reference path="./CustomMatcher.d.ts" />
import { $$ } from 'coveo-search-ui';
import { AccessibilityAdvancedSearch } from './AccessibilityAdvancedSearch';
import { AccessibilityAggregate } from './AccessibilityAggregate';
import { AccessibilityFacet } from './AccessibilityFacet';
import { AccessibilityPager } from './AccessibilityPager';
import { AccessibilityQuerybox } from './AccessibilityQuerybox';
import { customMatcher } from './CustomMatcher';
import { defaultPage } from './DefaultTestPage';
import { AccessibilityBackdrop } from './AccessibilityBackdrop';
import { AccessibilityBadge } from './AccessibilityBadge';
import { AccessibilityBreadcrumb } from './AccessibilityBreadcrumb';
import { AccessibilityCardActionBar } from './AccessibilityCardActionBar';
import { AccessibilityCardOverlay } from './AccessibilityCardOverlay';

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
  const everything = $$(document.body).children();
  everything.forEach(element => {
    if (element.id != 'jasmine-report' && element.id != 'search-page') {
      element.remove();
    }
  });
};

describe('Testing ...', () => {
  beforeAll(done => {
    initialHTMLSetup();
    Coveo.Logger.disable();
    Coveo.SearchEndpoint.configureSampleEndpointV2();
    done();
  });

  beforeEach(() => {
    setupPageBetweenTest();
  });

  afterEach(() => {
    teardownPageBetweenTest();
  });

  AccessibilityAdvancedSearch();
  AccessibilityAggregate();
  AccessibilityBackdrop();
  AccessibilityBadge();
  AccessibilityBreadcrumb();
  AccessibilityCardActionBar();
  AccessibilityCardOverlay();
  AccessibilityQuerybox();
  AccessibilityPager();
  AccessibilityFacet();
});
