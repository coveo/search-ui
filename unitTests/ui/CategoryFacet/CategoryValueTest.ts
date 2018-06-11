import { optionsComponentSetup } from '../../MockEnvironment';
import { CategoryFacet, ICategoryFacetOptions, CategoryValueDescriptor } from '../../../src/ui/CategoryFacet/CategoryFacet';
import { CategoryValue } from '../../../src/ui/CategoryFacet/CategoryValue';
import { CategoryFacetTemplates } from '../../../src/ui/CategoryFacet/CategoryFacetTemplates';
import { $$ } from '../../../src/Core';
export function CategoryValueTest() {
  describe('CategoryValue', () => {
    let categoryValueDescriptor: CategoryValueDescriptor = {
      value: 'value',
      count: 3,
      path: ['1', '2', '3']
    };
    it('does not call changeActivePath if we reached maximumDepth', () => {
      const categoryFacet = optionsComponentSetup<CategoryFacet, ICategoryFacetOptions>(CategoryFacet, {
        field: '@field',
        maximumDepth: 3
      }).cmp;
      const categoryValue = new CategoryValue($$('div'), categoryValueDescriptor, new CategoryFacetTemplates(), categoryFacet);
      spyOn(categoryFacet, 'changeActivePath');

      $$($$(categoryValue.element).find('.coveo-category-facet-value-label')).trigger('click');

      expect(categoryFacet.changeActivePath).not.toHaveBeenCalled();
    });

    it('calls changeActivePath on click when below or equal maximumDepth', () => {
      categoryValueDescriptor.path = ['1', '2'];
      const categoryFacet = optionsComponentSetup<CategoryFacet, ICategoryFacetOptions>(CategoryFacet, {
        field: '@field',
        maximumDepth: 3
      }).cmp;
      const categoryValue = new CategoryValue($$('div'), categoryValueDescriptor, new CategoryFacetTemplates(), categoryFacet);
      spyOn(categoryFacet, 'changeActivePath');

      $$($$(categoryValue.element).find('.coveo-category-facet-value-label')).trigger('click');

      expect(categoryFacet.changeActivePath).toHaveBeenCalled();
    });
  });
}
