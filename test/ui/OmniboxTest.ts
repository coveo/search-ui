/// <reference path="../Test.ts" />

module Coveo {
  describe('Omnibox', () => {
    var test: Mock.IBasicComponentSetup<Omnibox>;
    beforeEach(() => {
      test = Mock.basicComponentSetup<Omnibox>(Omnibox);
    })
    afterEach(() => {
      test = null;
    })

    it('should trigger a query on submit', () => {
      test.cmp.submit();
      expect(test.env.queryController.executeQuery).toHaveBeenCalled();
    })

    it('should log analytics event on submit', () => {
      test.cmp.submit();
      expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.searchboxSubmit, {});
    })

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
      })

      it('enableSearchAsYouType should allow to to trigger a query after a delay', function (done) {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableSearchAsYouType: true
        })
        expect(test.cmp.magicBox.onchange).toBeDefined();
        test.cmp.setText('foobar');
        test.cmp.magicBox.onchange();
        setTimeout(() => {
          expect(test.env.queryController.executeQuery).toHaveBeenCalled();
          done();
        }, test.cmp.options.searchAsYouTypeDelay)
      })

      it('enableSearchAsYouType should not trigger a query after a delay if there is no text', function (done) {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableSearchAsYouType: true
        })
        expect(test.cmp.magicBox.onchange).toBeDefined();
        test.cmp.setText('');
        test.cmp.magicBox.onchange();
        setTimeout(() => {
          expect(test.env.queryController.executeQuery).not.toHaveBeenCalled();
          done();
        }, test.cmp.options.searchAsYouTypeDelay)
      })

      it('enableQuerySyntax should modify the disableQuerySyntax parameter', function () {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableQuerySyntax: false
        });
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.disableQuerySyntax).toBe(true);

        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableQuerySyntax: true
        });
        test.cmp.setText('@field==Batman');

        simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.disableQuerySyntax).toBe(false);

      });

      it('enablePartialMatch should modify the enablePartialMatch parameters', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enablePartialMatch: false
        })
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enablePartialMatch).toBeFalsy();

        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enablePartialMatch: true
        })
        test.cmp.setText('@field==Batman');
        simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enablePartialMatch).toBe(true);

      })

      it('partialMatchKeywords should modify the query builder', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          partialMatchKeywords: 123,
          enablePartialMatch: true
        })
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.partialMatchKeywords).toBe(123);
      })

      it('partialMatchThreshold should modify the query builder', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          partialMatchThreshold: '14%',
          enablePartialMatch: true
        })
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.partialMatchThreshold).toBe('14%');
      })

      it('enableWildcards should modify the query builder', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableWildcards: true
        })
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableWildcards).toBe(true);
      })

      it('enableQuestionMarks should modify the query builder', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableQuestionMarks: true
        })
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableQuestionMarks).toBe(true);
      })

      it('enableQuestionMarks should modify the query builder', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableLowercaseOperators: true
        })
        test.cmp.setText('@field==Batman');

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.enableLowercaseOperators).toBe(true);
      })

      it('enableFieldAddon should create an addon component', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableFieldAddon: true
        })

        test.cmp.setText('this is not a field');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.listFields).not.toHaveBeenCalled();

        test.cmp.setText('@thisisafield');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.listFields).toHaveBeenCalled();

        test.cmp.setText('@thisisafield=');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.listFieldValues).toHaveBeenCalled();
      })

      it('listOfFields should show specified fields when field addon is enabled', (done) => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableFieldAddon: true,
          listOfFields: ['@field', '@another_field']
        })

        test.cmp.setText('@f');
        let suggestions = test.cmp.magicBox.getSuggestions();
        (<Promise<any>>suggestions[0]).then((fields) => {
          expect(fields[0].text).toEqual('@field');
          done();
        })
      })

      it('enableTopQueryAddon should get suggestion from reveal', () => {
        let element = $$('div');
        element.addClass('CoveoOmnibox');
        element.setAttribute('data-enable-top-query-addon', 'true');
        test = Mock.advancedComponentSetup<Omnibox>(Omnibox, new Mock.AdvancedComponentSetupOptions(element.el));

        test.cmp.setText('foobar');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.getRevealQuerySuggest).toHaveBeenCalled();
      })

      it('enableRevealQuerySuggestAddon should create an addon component', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableRevealQuerySuggestAddon: true
        })

        test.cmp.setText('foobar');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.getRevealQuerySuggest).toHaveBeenCalled();
      })

      it('enableQueryExtensionAddon should create an addon component', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableQueryExtensionAddon: true
        })

        test.cmp.setText('$');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.extensions).toHaveBeenCalled();
      })

      it('placeholder allow to set a placeholder in the input', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          placeholder: 'trololo'
        })
        expect(test.cmp.getInput().placeholder).toBe('trololo');
      })

      it('enableSearchAsYouType + enableRevealQuerySuggestAddon should send correct analytics events', () => {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableRevealQuerySuggestAddon: true,
          enableSearchAsYouType: true
        })
        let spy = jasmine.createSpy('spy');
        test.env.searchEndpoint.getRevealQuerySuggest = spy;

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
        })

        test.cmp.setText('foobar');
        expect(test.cmp.magicBox.onchange).toBeDefined();
        test.cmp.magicBox.onchange();
        test.cmp.magicBox.onselect(['a']);
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.omniboxAnalytics, jasmine.objectContaining({
          partialQuery: undefined,
          suggestionRanking: jasmine.any(Number),
          partialQueries: ''
        }))
      })

    })

    describe('with live query state model', () => {
      beforeEach(() => {
        test = Mock.advancedComponentSetup<Omnibox>(Omnibox, new Mock.AdvancedComponentSetupOptions(undefined, undefined, (builder: Mock.MockEnvironmentBuilder) => {
          return builder.withLiveQueryStateModel();
        }));
      })
      afterEach(() => {
        test = null;
      })

      it('should update the state on building query', () => {
        test.cmp.setText('foobar');
        Simulate.query(test.env);
        expect(test.env.queryStateModel.get('q')).toBe('foobar');
      })

      it('should update the content on state change', () => {
        test.env.queryStateModel.set('q', 'trololo');
        expect(test.cmp.getText()).toEqual('trololo');
      })
    })

  })
}
