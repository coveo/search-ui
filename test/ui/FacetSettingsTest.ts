import * as Mock from '../MockEnvironment';
import { Facet } from '../../src/ui/Facet/Facet';
import { FacetSettings } from '../../src/ui/Facet/FacetSettings';
import { IFacetOptions } from '../../src/ui/Facet/Facet';
import { registerCustomMatcher } from '../CustomMatchers';
import { $$ } from '../../src/utils/Dom';

export function FacetSettingsTest() {
  describe('FacetSettings', function () {
    var facet: Facet;
    var facetSettings: FacetSettings;

    beforeEach(function () {
      facet = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
        field: '@field'
      }).cmp;
      registerCustomMatcher();
    });

    afterEach(function () {
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
      let built = facetSettings.build();
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
      let built = facetSettings.build();
      facetSettings.open();
      facet.root.appendChild(built);
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-hide')).toBeNull();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-show')).toBeNull();
      facet.collapse();
      facetSettings.open();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-hide')).toBeNull();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-section-show')).toBeNull();
    });
  });
}
