import * as Mock from '../../MockEnvironment';
import { DynamicHierarchicalFacetTestUtils } from './DynamicHierarchicalFacetTestUtils';
import { DynamicFacetTestUtils } from '../DynamicFacet/DynamicFacetTestUtils';
import { DynamicHierarchicalFacet } from '../../../src/ui/DynamicHierarchicalFacet/DynamicHierarchicalFacet';
import { FacetType } from '../../../src/rest/Facet/FacetRequest';
import { IPopulateBreadcrumbEventArgs, BreadcrumbEvents } from '../../../src/events/BreadcrumbEvents';
import { $$, QueryBuilder, QueryEvents } from '../../../src/Core';
import { FakeResults } from '../../Fake';
import { Simulate } from '../../Simulate';
import { IFacetResponseValue } from '../../../src/rest/Facet/FacetResponse';
import { FacetValueState } from '../../../src/rest/Facet/FacetValueState';
import { ResultListUtils } from '../../../src/utils/ResultListUtils';
import {
  IDynamicHierarchicalFacetOptions,
  HierarchicalFacetSortCriteria
} from '../../../src/ui/DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { DynamicFacetManager } from '../../../src/ui/DynamicFacetManager/DynamicFacetManager';
import { analyticsActionCauseList } from '../../../src/ui/Analytics/AnalyticsActionListMeta';
import { FacetSortCriteria } from '../../../src/rest/Facet/FacetSortCriteria';

