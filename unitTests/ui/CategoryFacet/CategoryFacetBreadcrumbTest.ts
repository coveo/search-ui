import { CategoryFacetBreadcrumb } from '../../../src/ui/CategoryFacet/CategoryFacetBreadcrumb';
import { $$ } from '../../../src/Core';
import { CategoryValueDescriptor, ICategoryFacetOptions, CategoryFacet } from '../../../src/ui/CategoryFacet/CategoryFacet';
import { optionsComponentSetup } from '../../MockEnvironment';

export function CategoryFacetBreadcrumbTest() {
  describe('CategoryFacetBreadcrumb', () => {
    let categoryFacet: CategoryFacet;
    let categoryValueDescriptor: CategoryValueDescriptor;
    let categoryFacetOptions: ICategoryFacetOptions;

    function buildCategoryFacetBreadcrumb() {
      return new CategoryFacetBreadcrumb(categoryFacet, () => {}, categoryValueDescriptor).build();
    }

    function initCategoryFacet() {
      categoryFacet = optionsComponentSetup<CategoryFacet, ICategoryFacetOptions>(CategoryFacet, categoryFacetOptions).cmp;
    }

    beforeEach(() => {
      categoryValueDescriptor = { value: 'value', count: 1, path: [] };
      categoryFacetOptions = {
        field: '@field',
        title: 'title',
        basePath: []
      };

      initCategoryFacet();
    });

    it('build a breadcrumb', () => {
      const breadcrumb = buildCategoryFacetBreadcrumb();
      expect($$(breadcrumb).hasClass('coveo-category-facet-breadcrumb')).toBe(true);
    });

    it('calls the given click handler on click', () => {
      const clickHandler = jasmine.createSpy('handler');
      const breadcrumb = new CategoryFacetBreadcrumb(categoryFacet, clickHandler, categoryValueDescriptor).build();

      $$(breadcrumb)
        .find('.coveo-category-facet-breadcrumb-values')
        .click();

      expect(clickHandler).toHaveBeenCalled();
    });

    describe(`when the categoryValueDescriptor #path is a populated array`, () => {
      beforeEach(() => (categoryValueDescriptor.path = ['path_one', 'path_two']));

      it('has the right accessibility attributes', () => {
        const breadcrumb = buildCategoryFacetBreadcrumb();
        const breadcrumbValues = $$(breadcrumb).find('.coveo-category-facet-breadcrumb-values');
        expect(breadcrumbValues.getAttribute('aria-label')).toBe('Remove inclusion filter on path_one/path_two');
        expect(breadcrumbValues.getAttribute('role')).toBe('button');
        expect(breadcrumbValues.getAttribute('tabindex')).toBe('0');
      });

      it('build a breadcrumb with the full path if there is no base path', () => {
        const breadcrumb = buildCategoryFacetBreadcrumb();
        const values = $$(breadcrumb).find('.coveo-category-facet-breadcrumb-values');
        expect(values.childNodes[0].nodeValue).toEqual('path_one/path_two');
      });

      it('build a breadcrumb without the full path if there is a base path', () => {
        categoryFacetOptions.basePath = ['path_one'];

        const breadcrumb = buildCategoryFacetBreadcrumb();
        const values = $$(breadcrumb).find('.coveo-category-facet-breadcrumb-values');
        expect(values.childNodes[0].nodeValue).toEqual('path_two');
      });

      it(`when the categoryFacet has the valueCaption option configured,
      it renders a path whose parts are captioned`, () => {
        const firstPartOfPath = categoryValueDescriptor.path[0];
        const caption = `${firstPartOfPath}_caption`;

        categoryFacetOptions.valueCaption = { [firstPartOfPath]: caption };
        initCategoryFacet();

        const breadcrumb = buildCategoryFacetBreadcrumb();
        const values = $$(breadcrumb).find('.coveo-category-facet-breadcrumb-values');

        expect(values.textContent).toContain(caption);
      });
    });
  });
}
