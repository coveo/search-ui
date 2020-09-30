import { $$ } from '../../../../src/utils/Dom';
import {
  DynamicFacetHeaderButton,
  IDynamicFacetHeaderButtonOptions
} from '../../../../src/ui/DynamicFacet/DynamicFacetHeader/DynamicFacetHeaderButton';
import { SVGIcons } from '../../../../src/utils/SVGIcons';

export function DynamicFacetHeaderButtonTest() {
  describe('DynamicFacetHeaderButton', () => {
    let button: DynamicFacetHeaderButton;
    let buttonElement: HTMLElement;
    let baseOptions: IDynamicFacetHeaderButtonOptions;

    beforeEach(() => {
      baseOptions = {
        label: 'title'
      };
      initializeComponent();
    });

    function initializeComponent() {
      button = new DynamicFacetHeaderButton(baseOptions);
      buttonElement = button.element;
    }

    it('should initialize without errors', () => {
      expect(initializeComponent).not.toThrow();
    });

    it('should create without errors', () => {
      expect(() => new DynamicFacetHeaderButton(baseOptions)).not.toThrow();
    });

    it(`when no icon options ("iconSVG" & "iconClassName") are passed
      should put the the "label" in the html directly, not in the "title" nor "aria-label"`, () => {
      expect(buttonElement.innerHTML).toBe(baseOptions.label);
      expect(buttonElement.getAttribute('title')).toBeFalsy();
      expect(buttonElement.getAttribute('aria-label')).toBeFalsy();
    });

    it(`when no option "classname" is passed
      should at least put the base coveo-dynamic-facet-header-btn class`, () => {
      expect(buttonElement.getAttribute('class')).toBe('coveo-dynamic-facet-header-btn');
    });

    it(`when the option "classname" is passed
      should put it in the class of the element`, () => {
      const className = 'coveo-test-class';
      baseOptions.className = className;
      initializeComponent();

      expect(buttonElement.getAttribute('class')).toBe('coveo-dynamic-facet-header-btn coveo-test-class');
    });

    it(`when the option "action" is passed
      should be called on click`, () => {
      const action = jasmine.createSpy('action');
      baseOptions.action = action;
      initializeComponent();

      buttonElement.click();
      expect(action).toHaveBeenCalled();
    });

    it(`when the option "shouldDisplay" is set to "undefined" 
      element should be visible`, () => {
      baseOptions.shouldDisplay = undefined;
      initializeComponent();

      expect($$(buttonElement).isVisible()).toBe(true);
    });

    it(`when the option "shouldDisplay" is set to "true" 
      element should be visible`, () => {
      baseOptions.shouldDisplay = true;
      initializeComponent();

      expect($$(buttonElement).isVisible()).toBe(true);
    });

    it(`when the button is hidden then "toggle" is called with "true"
      element should become visible`, () => {
      baseOptions.shouldDisplay = false;
      initializeComponent();

      button.toggle(true);
      expect($$(buttonElement).isVisible()).toBe(true);
    });

    it(`when the button is visible then "toggle" is called with "false"
      element should become hidden`, () => {
      button.toggle(false);
      expect($$(buttonElement).isVisible()).toBe(false);
    });

    it('when "toggle" is called with "true", element should be focused', () => {
      spyOn(button.element, 'focus');
      button.toggle(true);
      expect(button.element.focus).toHaveBeenCalledTimes(1);
    });

    it('when "toggle" is called with "false", element should not be focused', () => {
      spyOn(button.element, 'focus');
      button.toggle(false);
      expect(button.element.focus).not.toHaveBeenCalled();
    });

    describe('when the icon options ("iconSVG" & "iconClassName") are passed', () => {
      let svg: HTMLElement;

      beforeEach(() => {
        baseOptions = {
          label: 'title',
          iconSVG: SVGIcons.icons.facetExpand,
          iconClassName: 'coveo-dynamic-facet-header-expand'
        };
        initializeComponent();
        svg = $$(buttonElement).children()[0];
      });

      it('child should the "label" as a "title" & "aria-label" attribute', () => {
        expect(buttonElement.getAttribute('title')).toBe(baseOptions.label);
        expect(buttonElement.getAttribute('aria-label')).toBe(baseOptions.label);
      });

      it('should have an "svg" as a child', () => {
        expect(svg.nodeName).toBe('svg');
      });

      it('child should have the right class', () => {
        expect(svg.getAttribute('class')).toBe(baseOptions.iconClassName);
      });
    });
  });
}
