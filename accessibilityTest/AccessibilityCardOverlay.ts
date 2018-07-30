import * as axe from 'axe-core';
import { $$, Component, CardOverlay, get } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement } from './Testing';

export const AccessibilityCardOverlay = () => {
  describe('CardOverlay', () => {
    const getOverlayElement = () => {
      return $$('div', {
        className: Component.computeCssClassName(CardOverlay)
      });
    };

    it('should be accessible', async done => {
      const cardOverlay = getOverlayElement();

      testResultElement(cardOverlay.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible when opened', async done => {
      const cardOverlayElement = $$('div', {
        className: Component.computeCssClassName(CardOverlay)
      });

      testResultElement(cardOverlayElement.el);
      await afterQuerySuccess();
      const cardOverlayInDocument = $$(getRoot()).find(`.${Component.computeCssClassName(CardOverlay)}`);
      const cardOverlayInstance = get(cardOverlayInDocument as HTMLElement) as CardOverlay;
      cardOverlayInstance.openOverlay();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
