import { $$, Dom } from '../../src/utils/Dom';
import { InitializationPlaceholder } from '../../src/ui/Base/InitializationPlaceholder';
import { InitializationEvents } from '../../src/events/InitializationEvents';
import { QueryEvents } from '../../src/events/QueryEvents';
import { ResultListEvents } from '../../src/events/ResultListEvents';

export function InitializationPlaceholderTest() {
  describe('InitializationPlaceholder', () => {
    let root: Dom;

    beforeEach(() => {
      root = $$('div');
    });

    afterEach(() => {
      root = null;
    });

    describe('with full initialization styling', () => {
      beforeEach(() => {
        new InitializationPlaceholder(root.el).withFullInitializationStyling();
      });

      it('should add the needed class', () => {
        expect(root.hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(true);
      });

      it('should remove the needed class after components initialization', () => {
        $$(root).trigger(InitializationEvents.afterComponentsInitialization);
        expect(root.hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(false);
      });
    });

    describe('for facets', () => {
      it('should add correct css class for facets', () => {
        const oneFacet = $$('div', { className: 'CoveoFacet' });
        root.append(oneFacet.el);
        new InitializationPlaceholder(root.el).withPlaceholderForFacets();
        expect(oneFacet.hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(true);
      });

      it('should add correct css class for facets range', () => {
        const oneFacet = $$('div', { className: 'CoveoFacetRange' });
        root.append(oneFacet.el);
        new InitializationPlaceholder(root.el).withPlaceholderForFacets();
        expect(oneFacet.hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(true);
      });

      it('should add correct css class for facets slider', () => {
        const oneFacet = $$('div', { className: 'CoveoFacetSlider' });
        root.append(oneFacet.el);
        new InitializationPlaceholder(root.el).withPlaceholderForFacets();
        expect(oneFacet.hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(true);
      });

      it('should add correct css class for hierarchical facet', () => {
        const oneFacet = $$('div', { className: 'CoveoHierarchicalFacet' });
        root.append(oneFacet.el);
        new InitializationPlaceholder(root.el).withPlaceholderForFacets();
        expect(oneFacet.hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(true);
      });

      it('should transform the first 3 facets as a placeholder', () => {
        const oneFacet = $$('div', { className: 'CoveoFacet' });
        const twoFacet = $$('div', { className: 'CoveoFacet' });
        const threeFacet = $$('div', { className: 'CoveoFacet' });
        const fourFacet = $$('div', { className: 'CoveoFacet' });
        root.append(oneFacet.el);
        root.append(twoFacet.el);
        root.append(threeFacet.el);
        root.append(fourFacet.el);

        new InitializationPlaceholder(root.el).withPlaceholderForFacets();

        expect(oneFacet.hasClass('coveo-with-placeholder')).toBe(true);
        expect(twoFacet.hasClass('coveo-with-placeholder')).toBe(true);
        expect(threeFacet.hasClass('coveo-with-placeholder')).toBe(true);
        expect(fourFacet.hasClass('coveo-with-placeholder')).toBe(false);
      });

      it('should remove placeholder for facet after components are initialized and after the first deferredQuerySucess', () => {
        const oneFacet = $$('div', { className: 'CoveoFacet' });
        root.append(oneFacet.el);

        new InitializationPlaceholder(root.el).withPlaceholderForFacets();

        expect(oneFacet.hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(true);
        expect(oneFacet.hasClass('coveo-with-placeholder')).toBe(true);

        $$(root).trigger(InitializationEvents.afterComponentsInitialization);
        $$(root).trigger(QueryEvents.deferredQuerySuccess);

        expect(oneFacet.hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(false);
        expect(oneFacet.hasClass('coveo-with-placeholder')).toBe(false);
      });

      it('should remove placeholder for facet after components are initialized and after the first query error', () => {
        const oneFacet = $$('div', { className: 'CoveoFacet' });
        root.append(oneFacet.el);

        new InitializationPlaceholder(root.el).withPlaceholderForFacets();

        $$(root).trigger(InitializationEvents.afterComponentsInitialization);
        $$(root).trigger(QueryEvents.queryError);

        expect(oneFacet.hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(false);
        expect(oneFacet.hasClass('coveo-with-placeholder')).toBe(false);
      });

      it('should allow to modify the events on which facets placeholder will listen to remove the placeholder', () => {
        const oneFacet = $$('div', { className: 'CoveoFacet' });
        root.append(oneFacet.el);

        new InitializationPlaceholder(root.el).withEventToRemovePlaceholder(QueryEvents.doneBuildingQuery).withPlaceholderForFacets();

        $$(root).trigger(QueryEvents.doneBuildingQuery);
        $$(root).trigger(QueryEvents.deferredQuerySuccess);

        expect(oneFacet.hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(false);
        expect(oneFacet.hasClass('coveo-with-placeholder')).toBe(false);
      });
    });

    describe('for searchbox', () => {
      let searchbox: Dom;

      beforeEach(() => {
        searchbox = $$('div', { className: 'CoveoSearchbox' });
        root.append(searchbox.el);
        new InitializationPlaceholder(root.el).withPlaceholderSearchbox();
      });

      afterEach(() => {
        searchbox = null;
      });

      it('should add the needed css class on the searchbox', () => {
        expect(searchbox.hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(true);
      });

      it('should remove the needed css class after components initialization', () => {
        $$(root).trigger(InitializationEvents.afterComponentsInitialization);
        expect(searchbox.hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(false);
      });
    });

    describe('for result list', () => {
      let resultList: Dom;

      beforeEach(() => {
        resultList = $$('div', { className: 'CoveoResultList' });
        root.append(resultList.el);
        new InitializationPlaceholder(root.el).withPlaceholderForResultList();
      });

      afterEach(() => {
        resultList = null;
      });

      it('should add the needed css class on the result list', () => {
        expect(resultList.hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(true);
        expect(resultList.hasClass('coveo-with-placeholder')).toBe(true);
      });

      it('should remove the needed css class when a new result is displayed', () => {
        $$(root).trigger(ResultListEvents.newResultDisplayed);
        expect(resultList.hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(false);
      });

      it('should take the first result list of type "list" and transform it to a placeholder', () => {
        let secondResultList = $$('div', { className: 'CoveoResultList', 'data-layout': 'card' });
        $$(root).prepend(secondResultList.el);

        new InitializationPlaceholder(root.el).withPlaceholderForResultList();

        expect($$(resultList.el).hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(true);
        expect($$(secondResultList.el).hasClass(InitializationPlaceholder.INITIALIZATION_CLASS)).toBe(true);
        expect($$(resultList.el).hasClass('coveo-with-placeholder')).toBe(true);
        expect($$(secondResultList.el).hasClass('coveo-with-placeholder')).toBe(false);
      });
    });

    describe('with waiting for first query mode', () => {
      beforeEach(() => {
        new InitializationPlaceholder(root.el).withWaitingForFirstQueryMode();
      });

      it('should add the needed css class on the root element', () => {
        expect($$(root.el).hasClass('coveo-waiting-for-query')).toBe(true);
      });

      it('should quit waiting for first query when the first query is launched', () => {
        $$(root.el).trigger(QueryEvents.duringQuery);
        expect($$(root.el).hasClass('coveo-waiting-for-query')).toBe(false);
      });
    });

    it('should allow to hide the root element', () => {
      new InitializationPlaceholder(root.el).withHiddenRootElement();
      expect($$(root.el).hasClass('coveo-hidden')).toBe(true);
    });

    it('should allow to show the root element', () => {
      new InitializationPlaceholder(root.el).withHiddenRootElement().withVisibleRootElement();
      expect($$(root.el).hasClass('coveo-hidden')).toBe(false);
    });
  });
}
