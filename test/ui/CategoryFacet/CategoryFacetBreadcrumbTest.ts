import { CategoryFacetBreadcrumb } from '../../../src/ui/CategoryFacet/CategoryFacetBreadcrumb';
import { $$ } from '../../../src/Core';
import { CategoryValueDescriptor } from '../../../src/ui/CategoryFacet/CategoryFacet';
export function CategoryFacetBreadcrumbTest() {
  describe('CategoryFacetBreadcrumb', () => {
    const categoryValueDescriptor: CategoryValueDescriptor = { value: 'value', count: 1, path: [] };
    it('build a breadcrumb', () => {
      const breadcrumb = new CategoryFacetBreadcrumb('title', () => {}, categoryValueDescriptor).build();
      expect($$(breadcrumb).hasClass('coveo-category-facet-breadcrumb')).toBe(true);
    });

    it('calls the given click handler on click', () => {
      const clickHandler = jasmine.createSpy('handler');
      const breadcrumb = new CategoryFacetBreadcrumb('title', clickHandler, categoryValueDescriptor).build();

      $$(breadcrumb).trigger('click');

      expect(clickHandler).toHaveBeenCalled();
    });
  });
}
