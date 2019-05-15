import { $$ } from '../../src/utils/Dom';
import * as Mock from '../MockEnvironment';
import { DynamicFacetManager, IDynamicFacetManagerOptions } from '../../src/ui/DynamicFacetManager/DynamicFacetManager';
import { DynamicFacetTestUtils } from './DynamicFacet/DynamicFacetTestUtils';
import { IFacetResponse } from '../../src/rest/Facet/FacetResponse';
import { DynamicFacet } from '../../src/ui/DynamicFacet/DynamicFacet';
import { Simulate } from '../Simulate';
import { FakeResults } from '../Fake';

export function DynamicFacetManagerTest() {
  describe('DynamicFacetManager', () => {
    let test: Mock.IBasicComponentSetup<DynamicFacetManager>;
    let options: IDynamicFacetManagerOptions;
    let facets: DynamicFacet[];

    beforeEach(() => {
      options = {};
      initializeFacets();
      initializeComponent();
      test.cmp.ensureDom();
    });

    function initializeFacets() {
      facets = [
        DynamicFacetTestUtils.createFakeFacet({ id: 'test1', field: '@test1', numberOfValues: 10 }),
        DynamicFacetTestUtils.createFakeFacet({ id: 'test2', field: '@test2', numberOfValues: 5 }),
        DynamicFacetTestUtils.createFakeFacet({ id: 'test3', field: '@test3', numberOfValues: 100 })
      ];
    }

    function initializeComponent() {
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
      const fakeResult = FakeResults.createFakeResults();
      fakeResult.facets = resultFacets;

      Simulate.query(test.env, {
        results: fakeResult
      });
    }

    function managerContainerChildren() {
      return $$(test.cmp.element).find('.coveo-ml-facet-manager-container').children;
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

    it('should reorder the facets correctly in the DOM depending on the query results', () => {
      triggerAfterComponentsInitialization();
      triggerQuerySuccess(queryFacetsResponse());

      expect(managerContainerChildren()[0]).toBe(facets[1].element);
      expect(managerContainerChildren()[1]).toBe(facets[2].element);
      expect(managerContainerChildren()[2]).toBe(facets[0].element);
    });

    it('should remove the facets not in the response', () => {
      triggerAfterComponentsInitialization();
      triggerQuerySuccess([]);

      expect(managerContainerChildren().length).toBe(0);
    });

    it(`when the "enableReorder" option is "false"
    should not reorder the facets`, () => {
      options = {
        enableReorder: false
      };
      initializeComponent();
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
      initializeComponent();
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
      initializeComponent();
      triggerAfterComponentsInitialization();
      triggerQuerySuccess(queryFacetsResponse());

      expect(managerContainerChildren()[0]).toBe(facets[2].element);
      expect(managerContainerChildren()[1]).toBe(facets[0].element);
      expect(managerContainerChildren()[2]).toBe(facets[1].element);
    });
  });
}
