import { $$ } from '../../../src/utils/Dom';
import { NoNameFacetHeader, INoNameFacetHeaderOptions } from '../../../src/ui/NoNameFacet/NoNameFacetHeader/NoNameFacetHeader';

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
      noNameFacetHeader.toggleLoading(true);

      expect($$(waitAnimationElement).isVisible()).toBe(true);
    });

    it('should create an accessible hidden clear button', () => {
      const clearElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-eraser');

      expect($$(clearElement).getAttribute('aria-label')).toBeTruthy();
      expect($$(clearElement).getAttribute('title')).toBeTruthy();
      expect($$(clearElement).isVisible()).toBe(false);
    });

    it(`when calling showClear
      the clear button should be visible`, () => {
      const clearElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-eraser');

      noNameFacetHeader.toggleClear(true);

      expect(clearElement.style.display).toBe('block');
    });

    it(`when passing the option enableOperator (true)
      should display the accessible operator "Or" button`, () => {
      baseOptions.rootFacetOptions.enableOperator = true;
      initializeComponent();

      const orElement = $$(noNameFacetHeader.element).find('.coveo-or').parentElement;
      const andElement = $$(noNameFacetHeader.element).find('.coveo-and').parentElement;

      expect($$(orElement).getAttribute('aria-label')).toBeTruthy();
      expect($$(orElement).getAttribute('title')).toBeTruthy();
      expect($$(orElement).isVisible()).toBe(true);
      expect($$(andElement).isVisible()).toBe(false);
    });

    it(`when passing the option enableOperator (true) & useAnd (true)
      should display the operator "And" button`, () => {
      baseOptions.rootFacetOptions.enableOperator = true;
      baseOptions.rootFacetOptions.useAnd = true;
      initializeComponent();

      const orElement = $$(noNameFacetHeader.element).find('.coveo-or').parentElement;
      const andElement = $$(noNameFacetHeader.element).find('.coveo-and').parentElement;

      expect($$(andElement).getAttribute('aria-label')).toBeTruthy();
      expect($$(andElement).getAttribute('title')).toBeTruthy();
      expect($$(orElement).isVisible()).toBe(false);
      expect($$(andElement).isVisible()).toBe(true);
    });

    it(`when clicking on the "Or" operator button
      should switch the option correctly`, () => {
      baseOptions.rootFacetOptions.enableOperator = true;
      initializeComponent();

      const orElement = $$(noNameFacetHeader.element).find('.coveo-or').parentElement;
      const andElement = $$(noNameFacetHeader.element).find('.coveo-and').parentElement;

      $$(orElement).trigger('click');
      expect($$(orElement).isVisible()).toBe(false);
      expect($$(andElement).isVisible()).toBe(true);
    });

    it(`when clicking on the "And" operator button
      should switch the option correctly`, () => {
      baseOptions.rootFacetOptions.enableOperator = true;
      baseOptions.rootFacetOptions.useAnd = true;
      initializeComponent();

      const orElement = $$(noNameFacetHeader.element).find('.coveo-or').parentElement;
      const andElement = $$(noNameFacetHeader.element).find('.coveo-and').parentElement;

      $$(andElement).trigger('click');
      expect($$(orElement).isVisible()).toBe(true);
      expect($$(andElement).isVisible()).toBe(false);
    });

    it(`when passing the option enableCollapse (true)
      should display the accessible collapse button`, () => {
      baseOptions.rootFacetOptions.enableCollapse = true;
      initializeComponent();

      const collapseElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-collapse');
      const expandElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-expand');

      expect($$(collapseElement).getAttribute('aria-label')).toBeTruthy();
      expect($$(collapseElement).getAttribute('title')).toBeTruthy();
      expect($$(collapseElement).isVisible()).toBe(true);
      expect($$(expandElement).isVisible()).toBe(false);
    });

    it(`when passing the option enableCollapse (true) & isCollapsed (true)
      should display the accessible expand button`, () => {
      baseOptions.rootFacetOptions.enableCollapse = true;
      baseOptions.rootFacetOptions.isCollapsed = true;
      initializeComponent();

      const collapseElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-collapse');
      const expandElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-expand');

      expect($$(expandElement).getAttribute('aria-label')).toBeTruthy();
      expect($$(expandElement).getAttribute('title')).toBeTruthy();
      expect($$(collapseElement).isVisible()).toBe(false);
      expect($$(expandElement).isVisible()).toBe(true);
    });

    it(`when clicking on the collapse button
      should switch the option correctly`, () => {
      baseOptions.rootFacetOptions.enableCollapse = true;
      initializeComponent();

      const collapseElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-collapse');
      const expandElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-expand');
      $$(collapseElement).trigger('click');

      expect($$(collapseElement).isVisible()).toBe(false);
      expect($$(expandElement).isVisible()).toBe(true);
    });

    it(`when clicking on the expand button
      should switch the option correctly`, () => {
      baseOptions.rootFacetOptions.enableCollapse = true;
      baseOptions.rootFacetOptions.isCollapsed = true;
      initializeComponent();

      const collapseElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-collapse');
      const expandElement = $$(noNameFacetHeader.element).find('.coveo-facet-header-expand');
      $$(expandElement).trigger('click');

      expect($$(collapseElement).isVisible()).toBe(true);
      expect($$(expandElement).isVisible()).toBe(false);
    });
  });
}
