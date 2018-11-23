import { RelevanceInspectorTabs } from '../../../src/ui/RelevanceInspector/RelevanceInspectorTabs';
import { $$, Dom } from '../../Test';

export function RelevanceInspectorTabsTest() {
  describe('RelevanceInspectorTabs', () => {
    it('should allow to add a navigation part', () => {
      const tabs = new RelevanceInspectorTabs(() => {}).addNavigation('foo', 'bar');
      const tabNav = tabs.navigationSection.find('#bar');
      expect(tabNav).toBeDefined();
      expect(tabNav.textContent).toContain('foo');
    });

    it('should allow to add a tab content part', () => {
      const added = $$('div');
      const tabs = new RelevanceInspectorTabs(() => {}).addContent(added, 'bar');
      const tabContent = tabs.tabContentSection.find('div[data-target-tab="bar"]');
      expect(tabContent).toBeDefined();
      expect($$(tabContent).children()[0]).toBe(added.el);
    });

    it('should allow to add navigation and content in a single call', () => {
      const added = $$('div');
      const tabs = new RelevanceInspectorTabs(() => {}).addSection('foo', added, 'bar');
      const tabNav = tabs.navigationSection.find('#bar');
      const tabContent = tabs.tabContentSection.find('div[data-target-tab="bar"]');

      expect(tabNav).toBeDefined();
      expect(tabNav.textContent).toContain('foo');

      expect(tabContent).toBeDefined();
      expect($$(tabContent).children()[0]).toBe(added.el);
    });

    describe('when selecting tabs', () => {
      let spy: jasmine.Spy;
      let firstSection: Dom;
      let secondSection: Dom;
      let tabs: RelevanceInspectorTabs;

      beforeEach(() => {
        spy = jasmine.createSpy('onchange');
        firstSection = $$('div');
        secondSection = $$('div');
        tabs = new RelevanceInspectorTabs(spy).addSection('one', firstSection, 'one').addSection('two', secondSection, 'two');
      });

      it("should change the content when you select a tab by it's id", () => {
        tabs.select('one');
        expect($$(firstSection.el.parentElement).hasClass('coveo-selected')).toBeTruthy();
        expect($$(secondSection.el.parentElement).hasClass('coveo-selected')).toBeFalsy();

        tabs.select('two');
        expect($$(firstSection.el.parentElement).hasClass('coveo-selected')).toBeFalsy();
        expect($$(secondSection.el.parentElement).hasClass('coveo-selected')).toBeTruthy();
      });

      it("should call the on change function when you select a tab by it's id", () => {
        tabs.select('one');
        expect(spy).toHaveBeenCalledWith('one');

        tabs.select('two');
        expect(spy).toHaveBeenCalledWith('two');
      });
    });
  });
}
