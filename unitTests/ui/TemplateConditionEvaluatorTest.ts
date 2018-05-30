import { TemplateConditionEvaluator } from '../../src/ui/Templates/TemplateConditionEvaluator';
import { FakeResults } from '../Fake';
import { IQueryResult } from '../../src/rest/QueryResult';
import { ResponsiveComponents } from '../../src/ui/ResponsiveComponents/ResponsiveComponents';

export function TemplateConditionEvaluatorTest() {
  describe('TemplateConditionEvaluator', () => {
    it('should be able to extract the coveo fields from a given arbitrary string', () => {
      expect(TemplateConditionEvaluator.getFieldFromString('raw.foo @foobar test test raw["baz"] not a field')).toEqual(
        jasmine.arrayContaining(['foo', 'foobar', 'baz'])
      );
    });

    describe('should be able to evaluate a basic boolean condition', () => {
      let fakeResults: IQueryResult;

      beforeEach(() => {
        fakeResults = FakeResults.createFakeResult();
        fakeResults.raw['foo'] = 'bar';
      });

      afterEach(() => {
        fakeResults = null;
      });

      it('if it matches', () => {
        expect(TemplateConditionEvaluator.evaluateCondition('raw.foo == "bar"', fakeResults)).toBe(true);
      });

      it('if it does not match', () => {
        expect(TemplateConditionEvaluator.evaluateCondition('raw.foo == "baz"', fakeResults)).toBe(false);
      });

      it('if the values need to be not null', () => {
        expect(TemplateConditionEvaluator.evaluateCondition('raw.foo != null', fakeResults)).toBe(true);
      });

      describe('if it depends on the size of the device', () => {
        let responsiveComponents: ResponsiveComponents;

        beforeEach(() => {
          responsiveComponents = new ResponsiveComponents();
        });

        afterEach(() => {
          responsiveComponents = null;
        });

        it('if it needs a small device and the device is small', () => {
          responsiveComponents.isSmallScreenWidth = () => true;
          expect(
            TemplateConditionEvaluator.evaluateCondition('Coveo.DeviceUtils.isSmallScreenWidth()', fakeResults, responsiveComponents)
          ).toBe(true);
        });

        it('if it needs a small device and the device is not small', () => {
          responsiveComponents.isSmallScreenWidth = () => false;
          expect(
            TemplateConditionEvaluator.evaluateCondition('Coveo.DeviceUtils.isSmallScreenWidth()', fakeResults, responsiveComponents)
          ).toBe(false);
        });

        it('if it needs a small device, but the field is matching', () => {
          responsiveComponents.isSmallScreenWidth = () => false;
          expect(
            TemplateConditionEvaluator.evaluateCondition(
              'raw.foo == "bar" && Coveo.DeviceUtils.isSmallScreenWidth()',
              fakeResults,
              responsiveComponents
            )
          ).toBe(false);
        });

        it('if it needs a small device, but the field is not matching', () => {
          responsiveComponents.isSmallScreenWidth = () => true;
          expect(
            TemplateConditionEvaluator.evaluateCondition(
              'raw.foo == "baz" && Coveo.DeviceUtils.isSmallScreenWidth()',
              fakeResults,
              responsiveComponents
            )
          ).toBe(false);
        });
      });
    });
  });
}
