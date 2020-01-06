import { FacetUtils } from '../../src/ui/Facet/FacetUtils';

export const FacetUtilsTest = () => {
  describe('FacetUtils', () => {
    it('should not needlessly translate @month field for month value as a string', () => {
      const translation = FacetUtils.tryToGetTranslatedCaption('@month', 'hello');
      expect(translation).toEqual('hello');
    });

    it('should not needlessly translate @month field for month value as an invalid month number', () => {
      const translation = FacetUtils.tryToGetTranslatedCaption('@month', '123');
      expect(translation).toEqual('123');
    });

    it('should translate @month field for valid month value as returned by the index', () => {
      const allMonths = [
        { indexValue: '01', translation: 'January' },
        { indexValue: '02', translation: 'February' },
        { indexValue: '03', translation: 'March' },
        { indexValue: '04', translation: 'April' },
        { indexValue: '05', translation: 'May' },
        { indexValue: '06', translation: 'June' },
        { indexValue: '07', translation: 'July' },
        { indexValue: '08', translation: 'August' },
        { indexValue: '09', translation: 'September' },
        { indexValue: '10', translation: 'October' },
        { indexValue: '11', translation: 'November' },
        { indexValue: '12', translation: 'December' }
      ];

      allMonths.forEach(month => {
        const translation = FacetUtils.tryToGetTranslatedCaption('@month', month.indexValue);
        expect(translation).toEqual(month.translation);
      });
    });

    describe('testing getDisplayValueFromValueCaption', () => {
      it(`when there is no value caption
        display value should be equal to the value`, () => {
        const displayValue = FacetUtils.getDisplayValueFromValueCaption('allo', '@random', {});
        expect(displayValue).toBe('allo');
      });

      it(`when there is a value caption
      display value should be equal to the caption for that value`, () => {
        const displayValue = FacetUtils.getDisplayValueFromValueCaption('allo', '@random', { allo: 'bye' });
        expect(displayValue).toBe('bye');
      });
    });
  });
};
