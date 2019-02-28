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
import { KEYBOARD } from '../../src/Core';
import { IQueryOptions } from '../../src/controllers/QueryController';

export function OmniboxTest() {
  describe('Omnibox', () => {
    var test: Mock.IBasicComponentSetup<Omnibox>;
    beforeEach(() => {
      // Thanks phantom js for bad native event support
      if (Simulate.isPhantomJs()) {
        Simulate.addJQuery();
      }
      test = Mock.basicComponentSetup<Omnibox>(Omnibox);
      $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);
    });

    afterEach(() => {
      test = null;
      Simulate.removeJQuery();
    });

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
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          inline: true
        });
        expect(test.cmp.magicBox.options.inline).toBe(true);
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          inline: false
        });
        expect(test.cmp.magicBox.options.inline).toBe(false);
      });

      it('enableSearchAsYouType should allow to to trigger a query after a delay', function(done) {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
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
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableQuerySyntax: false
        });

        expect($$(test.cmp.element).hasClass('coveo-query-syntax-disabled')).toBeTruthy();
      });

      it('enableQuerySyntax should modify the enableQuerySyntax parameter', function() {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableQuerySyntax: false
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableQuerySyntax).toBe(false);

        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableQuerySyntax: true
        });
        test.cmp.setText('@field==Batman');

        simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableQuerySyntax).toBe(true);
      });

      it('enablePartialMatch should modify the enablePartialMatch parameters', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enablePartialMatch: false
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enablePartialMatch).toBeFalsy();

        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enablePartialMatch: true
        });
        test.cmp.setText('@field==Batman');
        simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enablePartialMatch).toBe(true);
      });

      it('partialMatchKeywords should modify the query builder', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          partialMatchKeywords: 123,
          enablePartialMatch: true
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.partialMatchKeywords).toBe(123);
      });

      it('partialMatchThreshold should modify the query builder', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          partialMatchThreshold: '14%',
          enablePartialMatch: true
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.partialMatchThreshold).toBe('14%');
      });

      it('enableWildcards should modify the query builder', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableWildcards: true
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableWildcards).toBe(true);
      });

      it('enableQuestionMarks should modify the query builder', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableQuestionMarks: true
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableQuestionMarks).toBe(true);
      });

      it('enableQuestionMarks should modify the query builder', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableLowercaseOperators: true
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableLowercaseOperators).toBe(true);
      });

      it('enableFieldAddon should create an addon component', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
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
          test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
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
          test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
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
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
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
        test = Mock.advancedComponentSetup<Omnibox>(Omnibox, new Mock.AdvancedComponentSetupOptions(element.el));

        test.cmp.setText('foobar');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.getQuerySuggest).toHaveBeenCalled();
      });

      it('enableQuerySuggestAddon should create an addon component', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableQuerySuggestAddon: true
        });

        test.cmp.setText('foobar');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.getQuerySuggest).toHaveBeenCalled();
      });

      it('enableQueryExtensionAddon should create an addon component', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableQueryExtensionAddon: true
        });

        test.cmp.setText('$');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.extensions).toHaveBeenCalled();
      });

      it('placeholder allow to set a placeholder in the input', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          placeholder: 'trololo'
        });
        expect(test.cmp.getInput().placeholder).toBe('trololo');
      });

      it('placeholder should use translated version', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          placeholder: 'SearchFor'
        });
        expect(test.cmp.getInput().placeholder).toBe(l('SearchFor'));
      });

      it('enableSearchAsYouType + enableQuerySuggestAddon should send correct analytics events', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
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
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          triggerQueryOnClear: true
        });
        test.cmp.magicBox.clear();
        expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
      });

      it('triggerQueryOnClear should not trigger a query on clear if false', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
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
            env.searchInterface.options.allowQueriesWithoutKeywords = false;
            return env;
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
            env.searchInterface.options.allowQueriesWithoutKeywords = true;
            return env;
          }
        );

        test = Mock.advancedComponentSetup<Omnibox>(Omnibox, advancedSetup);
        expect(test.cmp.options.triggerQueryOnClear).toBe(true);
      });
    });

    it('should execute query automatically when confidence level is > 0.8 on suggestion', done => {
      test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
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
      test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
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
      test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
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
      test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
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
      test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
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
            return builder.withLiveQueryStateModel();
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
  });
}
