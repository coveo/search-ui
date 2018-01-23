import * as Mock from '../MockEnvironment';
import { AnalyticsSuggestions } from '../../src/ui/AnalyticsSuggestions/AnalyticsSuggestions';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { IAnalyticsSuggestionsOptions } from '../../src/ui/AnalyticsSuggestions/AnalyticsSuggestions';
import _ = require('underscore');

export function AnalyticsSuggestionsTest() {
  describe('AnalyticsSuggestions', () => {
    let test: Mock.IBasicComponentSetup<AnalyticsSuggestions>;

    beforeEach(() => {
      // In phantom js there is a bug with CustomEvent('click'), which is needed to for those tests.
      // So, use jquery for event in phantom js
      if (Simulate.isPhantomJs()) {
        Simulate.addJQuery();
      }

      test = Mock.basicComponentSetup<AnalyticsSuggestions>(AnalyticsSuggestions);
    });

    afterEach(() => {
      test = null;
      Simulate.removeJQuery();
    });

    it('should trigger a call to get top query from the analytics', () => {
      Simulate.omnibox(test.env);
      expect(test.env.usageAnalytics.getTopQueries).toHaveBeenCalled();
    });

    it('should populate omnibox with returned data from analytics', done => {
      test.env.usageAnalytics.getTopQueries = jasmine.createSpy('topQuery');
      (<jasmine.Spy>test.env.usageAnalytics.getTopQueries).and.returnValue(
        new Promise(resolve => {
          resolve(['foo', 'bar', 'baz']);
        })
      );

      var simulation = Simulate.omnibox(test.env);
      simulation.rows[0].deferred.then(elementResolved => {
        expect(simulation.rows.length).toBe(1);
        expect($$(elementResolved.element).text()).toEqual(jasmine.stringMatching('foo'));
        expect($$(elementResolved.element).text()).toEqual(jasmine.stringMatching('bar'));
        expect($$(elementResolved.element).text()).toEqual(jasmine.stringMatching('baz'));
        done();
      });
    });

    it('should log analytics event when selecting a suggestion', done => {
      test.env.usageAnalytics.getTopQueries = jasmine.createSpy('topQuery');
      (<jasmine.Spy>test.env.usageAnalytics.getTopQueries).and.returnValue(
        new Promise(resolve => {
          resolve(['foo', 'bar', 'baz']);
        })
      );
      var simulation = Simulate.omnibox(test.env);
      simulation.rows[0].deferred.then(elementResolved => {
        test.cmp.selectSuggestion(0);
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.omniboxAnalytics,
          jasmine.objectContaining({ suggestionRanking: 0 })
        );

        test.cmp.selectSuggestion('baz');
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.omniboxAnalytics,
          jasmine.objectContaining({ suggestionRanking: 2 })
        );
        done();
      });
    });

    it('should log partial queries in analytics', done => {
      test.env.usageAnalytics.getTopQueries = jasmine.createSpy('topQuery');
      (<jasmine.Spy>test.env.usageAnalytics.getTopQueries).and.returnValue(
        new Promise(resolve => {
          resolve(['foo', 'bar', 'baz']);
        })
      );
      Simulate.omnibox(test.env, {
        completeQueryExpression: {
          word: 't',
          regex: /t/
        }
      });
      Simulate.omnibox(test.env, {
        completeQueryExpression: {
          word: 'tes',
          regex: /tes/
        }
      });
      var simulation = Simulate.omnibox(test.env, {
        completeQueryExpression: {
          word: 'test',
          regex: /test/
        }
      });
      simulation.rows[0].deferred.then(elementResolved => {
        test.cmp.selectSuggestion(0);
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.omniboxAnalytics,
          jasmine.objectContaining({ partialQueries: 't;tes;test' })
        );
        done();
      });
    });

    it('should skip similar consecutive partial queries', done => {
      test.env.usageAnalytics.getTopQueries = jasmine.createSpy('topQuery');
      (<jasmine.Spy>test.env.usageAnalytics.getTopQueries).and.returnValue(
        new Promise(resolve => {
          resolve(['foo', 'bar', 'baz']);
        })
      );
      Simulate.omnibox(test.env, {
        completeQueryExpression: {
          word: 't',
          regex: /t/
        }
      });
      Simulate.omnibox(test.env, {
        completeQueryExpression: {
          word: 't',
          regex: /t/
        }
      });
      var simulation = Simulate.omnibox(test.env, {
        completeQueryExpression: {
          word: 't',
          regex: /t/
        }
      });
      simulation.rows[0].deferred.then(elementResolved => {
        test.cmp.selectSuggestion(0);
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.omniboxAnalytics,
          jasmine.objectContaining({ partialQueries: 't' })
        );
        done();
      });
    });

    it('should clean the ; char in partial queries', done => {
      test.env.usageAnalytics.getTopQueries = jasmine.createSpy('topQuery');
      (<jasmine.Spy>test.env.usageAnalytics.getTopQueries).and.returnValue(
        new Promise(resolve => {
          resolve(['foo', 'bar', 'baz']);
        })
      );
      var simulation = Simulate.omnibox(test.env, {
        completeQueryExpression: {
          word: 't;',
          regex: /t;/
        }
      });
      simulation.rows[0].deferred.then(elementResolved => {
        test.cmp.selectSuggestion(0);
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.omniboxAnalytics,
          jasmine.objectContaining({ partialQueries: 't' })
        );
        done();
      });
    });

    it('should strip very long partial queries to stay under 256 char', done => {
      test.env.usageAnalytics.getTopQueries = jasmine.createSpy('topQuery');
      (<jasmine.Spy>test.env.usageAnalytics.getTopQueries).and.returnValue(
        new Promise(resolve => {
          resolve(['foo', 'bar', 'baz']);
        })
      );
      var simulation = Simulate.omnibox(test.env, {
        completeQueryExpression: {
          word: _.range(0, 500).join(''),
          regex: /t;/
        }
      });
      simulation.rows[0].deferred.then(elementResolved => {
        test.cmp.selectSuggestion(0);
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.omniboxAnalytics, jasmine.anything());
        done();
      });
    });

    describe('exposes options', () => {
      it('omniboxZIndex should be taken into account', done => {
        test = Mock.optionsComponentSetup<AnalyticsSuggestions, IAnalyticsSuggestionsOptions>(AnalyticsSuggestions, {
          omniboxZIndex: 333
        });
        test.env.usageAnalytics.getTopQueries = jasmine.createSpy('topQuery');
        (<jasmine.Spy>test.env.usageAnalytics.getTopQueries).and.returnValue(
          new Promise(resolve => {
            resolve(['foo', 'bar', 'baz']);
          })
        );
        let simulation = Simulate.omnibox(test.env, {
          completeQueryExpression: {
            word: _.range(0, 500).join(''),
            regex: /t;/
          }
        });
        simulation.rows[0].deferred.then(elementResolved => {
          expect(elementResolved.zIndex).toBe(333);
          done();
        });
      });

      it('numberOfSuggestions should be taken into account', () => {
        test = Mock.optionsComponentSetup<AnalyticsSuggestions, IAnalyticsSuggestionsOptions>(AnalyticsSuggestions, {
          numberOfSuggestions: 333
        });
        Simulate.omnibox(test.env);
        expect(test.env.usageAnalytics.getTopQueries).toHaveBeenCalledWith(jasmine.objectContaining({ pageSize: 333 }));
      });
    });
  });
}
