import { optionsComponentSetup } from '../../MockEnvironment';
import { CategoryFacet, ICategoryFacetOptions, CategoryValueDescriptor } from '../../../src/ui/CategoryFacet/CategoryFacet';
import { CategoryValue } from '../../../src/ui/CategoryFacet/CategoryValue';
import { CategoryFacetTemplates } from '../../../src/ui/CategoryFacet/CategoryFacetTemplates';
import { $$, KEYBOARD } from '../../../src/Core';
import { Simulate } from '../../Simulate';
export function CategoryValueTest() {
  describe('CategoryValue', () => {
    let categoryValueDescriptor: CategoryValueDescriptor;
    let categoryFacet: CategoryFacet;
    let categoryFacetOptions: ICategoryFacetOptions;

    function initCategoryValueDescriptor() {
      categoryValueDescriptor = {
        value: 'value',
        count: 3,
        path: ['1', '2', '3']
      };
    }

    function initCategoryFacetOptions() {
      categoryFacetOptions = {
        field: '@field',
        maximumDepth: 3
      };
    }

    function initCategoryFacet() {
      categoryFacet = optionsComponentSetup<CategoryFacet, ICategoryFacetOptions>(CategoryFacet, categoryFacetOptions).cmp;
    }

    function buildCategoryValue() {
      return new CategoryValue($$('div'), categoryValueDescriptor, new CategoryFacetTemplates(), categoryFacet);
    }

    beforeEach(() => {
      initCategoryValueDescriptor();
      initCategoryFacetOptions();
      initCategoryFacet();
    });

    it('when at maximumDepth, it does not call changeActivePath', () => {
      const categoryValue = buildCategoryValue().makeSelectable();
      spyOn(categoryFacet, 'changeActivePath');
      $$($$(categoryValue.element).find('.coveo-category-facet-value-label')).trigger('click');
      expect(categoryFacet.changeActivePath).not.toHaveBeenCalled();
    });

    describe('when below maximumDepth, when it is selectable', () => {
      beforeEach(() => (categoryValueDescriptor.path = ['1', '2']));

      it('calls changeActivePath on click', () => {
        const categoryValue = buildCategoryValue().makeSelectable();
        spyOn(categoryFacet, 'changeActivePath');
        $$($$(categoryValue.element).find('.coveo-category-facet-value-label')).trigger('click');
        expect(categoryFacet.changeActivePath).toHaveBeenCalled();
      });

      it('calls changeActivePath on enter keyup', () => {
        const categoryValue = buildCategoryValue().makeSelectable();
        spyOn(categoryFacet, 'changeActivePath');
        Simulate.keyUp($$(categoryValue.element).find('.coveo-category-facet-value-label'), KEYBOARD.ENTER);
        expect(categoryFacet.changeActivePath).toHaveBeenCalled();
      });
    });

    it('does not call changeActivePath on click by default', () => {
      const categoryValue = buildCategoryValue();
      spyOn(categoryFacet, 'changeActivePath');
      $$($$(categoryValue.element).find('.coveo-category-facet-value-label')).trigger('click');
      expect(categoryFacet.changeActivePath).not.toHaveBeenCalled();
    });

    it('does not call changeActivePath on enter keyup by default', () => {
      const categoryValue = buildCategoryValue();
      spyOn(categoryFacet, 'changeActivePath');
      Simulate.keyUp($$(categoryValue.element).find('.coveo-category-facet-value-label'), KEYBOARD.ENTER);
      expect(categoryFacet.changeActivePath).not.toHaveBeenCalled();
    });
  });
}
