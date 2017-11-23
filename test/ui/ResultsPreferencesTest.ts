import * as Mock from '../MockEnvironment';
import { ResultsPreferences } from '../../src/ui/ResultsPreferences/ResultsPreferences';
import { Dom } from '../../src/utils/Dom';
import { $$ } from '../../src/utils/Dom';
import { Component } from '../../src/ui/Base/Component';
import { PreferencesPanel } from '../../src/ui/PreferencesPanel/PreferencesPanel';
import { l } from '../../src/strings/Strings';
import { PreferencesPanelEvents } from '../../src/events/PreferencesPanelEvents';
import { Defer } from '../../src/misc/Defer';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';

export function ResultsPreferencesTest() {
  describe('ResultsPreferences', function() {
    let test: Mock.IBasicComponentSetup<ResultsPreferences>;
    let element: Dom;

    beforeEach(() => {
      element = $$('div');
      element.addClass(Component.computeCssClassName(PreferencesPanel));
    });

    afterEach(() => {
      element = null;
      localStorage.removeItem('coveo-ResultsPreferences');
    });

    describe('with incoherent configuration', () => {
      it('will adjust the preferences for outlook correctly', done => {
        localStorage.setItem('coveo-ResultsPreferences', JSON.stringify({ openInOutlook: true }));
        expect(
          () =>
            (test = Mock.advancedComponentSetup<ResultsPreferences>(
              ResultsPreferences,
              new Mock.AdvancedComponentSetupOptions(element.el, { enableOpenInOutlook: false })
            ))
        ).not.toThrow();
        Defer.defer(() => {
          expect(JSON.parse(localStorage.getItem('coveo-ResultsPreferences')).openInOutlook).toBeUndefined();
          done();
        });
      });

      it('will adjust the preferences for open in new window correctly', done => {
        localStorage.setItem('coveo-ResultsPreferences', JSON.stringify({ alwaysOpenInNewWindow: true }));
        expect(
          () =>
            (test = Mock.advancedComponentSetup<ResultsPreferences>(
              ResultsPreferences,
              new Mock.AdvancedComponentSetupOptions(element.el, { enableOpenInNewWindow: false })
            ))
        ).not.toThrow();
        Defer.defer(() => {
          expect(JSON.parse(localStorage.getItem('coveo-ResultsPreferences')).alwaysOpenInNewWindow).toBeUndefined();
          done();
        });
      });

      it('will adjust the preferences for enable query syntax correctly', done => {
        localStorage.setItem('coveo-ResultsPreferences', JSON.stringify({ enableQuerySyntax: true }));
        expect(
          () =>
            (test = Mock.advancedComponentSetup<ResultsPreferences>(
              ResultsPreferences,
              new Mock.AdvancedComponentSetupOptions(element.el, { enableQuerySyntax: false })
            ))
        ).not.toThrow();
        Defer.defer(() => {
          expect(JSON.parse(localStorage.getItem('coveo-ResultsPreferences')).enableQuerySyntax).toBeUndefined();
          done();
        });
      });
    });

    describe('when an input changes', () => {
      let input: HTMLInputElement;

      beforeEach(() => {
        test = Mock.advancedComponentSetup<ResultsPreferences>(
          ResultsPreferences,
          new Mock.AdvancedComponentSetupOptions(element.el, { enableOpenInNewWindow: true })
        );
        input = <HTMLInputElement>$$(test.cmp.element).find(`input[value='${l('AlwaysOpenInNewWindow')}']`);
      });

      afterEach(() => {
        input = null;
      });

      it('will log an analytics custom event', () => {
        $$(input).trigger('change');
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.preferencesChange,
          jasmine.objectContaining({
            preferenceName: jasmine.any(String)
          }),
          test.cmp.element
        );
      });

      it('will log an analytics search event', () => {
        $$(input).trigger('change');
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.preferencesChange,
          jasmine.objectContaining({
            preferenceName: jasmine.any(String)
          })
        );
      });

      it('will trigger a query when the input is changed', () => {
        $$(input).trigger('change');
        expect(test.env.queryController.executeQuery).toHaveBeenCalled();
      });
    });

    describe('exposes enableOpenInOutlook', () => {
      it('will build a open in outlook option', () => {
        test = Mock.advancedComponentSetup<ResultsPreferences>(
          ResultsPreferences,
          new Mock.AdvancedComponentSetupOptions(element.el, { enableOpenInOutlook: true })
        );
        expect($$(test.cmp.element).find(`input[value='${l('OpenInOutlookWhenPossible')}']`)).not.toBeNull();
      });

      it('will not build a open in outlook option if false', () => {
        test = Mock.advancedComponentSetup<ResultsPreferences>(
          ResultsPreferences,
          new Mock.AdvancedComponentSetupOptions(element.el, { enableOpenInOutlook: false })
        );
        expect($$(test.cmp.element).find(`input[value='${l('OpenInOutlookWhenPossible')}']`)).toBeNull();
      });
    });

    describe('exposes enableQuerySyntax', () => {
      it('will build a enable query syntax option', () => {
        test = Mock.advancedComponentSetup<ResultsPreferences>(
          ResultsPreferences,
          new Mock.AdvancedComponentSetupOptions(element.el, { enableQuerySyntax: true })
        );
        expect($$(test.cmp.element).find(`input[name="coveo-results-preferences-query-syntax"]`)).not.toBeNull();
      });

      it('will not build a enable query syntax option if false', () => {
        test = Mock.advancedComponentSetup<ResultsPreferences>(
          ResultsPreferences,
          new Mock.AdvancedComponentSetupOptions(element.el, { enableQuerySyntax: false })
        );
        expect($$(test.cmp.element).find(`input[name="coveo-results-preferences-query-syntax"]`)).toBeNull();
      });
    });

    describe('exposes enableOpenInNewWindow', () => {
      it('will build a open in new window option', () => {
        test = Mock.advancedComponentSetup<ResultsPreferences>(
          ResultsPreferences,
          new Mock.AdvancedComponentSetupOptions(element.el, { enableOpenInNewWindow: true })
        );
        expect($$(test.cmp.element).find(`input[value='${l('AlwaysOpenInNewWindow')}']`)).not.toBeNull();
      });

      it('will not build a open in new window option if false', () => {
        test = Mock.advancedComponentSetup<ResultsPreferences>(
          ResultsPreferences,
          new Mock.AdvancedComponentSetupOptions(element.el, { enableOpenInNewWindow: false })
        );
        expect($$(test.cmp.element).find(`input[value='${l('AlwaysOpenInNewWindow')}']`)).toBeNull();
      });
    });

    describe('when it receives the save event', () => {
      it('will save the current preference in the model', () => {
        test = Mock.advancedComponentSetup<ResultsPreferences>(ResultsPreferences, new Mock.AdvancedComponentSetupOptions(element.el));
        $$(test.env.root).trigger(PreferencesPanelEvents.savePreferences);
        expect(test.env.componentOptionsModel.set).toHaveBeenCalled();
      });
    });
  });
}
