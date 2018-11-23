import { optionsComponentSetup } from '../../MockEnvironment';
import { CategoryFacet, ICategoryFacetOptions, CategoryValueDescriptor } from '../../../src/ui/CategoryFacet/CategoryFacet';
import { CategoryValue } from '../../../src/ui/CategoryFacet/CategoryValue';
import { CategoryFacetTemplates } from '../../../src/ui/CategoryFacet/CategoryFacetTemplates';
import { $$, KEYBOARD } from '../../../src/Core';
import { Simulate } from '../../Simulate';
export function CategoryValueTest() {
  describe('CategoryValue', () => {
    let categoryValueDescriptor: CategoryValueDescriptor = {
      value: 'value',
      count: 3,
      path: ['1', '2', '3']
    };

    let categoryFacet: CategoryFacet;

    const makeCategoryValue = (path = categoryValueDescriptor.path) => {
      categoryValueDescriptor.path = path;
      categoryFacet = optionsComponentSetup<CategoryFacet, ICategoryFacetOptions>(CategoryFacet, {
        field: '@field',
        maximumDepth: 3
      }).cmp;

      return new CategoryValue($$('div'), categoryValueDescriptor, new CategoryFacetTemplates(), categoryFacet);
    };

    describe('when it is selectable', () => {
      it('does not call changeActivePath if we reached maximumDepth', () => {
        const categoryValue = makeCategoryValue().makeSelectable();
        spyOn(categoryFacet, 'changeActivePath');
        $$($$(categoryValue.element).find('.coveo-category-facet-value-label')).trigger('click');
        expect(categoryFacet.changeActivePath).not.toHaveBeenCalled();
      });

      it('calls changeActivePath on click when below or equal maximumDepth', () => {
        const categoryValue = makeCategoryValue(['1', '2']).makeSelectable();
        spyOn(categoryFacet, 'changeActivePath');
        $$($$(categoryValue.element).find('.coveo-category-facet-value-label')).trigger('click');
        expect(categoryFacet.changeActivePath).toHaveBeenCalled();
      });

      it('calls changeActivePath on enter keyup when below or equal maximumDepth', () => {
        const categoryValue = makeCategoryValue(['1', '2']).makeSelectable();
        spyOn(categoryFacet, 'changeActivePath');
        Simulate.keyUp($$(categoryValue.element).find('.coveo-category-facet-value-label'), KEYBOARD.ENTER);
        expect(categoryFacet.changeActivePath).toHaveBeenCalled();
      });
    });

    it('does not call changeActivePath on click by default', () => {
      const categoryValue = makeCategoryValue();
      spyOn(categoryFacet, 'changeActivePath');
      $$($$(categoryValue.element).find('.coveo-category-facet-value-label')).trigger('click');
      expect(categoryFacet.changeActivePath).not.toHaveBeenCalled();
    });

    it('does not call changeActivePath on enter keyup by default', () => {
      const categoryValue = makeCategoryValue();
      spyOn(categoryFacet, 'changeActivePath');
      Simulate.keyUp($$(categoryValue.element).find('.coveo-category-facet-value-label'), KEYBOARD.ENTER);
      expect(categoryFacet.changeActivePath).not.toHaveBeenCalled();
    });
  });
}
