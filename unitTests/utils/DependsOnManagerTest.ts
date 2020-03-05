import { $$ } from '../Test';
import { IDependentFacet, DependsOnManager } from '../../src/utils/DependsOnManager';
import { QueryStateModel, Component, QueryEvents } from '../../src/Core';
import { ComponentsTypes } from '../../src/utils/ComponentsTypes';

export interface IDependsOnManagerTestMock {
  facet: IDependentFacet;
  manager: DependsOnManager;
}

export function DependsOnManagerTest() {
  describe('DependsOnManager', () => {
    let root: HTMLElement;
    let queryStateModel: QueryStateModel;
    let masterMock: IDependsOnManagerTestMock;
    let dependentMock: IDependsOnManagerTestMock;
    const getAllFacetsInstance = ComponentsTypes.getAllFacetsInstance;

    function createMock(id: string, dependsOn?: string): IDependsOnManagerTestMock {
      const element = document.createElement('div');
      const component = new Component(element, 'typeoffacet', { root });
      component.queryStateModel = queryStateModel;
      component.options = {
        id,
        dependsOn
      };

      const facet: IDependentFacet = {
        reset: jasmine.createSpy('resetSpy'),
        ref: component
      };

      return {
        facet,
        manager: new DependsOnManager(facet)
      };
    }

    beforeEach(() => {
      root = document.createElement('div');
      queryStateModel = new QueryStateModel(root);
      masterMock = createMock('@master');
      dependentMock = createMock('@dependent', '@master');

      ComponentsTypes.getAllFacetsInstance = () => [masterMock.facet.ref, dependentMock.facet.ref];
    });

    afterAll(() => {
      ComponentsTypes.getAllFacetsInstance = getAllFacetsInstance;
    });

    it('the dependent facet is hidden at startup', () => {
      expect($$(dependentMock.facet.ref.element).isVisible()).toBe(false);
    });

    it('the master facet is visible at startup', () => {
      expect($$(masterMock.facet.ref.element).isVisible()).toBe(true);
    });

    it(`when a master facet has selected value(s) (default condition fulfilled)
      when triggering a new query
      should enable the dependent facet`, () => {
      const attribute = QueryStateModel.getFacetId(masterMock.facet.ref.options.id);
      queryStateModel.registerNewAttribute(attribute, ['a value']);
      spyOn(dependentMock.facet.ref, 'enable');

      $$(root).trigger(QueryEvents.newQuery);
      expect(dependentMock.facet.ref.enable).toHaveBeenCalledTimes(1);
    });

    it(`when a master facet has no selected value (default condition unfulfilled)
      when triggering a new query
      should disable the dependent facet`, () => {
      spyOn(dependentMock.facet.ref, 'disable');

      $$(root).trigger(QueryEvents.newQuery);
      expect(dependentMock.facet.ref.disable).toHaveBeenCalledTimes(1);
    });

    describe('when query state changes', () => {
      let attribute: string;
      beforeEach(() => {
        attribute = QueryStateModel.getFacetId(masterMock.facet.ref.options.id);
        queryStateModel.registerNewAttribute(attribute, []);
      });

      it(`should reset if parent has no selected values (default condition fulfilled)`, () => {
        $$(root).trigger('state:change');
        expect(dependentMock.facet.reset).toHaveBeenCalled();
      });

      it(`should not reset if parent has selected values (default condition unfulfilled)`, () => {
        queryStateModel.set(attribute, ['anything']);
        $$(root).trigger('state:change');
        expect(dependentMock.facet.reset).not.toHaveBeenCalled();
      });
    });

    it('calling "hasDependentFacets" on a master facet should return true', () => {
      expect(masterMock.manager.hasDependentFacets).toBe(true);
    });

    it('calling "hasDependentFacets" on a dependent facet should return false', () => {
      expect(dependentMock.manager.hasDependentFacets).toBe(false);
    });

    it(`when a master facet has dependent facets without selected values
      calling "dependentFacetsHaveSelectedValues" should return false`, () => {
      expect(masterMock.manager.dependentFacetsHaveSelectedValues).toBe(false);
    });

    it(`when a master facet has dependent facets with selected values
      calling "dependentFacetsHaveSelectedValues" should return true`, () => {
      const attribute = QueryStateModel.getFacetId(dependentMock.facet.ref.options.id);
      queryStateModel.registerNewAttribute(attribute, ['a value']);
      expect(masterMock.manager.dependentFacetsHaveSelectedValues).toBe(true);
    });
  });
}
