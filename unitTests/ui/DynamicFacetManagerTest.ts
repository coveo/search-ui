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
import { FacetValueState } from '../../src/rest/Facet/FacetValueState';
import { DynamicFacetRange } from '../../src/ui/DynamicFacet/DynamicFacetRange';
import { DynamicFacet } from '../../src/ui/DynamicFacet/DynamicFacet';
import { ComponentsTypes } from '../../src/utils/ComponentsTypes';
import { Facet } from '../../src/ui/Facet/Facet';
import { IFacetOptions } from '../../src/rest/Query';

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
        DynamicFacetTestUtils.createAdvancedFakeFacet({ field: '@field1', numberOfValues: 100 }).cmp,
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

      ComponentsTypes.getAllFacetsInstance = () => facets as any[];
    }

    function triggerAfterComponentsInitialization() {
      facets.forEach(facet => {
        Simulate.initialization(facet.getBindings() as Mock.IMockEnvironment);
      });
      Simulate.initialization(test.env);
    }

    function triggerQuerySuccess(resultFacets: IFacetResponse[]) {
      const fakeResults = FakeResults.createFakeResults();
      fakeResults.facets = resultFacets;

      facets.forEach(facet => {
        Simulate.query(facet.getBindings() as Mock.IMockEnvironment, {
          results: fakeResults
        });
      });
      Simulate.query(test.env, {
        results: fakeResults
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
      spyOn(test.cmp.logger, 'warn');
      triggerAfterComponentsInitialization();

      expect(managerContainerChildren().length).toBe(0);
      expect($$(test.cmp.element).find('.CoveoFacet')).toBeTruthy();
      expect(test.cmp.logger.warn).toHaveBeenCalled();
    });

    it('should disable the component if a query response has no "facets" parameter', () => {
      triggerAfterComponentsInitialization();
      test.cmp.enable();
      Simulate.query(test.env, {
        results: FakeResults.createFakeResults()
      });
      expect(test.cmp.disabled).toBe(true);
    });

    it('should have the component in the right order', () => {
      triggerAfterComponentsInitialization();
      expect(managerContainerChildren()[0]).toBe(facets[0].element);
      expect(managerContainerChildren()[1]).toBe(facets[1].element);
      expect(managerContainerChildren()[2]).toBe(facets[2].element);
    });

    it('should not disable the component if a query response has a "facets" parameter', () => {
      triggerAfterComponentsInitialization();
      expect(test.cmp.disabled).toBe(false);
    });

    it(`on the doneBuildingQuery event
      should call putStateIntoQueryBuilder on it's facets`, () => {
      triggerAfterComponentsInitialization();
      spyOn(facets[2], 'putStateIntoQueryBuilder');
      $$(test.env.root).trigger(QueryEvents.doneBuildingQuery, {
        queryBuilder: new QueryBuilder()
      });

      expect(facets[2].putStateIntoQueryBuilder).toHaveBeenCalledTimes(1);
    });

    it(`on the doneBuildingQuery event
      should call putStateIntoAnalytics on it's facets`, () => {
      triggerAfterComponentsInitialization();
      spyOn(facets[2], 'putStateIntoAnalytics');
      $$(test.env.root).trigger(QueryEvents.doneBuildingQuery, {
        queryBuilder: new QueryBuilder()
      });

      expect(facets[2].putStateIntoAnalytics).toHaveBeenCalledTimes(1);
    });

    it(`on the deferredQuerySuccess event
      should call handleQueryResults on it's facets`, () => {
      triggerAfterComponentsInitialization();
      spyOn(facets[2], 'handleQueryResults').and.callThrough();
      triggerQuerySuccess(queryFacetsResponse());

      expect(facets[2].handleQueryResults).toHaveBeenCalledTimes(1);
    });

    it(`when a facet is disabled
    should not be sent in the request`, () => {
      const facetIndex = 0;
      facets[facetIndex].disable();
      const queryBuilder = new QueryBuilder();
      triggerAfterComponentsInitialization();
      $$(test.env.root).trigger(QueryEvents.doneBuildingQuery, {
        queryBuilder
      });

      const facetIsInRequest = !!findWhere(queryBuilder.facetRequests, { facetId: facets[facetIndex].options.id });
      expect(facetIsInRequest).toBe(false);
    });

    it('should reorder the facets in the DOM according to order of the query facets results', () => {
      triggerAfterComponentsInitialization();
      triggerQuerySuccess(queryFacetsResponse());

      expect(managerContainerChildren()[0]).toBe(facets[1].element);
      expect(managerContainerChildren()[1]).toBe(facets[2].element);
      expect(managerContainerChildren()[2]).toBe(facets[0].element);
    });

    it('should not create addional number of facets in the DOM after each results', () => {
      triggerAfterComponentsInitialization();
      triggerQuerySuccess(queryFacetsResponse());
      triggerQuerySuccess(queryFacetsResponse());

      expect(managerContainerChildren().length).toBe(3);
    });

    it('should ignore query facets results that are not children of the manager', () => {
      triggerAfterComponentsInitialization();
      const externalFacet = DynamicFacetTestUtils.createAdvancedFakeFacet({ field: '@anotherField', numberOfValues: 1 }).cmp;
      const additionalFacetResult = DynamicFacetTestUtils.getCompleteFacetResponse(externalFacet);
      triggerQuerySuccess([additionalFacetResult, ...queryFacetsResponse()]);

      expect(managerContainerChildren().length).toBe(3);
    });

    it(`when the "enableReorder" option is "false"
    should not reorder the facets`, () => {
      options = {
        enableReorder: false
      };
      initializeManager();
      triggerAfterComponentsInitialization();
      triggerQuerySuccess(queryFacetsResponse());

      expect(managerContainerChildren()[0]).toBe(facets[0].element);
      expect(managerContainerChildren()[1]).toBe(facets[1].element);
      expect(managerContainerChildren()[2]).toBe(facets[2].element);
    });

    it(`when the "onUpdate" option is defined
    should call it for every updated facets`, () => {
      options = {
        onUpdate: jasmine.createSpy('onUpdate')
      };
      initializeManager();
      triggerAfterComponentsInitialization();
      triggerQuerySuccess(queryFacetsResponse());

      expect(options.onUpdate).toHaveBeenCalledTimes(queryFacetsResponse().length);
    });

    it(`when the "compareFacets" option is defined
    should use it to reorder facets`, () => {
      options = {
        compareFacets: (facetA, facetB) => {
          return facetB.options.numberOfValues - facetA.options.numberOfValues;
        }
      };
      initializeManager();
      triggerAfterComponentsInitialization();
      triggerQuerySuccess(queryFacetsResponse());

      expect(managerContainerChildren()[0]).toBe(facets[2].element);
      expect(managerContainerChildren()[1]).toBe(facets[0].element);
      expect(managerContainerChildren()[2]).toBe(facets[1].element);
    });

    describe('Managing the "maximumNumberOfExpandedFacets" option', () => {
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

      beforeEach(() => {
        initializeManyFacets();
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
      should collapse it`, () => {
        facets[3].options.collapsedByDefault = true;
        initForMaximumNumberOfExpandedFacets(facets.length);
        expect(collapsedFacets().length).toBe(1);
        expect(collapsedFacets()[0]).toBe(facets[3]);
      });

      it(`when there is a facet with the option "enableCollapse" set to false
      should not collapse it`, () => {
        facets[3].options.enableCollapse = false;
        initForMaximumNumberOfExpandedFacets(0);
        expect(collapsedFacets().length).toBe(facets.length - 1);
        expect(collapsedFacets().indexOf(facets[3])).toBe(-1);
      });

      it(`when there is a facet with active values
      should not collapse it`, () => {
        initForMaximumNumberOfExpandedFacets(0);
        const modifiedResponse = queryManyFacetsResponse();
        modifiedResponse[3].values[0].state = FacetValueState.selected;
        triggerQuerySuccess(modifiedResponse);

        expect(collapsedFacets().length).toBe(facets.length - 1);
        expect(collapsedFacets().indexOf(facets[3])).toBe(-1);
      });

      it(`when there is a facet with no values
      should not be taken into consideration when expanding/collapsing`, () => {
        const maximumNumberOfExpandedFacets = 2;
        initForMaximumNumberOfExpandedFacets(maximumNumberOfExpandedFacets);
        const modifiedQueryResponse = queryManyFacetsResponse();
        modifiedQueryResponse[0].values = [];
        triggerQuerySuccess(modifiedQueryResponse);

        expect(collapsedFacets().length).toBe(facets.length - (maximumNumberOfExpandedFacets + 1));
        expect(collapsedFacets().indexOf(facets[1])).toBe(-1);
        expect(collapsedFacets().indexOf(facets[2])).toBe(-1);
      });

      it(`when there is an hidden facet (e.g. depends on another facet)
      should not be taken into consideration when expanding/collapsing`, () => {
        const dependantFacet = DynamicFacetTestUtils.createAdvancedFakeFacet({ field: '@dependantFacet', dependsOn: facets[0].options.id })
          .cmp;
        facets.unshift(dependantFacet);
        const maximumNumberOfExpandedFacets = 2;
        initForMaximumNumberOfExpandedFacets(maximumNumberOfExpandedFacets);
        triggerQuerySuccess(queryManyFacetsResponse());

        expect(collapsedFacets().length).toBe(facets.length - (maximumNumberOfExpandedFacets + 1));
        expect(collapsedFacets().indexOf(facets[1])).toBe(-1);
        expect(collapsedFacets().indexOf(facets[2])).toBe(-1);
      });

      it(`when applying maximum
      should take into account facets that have to be expanded`, () => {
        facets[4].options.enableCollapse = false;

        initForMaximumNumberOfExpandedFacets(3);
        const modifiedResponse = queryManyFacetsResponse();
        modifiedResponse[6].values[0].state = FacetValueState.selected;
        triggerQuerySuccess(modifiedResponse);

        expect(collapsedFacets().length).toBe(facets.length - 3);
        expect(collapsedFacets().indexOf(facets[0])).toBe(-1);
        expect(collapsedFacets().indexOf(facets[4])).toBe(-1);
        expect(collapsedFacets().indexOf(facets[6])).toBe(-1);
      });
    });
  });
}
