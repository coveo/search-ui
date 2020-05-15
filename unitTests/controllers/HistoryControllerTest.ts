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
      historyController.setHashValues({});
      expect(historyController.window.history.pushState).toHaveBeenCalledWith('', '', '');
    });

    it(`when calling #setHashValues to update the hash,
    it includes the current location.pathname and location.search in the new url`, () => {
      const location = historyController.window.location;
      location.pathname = '/sports';
      location.search = '?type=basketball';
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
      $$(historyController.element).trigger(InitializationEvents.restoreHistoryState);
      expect(historyController.window.location.replace).not.toHaveBeenCalled();
    });

    it('should not update the model hen simply replacing the state from an old value', () => {
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
          historyController = new HistoryController(env.root, window, env.queryStateModel, env.queryController);
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
