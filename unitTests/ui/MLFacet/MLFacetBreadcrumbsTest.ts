import { MLFacetBreadcrumbs } from '../../../src/ui/MLFacet/MLFacetBreadcrumbs';
import { $$ } from '../../../src/Core';
import { MLFacetTestUtils } from './MLFacetTestUtils';
import { MLFacet, IMLFacetOptions } from '../../../src/ui/MLFacet/MLFacet';
import { IMLFacetValue } from '../../../src/ui/MLFacet/MLFacetValues/MLFacetValue';
import { FacetValueState } from '../../../src/rest/Facet/FacetValueState';

export function MLFacetBreadcrumbsTest() {
  describe('MLFacetBreadcrumbs', () => {
    let facet: MLFacet;
    let baseOptions: IMLFacetOptions;
    let mLFacetBreadcrumbs: MLFacetBreadcrumbs;
    let mockFacetValues: IMLFacetValue[];

    beforeEach(() => {
      mockFacetValues = MLFacetTestUtils.createFakeFacetValues(5, FacetValueState.selected);
      baseOptions = { title: 'a title', field: '@field', numberOfValuesInBreadcrumb: 5 };
      initializeComponent();
    });

    function initializeComponent() {
      facet = MLFacetTestUtils.createAdvancedFakeFacet(baseOptions).cmp;
      facet.values.createFromResponse(MLFacetTestUtils.getCompleteFacetResponse(facet, { values: mockFacetValues }));
      mLFacetBreadcrumbs = new MLFacetBreadcrumbs(facet);
    }

    function titleElement() {
      return $$(mLFacetBreadcrumbs.element).find('.coveo-ml-facet-breadcrumb-title');
    }

    function valueElements() {
      return $$(mLFacetBreadcrumbs.element).findAll('.coveo-ml-facet-breadcrumb-value');
    }

    function collapseElement() {
      return $$(mLFacetBreadcrumbs.element).find('.coveo-ml-facet-breadcrumb-collapse');
    }

    it('should create a title', () => {
      expect(titleElement().innerHTML).toBe(`${baseOptions.title}:`);
    });

    it('should create the right number of breadcrumb values', () => {
      expect(valueElements().length).toBe(mockFacetValues.length);
    });

    it('should not create a "collapsed breadcrumbs" element allowing to show more values', () => {
      expect(collapseElement()).toBeFalsy();
    });

    describe('when the breadcrumb has more values than the numberOfValuesInBreadcrumb option', () => {
      beforeEach(() => {
        baseOptions.numberOfValuesInBreadcrumb = 3;
        initializeComponent();
        spyOn(facet, 'deselectValue');
        spyOn(facet, 'triggerNewQuery');
      });

      it('should create the maximum number of breadcrumb values', () => {
        expect(valueElements().length).toBe(baseOptions.numberOfValuesInBreadcrumb);
      });

      it('should create a collapsed breadcrumbs allowing to show more values', () => {
        const numberOfCollapsedValues = mockFacetValues.length - baseOptions.numberOfValuesInBreadcrumb;
        expect(collapseElement().innerHTML).toBe(`${numberOfCollapsedValues} more...`);
      });

      it(`when clicking on the "collapsed breadcrumbs" element
        it should diplay all breadcrumb values`, () => {
        $$(collapseElement()).trigger('click');
        expect(valueElements().length).toBe(mockFacetValues.length);
      });

      it(`when clicking on the "collapsed breadcrumbs" element
        it should remove the collapse element`, () => {
        $$(collapseElement()).trigger('click');
        expect(collapseElement()).toBeFalsy();
      });

      it(`when clicking on a breadcrumb value element
        it should deselect the facet value`, () => {
        const valueIndex = 2;
        $$(valueElements()[valueIndex]).trigger('click');

        expect(facet.deselectValue).toHaveBeenCalledWith(mockFacetValues[valueIndex].value);
      });

      it(`when clicking on a breadcrumb value element
        it should trigger a new query`, () => {
        $$(valueElements()[0]).trigger('click');
        expect(facet.triggerNewQuery).toHaveBeenCalled();
      });
    });
  });
}
