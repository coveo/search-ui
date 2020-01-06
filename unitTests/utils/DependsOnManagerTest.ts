import { $$ } from '../Test';
import { IDependentFacet, DependsOnManager } from '../../src/utils/DependsOnManager';
import { QueryStateModel, QueryEvents, Component } from '../../src/Core';
import { ComponentsTypes } from '../../src/utils/ComponentsTypes';

export interface IDependsOnManagerTestMock {
  facet: IDependentFacet;
  component: Component;
  manager: DependsOnManager;
}

export function DependsOnManagerTest() {
  describe('DependsOnManager', () => {
    let root: HTMLElement;
    let queryStateModel: QueryStateModel;
    let masterMock: IDependsOnManagerTestMock;
    let dependentMock: IDependsOnManagerTestMock;

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
        toggleDependentFacet: jasmine.createSpy('toggleSpy'),
        bind: component.bind,
        element,
        id,
        dependsOn,
        root,
        queryStateModel
      };

      return {
        facet,
        component,
        manager: new DependsOnManager(facet)
      };
    }

    beforeEach(() => {
      root = document.createElement('div');
      queryStateModel = new QueryStateModel(root);
      masterMock = createMock('@master');
      dependentMock = createMock('@dependent', '@master');
      spyOn(ComponentsTypes, 'getAllFacetsInstance').and.returnValue([masterMock.component, dependentMock.component]);
    });

    it('the dependent facet is hidden at startup', () => {
      expect($$(dependentMock.facet.element).isVisible()).toBe(false);
    });

    it('the master facet is visible at startup', () => {
      expect($$(masterMock.facet.element).isVisible()).toBe(true);
    });

    it(`when a master facet has selected value(s)
    calling "updateVisibilityBasedOnDependsOn" should show the dependent facet`, () => {
      const attribute = QueryStateModel.getFacetId(masterMock.facet.id);
      queryStateModel.registerNewAttribute(attribute, ['a value']);

      dependentMock.manager.updateVisibilityBasedOnDependsOn();
      expect($$(dependentMock.facet.element).isVisible()).toBe(true);
    });

    it(`when a master facet has no selected values
    calling "updateVisibilityBasedOnDependsOn" should hide the dependent facet`, () => {
      const attribute = QueryStateModel.getFacetId(masterMock.facet.id);
      queryStateModel.registerNewAttribute(attribute, []);

      dependentMock.manager.updateVisibilityBasedOnDependsOn();
      expect($$(dependentMock.facet.element).isVisible()).toBe(false);
    });

    it(`when triggering a new query
      should call "toggleDependentFacet" on the master facet`, () => {
      $$(root).trigger(QueryEvents.newQuery);

      expect(masterMock.facet.toggleDependentFacet).toHaveBeenCalledWith(dependentMock.component);
    });

    describe('when "listenToParentIfDependentFacet" is triggered on a dependent facet', () => {
      let attribute: string;
      beforeEach(() => {
        attribute = QueryStateModel.getFacetId(masterMock.facet.id);
        dependentMock.manager.listenToParentIfDependentFacet();
        queryStateModel.registerNewAttribute(attribute, []);
      });

      it(`when query state changes
      should reset if parent has no selected values`, () => {
        $$(root).trigger('state:change');
        expect(dependentMock.facet.reset).toHaveBeenCalled();
      });

      it(`when query state changes
      should not reset if parent has selected values`, () => {
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
      const attribute = QueryStateModel.getFacetId(dependentMock.facet.id);
      queryStateModel.registerNewAttribute(attribute, ['a value']);
      expect(masterMock.manager.dependentFacetsHaveSelectedValues).toBe(true);
    });
  });
}
