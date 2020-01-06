import { TemplateConditionEvaluator } from '../../src/ui/Templates/TemplateConditionEvaluator';
import { FakeResults } from '../Fake';
import { IQueryResult } from '../../src/rest/QueryResult';
import { ResponsiveComponents } from '../../src/ui/ResponsiveComponents/ResponsiveComponents';
import { Utils } from '../../src/utils/Utils';

export function TemplateConditionEvaluatorTest() {
  describe('TemplateConditionEvaluator', () => {
    it('should be able to find a field in the format @FIELDNAME', () => {
      expect(
        Utils.arrayEqual(
          TemplateConditionEvaluator.getFieldFromString('@first_field second@third @fourth'),
          ['first_field', 'third', 'fourth'],
          false
        )
      ).toBeTruthy();
    });

    it('should be able to find a field in the format raw.FIELDNAME', () => {
      expect(
        Utils.arrayEqual(
          TemplateConditionEvaluator.getFieldFromString('raw.first_field raw.second raw.third'),
          ['first_field', 'second', 'third'],
          false
        )
      ).toBeTruthy();
    });

    it("should be able to find a field in the format raw['FIELDNAME']", () => {
      expect(
        Utils.arrayEqual(
          TemplateConditionEvaluator.getFieldFromString(`raw['first_field'] raw['second'] raw['third']`),
          ['first_field', 'second', 'third'],
          false
        )
      ).toBeTruthy();
    });

    it('should be able to find a field in the format raw["FIELDNAME"]', () => {
      expect(
        Utils.arrayEqual(
          TemplateConditionEvaluator.getFieldFromString(`raw["first_field"] raw["second"] raw["third"]`),
          ['first_field', 'second', 'third'],
          false
        )
      ).toBeTruthy();
    });

    it('should be able to find a field in the format data-condition-field-FIELDNAME', () => {
      expect(
        Utils.arrayEqual(
          TemplateConditionEvaluator.getFieldFromString(`<div data-condition-field-first_field="abc" data-condition-field-second="bcd">`),
          ['first_field', 'second'],
          false
        )
      ).toBeTruthy();
    });

    it('should be able to find a field in the format data-condition-field-not-FIELDNAME', () => {
      expect(
        Utils.arrayEqual(
          TemplateConditionEvaluator.getFieldFromString(
            `<div data-condition-field-not-first_field="abc" data-condition-field-not-second="bcd">`
          ),
          ['first_field', 'second'],
          false
        )
      ).toBeTruthy();
    });

    it('should not consider lone words to be fields', () => {
      expect(TemplateConditionEvaluator.getFieldFromString(`My name is John Doe`).length).toBe(0);
    });

    it('should not match an empty field name', () => {
      expect(TemplateConditionEvaluator.getFieldFromString(`@`).length).toBe(0);
      expect(TemplateConditionEvaluator.getFieldFromString(`raw.`).length).toBe(0);
      expect(TemplateConditionEvaluator.getFieldFromString(`raw['']`).length).toBe(0);
      expect(TemplateConditionEvaluator.getFieldFromString(`raw[""]`).length).toBe(0);
    });

    it('should not accept anything other than the @ symbol, "raw" and a period, or brackets before a field name', () => {
      expect(TemplateConditionEvaluator.getFieldFromString(`aw.foo`).length).toBe(0);
      expect(TemplateConditionEvaluator.getFieldFromString(`aw["foo"]`).length).toBe(0);
      expect(TemplateConditionEvaluator.getFieldFromString(`craw.foo`).length).toBe(0);
      expect(TemplateConditionEvaluator.getFieldFromString(`craw["foo"]`).length).toBe(0);
      expect(TemplateConditionEvaluator.getFieldFromString(`<foo`).length).toBe(0);
    });

    it("should not allow symbols within a field's name", () => {
      expect(
        Utils.arrayEqual(
          TemplateConditionEvaluator.getFieldFromString(`@foo#bar raw.hello#world raw['brown#fox']`),
          ['foo', 'hello', 'brown'],
          false
        )
      ).toBeTruthy();
    });

    it('should not be able to find a field if the format is raw["FIELDNAME"] and one of the quotes doesn\'t match the other', () => {
      expect(TemplateConditionEvaluator.getFieldFromString(`raw["foo']`).length).toBe(0);
      expect(TemplateConditionEvaluator.getFieldFromString(`raw['foo"]`).length).toBe(0);
    });

    it('should not be able to find a field if the format is raw["FIELDNAME"] and the quotes aren\'t valid', () => {
      expect(TemplateConditionEvaluator.getFieldFromString(`raw[#foo#]`).length).toBe(0);
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
