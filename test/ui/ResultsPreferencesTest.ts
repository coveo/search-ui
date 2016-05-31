/// <reference path="../Test.ts" />

module Coveo {
  describe('ResultsPreferences', function () {
    
    let test: Mock.IBasicComponentSetup<ResultsPreferences>;
    let element: Dom;
    
    beforeEach(()=>{
      element = $$('div');
      element.addClass(Component.computeCssClassName(PreferencesPanel));
    })
    
    afterEach(()=>{
      element = null;
    })
    
    describe('exposes enableOpenInOutlook', ()=>{
      it('will build a open in outlook option', () => {
        test = Mock.optionsComponentSetup<ResultsPreferences, IResultsPreferencesOptions>(ResultsPreferences, {enableOpenInOutlook: true});
        expect($$(test.cmp.element).find('input[value="' + l("OpenInOutlookWhenPossible") + '"]')).not.toBeNull();
      });
      
      it('will not build a open in outlook option if false', () => {
        test = Mock.optionsComponentSetup<ResultsPreferences, IResultsPreferencesOptions>(ResultsPreferences, {enableOpenInOutlook: false});
        expect($$(test.cmp.element).find('input[value="' + l("OpenInOutlookWhenPossible") + '"]')).toBeNull();
      });
    })
    
    describe('exposes enableOpenInNewWindow', ()=>{
      it('will build a open in new window option', () => {
        test = Mock.optionsComponentSetup<ResultsPreferences, IResultsPreferencesOptions>(ResultsPreferences, {enableOpenInNewWindow: true});
        expect($$(test.cmp.element).find('input[value="' + l("AlwaysOpenInNewWindow") + '"]')).not.toBeNull();
      });
      
      it('will not build a open in new window option if false', () => {
        test = Mock.optionsComponentSetup<ResultsPreferences, IResultsPreferencesOptions>(ResultsPreferences, {enableOpenInNewWindow: false});
        expect($$(test.cmp.element).find('input[value="' + l("AlwaysOpenInNewWindow") + '"]')).toBeNull();
      });
    })
    
    describe('when it receives the save event', ()=>{
      it('will save the current preference in the model', ()=>{
        test = Mock.basicComponentSetup<ResultsPreferences>(ResultsPreferences);
        $$(test.env.root).trigger(PreferencesPanelEvents.savePreferences);
        expect(test.env.componentOptionsModel.set).toHaveBeenCalled();
      })
    })
    
  });
};