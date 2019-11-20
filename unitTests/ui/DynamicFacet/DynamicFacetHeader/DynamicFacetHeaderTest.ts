import { $$ } from '../../../../src/utils/Dom';
import { DynamicFacetHeader } from '../../../../src/ui/DynamicFacet/DynamicFacetHeader/DynamicFacetHeader';
import { DynamicFacet } from '../../../../src/ui/DynamicFacet/DynamicFacet';
import { IDynamicFacetOptions } from '../../../../src/ui/DynamicFacet/IDynamicFacet';
import { DynamicFacetTestUtils } from '../DynamicFacetTestUtils';
import { analyticsActionCauseList } from '../../../../src/ui/Analytics/AnalyticsActionListMeta';

export function DynamicFacetHeaderTest() {
  describe('DynamicFacetHeader', () => {
    let dynamicFacetHeader: DynamicFacetHeader;
    let facet: DynamicFacet;
    let baseOptions: IDynamicFacetOptions;

    beforeEach(() => {
      baseOptions = { title: 'hello' };
      initializeComponent();
    });

    function initializeComponent() {
      facet = DynamicFacetTestUtils.createFakeFacet(baseOptions);
      dynamicFacetHeader = new DynamicFacetHeader(facet);
    }

    function collapseElement() {
      return $$(dynamicFacetHeader.element).find('.coveo-dynamic-facet-header-collapse');
    }

    function expandElement() {
      return $$(dynamicFacetHeader.element).find('.coveo-dynamic-facet-header-expand');
    }

    function titleElement() {
      return $$(dynamicFacetHeader.element).find('.coveo-dynamic-facet-header-title');
    }

    function clearElement() {
      return $$(dynamicFacetHeader.element).find('.coveo-dynamic-facet-header-clear');
    }

    it('should create an accessible title', () => {
      expect($$(titleElement()).getAttribute('aria-label')).toBeTruthy();
      expect($$(titleElement()).find('span').innerHTML).toBe(baseOptions.title);
    });

    it('should create a hidden waitAnimationElement', () => {
      const waitAnimationElement = $$(dynamicFacetHeader.element).find('.coveo-dynamic-facet-header-wait-animation');
      expect($$(waitAnimationElement).isVisible()).toBe(false);
    });

    it(`when calling showLoading
      waitAnimationElement show be visible after the delay`, done => {
      const waitAnimationElement = $$(dynamicFacetHeader.element).find('.coveo-dynamic-facet-header-wait-animation');
      dynamicFacetHeader.showLoading();
      expect($$(waitAnimationElement).isVisible()).toBe(false);

      setTimeout(() => {
        expect($$(waitAnimationElement).isVisible()).toBe(true);
        done();
      }, DynamicFacetHeader.showLoadingDelay + 1);
    });

    it('should create an hidden clear button', () => {
      expect($$(clearElement()).isVisible()).toBe(false);
    });

    it(`when calling showClear
      the clear button should be visible`, () => {
      dynamicFacetHeader.toggleClear(true);

      expect($$(clearElement()).isVisible()).toBe(true);
    });

    it(`when clicking on the clear button
      it should reset the facet & trigger a new query`, () => {
      dynamicFacetHeader.toggleClear(true);
      $$(clearElement()).trigger('click');

      expect(facet.reset).toHaveBeenCalled();
      expect(facet.triggerNewQuery).toHaveBeenCalled();
    });

    it(`when clicking on the clear button
      it should log an analytics event`, () => {
      dynamicFacetHeader.toggleClear(true);
      facet.triggerNewQuery = beforeExecuteQuery => {
        beforeExecuteQuery();
      };

      $$(clearElement()).trigger('click');
      expect(facet.logAnalyticsEvent).toHaveBeenCalledWith(analyticsActionCauseList.dynamicFacetClearAll, facet.basicAnalyticsFacetState);
    });

    it(`when clicking on the clear button
      should perform the correct actions on the facet`, () => {
      dynamicFacetHeader.toggleClear(true);
      $$(clearElement()).trigger('click');

      expect(facet.reset).toHaveBeenCalledTimes(1);
      expect(facet.enableFreezeFacetOrderFlag).toHaveBeenCalledTimes(1);
      expect(facet.triggerNewQuery).toHaveBeenCalledTimes(1);
      expect(facet.scrollToTop).toHaveBeenCalledTimes(1);
    });

    describe('when passing the option enableCollapse as false', () => {
      beforeEach(() => {
        baseOptions.enableCollapse = false;
        initializeComponent();
      });

      it('should not create collapse & expand buttons', () => {
        expect(collapseElement()).toBeFalsy();
        expect(expandElement()).toBeFalsy();
      });

      it('should not throw an error when calling the toggleCollapse method', () => {
        expect(() => dynamicFacetHeader.toggleCollapse(true)).not.toThrow();
      });
    });

    describe('when passing the option enableCollapse as true', () => {
      beforeEach(() => {
        baseOptions.enableCollapse = true;
        initializeComponent();
      });

      it('should create collapse & expand buttons', () => {
        expect(collapseElement()).toBeTruthy();
        expect(expandElement()).toBeTruthy();
      });

      it('should add the coveo-clickable class to the title', () => {
        expect($$(titleElement()).hasClass('coveo-clickable')).toBe(true);
      });

      it(`when clicking on the title
        should call the toggleCollapse method of the DynamicFacet`, () => {
        $$(titleElement()).trigger('click');

        expect(facet.toggleCollapse).toHaveBeenCalledTimes(1);
      });
    });
  });
}
