import { ResponsiveComponents } from '../../src/ui/ResponsiveComponents/ResponsiveComponents';
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
        windoh['clientWidth'] = 100;
        responsiveComponent = new ResponsiveComponents(windoh);
        responsiveComponent.setResponsiveMode('auto');
      });

      it('should return isSmallScreenWidth', () => {
        expect(responsiveComponent.isSmallScreenWidth()).toBe(true);
      });

      it('should not return isMediumScreenWidth', () => {
        expect(responsiveComponent.isMediumScreenWidth()).toBe(false);
      });

      it('should not return isLargeScreenWidth', () => {
        expect(responsiveComponent.isLargeScreenWidth()).toBe(false);
      });
    });

    describe('with a medium screen width and auto responsive mode', () => {
      beforeEach(() => {
        windoh['clientWidth'] = 600;
        responsiveComponent = new ResponsiveComponents(windoh);
        responsiveComponent.setResponsiveMode('auto');
      });

      it('should not return isSmallScreenWidth', () => {
        expect(responsiveComponent.isSmallScreenWidth()).toBe(false);
      });

      it('should return isMediumScreenWidth', () => {
        expect(responsiveComponent.isMediumScreenWidth()).toBe(true);
      });

      it('should not return isLargeScreenWidth', () => {
        expect(responsiveComponent.isLargeScreenWidth()).toBe(false);
      });
    });

    describe('with a large screen width and auto responsive mode', () => {
      beforeEach(() => {
        windoh['clientWidth'] = 2000;
        responsiveComponent = new ResponsiveComponents(windoh);
        responsiveComponent.setResponsiveMode('auto');
      });

      it('should not return isSmallScreenWidth', () => {
        expect(responsiveComponent.isSmallScreenWidth()).toBe(false);
      });

      it('should not return isMediumScreenWidth', () => {
        expect(responsiveComponent.isMediumScreenWidth()).toBe(false);
      });

      it('should return isLargeScreenWidth', () => {
        expect(responsiveComponent.isLargeScreenWidth()).toBe(true);
      });
    });

    describe('with a small responsiveMode and auto responsive mode', () => {
      beforeEach(() => {
        windoh['clientWidth'] = 600;
        responsiveComponent = new ResponsiveComponents(windoh);
        responsiveComponent.setResponsiveMode('small');
      });

      it('should return 0 for medium and large breakpoints and positive infinity for small', () => {
        expect(responsiveComponent.getSmallScreenWidth()).toBe(Number.POSITIVE_INFINITY);
        expect(responsiveComponent.getMediumScreenWidth()).toBe(0);
        expect(responsiveComponent.getSmallScreenWidth()).toBe(0);
      });

      it('should return isSmallScreenWidth', () => {
        expect(responsiveComponent.isSmallScreenWidth()).toBe(true);
      });

      it('should not return isMediumScreenWidth', () => {
        expect(responsiveComponent.isMediumScreenWidth()).toBe(false);
      });

      it('should not return isLargeScreenWidth', () => {
        expect(responsiveComponent.isLargeScreenWidth()).toBe(false);
      });
    });

    describe('with a medium responsiveMode', () => {
      beforeEach(() => {
        windoh['clientWidth'] = 400;
        responsiveComponent = new ResponsiveComponents(windoh);
        responsiveComponent.setResponsiveMode('medium');
      });

      it('should return 0 for small and large breakpoints and positive infinity for medium', () => {
        expect(responsiveComponent.getSmallScreenWidth()).toBe(0);
        expect(responsiveComponent.getMediumScreenWidth()).toBe(Number.POSITIVE_INFINITY);
        expect(responsiveComponent.getSmallScreenWidth()).toBe(0);
      });

      it('should not return isSmallScreenWidth', () => {
        expect(responsiveComponent.isSmallScreenWidth()).toBe(false);
      });

      it('should return isMediumScreenWidth', () => {
        expect(responsiveComponent.isMediumScreenWidth()).toBe(true);
      });

      it('should not return isLargeScreenWidth', () => {
        expect(responsiveComponent.isLargeScreenWidth()).toBe(false);
      });
    });

    describe('with a large responsiveMode', () => {
      beforeEach(() => {
        windoh['clientWidth'] = 400;
        responsiveComponent = new ResponsiveComponents(windoh);
        responsiveComponent.setResponsiveMode('large');
      });

      it('should return 0 for small and medium breakpoints and positive infinity for large', () => {
        expect(responsiveComponent.getSmallScreenWidth()).toBe(0);
        expect(responsiveComponent.getMediumScreenWidth()).toBe(0);
        expect(responsiveComponent.getSmallScreenWidth()).toBe(Number.POSITIVE_INFINITY);
      });

      it('should not return isSmallScreenWidth', () => {
        expect(responsiveComponent.isSmallScreenWidth()).toBe(false);
      });

      it('should not return isMediumScreenWidth', () => {
        expect(responsiveComponent.isMediumScreenWidth()).toBe(false);
      });

      it('should return isLargeScreenWidth', () => {
        expect(responsiveComponent.isLargeScreenWidth()).toBe(true);
      });
    });
  });
}
