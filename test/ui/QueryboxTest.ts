import * as Mock from '../MockEnvironment';
import { Querybox } from '../../src/ui/Querybox/Querybox';
import { registerCustomMatcher } from '../CustomMatchers';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';
import { StandaloneSearchInterfaceEvents } from '../../src/events/StandaloneSearchInterfaceEvents';
import { IQueryboxOptions } from '../../src/ui/Querybox/Querybox';

export function QueryboxTest() {
  describe('Querybox', () => {
    var test: Mock.IBasicComponentSetup<Querybox>;

    beforeEach(function() {
      test = Mock.basicComponentSetup<Querybox>(Querybox);
      this.input = test.env.element.querySelector('input');
      registerCustomMatcher();
    });

    afterEach(function() {
      test = null;
    });

    it('will trigger a query on submit', function() {
      test.cmp.submit();
      expect(test.env.queryController.executeQuery).toHaveBeenCalled();
    });

    it('will log the proper analytics event on submit', function() {
      test.cmp.submit();
      expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.searchboxSubmit, {});
    });

    it('will not trigger a query on submit if the content has not changed', function() {
      test.cmp.submit();
      test.cmp.submit();
      test.cmp.submit();
      test.cmp.submit();
      expect(test.env.queryController.executeQuery).toHaveBeenCalledTimes(1);
    });

    it('will trigger a new query if the content change', function() {
      test.cmp.submit();
      test.cmp.submit();
      test.cmp.setText('Batman');
      test.cmp.submit();
      test.cmp.submit();
      test.cmp.setText('Spiderman');
      test.cmp.submit();
      test.cmp.submit();
      expect(test.env.queryController.executeQuery).toHaveBeenCalledTimes(3);
    });

    it('will set the content of the input in the query', function() {
      test.cmp.setText('Batman');
      var simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.build().q).toEqual('Batman');
    });

    it('will change the state on building query', function() {
      test.cmp.setText('Batman');
      Simulate.query(test.env);
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('q', 'Batman');
    });

    it('will change the state when the content change on blur', function() {
      test.cmp.setText('Batman');
      test.cmp.magicBox.onblur();
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('q', 'Batman');
    });

    it('will change the state if the content is cleared', function() {
      test.cmp.setText('Batman');
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('q', 'Batman');
      test.cmp.setText('');
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('q', '');

      test.cmp.setText('Batman');
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('q', 'Batman');
      test.cmp.magicBox.clear();
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('q', '');
    });

    it('will return correctly on getResult', function() {
      test.cmp.setText('Batman');
      expect(test.cmp.getResult().input).toBe('Batman');
    });

    it('will return correctly on getDisplayedResult', function() {
      test.cmp.setText('Batman');
      expect(test.cmp.getDisplayedResult().input).toBe('Batman');
    });

    it('will return correctly on getCursor', function() {
      test.cmp.setText('Batman');
      expect(test.cmp.getCursor()).toBe(6);

      test.cmp.setText('');
      expect(test.cmp.getCursor()).toBe(0);
    });

    it('will return correctly on resultAtCursor', function() {
      test.cmp.setText('Batman');
      expect(test.cmp.resultAtCursor().length).toBe(1);
      expect(test.cmp.resultAtCursor()[0].input).toBe('Batman');
    });

    it('will update state before redirecting', function() {
      test.cmp.setText('Batman');
      $$(test.env.root).trigger(StandaloneSearchInterfaceEvents.beforeRedirect);
      expect(test.env.queryStateModel.set).toHaveBeenCalledWith('q', 'Batman');
    });

    describe('using a live query state model', function() {
      beforeEach(function() {
        test = Mock.advancedComponentSetup<Querybox>(
          Querybox,
          new Mock.AdvancedComponentSetupOptions(undefined, undefined, (env: Mock.MockEnvironmentBuilder) => {
            return env.withLiveQueryStateModel();
          })
        );
      });

      it('will change the content of the search box if the model change', function() {
        expect(test.cmp.getText()).toBe('');
        test.env.queryStateModel.set('q', 'Batman is better then Spiderman');
        expect(test.cmp.getText()).toBe('Batman is better then Spiderman');
      });
    });

    describe('exposes options', function() {
      it('enableSearchAsYouType will trigger a query after a delay', function(done) {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enableSearchAsYouType: true
        });
        expect(test.cmp.magicBox.onchange).toBeDefined();
        test.cmp.magicBox.onchange();
        setTimeout(() => {
          expect(test.env.queryController.executeQuery).toHaveBeenCalled();
          done();
        }, test.cmp.options.searchAsYouTypeDelay);
      });

      it('enableSearchAsYouType to false will not trigger a query after a delay', function() {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enableSearchAsYouType: false
        });
        expect(test.cmp.magicBox.onchange).not.toBeDefined();
      });

      it('enableSearchAsYouType will log the proper analytics event', function(done) {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enableSearchAsYouType: true
        });
        expect(test.cmp.magicBox.onchange).toBeDefined();
        test.cmp.magicBox.onchange();
        setTimeout(() => {
          expect(test.env.usageAnalytics.logSearchAsYouType).toHaveBeenCalledWith(analyticsActionCauseList.searchboxAsYouType, {});

          done();
        }, test.cmp.options.searchAsYouTypeDelay);
      });

      it('enableSearchAsYouTypeDelay influences the delay before a query', function(done) {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enableSearchAsYouType: true,
          searchAsYouTypeDelay: 5
        });
        expect(test.cmp.magicBox.onchange).toBeDefined();
        test.cmp.magicBox.onchange();
        setTimeout(() => {
          expect(test.env.queryController.executeQuery).not.toHaveBeenCalled();
        }, 1);
        setTimeout(() => {
          expect(test.env.queryController.executeQuery).toHaveBeenCalled();
          done();
        }, 10);
      });

      it('enableQuerySyntax should modify the enableQuerySyntax parameter', function() {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enableQuerySyntax: false
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableQuerySyntax).toBe(false);

        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enableQuerySyntax: true
        });
        test.cmp.setText('@field==Batman');

        simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableQuerySyntax).toBe(true);
      });

      it('enableWildcards shoud modify the query builder', function() {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enableWildcards: false
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().wildcards).toBeFalsy();

        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enableWildcards: true
        });

        simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().wildcards).toBe(true);
      });

      it('enableQuestionMarks should modify the query builder', function() {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enableQuestionMarks: false
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().questionMark).toBeFalsy();

        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enableQuestionMarks: true
        });

        simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().questionMark).toBe(true);
      });

      it('enableLowercaseOperators should modify the query builder', function() {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enableLowercaseOperators: false
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().lowercaseOperators).toBeFalsy();

        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enableLowercaseOperators: true
        });

        simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().lowercaseOperators).toBe(true);
      });

      it('enablePartialMatch should modify the query builder', function() {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enablePartialMatch: false
        });
        test.cmp.setText('Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().partialMatch).toBeFalsy();

        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enablePartialMatch: true
        });
        test.cmp.setText('Batman');

        simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().partialMatch).toBe(true);
      });

      it('enablePartialMatch should not modify the query builder if there is no content in the input', function() {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          enablePartialMatch: true
        });
        test.cmp.setText('');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().partialMatch).toBeUndefined();
      });

      it('partialMatchKeywords should modify the query builder', function() {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          partialMatchKeywords: 999,
          enablePartialMatch: true
        });
        test.cmp.setText('Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().partialMatchKeywords).toBe(999);
      });

      it('partialMatchKeywords should not modify the query builder if there is no content in the input', function() {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          partialMatchKeywords: 999,
          enablePartialMatch: true
        });
        test.cmp.setText('');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().partialMatchKeywords).toBeUndefined();
      });

      it('partialMatchKeywords should not modify the query builder if enablePartialMatch is disabled', function() {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          partialMatchKeywords: 999,
          enablePartialMatch: false
        });
        test.cmp.setText('Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().partialMatchKeywords).toBeUndefined();
      });

      it('triggerQueryOnClear should trigger a query on clear', () => {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          triggerQueryOnClear: true
        });
        test.cmp.magicBox.clear();
        expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
      });

      it('triggerQueryOnClear should not trigger a query on clear if false', () => {
        test = Mock.optionsComponentSetup<Querybox, IQueryboxOptions>(Querybox, {
          triggerQueryOnClear: false
        });
        test.cmp.magicBox.clear();
        expect(test.cmp.queryController.executeQuery).not.toHaveBeenCalled();
      });
    });
  });
}
