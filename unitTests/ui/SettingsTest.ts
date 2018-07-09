import * as Mock from '../MockEnvironment';
import { Settings } from '../../src/ui/Settings/Settings';
import { $$ } from '../../src/utils/Dom';
import { InitializationEvents } from '../../src/events/InitializationEvents';
import { ISettingsOptions } from '../../src/ui/Settings/Settings';
import { Simulate } from '../Simulate';

export function SettingsTest() {
  describe('Settings', () => {
    var test: Mock.IBasicComponentSetup<Settings>;
    beforeEach(() => {
      Simulate.removeJQuery();
      test = Mock.basicComponentSetup<Settings>(Settings);
      $$(test.env.root).trigger(InitializationEvents.afterInitialization);
    });

    it('should be rendered', () => {
      expect($$(test.env.element).find('span.coveo-settings-squares')).not.toBeNull();
    });

    it('should render a popup when opened', () => {
      test.cmp.open();
      expect($$(test.env.root).find('.coveo-settings-advanced-menu')).not.toBeNull();
    });

    it('should remove the popup when closed', () => {
      test.cmp.open();
      test.cmp.close();
      expect($$(test.env.root).find('.coveo-settings-advanced-menu')).toBeNull();
    });

    it('should be able to execute open 2 times, then close one time', () => {
      test.cmp.open();
      test.cmp.open();
      test.cmp.close();
      expect($$(test.env.root).find('.coveo-settings-advanced-menu')).toBeNull();
    });

    it('should be able to execute close 2 times, then open one time', () => {
      test.cmp.close();
      test.cmp.close();
      test.cmp.open();
      expect($$(test.env.root).find('.coveo-settings-advanced-menu')).not.toBeNull();
    });

    describe('exposes options', () => {
      describe('menuDelay', () => {
        it("should wait the duration of 'menuDelay' before closing the popup on mouseleave", done => {
          test = Mock.optionsComponentSetup<Settings, ISettingsOptions>(Settings, <ISettingsOptions>{
            menuDelay: 999999
          });
          test.cmp.open();
          $$(test.cmp.element).trigger('mouseleave');
          setTimeout(() => {
            expect($$(test.env.root).find('.coveo-settings-advanced-menu')).not.toBeNull();
            done();
          }, 0);
        });
      });
    });
  });
}
