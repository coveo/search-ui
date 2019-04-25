import { CategoryFacetHeader, ICategoryFacetHeaderOptions } from '../../../src/ui/CategoryFacet/CategoryFacetHeader';
import { buildCategoryFacetResults } from './CategoryFacetTest';
import { $$ } from '../../../src/utils/Dom';
import { CategoryFacet } from '../../../src/ui/CategoryFacet/CategoryFacet';
import * as Mock from '../../MockEnvironment';
import { Simulate, ISimulateQueryData } from '../../Simulate';

export function CategoryFacetHeaderTest() {
  describe('CategoryFacetHeader', () => {
    let categoryFacetHeader: CategoryFacetHeader;
    let test: Mock.IBasicComponentSetup<CategoryFacet>;
    let simulateQueryData: ISimulateQueryData;
    let baseOptions: ICategoryFacetHeaderOptions;

    function initCategoryFacetHeader() {
      categoryFacetHeader = new CategoryFacetHeader(baseOptions);
      categoryFacetHeader.build();
    }

    beforeEach(() => {
      simulateQueryData = buildCategoryFacetResults();
      test = Mock.advancedComponentSetup<CategoryFacet>(
        CategoryFacet,
        new Mock.AdvancedComponentSetupOptions(null, { field: '@field' }, env => env.withLiveQueryStateModel())
      );
      baseOptions = {
        categoryFacet: test.cmp,
        title: 'foo'
      };
      initCategoryFacetHeader();
    });

    afterEach(() => {
      baseOptions = null;
      categoryFacetHeader = null;
    });

    it('should build a title', () => {
      const titleElement = $$(categoryFacetHeader.element).find('.coveo-category-facet-title');
      expect($$(titleElement).text()).toBe(baseOptions.title);
    });

    it('the title should be accessible', () => {
      const title = $$(categoryFacetHeader.element).find('.coveo-category-facet-title');
      expect($$(title).getAttribute('role')).toBe('heading');
      expect($$(title).getAttribute('aria-level')).toBe('2');
      expect($$(title).getAttribute('aria-label')).toBeTruthy();
    });

    describe('when the facet has one selected value', () => {
      beforeEach(() => {
        Simulate.query(test.env, simulateQueryData);
        baseOptions.categoryFacet.selectValue('value9');
      });

      it('value should be correctly selected', () => {
        expect(baseOptions.categoryFacet.activePath).toEqual(['value9']);
      });

      it('eraser bouton should be accessible', () => {
        const eraserElement = $$(categoryFacetHeader.element).find('.coveo-category-facet-header-eraser');
        expect(eraserElement.getAttribute('role')).toBe('button');
        expect(eraserElement.getAttribute('aria-label')).toBeTruthy();
      });

      it('when clicking the eraser, it should reset the value', () => {
        const eraserElement = $$(categoryFacetHeader.element).find('.coveo-category-facet-header-eraser');
        eraserElement.click();
        expect(baseOptions.categoryFacet.activePath).toEqual([]);
      });
    });
  });
}
