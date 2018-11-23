import * as axe from 'axe-core';
import { $$, Component, CardOverlay, get, FieldTable, Facet } from 'coveo-search-ui';
import {
  afterQuerySuccess,
  getRoot,
  testResultElement,
  getFacetColumn,
  afterDeferredQuerySuccess,
  addFieldEqualFilter,
  afterDelay
} from './Testing';

export const AccessibilityCardOverlay = () => {
  describe('CardOverlay', () => {
    const getOverlayElement = () => {
      return $$('div', {
        className: Component.computeCssClassName(CardOverlay)
      });
    };

    const getOverlayInstance = () => {
      const cardOverlayInDocument = $$(getRoot()).find(`.${Component.computeCssClassName(CardOverlay)}`);
      return get(cardOverlayInDocument as HTMLElement) as CardOverlay;
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
      const cardOverlayElement = getOverlayElement();

      testResultElement(cardOverlayElement.el);
      await afterQuerySuccess();
      getOverlayInstance().openOverlay();
      await afterDelay(1000);
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    describe('with a complex clickable field table element inside', () => {
      beforeEach(() => {
        addFieldEqualFilter('@filetype', 'youtubevideo');

        const cardOverlayElement = getOverlayElement();

        const fieldTableElement = $$(
          'table',
          {
            className: Component.computeCssClassName(FieldTable),
            'data-allow-minimization': 'false'
          },
          $$('tr', { 'data-field': '@author', 'data-caption': 'Author' })
        );

        const facetElement = $$('div', {
          className: Component.computeCssClassName(Facet),
          'data-field': '@author'
        });

        cardOverlayElement.append(fieldTableElement.el);
        getFacetColumn().appendChild(facetElement.el);
        testResultElement(cardOverlayElement.el);
      });

      it('should be accessible', async done => {
        await afterDeferredQuerySuccess();
        getOverlayInstance().openOverlay();
        await afterDelay(1000);
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });

      it('should be accessible when the clickable element is focused', async done => {
        await afterDeferredQuerySuccess();
        getOverlayInstance().openOverlay();
        await afterDelay(1000);
        $$(getRoot())
          .find('span.coveo-accessible-button')
          .focus();
        const axeResults = await axe.run(getRoot());
        expect(axeResults).toBeAccessible();
        done();
      });
    });
  });
};
