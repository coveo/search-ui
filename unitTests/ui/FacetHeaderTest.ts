import { FacetHeader } from '../../src/ui/Facet/FacetHeader';
import { IFacetHeaderOptions } from '../../src/ui/Facet/FacetHeader';
import { $$ } from '../../src/utils/Dom';
import { Facet } from '../../src/ui/Facet/Facet';
import { IFacetOptions } from '../../src/ui/Facet/Facet';
import { registerCustomMatcher } from '../CustomMatchers';
import * as Mock from '../MockEnvironment';
import { FacetSettings } from '../../src/ui/Facet/FacetSettings';
import { Simulate } from '../Simulate';
import { KEYBOARD } from '../../src/Core';

export function FacetHeaderTest() {
  describe('FacetHeader', () => {
    let facetHeader: FacetHeader;
    let baseOptions: IFacetHeaderOptions;

    function initFacetHeader() {
      facetHeader = new FacetHeader(baseOptions);
      facetHeader.build();
    }

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
      baseOptions.title = 'this is a title';
      initFacetHeader();

      const title = $$(facetHeader.element).find('.coveo-facet-header-title');
      expect($$(title).text()).toBe('this is a title');
    });

    it('the title should be accessible', () => {
      baseOptions.title = 'this is a title';
      initFacetHeader();

      const title = $$(facetHeader.element).find('.coveo-facet-header-title');
      expect($$(title).getAttribute('role')).toBe('heading');
      expect($$(title).getAttribute('aria-level')).toBe('2');
      expect($$(title).getAttribute('aria-label')).toBeTruthy();
    });

    it('should build an icon if specified', () => {
      baseOptions.icon = 'this-is-an-icon';
      initFacetHeader();

      const icon = $$(facetHeader.element).find('.coveo-icon-custom.this-is-an-icon');
      expect(icon).not.toBeNull();
    });

    describe('with a facet', () => {
      beforeEach(() => {
        baseOptions.facet = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field'
        }).cmp;
        registerCustomMatcher();
      });

      it('toggle operator should be available if the facet has the option', () => {
        baseOptions.facet.options.enableTogglingOperator = true;
        initFacetHeader();

        expect(facetHeader.operatorElement.style.display).toEqual('block');

        baseOptions.facet.options.enableTogglingOperator = false;
        initFacetHeader();

        expect(facetHeader.operatorElement.style.display).toEqual('none');
      });

      it('allow to collapse and expand a facet', () => {
        baseOptions.settingsKlass = FacetSettings;
        initFacetHeader();

        facetHeader.collapseFacet();
        expect($$(facetHeader.options.facetElement).hasClass('coveo-facet-collapsed')).toBe(true);

        facetHeader.expandFacet();
        expect($$(facetHeader.options.facetElement).hasClass('coveo-facet-collapsed')).not.toBe(true);
      });

      it('allow to switch or and and', () => {
        const facet = baseOptions.facet;
        facet.options.enableTogglingOperator = true;
        facet.getSelectedValues = jasmine.createSpy('spy');
        (<jasmine.Spy>facet.getSelectedValues).and.returnValue(['a', 'b']);
        baseOptions.settingsKlass = FacetSettings;

        initFacetHeader();
        facetHeader.switchToOr();
        expect(facet.queryStateModel.set).toHaveBeenCalledWith(facet.operatorAttributeId, 'or');

        facetHeader.switchToAnd();
        expect(facet.queryStateModel.set).toHaveBeenCalledWith(facet.operatorAttributeId, 'and');

        facetHeader.operatorElement.click();
        facetHeader.operatorElement.click();
        expect(facet.queryController.executeQuery).toHaveBeenCalledTimes(2);
      });

      describe('when the facet has one selected value', () => {
        beforeEach(() => {
          baseOptions.facet.selectValue('foobar');
          initFacetHeader();
        });

        it('when clicking the eraser, it resets the facet', () => {
          facetHeader.eraserElement.click();
          expect(baseOptions.facet.getSelectedValues().length).toBe(0);
        });

        it('when pressing Enter key on the eraser, it resets the facet', () => {
          Simulate.keyUp(facetHeader.eraserElement, KEYBOARD.ENTER);
          expect(baseOptions.facet.getSelectedValues().length).toBe(0);
        });
      });
    });
  });
}
