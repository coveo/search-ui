import * as Mock from '../../MockEnvironment';
import { DynamicFacet, IDynamicFacetOptions } from '../../../src/ui/DynamicFacet/DynamicFacet';
import { IDynamicFacetValue } from '../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValue';
import { FacetValueState } from '../../../src/rest/Facet/FacetValueState';
import { DynamicFacetTestUtils } from './DynamicFacetTestUtils';
import { $$, BreadcrumbEvents, QueryEvents } from '../../../src/Core';
import { FacetSortCriteria } from '../../../src/rest/Facet/FacetSortCriteria';
import { Simulate } from '../../Simulate';
import { IPopulateBreadcrumbEventArgs } from '../../../src/events/BreadcrumbEvents';
import { analyticsActionCauseList } from '../../../src/ui/Analytics/AnalyticsActionListMeta';
import { FakeResults } from '../../Fake';
import { ResultListUtils } from '../../../src/utils/ResultListUtils';

export function DynamicFacetTest() {
  describe('DynamicFacet', () => {
    let test: Mock.IBasicComponentSetup<DynamicFacet>;
    let mockFacetValues: IDynamicFacetValue[];
    let options: IDynamicFacetOptions;

    beforeEach(() => {
      options = { field: '@field' };
      mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues();
      initializeComponent();
    });

    function initializeComponent() {
      test = DynamicFacetTestUtils.createAdvancedFakeFacet(options);
      spyOn(test.cmp.logger, 'warn');
      (test.env.searchInterface.getComponents as jasmine.Spy).and.returnValue([test.cmp]);
      test.cmp.values.createFromResponse(DynamicFacetTestUtils.getCompleteFacetResponse(test.cmp, { values: mockFacetValues }));
      test.cmp.moreValuesAvailable = true;

      spyOn(test.cmp.values, 'clearAll').and.callThrough();
      spyOn(test.cmp.values, 'render').and.callThrough();
      spyOn(test.cmp, 'triggerNewIsolatedQuery').and.callThrough();
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

    function searchFeatureActive() {
      return !!$$(test.cmp.element).find('.coveo-dynamic-facet-search');
    }

    function searchFeatureDisplayed() {
      return $$($$(test.cmp.element).find('.coveo-dynamic-facet-search')).isVisible();
    }

    function validateExpandCollapse(shouldBeCollapsed: boolean) {
      expect($$(test.cmp.element).hasClass('coveo-dynamic-facet-collapsed')).toBe(shouldBeCollapsed);
      expect(searchFeatureDisplayed()).toBe(!shouldBeCollapsed);
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

    it(`when facet has values
      isCurrentlyDisplayed should return true`, () => {
      test.cmp.ensureDom();

      expect(test.cmp.isCurrentlyDisplayed()).toBe(true);
    });

    it(`when facet has no values
      isCurrentlyDisplayed should return false`, () => {
      mockFacetValues = [];
      initializeComponent();
      test.cmp.ensureDom();

      expect(test.cmp.isCurrentlyDisplayed()).toBe(false);
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

    it('allows to trigger a new isolated query', () => {
      spyOn(test.cmp.dynamicFacetQueryController, 'executeIsolatedQuery');
      const beforeExecuteQuery = jasmine.createSpy('beforeExecuteQuery', () => {});
      test.cmp.ensureDom();
      test.cmp.triggerNewIsolatedQuery(beforeExecuteQuery);

      expect(test.cmp.dynamicFacetQueryController.executeIsolatedQuery).toHaveBeenCalled();
      expect(beforeExecuteQuery).toHaveBeenCalled();
      expect(test.cmp.values.render).toHaveBeenCalled();
    });

    it('triggering a new isolated query updates the values', () => {
      test.cmp.ensureDom();
      test.cmp.triggerNewIsolatedQuery();

      expect(test.cmp.values.render).toHaveBeenCalled();
    });

    it('allows to reset', () => {
      mockFacetValues[1].state = FacetValueState.selected;
      mockFacetValues[3].state = FacetValueState.selected;
      initializeComponent();
      test.cmp.reset();

      expect($$(test.cmp.element).hasClass('coveo-active')).toBe(false);
      expect(test.cmp.values.selectedValues.length).toBe(0);
      testQueryStateModelValues();
    });

    it('when calling reset, should clear and rerender values if there is any active value', () => {
      mockFacetValues[0].state = FacetValueState.selected;
      initializeComponent();

      test.cmp.reset();

      expect(test.cmp.values.clearAll).toHaveBeenCalled();
      expect(test.cmp.values.render).toHaveBeenCalledTimes(2);
    });

    it('when calling reset, should not clear and rerender values when there are no active values', () => {
      test.cmp.reset();

      expect(test.cmp.values.clearAll).not.toHaveBeenCalled();
      expect(test.cmp.values.render).toHaveBeenCalledTimes(1);
    });

    it('showMoreValues adds by the numberOfValues option by default', () => {
      const additionalNumberOfValues = test.cmp.options.numberOfValues;
      test.cmp.showMoreValues();

      expect(getFirstFacetRequest().numberOfValues).toBe(test.cmp.options.numberOfValues + additionalNumberOfValues);
    });

    it('allows to showMoreValues with a custom amount of values', () => {
      const additionalNumberOfValues = 38;
      test.cmp.showMoreValues(additionalNumberOfValues);
      expect(test.cmp.triggerNewIsolatedQuery).toHaveBeenCalled();

      expect(getFirstFacetRequest().numberOfValues).toBe(test.cmp.options.numberOfValues + additionalNumberOfValues);
    });

    it('showMoreValues triggers a query', () => {
      test.cmp.showMoreValues();
      expect(test.cmp.triggerNewIsolatedQuery).toHaveBeenCalled();
    });

    it('showLessValues resets the amount of values to the numberOfValues option', () => {
      const additionalNumberOfValues = 38;
      test.cmp.showMoreValues(additionalNumberOfValues);
      test.cmp.showLessValues();

      expect(getFirstFacetRequest().numberOfValues).toBe(test.cmp.options.numberOfValues);
    });

    it('showLessValues triggers a query', () => {
      test.cmp.showLessValues();
      expect(test.cmp.triggerNewIsolatedQuery).toHaveBeenCalled();
    });

    it(`when enableCollapse & collapsedByDefault options are true
      facet should be collapsed`, () => {
      options.enableCollapse = true;
      options.collapsedByDefault = true;
      initializeComponent();
      test.cmp.ensureDom();

      validateExpandCollapse(true);
    });

    it(`when enableCollapse is false & collapsedByDefault options is true
      facet should not be collapsed`, () => {
      options.enableCollapse = false;
      options.collapsedByDefault = true;
      initializeComponent();
      test.cmp.ensureDom();

      validateExpandCollapse(false);
    });

    it(`allows to collapse`, () => {
      test.cmp.ensureDom();
      test.cmp.collapse();

      validateExpandCollapse(true);
    });

    it(`allows to expand`, () => {
      test.cmp.ensureDom();
      test.cmp.collapse();

      test.cmp.expand();

      validateExpandCollapse(false);
    });

    it(`does not allow to expand if the enableCollapse is false`, () => {
      options.enableCollapse = false;
      initializeComponent();
      test.cmp.ensureDom();
      test.cmp.collapse();
      expect(test.cmp.logger.warn).toHaveBeenCalled();
    });

    it(`does not allow to collapse if the enableCollapse is false`, () => {
      options.enableCollapse = false;
      initializeComponent();
      test.cmp.ensureDom();
      test.cmp.expand();
      expect(test.cmp.logger.warn).toHaveBeenCalled();
    });

    it(`allows to toggle between expand/collapse`, () => {
      test.cmp.ensureDom();

      test.cmp.toggleCollapse();
      validateExpandCollapse(true);

      test.cmp.toggleCollapse();
      validateExpandCollapse(false);
    });

    it('should have a default title', () => {
      test.cmp.ensureDom();

      expect($$(test.cmp.element).find('.coveo-dynamic-facet-header-title span').innerHTML).toBe('No title');
    });

    it('title option should set the title', () => {
      options.title = 'a title';
      initializeComponent();
      test.cmp.ensureDom();

      expect($$(test.cmp.element).find('.coveo-dynamic-facet-header-title span').innerHTML).toBe(options.title);
    });

    it('should select the needed values using the id', () => {
      test.env.queryStateModel.registerNewAttribute(`${test.cmp.options.id}`, []);
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

    it('should log an analytics event when selecting a value through the QSM', () => {
      spyOn(test.cmp, 'logAnalyticsEvent');
      test.env.queryStateModel.registerNewAttribute(`f:${test.cmp.options.id}`, []);
      test.env.queryStateModel.set(`f:${test.cmp.options.id}`, ['a', 'b', 'c']);

      expect(test.cmp.logAnalyticsEvent).toHaveBeenCalledWith(
        analyticsActionCauseList.dynamicFacetSelect,
        test.cmp.values.get('a').analyticsMeta
      );
    });

    it('should log an analytics event when deselecting a value through the QSM', () => {
      spyOn(test.cmp, 'logAnalyticsEvent');
      test.env.queryStateModel.registerNewAttribute(`f:${test.cmp.options.id}`, []);
      test.env.queryStateModel.set(`f:${test.cmp.options.id}`, ['a', 'b', 'c']);
      test.env.queryStateModel.set(`f:${test.cmp.options.id}`, []);

      expect(test.cmp.logAnalyticsEvent).toHaveBeenCalledWith(
        analyticsActionCauseList.dynamicFacetDeselect,
        test.cmp.values.get('a').analyticsMeta
      );
    });

    it('should log an analytics event when showing more results', () => {
      test.cmp.showMoreValues();
      expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
        analyticsActionCauseList.dynamicFacetShowMore,
        test.cmp.basicAnalyticsFacetState,
        test.cmp.element
      );
    });

    it('should log an analytics event when showing less results', () => {
      test.cmp.showLessValues();
      expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
        analyticsActionCauseList.dynamicFacetShowLess,
        test.cmp.basicAnalyticsFacetState,
        test.cmp.element
      );
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

    it('logs an analytics search event when logAnalyticsEvent is called', () => {
      test.cmp.logAnalyticsEvent(analyticsActionCauseList.dynamicFacetSelect, test.cmp.analyticsFacetState[0]);

      expect(test.cmp.usageAnalytics.logSearchEvent).toHaveBeenCalled();
    });

    it('returns the correct basicAnalyticsFacetState', () => {
      expect(test.cmp.basicAnalyticsFacetState).toEqual({
        field: test.cmp.options.field.toString(),
        title: test.cmp.options.title,
        id: test.cmp.options.id,
        facetType: test.cmp.facetType,
        facetPosition: test.cmp.position
      });
    });

    it('returns the correct analyticsFacetState', () => {
      test.cmp.selectValue('bar');
      test.cmp.selectValue('foo');

      expect(test.cmp.analyticsFacetState).toEqual([test.cmp.values.get('bar').analyticsMeta, test.cmp.values.get('foo').analyticsMeta]);
    });

    it(`when calling "putStateIntoAnalytics" 
      should call "getPendingSearchEvent" on the "usageAnalytics" object`, () => {
      test.cmp.putStateIntoAnalytics();

      expect(test.cmp.usageAnalytics.getPendingSearchEvent).toHaveBeenCalled();
    });

    it(`when calling "putStateIntoAnalytics" 
      should call "addFacetState" on the "PendingSearchEvent" with the correct state`, () => {
      const fakePendingSearchEvent = {
        addFacetState: jasmine.createSpy('addFacetState')
      };
      test.cmp.usageAnalytics.getPendingSearchEvent = jasmine.createSpy('getPendingSearchEvent').and.callFake(() => fakePendingSearchEvent);

      test.cmp.putStateIntoAnalytics();

      expect(fakePendingSearchEvent.addFacetState).toHaveBeenCalledWith(test.cmp.analyticsFacetState);
    });

    it('facet position should be null by default', () => {
      expect(test.cmp.position).toBeNull();
    });

    it(`when getting successful results
      facet position should be correct`, () => {
      test.cmp.ensureDom();
      const fakeResultsWithFacets = FakeResults.createFakeResults();
      fakeResultsWithFacets.facets = [DynamicFacetTestUtils.getCompleteFacetResponse(test.cmp)];
      $$(test.env.root).trigger(QueryEvents.querySuccess, { results: fakeResultsWithFacets });

      expect(test.cmp.position).toBe(1);
    });

    it(`when "enableFacetSearch" option is false
    it should not render the search element`, () => {
      options.enableFacetSearch = false;
      initializeComponent();
      test.cmp.ensureDom();

      expect(searchFeatureActive()).toBe(false);
    });

    it(`when "enableFacetSearch" option is false
    it should not throw when collapsing`, () => {
      options.enableFacetSearch = false;
      initializeComponent();
      test.cmp.ensureDom();

      expect(() => test.cmp.collapse()).not.toThrow();
    });

    it(`when "enableFacetSearch" option is true
    it should render the search element`, () => {
      options.enableFacetSearch = true;
      initializeComponent();
      test.cmp.ensureDom();

      expect(searchFeatureActive()).toBe(true);
    });

    it(`when "enableFacetSearch" option is "undefined" and "moreValuesAvailable" is "true"
    it should show the search`, () => {
      test.cmp.ensureDom();

      expect(searchFeatureDisplayed()).toBe(true);
    });

    it(`when "enableFacetSearch" option is "undefined" and "moreValuesAvailable" is "true"
    it should hide the search`, () => {
      initializeComponent();
      test.cmp.moreValuesAvailable = false;
      test.cmp.ensureDom();

      expect(searchFeatureDisplayed()).toBe(false);
    });

    it('calling "scrollToTop" should call "scrollToTop" on the ResultListUtils', () => {
      spyOn(ResultListUtils, 'scrollToTop');
      test.cmp.scrollToTop();

      expect(ResultListUtils.scrollToTop).toHaveBeenCalledWith(test.cmp.root);
    });

    it(`when the enableScrollToTop option is "false"
    calling "scrollToTop" should not call "scrollToTop" on the ResultListUtils`, () => {
      options.enableScrollToTop = false;
      initializeComponent();
      spyOn(ResultListUtils, 'scrollToTop');
      test.cmp.scrollToTop();

      expect(ResultListUtils.scrollToTop).not.toHaveBeenCalledWith(test.cmp.root);
    });
  });
}
