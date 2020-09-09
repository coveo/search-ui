import { Facet, IFacetOptions } from '../../src/ui/Facet/Facet';
import * as Mock from '../MockEnvironment';
import { FacetValue } from '../../src/ui/Facet/FacetValue';
import { ValueElement } from '../../src/ui/Facet/ValueElement';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { ValueElementRenderer } from '../../src/ui/Facet/ValueElementRenderer';
import { Dom, $$ } from '../../src/Core';
import { mapObject, Dictionary } from 'underscore';
import { MockHTMLElement } from '../MockElement';

function countValues<T>(dictionaryToCount: Dictionary<T[]>) {
  return mapObject(dictionaryToCount, listeners => listeners.length);
}

export function ValueElementTest() {
  describe('ValueElementTest', () => {
    let facet: Facet;
    let facetValue: FacetValue;
    let valueElementRenderer: ValueElementRenderer;
    let valueElement: ValueElement;

    let mockLabel: MockHTMLElement;
    let mockStylishCheckbox: MockHTMLElement;
    let mockExcludeIcon: MockHTMLElement;
    let mockCheckbox: MockHTMLElement;

    function mockRenderer() {
      const renderer = Mock.mock(ValueElementRenderer) as ValueElementRenderer;
      renderer.label = (mockLabel = new MockHTMLElement()).element;
      renderer.stylishCheckbox = (mockStylishCheckbox = new MockHTMLElement()).element;
      renderer.excludeIcon = (mockExcludeIcon = new MockHTMLElement()).element;
      renderer.checkbox = (mockCheckbox = new MockHTMLElement()).element;
      return renderer;
    }

    function bindEvents() {
      valueElement.bindEvent({ displayNextTime: true, pinFacet: true });
    }

    beforeEach(() => {
      Dom.useNativeJavaScriptEvents = true;
      facet = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
        field: '@field'
      }).cmp;
      facetValue = Mock.mock(FacetValue);
      facetValue.excluded = false;
      facetValue.selected = false;

      valueElement = new ValueElement(facet, facetValue);
      valueElement.renderer = valueElementRenderer = mockRenderer();
    });

    it('should send one exclude UA event when excluding a facet value', () => {
      facetValue.excluded = false;
      facet.queryController.executeQuery = options => {
        options.beforeExecuteQuery();
        return Promise.resolve();
      };

      valueElement.toggleExcludeWithUA();

      expect(facet.usageAnalytics.logSearchEvent).toHaveBeenCalledTimes(1);
      expect(facet.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.facetExclude, jasmine.any(Object));
    });

    it('should select facet value when select is called', () => {
      valueElement.select();

      expect(facetValue.selected).toBe(true);
      expect(facetValue.excluded).toBe(false);
      expect(valueElementRenderer.setCssClassOnListValueElement).toHaveBeenCalled();
    });

    it('should unselect facet value when unselect is called', () => {
      valueElement.unselect();

      expect(facetValue.selected).toBe(false);
      expect(facetValue.excluded).toBe(false);
      expect(valueElementRenderer.setCssClassOnListValueElement).toHaveBeenCalled();
    });

    it('should exclude facet value when exclude is called', () => {
      valueElement.exclude();

      expect(facetValue.selected).toBe(false);
      expect(facetValue.excluded).toBe(true);
      expect(valueElementRenderer.setCssClassOnListValueElement).toHaveBeenCalled();
    });

    it('should unexclude facet value element when unexclude is called', () => {
      valueElement.unexclude();

      expect(facetValue.selected).toBe(false);
      expect(facetValue.excluded).toBe(false);
      expect(valueElementRenderer.setCssClassOnListValueElement).toHaveBeenCalled();
    });

    describe('unselected and not excluded', () => {
      beforeEach(() => {
        bindEvents();
      });

      it('binds a click event to the label', () => {
        expect(countValues(mockLabel.eventListeners)).toEqual({ click: 1 });
      });

      it('binds a keydown event to the stylishCheckbox', () => {
        expect(countValues(mockStylishCheckbox.eventListeners)).toEqual({ keydown: 1 });
      });

      it('binds a click and a keydown event to the excludeIcon', () => {
        expect(countValues(mockExcludeIcon.eventListeners)).toEqual({ click: 1, keydown: 1 });
      });

      it('binds a change event to the checkbox', () => {
        expect(countValues(mockCheckbox.eventListeners)).toEqual({ change: 1 });
      });

      it('when the click event on the label is triggered, triggers the change event on the checkbox', () => {
        expect(mockCheckbox.manualEventTriggers).toEqual({});
        $$(mockLabel.element).trigger('click');
        expect(countValues(mockCheckbox.manualEventTriggers)).toEqual({ change: 1 });
      });
    });

    describe('unselected and excluded', () => {
      beforeEach(() => {
        valueElement.exclude();
        bindEvents();
      });

      it('binds a click event to the label', () => {
        expect(countValues(mockLabel.eventListeners)).toEqual({ click: 1 });
      });

      it('binds a keydown event to the stylishCheckbox', () => {
        expect(countValues(mockStylishCheckbox.eventListeners)).toEqual({ keydown: 1 });
      });

      it('binds a click and a keydown event to the excludeIcon', () => {
        expect(countValues(mockExcludeIcon.eventListeners)).toEqual({ click: 1, keydown: 1 });
      });

      it('binds a change event to the checkbox', () => {
        expect(countValues(mockCheckbox.eventListeners)).toEqual({ change: 1 });
      });

      it('when the click event on the label is triggered, does not trigger the change event on the checkbox', () => {
        $$(mockLabel.element).trigger('click');
        expect(mockCheckbox.manualEventTriggers).toEqual({});
      });
    });
  });
}
