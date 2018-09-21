import { AccessibilityLandmarks, LandmarkRoles } from '../../src/utils/AccessibilityLandmarks';
import { $$, Dom } from '../../src/Core';

export const AccessibilityLandmarksTest = () => {
  describe('AccessibilityLandmarks', () => {
    let root: Dom;

    function initAccessibilityLandmarks() {
      new AccessibilityLandmarks(root.el);
    }

    function buildDivWithClass(cssClass: string) {
      const dom = $$('div');
      dom.addClass(cssClass);
      return dom;
    }

    beforeEach(() => (root = $$('div')));

    describe(`when a div with class 'coveo-tab-section' is a child of the root`, () => {
      let tabSection: Dom;

      beforeEach(() => {
        tabSection = buildDivWithClass('coveo-tab-section');
        root.append(tabSection.el);

        initAccessibilityLandmarks();
      });

      it(`adds role="${LandmarkRoles.Navigation}" to the tabSection`, () => {
        expect(tabSection.getAttribute('role')).toBe(LandmarkRoles.Navigation);
      });

      it(`adds an aria-label to the tabSection`, () => {
        expect(tabSection.getAttribute('aria-label')).toBeTruthy();
      });
    });

    describe(`when a div with class 'coveo-facet-column' is a child of the root`, () => {
      let facetColumn: Dom;

      beforeEach(() => {
        facetColumn = buildDivWithClass('coveo-facet-column');
        root.append(facetColumn.el);

        initAccessibilityLandmarks();
      });

      it(`adds role="${LandmarkRoles.Search}" to the facetColumn`, () => {
        expect(facetColumn.getAttribute('role')).toBe(LandmarkRoles.Search);
      });

      it(`adds an aria-label to the facetColumn`, () => {
        expect(facetColumn.getAttribute('aria-label')).toBeTruthy();
      });
    });

    describe(`when a div with class 'CoveoSearchbox' is a child of the root`, () => {
      let searchBox: Dom;

      beforeEach(() => {
        searchBox = buildDivWithClass('CoveoSearchbox');
        root.append(searchBox.el);

        initAccessibilityLandmarks();
      });

      it(`adds role="${LandmarkRoles.Search}" to the searchBox`, () => {
        expect(searchBox.getAttribute('role')).toBe(LandmarkRoles.Search);
      });

      it(`adds a label to the searchBox`, () => {
        expect(searchBox.getAttribute('aria-label')).toBeTruthy();
      });
    });
  });
};
