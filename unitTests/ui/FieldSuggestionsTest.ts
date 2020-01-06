import * as Mock from '../MockEnvironment';
import { FieldSuggestions } from '../../src/ui/FieldSuggestions/FieldSuggestions';
import { IFieldSuggestionsOptions } from '../../src/ui/FieldSuggestions/FieldSuggestions';
import { Simulate } from '../Simulate';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { $$ } from '../../src/utils/Dom';
import { FakeResults } from '../Fake';
import { QueryStateModel } from '../../src/Core';
import { IPopulateOmniboxEventArgs } from '../../src/events/OmniboxEvents';

export function FieldSuggestionsTest() {
  describe('FieldSuggestions', () => {
    let test: Mock.IBasicComponentSetup<FieldSuggestions>;

    beforeEach(() => {
      // In phantom js there is a bug with CustomEvent('click'), which is needed to for those tests.
      // So, use jquery for event in phantom js
      if (Simulate.isPhantomJs()) {
        Simulate.addJQuery();
      }

      test = Mock.optionsComponentSetup<FieldSuggestions, IFieldSuggestionsOptions>(FieldSuggestions, {
        field: '@foobar'
      });
    });

    afterEach(() => {
      test = null;
      Simulate.removeJQuery();
    });

    it('should do a request on the endpoint', () => {
      Simulate.populateOmnibox(test.env);
      expect(test.env.searchEndpoint.listFieldValues).toHaveBeenCalledWith(
        jasmine.objectContaining({
          field: '@foobar'
        })
      );
    });

    it('should throw when there is no field', () => {
      expect(() => {
        test = Mock.optionsComponentSetup<FieldSuggestions, IFieldSuggestionsOptions>(FieldSuggestions, {
          field: undefined
        });
      }).toThrow();
    });

    it('should trigger an analytics event on suggestion', done => {
      test.env.searchEndpoint.listFieldValues = jasmine.createSpy('search');
      (<jasmine.Spy>test.env.searchEndpoint.listFieldValues).and.returnValue(
        new Promise(resolve => {
          resolve([{ value: 'foo' }, { value: 'bar' }, { value: 'baz' }]);
        })
      );
      var simulation = Simulate.populateOmnibox(test.env);
      test.cmp.selectSuggestion(0);
      simulation.rows[0].deferred.then(elementResolved => {
        test.cmp.selectSuggestion(0);
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.omniboxField, {});
        done();
      });
    });

    describe(`when calling the onSelect option`, () => {
      const value = 'value';
      let args: IPopulateOmniboxEventArgs;

      beforeEach(() => {
        args = buildPopulateOmniboxEventArgs();
        test.cmp.options.onSelect.call(test.cmp, value, args);
      });

      function buildPopulateOmniboxEventArgs() {
        const args = FakeResults.createPopulateOmniboxEventArgs('foo', 1);
        spyOn(args, 'clear');
        spyOn(args, 'closeOmnibox');
        return args;
      }

      it('does not call the args #clear method', () => {
        // https://coveord.atlassian.net/browse/JSUI-2748
        expect(args.clear).not.toHaveBeenCalled();
      });

      it('calls the args #closeOmnibox method', () => {
        expect(args.closeOmnibox).toHaveBeenCalledTimes(1);
      });

      it('sets the QueryStateModel query to the value', () => {
        expect(test.cmp.queryStateModel.set).toHaveBeenCalledWith(QueryStateModel.attributesEnum.q, value);
      });

      it('logs a search event to analytics with the correct cause', () => {
        expect(test.cmp.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.omniboxField, {});
      });

      it('calls executeQuery', () => {
        expect(test.cmp.queryController.executeQuery).toHaveBeenCalledTimes(1);
      });
    });

    describe('exposes options', () => {
      it('queryOverride should be passed in the list field value', () => {
        test = Mock.optionsComponentSetup<FieldSuggestions, IFieldSuggestionsOptions>(FieldSuggestions, {
          field: '@foobar',
          queryOverride: 'some override'
        });
        Simulate.populateOmnibox(test.env);
        expect(test.env.searchEndpoint.listFieldValues).toHaveBeenCalledWith(
          jasmine.objectContaining({
            field: '@foobar',
            queryOverride: 'some override'
          })
        );
      });

      it('omniboxZIndex should be taken into account', done => {
        test = Mock.optionsComponentSetup<FieldSuggestions, IFieldSuggestionsOptions>(FieldSuggestions, {
          field: '@foobar',
          omniboxZIndex: 333
        });
        test.env.searchEndpoint.listFieldValues = jasmine.createSpy('search');
        (<jasmine.Spy>test.env.searchEndpoint.listFieldValues).and.returnValue(
          new Promise(resolve => {
            resolve([{ value: 'foo' }, { value: 'bar' }, { value: 'baz' }]);
          })
        );
        var simulation = Simulate.populateOmnibox(test.env);
        test.cmp.selectSuggestion(0);
        simulation.rows[0].deferred.then(elementResolved => {
          expect(elementResolved.zIndex).toBe(333);
          done();
        });
      });

      it('numberOfSuggestions should be passed in the list field value', () => {
        test = Mock.optionsComponentSetup<FieldSuggestions, IFieldSuggestionsOptions>(FieldSuggestions, {
          field: '@foobar',
          numberOfSuggestions: 333
        });
        Simulate.populateOmnibox(test.env);
        expect(test.env.searchEndpoint.listFieldValues).toHaveBeenCalledWith(
          jasmine.objectContaining({
            field: '@foobar',
            maximumNumberOfValues: 333
          })
        );
      });

      describe('when data is returned for a field', () => {
        let fakeListField;
        beforeEach(() => {
          fakeListField = Promise.resolve([{ value: 'foo' }, { value: 'bar' }, { value: 'baz' }]);
        });

        it('should not provide a header if not configured as an option', done => {
          test = Mock.optionsComponentSetup<FieldSuggestions, IFieldSuggestionsOptions>(FieldSuggestions, {
            field: '@foobar'
          });

          (<jasmine.Spy>test.env.searchEndpoint.listFieldValues).and.returnValue(fakeListField);

          const simulation = Simulate.populateOmnibox(test.env);
          simulation.rows[0].deferred.then(elementResolved => {
            expect($$(elementResolved.element).find('.coveo-top-field-suggestion-header')).toBeNull();
            done();
          });
        });

        it('should provide a header if configured as an option', done => {
          test = Mock.optionsComponentSetup<FieldSuggestions, IFieldSuggestionsOptions>(FieldSuggestions, {
            field: '@foobar',
            headerTitle: 'my suggestion'
          });

          (<jasmine.Spy>test.env.searchEndpoint.listFieldValues).and.returnValue(fakeListField);

          const simulation = Simulate.populateOmnibox(test.env);
          simulation.rows[0].deferred.then(elementResolved => {
            const header = $$(elementResolved.element).find('.coveo-top-field-suggestion-header');
            expect(header).not.toBeNull();
            expect($$(header).text()).toBe('my suggestion');
            done();
          });
        });
      });
    });
  });
}
