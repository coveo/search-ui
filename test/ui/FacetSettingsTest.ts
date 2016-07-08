module Coveo {
  describe('FacetSettings', function () {
    var facet: Facet;
    var facetSettings: FacetSettings;

    beforeEach(function () {
      facet = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
        field: '@field'
      }).cmp;
      registerCustomMatcher();
    })

    afterEach(function () {
      facet = null;
      facetSettings = null;
    })

    it('allows to save state', function () {
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
    })

    it('allows to load state', function () {
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
    })

    it('allow to open and close the popup', function () {
      facetSettings = new FacetSettings(['foo', 'bar'], facet);
      var built = facetSettings.build();
      facet.root.appendChild(built);
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-popup')).toBeNull();
      facetSettings.open();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-popup')).not.toBeNull();
      facetSettings.close();
      expect($$(facetSettings.facet.root).find('.coveo-facet-settings-popup')).toBeNull();
    })
  })
}
