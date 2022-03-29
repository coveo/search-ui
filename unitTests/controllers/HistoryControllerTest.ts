import { HistoryController } from '../../src/controllers/HistoryController';
import { InitializationEvents } from '../../src/events/InitializationEvents';
import * as Mock from '../MockEnvironment';
import { $$ } from '../../src/utils/Dom';
import { Defer } from '../../src/misc/Defer';
import _ = require('underscore');
import {
  analyticsActionCauseList,
  IAnalyticsResultsSortMeta,
  IAnalyticsFacetMeta,
  IAnalyticsActionCause
} from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { QueryEvents } from '../../src/Core';

export function HistoryControllerTest() {
  describe('HistoryController', () => {
    let historyController: HistoryController;
    let env: Mock.IMockEnvironment;

    function triggerRestoreHistoryEvent() {
      $$(historyController.element).trigger(InitializationEvents.restoreHistoryState);
    }

    function triggerFirstQuery() {
      $$(historyController.element).trigger(QueryEvents.querySuccess);
    }

    beforeEach(() => {
      env = new Mock.MockEnvironmentBuilder().withLiveQueryStateModel().build();
      historyController = new HistoryController(env.root, Mock.mockWindow(), env.queryStateModel, env.queryController);
      spyOn(historyController, 'usageAnalytics').and.returnValue(env.usageAnalytics);
    });

    afterEach(() => {
      historyController = null;
      env = null;
    });

    it('should set the query state model representation on all event in the hash', () => {
      env.queryStateModel.attributes = {
        a: 'a',
        b: 'b',
        c: 'notDefault',
        d: [1, 2, 3]
      };

      env.queryStateModel.defaultAttributes = {
        a: 'a',
        b: 'b',
        c: 'c',
        d: [2, 3, 4]
      };

      triggerFirstQuery();
      $$(historyController.element).trigger('state:all');
      Defer.flush();
      expect(historyController.window.history.pushState).toHaveBeenCalledWith('', '', '#c=notDefault&d=[1,2,3]');
    });

    it('should listen to hashchange event', () => {
      expect(historyController.window.addEventListener).toHaveBeenCalledWith('hashchange', jasmine.any(Function));
    });

    it(`given at least one value in the hash, when calling #setHashValues with an empty object,
    it updates the url without including a hash to prevent the page from scrolling to the top`, () => {
      historyController.window.location.hash = '#f:@author=[TED]';
      triggerFirstQuery();
      historyController.setHashValues({});
      expect(historyController.window.history.pushState).toHaveBeenCalledWith('', '', '');
    });

    it(`when calling #setHashValues to update the hash,
    it includes the current location.pathname and location.search in the new url`, () => {
      const location = historyController.window.location;
      location.pathname = '/sports';
      location.search = '?type=basketball';
      triggerFirstQuery();
      historyController.setHashValues({ q: 'shoes' });

      const expectedUrl = `${location.pathname}${location.search}#q=shoes`;
      expect(historyController.window.history.pushState).toHaveBeenCalledWith('', '', expectedUrl);
    });

    it('should not throw when history controller does not have an analytics client and there is a hash change', () => {
      historyController = new HistoryController(env.root, Mock.mockWindow(), env.queryStateModel, env.queryController);
      historyController.setHashValues({ q: 'test' });
      expect(historyController.handleHashChange.bind(historyController)).not.toThrow();
    });

    it('should not set the hash when it has not changed on the first hash change', () => {
      triggerRestoreHistoryEvent();
      triggerFirstQuery();
      expect(historyController.window.location.replace).not.toHaveBeenCalled();
    });

    it('After the first query, when calling #setHashUtils, it pushes a new history entry instead of replacing state', () => {
      triggerFirstQuery();
      historyController.setHashValues({ q: 'hello' });

      expect(historyController.window.location.replace).not.toHaveBeenCalled();
      expect(historyController.window.history.pushState).toHaveBeenCalledWith('', '', '#q=hello');
    });

    it('should not update the model when simply replacing the state from an old value', () => {
      historyController = new HistoryController(env.root, Mock.mockWindow(), env.queryStateModel, env.queryController);
      spyOn(env.queryStateModel, 'setMultiple');
      historyController.replaceState({ q: 'bar' });
      expect(env.queryStateModel.setMultiple).not.toHaveBeenCalled();
    });

    describe('with a fake HashUtilsModule', () => {
      let fakeHashUtils;
      beforeEach(() => {
        fakeHashUtils = {} as any;
        fakeHashUtils.getValue = jasmine.createSpy('getValue');
        fakeHashUtils.getHash = jasmine.createSpy('getHash').and.callFake(() => Mock.mockWindow().location.hash);
        fakeHashUtils.encodeValues = jasmine.createSpy('encodeValues');
        historyController.hashUtils = fakeHashUtils;
      });

      function simulateHashModule(key, value) {
        historyController.hashUtils.getValue = jasmine.createSpy('getValue').and.callFake((valueNeeded: string) => {
          if (valueNeeded == key) {
            return value;
          }
          return undefined;
        });
      }

      it(`when comparing a hash and a query state model's non-string value
      when the value is different
      should execute a query`, () => {
        simulateHashModule('debug', 'false');
        historyController.queryStateModel.set('debug', true);
        historyController.handleHashChange();
        expect(historyController.queryController.executeQuery).toHaveBeenCalled();
      });

      it(`when comparing a hash and a query state model's non-string value
      when the value is identical but of different types (e.g., string vs boolean)
      should not execute a query`, () => {
        simulateHashModule('debug', 'true');
        historyController.queryStateModel.set('debug', true);
        historyController.handleHashChange();
        expect(historyController.queryController.executeQuery).not.toHaveBeenCalled();
      });

      it('keeps parsing hash values after one fails to parse', () => {
        let threwError = false;
        env.queryStateModel.attributes = {
          a: 1,
          b: 2,
          c: 3
        };

        const throwsAnError = () => {
          if (!threwError) {
            threwError = true;
            throw new Error();
          }
        };

        historyController.hashUtils.getValue = jasmine.createSpy('getValue').and.callFake(throwsAnError);
        triggerRestoreHistoryEvent();

        expect(historyController.hashUtils.getValue).toHaveBeenCalledTimes(_.size(env.queryStateModel.attributes));
      });

      describe('when logging analytics event', () => {
        beforeEach(() => {
          historyController = new HistoryController(env.root, window, env.queryStateModel, env.queryController);
          historyController.hashUtils = fakeHashUtils;
          triggerRestoreHistoryEvent();
        });

        afterEach(() => {
          window.location.hash = '';
        });

        const assertFacetAnalyticsCall = (cause: IAnalyticsActionCause) => {
          expect(historyController.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(cause, {
            facetId: '@foo',
            facetField: '@foo',
            facetTitle: '@foo',
            facetValue: 'bar'
          } as IAnalyticsFacetMeta);
        };

        it('should log an analytics event when q changes', () => {
          simulateHashModule('q', 'foo');
          window.dispatchEvent(new Event('hashchange'));
          expect(historyController.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.searchboxSubmit, {});
        });

        it('should log an analytics event when sort changes', () => {
          simulateHashModule('sort', 'date ascending');
          window.dispatchEvent(new Event('hashchange'));
          expect(historyController.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.resultsSort, {
            resultsSortBy: 'date ascending'
          } as IAnalyticsResultsSortMeta);
        });

        it('should log an analytics event when a facet changes to select a value', () => {
          historyController.queryStateModel.registerNewAttribute('f:@foo', []);
          simulateHashModule('f:@foo', ['bar']);
          window.dispatchEvent(new Event('hashchange'));
          assertFacetAnalyticsCall(analyticsActionCauseList.facetSelect);
        });

        it('should log an analytics event when a facet changes to deselect a value', () => {
          historyController.queryStateModel.registerNewAttribute('f:@foo', []);
          simulateHashModule('f:@foo', ['bar']);
          window.dispatchEvent(new Event('hashchange'));
          simulateHashModule('f:@foo', []);
          window.dispatchEvent(new Event('hashchange'));
          assertFacetAnalyticsCall(analyticsActionCauseList.facetDeselect);
        });

        it('should log an analytics event when a facet changes to exclude a value', () => {
          historyController.queryStateModel.registerNewAttribute('f:@foo:not', []);
          simulateHashModule('f:@foo:not', ['bar']);
          window.dispatchEvent(new Event('hashchange'));
          assertFacetAnalyticsCall(analyticsActionCauseList.facetExclude);
        });

        it('should log an analytics event when a facet changes to unexclude a value', () => {
          historyController.queryStateModel.registerNewAttribute('f:@foo:not', []);
          simulateHashModule('f:@foo:not', ['bar']);
          window.dispatchEvent(new Event('hashchange'));
          simulateHashModule('f:@foo:not', []);
          window.dispatchEvent(new Event('hashchange'));
          assertFacetAnalyticsCall(analyticsActionCauseList.facetUnexclude);
        });
      });
    });
  });
}
