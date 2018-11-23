import { ResponsiveComponents, SMALL_SCREEN_WIDTH, MEDIUM_SCREEN_WIDTH } from '../../src/ui/ResponsiveComponents/ResponsiveComponents';
import * as Mock from '../MockEnvironment';
export function ResponsiveComponentsTest() {
  describe('ResponsiveComponents', () => {
    let responsiveComponent: ResponsiveComponents;
    let windoh: Window;

    beforeEach(() => {
      windoh = Mock.mockWindow();
      responsiveComponent = new ResponsiveComponents(windoh);
    });

    afterEach(() => {
      responsiveComponent = null;
      windoh = null;
    });

    it('should return something for small screen width, even if not set beforehand', () => {
      expect(responsiveComponent.getSmallScreenWidth()).toBeDefined();
    });

    it('should return the size that we set for small screen width', () => {
      responsiveComponent.setSmallScreenWidth(1);
      expect(responsiveComponent.getSmallScreenWidth()).toEqual(1);
    });

    it('should return something for medium screen width, even if not set beforehand', () => {
      expect(responsiveComponent.getMediumScreenWidth()).toBeDefined();
    });

    it('should return the size that we set for medium screen width', () => {
      responsiveComponent.setMediumScreenWidth(1234);
      expect(responsiveComponent.getMediumScreenWidth()).toEqual(1234);
    });

    it('should throw if setting an invalid smallScreenWidth', () => {
      expect(() => responsiveComponent.setSmallScreenWidth(99999)).toThrowError();
    });

    it('should throw if setting an invalid mediumScreenWidth', () => {
      expect(() => responsiveComponent.setMediumScreenWidth(10)).toThrowError();
    });

    it('should return auto for responsive mode, if not set beforehand', () => {
      expect(responsiveComponent.getResponsiveMode()).toBe('auto');
    });

    it('should return the responsive mode setted', () => {
      responsiveComponent.setResponsiveMode('small');
      expect(responsiveComponent.getResponsiveMode()).toBe('small');
    });

    it('should throw if setting any breakpoints while responsive mode is not auto', () => {
      // Work with auto.
      responsiveComponent.setResponsiveMode('auto');
      expect(() => responsiveComponent.setSmallScreenWidth(1)).not.toThrowError();
      expect(() => responsiveComponent.setMediumScreenWidth(2)).not.toThrowError();
      // Fail with not auto.
      responsiveComponent.setResponsiveMode('small');
      expect(() => responsiveComponent.setSmallScreenWidth(1)).toThrowError();
      expect(() => responsiveComponent.setMediumScreenWidth(2)).toThrowError();
    });

    describe('with a small screen width and auto responsive mode', () => {
      beforeEach(() => {
        windoh['clientWidth'] = SMALL_SCREEN_WIDTH;
        responsiveComponent = new ResponsiveComponents(windoh);
        responsiveComponent.setResponsiveMode('auto');
      });

      it('isSmallScreenWidth should return true', () => {
        expect(responsiveComponent.isSmallScreenWidth()).toBe(true);
      });

      it('isMediumScreenWidth should return false', () => {
        expect(responsiveComponent.isMediumScreenWidth()).toBe(false);
      });

      it('isLargeScreenWidth should return false', () => {
        expect(responsiveComponent.isLargeScreenWidth()).toBe(false);
      });
    });

    describe('with a medium screen width and auto responsive mode', () => {
      beforeEach(() => {
        windoh['clientWidth'] = MEDIUM_SCREEN_WIDTH;
        responsiveComponent = new ResponsiveComponents(windoh);
        responsiveComponent.setResponsiveMode('auto');
      });

      it('isSmallScreenWidth should return false', () => {
        expect(responsiveComponent.isSmallScreenWidth()).toBe(false);
      });

      it('isMediumScreenWidth should return true', () => {
        expect(responsiveComponent.isMediumScreenWidth()).toBe(true);
      });

      it('isLargeScreenWidth should return false', () => {
        expect(responsiveComponent.isLargeScreenWidth()).toBe(false);
      });
    });

    describe('with a large screen width and auto responsive mode', () => {
      beforeEach(() => {
        windoh['clientWidth'] = MEDIUM_SCREEN_WIDTH + 1;
        responsiveComponent = new ResponsiveComponents(windoh);
        responsiveComponent.setResponsiveMode('auto');
      });

      it('isSmallScreenWidth should return false', () => {
        expect(responsiveComponent.isSmallScreenWidth()).toBe(false);
      });

      it('isMediumScreenWidth should return false', () => {
        expect(responsiveComponent.isMediumScreenWidth()).toBe(false);
      });

      it('isLargeScreenWidth should return true', () => {
        expect(responsiveComponent.isLargeScreenWidth()).toBe(true);
      });
    });

    describe('with a small responsiveMode and a screen width outside the small range', () => {
      beforeEach(() => {
        windoh['clientWidth'] = MEDIUM_SCREEN_WIDTH;
        responsiveComponent = new ResponsiveComponents(windoh);
        responsiveComponent.setResponsiveMode('small');
      });

      it('should return positive infinity for small breakpoint', () => {
        expect(responsiveComponent.getSmallScreenWidth()).toBe(Number.POSITIVE_INFINITY);
      });

      it('should return 0 for medium breakpoint', () => {
        expect(responsiveComponent.getMediumScreenWidth()).toBe(0);
      });

      it('isSmallScreenWidth should return true', () => {
        expect(responsiveComponent.isSmallScreenWidth()).toBe(true);
      });

      it('isMediumScreenWidth should return false', () => {
        expect(responsiveComponent.isMediumScreenWidth()).toBe(false);
      });

      it('isLargeScreenWidth should return false', () => {
        expect(responsiveComponent.isLargeScreenWidth()).toBe(false);
      });
    });

    describe('with a medium responsiveMode and a screen width outside the medium range', () => {
      beforeEach(() => {
        windoh['clientWidth'] = SMALL_SCREEN_WIDTH;
        responsiveComponent = new ResponsiveComponents(windoh);
        responsiveComponent.setResponsiveMode('medium');
      });

      it('should return 0 for small breakpoint', () => {
        expect(responsiveComponent.getSmallScreenWidth()).toBe(0);
      });

      it('should return positive infinity for medium breakpoint', () => {
        expect(responsiveComponent.getMediumScreenWidth()).toBe(Number.POSITIVE_INFINITY);
      });

      it('isSmallScreenWidth should return false', () => {
        expect(responsiveComponent.isSmallScreenWidth()).toBe(false);
      });

      it('isMediumScreenWdith should return true', () => {
        expect(responsiveComponent.isMediumScreenWidth()).toBe(true);
      });

      it('isLargeScreenWidth should return false', () => {
        expect(responsiveComponent.isLargeScreenWidth()).toBe(false);
      });
    });

    describe('with a large responsiveMode and a screen width outside the large range', () => {
      beforeEach(() => {
        windoh['clientWidth'] = SMALL_SCREEN_WIDTH;
        responsiveComponent = new ResponsiveComponents(windoh);
        responsiveComponent.setResponsiveMode('large');
      });

      it('isSmallScreenWidth should return false', () => {
        expect(responsiveComponent.isSmallScreenWidth()).toBe(false);
      });

      it('isMediumScreenWidth should return false', () => {
        expect(responsiveComponent.isMediumScreenWidth()).toBe(false);
      });

      it('isLargeScreenWidth should return true', () => {
        expect(responsiveComponent.isLargeScreenWidth()).toBe(true);
      });
    });
  });
}
