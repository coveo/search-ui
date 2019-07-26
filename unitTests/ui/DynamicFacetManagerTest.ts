import { $$ } from '../../src/utils/Dom';
import * as Mock from '../MockEnvironment';
import { DynamicFacetManager, IDynamicFacetManagerOptions } from '../../src/ui/DynamicFacetManager/DynamicFacetManager';
import { DynamicFacetTestUtils } from './DynamicFacet/DynamicFacetTestUtils';
import { IFacetResponse } from '../../src/rest/Facet/FacetResponse';
import { DynamicFacet } from '../../src/ui/DynamicFacet/DynamicFacet';
import { Simulate } from '../Simulate';
import { FakeResults } from '../Fake';
import { findWhere } from 'underscore';
import { QueryEvents, QueryBuilder } from '../../src/Core';

export function DynamicFacetManagerTest() {
  describe('DynamicFacetManager', () => {
    let test: Mock.IBasicComponentSetup<DynamicFacetManager>;
    let options: IDynamicFacetManagerOptions;
    let facets: DynamicFacet[];

    beforeEach(() => {
      options = {};
      initializeFacets();
      initializeManager();
      test.cmp.ensureDom();
    });

    function initializeFacets() {
      facets = [
        DynamicFacetTestUtils.createAdvancedFakeFacet({ numberOfValues: 10 }).cmp,
        DynamicFacetTestUtils.createAdvancedFakeFacet({ numberOfValues: 5 }).cmp,
        DynamicFacetTestUtils.createAdvancedFakeFacet({ numberOfValues: 100 }).cmp
      ];

      createValuesForFacets();
    }

    function createValuesForFacets() {
      facets.forEach(facet => {
        facet.ensureDom();
        facet.values.createFromResponse(
          DynamicFacetTestUtils.getCompleteFacetResponse(facet, { values: DynamicFacetTestUtils.createFakeFacetValues() })
        );
      });
    }

    function initializeManager() {
      test = Mock.advancedComponentSetup<DynamicFacetManager>(DynamicFacetManager, <Mock.AdvancedComponentSetupOptions>{
        cmpOptions: options,
        modifyBuilder: builder => {
          builder.element.appendChild(facets[0].element);
          builder.element.appendChild(facets[1].element);
          builder.element.appendChild(facets[2].element);
          return builder;
        }
      });

      test.env.searchInterface.getComponents = () => facets as any[];
    }

    function triggerAfterComponentsInitialization() {
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
        DynamicFacetTestUtils.getCompleteFacetResponse(facets[2]),
        DynamicFacetTestUtils.getCompleteFacetResponse(facets[0])
      ];
    }

    it('should disable the component if it contains no DynamicFacet child', () => {
      test.env.searchInterface.getComponents = () => [];
      triggerAfterComponentsInitialization();
      expect(test.cmp.disabled).toBe(true);
    });

    it('should disable the component if a query response has no facets parameter', () => {
      triggerAfterComponentsInitialization();
      test.cmp.enable();
      Simulate.query(test.env, {
        results: FakeResults.createFakeResults()
      });
      expect(test.cmp.disabled).toBe(true);
    });

    it('should have the component in the right order', () => {
      expect(managerContainerChildren()[0]).toBe(facets[0].element);
      expect(managerContainerChildren()[1]).toBe(facets[1].element);
      expect(managerContainerChildren()[2]).toBe(facets[2].element);
    });

    it('should not disable the component if a query response has no facets parameter', () => {
      triggerAfterComponentsInitialization();
      expect(test.cmp.disabled).toBe(false);
    });

    it(`when a facet is disabled
    should not be sent in the request`, () => {
      facets[0].disable();
      const queryBuilder = new QueryBuilder();
      triggerAfterComponentsInitialization();
      $$(test.env.root).trigger(QueryEvents.doneBuildingQuery, {
        queryBuilder
      });

      const facetIsInRequest = !!findWhere(queryBuilder.facetRequests, { facetId: facets[0].options.id });
      expect(facetIsInRequest).toBe(false);
    });

    it(`when a facet has no values
    should not be appended in the manager container`, () => {
      triggerAfterComponentsInitialization();
      const modifiedQueryResponse = queryFacetsResponse();
      modifiedQueryResponse[0].values = [];

      triggerQuerySuccess(modifiedQueryResponse);
      expect(managerContainerChildren().length).toBe(facets.length - 1);
      expect(managerContainerChildren()[0]).not.toBe(facets[1].element);
    });

    it('should reorder the facets in the DOM according to order of the query results', () => {
      triggerAfterComponentsInitialization();
      triggerQuerySuccess(queryFacetsResponse());

      expect(managerContainerChildren()[0]).toBe(facets[1].element);
      expect(managerContainerChildren()[1]).toBe(facets[2].element);
      expect(managerContainerChildren()[2]).toBe(facets[0].element);
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
  });
}
