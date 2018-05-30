import * as Mock from '../MockEnvironment';
import { PreferencesPanel } from '../../src/ui/PreferencesPanel/PreferencesPanel';
import { $$ } from '../../src/utils/Dom';
import { PreferencesPanelEvents } from '../../src/events/PreferencesPanelEvents';

export function PreferencesPanelTest() {
  describe('PreferencesPanel', function() {
    var test: Mock.IBasicComponentSetupWithModalBox<PreferencesPanel>;

    beforeEach(function() {
      test = Mock.basicComponentSetupWithModalBox<PreferencesPanel>(PreferencesPanel);
    });

    it("shouldn't be active by default", function() {
      expect($$(test.env.element).hasClass('coveo-active')).toBe(false);
    });

    it("should activate when 'open' is called", function() {
      test.cmp.open();
      expect(test.modalBox.open).toHaveBeenCalled();
    });

    it("should deactivate when 'close' is called", function() {
      test.cmp.open();
      test.cmp.close();
      expect(test.modalBox.close).toHaveBeenCalled();
    });

    it("should trigger a savePreferences event when 'save' is called", function() {
      var saveSpy = jasmine.createSpy('saveSpy');
      $$(test.env.element).on(PreferencesPanelEvents.savePreferences, saveSpy);
      test.cmp.save();
      expect(saveSpy).toHaveBeenCalled();
    });

    it("should trigger a query when 'save' is called", function() {
      var querySpy = jasmine.createSpy('querySpy');
      test.env.queryController.executeQuery = querySpy;
      test.cmp.save();
      expect(querySpy).toHaveBeenCalled();
    });

    it("should trigger exitPreferencesWithoutSave when 'close' is called", function() {
      var closeSpy = jasmine.createSpy('closeSpy');
      $$(test.cmp.element).on(PreferencesPanelEvents.exitPreferencesWithoutSave, closeSpy);
      test.cmp.open();
      test.cmp.close();
      expect(closeSpy).toHaveBeenCalled();
    });
  });
}
