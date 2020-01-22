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

    function categoryValueElement(categoryValue: CategoryValue) {
      return $$(categoryValue.element).find('.coveo-category-facet-value-label');
    }

    beforeEach(() => {
      initCategoryValueDescriptor();
      initCategoryFacetOptions();
      initCategoryFacet();
    });

    it('when at maximumDepth, it does not call changeActivePath', () => {
      const categoryValue = buildCategoryValue().makeSelectable();
      spyOn(categoryFacet, 'changeActivePath');
      $$(categoryValueElement(categoryValue)).trigger('click');
      expect(categoryFacet.changeActivePath).not.toHaveBeenCalled();
    });

    describe('when below maximumDepth, when it is selectable', () => {
      beforeEach(() => (categoryValueDescriptor.path = ['1', '2']));

      it('calls changeActivePath on click', () => {
        const categoryValue = buildCategoryValue().makeSelectable();
        spyOn(categoryFacet, 'changeActivePath');
        $$(categoryValueElement(categoryValue)).trigger('click');
        expect(categoryFacet.changeActivePath).toHaveBeenCalled();
      });

      it('calls changeActivePath on enter keyup', () => {
        const categoryValue = buildCategoryValue().makeSelectable();
        spyOn(categoryFacet, 'changeActivePath');
        Simulate.keyUp(categoryValueElement(categoryValue), KEYBOARD.ENTER);
        expect(categoryFacet.changeActivePath).toHaveBeenCalled();
      });

      it('calls scrollToTop on click', () => {
        const categoryValue = buildCategoryValue().makeSelectable();
        spyOn(categoryFacet, 'scrollToTop');
        $$(categoryValueElement(categoryValue)).trigger('click');
        expect(categoryFacet.scrollToTop).toHaveBeenCalled();
      });

      it('calls scrollToTop on enter keyup', () => {
        const categoryValue = buildCategoryValue().makeSelectable();
        spyOn(categoryFacet, 'scrollToTop');
        Simulate.keyUp(categoryValueElement(categoryValue), KEYBOARD.ENTER);
        expect(categoryFacet.scrollToTop).toHaveBeenCalled();
      });
    });

    it('does not call changeActivePath on click by default', () => {
      const categoryValue = buildCategoryValue();
      spyOn(categoryFacet, 'changeActivePath');
      $$(categoryValueElement(categoryValue)).trigger('click');
      expect(categoryFacet.changeActivePath).not.toHaveBeenCalled();
    });

    it('does not call changeActivePath on enter keyup by default', () => {
      const categoryValue = buildCategoryValue();
      spyOn(categoryFacet, 'changeActivePath');
      Simulate.keyUp(categoryValueElement(categoryValue), KEYBOARD.ENTER);
      expect(categoryFacet.changeActivePath).not.toHaveBeenCalled();
    });

    it('displays the categoryValueDescriptor #value by default', () => {
      const categoryValue = buildCategoryValue();
      const facetValue = categoryValue.element.find('.coveo-category-facet-value-caption').textContent;
      expect(facetValue).toBe(categoryValueDescriptor.value);
    });

    describe(`when the categoryFacet #valueCaption option has a key that matches the categoryValueDescriptor #value`, () => {
      const caption = 'caption';

      beforeEach(() => {
        const valueCaption = { [categoryValueDescriptor.value]: caption };
        categoryFacetOptions.valueCaption = valueCaption;
        initCategoryFacet();
      });

      it(`displays the caption instead of the original value`, () => {
        const categoryValue = buildCategoryValue();
        const facetValue = categoryValue.element.find('.coveo-category-facet-value-caption').textContent;
        expect(facetValue).toBe(caption);
      });

      describe('when the categoryValue is selectable', () => {
        let labelElement: HTMLElement;
        beforeEach(() => {
          const categoryValue = buildCategoryValue().makeSelectable();
          labelElement = categoryValue.element.find('.coveo-category-facet-value-label');
        });

        it('adds a label containing the captioned value', () => {
          const labelAttribute = labelElement.attributes['aria-label'];
          expect(labelAttribute.value).toContain(caption);
        });

        it('adds a label containing the results count', () => {
          const labelAttribute = labelElement.attributes['aria-label'];
          expect(labelAttribute.value).toContain(categoryValueDescriptor.count);
        });

        it("doesn't add plural tags", () => {
          const labelAttribute = labelElement.attributes['aria-label'];
          expect(labelAttribute.value).not.toContain('<pl>');
        });
      });
    });
  });
}
