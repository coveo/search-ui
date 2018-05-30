import * as Mock from '../MockEnvironment';
import { Facet } from '../../src/ui/Facet/Facet';
import { ValueElementRenderer } from '../../src/ui/Facet/ValueElementRenderer';
import { IFacetOptions } from '../../src/ui/Facet/Facet';
import { FacetValue } from '../../src/ui/Facet/FacetValues';
import { FakeResults } from '../Fake';
import { $$ } from '../../src/utils/Dom';

export function ValueElementRendererTest() {
  describe('ValueElementRenderer', function() {
    var facet: Facet;
    var valueRenderer: ValueElementRenderer;

    beforeEach(() => {
      facet = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
        field: '@field'
      }).cmp;
    });

    afterEach(function() {
      facet = null;
      valueRenderer = null;
    });

    it('should build a list element', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 1234)));
      expect(valueRenderer.build().listItem).toBeDefined();
      expect(valueRenderer.build().listItem.getAttribute('data-value')).toBe('foo');
    });

    it('should build a label', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123)));
      expect(valueRenderer.build().label).toBeDefined();
    });

    it('should build a checkbox', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123)));
      valueRenderer.facetValue.selected = true;
      valueRenderer.facetValue.excluded = false;
      expect(valueRenderer.build().checkbox.getAttribute('checked')).toBe('checked');
      expect(valueRenderer.build().checkbox.getAttribute('disabled')).toBeNull();
      valueRenderer.facetValue.selected = false;
      valueRenderer.facetValue.excluded = true;
      expect(valueRenderer.build().checkbox.getAttribute('checked')).toBeNull();
      expect(valueRenderer.build().checkbox.getAttribute('disabled')).toBe('disabled');
    });

    it('should put the tabindex attribute to 0 on a stylish checkbox', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123)));
      expect(valueRenderer.build().stylishCheckbox.getAttribute('tabindex')).toBe('0');
    });

    it('should build a stylish checkbox', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123)));
      expect(valueRenderer.build().stylishCheckbox).toBeDefined();
    });

    it('should build a caption', () => {
      valueRenderer = new ValueElementRenderer(
        facet,
        FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('this is a nice value', 123))
      );
      expect(valueRenderer.build().valueCaption).toBeDefined();
      expect($$(valueRenderer.build().valueCaption).text()).toBe('this is a nice value');
    });

    it('should build a value count', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 1)));
      expect(valueRenderer.build().valueCount).toBeDefined();
      expect($$(valueRenderer.build().valueCount).text()).toBe('1');

      // Should format big number
      valueRenderer.facetValue.occurrences = 31416;
      expect($$(valueRenderer.build().valueCount).text()).toBe('31,416');
    });

    it('should build an exclude icon', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123)));
      expect(valueRenderer.build().excludeIcon).toBeDefined();
    });

    it('should build an exclude icon', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123)));
      expect(valueRenderer.build().excludeIcon).toBeDefined();
    });

    it('should put the tabindex attribute to 0 on an exclude icon', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123)));
      expect(valueRenderer.build().excludeIcon.getAttribute('tabindex')).toBe('0');
    });

    it('should render computed field only if needed', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123)));
      expect(valueRenderer.build().computedField).toBeUndefined();

      valueRenderer.facet.options.computedField = '@computedField';
      valueRenderer.facet.options.computedFieldOperation = 'sum';
      valueRenderer.facet.options.computedFieldFormat = 'c0';

      valueRenderer.facetValue.computedField = 9999;
      expect(valueRenderer.build().computedField).toBeDefined();
      expect($$(valueRenderer.build().computedField).text()).toBe('$9,999');
    });

    it('should allow to remove element from the dom post build', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 1)));
      var count = valueRenderer.build().valueCount;
      expect(count.parentNode).toBeDefined();
      valueRenderer.build().withNo(count);
      expect(count.parentNode).toBeNull();
    });
  });
}
