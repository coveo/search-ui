import { DynamicHierarchicalFacet } from '../../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacet';
import { DynamicHierarchicalFacetBreadcrumb } from '../../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacetBreadcrumb';
import { DynamicHierarchicalFacetTestUtils } from './DynamicHierarchicalFacetTestUtils';
import { $$ } from '../../../src/Core';
import { analyticsActionCauseList } from '../../../src/ui/Analytics/AnalyticsActionListMeta';

export function DynamicHierarchicalFacetBreadcrumbTest() {
  describe('DynamicHierarchicalFacetBreadcrumb', () => {
    let facet: DynamicHierarchicalFacet;
    let breadcrumbs: DynamicHierarchicalFacetBreadcrumb;

    function titleElement() {
      return $$(breadcrumbs.element).find('.coveo-dynamic-facet-breadcrumb-title');
    }

    function valueElement() {
      return $$(breadcrumbs.element).find('.coveo-dynamic-facet-breadcrumb-value');
    }

    describe('with standard values', () => {
      beforeEach(() => {
        initializeComponent();
      });

      function initializeComponent() {
        facet = DynamicHierarchicalFacetTestUtils.createAdvancedFakeFacet().cmp;
        facet.values.createFromResponse(DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(facet));
        facet.selectPath(['test', 'allo']);
        breadcrumbs = new DynamicHierarchicalFacetBreadcrumb(facet);
      }

      it('should create a title', () => {
        expect(titleElement().innerText).toBe(`${facet.options.title}:`);
      });

      it('should create a value with the right path', () => {
        expect(valueElement().childNodes[0].nodeValue).toBe('test / allo');
      });

      it(`when clicking on a breadcrumb value element
        it should clear the facet value`, () => {
        spyOn(facet, 'reset');
        spyOn(facet, 'triggerNewQuery');
        $$(valueElement()).trigger('click');

        expect(facet.reset).toHaveBeenCalled();
        expect(facet.triggerNewQuery).toHaveBeenCalled();
      });

      it(`when clicking on a breadcrumb value element
        it should trigger a new query`, () => {
        spyOn(facet, 'triggerNewQuery');
        $$(valueElement()).trigger('click');
        expect(facet.triggerNewQuery).toHaveBeenCalled();
      });

      it(`when clicking on a breadcrumb value element
        it call reset on the facet`, () => {
        spyOn(facet, 'reset');

        $$(valueElement()).trigger('click');
        expect(facet.reset).toHaveBeenCalled();
      });

      it(`when clicking on a breadcrumb value element
        it should log an analytics event`, () => {
        spyOn(facet, 'logAnalyticsEvent');
        facet.triggerNewQuery = beforeExecuteQuery => {
          beforeExecuteQuery();
        };

        $$(valueElement()).trigger('click');
        expect(facet.logAnalyticsEvent).toHaveBeenCalledWith(analyticsActionCauseList.breadcrumbFacet);
      });

      it('should have the correct aria-label for a selected value', () => {
        expect(valueElement().getAttribute('aria-label')).toBe('Remove inclusion filter on test / allo');
      });
    });

    describe('with malicious value', () => {
      beforeEach(() => {
        initializeComponent();
      });

      function initializeComponent() {
        facet = DynamicHierarchicalFacetTestUtils.createAdvancedFakeFacet().cmp;
        facet.values.createFromResponse(DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(facet));
        facet.selectPath(['<iframe>', '<img onload="">']);
        breadcrumbs = new DynamicHierarchicalFacetBreadcrumb(facet);
      }

      it('should create a value with the right path', () => {
        expect(valueElement().textContent).toContain('<iframe> / <img onload="">');
      });
    });
  });
}
