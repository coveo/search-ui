import * as Mock from '../MockEnvironment';
import { SearchEndpoint } from '../../src/rest/SearchEndpoint';
import { $$ } from '../../src/utils/Dom';
import { Querybox } from '../../src/ui/Querybox/Querybox';
import { Component } from '../../src/ui/Base/Component';
import { Initialization } from '../../src/ui/Base/Initialization';
import { Facet } from '../../src/ui/Facet/Facet';
import { Pager } from '../../src/ui/Pager/Pager';
import { ResultList } from '../../src/ui/ResultList/ResultList';
import { Simulate } from '../Simulate';
declare let $;

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

    it('can initialize search interface and component', (done) => {
      expect(Component.get(queryBox) instanceof Querybox).toBe(false);
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      }).then(() => {
        expect(Component.get(queryBox) instanceof Querybox).toBe(true);
        done();
      });
    });

    it('should not initialize a search interface twice', (done) => {
      expect(Component.get(queryBox) instanceof Querybox).toBe(false);
      // First initialization
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      }).then(() => {
        expect(Component.get(queryBox) instanceof Querybox).toBe(true);
        let newQueryBox = document.createElement('div');
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

    it('allows to register default options ahead of init call, and merge them', function () {
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
      let sBox = <Querybox>Component.get(queryBox);
      expect(sBox.options.enableSearchAsYouType).toBe(true);
      expect(sBox.options.enablePartialMatch).toBe(true);
    });

    it('allows to registerAutoCreateComponent', () => {
      let dummyCmp: any = jasmine.createSpy('foobar');
      dummyCmp.ID = 'FooBar';
      let dummyElem = document.createElement('div');
      $$(dummyElem).addClass('CoveoFooBar');
      root.appendChild(dummyElem);

      Initialization.registerAutoCreateComponent(dummyCmp);
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      });
      expect(dummyCmp).toHaveBeenCalled();
    });

    it('allows to check if isComponentClassIdRegistered', () => {
      let dummyCmp: any = () => {
      };
      dummyCmp.ID = 'CheckRegistration';
      Initialization.registerAutoCreateComponent(dummyCmp);
      expect(Initialization.isComponentClassIdRegistered('CheckRegistration')).toBe(true);
    });

    it('allow to getListOfRegisteredComponents', () => {
      expect(Initialization.getListOfRegisteredComponents()).toEqual(jasmine.arrayContaining(['Facet', 'Pager']));
    });

    it('allow to getRegisteredComponent', function () {
      expect(Initialization.getRegisteredComponent('Facet')).toBe(Facet);
    });

    it('allow to automaticallyCreateComponentsInside', () => {
      let env = new Mock.MockEnvironmentBuilder().build();
      expect(Component.get(queryBox) instanceof Querybox).toBe(false);
      Initialization.automaticallyCreateComponentsInside(root, {
        options: {},
        bindings: env
      });
      expect(Component.get(queryBox) instanceof Querybox).toBe(true);
    });

    it('allow to automaticallyCreateComponentInside, as well as childs components', () => {
      let env = new Mock.MockEnvironmentBuilder().build();
      let resultList = $$('div', { className: Component.computeCssClassNameForType(ResultList.ID) });
      $$(queryBox).append(resultList.el);
      expect((Component.get(resultList.el) instanceof ResultList)).toBe(false);
      Initialization.automaticallyCreateComponentsInside(root, {
        options: {},
        bindings: env
      });
      expect(Component.get(resultList.el) instanceof ResultList).toBe(true);
    });

    it('allow to automaticallyCreateComponentsInside and can ignore some components', () => {
      let env = new Mock.MockEnvironmentBuilder().build();
      expect(Component.get(queryBox) instanceof Querybox).toBe(false);
      Initialization.automaticallyCreateComponentsInside(root, {
        options: {},
        bindings: env
      }, [Querybox.ID]);
      expect(Component.get(queryBox) instanceof Querybox).toBe(false);
    });

    it('allow to automaticallyCreateComponentInside can ignore child components', () => {
      let env = new Mock.MockEnvironmentBuilder().build();
      let resultList = $$('div', { className: Component.computeCssClassNameForType(ResultList.ID) });
      $$(queryBox).append(resultList.el);
      expect((Component.get(resultList.el) instanceof ResultList)).toBe(false);
      Initialization.automaticallyCreateComponentsInside(root, {
        options: {},
        bindings: env
      }, [Querybox.ID]);
      expect(Component.get(resultList.el) instanceof ResultList).toBe(false);

    });

    it('allow to monkeyPatchComponentMethod', function () {
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      });
      let patch = jasmine.createSpy('patch');
      Initialization.monkeyPatchComponentMethod('submit', queryBox, patch);
      (<Querybox>Component.get(queryBox)).submit();
      expect(patch).toHaveBeenCalled();
    });

    it('can initialize external components', function () {
      let external = $$('div', {
        className: 'CoveoPager'
      }).el;

      searchInterfaceOptions['externalComponents'] = [external];
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      });
      expect(Component.get(external) instanceof Pager).toBe(true);
    });

    it('can initialize external components passed in as a jquery instance', () => {
      Simulate.addJQuery();
      let external = $('<div class="CoveoPager"></div>');
      searchInterfaceOptions['externalComponents'] = [external];
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      });
      expect(Component.get(external.get(0)) instanceof Pager).toBe(true);
      Simulate.removeJQuery();
    });

    it('will trigger a query automatically by default', (done) => {
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      }).then(() => {
        expect(endpoint.search).toHaveBeenCalled();
        done();
      });

    });

    it('will not trigger a query automatically if specified', (done) => {
      searchInterfaceOptions['SearchInterface'].autoTriggerQuery = false;
      Initialization.initializeFramework(root, searchInterfaceOptions, () => {
        return Initialization.initSearchInterface(root, searchInterfaceOptions);
      }).then(() => {
        expect(endpoint.search).not.toHaveBeenCalled();
        done();
      });

    });

    it('will send action history on automatic query', (done) => {
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

    describe('when initializing recommendation interface', function () {
      let options;
      beforeEach(function () {
        options = {
          Recommendation: {
            endpoint: endpoint,
            mainSearchInterface: root,
            userContext: {}
          },
          SearchInterface: {}
        };
      });

      afterEach(function () {
        options = null;
      });

      it('should be able to generate to components', function () {
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
  });
}
