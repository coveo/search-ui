import * as Mock from '../MockEnvironment';
import { Component } from '../../src/ui/Base/Component';
import { $$ } from '../../src/utils/Dom';
import { IQueryResult } from '../../src/rest/QueryResult';
import { FakeResults } from '../Fake';

export function ComponentTest() {
  describe('Component', () => {
    let env: Mock.IMockEnvironment;
    let cmp: Component;

    beforeEach(function() {
      env = new Mock.MockEnvironmentBuilder().build();
      let el = document.createElement('div');
      env.root.appendChild(el);
      cmp = new Component(el, 'Test');
    });

    afterEach(function() {
      env = null;
      cmp = null;
    });

    it('will resolve all environment variables if not provided', function() {
      expect(cmp.queryController).toBe(env.queryController);
      expect(cmp.componentOptionsModel).toBe(env.componentOptionsModel);
      expect(cmp.usageAnalytics).toBeDefined();
      expect(cmp.componentStateModel).toBe(env.componentStateModel);
      expect(cmp.queryStateModel).toBe(env.queryStateModel);
    });

    it('should return a binding object', function() {
      expect(cmp.getBindings()).toBeDefined();
    });

    it('should return a debug info object', function() {
      expect(cmp.debugInfo()).toBeDefined();
    });

    it('should be possible to disable', function() {
      cmp.disable();
      expect(cmp.disabled).toBe(true);
    });

    it('should be possible to enable', function() {
      cmp.enable();
      expect(cmp.disabled).toBe(false);
    });

    it('should be enabled by default', function() {
      expect(cmp.disabled).toBe(false);
    });

    it('should add the correct class on the component', function() {
      expect($$(cmp.element).hasClass('CoveoTest')).toBe(true);
    });

    it('should bind the component to the element', function() {
      expect(cmp.element['CoveoTest']).toBe(cmp);
    });

    it('should be able to resolve if the element is directly on the root of the interface', function() {
      let resolveDirectly = new Component(env.root, 'test');
      expect(resolveDirectly.queryController).toBe(env.queryController);
      expect(resolveDirectly.searchInterface).toBe(env.searchInterface);
    });

    describe('should allow to point form element to a dummy form', function() {
      let elementToDummyOut: HTMLInputElement;
      let elementThatShouldNotBeDummiedOut: HTMLDivElement;

      beforeEach(function() {
        elementToDummyOut = document.createElement('input');
        elementToDummyOut.setAttribute('type', 'text');
        elementThatShouldNotBeDummiedOut = document.createElement('div');
        elementThatShouldNotBeDummiedOut.appendChild(elementToDummyOut);
      });

      afterEach(function() {
        elementToDummyOut = null;
        elementThatShouldNotBeDummiedOut = null;
      });

      it('directly on an input', function() {
        Component.pointElementsToDummyForm(elementToDummyOut);
        expect(elementToDummyOut.getAttribute('form')).toBe('coveo-dummy-form');
      });

      it('but not on non-input tag', function() {
        let elementThatShouldNotBeDummiedOut = document.createElement('div');
        Component.pointElementsToDummyForm(elementThatShouldNotBeDummiedOut);
        expect(elementThatShouldNotBeDummiedOut.getAttribute('form')).toBe(null);
      });

      it('on child input', function() {
        Component.pointElementsToDummyForm(elementThatShouldNotBeDummiedOut);
        expect(elementToDummyOut.getAttribute('form')).toBe('coveo-dummy-form');
      });

      it('on multiple child input', function() {
        let elementToDummyOut2 = document.createElement('input');
        elementToDummyOut2.setAttribute('type', 'text');
        elementThatShouldNotBeDummiedOut.appendChild(elementToDummyOut2);
        Component.pointElementsToDummyForm(elementThatShouldNotBeDummiedOut);
        expect(elementToDummyOut.getAttribute('form')).toBe('coveo-dummy-form');
        expect(elementToDummyOut2.getAttribute('form')).toBe('coveo-dummy-form');
      });
    });

    describe('resolving results', function() {
      let result: IQueryResult;

      beforeEach(function() {
        result = FakeResults.createFakeResult();
      });

      afterEach(function() {
        result = null;
      });

      it('should allow to bind a result to an element', function() {
        Component.bindResultToElement(cmp.element, result);
        expect(Component.getResult(cmp.element)).toBe(result);
      });

      it('should allow to retrive a result from a child element', function() {
        Component.bindResultToElement(env.root, result);
        expect(Component.getResult(cmp.element)).toBe(result);
      });
    });

    describe('the static get method', function() {
      it('should return the component', function() {
        expect(Component.get(cmp.element)).toBe(cmp);
        expect(Component.get(cmp.element, { ID: 'Test' })).toBe(cmp);
        expect(Component.get(cmp.element, 'Test')).toBe(cmp);
      });

      it('should return the component if there is more than one component bound', function() {
        let cmp2 = new Component(cmp.element, 'Test2');

        expect(() => Component.get(cmp.element)).toThrow();
        expect(() => Component.get(cmp.element, undefined, true)).not.toThrow();
        expect(Component.get(cmp.element, { ID: 'Test' })).toBe(cmp);
        expect(Component.get(cmp.element, 'Test')).toBe(cmp);
        expect(Component.get(cmp.element, { ID: 'Test2' })).toBe(cmp2);
        expect(Component.get(cmp.element, 'Test2')).toBe(cmp2);
      });

      it('should return undefined and not throw if no component is bound', function() {
        let notAComponentElement = document.createElement('div');
        expect(() => Component.get(notAComponentElement)).not.toThrow();
        expect(Component.get(notAComponentElement)).toBeUndefined();
      });
    });
  });
}