export function DynamicHierarchicalFacetTest() {
  describe('DynamicHierarchicalFacet', () => {
    let test: Mock.IBasicComponentSetup<DynamicHierarchicalFacet>;
    let options: IDynamicHierarchicalFacetOptions;
    let mockFacetValues: IFacetResponseValue[];
    let triggerNewQuerySpy: jasmine.Spy;

    beforeEach(() => {
      options = { field: '@dummy' };
      initializeComponent();
    });

    function initializeComponent() {
      test = DynamicHierarchicalFacetTestUtils.createAdvancedFakeFacet(options);
      mockFacetValues = DynamicHierarchicalFacetTestUtils.createFakeFacetResponseValues(3, 5);

      test.cmp.values.createFromResponse(
        DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(test.cmp, {
          values: mockFacetValues
        })
      );

      spyOn(test.cmp, 'selectPath').and.callThrough();
      spyOn(test.cmp, 'logAnalyticsEvent').and.callThrough();
      spyOn(test.cmp, 'scrollToTop').and.callThrough();
      spyOn(test.cmp, 'ensureDom').and.callThrough();
      spyOn(test.cmp, 'triggerNewIsolatedQuery').and.callThrough();
      spyOn(test.cmp, 'reset').and.callThrough();
      spyOn(test.cmp, 'putStateIntoQueryBuilder').and.callThrough();
      spyOn(test.cmp, 'putStateIntoAnalytics').and.callThrough();
      spyOn(test.cmp, 'handleQueryResults').and.callThrough();
      spyOn(test.cmp.logger, 'warn').and.callThrough();
      spyOn(test.cmp.values, 'createFromResponse').and.callThrough();
      spyOn(test.cmp.values, 'render').and.callThrough();
      spyOn(test.cmp.values, 'selectPath').and.callThrough();
      spyOn(test.cmp.values, 'resetValues').and.callThrough();
      spyOn(test.cmp.values, 'clearPath').and.callThrough();
      triggerNewQuerySpy = spyOn(test.cmp, 'triggerNewQuery').and.callThrough();
      triggerNewQuerySpy.and.callThrough();
    }

    function triggerPopulateBreadcrumbs() {
      const args: IPopulateBreadcrumbEventArgs = { breadcrumbs: [] };
      $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, args);
      return args.breadcrumbs;
    }

    function testQueryStateModelValues(path: string[]) {
      const QueryStateModelValues: string[] = test.env.queryStateModel.attributes[`f:${test.cmp.options.id}`];
      expect(QueryStateModelValues).toEqual(path);
    }

    function validateExpandCollapse(shouldBeCollapsed: boolean) {
      expect($$(test.cmp.element).hasClass('coveo-dynamic-hierarchical-facet-collapsed')).toBe(shouldBeCollapsed);
    }

    function fakeResultsWithFacets() {
      const fakeResultsWithFacets = FakeResults.createFakeResults();
      fakeResultsWithFacets.facets = [
        DynamicFacetTestUtils.getCompleteFacetResponse(DynamicFacetTestUtils.createAdvancedFakeFacet({ field: '@anotherfield' }).cmp),
        DynamicHierarchicalFacetTestUtils.getCompleteFacetResponse(test.cmp, {
          values: mockFacetValues
        })
      ];
      return fakeResultsWithFacets;
    }

    function fakeResultsWithNoFacets() {
      const fakeResultsWithFacets = FakeResults.createFakeResults();
      fakeResultsWithFacets.facets = [];
      return fakeResultsWithFacets;
    }

    function getFirstFacetRequest() {
      return Simulate.query(test.env).queryBuilder.build().facets[0];
    }

    it('fieldName should return the field without @', () => {
      expect(test.cmp.fieldName).toBe('dummy');
    });

    it('facetType should be hierarchical', () => {
      expect(test.cmp.facetType).toBe(FacetType.hierarchical);
    });

    it('facet position should be null by default', () => {
      expect(test.cmp.position).toBeNull();
    });

    it(`when getting successful results
      facet position should be correct`, () => {
      test.cmp.ensureDom();

      Simulate.query(test.env, { results: fakeResultsWithFacets() });
      expect(test.cmp.position).toBe(1);
    });

    it(`when not setting a sortCriteria option
      should set it to undefined in the query`, () => {
      expect(getFirstFacetRequest().sortCriteria).toBeUndefined();
    });

    it(`when setting an invalid sortCriteria option
      should set it to undefined in the query`, () => {
      options.sortCriteria = FacetSortCriteria.score as HierarchicalFacetSortCriteria;
      initializeComponent();

      expect(getFirstFacetRequest().sortCriteria).toBeUndefined();
    });

    it(`when setting a valid sortCriteria option
      should pass it down to the query`, () => {
      options.sortCriteria = FacetSortCriteria.alphanumeric;
      initializeComponent();

      expect(getFirstFacetRequest().sortCriteria).toBe(FacetSortCriteria.alphanumeric);
    });

    it('should populate breadcrumbs by default', () => {
      test.cmp.selectPath(['foo']);
      const breadcrumbs = triggerPopulateBreadcrumbs();

      expect(breadcrumbs.length).toBe(1);
    });

    it('should not populate breadcrumbs if the option includeInBreadcrumb is set to "false"', () => {
      options.includeInBreadcrumb = false;
      initializeComponent();

      test.cmp.selectPath(['foo']);
      const breadcrumbs = triggerPopulateBreadcrumbs();

      expect(breadcrumbs.length).toBe(0);
    });

    it(`when updating the QueryStateModel
    should change the values correctly`, () => {
      test.env.queryStateModel.registerNewAttribute(`f:${test.cmp.options.id}`, []);
      test.env.queryStateModel.set(`f:${test.cmp.options.id}`, ['a', 'b', 'c']);
      testQueryStateModelValues(['a', 'b', 'c']);
    });

    it(`when a previously idle value is returned selected by the API (autoselection)
    should update the QueryStateModel correctly`, () => {
      mockFacetValues[0].children = [];
      mockFacetValues[0].state = FacetValueState.selected;
      const results = fakeResultsWithFacets();
      Simulate.query(test.env, { results });

      testQueryStateModelValues([results.facets[1].values[0].value]);
    });

    it('should call selectPath when selecting a path through the QueryStateModel', () => {
      test.env.queryStateModel.set(`f:${test.cmp.options.id}`, ['a', 'b', 'c']);

      expect(test.cmp.selectPath).toHaveBeenCalledWith(['a', 'b', 'c']);
    });

    it('should not call selectPath when selecting a identical path through the QueryStateModel', () => {
      test.env.queryStateModel.set(`f:${test.cmp.options.id}`, ['a', 'b', 'c']);
      test.env.queryStateModel.set(`f:${test.cmp.options.id}`, ['a', 'b', 'c']);

      expect(test.cmp.selectPath).toHaveBeenCalledTimes(1);
    });

    it('should call reset when clearing the path through the QueryStateModel', () => {
      test.env.queryStateModel.set(`f:${test.cmp.options.id}`, ['test']);
      test.env.queryStateModel.set(`f:${test.cmp.options.id}`, []);

      expect(test.cmp.reset).toHaveBeenCalledTimes(1);
    });

    it('should not call reset when clearing an empty path through the QueryStateModel', () => {
      test.env.queryStateModel.set(`f:${test.cmp.options.id}`, []);

      expect(test.cmp.reset).not.toHaveBeenCalled();
    });

    describe('testing collapse/expand', () => {
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

      it(`allows to collapse when enableCollapse is true`, () => {
        test.cmp.ensureDom();
        test.cmp.collapse();

        validateExpandCollapse(true);
      });

      it(`allows to expand when enableCollapse is true`, () => {
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

    it('allows to trigger a new query', () => {
      test.cmp.ensureDom();
      test.cmp.triggerNewQuery();

      expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
    });

    it('allows to trigger a new isolated query', () => {
      spyOn(test.cmp.dynamicHierarchicalFacetQueryController, 'getQueryResults');
      const beforeExecuteQuery = jasmine.createSpy('beforeExecuteQuery', () => {});
      test.cmp.ensureDom();
      test.cmp.triggerNewIsolatedQuery(beforeExecuteQuery);

      expect(test.cmp.dynamicHierarchicalFacetQueryController.getQueryResults).toHaveBeenCalled();
      expect(beforeExecuteQuery).toHaveBeenCalled();
    });

    it('triggering a new isolated query updates the values', () => {
      test.cmp.ensureDom();
      test.cmp.triggerNewIsolatedQuery();

      expect(test.cmp.values.render).toHaveBeenCalled();
    });

    describe('testing showMoreValues/showLessValues', () => {
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
    });

    it('calling enableFreezeFacetOrderFlag should call it in the dynamicHierarchicalFacetQueryController', () => {
      spyOn(test.cmp.dynamicHierarchicalFacetQueryController, 'enableFreezeFacetOrderFlag').and.callThrough();
      test.cmp.enableFreezeFacetOrderFlag();
      expect(test.cmp.dynamicHierarchicalFacetQueryController.enableFreezeFacetOrderFlag).toHaveBeenCalled();
    });

    describe('when calling reset', () => {
      beforeEach(() => {
        test.cmp.values.selectPath(['hey']);
        test.cmp.reset();
      });

      it('should call clearPath on the values', () => {
        expect(test.cmp.values.clearPath).toHaveBeenCalled();
      });

      it('should update queryStateModel with an empty array', () => {
        testQueryStateModelValues([]);
      });
    });

    describe('when calling selectPath', () => {
      const path = ['new', 'original', 'path'];
      beforeEach(() => {
        test.cmp.selectPath(path);
      });

      it('should call ensureDom', () => {
        expect(test.cmp.ensureDom).toHaveBeenCalled();
      });

      it('should update queryStateModel with the path', () => {
        testQueryStateModelValues(path);
      });

      it('should call selectPath on the values', () => {
        expect(test.cmp.values.selectPath).toHaveBeenCalledWith(path);
      });
    });

    it('getCaption should return the caption for a value', () => {
      options.valueCaption = { test: 'this is a test' };
      initializeComponent();
      expect(test.cmp.getCaption('test')).toBe('this is a test');
    });

    describe('Testing the header', () => {
      beforeEach(() => {
        test.cmp.selectPath([mockFacetValues[0].value]);
        test.cmp.ensureDom();
        spyOn(test.cmp.header, 'showLoading').and.callThrough();
        spyOn(test.cmp.header, 'hideLoading').and.callThrough();
        spyOn(test.cmp.header, 'toggleCollapse').and.callThrough();
      });

      it(`when triggering the header "clear" method
      should perform the correct action on the facet`, () => {
        test.cmp.header.options.clear();
        expect(test.cmp.reset).toHaveBeenCalledTimes(1);
        expect(test.cmp.triggerNewQuery).toHaveBeenCalledTimes(1);
      });

      it(`when triggering the header "clear" method
      should log an analytics event`, () => {
        triggerNewQuerySpy.and.callFake((beforeCb: any = () => {}) => beforeCb());
        test.cmp.header.options.clear();
        expect(test.cmp.logAnalyticsEvent).toHaveBeenCalledWith(analyticsActionCauseList.dynamicFacetClearAll);
      });

      it(`when triggering a query
      should call "showLoading" on the header`, () => {
        test.cmp.triggerNewQuery();
        expect(test.cmp.header.showLoading).toHaveBeenCalledTimes(1);
      });

      it(`when calling handleQueryResults
        should call "hideLoading" on the header`, () => {
        test.cmp.handleQueryResults(fakeResultsWithFacets());
        expect(test.cmp.header.hideLoading).toHaveBeenCalledTimes(1);
      });

      it('should call "toggleCollapse" when calling collapse', () => {
        test.cmp.collapse();
        expect(test.cmp.header.toggleCollapse).toHaveBeenCalled();
      });
    });

    describe('testing the DependsOnManager', () => {
      beforeEach(() => {
        spyOn(test.cmp.dependsOnManager, 'updateVisibilityBasedOnDependsOn');
      });

      it('should initialize the dependsOnManager', () => {
        expect(test.cmp.dependsOnManager).toBeTruthy();
      });

      it(`when facet appearance is updated (e.g. after a successful query)
      should call the "updateVisibilityBasedOnDependsOn" method of the DependsOnManager`, () => {
        Simulate.query(test.env, { results: fakeResultsWithFacets() });
        expect(test.cmp.dependsOnManager.updateVisibilityBasedOnDependsOn).toHaveBeenCalled();
      });
    });

    describe('testing putStateIntoQueryBuilder', () => {
      it(`when calling putStateIntoQueryBuilder
      should call putFacetIntoQueryBuilder on the dynamicHierarchicalFacetQueryController`, () => {
        spyOn(test.cmp.dynamicHierarchicalFacetQueryController, 'putFacetIntoQueryBuilder');
        const queryBuilder = new QueryBuilder();
        test.cmp.putStateIntoQueryBuilder(queryBuilder);
        expect(test.cmp.dynamicHierarchicalFacetQueryController.putFacetIntoQueryBuilder).toHaveBeenCalledWith(queryBuilder);
      });

      it(`when triggering doneBuildingQuery
      should call putStateIntoQueryBuilder on the facet`, () => {
        const queryBuilder = new QueryBuilder();
        $$(test.cmp.root).trigger(QueryEvents.doneBuildingQuery, { queryBuilder });
        expect(test.cmp.putStateIntoQueryBuilder).toHaveBeenCalledWith(queryBuilder);
      });

      it(`when facet as a dynamicFacetManager
      when triggering doneBuildingQuery
      should not call putStateIntoQueryBuilder on the facet`, () => {
        test.cmp.dynamicFacetManager = Mock.mockComponent(DynamicFacetManager);
        $$(test.cmp.root).trigger(QueryEvents.doneBuildingQuery, { queryBuilder: new QueryBuilder() });
        expect(test.cmp.putStateIntoQueryBuilder).not.toHaveBeenCalled();
      });
    });

    describe('testing putStateIntoAnalytics', () => {
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
        test.cmp.usageAnalytics.getPendingSearchEvent = jasmine
          .createSpy('getPendingSearchEvent')
          .and.callFake(() => fakePendingSearchEvent);

        test.cmp.putStateIntoAnalytics();

        expect(fakePendingSearchEvent.addFacetState).toHaveBeenCalledWith(test.cmp.analyticsFacetState);
      });

      it(`when facet as a dynamicFacetManager
      when triggering doneBuildingQuery
      should not call putStateIntoAnalytics on the facet`, () => {
        test.cmp.dynamicFacetManager = Mock.mockComponent(DynamicFacetManager);
        $$(test.cmp.root).trigger(QueryEvents.doneBuildingQuery, { queryBuilder: new QueryBuilder() });
        expect(test.cmp.putStateIntoAnalytics).not.toHaveBeenCalled();
      });
    });

    it('logs an analytics search event when logAnalyticsEvent is called', () => {
      test.cmp.logAnalyticsEvent(analyticsActionCauseList.dynamicFacetSelect);

      expect(test.cmp.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
        analyticsActionCauseList.dynamicFacetSelect,
        test.cmp.analyticsFacetMeta
      );
    });

    it('should log an analytics event when showing more results', () => {
      test.cmp.showMoreValues();
      expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
        analyticsActionCauseList.dynamicFacetShowMore,
        test.cmp.analyticsFacetMeta,
        test.cmp.element
      );
    });

    it('should log an analytics event when showing less results', () => {
      test.cmp.showLessValues();
      expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
        analyticsActionCauseList.dynamicFacetShowLess,
        test.cmp.analyticsFacetMeta,
        test.cmp.element
      );
    });

    function analyticsValue() {
      return test.cmp.values.selectedPath.join(test.cmp.options.delimitingCharacter);
    }

    it(`when a value is not selected
    returns an empty analyticsFacetState`, () => {
      expect(test.cmp.analyticsFacetState).toEqual([]);
    });

    it(`when a value is selected
    returns the correct analyticsFacetState`, () => {
      test.cmp.selectPath(['foo', 'bar']);

      expect(test.cmp.analyticsFacetState).toEqual([
        {
          field: test.cmp.options.field.toString(),
          id: test.cmp.options.id,
          title: test.cmp.options.title,
          facetType: test.cmp.facetType,
          facetPosition: test.cmp.position,
          value: analyticsValue(),
          displayValue: analyticsValue(),
          state: FacetValueState.selected,
          valuePosition: 1
        }
      ]);
    });

    it('returns the correct analyticsFacetMeta', () => {
      test.cmp.selectPath(['foo', 'bar']);

      expect(test.cmp.analyticsFacetMeta).toEqual({
        facetField: test.cmp.options.field.toString(),
        facetId: test.cmp.options.id,
        facetTitle: test.cmp.options.title,
        facetValue: analyticsValue()
      });
    });

    describe('testing querySuccess', () => {
      beforeEach(() => {
        test.cmp.ensureDom();
      });

      it(`when facet as a dynamicFacetManager
        should call handleQueryResults on the facet`, () => {
        $$(test.env.root).trigger(QueryEvents.querySuccess, { results: fakeResultsWithFacets() });
        expect(test.cmp.handleQueryResults).toHaveBeenCalled();
      });

      it(`when facet as a dynamicFacetManager
        should not call handleQueryResults on the facet`, () => {
        test.cmp.dynamicFacetManager = Mock.mockComponent(DynamicFacetManager);
        $$(test.env.root).trigger(QueryEvents.querySuccess, { results: fakeResultsWithFacets() });
        expect(test.cmp.handleQueryResults).not.toHaveBeenCalled();
      });
    });

    describe('testing handleQueryResults', () => {
      beforeEach(() => {
        test.cmp.ensureDom();
      });

      describe('when facet is in the results', () => {
        beforeEach(() => {
          test.cmp.handleQueryResults(fakeResultsWithFacets());
        });

        it(`facet position should be correct`, () => {
          expect(test.cmp.position).toBe(2);
        });

        it(`"createFromResponse" should be called on the values`, () => {
          expect(test.cmp.values.createFromResponse).toHaveBeenCalledTimes(1);
        });

        it(`"render" should be called on the values`, () => {
          expect(test.cmp.values.render).toHaveBeenCalledTimes(2);
        });
      });

      describe('when facet is not in the results', () => {
        beforeEach(() => {
          test.cmp.handleQueryResults(fakeResultsWithNoFacets());
        });

        it(`facet position should be "null"`, () => {
          expect(test.cmp.position).toBeNull();
        });

        it(`"resetValues" should be called on the values`, () => {
          expect(test.cmp.values.resetValues).toHaveBeenCalledTimes(1);
        });

        it(`"render" should be called on the values`, () => {
          expect(test.cmp.values.render).toHaveBeenCalledTimes(2);
        });
      });
    });
  });
}
