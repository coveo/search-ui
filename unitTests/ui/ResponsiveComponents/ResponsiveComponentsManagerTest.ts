import { $$, Dom } from '../../../src/utils/Dom';
import { ResponsiveComponentsManager } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsManager';
import * as Mock from '../../MockEnvironment';
import { SearchInterface, ISearchInterfaceOptions } from '../../../src/ui/SearchInterface/SearchInterface';
import { Component } from '../../../src/ui/Base/Component';
import { ValidResponsiveMode } from '../../../src/ui/ResponsiveComponents/ResponsiveComponents';

export function ResponsiveComponentsManagerTest() {
  let root: Dom;
  let handleResizeEvent: any;
  let registerComponent: any;
  let responsiveComponentsManager: ResponsiveComponentsManager;
  let responsiveComponent: any;
  let component: any;
  const setupHandleResizeEventTest = (mode?: ValidResponsiveMode) => {
    if (mode) {
      (Component.get(root.el, SearchInterface) as SearchInterface).options.responsiveMode = mode;
    }
    responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
    responsiveComponentsManager.resizeListener();
    jasmine.clock().tick(250);
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

    it('calls handle resize event when resize listener is called', () => {
      root.width = () => 400;
      setupHandleResizeEventTest();
      expect(handleResizeEvent).toHaveBeenCalled();
    });

    it('does not calls handle resize event when resize listener is called and width is zero', () => {
      root.width = () => 0;
      setupHandleResizeEventTest();
      expect(handleResizeEvent).not.toHaveBeenCalled();
    });

    ['small', 'medium', 'large'].forEach((responsiveMode: ValidResponsiveMode) => {
      it(`calls handle resize event when resize listener is called even if the width is zero when the responsiveMode is set to ${responsiveMode}`, () => {
        root.width = () => 0;
        setupHandleResizeEventTest(responsiveMode);
        expect(handleResizeEvent).toHaveBeenCalled();
      });
    });

    it('does not calls handle resize event when resize listener is called and the width is zero and the responsiveMode is set to auto', () => {
      root.width = () => 0;
      setupHandleResizeEventTest('auto');
      expect(handleResizeEvent).not.toHaveBeenCalled();
    });

    it('registers component even when the corresponding responsive class has already been instanciated', () => {
      responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
      responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});

      expect(registerComponent).toHaveBeenCalledTimes(2);
    });
  });
}
