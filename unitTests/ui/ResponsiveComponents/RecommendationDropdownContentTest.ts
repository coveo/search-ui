import { RecommendationDropdownContent } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/RecommendationDropdownContent';
import { ResponsiveDropdownContent } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownContent';
import { $$, Dom } from '../../../src/utils/Dom';

export function RecommendationDropdownContentTest() {
  describe('RecommendationDropdownContent', () => {
    let componentName = 'name';
    let recommendationDropdownContent: RecommendationDropdownContent;
    let root: Dom;
    let element: Dom;

    beforeEach(() => {
      element = $$('div');
      root = $$('div');
      root.append(element.el);
      root.append($$('div', { className: 'coveo-results-column' }).el);
      recommendationDropdownContent = new RecommendationDropdownContent(componentName, element, root);
    });

    it('adds custom css class when position dropdown is called', () => {
      recommendationDropdownContent.positionDropdown();
      let expectedClass = `coveo-${componentName}-dropdown-content`;

      expect(recommendationDropdownContent.element.hasClass(expectedClass)).toBe(true);
    });

    it('adds default css class when position dropdown is called', () => {
      recommendationDropdownContent.positionDropdown();
      let expectedClass = ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME;

      expect(recommendationDropdownContent.element.hasClass(expectedClass)).toBe(true);
    });

    it('adds opened css class when position dropdown is called', () => {
      recommendationDropdownContent.positionDropdown();
      let expectedClass = RecommendationDropdownContent.OPENED_DROPDOWN_CSS_CLASS_NAME;

      expect(recommendationDropdownContent.element.hasClass(expectedClass)).toBe(true);
    });

    it('adds custom css class when hide dropdown is called', () => {
      recommendationDropdownContent.positionDropdown();
      let expectedClass = `coveo-${componentName}-dropdown-content`;

      recommendationDropdownContent.hideDropdown();

      expect(recommendationDropdownContent.element.hasClass(expectedClass)).toBe(true);
    });

    it('adds default css class when hide dropdown is called', () => {
      recommendationDropdownContent.positionDropdown();
      let expectedClass = ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME;

      recommendationDropdownContent.hideDropdown();

      expect(recommendationDropdownContent.element.hasClass(expectedClass)).toBe(true);
    });

    it('removes opened css class when hide dropdown is called', () => {
      recommendationDropdownContent.positionDropdown();
      let expectedToBeRemovedClass = RecommendationDropdownContent.OPENED_DROPDOWN_CSS_CLASS_NAME;

      recommendationDropdownContent.hideDropdown();

      expect(recommendationDropdownContent.element.hasClass(expectedToBeRemovedClass)).toBe(false);
    });

    it('removes default css class when clean up is called', () => {
      recommendationDropdownContent.positionDropdown();
      let expectedToBeRemovedClass = ResponsiveDropdownContent.DEFAULT_CSS_CLASS_NAME;

      recommendationDropdownContent.cleanUp();

      expect(recommendationDropdownContent.element.hasClass(expectedToBeRemovedClass)).toBe(false);
    });

    it('removes custom css class when clean up is called', () => {
      recommendationDropdownContent.positionDropdown();
      let expectedToBeRemovedClass = `coveo-${componentName}-dropdown-content`;

      recommendationDropdownContent.cleanUp();

      expect(recommendationDropdownContent.element.hasClass(expectedToBeRemovedClass)).toBe(false);
    });
  });
}
