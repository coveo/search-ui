import { DomUtils } from '../../src/utils/DomUtils';
import { PublicPathUtils } from '../../src/utils/PublicPathUtils';

export function PublicPathUtilsTest() {
  describe('PublicPathUtils', () => {
    let currentScript;
    let fakeScript = <HTMLScriptElement>{ src: 'some/path/script.js' };
    beforeEach(() => {
      PublicPathUtils.reset();
      currentScript = DomUtils.getCurrentScript;
      DomUtils.getCurrentScript = () => fakeScript;
    });

    afterEach(() => {
      DomUtils.getCurrentScript = currentScript;
    });

    it('should set webpack pulic path when configuring ressource root', () => {
      PublicPathUtils.configureRessourceRoot('path');
      expect(__webpack_public_path__).toBe('path');
    });

    it('should detect the ressource root', () => {
      PublicPathUtils.detectPublicPath();
      expect(__webpack_public_path__).toBe('some/path/');
    });

    it('should detect the ressource root with a hash value', () => {
      let fakeScriptWithHashValue = <HTMLScriptElement>{ src: 'some/path/script.js#some=value&other=value' };
      DomUtils.getCurrentScript = () => fakeScriptWithHashValue;

      PublicPathUtils.detectPublicPath();

      expect(__webpack_public_path__).toBe('some/path/');
    });

    it('should detect the ressource root with a url parameter', () => {
      let fakeScriptWithUrlParam = <HTMLScriptElement>{ src: 'some/path/script.js?someParam=1&otherParam=2' };
      DomUtils.getCurrentScript = () => fakeScriptWithUrlParam;

      PublicPathUtils.detectPublicPath();

      expect(__webpack_public_path__).toBe('some/path/');
    });
  });
};
