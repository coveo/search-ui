import { $$ } from '../../src/Core';
import { FacetPadding } from '../../src/ui/FacetPadding/FacetPadding';

export function FacetPaddingTest() {
  describe('FacetPadding', () => {
    let padding: FacetPadding;
    let facetElement: HTMLElement;
    let paddingContainer: HTMLElement;

    beforeEach(() => {
      initializeComponent();
    });

    function initializeComponent() {
      spyOn(window, 'scrollTo');
      facetElement = $$('div').el;
      paddingContainer = $$('div', {}, facetElement).el;
      padding = new FacetPadding(facetElement, paddingContainer);
    }

    function topSpaceElement() {
      return $$(paddingContainer).find('.coveo-topSpace');
    }

    it('should add a top space element', () => {
      expect(topSpaceElement()).toBeTruthy();
    });

    it(`when mouseLeave is triggered on the paddingContainer and facet is NOT pinned
      should add the animation class and set a 0 height on the topSpace element`, () => {
      $$(paddingContainer).trigger('mouseleave');

      expect($$(topSpaceElement()).hasClass('coveo-with-animation')).toBe(true);
      expect(topSpaceElement().style.height).toBe('0px');
    });

    it(`when mouseLeave is triggered on the paddingContainer and facet is pinned
      should NOT add the animation class nor set a 0 height on the topSpace element`, () => {
      padding.pin();
      $$(paddingContainer).trigger('mouseleave');

      expect($$(topSpaceElement()).hasClass('coveo-with-animation')).toBe(false);
      expect(topSpaceElement().style.height).not.toBe('0px');
    });

    it(`when ensurePinnedFacetHasNotMoved is called and facet is not pinned
      nothing happens`, () => {
      padding.ensurePinnedFacetHasNotMoved();

      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    describe('when ensurePinnedFacetHasNotMoved is called and facet is pinned', () => {
      beforeEach(() => {
        $$(topSpaceElement()).addClass('coveo-with-animation');
        topSpaceElement().style.height = '300px';

        padding.pin();
        padding.ensurePinnedFacetHasNotMoved();
      });

      it(`should remove the animation class and set a 0 height on the topSpace element`, () => {
        expect($$(topSpaceElement()).hasClass('coveo-with-animation')).toBe(false);
        expect(topSpaceElement().style.height).toBe('0px');
        expect(window.scrollTo).toHaveBeenCalled();
      });

      it(`should call scrollTo on the window`, () => {
        expect(window.scrollTo).toHaveBeenCalled();
      });
    });
  });
}
