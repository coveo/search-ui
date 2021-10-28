import { $$ } from '../../../../src/utils/Dom';
import { DynamicFacetHeaderCollapseToggle } from '../../../../src/ui/DynamicFacet/DynamicFacetHeader/DynamicFacetHeaderCollapseToggle';
import { IDynamicFacetHeaderOptions } from '../../../../src/ui/DynamicFacet/DynamicFacetHeader/DynamicFacetHeader';

export function DynamicFacetHeaderCollapseToggleTest() {
  describe('DynamicFacetHeaderCollapseToggle', () => {
    let collapseToggle: DynamicFacetHeaderCollapseToggle;
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

      collapseToggle = new DynamicFacetHeaderCollapseToggle(options);
    });

    function getCollapseButton() {
      return $$(collapseToggle.element).find('.coveo-dynamic-facet-header-collapse');
    }

    function getExpandButton() {
      return $$(collapseToggle.element).find('.coveo-dynamic-facet-header-expand');
    }

    function getAriaExpandedState(el: HTMLElement) {
      return $$(el).getAttribute('aria-expanded');
    }

    it(`should create a collapse button`, () => {
      expect(getCollapseButton()).toBeTruthy();
      expect(getExpandButton()).toBeFalsy();
    });

    it(`when calling toggleButtons with isCollapsed to true
      should display the expand button and hide the collapse button`, () => {
      collapseToggle.toggleButton(true);

      expect(getCollapseButton()).toBeFalsy();
      expect(getExpandButton()).toBeTruthy();
      expect(getAriaExpandedState(getExpandButton())).toEqual('false');
    });

    it(`when calling toggleButtons with isCollapsed to false
      should display the collapse button and hide the expand button`, () => {
      collapseToggle.toggleButton(true);
      collapseToggle.toggleButton(false);

      expect(getCollapseButton()).toBeTruthy();
      expect(getExpandButton()).toBeFalsy();
      expect(getAriaExpandedState(getCollapseButton())).toEqual('true');
    });

    it(`when clicking on the collapse button
      should call toggleCollapse on the DynamicFacet component`, () => {
      $$(getCollapseButton()).trigger('click');

      expect(options.toggleCollapse).toHaveBeenCalled();
    });
  });
}
