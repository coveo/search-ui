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

    describe('with a small screen width', () => {
      beforeEach(() => {
        windoh['clientWidth'] = 100;
        responsiveComponent = new ResponsiveComponents(windoh);
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

    describe('with a medium screen width', () => {
      beforeEach(() => {
        windoh['clientWidth'] = 600;
        responsiveComponent = new ResponsiveComponents(windoh);
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

    describe('with a large screen width', () => {
      beforeEach(() => {
        windoh['clientWidth'] = 2000;
        responsiveComponent = new ResponsiveComponents(windoh);
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
