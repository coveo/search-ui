import {ResponsiveRecommendation} from '../../../src/ui/ResponsiveComponents/ResponsiveRecommendation';
import {$$, Dom} from '../../../src/utils/Dom';
import * as Mock from '../../MockEnvironment';

export function ResponsiveRecommendationTest() {

  describe('ResponsiveRecommendation', () => {
    let smallWidth: number;
    let largeWidth: number;
    let root: Dom;
    let responsiveRecommendation: ResponsiveRecommendation;


    function shouldSwitchToSmallMode() {
      let spy = jasmine.createSpy('width').and.returnValue(smallWidth);
      root.width = <any>spy;
    }

    function shouldSwitchToLargeMode() {
      let spy = jasmine.createSpy('width').and.returnValue(largeWidth);
      root.width = <any>spy;
    }

    beforeEach(() => {
      root = $$('div');
      smallWidth = ResponsiveRecommendation.RESPONSIVE_BREAKPOINT - 1;
      largeWidth = ResponsiveRecommendation.RESPONSIVE_BREAKPOINT + 1;
      responsiveRecommendation = new ResponsiveRecommendation(root, '', {});
    });

    describe('when it should switch to small mode', () => {
      it('returns true when needDropdownWrapper is called', () => {
        shouldSwitchToSmallMode();
        expect(responsiveRecommendation.needDropdownWrapper()).toBe(true);
      });
    });
  });
}
