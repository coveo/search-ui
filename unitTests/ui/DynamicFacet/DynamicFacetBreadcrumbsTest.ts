import { DynamicFacetBreadcrumbs } from '../../../src/ui/DynamicFacet/DynamicFacetBreadcrumbs';
import { $$ } from '../../../src/Core';
import { DynamicFacetTestUtils } from './DynamicFacetTestUtils';
import { DynamicFacet } from '../../../src/ui/DynamicFacet/DynamicFacet';
import { IDynamicFacetOptions, IDynamicFacetValueProperties } from '../../../src/ui/DynamicFacet/IDynamicFacet';
import { FacetValueState } from '../../../src/rest/Facet/FacetValueState';
import { analyticsActionCauseList } from '../../../src/ui/Analytics/AnalyticsActionListMeta';
import * as _ from 'underscore';

export function DynamicFacetBreadcrumbsTest() {
  describe('DynamicFacetBreadcrumbs', () => {
    let facet: DynamicFacet;
    let baseOptions: IDynamicFacetOptions;
    let dynamicFacetBreadcrumbs: DynamicFacetBreadcrumbs;
    let mockFacetValues: IDynamicFacetValueProperties[];

    beforeEach(() => {
      mockFacetValues = DynamicFacetTestUtils.createFakeFacetValues(5, FacetValueState.selected);
      baseOptions = { title: 'a title', field: '@field', numberOfValuesInBreadcrumb: 5 };
      initializeComponent();
    });

    function initializeComponent() {
      facet = DynamicFacetTestUtils.createAdvancedFakeFacet(baseOptions).cmp;
      facet.values.createFromResponse(DynamicFacetTestUtils.getCompleteFacetResponse(facet, { values: mockFacetValues }));
      (facet.searchInterface.getComponents as jasmine.Spy).and.returnValue([facet]);
      dynamicFacetBreadcrumbs = new DynamicFacetBreadcrumbs(facet);
    }

    function titleElement() {
      return $$(dynamicFacetBreadcrumbs.element).find('.coveo-dynamic-facet-breadcrumb-title');
    }

    function valueElements() {
      return $$(dynamicFacetBreadcrumbs.element).findAll('.coveo-dynamic-facet-breadcrumb-value');
    }

    function collapseElement() {
      return $$(dynamicFacetBreadcrumbs.element).find('.coveo-dynamic-facet-breadcrumb-collapse');
    }

    it('should create a title', () => {
      expect(titleElement().innerHTML).toBe(`${baseOptions.title}:`);
    });

    it('should create the right number of breadcrumb values', () => {
      expect(valueElements().length).toBe(mockFacetValues.length);
    });

    it('should escape facet values to prevent XSS', () => {
      const facetValueWithXSS = DynamicFacetTestUtils.createFakeFacetValue({
        value: '<img src=x onerror=alert(1)>',
        state: FacetValueState.selected
      });

      mockFacetValues = [facetValueWithXSS];
      initializeComponent();

      const [breadcrumb] = valueElements();
      expect(breadcrumb.childNodes[0].textContent).toBe('<img src=x onerror=alert(1)>');
    });

    it('should not create a "collapsed breadcrumbs" element allowing to show more values', () => {
      expect(collapseElement()).toBeFalsy();
    });

    it('should have the correct aria-label for every selected value', () => {
      _.each(valueElements(), (breadcrumb, index) => {
        expect(breadcrumb.getAttribute('aria-label')).toBe(`Remove inclusion filter on fake value ${index}`);
      });
    });

    it('should have the correct type for every selected value', () => {
      _.each(valueElements(), (breadcrumb, index) => {
        expect(breadcrumb.getAttribute('type')).toBe(`button`);
      });
    });

    describe('when the breadcrumb has more values than the numberOfValuesInBreadcrumb option', () => {
      beforeEach(() => {
        baseOptions.numberOfValuesInBreadcrumb = 3;
        initializeComponent();
        spyOn(facet, 'deselectValue');
        spyOn(facet, 'triggerNewQuery');
        spyOn(facet, 'enablePreventAutoSelectionFlag');
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

      it(`when clicking on a breadcrumb value element
        it should prevent autoselection`, () => {
        $$(valueElements()[0]).trigger('click');
        expect(facet.enablePreventAutoSelectionFlag).toHaveBeenCalled();
      });

      it(`when clicking on a breadcrumb value element
        it should log an analytics event`, () => {
        spyOn(facet, 'logAnalyticsEvent');
        facet.triggerNewQuery = beforeExecuteQuery => {
          beforeExecuteQuery();
        };

        $$(valueElements()[0]).trigger('click');
        expect(facet.logAnalyticsEvent).toHaveBeenCalledWith(analyticsActionCauseList.breadcrumbFacet, facet.basicAnalyticsFacetMeta);
      });
    });
  });
}
