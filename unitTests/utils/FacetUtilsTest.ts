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
  });
};
