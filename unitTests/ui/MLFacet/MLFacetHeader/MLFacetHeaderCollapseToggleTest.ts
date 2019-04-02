import { $$ } from '../../../../src/utils/Dom';
import { MLFacetHeaderCollapseToggle } from '../../../../src/ui/MLFacet/MLFacetHeader/MLFacetHeaderCollapseToggle';
import { MLFacetTestUtils } from '../MLFacetTestUtils';
import { MLFacet } from '../../../../src/ui/MLFacet/MLFacet';

export function MLFacetHeaderCollapseToggleTest() {
  describe('MLFacetHeaderCollapseToggle', () => {
    let collapseToggle: MLFacetHeaderCollapseToggle;
    let collapseToggleElement: HTMLElement;
    let facet: MLFacet;

    beforeEach(() => {
      facet = MLFacetTestUtils.createFakeFacet();
      initializeComponent();
    });

    function initializeComponent() {
      collapseToggle = new MLFacetHeaderCollapseToggle(facet);
      collapseToggleElement = collapseToggle.element;
    }

    it(`should display the accessible collapse & expand buttons`, () => {
      const collapseElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-collapse');
      const expandElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-expand');

      expect($$(collapseElement).getAttribute('aria-label')).toBeTruthy();
      expect($$(collapseElement).getAttribute('title')).toBeTruthy();
      expect($$(collapseElement).isVisible()).toBe(true);
      expect($$(expandElement).isVisible()).toBe(false);
    });

    it(`when passing the option enableCollapse (true) & collapsedByDefault (true)
      should display the accessible expand button`, () => {
      facet.options.collapsedByDefault = true;
      initializeComponent();

      const collapseElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-collapse');
      const expandElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-expand');

      expect($$(expandElement).getAttribute('aria-label')).toBeTruthy();
      expect($$(expandElement).getAttribute('title')).toBeTruthy();
      expect($$(collapseElement).isVisible()).toBe(false);
      expect($$(expandElement).isVisible()).toBe(true);
    });

    it(`when clicking on the collapse button
      should switch the option correctly`, () => {
      const collapseElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-collapse');
      const expandElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-expand');
      $$(collapseElement).trigger('click');

      expect($$(collapseElement).isVisible()).toBe(false);
      expect($$(expandElement).isVisible()).toBe(true);
    });

    it(`when clicking on the expand button
      should switch the option correctly`, () => {
      facet.options.collapsedByDefault = true;
      initializeComponent();

      const collapseElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-collapse');
      const expandElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-expand');
      $$(expandElement).trigger('click');

      expect($$(collapseElement).isVisible()).toBe(true);
      expect($$(expandElement).isVisible()).toBe(false);
    });
  });
}
