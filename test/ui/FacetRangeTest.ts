import * as Mock from '../MockEnvironment';
import { FacetRange, IFacetRangeOptions } from '../../src/ui/FacetRange/FacetRange';
import { FacetValue } from '../../src/ui/Facet/FacetValues';
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
      const facetValue: FacetValue = FacetValue.create('foobar');
      expect(test.cmp.getValueCaption(facetValue)).toEqual('foobar');
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

    describe('with a value caption', () => {
      it('should allow to get a formatted value caption', () => {
        test = Mock.optionsComponentSetup<FacetRange, IFacetRangeOptions>(FacetRange, <IFacetRangeOptions>{
          field: '@foo',
          valueCaption: 'date'
        });
        const facetValue: FacetValue = FacetValue.create('2015/01/01..2016/01/01');
        expect(test.cmp.getValueCaption(facetValue)).toEqual('1/1/2015 - 1/1/2016');
      });

      it('should allow to get a formatted value caption if the helper is a predefined format', () => {
        test = Mock.optionsComponentSetup<FacetRange, IFacetRangeOptions>(FacetRange, <IFacetRangeOptions>{
          field: '@foo',
          valueCaption: 'dd-MM----yyyy'
        });
        const facetValue: FacetValue = FacetValue.create('2015/01/01..2016/01/01');
        expect(test.cmp.getValueCaption(facetValue)).toEqual('01-01----2015 - 01-01----2016');
      });
    });

    describe('with a group by results', () => {
      it("should sort values if the range option is not specified, and it's a date", () => {
        test = Mock.optionsComponentSetup<FacetRange, IFacetRangeOptions>(FacetRange, <IFacetRangeOptions>{
          field: '@foo',
          dateField: true
        });

        const simulation = Simulate.query(test.env, {
          groupByResults: [
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
          ]
        });

        expect(simulation.groupByResults[0].values[0].value).toEqual('2015/01/01..2016/01/01');
      });

      it("should sort values if the range option is not specified and it' a number", () => {
        test = Mock.optionsComponentSetup<FacetRange, IFacetRangeOptions>(FacetRange, <IFacetRangeOptions>{
          field: '@foo',
          dateField: false
        });

        const simulation = Simulate.query(test.env, {
          groupByResults: [
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
          ]
        });

        expect(simulation.groupByResults[0].values[0].value).toEqual('1');
      });
    });
  });
}
