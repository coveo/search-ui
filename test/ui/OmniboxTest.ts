/// <reference path="../Test.ts" />
module Coveo {
  describe('Omnibox', function () {
    var test: Mock.IBasicComponentSetup<Omnibox>;
    beforeEach(function () {
      test = Mock.basicComponentSetup<Omnibox>(Omnibox);
    })
    afterEach(function () {
      test = null;
    })

    it('should trigger a query on submit', function () {
      test.cmp.submit();
      expect(test.env.queryController.executeQuery).toHaveBeenCalled();
    })

    it('should log analytics event on submit', function () {
      test.cmp.submit();
      expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.searchboxSubmit, {});
    })

    describe('exposes options', function () {
      it('inline should be passed down to magic box', function () {
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
        test.cmp.magicBox.onchange();
        setTimeout(()=> {
          expect(test.env.queryController.executeQuery).toHaveBeenCalled();
          done();
        }, test.cmp.options.searchAsYouTypeDelay)
      })

      it('enableQuerySyntax should modify the disableQuerySyntax parameter', function() {
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

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.disableQuerySyntax).toBe(false);

      });

      it('enableFieldAddon should create an addon component', function () {
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

      it('enableTopQueryAddon should create an addon component', function () {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableTopQueryAddon: true
        })

        test.cmp.setText('foobar');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.usageAnalytics.getTopQueries).toHaveBeenCalled();
      })

      it('enableRevealQuerySuggestAddon should create an addon component', function () {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableRevealQuerySuggestAddon: true
        })

        test.cmp.setText('foobar');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.getRevealQuerySuggest).toHaveBeenCalled();
      })

      it('enableQueryExtensionAddon should create an addon component', function () {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          enableQueryExtensionAddon: true
        })

        test.cmp.setText('$');
        test.cmp.magicBox.getSuggestions();
        expect(test.env.searchEndpoint.extensions).toHaveBeenCalled();
      })

      it('placeholder allow to set a placeholder in the input', function () {
        test = Mock.optionsComponentSetup<Omnibox, IOmniboxOptions>(Omnibox, {
          placeholder: 'trololo'
        })

        expect(test.cmp.getInput().placeholder).toBe('trololo');
      })

    })

    describe('with live query state model', function () {
      beforeEach(function () {
        test = Mock.advancedComponentSetup<Omnibox>(Omnibox, new Mock.AdvancedComponentSetupOptions(undefined, undefined, (builder: Mock.MockEnvironmentBuilder)=> {
          return builder.withLiveQueryStateModel();
        }));
      })
      afterEach(function () {
        test = null;
      })

      it('should update the state on building query', function () {
        test.cmp.setText('foobar');
        Simulate.query(test.env);
        expect(test.env.queryStateModel.get('q')).toBe('foobar');
      })

      it('should update the content on state change', function () {
        test.env.queryStateModel.set('q', 'trololo');
        expect(test.cmp.getText()).toEqual('trololo');
      })
    })

  })
}
