import {Debug} from '../../src/ui/Debug/Debug';
import {$$} from '../../src/utils/Dom';
import * as Mock from '../MockEnvironment';
import {DebugEvents} from '../../src/events/DebugEvents';
import {ModalBox} from '../../src/ExternalModulesShim';
import {Simulate} from '../Simulate';
import {KEYBOARD} from '../../src/utils/KeyboardUtils';
import {InitializationEvents} from '../../src/events/InitializationEvents';

export function DebugTest() {
  describe('Debug', () => {
    let cmp: Debug;
    let env: Mock.IMockEnvironment;
    let open: jasmine.Spy;
    let close: jasmine.Spy;
    let oldOpen: any;
    let oldClose: any;

    beforeEach(() => {
      env = new Mock.MockEnvironmentBuilder().build();
      open = jasmine.createSpy('open');
      close = jasmine.createSpy('close');
      oldOpen = ModalBox.open;
      oldClose = ModalBox.close;
      ModalBox.open = open.and.returnValue({
        wrapper: $$('div', undefined, $$('div', {className: 'coveo-title'}))
      });
      ModalBox.close = close;

      cmp = new Debug(env.root, env.queryController, undefined, ModalBox);
    });

    afterEach(() => {
      cmp = null;
      env = null;
      open = null;
      close = null;
      ModalBox.open = oldOpen;
      ModalBox.close = oldClose;
      oldOpen = null;
      oldClose = null;
    });

    it('should open on showDebugPanelEvent', (done) => {
      $$(env.root).trigger(DebugEvents.showDebugPanel, {
        'foo': 'bar'
      });
      _.defer(() => {
        expect(open).toHaveBeenCalled();
        done();
      }, 0);
    });

    // KeyboardEvent constructor does not exist in phantomjs
    if (!Simulate.isPhantomJs()) {
      it('should close on escape', (done) => {
        $$(env.root).trigger(DebugEvents.showDebugPanel, {
          'foo': 'bar'
        });
        _.defer(() => {
          expect(open).toHaveBeenCalled();
          Simulate.keyUp(document.body, KEYBOARD.ESCAPE);
          expect(close).toHaveBeenCalled();
          done();
        }, 0);
      });
    }
  });
}
