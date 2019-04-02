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
      facet = MLFacetTestUtils.createFakeFacet({
        enableCollapse: true,
        collapsedByDefault: false
      });
      initializeComponent();
    });

    function initializeComponent() {
      collapseToggle = new MLFacetHeaderCollapseToggle(facet);
      collapseToggleElement = collapseToggle.element;
    }

    it(`should display the collapse & expand buttons`, () => {
      const collapseElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-collapse');
      const expandElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-expand');

      expect($$(collapseElement).isVisible()).toBe(true);
      expect($$(expandElement).isVisible()).toBe(false);
    });

    it(`should not add the "coveo-ml-facet-collapsed" class to the facet`, () => {
      expect($$(facet.element).hasClass('coveo-ml-facet-collapsed')).toBe(false);
    });

    it(`when passing the option enableCollapse (true) & collapsedByDefault (true)
      should display the expand button and add the "coveo-ml-facet-collapsed" class to the facet`, () => {
      facet.options.collapsedByDefault = true;
      initializeComponent();

      const collapseElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-collapse');
      const expandElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-expand');

      expect($$(collapseElement).isVisible()).toBe(false);
      expect($$(expandElement).isVisible()).toBe(true);
      expect($$(facet.element).hasClass('coveo-ml-facet-collapsed')).toBe(true);
    });

    it(`when clicking on the collapse button
      should switch the option correctly`, () => {
      const collapseElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-collapse');
      const expandElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-expand');
      $$(collapseElement).trigger('click');

      expect($$(collapseElement).isVisible()).toBe(false);
      expect($$(expandElement).isVisible()).toBe(true);
      expect($$(facet.element).hasClass('coveo-ml-facet-collapsed')).toBe(true);
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
      expect($$(facet.element).hasClass('coveo-ml-facet-collapsed')).toBe(false);
    });
  });
}
