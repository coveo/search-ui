import * as Mock from '../MockEnvironment';
import { FacetRange, IFacetRangeOptions } from '../../src/ui/FacetRange/FacetRange';
import { FacetValue } from '../../src/ui/Facet/FacetValue';
import { Simulate } from '../Simulate';

export function FacetRangeTest() {
  describe('FacetRange', () => {
    let test: Mock.IBasicComponentSetup<FacetRange>;

    beforeEach(() => {
      test = Mock.optionsComponentSetup<FacetRange, IFacetRangeOptions>(FacetRange, <IFacetRangeOptions>{ field: '@foo' });
    });

    afterEach(() => {
      test = null;
    });

    it('should allow to get a value caption for a facet value', () => {
      test = Mock.optionsComponentSetup<FacetRange, IFacetRangeOptions>(FacetRange, <IFacetRangeOptions>{
        field: '@foo',
        valueCaption: { hello: 'goodbye' }
      });
      const facetValue: FacetValue = FacetValue.create('hello');
      expect(test.cmp.getValueCaption(facetValue)).toEqual('goodbye');
    });

    it('should add a group by query', () => {
      const simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.groupByRequests).toEqual(
        jasmine.arrayContaining([
          jasmine.objectContaining({
            field: '@foo'
          })
        ])
      );
    });

    describe('with a date', () => {
      beforeEach(() => {
        test = Mock.optionsComponentSetup<FacetRange, IFacetRangeOptions>(FacetRange, <IFacetRangeOptions>{
          field: '@foo',
          dateField: true
        });
      });

      it('should allow to get a formatted value caption', () => {
        const facetValue: FacetValue = FacetValue.create('2015/01/01..2016/01/01');
        expect(test.cmp.getValueCaption(facetValue)).toEqual('1/1/2015 - 1/1/2016');
      });
    });

    it(`when the facetValue's lookupValue is defined & identical to a range's label
    should display the lookupValue (originally the label) instead of the formatted value`, () => {
      test.cmp.options.ranges = [{ label: 'All dates' }];
      const facetValue: FacetValue = FacetValue.create('1900/01/31@18:38:50..2020/06/25@18:30:00');
      facetValue.lookupValue = 'All dates';
      expect(test.cmp.getValueCaption(facetValue)).toEqual('All dates');
    });

    it(`when the facetValue's lookupValue is identical as the value
    should display the formatted value`, () => {
      const facetValue: FacetValue = FacetValue.create('1900/01/31@18:38:50..2020/06/25@18:30:00');
      facetValue.lookupValue = '1900/01/31@18:38:50..2020/06/25@18:30:00';
      expect(test.cmp.getValueCaption(facetValue)).toEqual('1/31/1900 - 6/25/2020');
    });

    it(`when the facetValue's lookupValue is undefined
    should display the formatted value`, () => {
      const facetValue: FacetValue = FacetValue.create('1900/01/31@18:38:50..2020/06/25@18:30:00');
      expect(test.cmp.getValueCaption(facetValue)).toEqual('1/31/1900 - 6/25/2020');
    });

    describe('with a value format', () => {
      it('should allow to get a formatted value with a number ', () => {
        test = Mock.optionsComponentSetup<FacetRange, IFacetRangeOptions>(FacetRange, <IFacetRangeOptions>{
          field: '@foo',
          valueFormat: 'c0'
        });
        const facetValue: FacetValue = FacetValue.create('0.00000..9.999999');
        expect(test.cmp.getValueCaption(facetValue)).toEqual('$0 - $10');
      });

      it('should not work when the value caption option is defined', () => {
        test = Mock.optionsComponentSetup<FacetRange, IFacetRangeOptions>(FacetRange, <IFacetRangeOptions>{
          field: '@foo',
          valueFormat: 'c0',
          valueCaption: {}
        });
        const facetValue: FacetValue = FacetValue.create('0.00000..9.999999');
        expect(test.cmp.getValueCaption(facetValue)).toEqual('0.00000..9.999999');
      });

      it(`when a value is a date
        should ignore the value format option and format the date`, () => {
        test = Mock.optionsComponentSetup<FacetRange, IFacetRangeOptions>(FacetRange, <IFacetRangeOptions>{
          field: '@foo',
          valueFormat: 'c0'
        });
        const facetValue: FacetValue = FacetValue.create('2015/01/01..2016/01/01');
        expect(test.cmp.getValueCaption(facetValue)).toEqual('1/1/2015 - 1/1/2016');
      });
    });

    describe('with a group by results', () => {
      const getGroupByResultsForDateValues = () => {
        return [
          {
            field: '@foo',
            values: [
              {
                value: '2017/01/01..2018/01/01',
                numberOfResults: 10,
                score: 10
              },
              {
                value: '2015/01/01..2016/01/01',
                numberOfResults: 10,
                score: 10
              }
            ]
          }
        ];
      };

      const getGroupByResultsForStandardValues = () => {
        return [
          {
            field: '@foo',
            values: [
              {
                value: '3',
                numberOfResults: 10,
                score: 10
              },
              {
                value: '1',
                numberOfResults: 10,
                score: 10
              },
              {
                value: '2',
                numberOfResults: 10,
                score: 10
              }
            ]
          }
        ];
      };

      it("should sort values if the range option is not specified, and it's a date", () => {
        test = Mock.optionsComponentSetup<FacetRange, IFacetRangeOptions>(FacetRange, <IFacetRangeOptions>{
          field: '@foo',
          dateField: true
        });

        const simulation = Simulate.query(test.env, {
          groupByResults: getGroupByResultsForDateValues()
        });

        expect(simulation.groupByResults[0].values[0].value).toEqual('2015/01/01..2016/01/01');
      });

      it("should sort values if the range option is not specified and it' a number", () => {
        test = Mock.optionsComponentSetup<FacetRange, IFacetRangeOptions>(FacetRange, <IFacetRangeOptions>{
          field: '@foo',
          dateField: false
        });

        const simulation = Simulate.query(test.env, {
          groupByResults: getGroupByResultsForStandardValues()
        });

        expect(simulation.groupByResults[0].values[0].value).toEqual('1');
      });
    });
  });
}
