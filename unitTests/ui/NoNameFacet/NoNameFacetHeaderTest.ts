import { $$ } from '../../../src/utils/Dom';
import { NoNameFacetHeader, INoNameFacetHeaderOptions } from '../../../src/ui/NoNameFacet/NoNameFacetHeader';

export function NoNameFacetHeaderTest() {
  describe('NoNameFacetHeader', () => {
    let noNameFacetHeader: NoNameFacetHeader;
    let baseOptions: INoNameFacetHeaderOptions;

    beforeEach(() => {
      baseOptions = {
        rootFacetOptions: {
          title: 'Best facet'
        }
      };
      initializeComponent();
    });

    function initializeComponent() {
      noNameFacetHeader = new NoNameFacetHeader(baseOptions);
    }

    it('should create an accessible title', () => {
      const titleElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-title');

      expect($$(titleElement).text()).toBe(baseOptions.rootFacetOptions.title);
      expect($$(titleElement).getAttribute('role')).toBe('heading');
      expect($$(titleElement).getAttribute('aria-level')).toBe('2');
      expect($$(titleElement).getAttribute('aria-label')).toBeTruthy();
    });

    it('should create a hidden waitAnimationElement', () => {
      const waitAnimationElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-wait-animation');

      expect($$(waitAnimationElement).isVisible()).toBe(false);
    });

    it(`when calling showWaitAnimation
      waitAnimationElement show be visible`, () => {
      const waitAnimationElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-wait-animation');
      noNameFacetHeader.showWaitAnimation();

      expect($$(waitAnimationElement).isVisible()).toBe(true);
    });

    it('should create an accessible hidden clear button', () => {
      const clearElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-eraser');

      expect($$(clearElement).getAttribute('role')).toBe('button');
      expect($$(clearElement).getAttribute('tabindex')).toBe('0');
      expect($$(clearElement).getAttribute('aria-label')).toBeTruthy();
      expect($$(clearElement).hasClass('coveo-facet-header-eraser-visible')).toBe(false);
    });

    it(`when calling showClear
      the clear button show be visible`, () => {
      const clearElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-eraser');

      noNameFacetHeader.showClear();

      expect($$(clearElement).hasClass('coveo-facet-header-eraser-visible')).toBe(true);
    });

    it(`when passing the option enableTogglingOperator (true)
      should display the accessible operator AND button`, () => {
      baseOptions.rootFacetOptions.enableTogglingOperator = true;
      initializeComponent();
      const operatorElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-operator');

      expect($$(operatorElement).getAttribute('role')).toBe('button');
      expect($$(operatorElement).getAttribute('tabindex')).toBe('0');
      expect($$(operatorElement).getAttribute('aria-label')).toBeTruthy();
      expect($$(operatorElement).findClass('coveo-and')).toBeTruthy();
    });

    it(`when passing the option enableTogglingOperator (true) & useAnd (false)
      should display the operator OR button`, () => {
      baseOptions.rootFacetOptions.enableTogglingOperator = true;
      baseOptions.rootFacetOptions.useAnd = false;
      initializeComponent();
      const operatorElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-operator');

      expect($$(operatorElement).findClass('coveo-or')).toBeTruthy();
    });
  });
}
