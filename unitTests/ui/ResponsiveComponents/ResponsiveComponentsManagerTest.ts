import { $$, Dom } from '../../../src/utils/Dom';
import { ResponsiveComponentsManager } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsManager';
import * as Mock from '../../MockEnvironment';
import { SearchInterface, ISearchInterfaceOptions } from '../../../src/ui/SearchInterface/SearchInterface';
import { Component } from '../../../src/ui/Base/Component';
import { ValidResponsiveMode } from '../../../src/ui/ResponsiveComponents/ResponsiveComponents';

export function ResponsiveComponentsManagerTest() {
  const SMALL_RESPONSIVE_MODE = 'small';
  let root: Dom;
  let handleResizeEventSpies: jasmine.Spy[] = [];
  let registerComponentSpies: jasmine.Spy[] = [];
  let responsiveComponentsManager: ResponsiveComponentsManager;
  let responsiveComponents: any[] = [];
  let component: any;
  const setResponsiveMode = (mode: ValidResponsiveMode) => {
    (Component.get(root.el, SearchInterface) as SearchInterface).options.responsiveMode = mode;
  };

  function addNewResponsiveComponents() {
    handleResizeEventSpies.push(jasmine.createSpy('handleResizeEvent'));
    registerComponentSpies.push(jasmine.createSpy('registerComponent'));
    responsiveComponents.push(function() {
      this.needDrodpownWrapper = () => {};
      this.handleResizeEvent = handleResizeEventSpies[handleResizeEventSpies.length - 1];
      this.registerComponent = registerComponentSpies[registerComponentSpies.length - 1];
      this.ID = 'id';
    });
  }

  describe('ResponsiveComponentsManager', () => {
    beforeEach(() => {
      jasmine.clock().install();
      let searchInterfaceMock = Mock.optionsSearchInterfaceSetup<SearchInterface, ISearchInterfaceOptions>(SearchInterface, {
        enableAutomaticResponsiveMode: true
      });
      root = $$(searchInterfaceMock.cmp.root);
      addNewResponsiveComponents();
      component = {};
      responsiveComponentsManager = new ResponsiveComponentsManager(root);
    });

    afterEach(() => {
      handleResizeEventSpies.length = 0;
      registerComponentSpies.length = 0;
      responsiveComponents.length = 0;
      jasmine.clock().uninstall();
    });

    describe('when the search interface responsive mode is set to *auto*', () => {
      beforeEach(() => {
        setResponsiveMode('auto');
      });

      it('should calls handle resize event when resize listener is called', () => {
        root.width = () => 400;
        responsiveComponentsManager.register(responsiveComponents[responsiveComponents.length - 1], root, 'id', component, {});
        responsiveComponentsManager.resizeListener();
        jasmine.clock().tick(250);
        expect(handleResizeEventSpies[handleResizeEventSpies.length - 1]).toHaveBeenCalled();
      });

      describe('and the root element width is zero', () => {
        beforeEach(() => {
          root.width = () => 0;
        });

        it('should  not calls handle resize event when resize listener is called', () => {
          responsiveComponentsManager.register(responsiveComponents[responsiveComponents.length - 1], root, 'id', component, {});
          responsiveComponentsManager.resizeListener();
          jasmine.clock().tick(250);
          expect(handleResizeEventSpies[handleResizeEventSpies.length - 1]).not.toHaveBeenCalled();
        });

        it('should  not calls handle resize event when it registers component', () => {
          responsiveComponentsManager.register(responsiveComponents[responsiveComponents.length - 1], root, 'id', component, {});
          expect(handleResizeEventSpies[handleResizeEventSpies.length - 1]).not.toHaveBeenCalled();
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

        it('should calls handle resize event when resize listener is called', () => {
          responsiveComponentsManager.register(responsiveComponents[responsiveComponents.length - 1], root, 'id', component, {});
          responsiveComponentsManager.resizeListener();
          jasmine.clock().tick(250);
          expect(handleResizeEventSpies).toHaveBeenCalled();
        });
      });
    });

    it('calls handle resize on all responsiveComponent registered when calling resizeAllComponentsManager', () => {
      // Add a second responsiveComponent.
      addNewResponsiveComponents();
      expect(responsiveComponents.length).toBe(2);

      ResponsiveComponentsManager.resizeAllComponentsManager();

      handleResizeEventSpies.forEach(spy => {
        expect(spy).toHaveBeenCalled();
      });
    });

    it('registers component even when the corresponding responsive class has already been instanciated', () => {
      responsiveComponentsManager.register(responsiveComponents[responsiveComponents.length - 1], root, 'id', component, {});
      responsiveComponentsManager.register(responsiveComponents[responsiveComponents.length - 1], root, 'id', component, {});

      expect(registerComponentSpies[length - 1]).toHaveBeenCalledTimes(2);
    });
  });
}
