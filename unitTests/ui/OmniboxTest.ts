import * as Mock from '../MockEnvironment';
import { Omnibox } from '../../src/ui/Omnibox/Omnibox';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { IOmniboxOptions, IOmniboxSuggestion } from '../../src/ui/Omnibox/Omnibox';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';
import { l } from '../../src/strings/Strings';
import { InitializationEvents } from '../../src/events/InitializationEvents';
import { IFieldDescription } from '../../src/rest/FieldDescription';
import { Suggestion } from '../../src/magicbox/SuggestionsManager';
import { KEYBOARD, OmniboxEvents, BreadcrumbEvents, QueryEvents } from '../../src/Core';
import { IQueryOptions } from '../../src/controllers/QueryController';
import { IOmniboxAnalytics } from '../../src/ui/Omnibox/OmniboxAnalytics';
import { initOmniboxAnalyticsMock } from './QuerySuggestPreviewTest';

export function OmniboxTest() {
  describe('Omnibox', () => {
    let test: Mock.IBasicComponentSetup<Omnibox>;
    let testEnv: Mock.MockEnvironmentBuilder;
    let omniboxAnalytics: IOmniboxAnalytics;
    beforeEach(() => {
      // Thanks phantom js for bad native event support
      if (Simulate.isPhantomJs()) {
        Simulate.addJQuery();
      }
      setupEnv();
      test = Mock.advancedComponentSetup<Omnibox>(Omnibox, new Mock.AdvancedComponentSetupOptions(null, {}, env => testEnv));
      $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);
    });

    afterEach(() => {
      test = null;
      Simulate.removeJQuery();
    });

    function setupEnv() {
      testEnv = new Mock.MockEnvironmentBuilder();
      omniboxAnalytics = initOmniboxAnalyticsMock(omniboxAnalytics);
      testEnv.searchInterface.getOmniboxAnalytics = jasmine.createSpy('omniboxAnalytics').and.returnValue(omniboxAnalytics) as any;
    }

    function initOmnibox(options: IOmniboxOptions) {
      setupEnv();
      test = Mock.advancedComponentSetup<Omnibox>(
        Omnibox,
        new Mock.AdvancedComponentSetupOptions($$('div').el, options, env => {
          return testEnv;
        })
      );
    }

    describe('on submit', () => {
      beforeEach(() => test.cmp.submit());

      it('should trigger a query', () => {
        expect(test.env.queryController.executeQuery).toHaveBeenCalled();
      });

      it(`the query #cancel arg is set to 'false'`, () => {
        expect(test.env.queryController.executeQuery).toHaveBeenCalledWith(jasmine.objectContaining({ cancel: false }));
      });

      it('should log analytics event', () => {
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.searchboxSubmit, {});
      });
    });

    describe(`when the magicbox text is equal to the #lastQuery property,
    when calling #submit a second time`, () => {
      beforeEach(() => {
        test.cmp.submit();
        test.cmp.submit();
      });

      it('triggers a query', () => {
        expect(test.env.queryController.executeQuery).toHaveBeenCalledTimes(2);
      });

      it('should not log a second analytics event', () => {
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledTimes(1);
      });

      it(`the query #cancel arg is set to 'true'`, () => {
        const executeQuery = test.env.queryController.executeQuery as jasmine.Spy;
        const lastQuery: IQueryOptions = executeQuery.calls.mostRecent().args[0];
        expect(lastQuery.cancel).toBe(true);
      });
    });

    describe('exposes options', () => {
      it('inline should be passed down to magic box', () => {
        initOmnibox({
          inline: true
        });
        expect(test.cmp.magicBox.options.inline).toBe(true);
        initOmnibox({
          inline: false
        });
        expect(test.cmp.magicBox.options.inline).toBe(false);
      });

      it('enableSearchAsYouType should allow to to trigger a query after a delay', function(done) {
        initOmnibox({
          enableSearchAsYouType: true,
          enableQuerySuggestAddon: false
        });
        expect(test.cmp.magicBox.onchange).toBeDefined();
        test.cmp.setText('foobar');
        test.cmp.magicBox.onchange();
        setTimeout(() => {
          expect(test.env.queryController.executeQuery).toHaveBeenCalled();
          done();
        }, test.cmp.options.searchAsYouTypeDelay);
      });

      it('enableQuerySyntax to false should add the correct class on the element', () => {
        initOmnibox({
          enableQuerySyntax: false
        });

        expect($$(test.cmp.element).hasClass('coveo-query-syntax-disabled')).toBeTruthy();
      });

      it('enableQuerySyntax should modify the enableQuerySyntax parameter', function() {
        initOmnibox({
          enableQuerySyntax: false
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableQuerySyntax).toBe(false);

        initOmnibox({
          enableQuerySyntax: true
        });
        test.cmp.setText('@field==Batman');

        simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableQuerySyntax).toBe(true);
      });

      it('enablePartialMatch should modify the enablePartialMatch parameters', () => {
        initOmnibox({
          enablePartialMatch: false
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enablePartialMatch).toBeFalsy();

        initOmnibox({
          enablePartialMatch: true
        });
        test.cmp.setText('@field==Batman');
        simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enablePartialMatch).toBe(true);
      });

      it('partialMatchKeywords should modify the query builder', () => {
        initOmnibox({
          partialMatchKeywords: 123,
          enablePartialMatch: true
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.partialMatchKeywords).toBe(123);
      });

      it('partialMatchThreshold should modify the query builder', () => {
        initOmnibox({
          partialMatchThreshold: '14%',
          enablePartialMatch: true
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.partialMatchThreshold).toBe('14%');
      });

      it('enableWildcards should modify the query builder', () => {
        initOmnibox({
          enableWildcards: true
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableWildcards).toBe(true);
      });

      it('enableQuestionMarks should modify the query builder', () => {
        initOmnibox({
          enableQuestionMarks: true
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableQuestionMarks).toBe(true);
      });

      it('enableQuestionMarks should modify the query builder', () => {
        initOmnibox({
          enableLowercaseOperators: true
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableLowercaseOperators).toBe(true);
      });

      it('enableFieldAddon should create an addon component', () => {
        initOmnibox({
          enableFieldAddon: true
        });

        test.cmp.setText('this is not a field');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.listFields).not.toHaveBeenCalled();

        test.cmp.setText('@thisisafield');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.listFields).toHaveBeenCalled();

        test.cmp.setText('@thisisafield=');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.listFieldValues).toHaveBeenCalled();
      });

      it('minCharForSuggestions should be set', () => {
        initOmnibox({
          querySuggestCharacterThreshold: 5
        });
        expect(test.cmp.options.querySuggestCharacterThreshold).toBe(5);
      });

      describe('with field returned by the API', () => {
        const buildFieldDescription = (fields: string[]) => {
          const fieldsDescription: IFieldDescription[] = [];
          fields.forEach(field => {
            fieldsDescription.push({
              name: field,
              includeInQuery: true,
              groupByField: true
            } as IFieldDescription);
          });
          return fieldsDescription;
        };

        it('enableFieldAddon should filter fields suggestions with the listOfFields option', async done => {
          initOmnibox({
            enableFieldAddon: true,
            listOfFields: ['@secondFieldName']
          });

          test.cmp.setText('@');

          const fieldsDescription = buildFieldDescription(['@firstFieldName', '@secondFieldName']);

          test.env.searchEndpoint.listFields = () => Promise.resolve(fieldsDescription);
          const suggestions = await test.cmp.magicBox.getSuggestions();
          const fieldAddonSuggestion = await suggestions[1];
          expect(fieldAddonSuggestion.length).toEqual(1);
          expect(fieldAddonSuggestion[0].text).toEqual('@secondFieldName');
          done();
        });

        it('enableFieldAddon should always provide suggestions with field leading with @', async done => {
          initOmnibox({
            enableFieldAddon: true
          });

          test.cmp.setText('@');

          const fieldsDescription = buildFieldDescription(['@firstFieldName', '@secondFieldName']);

          test.env.searchEndpoint.listFields = () => Promise.resolve(fieldsDescription);
          const suggestions = await test.cmp.magicBox.getSuggestions();
          const fieldAddonSuggestion = await suggestions[1];
          expect(fieldAddonSuggestion.length).toEqual(2);
          expect(fieldAddonSuggestion[0].text).toEqual('@firstFieldName');
          expect(fieldAddonSuggestion[1].text).toEqual('@secondFieldName');
          done();
        });
      });

      it('listOfFields should show specified fields when field addon is enabled', done => {
        initOmnibox({
          enableFieldAddon: true,
          listOfFields: ['@field', '@another_field']
        });

        test.cmp.setText('@');

        const fieldSuggestion = test.cmp.magicBox.getSuggestions()[1] as Promise<Suggestion[]>;

        fieldSuggestion.then(fields => {
          expect(fields[0].text).toEqual('@field');
          expect(fields[1].text).toEqual('@another_field');
          done();
        });
      });

      it('enableTopQueryAddon should get suggestion', () => {
        let element = $$('div');
        element.addClass('CoveoOmnibox');
        element.setAttribute('data-enable-top-query-addon', 'true');
        test = Mock.advancedComponentSetup<Omnibox>(
          Omnibox,
          new Mock.AdvancedComponentSetupOptions(element.el, null, env => {
            return testEnv;
          })
        );

        test.cmp.setText('foobar');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.getQuerySuggest).toHaveBeenCalled();
      });

      it('enableQuerySuggestAddon should create an addon component', () => {
        initOmnibox({
          enableQuerySuggestAddon: true
        });

        test.cmp.setText('foobar');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.getQuerySuggest).toHaveBeenCalled();
      });

      it('enableQueryExtensionAddon should create an addon component', () => {
        initOmnibox({
          enableQueryExtensionAddon: true
        });

        test.cmp.setText('$');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.extensions).toHaveBeenCalled();
      });

      it('placeholder allow to set a placeholder in the input', () => {
        initOmnibox({
          placeholder: 'trololo'
        });
        expect(test.cmp.getInput().placeholder).toBe('trololo');
      });

      it('placeholder should use translated version', () => {
        initOmnibox({
          placeholder: 'SearchFor'
        });
        expect(test.cmp.getInput().placeholder).toBe(l('SearchFor'));
      });

      it('enableSearchAsYouType + enableQuerySuggestAddon should send correct analytics events', () => {
        initOmnibox({
          enableQuerySuggestAddon: true,
          enableSearchAsYouType: true
        });
        let spy = jasmine.createSpy('spy');
        test.env.searchEndpoint.getQuerySuggest = spy;

        spy.and.returnValue({
          completions: [
            {
              expression: 'a'
            },
            {
              expression: 'b'
            },
            {
              expression: 'c'
            },
            {
              expression: 'd'
            },
            {
              expression: 'e'
            }
          ]
        });

        test.cmp.setText('foobar');
        expect(test.cmp.magicBox.onchange).toBeDefined();
        test.cmp.magicBox.onchange();
        test.cmp.magicBox.onselect(<Suggestion>['a']);
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.omniboxAnalytics,
          jasmine.objectContaining({
            partialQuery: undefined,
            suggestionRanking: jasmine.any(Number),
            partialQueries: ''
          })
        );
      });

      it('triggerQueryOnClear should trigger a query on clear', () => {
        initOmnibox({
          triggerQueryOnClear: true
        });
        test.cmp.magicBox.clear();
        expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
      });

      it('triggerQueryOnClear should not trigger a query on clear if false', () => {
        initOmnibox({
          triggerQueryOnClear: false
        });
        test.cmp.magicBox.clear();
        expect(test.cmp.queryController.executeQuery).not.toHaveBeenCalled();
      });

      it('triggerQueryOnClear should be forced to false if the search interface is configured to not allowQueriesWithoutKeywords', () => {
        const advancedSetup = new Mock.AdvancedComponentSetupOptions(
          null,
          {
            triggerQueryOnClear: true
          },
          env => {
            testEnv.searchInterface.options.allowQueriesWithoutKeywords = false;
            return testEnv;
          }
        );

        test = Mock.advancedComponentSetup<Omnibox>(Omnibox, advancedSetup);
        expect(test.cmp.options.triggerQueryOnClear).toBe(false);
      });

      it('triggerQueryOnClear should be forced to true if configured with search as you type and the search interface allows queries without keywords', () => {
        const advancedSetup = new Mock.AdvancedComponentSetupOptions(
          null,
          {
            triggerQueryOnClear: false,
            enableSearchAsYouType: true
          },
          env => {
            testEnv.searchInterface.options.allowQueriesWithoutKeywords = true;
            return testEnv;
          }
        );

        test = Mock.advancedComponentSetup<Omnibox>(Omnibox, advancedSetup);
        expect(test.cmp.options.triggerQueryOnClear).toBe(true);
      });
    });

    it('should execute query automatically when confidence level is > 0.8 on suggestion', done => {
      initOmnibox({
        enableSearchAsYouType: true,
        enableQuerySuggestAddon: true
      });
      test.cmp.setText('foobar');
      expect(test.cmp.magicBox.onsuggestions).toBeDefined();
      test.cmp.magicBox.onsuggestions(<IOmniboxSuggestion[]>[
        {
          executableConfidence: 1,
          text: 'foobar'
        }
      ]);

      setTimeout(() => {
        expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
        done();
      }, test.cmp.options.searchAsYouTypeDelay);
    });

    it('should execute query automatically when confidence level is = 0.8 on suggestion', done => {
      initOmnibox({
        enableSearchAsYouType: true,
        enableQuerySuggestAddon: true
      });
      test.cmp.setText('foobar');
      expect(test.cmp.magicBox.onsuggestions).toBeDefined();
      test.cmp.magicBox.onsuggestions(<IOmniboxSuggestion[]>[
        {
          executableConfidence: 0.8,
          text: 'foobar'
        }
      ]);

      setTimeout(() => {
        expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
        done();
      }, test.cmp.options.searchAsYouTypeDelay);
    });

    it('should not execute query automatically when confidence level is < 0.8 on suggestion', done => {
      initOmnibox({
        enableSearchAsYouType: true,
        enableQuerySuggestAddon: true
      });
      test.cmp.setText('foobar');
      expect(test.cmp.magicBox.onsuggestions).toBeDefined();
      test.cmp.magicBox.onsuggestions(<IOmniboxSuggestion[]>[
        {
          executableConfidence: 0.7,
          text: 'foobar'
        }
      ]);

      setTimeout(() => {
        expect(test.cmp.queryController.executeQuery).not.toHaveBeenCalled();
        done();
      }, test.cmp.options.searchAsYouTypeDelay);
    });

    it('should execute query automatically when confidence level is not provided and the suggestion does not match the typed text', done => {
      initOmnibox({
        enableSearchAsYouType: true,
        enableQuerySuggestAddon: true
      });
      test.cmp.setText('baz');
      expect(test.cmp.magicBox.onsuggestions).toBeDefined();
      test.cmp.magicBox.onsuggestions(<IOmniboxSuggestion[]>[
        {
          text: 'foobar'
        }
      ]);

      setTimeout(() => {
        expect(test.cmp.queryController.executeQuery).not.toHaveBeenCalled();
        done();
      }, test.cmp.options.searchAsYouTypeDelay);
    });

    it('should not execute query automatically when confidence level is not provided but the suggestion match the typed text', done => {
      initOmnibox({
        enableSearchAsYouType: true,
        enableQuerySuggestAddon: true
      });
      test.cmp.setText('foo');
      expect(test.cmp.magicBox.onsuggestions).toBeDefined();
      test.cmp.magicBox.onsuggestions(<IOmniboxSuggestion[]>[
        {
          text: 'foobar'
        }
      ]);

      setTimeout(() => {
        expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
        done();
      }, test.cmp.options.searchAsYouTypeDelay);
    });

    describe('with live query state model', () => {
      beforeEach(() => {
        test = Mock.advancedComponentSetup<Omnibox>(
          Omnibox,
          new Mock.AdvancedComponentSetupOptions(undefined, undefined, (builder: Mock.MockEnvironmentBuilder) => {
            return testEnv.withLiveQueryStateModel();
          })
        );
      });

      afterEach(() => {
        test = null;
      });

      it('should update the state on building query', () => {
        test.cmp.setText('foobar');
        Simulate.query(test.env);
        expect(test.env.queryStateModel.get('q')).toBe('foobar');
      });

      it('should update the content on state change', () => {
        test.env.queryStateModel.set('q', 'trololo');
        expect(test.cmp.getText()).toEqual('trololo');
      });

      it('should execute tabpress on keydown', () => {
        spyOn(test.cmp.magicBox, 'ontabpress');
        Simulate.keyDown(test.cmp.getInput(), KEYBOARD.TAB);
        expect(test.cmp.magicBox.ontabpress).toHaveBeenCalled();
      });

      it('should not execute tabpress on keyup', () => {
        spyOn(test.cmp.magicBox, 'ontabpress');
        Simulate.keyUp(test.cmp.getInput(), KEYBOARD.TAB);
        expect(test.cmp.magicBox.ontabpress).not.toHaveBeenCalled();
      });
    });
    describe('when the querySuggestCharacterThreshold option is set to a value', () => {
      let querySuggestSuccessSpy;
      beforeEach(() => {
        test.cmp.options.querySuggestCharacterThreshold = 3;
        querySuggestSuccessSpy = jasmine.createSpy('querySuggestSuccesSpy');
        $$(test.env.root).on(OmniboxEvents.populateOmniboxSuggestions, () => querySuggestSuccessSpy());
      });

      it('inferior to the text in the magic box, we should not trigger the event to populate suggestion', async done => {
        test.cmp.setText('f');
        await test.cmp.magicBox.getSuggestions();
        expect(querySuggestSuccessSpy).not.toHaveBeenCalled();
        done();
      });

      it('equal to the text in the magic box, we should trigger the event to populate suggestion', async done => {
        test.cmp.setText('foo');
        await test.cmp.magicBox.getSuggestions();
        expect(querySuggestSuccessSpy).toHaveBeenCalled();
        done();
      });

      it('superior to the text in the magic box, we should trigger the event to populate suggestion', async done => {
        test.cmp.setText('foobar');
        await test.cmp.magicBox.getSuggestions();
        expect(querySuggestSuccessSpy).toHaveBeenCalled();
        done();
      });
    });

    describe('when handling "newQuery" event', () => {
      let breadcrumbClearSpy: jasmine.Spy;

      beforeEach(() => {
        breadcrumbClearSpy = jasmine.createSpy('clearBreadcrumb');
        $$(test.env.root).on(BreadcrumbEvents.clearBreadcrumb, breadcrumbClearSpy);
        setupForClearingFiltersOnNewQuery();
      });

      function setupForClearingFiltersOnNewQuery() {
        test.cmp.options.clearFiltersOnNewQuery = true;
        test.cmp.queryController.firstQuery = false;
        test.cmp.queryController.getLastQuery = () => ({ q: 'old query' });
        test.cmp.setText('new query');
      }

      describe(`when clearFiltersOnNewQuery is true
        when it is not the first query
        when the new query is different from the previous one`, () => {
        it(`when the origin is a valid component (Omnibox)
          should clear breadcrumbs`, () => {
          $$(test.env.root).trigger(QueryEvents.newQuery, { origin: test.cmp });
          expect(breadcrumbClearSpy).toHaveBeenCalled();
        });

        it(`when the origin is a valid component (SearchButton)
          should clear breadcrumbs`, () => {
          $$(test.env.root).trigger(QueryEvents.newQuery, { origin: { type: 'SearchButton' } });
          expect(breadcrumbClearSpy).toHaveBeenCalled();
        });

        it(`when the origin is not a valid component (Facet)
          should not clear breadcrumbs`, () => {
          $$(test.env.root).trigger(QueryEvents.newQuery, { origin: { type: 'Facet' } });
          expect(breadcrumbClearSpy).not.toHaveBeenCalled();
        });

        it(`when the origin is not defined
          should not clear breadcrumbs`, () => {
          $$(test.env.root).trigger(QueryEvents.newQuery);
          expect(breadcrumbClearSpy).not.toHaveBeenCalled();
        });
      });

      it(`when clearFiltersOnNewQuery is false
        should not clear breadcrumbs`, () => {
        test.cmp.options.clearFiltersOnNewQuery = false;
        $$(test.env.root).trigger(QueryEvents.newQuery, { origin: test.cmp });
        expect(breadcrumbClearSpy).not.toHaveBeenCalled();
      });

      it(`when clearFiltersOnNewQuery is true
        when it is the first query
        should not clear breadcrumbs`, () => {
        test.cmp.queryController.firstQuery = true;
        $$(test.env.root).trigger(QueryEvents.newQuery, { origin: test.cmp });
        expect(breadcrumbClearSpy).not.toHaveBeenCalled();
      });

      it(`when clearFiltersOnNewQuery is true
        when it is not the first query
        when the origin is a valid component (SearchButton)
        when the new query is the same as the previous one
        should not clear breadcrumbs`, () => {
        const sameQuery = 'same here';
        test.cmp.queryController.getLastQuery = () => ({ q: sameQuery });
        test.cmp.setText(sameQuery);
        $$(test.env.root).trigger(QueryEvents.newQuery, { origin: test.cmp });
        expect(breadcrumbClearSpy).not.toHaveBeenCalled();
      });
    });
  });
}
