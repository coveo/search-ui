import { KEYBOARD } from '../../src/Core';
import { Facet, IFacetOptions } from '../../src/ui/Facet/Facet';
import { FacetSettings } from '../../src/ui/Facet/FacetSettings';
import { $$ } from '../../src/utils/Dom';
import { registerCustomMatcher } from '../CustomMatchers';
import * as Mock from '../MockEnvironment';
import { Simulate } from '../Simulate';

export function FacetSettingsTest() {
  describe('FacetSettings', () => {
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

    beforeEach(() => {
      facet = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
        field: '@field'
      }).cmp;
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
  });
}
