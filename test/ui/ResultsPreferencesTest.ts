/// <reference path="../Test.ts" />

module Coveo {
  describe('ResultsPreferences', function() {

    let test: Mock.IBasicComponentSetup<ResultsPreferences>;
    let element: Dom;

    beforeEach(() => {
      element = $$('div');
      element.addClass(Component.computeCssClassName(PreferencesPanel));
    })

    afterEach(() => {
      element = null;
    })

    describe('exposes enableOpenInOutlook', () => {
      it('will build a open in outlook option', () => {
        test = Mock.advancedComponentSetup<ResultsPreferences>(ResultsPreferences, new Mock.AdvancedComponentSetupOptions(element.el, { enableOpenInOutlook: true }));
        expect($$(test.cmp.element).find('input[value="' + l('OpenInOutlookWhenPossible') + '"]')).not.toBeNull();
      });

      it('will not build a open in outlook option if false', () => {
        test = Mock.advancedComponentSetup<ResultsPreferences>(ResultsPreferences, new Mock.AdvancedComponentSetupOptions(element.el, { enableOpenInOutlook: false }));
        expect($$(test.cmp.element).find('input[value="' + l('OpenInOutlookWhenPossible') + '"]')).toBeNull();
      });
    })

    describe('exposes enableOpenInNewWindow', () => {
      it('will build a open in new window option', () => {
        test = Mock.advancedComponentSetup<ResultsPreferences>(ResultsPreferences, new Mock.AdvancedComponentSetupOptions(element.el, { enableOpenInNewWindow: true }));
        expect($$(test.cmp.element).find('input[value="' + l('AlwaysOpenInNewWindow') + '"]')).not.toBeNull();
      });

      it('will not build a open in new window option if false', () => {
        test = Mock.advancedComponentSetup<ResultsPreferences>(ResultsPreferences, new Mock.AdvancedComponentSetupOptions(element.el, { enableOpenInNewWindow: false }));
        expect($$(test.cmp.element).find('input[value="' + l('AlwaysOpenInNewWindow') + '"]')).toBeNull();
      });
    })

    describe('when it receives the save event', () => {
      it('will save the current preference in the model', () => {
        test = Mock.advancedComponentSetup<ResultsPreferences>(ResultsPreferences, new Mock.AdvancedComponentSetupOptions(element.el));
        $$(test.env.root).trigger(PreferencesPanelEvents.savePreferences);
        expect(test.env.componentOptionsModel.set).toHaveBeenCalled();
      })
    })

  });
};
