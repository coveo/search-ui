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

      expect($$(clearElement).getAttribute('aria-label')).toBeTruthy();
      expect($$(clearElement).getAttribute('title')).toBeTruthy();
      expect($$(clearElement).hasClass('coveo-facet-header-eraser-visible')).toBe(false);
    });

    it(`when calling showClear
      the clear button show be visible`, () => {
      const clearElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-eraser');

      noNameFacetHeader.showClear();

      expect($$(clearElement).hasClass('coveo-facet-header-eraser-visible')).toBe(true);
    });

    it(`when passing the option enableOperator (true)
      should display the accessible operator AND button`, () => {
      baseOptions.rootFacetOptions.enableOperator = true;
      initializeComponent();
      const operatorElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-operator');

      expect($$(operatorElement).getAttribute('aria-label')).toBeTruthy();
      expect($$(operatorElement).getAttribute('title')).toBeTruthy();
      expect($$(operatorElement).findClass('coveo-and')).toBeTruthy();
    });

    it(`when passing the option enableOperator (true) & useAnd (false)
      should display the operator OR button`, () => {
      baseOptions.rootFacetOptions.enableOperator = true;
      baseOptions.rootFacetOptions.useAnd = false;
      initializeComponent();
      const operatorElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-operator');

      expect($$(operatorElement).findClass('coveo-or')).toBeTruthy();
    });

    it(`when clicking on the operator button
      should switch the option correctly`, () => {
      baseOptions.rootFacetOptions.enableOperator = true;
      initializeComponent();
      const operatorElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-operator');
      $$(operatorElement).trigger('click');

      expect($$(operatorElement).findClass('coveo-or')).toBeTruthy();
    });

    it(`when passing the option enableCollapse (true)
      should display the accessible collapse button`, () => {
      baseOptions.rootFacetOptions.enableCollapse = true;
      initializeComponent();
      const collapseElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-collapse');

      expect($$(collapseElement).getAttribute('aria-label')).toBeTruthy();
      expect($$(collapseElement).getAttribute('title')).toBeTruthy();
      expect($$(collapseElement).findClass('coveo-facet-settings-section-show-svg')).toBeTruthy();
    });

    it(`when passing the option enableCollapse (true) & isCollapsed (false)
      should display the collapse/hide button`, () => {
      baseOptions.rootFacetOptions.enableCollapse = true;
      baseOptions.rootFacetOptions.isCollapsed = true;
      initializeComponent();
      const collapseElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-collapse');

      expect($$(collapseElement).findClass('coveo-facet-settings-section-hide-svg')).toBeTruthy();
    });

    it(`when clicking on the collapse button
      should switch the option correctly`, () => {
      baseOptions.rootFacetOptions.enableCollapse = true;
      initializeComponent();
      const collapseElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-collapse');
      $$(collapseElement).trigger('click');

      expect($$(collapseElement).findClass('coveo-facet-settings-section-hide-svg')).toBeTruthy();
    });
  });
}
