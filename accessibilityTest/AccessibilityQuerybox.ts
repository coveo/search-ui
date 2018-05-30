/// <reference path="./CustomMatcher.d.ts" />
import * as axe from 'axe-core';
import { $$ } from '../src/utils/Dom';
import { afterQuerySuccess, getRoot, getSearchSection } from './Testing';
import { Component, get } from '../src/Core';
import { Querybox } from '../src/ui/Querybox/Querybox';

export const AccessibilityQuerybox = () => {
  describe('Querybox', () => {
    let queryBox: HTMLElement;

    beforeEach(() => {
      queryBox = $$('div', { className: Component.computeCssClassName(Querybox) }).el;
      getSearchSection().appendChild(queryBox);
    });

    it('should be accessible', async done => {
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible when focused', async done => {
      await afterQuerySuccess();
      queryBox.querySelector('input').focus();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it("should be accessible when there's text", async done => {
      await afterQuerySuccess();
      (get(queryBox) as Querybox).setText('test');
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
