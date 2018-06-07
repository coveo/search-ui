import { PublicPathUtils } from '../../src/utils/PublicPathUtils';

export function PublicPathUtilsTest() {
  describe('PublicPathUtils', () => {
    let getCurrentScript;
    let getCoveoScript;
    const detectedPath = 'some/path/';
    const configuredPath = 'path';

    const fakeScript = <HTMLScriptElement>{ src: `${detectedPath}script.js`, tagName: 'SCRIPT' };

    beforeEach(() => {
      getCurrentScript = PublicPathUtils.getCurrentScript;
      getCoveoScript = PublicPathUtils.getCoveoScript;
      PublicPathUtils.getCoveoScript = () => fakeScript;
      PublicPathUtils.reset();
    });

    afterEach(() => {
      PublicPathUtils.getCurrentScript = getCurrentScript;
      PublicPathUtils.getCoveoScript = getCoveoScript;
    });

    it('should set webpack public path when configuring resource root', () => {
      PublicPathUtils.configureResourceRoot(configuredPath);
      expect(__webpack_public_path__).toBe(configuredPath);
    });

    describe('when document.currentScript is available', () => {
      beforeEach(() => {
        PublicPathUtils.getCurrentScript = () => fakeScript;
      });

      it('should get the resource root', () => {
        const result = PublicPathUtils.getDynamicPublicPath();
        expect(result).toBe(detectedPath);
      });

      it('should get the resource root with a hash value', () => {
        let fakeScriptWithHashValue = <HTMLScriptElement>{ src: `${detectedPath}script.js#some=value&other=value` };
        PublicPathUtils.getCurrentScript = () => fakeScriptWithHashValue;

        const result = PublicPathUtils.getDynamicPublicPath();

        expect(result).toBe(detectedPath);
      });

      it('should get the public path from the resource root with a url parameter', () => {
        const fakeScriptWithUrlParam = <HTMLScriptElement>{ src: `${detectedPath}script.js?someParam=1&otherParam=2` };
        PublicPathUtils.getCurrentScript = () => fakeScriptWithUrlParam;

        const result = PublicPathUtils.getDynamicPublicPath();

        expect(result).toBe(detectedPath);
      });

      it('should set webpack public path to the detected resource root', () => {
        PublicPathUtils.detectPublicPath();
        expect(__webpack_public_path__).toBe(detectedPath);
      });

      it('should detect the script after reseting the configured state', () => {
        PublicPathUtils.configureResourceRoot(configuredPath);
        PublicPathUtils.reset();
        PublicPathUtils.detectPublicPath();

        expect(__webpack_public_path__).toBe(detectedPath);
      });
    });

    describe('when currentScript is undefined and getCoveoScript is available', () => {
      beforeEach(() => {
        PublicPathUtils.getCurrentScript = () => undefined;
        PublicPathUtils.getCoveoScript = () => fakeScript;
      });

      it('should get the resource root using the script that has coveo-script as its class', () => {
        const result = PublicPathUtils.getDynamicPublicPath();
        expect(result).toBe(detectedPath);
      });
    });

    describe('when currentScript is undefined and getCoveoScript is not available', () => {
      let getElementsByTagName;
      beforeEach(() => {
        PublicPathUtils.getCurrentScript = () => undefined;
        PublicPathUtils.getCoveoScript = () => undefined;
        getElementsByTagName = document.getElementsByTagName;
        spyOn(document, 'getElementsByTagName').and.returnValue([fakeScript]);
      });
      afterEach(() => {
        document.getElementsByClassName = getElementsByTagName;
      });

      it('should get the resource root using the last available script', () => {
        const result = PublicPathUtils.getDynamicPublicPath();
        expect(result).toBe(detectedPath);
      });
    });

    it('should use the manually configured path even after detecting the path', () => {
      PublicPathUtils.configureResourceRoot(configuredPath);
      PublicPathUtils.detectPublicPath();

      expect(__webpack_public_path__).toBe(configuredPath);
    });
  });
}
