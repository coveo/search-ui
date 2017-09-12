import { Facet, IFacetOptions } from '../../src/ui/Facet/Facet';
import * as Mock from '../MockEnvironment';
import { FacetValue } from '../../src/ui/Facet/FacetValues';
import { ValueElement } from '../../src/ui/Facet/ValueElement';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { ValueElementRenderer } from '../../src/ui/Facet/ValueElementRenderer';

export function ValueElementTest() {
  describe('ValueElementTest', () => {
    let facet: Facet;
    let facetValue: FacetValue;
    let valueElementRenderer: ValueElementRenderer;
    let valueElement: ValueElement;

    beforeEach(() => {
      facet = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
        field: '@field'
      }).cmp;
      facetValue = new FacetValue();
      facetValue.value = 'value';

      valueElementRenderer = new ValueElementRenderer(facet, facetValue);
      spyOn(valueElementRenderer, 'setCssClassOnListValueElement');

      valueElement = new ValueElement(facet, facetValue);
      valueElement.renderer = valueElementRenderer;
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
  });
}
