import { $$ } from '../../../../src/utils/Dom';
import { DynamicFacetHeader, IDynamicFacetHeaderOptions } from '../../../../src/ui/DynamicFacet/DynamicFacetHeader/DynamicFacetHeader';

export function DynamicFacetHeaderTest() {
  describe('DynamicFacetHeader', () => {
    let dynamicFacetHeader: DynamicFacetHeader;
    let options: IDynamicFacetHeaderOptions;

    beforeEach(() => {
      options = {
        id: 'id',
        title: 'hello',
        clear: jasmine.createSpy('clear'),
        enableCollapse: true,
        toggleCollapse: jasmine.createSpy('toggleCollapse'),
        collapse: jasmine.createSpy('collapse'),
        expand: jasmine.createSpy('clear'),
        headingLevel: 2
      };
      initializeComponent();
    });

    function initializeComponent() {
      dynamicFacetHeader = new DynamicFacetHeader(options);
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
      expect($$(titleElement()).find('span').innerHTML).toBe(options.title);
      expect($$(titleElement()).getAttribute('id')).toBe(`${options.id}-facet-heading`);
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
      it should call the clear option`, () => {
      dynamicFacetHeader.toggleClear(true);
      $$(clearElement()).trigger('click');

      expect(options.clear).toHaveBeenCalled();
    });

    describe('when passing the option enableCollapse as false', () => {
      beforeEach(() => {
        options.enableCollapse = false;
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
        options.enableCollapse = true;
        initializeComponent();
      });

      it('should create a collapse button', () => {
        expect(collapseElement()).toBeTruthy();
      });

      it('should add the coveo-clickable class to the title', () => {
        expect($$(titleElement()).hasClass('coveo-clickable')).toBe(true);
      });

      it(`when clicking on the title
        should call the toggleCollapse method of the DynamicFacet`, () => {
        $$(titleElement()).trigger('click');

        expect(options.toggleCollapse).toHaveBeenCalledTimes(1);
      });
    });
  });
}
