import { $$, Dom } from '../../../src/utils/Dom';
import { ResponsiveComponentsManager } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsManager';
import * as Mock from '../../MockEnvironment';
import { SearchInterface, ISearchInterfaceOptions } from '../../../src/ui/SearchInterface/SearchInterface';
import { Component } from '../../../src/ui/Base/Component';
import { ValidResponsiveMode } from '../../../src/ui/ResponsiveComponents/ResponsiveComponents';

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
      jasmine.clock().install();
      let searchInterfaceMock = Mock.optionsSearchInterfaceSetup<SearchInterface, ISearchInterfaceOptions>(SearchInterface, {
        enableAutomaticResponsiveMode: true
      });
      root = $$(searchInterfaceMock.cmp.root);
      handleResizeEvent = jasmine.createSpy('handleResizeEvent');
      registerComponent = jasmine.createSpy('registerComponent');
      responsiveComponent = function() {
        this.needDrodpownWrapper = () => {};
        this.handleResizeEvent = handleResizeEvent;
        this.registerComponent = registerComponent;
        this.ID = 'id';
      };
      component = {};
      responsiveComponentsManager = new ResponsiveComponentsManager(root);
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    describe('when the search interface responsive mode is set to *auto*', () => {
      beforeEach(() => {
        setResponsiveMode('auto');
      });

      it('should calls handle resize event when resize listener is called', () => {
        root.width = () => 400;
        responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
        responsiveComponentsManager.resizeListener();
        jasmine.clock().tick(250);
        expect(handleResizeEvent).toHaveBeenCalled();
      });

      describe('and the root element width is zero', () => {
        beforeEach(() => {
          root.width = () => 0;
        });

        it('should  not calls handle resize event when resize listener is called', () => {
          responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
          responsiveComponentsManager.resizeListener();
          jasmine.clock().tick(250);
          expect(handleResizeEvent).not.toHaveBeenCalled();
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

        it('should calls handle resize event when resize listener is called', () => {
          responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
          responsiveComponentsManager.resizeListener();
          jasmine.clock().tick(250);
          expect(handleResizeEvent).toHaveBeenCalled();
        });
      });
    });

    it('registers component even when the corresponding responsive class has already been instanciated', () => {
      responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
      responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});

      expect(registerComponent).toHaveBeenCalledTimes(2);
    });

    it('should call resize listener of all ResponsiveComponentManager when resizeAllComponentsManager is called', () => {
      let searchInterfaceMock = Mock.optionsSearchInterfaceSetup<SearchInterface, ISearchInterfaceOptions>(SearchInterface, {
        enableAutomaticResponsiveMode: true
      });
      root = $$(searchInterfaceMock.cmp.root);
      const anotherResponsiveComponentsManager = new ResponsiveComponentsManager(root);
      const spyResizeListeners = [
        spyOn(responsiveComponentsManager, 'resizeListener'),
        spyOn(anotherResponsiveComponentsManager, 'resizeListener')
      ];
      ResponsiveComponentsManager.resizeAllComponentsManager();
      spyResizeListeners.forEach(spy => {
        expect(spy).toHaveBeenCalled();
      });
    });
  });
}
