import { $$ } from '../../src/utils/Dom';
import * as Mock from '../MockEnvironment';
import { DynamicFacetManager, IDynamicFacetManagerOptions } from '../../src/ui/DynamicFacetManager/DynamicFacetManager';
import { DynamicFacetTestUtils } from './DynamicFacet/DynamicFacetTestUtils';
import { DynamicFacetRangeTestUtils } from './DynamicFacet/DynamicFacetRangeTestUtils';
import { IFacetResponse } from '../../src/rest/Facet/FacetResponse';
import { Simulate } from '../Simulate';
import { FakeResults } from '../Fake';
import { findWhere } from 'underscore';
import { QueryEvents, QueryBuilder } from '../../src/Core';
import { DynamicFacetRange } from '../../src/ui/DynamicFacet/DynamicFacetRange';
import { DynamicFacet } from '../../src/ui/DynamicFacet/DynamicFacet';
import { ComponentsTypes } from '../../src/utils/ComponentsTypes';
import { Facet } from '../../src/ui/Facet/Facet';
import { IFacetOptions, IQuery } from '../../src/rest/Query';

export function DynamicFacetManagerTest() {
  describe('DynamicFacetManager', () => {
    let test: Mock.IBasicComponentSetup<DynamicFacetManager>;
    let options: IDynamicFacetManagerOptions;
    let facets: DynamicFacet[];
    const getAllFacetsInstance = ComponentsTypes.getAllFacetsInstance;

    beforeEach(() => {
      options = {};
      initializeFacets();
      initializeManager();
    });

    afterAll(() => {
      ComponentsTypes.getAllFacetsInstance = getAllFacetsInstance;
    });

    function initializeFacets() {
      facets = [
        DynamicFacetTestUtils.createAdvancedFakeFacet({ field: '@field1', numberOfValues: 10 }).cmp,
        DynamicFacetTestUtils.createAdvancedFakeFacet({ field: '@field2', numberOfValues: 5 }).cmp,
        DynamicFacetRangeTestUtils.createAdvancedFakeFacet({
          field: '@field3',
          numberOfValues: 100,
          ranges: DynamicFacetRangeTestUtils.createFakeRanges(100)
        }).cmp
      ];
    }

    function initializeManager() {
      test = Mock.advancedComponentSetup<DynamicFacetManager>(DynamicFacetManager, <Mock.AdvancedComponentSetupOptions>{
        cmpOptions: options,
        modifyBuilder: builder => {
          facets.forEach(facet => builder.element.appendChild(facet.element));
          return builder;
        }
      });

      spyOn(test.cmp.logger, 'error');
      spyOn(test.cmp.logger, 'warn');

      ComponentsTypes.getAllFacetsInstance = () => facets as any[];
    }

    function triggerAfterComponentsInitialization() {
      facets.forEach(facet => {
        Simulate.initialization(facet.getBindings() as Mock.IMockEnvironment);
      });
      Simulate.initialization(test.env);
    }

    function triggerQuerySuccess(resultFacets: IFacetResponse[] = queryFacetsResponse(), freezeFacetOrder = false) {
      const fakeResults = FakeResults.createFakeResults();
      fakeResults.facets = resultFacets;
      const query: IQuery = {
        ...new QueryBuilder().build(),
        facetOptions: { freezeFacetOrder }
      };

      facets.forEach(facet => {
        Simulate.query(facet.getBindings() as Mock.IMockEnvironment, {
          results: fakeResults,
          query
        });
      });
      Simulate.query(test.env, {
        results: fakeResults,
        query
      });
    }

    function managerContainerChildren() {
      return $$(test.cmp.element).find('.coveo-dynamic-facet-manager-container').children;
    }

    function queryFacetsResponse(): IFacetResponse[] {
      return [
        DynamicFacetTestUtils.getCompleteFacetResponse(facets[1]),
        DynamicFacetRangeTestUtils.getCompleteFacetResponse(<DynamicFacetRange>facets[2]),
        DynamicFacetTestUtils.getCompleteFacetResponse(facets[0])
      ];
    }

    function expectFacetsToBeInQueryResponsePosition() {
      expect(managerContainerChildren()[0]).toBe(facets[1].element);
      expect(managerContainerChildren()[1]).toBe(facets[2].element);
      expect(managerContainerChildren()[2]).toBe(facets[0].element);
    }

    function expectFacetsToBeInOriginalPosition() {
      expect(managerContainerChildren()[0]).toBe(facets[0].element);
      expect(managerContainerChildren()[1]).toBe(facets[1].element);
      expect(managerContainerChildren()[2]).toBe(facets[2].element);
    }

    describe('testing after components initialization', () => {
      it(`should have the facets in the original order (DOM)`, () => {
        triggerAfterComponentsInitialization();
        expectFacetsToBeInOriginalPosition();
      });

      it('should disable the component if it contains no DynamicFacet child', () => {
        ComponentsTypes.getAllFacetsInstance = () => [];
        triggerAfterComponentsInitialization();
        expect(test.cmp.disabled).toBe(true);
      });

      it(`when there are incompatible elements inside the DynamicFacetManager
        should move them outside the container and warn the user`, () => {
        const nonDynamicFacet = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, <IFacetOptions>{
          field: '@field'
        }).cmp;
        facets = [nonDynamicFacet as any];
        initializeManager();
        triggerAfterComponentsInitialization();

        expect(managerContainerChildren().length).toBe(0);
        expect($$(test.cmp.element).find('.CoveoFacet')).toBeTruthy();
        expect(test.cmp.logger.warn).toHaveBeenCalled();
      });
    });

    describe('testing on building query', () => {
      let queryBuilder: QueryBuilder;

      function triggerBuildingQuery() {
        queryBuilder = new QueryBuilder();
        $$(test.env.root).trigger(QueryEvents.doneBuildingQuery, { queryBuilder });
      }

      beforeEach(() => {
        spyOn(facets[2], 'putStateIntoQueryBuilder');
        spyOn(facets[2], 'putStateIntoAnalytics');
        triggerAfterComponentsInitialization();
        triggerBuildingQuery();
      });

      it(`should call putStateIntoQueryBuilder on it's facets`, () => {
        expect(facets[2].putStateIntoQueryBuilder).toHaveBeenCalledTimes(1);
      });

      it(`should call putStateIntoAnalytics on it's facets`, () => {
        expect(facets[2].putStateIntoAnalytics).toHaveBeenCalledTimes(1);
      });

      it(`when a facet is disabled
      should not be sent in the request`, () => {
        const facetIndex = 0;
        facets[facetIndex].disable();

        triggerBuildingQuery();
        const facetIsInRequest = !!findWhere(queryBuilder.facetRequests, { facetId: facets[facetIndex].options.id });
        expect(facetIsInRequest).toBe(false);
      });
    });

    describe('testing on a successful query', () => {
      beforeEach(() => {
        triggerAfterComponentsInitialization();
      });

      it(`when a query response has no "facets" parameter
        should disable the component and display an error to the user`, () => {
        test.cmp.enable();
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults()
        });
        expect(test.cmp.logger.error).toHaveBeenCalled();
        expect(test.cmp.disabled).toBe(true);
      });

      it(`when a query response has a "facets" parameter
        should not disable the component nor display an error to the user`, () => {
        triggerQuerySuccess();
        expect(test.cmp.logger.error).not.toHaveBeenCalled();
        expect(test.cmp.disabled).toBe(false);
      });

      it(`should call handleQueryResults on it's facets`, () => {
        triggerAfterComponentsInitialization();
        spyOn(facets[2], 'handleQueryResults').and.callThrough();
        triggerQuerySuccess();

        expect(facets[2].handleQueryResults).toHaveBeenCalledTimes(1);
      });

      it(`after multiple calls
        should not create additional facets in the DOM`, () => {
        triggerQuerySuccess();
        triggerQuerySuccess();

        expect(managerContainerChildren().length).toBe(facets.length);
      });

      it('should ignore query facets results that are not children of the manager', () => {
        const externalFacet = DynamicFacetTestUtils.createAdvancedFakeFacet({ field: '@anotherField', numberOfValues: 1 }).cmp;
        const additionalFacetResult = DynamicFacetTestUtils.getCompleteFacetResponse(externalFacet);
        triggerQuerySuccess([additionalFacetResult, ...queryFacetsResponse()]);

        expect(managerContainerChildren().length).toBe(facets.length);
      });

      it(`when the query option "freezeFacetOrder" option is false (default)
        when the "enableReorder" option is true (default)
        when the "compareFacets" option is not defined (default)
        should reorder the facets in the DOM according to order of the query facets results`, () => {
        triggerQuerySuccess();

        expectFacetsToBeInQueryResponsePosition();
      });

      it(`when the query option "freezeFacetOrder" option is true
        should not reorder the facets in the DOM `, () => {
        triggerQuerySuccess(queryFacetsResponse(), true);

        expectFacetsToBeInOriginalPosition();
      });

      it(`when the query option "freezeFacetOrder" option is false (default)
        when the "enableReorder" option is false
        should not reorder the facets in the DOM`, () => {
        test.cmp.options.enableReorder = false;
        triggerQuerySuccess();

        expectFacetsToBeInOriginalPosition();
      });

      it(`when the query option "freezeFacetOrder" option is false (default)
        when the "enableReorder" option is true (default)
        when the "compareFacets" option is defined
        should reorder the facets in the DOM according to the "compareFacets" option`, () => {
        test.cmp.options.compareFacets = (facetA, facetB) => facetB.options.numberOfValues - facetA.options.numberOfValues;
        triggerQuerySuccess();

        expect(managerContainerChildren()[0]).toBe(facets[2].element);
        expect(managerContainerChildren()[1]).toBe(facets[0].element);
        expect(managerContainerChildren()[2]).toBe(facets[1].element);
      });

      it(`when the "onUpdate" option is defined
      should call onUpdate for every child facets facets`, () => {
        test.cmp.options.onUpdate = jasmine.createSpy('onUpdate');
        triggerQuerySuccess();
        expect(options.onUpdate).toHaveBeenCalledTimes(facets.length);
      });

      it(`when the "onUpdate" option is defined
      (even) when the query option "freezeFacetOrder" option is true
      should call onUpdate for every child facets facets`, () => {
        test.cmp.options.onUpdate = jasmine.createSpy('onUpdate');
        triggerQuerySuccess(queryFacetsResponse(), true);
        expect(options.onUpdate).toHaveBeenCalledTimes(facets.length);
      });
    });

    describe(`testing that the "maximumNumberOfExpandedFacets" option 
    is respected on a successful query`, () => {
      function initializeManyFacets(numberOfFacets = 10) {
        facets = [];
        for (let index = 0; index < numberOfFacets; index++) {
          facets.push(DynamicFacetTestUtils.createAdvancedFakeFacet({ field: `@field${index}` }).cmp);
        }
      }

      function queryManyFacetsResponse(): IFacetResponse[] {
        return facets.map(facet => DynamicFacetTestUtils.getCompleteFacetResponse(facet));
      }

      function initForMaximumNumberOfExpandedFacets(max: number) {
        options = { maximumNumberOfExpandedFacets: max };
        initializeManager();
        triggerAfterComponentsInitialization();
        triggerQuerySuccess(queryManyFacetsResponse());
      }

      function collapsedFacets() {
        return facets.filter(facet => facet.isCollapsed);
      }

      function expandedFacets() {
        return facets.filter(facet => !facet.isCollapsed);
      }

      beforeEach(() => {
        initializeManyFacets();
      });

      it(`when the query option "freezeFacetOrder" option is true
        should collapse/expand any facets (should keep previous setting)`, () => {
        initForMaximumNumberOfExpandedFacets(2);

        collapsedFacets()[0].expand();
        const updateNumberOfCollapsedFacets = collapsedFacets().length;
        triggerQuerySuccess(queryManyFacetsResponse(), true);

        expect(collapsedFacets().length).toBe(updateNumberOfCollapsedFacets);
      });

      it(`when "maximumNumberOfExpandedFacets" is -1
      should not collapse any facets`, () => {
        initForMaximumNumberOfExpandedFacets(-1);
        expect(collapsedFacets().length).toBe(0);
      });

      it(`when "maximumNumberOfExpandedFacets" is 0
      should collapse all facets`, () => {
        initForMaximumNumberOfExpandedFacets(0);
        expect(collapsedFacets().length).toBe(facets.length);
      });

      it(`when "maximumNumberOfExpandedFacets" is 1
      should only expand the first facet`, () => {
        initForMaximumNumberOfExpandedFacets(1);
        expect(collapsedFacets().length).toBe(facets.length - 1);
        expect(collapsedFacets().indexOf(facets[0])).toBe(-1);
      });

      it(`when there is a facet with the option "collapsedByDefault" set to true
      should collapse it nevertheless and log an info to the client`, () => {
        facets[3].options.collapsedByDefault = true;
        spyOn(facets[3].logger, 'info');
        initForMaximumNumberOfExpandedFacets(facets.length);

        expect(collapsedFacets().length).toBe(1);
        expect(collapsedFacets()[0]).toBe(facets[3]);
        expect(facets[3].logger.info).toHaveBeenCalled();
      });

      it(`when there is a facet with the option "enableCollapse" set to false
      should not collapse it`, () => {
        facets[3].options.enableCollapse = false;
        initForMaximumNumberOfExpandedFacets(0);
        expect(collapsedFacets().length).toBe(facets.length - 1);
        expect(collapsedFacets().indexOf(facets[3])).toBe(-1);
      });

      it(`when there is a hidden facet (e.g. without values)
      should not be taken into consideration when expanding/collapsing`, () => {
        initForMaximumNumberOfExpandedFacets(1);
        triggerQuerySuccess(queryManyFacetsResponse().slice(1));

        expect(expandedFacets().length).toBe(2);
        expect(expandedFacets()[1]).toBe(facets[1]);
      });

      it(`when there is an hidden facet (e.g. depends on another facet)
      should not be taken into consideration when expanding/collapsing`, () => {
        const dependantFacet = DynamicFacetTestUtils.createAdvancedFakeFacet({ field: '@dependantFacet', dependsOn: facets[0].options.id })
          .cmp;
        facets.unshift(dependantFacet);
        initForMaximumNumberOfExpandedFacets(1);
        triggerQuerySuccess(queryManyFacetsResponse());

        expect(expandedFacets().length).toBe(2);
        expect(expandedFacets()[1]).toBe(facets[1]);
      });
    });
  });
}
