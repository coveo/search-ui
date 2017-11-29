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

export function HistoryControllerTest() {
  describe('HistoryController', () => {
    let historyController: HistoryController;
    let env: Mock.IMockEnvironment;

    beforeEach(() => {
      env = new Mock.MockEnvironmentBuilder().withLiveQueryStateModel().build();
      historyController = new HistoryController(env.root, {
        model: env.queryStateModel,
        queryController: env.queryController,
        usageAnalytics: env.usageAnalytics,
        window: Mock.mockWindow()
      });
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

      $$(historyController.element).trigger('state:all');
      Defer.flush();
      expect(historyController.window.location.hash).toBe('#c=notDefault&d=[1,2,3]');
    });

    it('should listen to hashchange event', () => {
      expect(historyController.window.addEventListener).toHaveBeenCalledWith('hashchange', jasmine.any(Function));
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

        $$(env.root).trigger(InitializationEvents.restoreHistoryState);

        expect(historyController.hashUtils.getValue).toHaveBeenCalledTimes(_.size(env.queryStateModel.attributes));
      });

      describe('when logging analytics event', () => {
        beforeEach(() => {
          historyController = new HistoryController(env.root, {
            model: env.queryStateModel,
            queryController: env.queryController,
            usageAnalytics: env.usageAnalytics,
            window: window
          });
          historyController.hashUtils = fakeHashUtils;
          $$(historyController.element).trigger(InitializationEvents.restoreHistoryState);
        });

        afterEach(() => {
          window.location.hash = '';
        });

        const simulateHashModule = (key, value) => {
          historyController.hashUtils.getValue = jasmine.createSpy('getValue').and.callFake((valueNeeded: string) => {
            if (valueNeeded == key) {
              return value;
            }
            return undefined;
          });
        };

        const assertFacetAnalyticsCall = (cause: IAnalyticsActionCause) => {
          expect(historyController.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(cause, {
            facetId: '@foo',
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
          historyController.model.registerNewAttribute('f:@foo', []);
          simulateHashModule('f:@foo', ['bar']);
          window.dispatchEvent(new Event('hashchange'));
          assertFacetAnalyticsCall(analyticsActionCauseList.facetSelect);
        });

        it('should log an analytics event when a facet changes to deselect a value', () => {
          historyController.model.registerNewAttribute('f:@foo', []);
          simulateHashModule('f:@foo', ['bar']);
          window.dispatchEvent(new Event('hashchange'));
          simulateHashModule('f:@foo', []);
          window.dispatchEvent(new Event('hashchange'));
          assertFacetAnalyticsCall(analyticsActionCauseList.facetDeselect);
        });

        it('should log an analytics event when a facet changes to exclude a value', () => {
          historyController.model.registerNewAttribute('f:@foo:not', []);
          simulateHashModule('f:@foo:not', ['bar']);
          window.dispatchEvent(new Event('hashchange'));
          assertFacetAnalyticsCall(analyticsActionCauseList.facetExclude);
        });

        it('should log an analytics event when a facet changes to unexclude a value', () => {
          historyController.model.registerNewAttribute('f:@foo:not', []);
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
