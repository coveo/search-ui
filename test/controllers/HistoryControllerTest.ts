/// <reference path="../Test.ts" />

module Coveo {
  describe('HistoryController', function () {
    var historyController: HistoryController;
    var env: Mock.IMockEnvironment;

    beforeEach(function () {
      env = new Mock.MockEnvironmentBuilder().withLiveQueryStateModel().build();
      historyController = new HistoryController(env.root, Mock.mockWindow(), env.queryStateModel, env.queryController);
    })

    afterEach(function () {
      historyController = null;
      env = null;
    })

    it('should listen to hashchange event', function () {
      expect(historyController.windoh.addEventListener).toHaveBeenCalledWith('hashchange', jasmine.any(Function));
    })

    it('should set the query state model representation on all event in the hash', function () {
      env.queryStateModel.attributes = {
        'a': 'a',
        'b': 'b',
        'c': 'notDefault',
        'd': [1, 2, 3]
      }

      env.queryStateModel.defaultAttributes = {
        'a': 'a',
        'b': 'b',
        'c': 'c',
        'd': [2, 3, 4]
      }

      $$(historyController.element).trigger('state:all');
      Defer.flush();
      expect(historyController.windoh.location.hash).toBe('#c=notDefault&d=[1,2,3]');
    })
  })
}
