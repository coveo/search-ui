import { $$, Dom } from '../../../src/utils/Dom';
import { ResponsiveComponentsManager } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsManager';
import * as Mock from '../../MockEnvironment';
import { SearchInterface, ISearchInterfaceOptions } from '../../../src/ui/SearchInterface/SearchInterface';

export function ResponsiveComponentsManagerTest() {
  let root: Dom;
  let handleResizeEvent: any;
  let registerComponent: any;
  let responsiveComponentsManager: ResponsiveComponentsManager;
  let responsiveComponent: any;
  let component: any;

  describe('ResponsiveComponentsManager', () => {
    beforeEach(() => {
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

    it('calls handle resize event when resize listener is called', done => {
      root.width = () => 400;
      responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});

      responsiveComponentsManager.resizeListener();

      setTimeout(() => {
        expect(handleResizeEvent).toHaveBeenCalled();
        done();
      }, ResponsiveComponentsManager.RESIZE_DEBOUNCE_DELAY + 1);
    });

    it('does not calls handle resize event when resize listener is called and width is zero', done => {
      root.width = () => 0;
      responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});

      responsiveComponentsManager.resizeListener();

      setTimeout(() => {
        expect(handleResizeEvent).not.toHaveBeenCalled();
        done();
      }, ResponsiveComponentsManager.RESIZE_DEBOUNCE_DELAY + 1);
    });

    it('registers component even when the corresponding responsive class has already been instanciated', () => {
      responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
      responsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});

      expect(registerComponent).toHaveBeenCalledTimes(2);
    });
  });
}
