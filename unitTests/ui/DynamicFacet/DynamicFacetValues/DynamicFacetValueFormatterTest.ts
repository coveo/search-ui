import { DynamicFacetValueFormatter } from '../../../../src/ui/DynamicFacet/DynamicFacetValues/DynamicFacetValueFormatter';
import { DynamicFacetTestUtils } from '../DynamicFacetTestUtils';
import { DynamicFacet, IDynamicFacetOptions } from '../../../../src/ui/DynamicFacet/DynamicFacet';

export function DynamicFacetValueFormatterTest() {
  describe('DynamicFacetValueFormatter', () => {
    let formatter: DynamicFacetValueFormatter;
    let facet: DynamicFacet;
    let options: IDynamicFacetOptions;

    beforeEach(() => {
      options = undefined;
      initializeComponent();
    });

    function initializeComponent() {
      facet = DynamicFacetTestUtils.createFakeFacet(options);
      formatter = new DynamicFacetValueFormatter(facet);
    }

    it(`when using the valueCaption option with a function
      should bypass it and return the original value`, () => {
      const originalValue = 'allo';
      options = { valueCaption: () => 'bye' };
      initializeComponent();

      expect(formatter.format(originalValue)).toBe(originalValue);
    });

    it(`when using the valueCaption with an object that contains the original value
      should return the caption`, () => {
      const originalValue = 'allo';
      const captionValue = 'bye';
      options = { valueCaption: { [originalValue]: captionValue } };
      initializeComponent();

      expect(formatter.format(originalValue)).toBe(captionValue);
    });

    it(`when using the valueCaption with an object that does not contain the original value
      should return original value`, () => {
      const originalValue = 'allo';
      const captionValue = 'bye';
      options = { valueCaption: { randomValue: captionValue } };
      initializeComponent();

      expect(formatter.format(originalValue)).toBe(originalValue);
    });
  });
}
