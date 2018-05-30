import { ResponsiveComponentsUtils } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsUtils';
import { $$, Dom } from '../../../src/utils/Dom';
import { ResponsiveTabs } from '../../../src/ui/ResponsiveComponents/ResponsiveTabs';
import { Tab } from '../../../src/ui/Tab/Tab';
import { ResponsiveComponents } from '../../../src/ui/ResponsiveComponents/ResponsiveComponents';

export function ResponsiveTabsTest() {
  let root: Dom;
  let responsiveTabs: ResponsiveTabs;

  describe('ResponsiveTabs', () => {
    beforeEach(() => {
      root = $$('div');
      root.append($$('div', { className: 'coveo-tab-section' }).el);
      responsiveTabs = new ResponsiveTabs(root, Tab.ID);
    });

    it('activates small tabs when it should switch to small mode', () => {
      spyOn(ResponsiveComponentsUtils, 'activateSmallTabs');
      spyOn(root, 'width').and.returnValue(new ResponsiveComponents().getMediumScreenWidth() - 1);

      responsiveTabs.handleResizeEvent();

      expect(ResponsiveComponentsUtils.activateSmallTabs).toHaveBeenCalled();
    });

    it('deactivates small tabs when it should switch to large mode', () => {
      spyOn(ResponsiveComponentsUtils, 'deactivateSmallTabs');
      spyOn(root, 'width').and.returnValue(new ResponsiveComponents().getMediumScreenWidth() + 1);
      ResponsiveComponentsUtils.activateSmallTabs(root);

      responsiveTabs.handleResizeEvent();

      expect(ResponsiveComponentsUtils.deactivateSmallTabs).toHaveBeenCalled();
    });
  });
}
