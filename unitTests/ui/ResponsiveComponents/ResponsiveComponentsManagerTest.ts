import { $$, Dom } from '../../../src/utils/Dom';
import { ResponsiveComponentsManager } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsManager';
import * as Mock from '../../MockEnvironment';
import { SearchInterface, ISearchInterfaceOptions } from '../../../src/ui/SearchInterface/SearchInterface';
import { Component } from '../../../src/ui/Base/Component';
import { ValidResponsiveMode } from '../../../src/ui/ResponsiveComponents/ResponsiveComponents';
import { ResponsiveTabs } from '../../../src/ui/ResponsiveComponents/ResponsiveTabs';
import { ITabOptions, Tab } from '../../../src/ui/Tab/Tab';
import { InitializationEvents } from '../../../src/Core';
import { ResponsiveFacets } from '../../../src/ui/ResponsiveComponents/ResponsiveFacets';
import { Facet, IFacetOptions } from '../../../src/ui/Facet/Facet';
import { Simulate } from '../../Simulate';

export function ResponsiveComponentsManagerTest() {
  const SMALL_RESPONSIVE_MODE = 'small';
  let root: Dom;
  let handleResizeEvent: any;
  let registerComponent: any;
  let responsiveComponentsManager: ResponsiveComponentsManager;
  let responsiveComponent: any;
  let component: any;
  const setResponsiveMode = (mode: ValidResponsiveMode) => {
    (Component.get(root.el, SearchInterface) as SearchInterface).options.responsiveMode = mode;
  };

  describe('ResponsiveComponentsManager', () => {
    beforeEach(() => {
      let searchInterfaceMock = Mock.optionsSearchInterfaceSetup<SearchInterface, ISearchInterfaceOptions>(SearchInterface, {
        enableAutomaticResponsiveMode: true
      });
      root = $$(searchInterfaceMock.cmp.root);
      handleResizeEvent = jasmine.createSpy('handleResizeEvent');
      registerComponent = jasmine.createSpy('registerComponent');
      responsiveComponent = function () {
        this.needDrodpownWrapper = () => {};
        this.handleResizeEvent = handleResizeEvent;
        this.registerComponent = registerComponent;
        this.ID = 'id';
      };
      component = {};
      responsiveComponentsManager = new ResponsiveComponentsManager(root);
    });

    it(`when registering a tab with #enableResponsiveMode false and a responsive facet,
    when triggering the #afterInitialization event,
    it calls the #register instance method to make the facet responsive`, () => {
      ResponsiveComponentsManager['remainingComponentInitializations'] = 0;

      const tabOptions: ITabOptions = { enableResponsiveMode: false };
      const tab = Mock.optionsComponentSetup<Tab, ITabOptions>(Tab, tabOptions);

      ResponsiveComponentsManager.register(ResponsiveTabs, root, Tab.ID, tab.cmp, tabOptions);

      const facetOptions: IFacetOptions = {};
      const facet = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, facetOptions);

      ResponsiveComponentsManager.register(ResponsiveFacets, root, Facet.ID, facet.cmp, facetOptions);

      const spy = spyOn(responsiveComponentsManager, 'register');
      root.trigger(InitializationEvents.afterInitialization);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    describe('when the search interface responsive mode is set to *auto*', () => {
      beforeEach(() => {
        setResponsiveMode('auto');
      });

      it('should calls handle resize event when resize listener is called', done => {
        root.width = () => 400;
        responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
        responsiveComponentsManager.resizeListener();

        setTimeout(() => {
          expect(handleResizeEvent).toHaveBeenCalled();
          done();
        }, 250);
      });

      it('should call resize listener of all ResponsiveComponentManager when resizeAllComponentsManager is called', done => {
        root.width = () => 400;
        responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
        ResponsiveComponentsManager.resizeAllComponentsManager();

        setTimeout(() => {
          expect(handleResizeEvent).toHaveBeenCalled();
          done();
        }, 250);
      });

      describe('and the root element width is zero', () => {
        beforeEach(() => {
          root.width = () => 0;
        });

        it('should  not call handle resize event when resize listener is called', done => {
          responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
          responsiveComponentsManager.resizeListener();

          setTimeout(() => {
            expect(handleResizeEvent).not.toHaveBeenCalled();
            done();
          }, 250);
        });

        it('should  not calls handle resize event when it registers component', () => {
          responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
          expect(handleResizeEvent).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the search interface responsive mode is not set to *auto*', () => {
      beforeEach(() => {
        setResponsiveMode(SMALL_RESPONSIVE_MODE);
      });

      describe('and the root element width is zero', () => {
        beforeEach(() => {
          root.width = () => 0;
        });

        it('should calls handle resize event when resize listener is called', done => {
          responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
          responsiveComponentsManager.resizeListener();

          setTimeout(() => {
            expect(handleResizeEvent).toHaveBeenCalled();
            done();
          }, 250);
        });
      });
    });

    it('registers component even when the corresponding responsive class has already been instanciated', () => {
      responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
      responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});

      expect(registerComponent).toHaveBeenCalledTimes(2);
    });

    it('should trigger a resize event once on the initial query success to account for page layout changes', () => {
      spyOn(ResponsiveComponentsManager, 'resizeAllComponentsManager').and.callThrough();
      ResponsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
      const env = new Mock.MockEnvironmentBuilder().withRoot(root.el).build();
      Simulate.query(env);
      Simulate.query(env);
      Simulate.query(env);
      expect(ResponsiveComponentsManager.resizeAllComponentsManager).toHaveBeenCalledTimes(1);
    });
  });
}
