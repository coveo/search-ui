import { CategoryFacetBreadcrumb } from '../../../src/ui/CategoryFacet/CategoryFacetBreadcrumb';
import { $$ } from '../../../src/Core';
export function CategoryFacetBreadcrumbTest() {
  describe('CategoryFacetBreadcrumb', () => {
    it('build a breadcrumb', () => {
      const breadcrumb = new CategoryFacetBreadcrumb('title', [], () => {}, 'caption', 'count').build();
      expect($$(breadcrumb).hasClass('coveo-category-facet-breadcrumb')).toBe(true);
    });

    it('calls the given click handler on click', () => {
      const clickHandler = jasmine.createSpy('handler');
      const breadcrumb = new CategoryFacetBreadcrumb('title', [], clickHandler, 'caption', 'count').build();

      $$(breadcrumb).trigger('click');

      expect(clickHandler).toHaveBeenCalled();
    });
  });
}
