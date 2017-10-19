import { BreadcrumbValueList } from '../../src/ui/Facet/BreadcrumbValuesList';
import * as Mock from '../MockEnvironment';
import { Facet } from '../../src/ui/Facet/Facet';
import { FacetValue } from '../../src/ui/Facet/FacetValues';
import { BreadcrumbValueElement } from '../../src/ui/Facet/BreadcrumbValueElement';
import * as _ from 'underscore';
import { $$ } from '../Test';
import { FakeResults } from '../Fake';
import { IIndexFieldValue } from '../../src/rest/FieldValue';

export function BreadcrumbValueListTest() {
  describe('BreadcrumbValuesListTest', () => {
    let facet: Facet;
    let facetValues: FacetValue[];

    beforeEach(() => {
      facet = Mock.mock(Facet);
      facet.options = {};
      facet.options.numberOfValuesInBreadcrumb = 5;
      facet.getValueCaption = jasmine.createSpy('getValueCaption').and.callFake((facetValue: IIndexFieldValue) => facetValue.value);
      facetValues = _.map(FakeResults.createFakeFieldValues('foo', 3), fieldValue => {
        const created = FacetValue.createFromFieldValue(fieldValue);
        created.selected = true;
        return created;
      });
    });

    it('should support rendering as a simple string and not an HTML element', () => {
      facet.options.title = 'My facet title';
      const builtAsString = new BreadcrumbValueList(facet, facetValues, BreadcrumbValueElement).buildAsString();
      expect(_.isString(builtAsString)).toBe(true);
      expect(builtAsString).toContain('My facet title');
      expect(builtAsString).toContain('foo0');
      expect(builtAsString).toContain('foo1');
      expect(builtAsString).toContain('foo2');
    });

    it('should output the title with the facet title option', () => {
      facet.options.title = 'My facet title';
      const built = new BreadcrumbValueList(facet, facetValues, BreadcrumbValueElement).build();
      const title = $$(built).find('.coveo-facet-breadcrumb-title');
      expect($$(title).text()).toContain('My facet title');
    });

    it('should display a label for each selected values', () => {
      const built = new BreadcrumbValueList(facet, facetValues, BreadcrumbValueElement).build();
      const values = $$(built).findAll('.coveo-facet-breadcrumb-value');
      expect(values.length).toBe(3);
    });

    it('should display a caption for each selected values', () => {
      const built = new BreadcrumbValueList(facet, facetValues, BreadcrumbValueElement).build();
      const captions = $$(built).findAll('.coveo-facet-breadcrumb-caption');
      expect($$(captions[0]).text()).toContain('foo0');
      expect($$(captions[1]).text()).toContain('foo1');
      expect($$(captions[2]).text()).toContain('foo2');
    });

    it('should display a clear button for each selected values', () => {
      const built = new BreadcrumbValueList(facet, facetValues, BreadcrumbValueElement).build();
      const clear = $$(built).findAll('.coveo-facet-breadcrumb-clear');
      expect(clear.length).toBe(3);
    });

    it('should respect the facet option for the number of values in breadcrumb', () => {
      facet.options.numberOfValuesInBreadcrumb = 2;
      const built = new BreadcrumbValueList(facet, facetValues, BreadcrumbValueElement).build();
      const andShowMore = $$(built).findAll('.coveo-facet-breadcrumb-multi-count');
      expect(andShowMore.length).toBe(1);
      expect($$(andShowMore[0]).text()).toContain('1 more...');
    });

    describe('when some values are excluded', () => {
      beforeEach(() => {
        facetValues[2].excluded = true;
        facetValues[2].selected = false;
      });

      it('should display excluded values differently', () => {
        const built = new BreadcrumbValueList(facet, facetValues, BreadcrumbValueElement).build();
        const excluded = $$(built).findAll('.coveo-facet-breadcrumb-value.coveo-excluded');
        expect(excluded.length).toBe(1);
      });

      it('should add the excluded and selected values together when it exceeds the number of values in breadcrumb', () => {
        facet.options.numberOfValuesInBreadcrumb = 1;
        const built = new BreadcrumbValueList(facet, facetValues, BreadcrumbValueElement).build();
        const andShowMore = $$(built).findAll('.coveo-facet-breadcrumb-multi-count');
        expect(andShowMore.length).toBe(1);
        expect($$(andShowMore[0]).text()).toContain('2 more...');
      });

      it('should display the hidden values correctly when every values are excluded', () => {
        facetValues = _.map(facetValues, facetValue => {
          facetValue.excluded = true;
          facetValue.selected = false;
          return facetValue;
        });

        facet.options.numberOfValuesInBreadcrumb = 1;
        const built = new BreadcrumbValueList(facet, facetValues, BreadcrumbValueElement).build();
        const andShowMore = $$(built).findAll('.coveo-facet-breadcrumb-multi-count');
        expect(andShowMore.length).toBe(1);
        expect($$(andShowMore[0]).text()).toContain('2 more...');
      });

      it('should display the hidden values correctly when every values are included', () => {
        facetValues = _.map(facetValues, facetValue => {
          facetValue.excluded = false;
          facetValue.selected = true;
          return facetValue;
        });

        facet.options.numberOfValuesInBreadcrumb = 1;
        const built = new BreadcrumbValueList(facet, facetValues, BreadcrumbValueElement).build();
        const andShowMore = $$(built).findAll('.coveo-facet-breadcrumb-multi-count');
        expect(andShowMore.length).toBe(1);
        expect($$(andShowMore[0]).text()).toContain('2 more...');
      });

      it('should show hidden values on clicking show more', () => {
        facet.options.numberOfValuesInBreadcrumb = 1;
        const built = new BreadcrumbValueList(facet, facetValues, BreadcrumbValueElement).build();
        const andShowMore = $$(built).find('.coveo-facet-breadcrumb-multi-count');
        $$(andShowMore).trigger('click');
        const captions = $$(built).findAll('.coveo-facet-breadcrumb-caption');
        expect($$(captions[0]).text()).toContain('foo0');
        expect($$(captions[1]).text()).toContain('foo1');
        expect($$(captions[2]).text()).toContain('foo2');
      });
    });
  });
}
