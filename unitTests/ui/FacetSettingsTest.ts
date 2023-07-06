import { KEYBOARD } from '../../src/Core';
import { Facet, IFacetOptions } from '../../src/ui/Facet/Facet';
import { FacetSettings } from '../../src/ui/Facet/FacetSettings';
import { $$ } from '../../src/utils/Dom';
import { l } from '../../src/strings/Strings';
import { registerCustomMatcher } from '../CustomMatchers';
import * as Mock from '../MockEnvironment';
import { Simulate } from '../Simulate';
import { FacetHeader } from '../../src/ui/Facet/FacetHeader';
import { FacetSort } from '../../src/ui/Facet/FacetSort';

export function FacetSettingsTest() {
  describe('FacetSettings', () => {
    let test: Mock.IBasicComponentSetup<Facet>;
    let facet: Facet;
    let facetSettings: FacetSettings;
    let sorts: string[];

    function initFacetSettings() {
      facetSettings = new FacetSettings(sorts, facet);
      facetSettings.build();
    }

    const waitForPopperJS = () => {
      return Promise.resolve(resolve => setTimeout(() => resolve(true), 100));
    };

    function fakeFacet() {
      facet.element = $$('div').el;
      facet.facetHeader = Mock.mock(FacetHeader);
      facet.facetHeader.collapseFacet = () => facet.element.classList.add('coveo-facet-collapsed');
      facet.facetHeader.expandFacet = () => facet.element.classList.remove('coveo-facet-collapsed');
    }

    beforeEach(() => {
      test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
        field: '@field'
      });
      facet = test.cmp;
      fakeFacet();
      sorts = ['foo', 'bar'];
      const container = document.createElement('div');
      container.appendChild(facet.element);
      facet.root.appendChild(container);
      registerCustomMatcher();
    });

    afterEach(() => {
      facet = null;
      facetSettings = null;
    });

    it('when opened, focuses on the collapse section', () => {
      initFacetSettings();
      const focusSpy = spyOn(facetSettings['hideSection'], 'focus');
      facetSettings.open();
      expect(focusSpy).toHaveBeenCalledTimes(1);
    });

    it('allows to save state', () => {
      // settings not enabled : no call to query state
      initFacetSettings();
      facetSettings.saveState();
      expect(facet.queryStateModel.get).not.toHaveBeenCalled();

      // settings enabled : 3 calls to query state
      facet.options.enableSettingsFacetState = true;
      initFacetSettings();
      facetSettings.saveState();
      expect(facet.queryStateModel.get).toHaveBeenCalledTimes(3);
    });

    it('allows to load state', () => {
      // settings not enabled : no call to query state
      initFacetSettings();
      facetSettings.loadSavedState();
      expect(facet.queryStateModel.setMultiple).not.toHaveBeenCalled();

      // settings enabled : 1 call to set multiple
      facet.options.enableSettingsFacetState = true;
      initFacetSettings();
      facetSettings.loadSavedState();
      expect(facet.queryStateModel.setMultiple).toHaveBeenCalled();
    });

    describe('given the FacetSettings is initialized and appended to a facet', () => {
      function settingsPopup() {
        return $$(facetSettings.facet.root).find('.coveo-facet-settings-popup');
      }

      beforeEach(() => {
        sorts = ['alphaascending', 'alphadescending'];
        initFacetSettings();
        facet.root.appendChild(facetSettings.settingsButton);
        expect(settingsPopup()).toBeNull();
      });

      it('allow to open and close the popup using the #open and #close methods', () => {
        facetSettings.open();
        expect(settingsPopup()).not.toBeNull();

        facetSettings.close();
        expect(settingsPopup()).toBeNull();
      });

      it('focuses on the first sort item', () => {
        const focusSpy = spyOn(facetSettings['sortSection'].sortItems[0], 'focus');
        facetSettings.open();
        expect(focusSpy).toHaveBeenCalledTimes(1);
      });

      it('allows open and closing the popup by clicking the facetSetting button', () => {
        facetSettings.settingsButton.click();
        expect(settingsPopup()).not.toBeNull();

        facetSettings.settingsButton.click();
        expect(settingsPopup()).toBeNull();
      });

      describe('when the settings popup is visible', () => {
        beforeEach(() => facetSettings.settingsButton.click());

        it(`when triggering an escape event on the settings button,
        it closes the settings popup`, () => {
          Simulate.keyUp(facetSettings.settingsButton, KEYBOARD.ESCAPE);
          expect(settingsPopup()).toBeNull();
        });

        it(`when triggering an escape event on the settings popup,
        it closes the settings popup`, () => {
          Simulate.keyUp(settingsPopup(), KEYBOARD.ESCAPE);
          expect(settingsPopup()).toBeNull();
        });

        it(`when triggering an escape event on the settings popup,
        it focuses the settings button element`, () => {
          spyOn(facetSettings.settingsButton, 'focus');
          Simulate.keyUp(settingsPopup(), KEYBOARD.ESCAPE);
          expect(facetSettings.settingsButton.focus).toHaveBeenCalledTimes(1);
        });
      });

      it('allows open and closing the popup by pressing enter on the facetSetting button', () => {
        Simulate.keyUp(facetSettings.settingsButton, KEYBOARD.ENTER);
        expect(settingsPopup()).not.toBeNull();

        Simulate.keyUp(facetSettings.settingsButton, KEYBOARD.ENTER);
        expect(settingsPopup()).toBeNull();
      });

      it('closes the popup when losing focus', () => {
        Simulate.keyUp(facetSettings.settingsButton, KEYBOARD.ENTER);
        $$(settingsPopup()).trigger('focusout');
        expect(settingsPopup()).toBeNull();
      });

      it('appends the settings popup after the button', () => {
        Simulate.keyUp(facetSettings.settingsButton, KEYBOARD.ENTER);
        expect(settingsPopup().previousSibling).toEqual(facetSettings.settingsButton);
      });
    });

    it('should show collapse/expand section if it is not disabled from the facet', async done => {
      facet.options.enableCollapse = true;
      initFacetSettings();
      facet.root.appendChild(facetSettings.settingsButton);
      facetSettings.open();
      await waitForPopperJS();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-hide')).not.toBeNull();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-show')).not.toBeNull();
      facet.collapse();
      facetSettings.open();
      await waitForPopperJS();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-hide')).not.toBeNull();
      done();
    });

    it('should not show collapse/expand section if it is disabled from the facet', () => {
      facet.options.enableCollapse = false;
      initFacetSettings();

      facetSettings.open();
      facet.root.appendChild(facetSettings.settingsButton);
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-hide')).toBeNull();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-show')).toBeNull();

      facet.collapse();
      facetSettings.open();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-hide')).toBeNull();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-show')).toBeNull();
    });

    it("should show direction section if there's two linked parameters that require changing direction", () => {
      sorts = ['alphaascending', 'alphadescending'];
      initFacetSettings();
      facetSettings.open();

      expect($$(facetSettings.settingsPopup).find('.coveo-facet-settings-section-direction-ascending')).not.toBeNull();
      expect($$(facetSettings.settingsPopup).find('.coveo-facet-settings-section-direction-descending')).not.toBeNull();
    });

    it('should show direction section if the initial sort criteria requires changing direction', () => {
      sorts = ['alphaascending', 'alphadescending'];
      initFacetSettings();
      facetSettings.activeSort = FacetSort.availableSorts.alphaascending;
      facetSettings.open();

      const ascendingSection = $$(facetSettings.settingsPopup).find('.coveo-facet-settings-item[data-direction="ascending"]');
      expect($$(ascendingSection).getAttribute('aria-disabled')).toBe('false');
    });

    it("should not show direction section if there's a single ascending or descending parameter", () => {
      sorts = ['alphaascending'];
      initFacetSettings();
      facetSettings.open();

      expect($$(facetSettings.settingsPopup).find('.coveo-facet-settings-section-direction-ascending')).toBeNull();
      expect($$(facetSettings.settingsPopup).find('.coveo-facet-settings-section-direction-descending')).toBeNull();
    });

    it("should not show direction section if there's two parameters allowing changing direction, but both parameters are not linked", () => {
      sorts = ['alphaascending', 'computedfieldascending'];
      initFacetSettings();
      facetSettings.open();

      expect($$(facetSettings.settingsPopup).find('.coveo-facet-settings-section-direction-ascending')).toBeNull();
      expect($$(facetSettings.settingsPopup).find('.coveo-facet-settings-section-direction-descending')).toBeNull();
    });

    it('should activate direction section when selecting a sort item with a possible direction', () => {
      sorts = ['score', 'alphaascending', 'alphadescending'];
      initFacetSettings();
      facetSettings.open();

      const ascendingSection = $$(facetSettings.settingsPopup).find('.coveo-facet-settings-item[data-direction="ascending"]');
      expect($$(ascendingSection).hasClass('coveo-selected')).toBe(false);

      $$(facetSettings.getSortItem('alphaascending')).trigger('click');
      expect($$(ascendingSection).hasClass('coveo-selected')).toBe(true);
    });

    it('should de-activate direction section when selecting a sort item with no possible direction', () => {
      sorts = ['alphaascending', 'alphadescending', 'score'];
      initFacetSettings();
      facetSettings.open();

      const ascendingSection = $$(facetSettings.settingsPopup).find('.coveo-facet-settings-item[data-direction="ascending"]');
      expect($$(ascendingSection).hasClass('coveo-selected')).toBe(true);

      $$(facetSettings.getSortItem('score')).trigger('click');
      expect($$(ascendingSection).hasClass('coveo-selected')).toBe(false);
    });

    describe('when closing the popup', () => {
      beforeEach(() => {
        jasmine.clock().install();
        initFacetSettings();
        spyOn(facetSettings, 'close');
        facetSettings.open();
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      it('should close the after a delay on mouseleave', () => {
        $$(facetSettings.button).trigger('mouseleave');
        jasmine.clock().tick(400);
        expect(facetSettings.close).toHaveBeenCalled();
      });

      it('should not close if there is a mouseenter following a mouseleave', () => {
        $$(facetSettings.button).trigger('mouseleave');
        jasmine.clock().tick(50);
        $$(facetSettings.button).trigger('mouseenter');
        jasmine.clock().tick(400);
        expect(facetSettings.close).not.toHaveBeenCalled();
      });
    });

    describe('with all sections', () => {
      const sections = {
        sort: 'coveo-facet-settings-section-sort',
        ascending: 'coveo-facet-settings-section-direction-ascending',
        descending: 'coveo-facet-settings-section-direction-descending',
        save: 'coveo-facet-settings-section-save-state',
        clear: 'coveo-facet-settings-section-clear-state',
        hide: 'coveo-facet-settings-section-hide',
        show: 'coveo-facet-settings-section-show'
      };

      const sectionClassesInOrder = [
        sections.sort,
        sections.ascending,
        sections.descending,
        sections.save,
        sections.clear,
        sections.hide,
        sections.show
      ];

      function getSection(className: string) {
        return $$(facetSettings.settingsPopup).findClass(className)[0];
      }

      function getItems(className: string) {
        return $$(getSection(className)).findAll('.coveo-facet-settings-item');
      }

      beforeEach(() => {
        sorts = ['occurrences', 'score', 'alphaascending', 'alphadescending'];
        facet.options.enableCollapse = true;
        facet.options.enableSettingsFacetState = true;
        initFacetSettings();
        facet.root.appendChild(facetSettings.settingsButton);
        facetSettings.open();
        document.body.appendChild(test.env.root);
      });

      afterEach(() => {
        test.env.root.remove();
      });

      it('should render the sections: sort, ascending, descending, save, clear, hide and show', () => {
        const renderedSections = $$(facetSettings.settingsPopup).children();
        expect(renderedSections.length).toEqual(sectionClassesInOrder.length);
        sectionClassesInOrder.forEach((expectedSectionClass, index) =>
          expect(renderedSections[index]).toBe(getSection(expectedSectionClass))
        );
      });

      it("doesn't make the sort section a button", () => {
        expect(getSection(sections.sort).getAttribute('role')).not.toEqual('button');
      });

      it('renders the sort items', () => {
        expect(getItems(sections.sort).map(item => item.innerText)).toEqual([l('Occurrences'), l('Score'), l('Label')]);
      });

      it('should make the sort items toggleable buttons', () => {
        const selectedIndex = 0;
        getItems(sections.sort).forEach((sortItem, index) => {
          expect(sortItem.getAttribute('role')).toEqual('button');
          expect(sortItem.getAttribute('aria-pressed')).toEqual((index === selectedIndex).toString());
        });
      });

      it("doesn't make the ascending section a button", () => {
        expect(getSection(sections.ascending).getAttribute('role')).not.toEqual('button');
      });

      it("doesn't make the descending section a button", () => {
        expect(getSection(sections.descending).getAttribute('role')).not.toEqual('button');
      });

      it('renders a single item in the ascending section', () => {
        expect(getItems(sections.ascending).length).toEqual(1);
      });

      it('renders a single item in the descending section', () => {
        expect(getItems(sections.descending).length).toEqual(1);
      });

      it('makes the ascending item a toggled off button', () => {
        const [item] = getItems(sections.ascending);
        expect(item.getAttribute('role')).toEqual('button');
        expect(item.getAttribute('aria-pressed')).toEqual('false');
      });

      it('makes the descending item a toggled off button', () => {
        const [item] = getItems(sections.descending);
        expect(item.getAttribute('role')).toEqual('button');
        expect(item.getAttribute('aria-pressed')).toEqual('false');
      });

      it('makes the save section a non-toggleable button', () => {
        const section = getSection(sections.save);
        expect(section.getAttribute('role')).toEqual('button');
        expect(section.getAttribute('aria-pressed')).toBeNull();
      });

      it('makes the clear section a non-toggleable button', () => {
        const section = getSection(sections.clear);
        expect(section.getAttribute('role')).toEqual('button');
        expect(section.getAttribute('aria-pressed')).toBeNull();
      });

      it('renders a single item in the save section', () => {
        expect(getItems(sections.save).length).toEqual(1);
      });

      it('renders a single item in the clear section', () => {
        expect(getItems(sections.clear).length).toEqual(1);
      });

      it("doesn't make the save item a button", () => {
        expect(getItems(sections.save)[0].getAttribute('role')).not.toEqual('button');
      });

      it("doesn't make the clear item a button", () => {
        expect(getItems(sections.clear)[0].getAttribute('role')).not.toEqual('button');
      });

      it('makes the hide section a non-toggleable button', () => {
        const section = getSection(sections.hide);
        expect(section.getAttribute('role')).toEqual('button');
        expect(section.getAttribute('aria-pressed')).toBeNull();
      });

      it('makes the show section a non-toggleable button', () => {
        const section = getSection(sections.show);
        expect(section.getAttribute('role')).toEqual('button');
        expect(section.getAttribute('aria-pressed')).toBeNull();
      });

      it('renders a single item in the hide section', () => {
        expect(getItems(sections.hide).length).toEqual(1);
      });

      it('renders a single item in the show section', () => {
        expect(getItems(sections.show).length).toEqual(1);
      });

      it("doesn't make the hide item a button", () => {
        expect(getItems(sections.hide)[0].getAttribute('role')).not.toEqual('button');
      });

      it("doesn't make the show item a button", () => {
        expect(getItems(sections.show)[0].getAttribute('role')).not.toEqual('button');
      });

      it('hides the show button and shows the hide button', () => {
        const showButton = getSection(sections.show);
        const hideButton = getSection(sections.hide);
        expect(showButton.getAttribute('aria-hidden')).toEqual('true');
        expect(window.getComputedStyle(showButton).display).toEqual('none');
        expect(hideButton.getAttribute('aria-hidden')).not.toEqual('true');
        expect(window.getComputedStyle(hideButton).display).not.toEqual('none');
      });

      it('after pressing the hide button, shows the show button and hides the hide button', () => {
        const showButton = getSection(sections.show);
        const hideButton = getSection(sections.hide);
        hideButton.click();
        facetSettings.open();
        expect(showButton.getAttribute('aria-hidden')).not.toEqual('true');
        expect(window.getComputedStyle(showButton).display).not.toEqual('none');
        expect(hideButton.getAttribute('aria-hidden')).toEqual('true');
        expect(window.getComputedStyle(hideButton).display).toEqual('none');
      });

      it('disables the ascending button', () => {
        expect(getItems(sections.ascending)[0].getAttribute('aria-disabled')).toEqual('true');
      });

      it('disables the descending button', () => {
        expect(getItems(sections.descending)[0].getAttribute('aria-disabled')).toEqual('true');
      });

      describe('after selecting a sort with directions', () => {
        const selectedIndex = 2;
        beforeEach(() => {
          getItems(sections.sort)[selectedIndex].click();
        });

        it('should toggle the old and new pressed sort buttons', () => {
          getItems(sections.sort).forEach((sortItem, index) =>
            expect(sortItem.getAttribute('aria-pressed')).toEqual((index === selectedIndex).toString())
          );
        });

        it('enables the ascending button', () => {
          expect(getItems(sections.ascending)[0].getAttribute('aria-disabled')).toEqual('false');
        });

        it('enables the descending button', () => {
          expect(getItems(sections.descending)[0].getAttribute('aria-disabled')).toEqual('false');
        });

        it('represents the current sort direction', () => {
          expect(
            [getItems(sections.ascending)[0], getItems(sections.descending)[0]].map(item => item.getAttribute('aria-pressed'))
          ).toEqual(['true', 'false']);
        });

        describe('then selecting another direction', () => {
          beforeEach(() => {
            getItems(sections.descending)[0].click();
          });

          it('represents the current sort direction', () => {
            expect(
              [getItems(sections.ascending)[0], getItems(sections.descending)[0]].map(item => item.getAttribute('aria-pressed'))
            ).toEqual(['false', 'true']);
          });
        });

        describe('then selecting a sort without directions', () => {
          beforeEach(() => {
            getItems(sections.sort)[0].click();
          });

          it('disables the ascending button', () => {
            expect(getItems(sections.ascending)[0].getAttribute('aria-disabled')).toEqual('true');
          });

          it('disables the descending button', () => {
            expect(getItems(sections.descending)[0].getAttribute('aria-disabled')).toEqual('true');
          });
        });
      });
    });
  });
}
