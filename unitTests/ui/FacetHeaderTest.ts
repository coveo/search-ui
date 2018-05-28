import { Facet, IFacetOptions } from '../../src/ui/Facet/Facet';
import { FacetHeader, IFacetHeaderOptions } from '../../src/ui/Facet/FacetHeader';
import { FacetSettings } from '../../src/ui/Facet/FacetSettings';
import { $$ } from '../../src/utils/Dom';
import { Mock, registerCustomMatcher } from '../../testsFramework/TestsFramework';

export function FacetHeaderTest() {
  describe('FacetHeader', () => {
    let facetHeader: FacetHeader;
    let baseOptions: IFacetHeaderOptions;

    beforeEach(() => {
      baseOptions = {
        facetElement: document.createElement('div'),
        title: 'foo',
        field: '@field',
        enableClearElement: true,
        enableCollapseElement: true
      };
    });

    afterEach(() => {
      baseOptions = null;
      facetHeader = null;
    });

    it('should build a title', () => {
      facetHeader = new FacetHeader({
        ...baseOptions,
        ...{ title: 'this is a title' }
      });

      const title = $$(facetHeader.build()).find('.coveo-facet-header-title');
      expect($$(title).text()).toBe('this is a title');
    });

    it('should build an icon if specified', () => {
      facetHeader = new FacetHeader({
        ...baseOptions,
        ...{ icon: 'this-is-an-icon' }
      });
      const icon = $$(facetHeader.build()).find('.coveo-icon-custom.this-is-an-icon');
      expect(icon).not.toBeNull();
    });

    describe('with a facet', () => {
      let facet: Facet;

      beforeEach(() => {
        facet = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field'
        }).cmp;
        registerCustomMatcher();
      });

      it('toggle operator should be available if the facet has the option', () => {
        facet.options.enableTogglingOperator = true;
        facetHeader = new FacetHeader({
          ...baseOptions,
          ...{ facet }
        });
        facetHeader.build();
        expect(facetHeader.operatorElement.style.display).toEqual('block');

        facet.options.enableTogglingOperator = false;
        facetHeader = new FacetHeader({
          ...baseOptions,
          ...{ facet }
        });
        facetHeader.build();
        expect(facetHeader.operatorElement.style.display).toEqual('none');
      });

      it('allow to collapse and expand a facet', () => {
        facetHeader = new FacetHeader({
          ...baseOptions,
          ...{ facet },
          ...{ settingsKlass: FacetSettings }
        });

        facetHeader.build();
        facetHeader.collapseFacet();
        expect($$(facetHeader.options.facetElement).hasClass('coveo-facet-collapsed')).toBe(true);
        facetHeader.expandFacet();
        expect($$(facetHeader.options.facetElement).hasClass('coveo-facet-collapsed')).not.toBe(true);
      });

      it('allow to switch or and and', () => {
        facet.options.enableTogglingOperator = true;
        facet.getSelectedValues = jasmine.createSpy('spy');
        (<jasmine.Spy>facet.getSelectedValues).and.returnValue(['a', 'b']);

        facetHeader = new FacetHeader({
          ...baseOptions,
          ...{ facet },
          ...{ settingsKlass: FacetSettings }
        });

        facetHeader.build();
        facetHeader.switchToOr();
        expect(facet.queryStateModel.set).toHaveBeenCalledWith(facet.operatorAttributeId, 'or');

        facetHeader.switchToAnd();
        expect(facet.queryStateModel.set).toHaveBeenCalledWith(facet.operatorAttributeId, 'and');

        facetHeader.operatorElement.click();
        facetHeader.operatorElement.click();
        expect(facet.queryController.executeQuery).toHaveBeenCalledTimes(2);
      });
    });
  });
}
