import { $$ } from '../../../../src/utils/Dom';
import {
  MLFacetHeaderCollapseToggle,
  IMLFacetCollapseToggleOptions
} from '../../../../src/ui/MLFacet/MLFacetHeader/MLFacetHeaderCollapseToggle';

export function MLFacetHeaderCollapseToggleTest() {
  describe('MLFacetHeaderCollapseToggle', () => {
    let collapseToggle: MLFacetHeaderCollapseToggle;
    let collapseToggleElement: HTMLElement;
    let baseOptions: IMLFacetCollapseToggleOptions;

    beforeEach(() => {
      baseOptions = {
        collapsed: false
      };
      initializeComponent();
    });

    function initializeComponent() {
      collapseToggle = new MLFacetHeaderCollapseToggle(baseOptions);
      collapseToggleElement = collapseToggle.element;
    }

    it(`when passing the option enableCollapse (true)
      should display the accessible collapse button`, () => {
      const collapseElement = $$(collapseToggleElement).find('.coveo-facet-header-collapse');
      const expandElement = $$(collapseToggleElement).find('.coveo-facet-header-expand');

      expect($$(collapseElement).getAttribute('aria-label')).toBeTruthy();
      expect($$(collapseElement).getAttribute('title')).toBeTruthy();
      expect($$(collapseElement).isVisible()).toBe(true);
      expect($$(expandElement).isVisible()).toBe(false);
    });

    it(`when passing the option enableCollapse (true) & collapsedByDefault (true)
      should display the accessible expand button`, () => {
      baseOptions.collapsed = true;
      initializeComponent();

      const collapseElement = $$(collapseToggleElement).find('.coveo-facet-header-collapse');
      const expandElement = $$(collapseToggleElement).find('.coveo-facet-header-expand');

      expect($$(expandElement).getAttribute('aria-label')).toBeTruthy();
      expect($$(expandElement).getAttribute('title')).toBeTruthy();
      expect($$(collapseElement).isVisible()).toBe(false);
      expect($$(expandElement).isVisible()).toBe(true);
    });

    it(`when clicking on the collapse button
      should switch the option correctly`, () => {
      const collapseElement = $$(collapseToggleElement).find('.coveo-facet-header-collapse');
      const expandElement = $$(collapseToggleElement).find('.coveo-facet-header-expand');
      $$(collapseElement).trigger('click');

      expect($$(collapseElement).isVisible()).toBe(false);
      expect($$(expandElement).isVisible()).toBe(true);
    });

    it(`when clicking on the expand button
      should switch the option correctly`, () => {
      baseOptions.collapsed = true;
      initializeComponent();

      const collapseElement = $$(collapseToggleElement).find('.coveo-facet-header-collapse');
      const expandElement = $$(collapseToggleElement).find('.coveo-facet-header-expand');
      $$(expandElement).trigger('click');

      expect($$(collapseElement).isVisible()).toBe(true);
      expect($$(expandElement).isVisible()).toBe(false);
    });
  });
}
