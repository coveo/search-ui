import * as Mock from '../../MockEnvironment';
import { CategoryFacetTestUtils } from './CategoryFacetTestUtils';
import { CategoryFacet, ICategoryFacetOptions } from '../../../src/ui/CategoryFacet/CategoryFacet';
import { FacetType } from '../../../src/rest/Facet/FacetRequest';
import { IPopulateBreadcrumbEventArgs, BreadcrumbEvents } from '../../../src/events/BreadcrumbEvents';
import { $$ } from '../../../src/Core';
import { FakeResults } from '../../Fake';
import { Simulate } from '../../Simulate';
import { IFacetResponseValue } from '../../../src/rest/Facet/FacetResponse';
import { FacetValueState } from '../../../src/rest/Facet/FacetValueState';

export function CategoryFacetTest() {
  describe('CategoryFacet', () => {
    let env: Mock.IMockEnvironment;
    let facet: CategoryFacet;
    let options: ICategoryFacetOptions;
    let mockFacetValues: IFacetResponseValue[]

    beforeEach(() => {
      options = { field: '@dummy' };
      initializeComponent();
    });

    function initializeComponent() {
      const test = CategoryFacetTestUtils.createAdvancedFakeFacet(options);
      facet = test.cmp;
      env = test.env;
      mockFacetValues = CategoryFacetTestUtils.createFakeFacetResponseValues(3, 5);

      facet.values.createFromResponse(CategoryFacetTestUtils.getCompleteFacetResponse(facet, {
        values: mockFacetValues
      }));

      spyOn(facet, 'selectPath').and.callThrough();
      spyOn(facet, 'clear').and.callThrough();
    }

    function triggerPopulateBreadcrumbs() {
      const args: IPopulateBreadcrumbEventArgs = { breadcrumbs: [] };
      $$(env.root).trigger(BreadcrumbEvents.populateBreadcrumb, args);
      return args.breadcrumbs;
    }

    function testQueryStateModelValues(path: string[]) {
      const qsmValues: string[] = env.queryStateModel.attributes[`f:${facet.options.id}`];
      expect(qsmValues).toEqual(path);
    }

    it('fieldName should return the field without @', () => {
      expect(facet.fieldName).toBe('dummy');
    });

    it('facetType should be hierarchical', () => {
      expect(facet.facetType).toBe(FacetType.hierarchical);
    });

    it('should populate breadcrumbs by default', () => {
      facet.selectPath(['foo']);
      const breadcrumbs = triggerPopulateBreadcrumbs();

      expect(breadcrumbs.length).toBe(1);
    });

    it('should not populate breadcrumbs if the option includeInBreadcrumb is set to "false"', () => {
      options.includeInBreadcrumb = false;
      initializeComponent();

      facet.selectPath(['foo']);
      const breadcrumbs = triggerPopulateBreadcrumbs();

      expect(breadcrumbs.length).toBe(0);
    });

    it('calling changeActivePath with a path updates the QueryStateModel', () => {
      facet.changeActivePath(['a', 'path']);
      testQueryStateModelValues(['a', 'path']);
    });

    it('calling changeActivePath with an empty path updates the QueryStateModel', () => {
      facet.changeActivePath([]);
      testQueryStateModelValues([]);
    });

    it(`when a previously idle value is returned selected by the API (autoselection)
    should update the QSM correctly`, () => {
      mockFacetValues[0].children = [];
      mockFacetValues[0].state = FacetValueState.selected;
      const results = FakeResults.createFakeResults();
      results.facets = [CategoryFacetTestUtils.getCompleteFacetResponse(facet, {
        values: [CategoryFacetTestUtils.createFakeSelectedFacetResponseValue()]
      })];
      Simulate.query(env, { results });

      testQueryStateModelValues(['v0']);
    });

    it('should call selectPath and log an analytics event when selecting a path through the QSM', () => {
      env.queryStateModel.registerNewAttribute(`f:${facet.options.id}`, []);
      env.queryStateModel.set(`f:${facet.options.id}`, ['a', 'b', 'c']);

      expect(facet.selectPath).toHaveBeenCalledWith(['a', 'b', 'c']);
      // TODO: JSUI-2709 add analytics
    });

    it('should call clear and log an analytics event when clearing the path through the QSM', () => {
      env.queryStateModel.registerNewAttribute(`f:${facet.options.id}`, ['allo']);
      env.queryStateModel.set(`f:${facet.options.id}`, []);

      expect(facet.clear).toHaveBeenCalled();
      // TODO: JSUI-2709 add analytics
    });


    // TODO: Test expand/collapse
    // TODO: Test active/empty/hidden state
    // TODO: Test isCurrentlyDisplayed
    // TODO: Test trigger new query
    // TODO: Test trigger new isolated query
    // TODO: Test reset
    // TODO: Test clear
    // etc.
  });
}
