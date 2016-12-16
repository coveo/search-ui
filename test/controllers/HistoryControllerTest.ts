import {HistoryController} from '../../src/controllers/HistoryController';
import {InitializationEvents} from '../../src/events/InitializationEvents';
import * as Mock from '../MockEnvironment';
import {$$} from '../../src/utils/Dom';
import {Defer} from '../../src/misc/Defer';

export function HistoryControllerTest() {
  describe('HistoryController', function () {
    var historyController: HistoryController;
    var env: Mock.IMockEnvironment;

    beforeEach(function () {
      env = new Mock.MockEnvironmentBuilder().withLiveQueryStateModel().build();
      historyController = new HistoryController(env.root, Mock.mockWindow(), env.queryStateModel, env.queryController);
    });

    afterEach(function () {
      historyController = null;
      env = null;
    });

    it('should listen to hashchange event', function () {
      expect(historyController.windoh.addEventListener).toHaveBeenCalledWith('hashchange', jasmine.any(Function));
    });

    it('should set the query state model representation on all event in the hash', function () {
      env.queryStateModel.attributes = {
        'a': 'a',
        'b': 'b',
        'c': 'notDefault',
        'd': [1, 2, 3]
      };

      env.queryStateModel.defaultAttributes = {
        'a': 'a',
        'b': 'b',
        'c': 'c',
        'd': [2, 3, 4]
      };

      $$(historyController.element).trigger('state:all');
      Defer.flush();
      expect(historyController.windoh.location.hash).toBe('#c=notDefault&d=[1,2,3]');
    });

    it('keeps parsing hash values after one fails to parse', () => {
      let threwError = false;
      let hashUtils = jasmine.createSpyObj('hashUtils', ['getValue', 'getHash']);
      env.queryStateModel.attributes = {
        a: 1,
        b: 2,
        c: 3
      };

      hashUtils.getValue.and.callFake(() => {
        if (!threwError) {
          threwError = true;
          throw new Error();
        }
      });
      historyController = new HistoryController(env.root, Mock.mockWindow(), env.queryStateModel, env.queryController, hashUtils);

      $$(env.root).trigger(InitializationEvents.restoreHistoryState);

      expect(hashUtils.getValue).toHaveBeenCalledTimes(_.size(env.queryStateModel.attributes));
    });
  });
}
