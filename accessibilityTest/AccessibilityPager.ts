/// <reference path="./CustomMatcher.d.ts" />
import * as axe from 'axe-core';
import { $$ } from '../src/utils/Dom';
import { afterQuerySuccess, getRoot, getResultsColumn } from './Testing';
import { Component } from '../src/Core';
import { Pager } from '../src/ui/Pager/Pager';

export const AccessibilityPager = () => {
  describe('Pager', () => {
    it('should be accessible', async done => {
      getResultsColumn().appendChild($$('div', { className: Component.computeCssClassName(Pager) }).el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
