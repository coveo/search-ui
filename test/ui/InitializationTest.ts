import * as Mock from '../MockEnvironment';
import { SearchEndpoint } from '../../src/rest/SearchEndpoint';
import { $$ } from '../../src/utils/Dom';
import { Querybox } from '../../src/ui/Querybox/Querybox';
import { Component } from '../../src/ui/Base/Component';
import { Initialization, LazyInitialization } from '../../src/ui/Base/Initialization';
import { Facet } from '../../src/ui/Facet/Facet';
import { Pager } from '../../src/ui/Pager/Pager';
import { ResultList } from '../../src/ui/ResultList/ResultList';
import { Simulate } from '../Simulate';
import { InitializationEvents } from '../../src/events/InitializationEvents';
import { init } from '../../src/ui/Base/RegisteredNamedMethods';
import { NoopComponent } from '../../src/ui/NoopComponent/NoopComponent';
import { state } from '../../src/ui/Base/RegisteredNamedMethods';
import { get } from '../../src/UIBaseModules';
import { QueryController } from '../../src/controllers/QueryController';
declare const $;

export function InitializationTest() {
  describe('Initialization', () => {
    let root: HTMLElement;
    let endpoint: SearchEndpoint;
    let searchInterfaceOptions: {};
    let queryBox: HTMLElement;

    beforeEach(() => {
      root = document.createElement('div');
      $$(root).addClass('CoveoSearchInterface');
      endpoint = Mock.mockSearchEndpoint();
      endpoint.options = {};
      searchInterfaceOptions = { SearchInterface: { endpoint: endpoint } };
      queryBox = document.createElement('div');
      $$(queryBox).addClass('CoveoQuerybox');
      root.appendChild(queryBox);
    });

    afterEach(() => {
      root = null;
      endpoint = null;
      searchInterfaceOptions = null;
      queryBox = null;
    });

    it('should allow to registerComponentFields', () => {
      Initialization.registerComponentFields('MyComponent', ['myfirstfield', 'mysecondfield']);
      expect(Initialization.getRegisteredFieldsForQuery()).toEqual(jasmine.arrayContaining(['myfirstfield', 'mysecondfield']));
      expect(Initialization.getRegisteredFieldsComponentForQuery('MyComponent')).toEqual(
        jasmine.arrayContaining(['myfirstfield', 'mysecondfield'])
      );
    });

    it('should allow to register componentsFields with duplicate without complaining', () => {
      Initialization.registerComponentFields('AComponent', ['afield', 'anotherfield']);
      Initialization.registerComponentFields('ANewComponent', ['afield', 'anotherfield']);
      Initialization.registerComponentFields('AComponent', ['afield', 'yetanotherfield']);
      expect(Initialization.getRegisteredFieldsForQuery()).toEqual(jasmine.arrayContaining(['afield', 'anotherfield', 'yetanotherfield']));
      expect(Initialization.getRegisteredFieldsComponentForQuery('AComponent')).toEqual(
        jasmine.arrayContaining(['afield', 'anotherfield', 'yetanotherfield'])
      );
      expect(Initialization.getRegisteredFieldsComponentForQuery('ANewComponent')).toEqual(
        jasmine.arrayContaining(['afield', 'anotherfield'])
      );
    });

    it('should allow to register components fields with the standard and special coveo id and it should be interchangeable', () => {
      Initialization.registerComponentFields('MyStandardId', ['1', '2']);
      Initialization.registerComponentFields('CoveoMyStandardId', ['3', '4']);
      expect(Initialization.getRegisteredFieldsForQuery()).toEqual(jasmine.arrayContaining(['1', '2', '3', '4']));
      expect(Initialization.getRegisteredFieldsComponentForQuery('MyStandardId')).toEqual(jasmine.arrayContaining(['1', '2', '3', '4']));
      expect(Initialization.getRegisteredFieldsComponentForQuery('CoveoMyStandardId')).toEqual(
        jasmine.arrayContaining(['1', '2', '3', '4'])
      );
    });

    it('should allow to return the list of eagerly loaded components', () => {
      expect(Initialization.getListOfLoadedComponents()).toEqual(jasmine.arrayContaining(['Searchbox']));
    });

    it('should wait before resolving lazy init function to continue the framework initialization', done => {
      const spy = jasmine.createSpy('spy');
      $$(root).on(InitializationEvents.afterInitialization, spy);

      const promiseToResolve = new Promise<boolean>((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 500);
      });

      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return {
          isLazyInit: true,
          initResult: promiseToResolve
        };
      });

      expect(spy).not.toHaveBeenCalled();
      promiseToResolve.then(() => {
        setTimeout(() => {
          expect(spy).toHaveBeenCalled();
          done();
        }, 0);
      });
    });

    it('can initialize search interface and component', done => {
      expect(Component.get(queryBox) instanceof Querybox).toBe(false);
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      }).then(() => {
        expect(Component.get(queryBox) instanceof Querybox).toBe(true);
        done();
      });
    });

    it('should not initialize a search interface twice', done => {
      expect(Component.get(queryBox) instanceof Querybox).toBe(false);
      // First initialization
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      }).then(() => {
        expect(Component.get(queryBox) instanceof Querybox).toBe(true);
        const newQueryBox = document.createElement('div');
        $$(newQueryBox).addClass('CoveoQuerybox');
        root.appendChild(newQueryBox);
        expect(Component.get(newQueryBox) instanceof Querybox).toBe(false);

        // Second initialization
        Initialization.initializeFramework(root, searchInterfaceOptions, () => {
          return Initialization.initSearchInterface(root, searchInterfaceOptions);
        }).then(() => {
          expect(Component.get(newQueryBox) instanceof Querybox).toBe(false);
          done();
        });
      });
    });

    it('allows to register default options ahead of init call, and merge them', () => {
      Initialization.registerDefaultOptions(root, {
        Querybox: {
          enableSearchAsYouType: true
        }
      });
      Initialization.registerDefaultOptions(root, {
        Querybox: {
          enablePartialMatch: true
        }
      });

      expect(Component.get(queryBox) instanceof Querybox).toBe(false);
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      });
      expect(Component.get(queryBox) instanceof Querybox).toBe(true);
      const sBox = <Querybox>Component.get(queryBox);
      expect(sBox.options.enableSearchAsYouType).toBe(true);
      expect(sBox.options.enablePartialMatch).toBe(true);
    });

    it('allows to registerAutoCreateComponent', () => {
      const dummyCmp: any = jasmine.createSpy('foobar');
      dummyCmp.ID = 'FooBar';
      const dummyElem = document.createElement('div');
      $$(dummyElem).addClass('CoveoFooBar');
      root.appendChild(dummyElem);

      Initialization.registerAutoCreateComponent(dummyCmp);
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      });
      expect(dummyCmp).toHaveBeenCalled();
    });

    it('allows to check if isComponentClassIdRegistered', () => {
      const dummyCmp: any = () => {};
      dummyCmp.ID = 'CheckRegistration';
      Initialization.registerAutoCreateComponent(dummyCmp);
      expect(Initialization.isComponentClassIdRegistered('CheckRegistration')).toBe(true);
    });

    it('allow to getListOfRegisteredComponents', () => {
      expect(Initialization.getListOfRegisteredComponents()).toEqual(jasmine.arrayContaining(['Facet', 'Pager']));
    });

    it('allow to getRegisteredComponent', () => {
      expect(Initialization.getRegisteredComponent('Facet')).toBe(Facet);
    });

    it('allow to automaticallyCreateComponentsInside', () => {
      const env = new Mock.MockEnvironmentBuilder().build();
      expect(Component.get(queryBox) instanceof Querybox).toBe(false);
      Initialization.automaticallyCreateComponentsInside(root, {
        options: {},
        bindings: env
      });
      expect(Component.get(queryBox) instanceof Querybox).toBe(true);
    });

    it('allow to automaticallyCreateComponentInside, as well as childs components', () => {
      const env = new Mock.MockEnvironmentBuilder().build();
      const resultList = $$('div', { className: Component.computeCssClassNameForType(ResultList.ID) });
      $$(queryBox).append(resultList.el);
      expect(Component.get(resultList.el) instanceof ResultList).toBe(false);
      Initialization.automaticallyCreateComponentsInside(root, {
        options: {},
        bindings: env
      });
      expect(Component.get(resultList.el) instanceof ResultList).toBe(true);
    });

    it('allow to automaticallyCreateComponentsInside and can ignore some components', () => {
      const env = new Mock.MockEnvironmentBuilder().build();
      expect(Component.get(queryBox) instanceof Querybox).toBe(false);
      Initialization.automaticallyCreateComponentsInside(
        root,
        {
          options: {},
          bindings: env
        },
        [Querybox.ID]
      );
      expect(Component.get(queryBox) instanceof Querybox).toBe(false);
    });

    it('allow to automaticallyCreateComponentsInside and can ignore multiple repetitive components', () => {
      const env = new Mock.MockEnvironmentBuilder().build();
      const queryBox2 = $$('div', { className: 'CoveoQuerybox' }).el;
      env.root.appendChild(queryBox2);
      expect(Component.get(queryBox) instanceof Querybox).toBe(false);
      expect(Component.get(queryBox2) instanceof Querybox).toBe(false);
      Initialization.automaticallyCreateComponentsInside(
        root,
        {
          options: {},
          bindings: env
        },
        [Querybox.ID]
      );
      expect(Component.get(queryBox) instanceof Querybox).toBe(false);
      expect(Component.get(queryBox2) instanceof Querybox).toBe(false);
    });

    it('allow to automaticallyCreateComponentInside can ignore child components', () => {
      const env = new Mock.MockEnvironmentBuilder().build();
      const resultList = $$('div', { className: Component.computeCssClassNameForType(ResultList.ID) });
      $$(queryBox).append(resultList.el);
      expect(Component.get(resultList.el) instanceof ResultList).toBe(false);
      Initialization.automaticallyCreateComponentsInside(
        root,
        {
          options: {},
          bindings: env
        },
        [Querybox.ID]
      );
      expect(Component.get(resultList.el) instanceof ResultList).toBe(false);
    });

    it('allow to automaticallyCreateComponentInside and will ignore elements that are already components', () => {
      const env = new Mock.MockEnvironmentBuilder().build();
      expect(Component.get(queryBox) instanceof Querybox).toBe(false);
      Initialization.automaticallyCreateComponentsInside(root, {
        options: {},
        bindings: env
      });
      expect(Component.get(queryBox) instanceof Querybox).toBe(true);
      queryBox.className = 'CoveoResultList';
      Initialization.automaticallyCreateComponentsInside(root, {
        options: {},
        bindings: env
      });
      expect(Component.get(queryBox) instanceof Querybox).toBe(true);
      expect(Component.get(queryBox) instanceof ResultList).toBe(false);
    });

    it('allow to monkeyPatchComponentMethod', () => {
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      });
      const patch = jasmine.createSpy('patch');
      Initialization.monkeyPatchComponentMethod('submit', queryBox, patch);
      (<Querybox>Component.get(queryBox)).submit();
      expect(patch).toHaveBeenCalled();
    });

    it('allow to monkeyPatchComponentMethod with the component name', () => {
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      });
      const patch = jasmine.createSpy('patch');
      Initialization.monkeyPatchComponentMethod('Querybox.submit', queryBox, patch);
      (<Querybox>Component.get(queryBox)).submit();
      expect(patch).toHaveBeenCalled();

      it('allows to determine if a top level method is already registed', () => {
        expect(Initialization.isNamedMethodRegistered('get')).toBe(true);
        expect(Initialization.isNamedMethodRegistered('executeQuery')).toBe(true);
        expect(Initialization.isNamedMethodRegistered('does not exist')).toBe(false);
      });
    });

    it("should allow to init a box interface (and throw because it's only used in salesforce)", done => {
      const init = Initialization.initBoxInterface(root, searchInterfaceOptions);
      expect(init.isLazyInit).toBe(false);
      init.initResult.catch(success => {
        expect(success).not.toBeNull();
        done();
      });
    });

    it('should allow to dispatch a named method call', () => {
      init(root, searchInterfaceOptions);
      Initialization.dispatchNamedMethodCall('executeQuery', root, []);
      expect(endpoint.search).toHaveBeenCalled();
    });

    it('should throw when calling a named method that does not exist', () => {
      init(root, searchInterfaceOptions);
      expect(() => Initialization.dispatchNamedMethodCall('nope', root, [])).toThrow();
    });

    it('should allow to dispatchNamedMethodCallOrComponentCreation', () => {
      init(root, searchInterfaceOptions);
      Initialization.dispatchNamedMethodCallOrComponentCreation('executeQuery', root, []);
      expect(endpoint.search).toHaveBeenCalled();
      Initialization.dispatchNamedMethodCallOrComponentCreation('submit', queryBox, []);
      expect(endpoint.search).toHaveBeenCalled();
    });

    it('should throw when dispatchNamedMethodCallOrComponentCreation is called with something that does not exist', () => {
      init(root, searchInterfaceOptions);
      expect(() => Initialization.dispatchNamedMethodCallOrComponentCreation('nope', root, [])).toThrow();
    });

    it('can initialize external components', () => {
      const external = $$('div', {
        className: 'CoveoPager'
      }).el;

      searchInterfaceOptions['externalComponents'] = [external];
      searchInterfaceOptions['SearchInterface'].autoTriggerQuery = false;
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      });
      expect(Component.get(external) instanceof Pager).toBe(true);
    });

    it('can initialize external components passed in as a jquery instance', () => {
      Simulate.addJQuery();
      const external = $('<div class="CoveoPager"></div>');
      searchInterfaceOptions['externalComponents'] = [external];
      searchInterfaceOptions['SearchInterface'].autoTriggerQuery = false;
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      });
      expect(Component.get(external.get(0)) instanceof Pager).toBe(true);
      Simulate.removeJQuery();
    });

    describe('with automatic first query', () => {
      let spyOnQuery: jasmine.Spy;

      const doInit = () => {
        return Initialization.initializeFramework(root, searchInterfaceOptions, () => {
          const initResult = Initialization.initSearchInterface(root, searchInterfaceOptions);
          spyOnQuery = spyOn(get(root, QueryController) as QueryController, 'executeQuery');
          return initResult;
        });
      };

      beforeEach(() => {
        searchInterfaceOptions['SearchInterface'].autoTriggerQuery = true;
      });

      afterEach(() => {
        spyOnQuery = null;
      });

      it('will trigger a query automatically by default', done => {
        doInit().then(() => {
          expect(spyOnQuery).toHaveBeenCalled();
          done();
        });
      });

      it('will not trigger a query automatically if specified', done => {
        searchInterfaceOptions['SearchInterface'].autoTriggerQuery = false;
        doInit().then(() => {
          expect(spyOnQuery).not.toHaveBeenCalled();
          done();
        });
      });

      describe('when query with no keywords are not allowed', () => {
        beforeEach(() => {
          searchInterfaceOptions['SearchInterface'].allowQueriesWithoutKeywords = false;
        });

        it('will trigger a query automatically if the interface contains keywords', done => {
          $$(root).on(InitializationEvents.afterInitialization, () => {
            state(root, 'q', 'foo');
          });

          doInit().then(() => {
            expect(spyOnQuery).toHaveBeenCalled();
            done();
          });
        });

        it('will not trigger a query automatically if the interface contains no keywords', done => {
          $$(root).on(InitializationEvents.afterInitialization, () => {
            state(root, 'q', '');
          });

          doInit().then(() => {
            expect(spyOnQuery).not.toHaveBeenCalled();
            done();
          });
        });
      });
    });

    it('will send action history on automatic query', done => {
      localStorage.removeItem('__coveo.analytics.history');
      expect(localStorage.getItem('__coveo.analytics.history')).toBeNull();
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      }).then(() => {
        const actionHistory = localStorage.getItem('__coveo.analytics.history');
        expect(actionHistory).not.toBeNull();
        expect(JSON.parse(actionHistory)[0].name).toEqual('Query');
        done();
      });
    });

    describe('when initializing recommendation interface', () => {
      let options;
      beforeEach(() => {
        options = {
          Recommendation: {
            endpoint: endpoint,
            mainSearchInterface: root,
            userContext: {}
          },
          SearchInterface: {}
        };
      });

      afterEach(() => {
        options = null;
      });

      it('should be able to generate to components', () => {
        expect(Component.get(queryBox) instanceof Querybox).toBe(false);
        Initialization.initRecommendationInterface(root, options);
        expect(Component.get(queryBox) instanceof Querybox).toBe(true);
      });

      it('should not send action history on automatic query', () => {
        localStorage.removeItem('__coveo.analytics.history');
        expect(localStorage.getItem('__coveo.analytics.history')).toBeNull();
        Initialization.initRecommendationInterface(root, options);
        const actionHistory = localStorage.getItem('__coveo.analytics.history');
        expect(actionHistory).toBeNull();
      });
    });

    it("should fallback on lazy registered component if it's only registered as lazy", done => {
      const lazyCustomStuff = jasmine.createSpy('customstuff').and.callFake(
        () =>
          new Promise((resolve, reject) => {
            resolve(NoopComponent);
          })
      );

      // We register the component only as "lazy", but then do an initialization "eager" style.
      // Normally, the fallback should kick in and the component should still be initialized
      root.appendChild($$('div', { className: 'CoveoMyCustomStuff' }).el);
      LazyInitialization.registerLazyComponent('MyCustomStuff', lazyCustomStuff);

      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      }).then(() => {
        expect(lazyCustomStuff).toHaveBeenCalled();
        done();
      });
    });
  });
}
