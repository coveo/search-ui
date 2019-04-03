import { $$ } from '../../../../src/utils/Dom';
import { MLFacetHeaderCollapseToggle } from '../../../../src/ui/MLFacet/MLFacetHeader/MLFacetHeaderCollapseToggle';
import { MLFacetTestUtils } from '../MLFacetTestUtils';
import { MLFacet } from '../../../../src/ui/MLFacet/MLFacet';

export function MLFacetHeaderCollapseToggleTest() {
  describe('MLFacetHeaderCollapseToggle', () => {
    let collapseToggle: MLFacetHeaderCollapseToggle;
    let collapseToggleElement: HTMLElement;
    let collapseBtnElement: HTMLElement;
    let expandBtnElement: HTMLElement;
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
      collapseBtnElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-collapse');
      expandBtnElement = $$(collapseToggleElement).find('.coveo-ml-facet-header-expand');
    }

    it(`should create the collapse & expand buttons
      but only display the collapse button by default`, () => {
      expect($$(collapseBtnElement).isVisible()).toBe(true);
      expect($$(expandBtnElement).isVisible()).toBe(false);
    });

    it(`when calling toggleButtons with isCollapsed to true
      should display the expand button and hide the collapse button`, () => {
      collapseToggle.toggleButtons(true);
      expect($$(collapseBtnElement).isVisible()).toBe(false);
      expect($$(expandBtnElement).isVisible()).toBe(true);
    });

    it(`when calling toggleButtons with isCollapsed to false
      should display the collapse button and hide the expand button`, () => {
      collapseToggle.toggleButtons(true);
      collapseToggle.toggleButtons(false);
      expect($$(collapseBtnElement).isVisible()).toBe(true);
      expect($$(expandBtnElement).isVisible()).toBe(false);
    });

    it(`when clicking on the collapse button
      should call collapse on the MLFacet component`, () => {
      $$(collapseBtnElement).trigger('click');

      expect(facet.collapse).toHaveBeenCalled();
    });

    it(`when clicking on the expand button
    should call expand on the MLFacet component`, () => {
      collapseToggle.toggleButtons(true);
      $$(expandBtnElement).trigger('click');

      expect(facet.expand).toHaveBeenCalled();
    });
  });
}
