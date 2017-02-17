import { ResponsiveComponentsUtils } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsUtils';
import { $$, Dom } from '../../../src/utils/Dom';
import { ResponsiveComponentsManager, IResponsiveComponentConstructor } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsManager';
import { ResponsiveTabs } from '../../../src/ui/ResponsiveComponents/ResponsiveTabs';

export function ResponsiveTabsTest() {

  let root: Dom;

  describe('ResponsiveComponentsManager', () => {
    it('calls resize listenter after initialization', () => {
      let responsiveComponent: any = function() {
        this.needDrodpownWrapper = jasmine.createSpy('needDropdownWrapper');
        this.handleResizeEvent = jasmine.createSpy('handleResizeEvent');
      };
      let component: any = {};
      ResponsiveComponentsManager.register(responsiveComponent, root, 'id', component, {});
    });
  });
}
