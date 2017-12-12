import * as Mock from '../MockEnvironment';
import { Facet } from '../../src/ui/Facet/Facet';
import { FacetSettings } from '../../src/ui/Facet/FacetSettings';
import { IFacetOptions } from '../../src/ui/Facet/Facet';
import { registerCustomMatcher } from '../CustomMatchers';
import { $$ } from '../../src/utils/Dom';

export function FacetSettingsTest() {
  describe('FacetSettings', function() {
    let facet: Facet;
    let facetSettings: FacetSettings;

    beforeEach(function() {
      facet = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
        field: '@field'
      }).cmp;
      registerCustomMatcher();
    });

    afterEach(function() {
      facet = null;
      facetSettings = null;
    });

    it('allows to save state', () => {
      // settings not enabled : no call to query state
      facetSettings = new FacetSettings(['foo', 'bar'], facet);
      facetSettings.build();
      facetSettings.saveState();
      expect(facet.queryStateModel.get).not.toHaveBeenCalled();

      // settings enabled : 3 calls to query state
      facet.options.enableSettingsFacetState = true;
      facetSettings = new FacetSettings(['foo', 'bar'], facet);
      facetSettings.build();
      facetSettings.saveState();
      expect(facet.queryStateModel.get).toHaveBeenCalledTimes(3);
    });

    it('allows to load state', () => {
      // settings not enabled : no call to query state
      facetSettings = new FacetSettings(['foo', 'bar'], facet);
      facetSettings.build();
      facetSettings.loadSavedState();
      expect(facet.queryStateModel.setMultiple).not.toHaveBeenCalled();

      // settings enabled : 1 call to set multiple
      facet.options.enableSettingsFacetState = true;
      facetSettings = new FacetSettings(['foo', 'bar'], facet);
      facetSettings.build();
      facetSettings.loadSavedState();
      expect(facet.queryStateModel.setMultiple).toHaveBeenCalled();
    });

    it('allow to open and close the popup', () => {
      facetSettings = new FacetSettings(['foo', 'bar'], facet);
      var built = facetSettings.build();
      facet.root.appendChild(built);
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-popup')).toBeNull();
      facetSettings.open();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-popup')).not.toBeNull();
      facetSettings.close();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-popup')).toBeNull();
    });

    it('should show collapse/expand section if it is not disabled from the facet', () => {
      facet.options.enableCollapse = true;
      facetSettings = new FacetSettings(['foo', 'bar'], facet);
      const built = facetSettings.build();
      facetSettings.open();
      facet.root.appendChild(built);
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-hide')).not.toBeNull();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-show')).not.toBeNull();
      facet.collapse();
      facetSettings.open();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-hide')).not.toBeNull();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-show')).not.toBeNull();
    });

    it('should not show collapse/expand section if it is disabled from the facet', () => {
      facet.options.enableCollapse = false;
      facetSettings = new FacetSettings(['foo', 'bar'], facet);
      const built = facetSettings.build();
      facetSettings.open();
      facet.root.appendChild(built);
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-hide')).toBeNull();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-show')).toBeNull();
      facet.collapse();
      facetSettings.open();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-hide')).toBeNull();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-show')).toBeNull();
    });

    it("should show direction section if there's two linked parameters that require changing direction", () => {
      facetSettings = new FacetSettings(['alphaascending', 'alphadescending'], facet);
      facetSettings.build();
      facetSettings.open();
      expect($$(facetSettings.settingsPopup).find('.coveo-facet-settings-section-direction-ascending')).not.toBeNull();
      expect($$(facetSettings.settingsPopup).find('.coveo-facet-settings-section-direction-descending')).not.toBeNull();
    });

    it("should not show direction section if there's a single ascending or descending parameter", () => {
      facetSettings = new FacetSettings(['alphaascending'], facet);
      facetSettings.build();
      facetSettings.open();
      expect($$(facetSettings.settingsPopup).find('.coveo-facet-settings-section-direction-ascending')).toBeNull();
      expect($$(facetSettings.settingsPopup).find('.coveo-facet-settings-section-direction-descending')).toBeNull();
    });

    it("should not show direction section if there's two parameters allowing changing direction, but both parameters are not linked", () => {
      facetSettings = new FacetSettings(['alphaascending', 'computedfieldascending'], facet);
      facetSettings.build();
      facetSettings.open();
      expect($$(facetSettings.settingsPopup).find('.coveo-facet-settings-section-direction-ascending')).toBeNull();
      expect($$(facetSettings.settingsPopup).find('.coveo-facet-settings-section-direction-descending')).toBeNull();
    });

    it('should activate direction section when selecting a sort item with a possible direction', () => {
      facetSettings = new FacetSettings(['score', 'alphaascending', 'alphadescending'], facet);
      facetSettings.build();
      facetSettings.open();
      let ascendingSection = $$(facetSettings.settingsPopup).find('.coveo-facet-settings-item[data-direction="ascending"]');
      expect($$(ascendingSection).hasClass('coveo-selected')).toBe(false);
      $$(facetSettings.getSortItem('alphaascending')).trigger('click');
      expect($$(ascendingSection).hasClass('coveo-selected')).toBe(true);
    });

    it('should de-activate direction section when selecting a sort item with no possible direction', () => {
      facetSettings = new FacetSettings(['alphaascending', 'alphadescending', 'score'], facet);
      facetSettings.build();
      facetSettings.open();
      let ascendingSection = $$(facetSettings.settingsPopup).find('.coveo-facet-settings-item[data-direction="ascending"]');
      expect($$(ascendingSection).hasClass('coveo-selected')).toBe(true);
      $$(facetSettings.getSortItem('score')).trigger('click');
      expect($$(ascendingSection).hasClass('coveo-selected')).toBe(false);
    });
  });
}
