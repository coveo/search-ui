import * as Mock from '../MockEnvironment';
import { Facet } from '../../src/ui/Facet/Facet';
import { ValueElementRenderer } from '../../src/ui/Facet/ValueElementRenderer';
import { IFacetOptions } from '../../src/ui/Facet/Facet';
import { FacetValue } from '../../src/ui/Facet/FacetValue';
import { FakeResults } from '../Fake';
import { $$ } from '../../src/utils/Dom';
import { findLastIndex } from 'underscore';

export function ValueElementRendererTest() {
  describe('ValueElementRenderer', function () {
    var facet: Facet;
    var valueRenderer: ValueElementRenderer;

    beforeEach(() => {
      facet = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
        field: '@field'
      }).cmp;
    });

    afterEach(function () {
      facet = null;
      valueRenderer = null;
    });

    it('should build a list element', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 1234)));
      expect(valueRenderer.build().listItem).toBeDefined();
      expect(valueRenderer.build().listItem.getAttribute('data-value')).toBe('foo');
    });

    it('should add a hover class for the list element', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 1234)));
      expect($$(valueRenderer.build().listItem).hasClass('coveo-with-hover')).toBe(true);
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

    it('the checkbox has an aria-hidden equal to true', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123)));
      valueRenderer.build();
      expect(valueRenderer.checkbox.getAttribute('aria-hidden')).toBe('true');
    });

    it('the checkbox has an aria-label', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123)));
      valueRenderer.build();
      expect(valueRenderer.checkbox.getAttribute('aria-label')).toBeTruthy();
    });

    it('the list item has an aria-label', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123)));
      valueRenderer.build();
      expect(valueRenderer.listItem.getAttribute('aria-label')).toBeTruthy();
    });

    it('should put the tabindex attribute to 0 on a stylish checkbox', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123)));
      expect(valueRenderer.build().stylishCheckbox.getAttribute('tabindex')).toBe('0');
    });

    it('should build a stylish checkbox', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123)));
      expect(valueRenderer.build().stylishCheckbox).toBeDefined();
    });

    describe('when the facetValue is not selected', () => {
      beforeEach(() => {
        const facetValue = FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123));
        facetValue.selected = false;
        valueRenderer = new ValueElementRenderer(facet, facetValue).build();
      });

      it("the aria-label attribute starts with the word 'Inclusion'", () => {
        const ariaLabel = valueRenderer.accessibleElement.getAttribute('aria-label');
        expect(ariaLabel.indexOf('Inclusion')).toEqual(0);
      });

      it('the aria-pressed attribute of the checkbox is false', () => {
        const ariaPressed = valueRenderer.accessibleElement.getAttribute('aria-pressed');
        expect(ariaPressed).toEqual('false');
      });

      it('the aria-pressed attribute of the exclude button is false', () => {
        const ariaPressed = valueRenderer.excludeIcon.getAttribute('aria-pressed');
        expect(ariaPressed).toEqual('false');
      });
    });

    describe('when the facetValue is selected', () => {
      beforeEach(() => {
        const facetValue = FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123));
        facetValue.selected = true;
        valueRenderer = new ValueElementRenderer(facet, facetValue).build();
      });

      it("the aria-label attribute starts with the word 'Inclusion'", () => {
        const ariaLabel = valueRenderer.accessibleElement.getAttribute('aria-label');
        expect(ariaLabel.indexOf('Inclusion')).toEqual(0);
      });

      it('the aria-pressed attribute of the checkbox is true', () => {
        const ariaPressed = valueRenderer.accessibleElement.getAttribute('aria-pressed');
        expect(ariaPressed).toEqual('true');
      });

      it('the aria-pressed attribute of the exclude button is false', () => {
        const ariaPressed = valueRenderer.excludeIcon.getAttribute('aria-pressed');
        expect(ariaPressed).toEqual('false');
      });
    });

    describe('when the facetValue is excluded', () => {
      beforeEach(() => {
        const facetValue = FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 123));
        facetValue.excluded = true;
        valueRenderer = new ValueElementRenderer(facet, facetValue).build();
      });

      it("the aria-label attribute starts with the word 'Inclusion'", () => {
        const ariaLabel = valueRenderer.accessibleElement.getAttribute('aria-label');
        expect(ariaLabel.indexOf('Inclusion')).toEqual(0);
      });

      it('the aria-pressed attribute of the checkbox is mixed', () => {
        const ariaPressed = valueRenderer.accessibleElement.getAttribute('aria-pressed');
        expect(ariaPressed).toEqual('mixed');
      });

      it('the aria-pressed attribute of the exclude button is true', () => {
        const ariaPressed = valueRenderer.excludeIcon.getAttribute('aria-pressed');
        expect(ariaPressed).toEqual('true');
      });
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

    it('should build either checkbox, the caption then the count in that order', () => {
      valueRenderer = new ValueElementRenderer(facet, FacetValue.createFromFieldValue(FakeResults.createFakeFieldValue('foo', 1)));
      const buildResult = valueRenderer.build();
      const wrapper = buildResult['facetValueLabelWrapper'];
      const wrapperChildren = $$(wrapper).children();
      const lastCheckboxIndex = findLastIndex(
        wrapperChildren,
        child => [buildResult.stylishCheckbox, buildResult.checkbox].indexOf(child) !== -1
      );
      expect(wrapperChildren.slice(lastCheckboxIndex + 1, lastCheckboxIndex + 3)).toEqual([
        buildResult.valueCaption,
        buildResult.valueCount
      ]);
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
