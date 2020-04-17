import { range, last } from 'underscore';
import { Component, ResponsiveDropdown, KEYBOARD } from '../../../src/Core';
import { ResponsiveComponents } from '../../../src/ui/ResponsiveComponents/ResponsiveComponents';
import { ResponsiveComponentsUtils } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsUtils';
import { ResponsiveTabs } from '../../../src/ui/ResponsiveComponents/ResponsiveTabs';
import { Tab } from '../../../src/ui/Tab/Tab';
import { $$, Dom } from '../../../src/utils/Dom';
import { SearchInterface } from '../../../src/ui/SearchInterface/SearchInterface';
import { Simulate } from '../../Simulate';

export function ResponsiveTabsTest() {
  let root: Dom;
  let responsiveTabs: ResponsiveTabs;
  let tabSection: Dom;
  let navigableSection: Dom;
  let tabs: Dom[];

  describe('ResponsiveTabs', () => {
    beforeEach(() => {
      root = $$('div');
      tabSection = $$('div', { className: 'coveo-tab-section' });
      root.append(tabSection.el);
      navigableSection = $$('div', { tabIndex: 20 });
      root.append(navigableSection.el);
      tabs = [];
      range(0, 5).forEach(tabNumber => {
        const tab = $$('div', {
          className: Component.computeCssClassName(Tab),
          'data-caption': tabNumber,
          'data-id': tabNumber
        });
        tabs.push(tab);
      });
      tabs.forEach(tab => tabSection.append(tab.el));

      responsiveTabs = new ResponsiveTabs(root, Tab.ID);
    });

    it('activates small tabs when it should switch to small mode', () => {
      spyOn(ResponsiveComponentsUtils, 'activateSmallTabs');
      spyOn(root, 'width').and.returnValue(new ResponsiveComponents().getMediumScreenWidth() - 1);

      responsiveTabs.handleResizeEvent();

      expect(ResponsiveComponentsUtils.activateSmallTabs).toHaveBeenCalled();
    });

    it('does activates small tabs when the screen is narrow and the responsiveMode is medium (or large)', () => {
      const mediumBreakpoint = 800;
      new SearchInterface(root.el, { responsiveMode: 'medium', responsiveMediumBreakpoint: mediumBreakpoint });
      responsiveTabs = new ResponsiveTabs(root, Tab.ID);
      spyOn(ResponsiveComponentsUtils, 'activateSmallTabs');
      spyOn(root, 'width').and.returnValue(mediumBreakpoint - 1);

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

    it("doesn't deactivates small tabs when the screen is wide and the responsiveMode is small", () => {
      const mediumBreakpoint = 800;
      new SearchInterface(root.el, { responsiveMode: 'small', responsiveMediumBreakpoint: mediumBreakpoint });
      responsiveTabs = new ResponsiveTabs(root, Tab.ID);

      spyOn(ResponsiveComponentsUtils, 'deactivateSmallTabs');
      spyOn(root, 'width').and.returnValue(mediumBreakpoint + 1);
      ResponsiveComponentsUtils.activateSmallTabs(root);

      responsiveTabs.handleResizeEvent();

      expect(ResponsiveComponentsUtils.deactivateSmallTabs).not.toHaveBeenCalled();
    });

    describe('when moving tabs to different section', () => {
      const simulateOverflowing = () => {
        Object.defineProperty(tabSection.el, 'clientWidth', {
          value: 100,
          writable: false
        });

        // This will simulate each tab being added progressively to the dropdown (25px each tab)
        // reducing the element scroll width
        let numberOfTimesCalled = -1;
        Object.defineProperty(tabSection.el, 'scrollWidth', {
          get: () => {
            numberOfTimesCalled++;
            return 125 - 25 * numberOfTimesCalled;
          },
          configurable: true
        });
      };

      const simulateNotOverflowing = () => {
        Object.defineProperty(tabSection.el, 'clientWidth', {
          value: 100,
          writable: false
        });
        Object.defineProperty(tabSection.el, 'scrollWidth', {
          get: () => 50
        });
      };

      const simulateZeroWidth = () => {
        Object.defineProperty(tabSection.el, 'clientWidth', {
          value: 0,
          writable: false
        });

        Object.defineProperty(tabSection.el, 'scrollWidth', {
          get: () => 0
        });
      };

      const openTabContainer = () => {
        $$(root.find('.coveo-dropdown-header')).trigger('click');
        return $$(root.find('.coveo-tab-list-container'));
      };

      describe('when the tab section is overflowing', () => {
        beforeEach(() => {
          simulateOverflowing();
          spyOn(root, 'width').and.returnValue(new ResponsiveComponents().getMediumScreenWidth() - 1);
        });

        it('it creates a dropdown header', () => {
          responsiveTabs.handleResizeEvent();
          expect(root.find('.coveo-dropdown-header')).not.toBeNull();
        });

        it('places tabs in the correct order inside and outside the dropdown', () => {
          responsiveTabs.handleResizeEvent();
          const container = openTabContainer();

          const lastTabInDropdown = container.find(`div[data-id="4"]`);
          expect(lastTabInDropdown).not.toBeNull();

          range(0, 4).forEach(tabOutsideDropdownId => {
            const tabInIncorrectPosition = container.find(`div[data-id="${tabOutsideDropdownId}"]`);
            expect(tabInIncorrectPosition).toBeNull();
          });
        });

        it('should not place a selected tab inside the dropdown', () => {
          const lastTab = last(tabs);
          lastTab.addClass('coveo-selected');
          const lastId = lastTab.getAttribute('data-id');

          responsiveTabs.handleResizeEvent();
          const container = openTabContainer();

          const selectedTabInDropdown = container.find(`div[data-id="${lastId}"]`);
          expect(selectedTabInDropdown).toBeNull();
        });
      });

      describe('when the tab section is overflowing, then resized to larger size', () => {
        beforeEach(() => {
          spyOn(root, 'width').and.returnValue(new ResponsiveComponents().getMediumScreenWidth() - 1);
        });

        it('replaces the tabs in the correct order in the original section', () => {
          simulateOverflowing();
          responsiveTabs.handleResizeEvent();
          simulateNotOverflowing();
          responsiveTabs.handleResizeEvent();

          range(0, 5).forEach(tabThatShouldBeInStandardSection => {
            expect(tabSection.find(`div[data-id="${tabThatShouldBeInStandardSection}"]`)).not.toBeNull();
          });
        });

        it('should remove the dropdown header', () => {
          simulateOverflowing();
          responsiveTabs.handleResizeEvent();

          expect(root.find('.coveo-dropdown-header')).not.toBeNull();

          simulateNotOverflowing();
          responsiveTabs.handleResizeEvent();

          expect(root.find('.coveo-dropdown-header')).toBeNull();
        });

        it('replaces the tabs in the correct order in the original section when there was a selection', () => {
          last(tabs).addClass('coveo-selected');

          simulateOverflowing();
          responsiveTabs.handleResizeEvent();
          simulateNotOverflowing();
          responsiveTabs.handleResizeEvent();

          const allTabsReplacedInTheirOriginalSection = tabSection.findAll(`.${Component.computeCssClassName(Tab)}`);
          range(0, 5).forEach(tabId => {
            const tab = allTabsReplacedInTheirOriginalSection[tabId];
            expect(tab.getAttribute('data-id')).toEqual(tabId.toString());
          });
        });
      });

      describe('when the tab section has zero client width', () => {
        beforeEach(() => {
          new SearchInterface(root.el, { responsiveMode: 'small' });
          responsiveTabs = new ResponsiveTabs(root, Tab.ID);
          simulateZeroWidth();
          spyOn(root, 'width').and.returnValue(new ResponsiveComponents().getMediumScreenWidth() - 1);
        });

        it('should creates a dropdown header', () => {
          responsiveTabs.handleResizeEvent();
          expect(root.find('.coveo-dropdown-header')).not.toBeNull();
        });

        it('should places tabs in the correct order inside and outside the dropdown', () => {
          responsiveTabs.handleResizeEvent();
          const container = openTabContainer();

          const lastTabInDropdown = container.find(`div[data-id="4"]`);
          expect(lastTabInDropdown).not.toBeNull();

          range(0, 4).forEach(tabOutsideDropdownId => {
            const tabInIncorrectPosition = container.find(`div[data-id="${tabOutsideDropdownId}"]`);
            expect(tabInIncorrectPosition).toBeNull();
          });
        });

        it('should not place a selected tab inside the dropdown', () => {
          const lastTab = last(tabs);
          lastTab.addClass('coveo-selected');
          const lastId = lastTab.getAttribute('data-id');

          responsiveTabs.handleResizeEvent();
          const container = openTabContainer();

          const selectedTabInDropdown = container.find(`div[data-id="${lastId}"]`);
          expect(selectedTabInDropdown).toBeNull();
        });
      });
    });

    describe('When tabs are overflowing', () => {
      describe('When the dropdown header is clicked', () => {
        beforeEach(() => {
          responsiveTabs.handleResizeEvent();
          $$(root.find('.coveo-dropdown-header')).trigger('click');
        });

        it('should open the dropdown content', () => {
          expect(root.find('.coveo-dropdown-content')).not.toBeNull();
          expect(root.find(`.${ResponsiveDropdown.DROPDOWN_BACKGROUND_CSS_CLASS_NAME}`)).not.toBeNull();
        });

        it('should close the dropdown content when the dowpdown header is clicked again', () => {
          $$(root.find('.coveo-dropdown-header')).trigger('click');
          expect(root.find('.coveo-dropdown-content')).toBeNull();
        });

        it('should close the dropdown content when the dowpdown overlay is clicked', () => {
          $$(root.find(`.${ResponsiveDropdown.DROPDOWN_BACKGROUND_CSS_CLASS_NAME}`)).trigger('click');
          expect(root.find('.coveo-dropdown-content')).toBeNull();
        });
      });

      describe('When the dropdown header is focused with keyboard navigation', () => {
        beforeEach(() => {
          responsiveTabs.handleResizeEvent();
          $$(root.find('.coveo-dropdown-header')).trigger('focus');
          Simulate.keyUp(root.find('.coveo-dropdown-header'), KEYBOARD.ENTER);
        });

        it('should open the dropdown content', () => {
          expect(root.find('.coveo-dropdown-content')).not.toBeNull();
        });
      });
    });
  });
}
