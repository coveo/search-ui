import { CategoryFacet } from '../../../src/ui/CategoryFacet/CategoryFacet';
import { CategoryFacetBreadcrumb } from '../../../src/ui/CategoryFacet/CategoryFacetBreadcrumb';
import { CategoryFacetTestUtils } from './CategoryFacetTestUtils';
import { $$ } from '../../../src/Core';
import { analyticsActionCauseList } from '../../../src/ui/Analytics/AnalyticsActionListMeta';

export function CategoryFacetBreadcrumbTest() {
  describe('CategoryFacetBreadcrumb', () => {
    let facet: CategoryFacet;
    let breadcrumbs: CategoryFacetBreadcrumb;

    beforeEach(() => {
      initializeComponent();
    });

    function initializeComponent() {
      facet = CategoryFacetTestUtils.createAdvancedFakeFacet().cmp;
      facet.values.createFromResponse(CategoryFacetTestUtils.getCompleteFacetResponse(facet));
      facet.selectPath(['test', 'allo']);
      breadcrumbs = new CategoryFacetBreadcrumb(facet);
    }

    function titleElement() {
      return $$(breadcrumbs.element).find('.coveo-dynamic-facet-breadcrumb-title');
    }

    function valueElement() {
      return $$(breadcrumbs.element).find('.coveo-dynamic-facet-breadcrumb-value');
    }

    it('should create a title', () => {
      expect(titleElement().innerText).toBe(`${facet.options.title}:`);
    });

    it('should create a value with the right path', () => {
      expect(valueElement().innerText).toBe('test / allo');
    });

    it(`when clicking on a breadcrumb value element
      it should clear the facet value`, () => {
      spyOn(facet, 'clear');
      $$(valueElement()).trigger('click');

      expect(facet.clear).toHaveBeenCalled();
    });

    it(`when clicking on a breadcrumb value element
      it should trigger a new query`, () => {
      spyOn(facet, 'triggerNewQuery');
      $$(valueElement()).trigger('click');
      expect(facet.triggerNewQuery).toHaveBeenCalled();
    });

    it(`when clicking on a breadcrumb value element
      it should log an analytics event`, () => {
      spyOn(facet, 'logAnalyticsEvent');
      facet.triggerNewQuery = beforeExecuteQuery => {
        beforeExecuteQuery();
      };

      $$(valueElement()).trigger('click');
      expect(facet.logAnalyticsEvent).toHaveBeenCalledWith(
        analyticsActionCauseList.categoryFacetBreadcrumb
      );
    });
  });
}
