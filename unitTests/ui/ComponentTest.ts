import * as Mock from '../MockEnvironment';
import { Component } from '../../src/ui/Base/Component';
import { SearchInterface } from '../../src/ui/SearchInterface/SearchInterface';
import { $$ } from '../../src/utils/Dom';
import { IQueryResult } from '../../src/rest/QueryResult';
import { FakeResults } from '../Fake';

export function ComponentTest() {
  describe('Component', () => {
    let env: Mock.IMockEnvironment;
    let cmp: Component;

    beforeEach(() => {
      env = new Mock.MockEnvironmentBuilder().build();
      let el = document.createElement('div');
      env.root.appendChild(el);
      cmp = new Component(el, 'Test');
    });

    afterEach(() => {
      env = null;
      cmp = null;
    });

    it('will resolve all environment variables if not provided', () => {
      expect(cmp.queryController).toBe(env.queryController);
      expect(cmp.componentOptionsModel).toBe(env.componentOptionsModel);
      expect(cmp.usageAnalytics).toBeDefined();
      expect(cmp.componentStateModel).toBe(env.componentStateModel);
      expect(cmp.queryStateModel).toBe(env.queryStateModel);
    });

    it('should return a binding object', () => {
      expect(cmp.getBindings()).toBeDefined();
    });

    it('should return a debug info object', () => {
      expect(cmp.debugInfo()).toBeDefined();
    });

    it('should be possible to disable', () => {
      cmp.disable();
      expect(cmp.disabled).toBe(true);
    });

    it('should be possible to enable', () => {
      cmp.enable();
      expect(cmp.disabled).toBe(false);
    });

    it('should be enabled by default', () => {
      expect(cmp.disabled).toBe(false);
    });

    it('should add the correct class on the component', () => {
      expect($$(cmp.element).hasClass('CoveoTest')).toBe(true);
    });

    it('should bind the component to the element', () => {
      expect(cmp.element['CoveoTest']).toBe(cmp);
    });

    it('should be able to resolve if the element is directly on the root of the interface', () => {
      let resolveDirectly = new Component(env.root, 'test');
      expect(resolveDirectly.queryController).toBe(env.queryController);
      expect(resolveDirectly.searchInterface).toBe(env.searchInterface);
    });

    describe('should allow to point form element to a dummy form', () => {
      let elementToDummyOut: HTMLInputElement;
      let elementThatShouldNotBeDummiedOut: HTMLDivElement;

      beforeEach(() => {
        elementToDummyOut = document.createElement('input');
        elementToDummyOut.setAttribute('type', 'text');
        elementThatShouldNotBeDummiedOut = document.createElement('div');
        elementThatShouldNotBeDummiedOut.appendChild(elementToDummyOut);
      });

      afterEach(() => {
        elementToDummyOut = null;
        elementThatShouldNotBeDummiedOut = null;
      });

      it('directly on an input', () => {
        Component.pointElementsToDummyForm(elementToDummyOut);
        expect(elementToDummyOut.getAttribute('form')).toBe('coveo-dummy-form');
      });

      it('but not on non-input tag', () => {
        let elementThatShouldNotBeDummiedOut = document.createElement('div');
        Component.pointElementsToDummyForm(elementThatShouldNotBeDummiedOut);
        expect(elementThatShouldNotBeDummiedOut.getAttribute('form')).toBe(null);
      });

      it('on child input', () => {
        Component.pointElementsToDummyForm(elementThatShouldNotBeDummiedOut);
        expect(elementToDummyOut.getAttribute('form')).toBe('coveo-dummy-form');
      });

      it('on multiple child input', () => {
        let elementToDummyOut2 = document.createElement('input');
        elementToDummyOut2.setAttribute('type', 'text');
        elementThatShouldNotBeDummiedOut.appendChild(elementToDummyOut2);
        Component.pointElementsToDummyForm(elementThatShouldNotBeDummiedOut);
        expect(elementToDummyOut.getAttribute('form')).toBe('coveo-dummy-form');
        expect(elementToDummyOut2.getAttribute('form')).toBe('coveo-dummy-form');
      });
    });

    describe('resolving results', () => {
      let result: IQueryResult;

      beforeEach(() => {
        result = FakeResults.createFakeResult();
      });

      afterEach(() => {
        result = null;
      });

      it('should allow to bind a result to an element', () => {
        Component.bindResultToElement(cmp.element, result);
        expect(Component.getResult(cmp.element)).toBe(result);
      });

      it('should allow to retrive a result from a child element', () => {
        Component.bindResultToElement(env.root, result);
        expect(Component.getResult(cmp.element)).toBe(result);
      });
    });

    describe('the static get method', () => {
      it('should return the component', () => {
        expect(Component.get(cmp.element)).toBe(cmp);
        expect(Component.get(cmp.element, { ID: 'Test' })).toBe(cmp);
        expect(Component.get(cmp.element, 'Test')).toBe(cmp);
      });

      it('should return the component if there is more than one component bound', () => {
        let cmp2 = new Component(cmp.element, 'Test2');

        expect(() => Component.get(cmp.element)).toThrow();
        expect(() => Component.get(cmp.element, undefined, true)).not.toThrow();
        expect(Component.get(cmp.element, { ID: 'Test' })).toBe(cmp);
        expect(Component.get(cmp.element, 'Test')).toBe(cmp);
        expect(Component.get(cmp.element, { ID: 'Test2' })).toBe(cmp2);
        expect(Component.get(cmp.element, 'Test2')).toBe(cmp2);
      });

      it('should return undefined and not throw if no component is bound', () => {
        let notAComponentElement = document.createElement('div');
        expect(() => Component.get(notAComponentElement)).not.toThrow();
        expect(Component.get(notAComponentElement)).toBeUndefined();
      });
    });

    describe('the static resolveRoot method', () => {
      it('resolves the root when called on the root', () => {
        const searchInterface = Component.resolveRoot(env.root);
        expect(searchInterface).toEqual(env.root);
      });

      it('resolves the root when called on a descendant element of the root', () => {
        const childElement = document.createElement('div');
        env.root.appendChild(childElement);
        const descendantElement = document.createElement('div');
        childElement.appendChild(descendantElement);

        const searchInterface = Component.resolveRoot(descendantElement);
        expect(searchInterface).toEqual(env.root);
      });

      it('resolves the root when called on a descendant element of an external component', () => {
        const element = document.createElement('div');
        const component = new Component(element, 'test', cmp.getBindings());

        const childElement = document.createElement('div');
        element.appendChild(childElement);
        const descendantElement = document.createElement('div');
        childElement.appendChild(descendantElement);

        const searchInterface = Component.resolveRoot(descendantElement);
        expect(searchInterface).toEqual(env.root);
        expect(component.element.parentElement).toBeNull();
      });
    });

    describe('the static resolveBinding method', () => {
      it('when the specified element holds the target class, it resolves the target class', () => {
        const searchInterface = Component.resolveBinding(env.root, SearchInterface);
        expect(searchInterface).toBeTruthy();
      });

      it('when the specified element is the parent of the element that holds the target class, it resolves the target class', () => {
        const newParent = document.createElement('div');
        newParent.appendChild(env.root);

        const searchInterface = Component.resolveBinding(newParent, SearchInterface);
        expect(searchInterface).toBeTruthy();
      });

      it('when the specified element is the child of the element that holds the target class, it resolves the target class', () => {
        const newChild = document.createElement('div');
        env.root.appendChild(newChild);

        const searchInterface = Component.resolveBinding(newChild, SearchInterface);
        expect(searchInterface).toBeTruthy();
      });
    });
  });
}
