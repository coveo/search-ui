import { Aggregate } from '../../src/ui/Aggregate/Aggregate';
import * as Mock from '../MockEnvironment';
import { IAggregateOptions } from '../../src/ui/Aggregate/Aggregate';
import { FakeResults } from '../Fake';
import { $$ } from '../../src/utils/Dom';
import { Simulate } from '../Simulate';
import * as Globalize from 'globalize';

export function AggregateTest() {
  describe('Aggregate', function() {
    let test: Mock.IBasicComponentSetup<Aggregate>;

    afterEach(function() {
      test = null;
    });

    describe('exposes options', function() {
      it('field allows to set a field in the group by request', function() {
        test = Mock.optionsComponentSetup<Aggregate, IAggregateOptions>(Aggregate, {
          field: '@foobar'
        });
        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              field: '@foobar'
            })
          ])
        );
      });

      it('operation allows to set an operation in the group by request', function() {
        test = Mock.optionsComponentSetup<Aggregate, IAggregateOptions>(Aggregate, {
          field: '@foobar',
          operation: 'something'
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              computedFields: jasmine.arrayContaining([
                jasmine.objectContaining({
                  operation: 'something',
                  field: '@foobar'
                })
              ])
            })
          ])
        );
      });

      it('format should allow to render the result using the provided format', function() {
        test = Mock.optionsComponentSetup<Aggregate, IAggregateOptions>(Aggregate, {
          field: '@foobar',
          format: 'n0'
        });

        var results = FakeResults.createFakeResults(0);
        results.groupByResults = [FakeResults.createFakeGroupByResult('@foobar', 'foo', 10)];
        results.groupByResults[0].globalComputedFieldResults = [12345];

        Simulate.query(test.env, {
          results: results
        });

        expect($$(test.cmp.element).text()).toEqual(Globalize.format(12345, 'n0'));
      });
    });
  });
}
