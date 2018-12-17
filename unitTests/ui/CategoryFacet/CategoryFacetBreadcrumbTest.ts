import { CategoryFacetBreadcrumb } from '../../../src/ui/CategoryFacet/CategoryFacetBreadcrumb';
import { $$ } from '../../../src/Core';
import { CategoryValueDescriptor } from '../../../src/ui/CategoryFacet/CategoryFacet';
export function CategoryFacetBreadcrumbTest() {
  describe('CategoryFacetBreadcrumb', () => {
    let categoryValueDescriptor: CategoryValueDescriptor;

    beforeEach(() => {
      categoryValueDescriptor = { value: 'value', count: 1, path: [] };
    });

    it('build a breadcrumb', () => {
      const breadcrumb = new CategoryFacetBreadcrumb('title', () => {}, categoryValueDescriptor, []).build();
      expect($$(breadcrumb).hasClass('coveo-category-facet-breadcrumb')).toBe(true);
    });

    it('calls the given click handler on click', () => {
      const clickHandler = jasmine.createSpy('handler');
      const breadcrumb = new CategoryFacetBreadcrumb('title', clickHandler, categoryValueDescriptor, []).build();

      $$(breadcrumb).trigger('click');

      expect(clickHandler).toHaveBeenCalled();
    });

    it('build a breadcrumb with the full path if there is no base path', () => {
      categoryValueDescriptor.path = ['path_one', 'path_two'];
      const breadcrumb = new CategoryFacetBreadcrumb('title', () => {}, categoryValueDescriptor, []).build();
      const values = $$(breadcrumb).find('.coveo-category-facet-breadcrumb-values');
      expect($$(values).text()).toEqual('path_one/path_two');
    });

    it('build a breadcrumb without the full path if there is a base path', () => {
      categoryValueDescriptor.path = ['path_one', 'path_two'];
      const breadcrumb = new CategoryFacetBreadcrumb('title', () => {}, categoryValueDescriptor, ['path_one']).build();
      const values = $$(breadcrumb).find('.coveo-category-facet-breadcrumb-values');
      expect($$(values).text()).toEqual('path_two');
    });
  });
}
