import { CategoryFacetBreadcrumb } from '../../../src/ui/CategoryFacet/CategoryFacetBreadcrumb';
import { $$ } from '../../../src/Core';
import { CategoryValueDescriptor, ICategoryFacetOptions } from '../../../src/ui/CategoryFacet/CategoryFacet';

export function CategoryFacetBreadcrumbTest() {
  describe('CategoryFacetBreadcrumb', () => {
    let categoryValueDescriptor: CategoryValueDescriptor;
    let categoryFacetOptions: ICategoryFacetOptions;

    function buildCategoryFacetBreadcrumb() {
      return new CategoryFacetBreadcrumb(categoryFacetOptions, () => {}, categoryValueDescriptor).build();
    }

    beforeEach(() => {
      categoryValueDescriptor = { value: 'value', count: 1, path: [] };
      categoryFacetOptions = {
        field: '@field',
        title: 'title',
        basePath: []
      };
    });

    it('build a breadcrumb', () => {
      const breadcrumb = buildCategoryFacetBreadcrumb();
      expect($$(breadcrumb).hasClass('coveo-category-facet-breadcrumb')).toBe(true);
    });

    it('has the right accessibility attributes', () => {
      categoryValueDescriptor.path = ['path_one', 'path_two'];
      const breadcrumb = buildCategoryFacetBreadcrumb();
      const breadcrumbValues = $$(breadcrumb).find('.coveo-category-facet-breadcrumb-values');
      expect(breadcrumbValues.getAttribute('aria-label')).toBe('Remove filter on path_one/path_two');
      expect(breadcrumbValues.getAttribute('role')).toBe('button');
      expect(breadcrumbValues.getAttribute('tabindex')).toBe('0');
    });

    it('calls the given click handler on click', () => {
      const clickHandler = jasmine.createSpy('handler');
      const breadcrumb = new CategoryFacetBreadcrumb(categoryFacetOptions, clickHandler, categoryValueDescriptor).build();

      $$(breadcrumb)
        .find('.coveo-category-facet-breadcrumb-values')
        .click();

      expect(clickHandler).toHaveBeenCalled();
    });

    it('build a breadcrumb with the full path if there is no base path', () => {
      categoryValueDescriptor.path = ['path_one', 'path_two'];
      const breadcrumb = buildCategoryFacetBreadcrumb();
      const values = $$(breadcrumb).find('.coveo-category-facet-breadcrumb-values');
      expect($$(values).text()).toEqual('path_one/path_two');
    });

    it('build a breadcrumb without the full path if there is a base path', () => {
      categoryValueDescriptor.path = ['path_one', 'path_two'];
      categoryFacetOptions.basePath = ['path_one'];

      const breadcrumb = buildCategoryFacetBreadcrumb();
      const values = $$(breadcrumb).find('.coveo-category-facet-breadcrumb-values');
      expect($$(values).text()).toEqual('path_two');
    });
  });
}
