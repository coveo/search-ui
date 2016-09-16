import {Debug} from "../../src/ui/Debug/Debug";
import {$$} from "../../src/utils/Dom";
import * as Mock from "../MockEnvironment";
import {DebugEvents} from "../../src/events/DebugEvents";
import {ModalBox} from "../../src/ExternalModulesShim";

export function DebugTest() {
  describe('Debug', () => {
    let cmp: Debug;
    let env: Mock.IMockEnvironment;
    let open: jasmine.Spy;
    let oldOpen: any;

    beforeEach(() => {
      env = new Mock.MockEnvironmentBuilder().build();
      open = jasmine.createSpy('open');
      oldOpen = ModalBox.open;
      ModalBox.open = open;

      cmp = new Debug(env.root, env.queryController, undefined, ModalBox);
    })

    afterEach(() => {
      cmp = null;
      env = null;
      open = null;
      ModalBox.open = oldOpen;
      oldOpen = null;
    })

    it('should open on showDebugPanelEvent', (done) => {
      $$(env.root).trigger(DebugEvents.showDebugPanel, {
        'foo': 'bar'
      });
      _.defer(() => {
        expect(open).toHaveBeenCalled();
        done();
      }, 0)

    })
  })
}
