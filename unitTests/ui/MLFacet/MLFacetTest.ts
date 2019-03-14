import * as Mock from '../../MockEnvironment';
import { MLFacet } from '../../../src/ui/MLFacet/MLFacet';
import { IMLFacetOptions } from '../../../src/ui/MLFacet/MLFacetOptions';
import { IMLFacetValue } from '../../../src/ui/MLFacet/MLFacetValues/MLFacetValue';
import { MLFacetTestUtils } from './MLFacetTestUtils';
import { $$ } from '../../../src/Core';

export function MLFacetTest() {
  describe('MLFacet', () => {
    let test: Mock.IBasicComponentSetup<MLFacet>;
    let mockFacetValues: IMLFacetValue[];
    let options: IMLFacetOptions;

    beforeEach(() => {
      options = { field: '@field' };
      mockFacetValues = MLFacetTestUtils.createFakeFacetValues();
      initializeComponent();
    });

    function initializeComponent() {
      test = Mock.advancedComponentSetup<MLFacet>(MLFacet, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: builder => {
          return builder.withLiveQueryStateModel();
        },
        cmpOptions: options
      });

      test.cmp.values.createFromResults(mockFacetValues);
    }

    function testQueryStateModelValues() {
      const qsmValues: string[] = test.env.queryStateModel.attributes[`f:${test.cmp.options.id}`];
      expect(qsmValues).toEqual(test.cmp.values.selectedValues);
    }

    it(`when facet has values but none are selected
      should not be seen as "active" or as "empty"`, () => {
      test.cmp.ensureDom();

      expect($$(test.cmp.element).hasClass('coveo-facet-empty')).toBe(false);
      expect($$(test.cmp.element).hasClass('coveo-active')).toBe(false);
    });

    it(`when facet has selected values
      should be seen as "active" & not as "empty"`, () => {
      mockFacetValues[0].selected = true;
      initializeComponent();
      test.cmp.ensureDom();

      expect($$(test.cmp.element).hasClass('coveo-facet-empty')).toBe(false);
      expect($$(test.cmp.element).hasClass('coveo-active')).toBe(true);
    });

    it(`when facet has no values
      should be seen as "empty" & not "active"`, () => {
      mockFacetValues = [];
      initializeComponent();
      test.cmp.ensureDom();

      expect($$(test.cmp.element).hasClass('coveo-facet-empty')).toBe(true);
      expect($$(test.cmp.element).hasClass('coveo-active')).toBe(false);
    });

    it('allows to select a value', () => {
      expect(test.cmp.values.get(mockFacetValues[0].value).selected).toBe(false);

      test.cmp.selectValue(mockFacetValues[0].value);

      expect(test.cmp.values.get(mockFacetValues[0].value).selected).toBe(true);
      testQueryStateModelValues();
    });

    it('allows to select a value that did not previously exist', () => {
      const newFacetValue = 'this is a brand new value';
      expect(test.cmp.values.allValues).not.toContain(newFacetValue);

      test.cmp.selectValue(newFacetValue);

      expect(test.cmp.values.get(newFacetValue).selected).toBe(true);
      testQueryStateModelValues();
    });

    it('allows to select multiple values', () => {
      const selectedValues = [mockFacetValues[0].value, mockFacetValues[1].value, 'new value'];
      expect(test.cmp.values.selectedValues.length).toBe(0);

      test.cmp.selectMultipleValues(selectedValues);

      expect(test.cmp.values.selectedValues).toEqual(selectedValues);
      testQueryStateModelValues();
    });

    it('allows to deselect a value', () => {
      mockFacetValues[2].selected = true;
      initializeComponent();

      test.cmp.deselectValue(mockFacetValues[2].value);

      expect(test.cmp.values.get(mockFacetValues[2].value).selected).toBe(false);
      testQueryStateModelValues();
    });

    it('allows to deselect multiple values', () => {
      mockFacetValues[1].selected = true;
      mockFacetValues[3].selected = true;
      initializeComponent();

      test.cmp.deselectMultipleValues([mockFacetValues[1].value, mockFacetValues[3].value]);

      expect(test.cmp.values.selectedValues.length).toBe(0);
      testQueryStateModelValues();
    });

    it('allows to toggle a value', () => {
      test.cmp.toggleSelectValue(mockFacetValues[1].value);
      expect(test.cmp.values.get(mockFacetValues[1].value).selected).toBe(true);
      testQueryStateModelValues();

      test.cmp.toggleSelectValue(mockFacetValues[1].value);
      expect(test.cmp.values.get(mockFacetValues[1].value).selected).toBe(false);
      testQueryStateModelValues();

      test.cmp.toggleSelectValue(mockFacetValues[1].value);
      expect(test.cmp.values.get(mockFacetValues[1].value).selected).toBe(true);
      testQueryStateModelValues();
    });

    it('allows to trigger a new query', () => {
      test.cmp.ensureDom();
      test.cmp.triggerNewQuery();

      expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
    });

    it('allows to reset', () => {
      mockFacetValues[1].selected = true;
      mockFacetValues[3].selected = true;
      initializeComponent();
      test.cmp.ensureDom();
      expect(test.cmp.values.selectedValues.length).toBe(2);

      test.cmp.reset();

      expect($$(test.cmp.element).hasClass('coveo-active')).toBe(false);
      expect(test.cmp.values.selectedValues.length).toBe(0);
      testQueryStateModelValues();
    });

    it('should have a default title', () => {
      test.cmp.ensureDom();

      expect($$(test.cmp.element).find('.coveo-facet-header-title').innerHTML).toBe('No title');
    });

    it('title option should set the title', () => {
      options.title = 'a title';
      initializeComponent();
      test.cmp.ensureDom();

      expect($$(test.cmp.element).find('.coveo-facet-header-title').innerHTML).toBe(options.title);
    });

    describe('with a live query state model', () => {
      beforeEach(() => {
        initializeComponent();
      });

      it('should select the needed values using the field', () => {
        test.env.queryStateModel.registerNewAttribute('f:@field', []);
        test.env.queryStateModel.set('f:@field', ['a', 'b', 'c']);
        expect(test.cmp.values.selectedValues).toEqual(['a', 'b', 'c']);
      });

      it('should select the needed values using the id', () => {
        options.id = 'my_secret_id';
        initializeComponent();
        test.env.queryStateModel.registerNewAttribute(`f:${options.id}`, []);

        test.env.queryStateModel.set(`f:${options.id}`, ['a', 'b', 'c']);
        expect(test.cmp.values.selectedValues).toEqual(['a', 'b', 'c']);
      });
    });
  });
}
