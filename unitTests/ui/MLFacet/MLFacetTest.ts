import * as Mock from '../../MockEnvironment';
import { MLFacet, IMLFacetOptions } from '../../../src/ui/MLFacet/MLFacet';
import { IMLFacetValue } from '../../../src/ui/MLFacet/MLFacetValues/MLFacetValue';
import { FacetValueState } from '../../../src/rest/Facet/FacetValueState';
import { MLFacetTestUtils } from './MLFacetTestUtils';
import { $$, BreadcrumbEvents } from '../../../src/Core';
import { FacetSortCriteria } from '../../../src/rest/Facet/FacetSortCriteria';
import { Simulate } from '../../Simulate';
import { IPopulateBreadcrumbEventArgs } from '../../../src/events/BreadcrumbEvents';

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
      test = MLFacetTestUtils.createAdvancedFakeFacet(options);
      test.cmp.values.createFromResponse(MLFacetTestUtils.getCompleteFacetResponse(test.cmp, { values: mockFacetValues }));
    }

    function testQueryStateModelValues() {
      const qsmValues: string[] = test.env.queryStateModel.attributes[`f:${test.cmp.options.id}`];
      expect(qsmValues).toEqual(test.cmp.values.selectedValues);
    }

    function getFirstFacetRequest() {
      return Simulate.query(test.env).queryBuilder.build().facets[0];
    }

    function triggerPopulateBreadcrumbs() {
      const args: IPopulateBreadcrumbEventArgs = { breadcrumbs: [] };
      $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, args);
      return args.breadcrumbs;
    }

    it(`when facet has values but none are selected
      should not be seen as "active" or as "empty"`, () => {
      test.cmp.ensureDom();

      expect($$(test.cmp.element).hasClass('coveo-hidden')).toBe(false);
      expect($$(test.cmp.element).hasClass('coveo-active')).toBe(false);
    });

    it(`when facet has selected values
      should be seen as "active" & not as "empty"`, () => {
      mockFacetValues[0].state = FacetValueState.selected;
      initializeComponent();
      test.cmp.ensureDom();

      expect($$(test.cmp.element).hasClass('coveo-hidden')).toBe(false);
      expect($$(test.cmp.element).hasClass('coveo-active')).toBe(true);
    });

    it(`when facet has no values
      should be seen as "empty" & not "active"`, () => {
      mockFacetValues = [];
      initializeComponent();
      test.cmp.ensureDom();

      expect($$(test.cmp.element).hasClass('coveo-hidden')).toBe(true);
      expect($$(test.cmp.element).hasClass('coveo-active')).toBe(false);
    });

    it('allows to select a value', () => {
      expect(test.cmp.values.get(mockFacetValues[0].value).isSelected).toBe(false);

      test.cmp.selectValue(mockFacetValues[0].value);

      expect(test.cmp.values.get(mockFacetValues[0].value).isSelected).toBe(true);
      testQueryStateModelValues();
    });

    it('allows to select a value that did not previously exist', () => {
      const newFacetValue = 'this is a brand new value';
      expect(test.cmp.values.allValues).not.toContain(newFacetValue);

      test.cmp.selectValue(newFacetValue);

      expect(test.cmp.values.get(newFacetValue).isSelected).toBe(true);
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
      mockFacetValues[2].state = FacetValueState.selected;
      initializeComponent();

      test.cmp.deselectValue(mockFacetValues[2].value);

      expect(test.cmp.values.get(mockFacetValues[2].value).isSelected).toBe(false);
      testQueryStateModelValues();
    });

    it('allows to deselect multiple values', () => {
      mockFacetValues[1].state = FacetValueState.selected;
      mockFacetValues[3].state = FacetValueState.selected;
      initializeComponent();

      test.cmp.deselectMultipleValues([mockFacetValues[1].value, mockFacetValues[3].value]);

      expect(test.cmp.values.selectedValues.length).toBe(0);
      testQueryStateModelValues();
    });

    it('allows to toggle a value', () => {
      test.cmp.toggleSelectValue(mockFacetValues[1].value);
      expect(test.cmp.values.get(mockFacetValues[1].value).isSelected).toBe(true);
      testQueryStateModelValues();

      test.cmp.toggleSelectValue(mockFacetValues[1].value);
      expect(test.cmp.values.get(mockFacetValues[1].value).isSelected).toBe(false);
      testQueryStateModelValues();

      test.cmp.toggleSelectValue(mockFacetValues[1].value);
      expect(test.cmp.values.get(mockFacetValues[1].value).isSelected).toBe(true);
      testQueryStateModelValues();
    });

    it('allows to trigger a new query', () => {
      test.cmp.ensureDom();
      test.cmp.triggerNewQuery();

      expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
    });

    it('allows to reset', () => {
      mockFacetValues[1].state = FacetValueState.selected;
      mockFacetValues[3].state = FacetValueState.selected;
      initializeComponent();
      test.cmp.ensureDom();
      expect(test.cmp.values.selectedValues.length).toBe(2);

      test.cmp.reset();

      expect($$(test.cmp.element).hasClass('coveo-active')).toBe(false);
      expect(test.cmp.values.selectedValues.length).toBe(0);
      testQueryStateModelValues();
    });

    it('showMoreValues adds by the numberOfValues option by default', () => {
      const additionalNumberOfValues = test.cmp.options.numberOfValues;
      test.cmp.showMoreValues();

      expect(getFirstFacetRequest().numberOfValues).toBe(test.cmp.options.numberOfValues + additionalNumberOfValues);
    });

    it('allows to showMoreValues with a custom amount of values', () => {
      const additionalNumberOfValues = 38;
      test.cmp.showMoreValues(additionalNumberOfValues);
      expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();

      expect(getFirstFacetRequest().numberOfValues).toBe(test.cmp.options.numberOfValues + additionalNumberOfValues);
    });

    it('showMoreValues triggers a query', () => {
      test.cmp.showMoreValues();
      expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
    });

    it('showLessValues resets the amount of values to the numberOfValues option', () => {
      const additionalNumberOfValues = 38;
      test.cmp.showMoreValues(additionalNumberOfValues);
      test.cmp.showLessValues();

      expect(getFirstFacetRequest().numberOfValues).toBe(test.cmp.options.numberOfValues);
    });

    it('showLessValues triggers a query', () => {
      test.cmp.showLessValues();
      expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
    });

    it(`when enableCollapse & collapsedByDefault options are true
      facet should be collapsed`, () => {
      options.enableCollapse = true;
      options.collapsedByDefault = true;
      initializeComponent();
      test.cmp.ensureDom();

      expect($$(test.cmp.element).hasClass('coveo-ml-facet-collapsed')).toBe(true);
    });

    it(`allows to collapse`, () => {
      test.cmp.ensureDom();
      test.cmp.collapse();

      expect($$(test.cmp.element).hasClass('coveo-ml-facet-collapsed')).toBe(true);
    });

    it(`allows to expand`, () => {
      test.cmp.ensureDom();
      test.cmp.collapse();

      test.cmp.expand();

      expect($$(test.cmp.element).hasClass('coveo-ml-facet-collapsed')).toBe(false);
    });

    it(`allows to toggle between expand/collapse`, () => {
      test.cmp.ensureDom();

      test.cmp.toggleCollapse();
      expect($$(test.cmp.element).hasClass('coveo-ml-facet-collapsed')).toBe(true);

      test.cmp.toggleCollapse();
      expect($$(test.cmp.element).hasClass('coveo-ml-facet-collapsed')).toBe(false);
    });

    it('should have a default title', () => {
      test.cmp.ensureDom();

      expect($$(test.cmp.element).find('.coveo-ml-facet-header-title span').innerHTML).toBe('No title');
    });

    it('title option should set the title', () => {
      options.title = 'a title';
      initializeComponent();
      test.cmp.ensureDom();

      expect($$(test.cmp.element).find('.coveo-ml-facet-header-title span').innerHTML).toBe(options.title);
    });

    it('should select the needed values using the id', () => {
      test.env.queryStateModel.registerNewAttribute(`f:${test.cmp.options.id}`, []);
      test.env.queryStateModel.set(`f:${test.cmp.options.id}`, ['a', 'b', 'c']);
      expect(test.cmp.values.selectedValues).toEqual(['a', 'b', 'c']);
    });

    it('should select the needed values using the id', () => {
      options.id = 'my_secret_id';
      initializeComponent();
      test.env.queryStateModel.registerNewAttribute(`f:${options.id}`, []);

      test.env.queryStateModel.set(`f:${options.id}`, ['a', 'b', 'c']);
      expect(test.cmp.values.selectedValues).toEqual(['a', 'b', 'c']);
    });

    it(`when not setting a sortCriteria option
      should set it to undefined in the query`, () => {
      expect(getFirstFacetRequest().sortCriteria).toBeUndefined();
    });

    it(`when setting a sortCriteria option
      should pass it down to the query`, () => {
      options.sortCriteria = FacetSortCriteria.score;
      initializeComponent();

      expect(getFirstFacetRequest().sortCriteria).toBe(FacetSortCriteria.score);
    });

    it(`when not setting a numberOfValues option
      should set it to 8 in the query`, () => {
      expect(getFirstFacetRequest().numberOfValues).toBe(8);
    });

    it(`when setting a numberOfValues option
      should pass it down to the query`, () => {
      options.numberOfValues = 100;
      initializeComponent();

      expect(getFirstFacetRequest().numberOfValues).toBe(100);
    });

    it('should populate breadcrumbs by default', () => {
      test.cmp.selectValue('foo');
      const breadcrumbs = triggerPopulateBreadcrumbs();

      expect(breadcrumbs.length).toBe(1);
    });

    it('should not populate breadcrumbs if the option includeInBreadcrumb is set to "false"', () => {
      options.includeInBreadcrumb = false;
      initializeComponent();

      test.cmp.selectValue('foo');
      const breadcrumbs = triggerPopulateBreadcrumbs();

      expect(breadcrumbs.length).toBe(0);
    });

    it('should respect the numberOfValuesInBreadcrumb option', () => {
      options.numberOfValuesInBreadcrumb = 1;
      initializeComponent();

      test.cmp.selectValue('foo');
      test.cmp.selectValue('bar');
      const breadcrumbs = triggerPopulateBreadcrumbs();

      expect(breadcrumbs.length).toBe(1);
    });
  });
}
