import { $$ } from '../Test';
import { IDependentFacet, DependsOnManager, IDependentFacetCondition, IDependsOnCompatibleFacet } from '../../src/utils/DependsOnManager';
import { QueryStateModel, Component, QueryEvents, InitializationEvents } from '../../src/Core';
import { mockSearchInterface } from '../MockEnvironment';
import { SearchInterface } from '../../src/Eager';
import { ComponentsTypes } from '../../src/utils/ComponentsTypes';

export interface IDependsOnManagerTestMock {
  facet: IDependentFacet;
  manager: DependsOnManager;
}

export function DependsOnManagerTest() {
  describe('DependsOnManager', () => {
    let root: HTMLElement;
    let searchInterface: SearchInterface;
    let queryStateModel: QueryStateModel;
    let parentMock: IDependsOnManagerTestMock;
    let dependentMock: IDependsOnManagerTestMock;

    function createMock(id: string, dependsOn?: string): IDependsOnManagerTestMock {
      const element = document.createElement('div');
      const component = new Component(element, ComponentsTypes.allFacetsType[0], { root, searchInterface }) as IDependsOnCompatibleFacet;
      component.queryStateModel = queryStateModel;
      component.options = {
        id,
        dependsOn
      };

      const facet: IDependentFacet = {
        reset: jasmine.createSpy('resetSpy'),
        ref: component
      };

      const manager = new DependsOnManager(facet);
      $$(component.root).trigger(InitializationEvents.afterComponentsInitialization);

      return {
        facet,
        manager
      };
    }

    function parentStateAttribute() {
      return QueryStateModel.getFacetId(parentMock.facet.ref.options.id);
    }

    function dependentStateAttribute() {
      return QueryStateModel.getFacetId(dependentMock.facet.ref.options.id);
    }

    function assignCustomCondition() {
      dependentMock.facet.ref.options.dependsOnCondition = <IDependentFacetCondition>function(facet) {
        const currentValues = facet.queryStateModel.get(QueryStateModel.getFacetId(facet.options.id));
        return currentValues && currentValues.indexOf('the right value') !== -1;
      };
      queryStateModel.registerNewAttribute(parentStateAttribute(), ['some other value']);
    }

    function fulfillCustomCondition() {
      queryStateModel.set(parentStateAttribute(), ['some other value', 'the right value']);
    }

    beforeEach(() => {
      searchInterface = mockSearchInterface();
      root = document.createElement('div');
      queryStateModel = new QueryStateModel(root);
      parentMock = createMock('@parent');
      dependentMock = createMock('@dependent', '@parent');
    });

    it('the dependent facet is hidden at startup', () => {
      expect($$(dependentMock.facet.ref.element).isVisible()).toBe(false);
    });

    it('the parent facet is visible at startup', () => {
      expect($$(parentMock.facet.ref.element).isVisible()).toBe(true);
    });

    describe(`when a parent facet has selected value(s) (default condition fulfilled),
    when triggering "building query"`, () => {
      beforeEach(() => {
        queryStateModel.registerNewAttribute(parentStateAttribute(), ['a value']);
        spyOn(dependentMock.facet.ref, 'enable');

        $$(root).trigger(QueryEvents.buildingQuery);
      });

      it('should enable the dependent facet', () => {
        expect(dependentMock.facet.ref.enable).toHaveBeenCalledTimes(1);
      });

      it('shows the facet', () => {
        const facet = $$(dependentMock.facet.ref.element);
        expect(facet.hasClass('coveo-hidden')).toBe(false);
      });
    });

    describe(`when a parent facet has no selected value (default condition not fulfilled),
    when triggering "building query"`, () => {
      it('should disable the dependent facet', () => {
        spyOn(dependentMock.facet.ref, 'disable');

        $$(root).trigger(QueryEvents.buildingQuery);
        expect(dependentMock.facet.ref.disable).toHaveBeenCalledTimes(1);
      });

      it('hides the facet', () => {
        const facet = $$(dependentMock.facet.ref.element);
        facet.removeClass('coveo-hidden');

        $$(root).trigger(QueryEvents.buildingQuery);
        expect(facet.hasClass('coveo-hidden')).toBe(true);
      });
    });

    it(`when a parent facet fulfills the custom condition
      when triggering "building query"
      should enable the dependent facet`, () => {
      assignCustomCondition();
      fulfillCustomCondition();
      spyOn(dependentMock.facet.ref, 'enable');

      $$(root).trigger(QueryEvents.buildingQuery);
      expect(dependentMock.facet.ref.enable).toHaveBeenCalledTimes(1);
    });

    it(`when a parent facet does not fulfill the custom condition
      when triggering "building query"
      should disable the dependent facet`, () => {
      assignCustomCondition();
      spyOn(dependentMock.facet.ref, 'disable');

      $$(root).trigger(QueryEvents.buildingQuery);
      expect(dependentMock.facet.ref.disable).toHaveBeenCalledTimes(1);
    });

    describe('when query state changes', () => {
      beforeEach(() => {
        queryStateModel.registerNewAttribute(parentStateAttribute(), []);
      });

      it(`should not reset if parent has selected values (default condition fulfilled)`, () => {
        queryStateModel.set(parentStateAttribute(), ['any value']);
        $$(root).trigger('state:change');
        expect(dependentMock.facet.reset).not.toHaveBeenCalled();
      });

      it(`should reset if parent has no selected values (default condition not fulfilled)`, () => {
        $$(root).trigger('state:change');
        expect(dependentMock.facet.reset).toHaveBeenCalled();
      });

      it(`should not reset if fulfills the custom condition`, () => {
        assignCustomCondition();
        fulfillCustomCondition();

        $$(root).trigger('state:change');
        expect(dependentMock.facet.reset).not.toHaveBeenCalled();
      });

      it(`should reset if parent does not fulfill the custom condition`, () => {
        assignCustomCondition();

        $$(root).trigger('state:change');
        expect(dependentMock.facet.reset).toHaveBeenCalled();
      });
    });

    it('calling "hasDependentFacets" on a parent facet should return true', () => {
      expect(parentMock.manager.hasDependentFacets).toBe(true);
    });

    it('calling "hasDependentFacets" on a dependent facet should return false', () => {
      expect(dependentMock.manager.hasDependentFacets).toBe(false);
    });

    it(`when a parent facet has dependent facets without selected values
      calling "dependentFacetsHaveSelectedValues" should return false`, () => {
      expect(parentMock.manager.dependentFacetsHaveSelectedValues).toBe(false);
    });

    it(`when a parent facet has dependent facets with selected values
      calling "dependentFacetsHaveSelectedValues" should return true`, () => {
      queryStateModel.registerNewAttribute(dependentStateAttribute(), ['a value']);
      expect(parentMock.manager.dependentFacetsHaveSelectedValues).toBe(true);
    });
  });
}
