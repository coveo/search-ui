import * as Mock from '../MockEnvironment';
import { Matrix } from '../../src/ui/Matrix/Matrix';
import { IMatrixOptions } from '../../src/ui/Matrix/Matrix';
import { IQueryResults } from '../../src/rest/QueryResults';
import { FakeResults } from '../Fake';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';
import { Cell } from '../../src/ui/Matrix/Cell';
import * as Globalize from 'globalize';
import _ = require('underscore');

export function MatrixTest() {
  describe('Matrix', function() {
    var test: Mock.IBasicComponentSetup<Matrix>;

    beforeEach(function() {
      test = Mock.optionsComponentSetup<Matrix, IMatrixOptions>(Matrix, {
        rowField: '@foo',
        columnField: '@bar',
        computedField: '@compute',
        columnFieldValues: _.map(_.range(9), (n: number) => {
          return n.toString();
        }),
        maximumNumberOfRows: 10
      });
    });

    afterEach(function() {
      test = null;
    });

    describe('when fully rendered', function() {
      var fakeResults: IQueryResults;
      beforeEach(function() {
        fakeResults = FakeResults.createFakeResults(1);
        fakeResults.groupByResults = _.map(_.range(10), (n: number) => {
          return FakeResults.createFakeGroupByResult('@foo', 'row', 10, true);
        });

        Simulate.query(test.env, {
          results: fakeResults
        });
        test.env.queryStateModel.attributes = {
          'f:@bar': []
        };
      });

      afterEach(function() {
        fakeResults = null;
      });

      it('should trigger the correct query on cell selection', function() {
        test.cmp.selectCell(5, 5);
        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().aq).toEqual(jasmine.stringMatching('@foo=row5'));
        expect(simulation.queryBuilder.build().aq).toEqual(jasmine.stringMatching('@bar=4'));
      });

      it('should allow to get the cell html element', function() {
        var elem = test.cmp.getCellElement(5, 5);
        expect($$(elem).text()).toBe(Globalize.format(fakeResults.groupByResults[0].values[5].computedFieldResults[0], 'c0'));
      });

      it('should allow to get the cell value', function() {
        var value = test.cmp.getCellValue(5, 5);
        expect(value).toBe(Globalize.format(fakeResults.groupByResults[0].values[5].computedFieldResults[0], 'c0'));
      });
    });

    describe('exposes options', function() {
      it('title will display a title on top of matrix', function() {
        test = Mock.optionsComponentSetup<Matrix, IMatrixOptions>(Matrix, {
          title: 'nice title',
          rowField: '@foo',
          columnField: '@bar',
          computedField: '@compute'
        });
        var title = $$(test.cmp.element).find('.coveo-matrix-title');
        expect($$(title).text()).toBe('nice title');
      });

      it('rowField should output a group by request', function() {
        test = Mock.optionsComponentSetup<Matrix, IMatrixOptions>(Matrix, {
          rowField: '@foo',
          columnField: '@bar',
          computedField: '@compute'
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              field: '@foo'
            })
          ])
        );
      });

      it('columnField and columnFieldValues operate together to output a group by request', function() {
        test = Mock.optionsComponentSetup<Matrix, IMatrixOptions>(Matrix, {
          rowField: '@foo',
          columnField: '@bar',
          columnFieldValues: ['a', 'b', 'c'],
          computedField: '@compute'
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              field: '@foo',
              queryOverride: jasmine.stringMatching("@bar='a'")
            }),
            jasmine.objectContaining({
              field: '@foo',
              queryOverride: jasmine.stringMatching("@bar='b'")
            }),
            jasmine.objectContaining({
              field: '@foo',
              queryOverride: jasmine.stringMatching("@bar='c'")
            })
          ])
        );
      });

      it('columnLabels should allow to set the column titles', function() {
        test = Mock.optionsComponentSetup<Matrix, IMatrixOptions>(Matrix, {
          rowField: '@foo',
          columnField: '@bar',
          computedField: '@compute',
          columnLabels: ['qwerty', 'asdfg', 'zxcvb'],
          columnFieldValues: ['a', 'b', 'c']
        });

        Simulate.query(test.env);

        var cellsValue = _.map(test.cmp.data[0], (c: Cell) => {
          return c.getValue();
        });

        expect(cellsValue).toEqual(jasmine.arrayContaining(['qwerty', 'asdfg', 'zxcvb']));
      });

      it('columnLabels will fallback on columnFieldValues if there is inconsistency (not same length for example)', function() {
        test = Mock.optionsComponentSetup<Matrix, IMatrixOptions>(Matrix, {
          rowField: '@foo',
          columnField: '@bar',
          computedField: '@compute',
          columnLabels: ['qwerty'],
          columnFieldValues: ['a', 'b', 'c']
        });

        Simulate.query(test.env);
        var cellsValues = _.map(test.cmp.data[0], (c: Cell) => {
          return c.getValue();
        });

        expect(cellsValues).toEqual(jasmine.arrayContaining(['a', 'b', 'c']));
      });

      it('columnHeader allow to specify the first column header', function() {
        test = Mock.optionsComponentSetup<Matrix, IMatrixOptions>(Matrix, {
          rowField: '@foo',
          columnField: '@bar',
          computedField: '@compute',
          columnHeader: 'this is a nice header'
        });

        Simulate.query(test.env);
        expect(test.cmp.getCellValue(0, 0)).toBe('this is a nice header');
      });

      it('maximumNumberOfValuesInGroupBy should allow to specify the number of value in the group by', function() {
        test = Mock.optionsComponentSetup<Matrix, IMatrixOptions>(Matrix, {
          rowField: '@foo',
          columnField: '@bar',
          computedField: '@compute',
          columnFieldValues: ['a', 'b', 'c'],
          maximumNumberOfValuesInGroupBy: 123
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              maximumNumberOfValues: 123
            })
          ])
        );
      });

      it('enableColumnTotals should allow to specify if a column should contal the total', function() {
        test = Mock.optionsComponentSetup<Matrix, IMatrixOptions>(Matrix, {
          rowField: '@foo',
          columnField: '@bar',
          computedField: '@compute',
          enableColumnTotals: false
        });

        Simulate.query(test.env);

        expect(test.cmp.getCellValue(test.cmp.data.length - 1, 0)).not.toBe('Total');

        test = Mock.optionsComponentSetup<Matrix, IMatrixOptions>(Matrix, {
          rowField: '@foo',
          columnField: '@bar',
          computedField: '@compute',
          enableColumnTotals: true
        });

        Simulate.query(test.env);

        expect(test.cmp.getCellValue(test.cmp.data.length - 1, 0)).toBe('Total');
      });

      it('computedField should allow to specify the computed field in the group by', function() {
        test = Mock.optionsComponentSetup<Matrix, IMatrixOptions>(Matrix, {
          rowField: '@foo',
          columnField: '@bar',
          computedField: '@compute'
        });

        var simulation = Simulate.query(test.env);

        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              computedFields: jasmine.arrayContaining([
                jasmine.objectContaining({
                  field: '@compute'
                })
              ])
            })
          ])
        );
      });

      it('computedFieldOperation should allow to specify the computed field operation', function() {
        test = Mock.optionsComponentSetup<Matrix, IMatrixOptions>(Matrix, {
          rowField: '@foo',
          columnField: '@bar',
          computedField: '@compute',
          computedFieldOperation: 'qwerty'
        });

        var simulation = Simulate.query(test.env);

        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              computedFields: jasmine.arrayContaining([
                jasmine.objectContaining({
                  operation: 'qwerty'
                })
              ])
            })
          ])
        );
      });
    });
  });
}
