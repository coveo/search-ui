import * as Mock from '../MockEnvironment';
import { Triggers } from '../../src/ui/Triggers/Triggers';
import { IQueryResults } from '../../src/rest/QueryResults';
import { FakeResults } from '../Fake';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';
import { ITriggerNotify } from '../../src/rest/Trigger';
import { ITriggerExecute } from '../../src/rest/Trigger';
import { ITriggerRedirect } from '../../src/rest/Trigger';
import { ITriggerQuery } from '../../src/rest/Trigger';
import { QueryStateModel } from '../../src/models/QueryStateModel';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';

export function TriggersTest() {
  describe('Triggers', function() {
    var test: Mock.IBasicComponentSetup<Triggers>;
    var results: IQueryResults;

    beforeEach(function() {
      test = Mock.basicComponentSetup<Triggers>(Triggers);
      test.cmp._window = Mock.mockWindow();
      results = FakeResults.createFakeResults(0);
    });

    it('should do nothing if triggers are not present in the response', function() {
      results.triggers = null;

      Simulate.query(test.env, { results: results });

      expect($$(test.cmp.element).hasClass('coveo-visible')).toBe(false);
      expect(test.cmp.element.innerHTML).toBe('');
    });

    it("should set a notification properly when a 'notify' trigger is present", function() {
      results.triggers = [<ITriggerNotify>{ type: 'notify', content: 'quite warm' }];
      Simulate.query(test.env, { results: results });
      expect(test.cmp.notifications).toEqual(['quite warm']);
    });

    it('should reset the notifications with each request', function() {
      results.triggers = [<ITriggerNotify>{ type: 'notify', content: 'quite warm' }];
      Simulate.query(test.env, { results: results });
      expect(test.cmp.notifications).toEqual(['quite warm']);

      results.triggers = [<ITriggerNotify>{ type: 'notify', content: 'a tad cold' }];
      Simulate.query(test.env, { results: results });
      expect(test.cmp.notifications).toEqual(['a tad cold']);

      results.triggers = [];
      Simulate.query(test.env, { results: results });
      expect(test.cmp.notifications).toEqual([]);
    });

    it("should handle multiple 'notify's properly", function() {
      results.triggers = [
        <ITriggerNotify>{ type: 'notify', content: 'foo' },
        <ITriggerNotify>{ type: 'notify', content: 'bar' },
        <ITriggerNotify>{ type: 'notify', content: '2000' }
      ];
      Simulate.query(test.env, { results: results });
      expect(test.cmp.notifications).toEqual(['foo', 'bar', '2000']);
    });

    it("should execute an 'execute' trigger", function() {
      var funcSpy = jasmine.createSpy('customFunc');
      test.cmp._window['customFunc'] = funcSpy;

      var errorSpy = jasmine.createSpy('error');
      test.cmp.logger.error = errorSpy;

      results.triggers = [<ITriggerExecute>{ type: 'execute', content: { name: 'customFunc', params: [123, 'foo', false] } }];
      Simulate.query(test.env, { results: results });

      expect(funcSpy).toHaveBeenCalledWith({
        param1: 123,
        param2: 'foo',
        param3: false,
        element: test.env.element
      });
      expect(funcSpy.calls.count()).toBe(1);
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it("should handle an 'execute' trigger when function doesn't exist", function() {
      var errSpy = jasmine.createSpy('errSpy');
      test.cmp.logger.error = errSpy;

      results.triggers = [<ITriggerExecute>{ type: 'execute', content: { name: 'foobarFunc', params: ['foobarde', 123] } }];
      Simulate.query(test.env, { results: results });
      expect(errSpy.calls.count()).toBe(1);
    });

    it("should handle an 'execute' trigger when function throws exception", function() {
      var errorSpy = jasmine.createSpy('error');
      test.cmp._window['bombFunc'] = params => {
        throw '💣';
      };

      test.cmp.logger.error = errorSpy;

      results.triggers = [<ITriggerExecute>{ type: 'execute', content: { name: 'bombFunc', params: [] } }];
      Simulate.query(test.env, { results: results });
      expect(errorSpy.calls.count()).toBe(1);
    });

    it("should handle a 'redirect' trigger properly", function() {
      results.triggers = [<ITriggerRedirect>{ type: 'redirect', content: 'http://www.coveo.com' }];
      Simulate.query(test.env, { results: results });
      expect(test.cmp._window.location.href).toBe('http://www.coveo.com');
    });

    it("should handle a 'query' trigger properly", function() {
      var qsmSpy = jasmine.createSpy('qsm');
      var qcSpy = jasmine.createSpy('qc');

      test.cmp.queryStateModel.set = qsmSpy;
      test.cmp.queryController.executeQuery = qcSpy;

      results.triggers = [<ITriggerQuery>{ type: 'query', content: '@name=foobar2000' }];
      Simulate.query(test.env, { results: results });
      expect(qsmSpy).toHaveBeenCalledWith(QueryStateModel.attributesEnum.q, '@name=foobar2000');
      expect(qcSpy.calls.count()).toBe(1);
    });

    describe('should log a custom analytics event', function() {
      var analyticsSpy;
      beforeEach(function() {
        analyticsSpy = jasmine.createSpy('analytics');
        test.cmp.usageAnalytics.logCustomEvent = analyticsSpy;
      });

      it("for a 'redirect' trigger", function() {
        results.triggers = [<ITriggerRedirect>{ type: 'redirect', content: 'http://www.coveo.com' }];
        Simulate.query(test.env, { results: results });
        expect(analyticsSpy).toHaveBeenCalledWith(
          analyticsActionCauseList.triggerRedirect,
          {
            redirectedTo: 'http://www.coveo.com'
          },
          test.cmp.element
        );
      });

      it("for an 'execute' trigger", function() {
        test.cmp._window['doSomething'] = () => null;
        results.triggers = [<ITriggerExecute>{ type: 'execute', content: { name: 'doSomething' } }];
        Simulate.query(test.env, { results: results });
        expect(analyticsSpy).toHaveBeenCalledWith(
          analyticsActionCauseList.triggerExecute,
          {
            executed: 'doSomething'
          },
          test.cmp.element
        );
      });

      it("for a 'notify' trigger", function() {
        results.triggers = [<ITriggerNotify>{ type: 'notify', content: 'hello there' }];
        Simulate.query(test.env, { results: results });
        expect(analyticsSpy).toHaveBeenCalledWith(
          analyticsActionCauseList.triggerNotify,
          {
            notification: 'hello there'
          },
          test.cmp.element
        );
      });

      it("for a 'query' trigger", function() {
        results.triggers = [<ITriggerQuery>{ type: 'query', content: '@title=foo' }];
        test.cmp.queryController.executeQuery = arg => {
          arg.beforeExecuteQuery();
          return new Promise<IQueryResults>(() => {});
        };
        Simulate.query(test.env, { results: results });
        expect(analyticsSpy).toHaveBeenCalledWith(
          analyticsActionCauseList.triggerQuery,
          {
            query: '@title=foo'
          },
          test.cmp.element
        );
      });
    });
  });
}
