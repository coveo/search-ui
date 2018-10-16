import { range, last } from 'underscore';
import { Component } from '../../../src/Core';
import { ResponsiveComponents } from '../../../src/ui/ResponsiveComponents/ResponsiveComponents';
import { ResponsiveComponentsUtils } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsUtils';
import { ResponsiveTabs } from '../../../src/ui/ResponsiveComponents/ResponsiveTabs';
import { Tab } from '../../../src/ui/Tab/Tab';
import { $$, Dom } from '../../../src/utils/Dom';

export function ResponsiveTabsTest() {
  let root: Dom;
  let responsiveTabs: ResponsiveTabs;
  let tabSection: Dom;
  let tabs: Dom[];

  describe('ResponsiveTabs', () => {
    beforeEach(() => {
      root = $$('div');
      tabSection = $$('div', { className: 'coveo-tab-section' });
      root.append(tabSection.el);
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

    it('deactivates small tabs when it should switch to large mode', () => {
      spyOn(ResponsiveComponentsUtils, 'deactivateSmallTabs');
      spyOn(root, 'width').and.returnValue(new ResponsiveComponents().getMediumScreenWidth() + 1);
      ResponsiveComponentsUtils.activateSmallTabs(root);

      responsiveTabs.handleResizeEvent();

      expect(ResponsiveComponentsUtils.deactivateSmallTabs).toHaveBeenCalled();
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

          range(0, 4).forEach(otherTabsNotInsideDropdown => {
            const otherTabWhichShouldNotBeInDropdown = container.find(`div[data-id="${otherTabsNotInsideDropdown}"]`);
            expect(otherTabWhichShouldNotBeInDropdown).toBeNull();
          });
        });

        it('should not place a selected tab inside the dropdown', () => {
          last(tabs).addClass('coveo-selected');

          responsiveTabs.handleResizeEvent();
          const container = openTabContainer();

          const selectedTabInDropdown = container.find(`div[data-id="4"]`);
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
          range(0, 5).forEach(allTabsInExpectedOrder => {
            expect(allTabsReplacedInTheirOriginalSection[allTabsInExpectedOrder].getAttribute('data-id')).toEqual(
              allTabsInExpectedOrder.toString()
            );
          });
        });
      });
    });
  });
}
