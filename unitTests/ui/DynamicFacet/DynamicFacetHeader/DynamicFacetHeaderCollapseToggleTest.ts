import { $$ } from '../../../../src/utils/Dom';
import { DynamicFacetHeaderCollapseToggle } from '../../../../src/ui/DynamicFacet/DynamicFacetHeader/DynamicFacetHeaderCollapseToggle';
import { IDynamicFacetHeaderOptions } from '../../../../src/ui/DynamicFacet/DynamicFacetHeader/DynamicFacetHeader';

export function DynamicFacetHeaderCollapseToggleTest() {
  describe('DynamicFacetHeaderCollapseToggle', () => {
    let collapseToggle: DynamicFacetHeaderCollapseToggle;
    let collapseToggleElement: HTMLElement;
    let collapseBtnElement: HTMLElement;
    let expandBtnElement: HTMLElement;
    let options: IDynamicFacetHeaderOptions;

    beforeEach(() => {
      options = {
        title: 'hello',
        clear: jasmine.createSpy('clear'),
        enableCollapse: true,
        toggleCollapse: jasmine.createSpy('toggleCollapse'),
        collapse: jasmine.createSpy('collapse'),
        expand: jasmine.createSpy('clear')
      };
      initializeComponent();
    });

    function initializeComponent() {
      collapseToggle = new DynamicFacetHeaderCollapseToggle(options);
      collapseToggleElement = collapseToggle.element;
      collapseBtnElement = $$(collapseToggleElement).find('.coveo-dynamic-facet-header-collapse');
      expandBtnElement = $$(collapseToggleElement).find('.coveo-dynamic-facet-header-expand');
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
      should call collapse on the DynamicFacet component`, () => {
      $$(collapseBtnElement).trigger('click');

      expect(options.collapse).toHaveBeenCalled();
    });

    it(`when clicking on the expand button
    should call expand on the DynamicFacet component`, () => {
      collapseToggle.toggleButtons(true);
      $$(expandBtnElement).trigger('click');

      expect(options.expand).toHaveBeenCalled();
    });
  });
}
