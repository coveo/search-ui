import { DomUtils } from '../../src/utils/DomUtils';
import { PublicPathUtils } from '../../src/utils/PublicPathUtils';
import { $$ } from '../../src/utils/Dom';

function getElementsByTagName<K extends keyof
ElementListTagNameMap > (tagname
:
K
):
ElementListTagNameMap[K]
{
  return document.getElementsByTagName(tagname);
}

export function PublicPathUtilsTest() {
  describe('PublicPathUtils', () => {
    let currentScript;
    let expectedPath = 'some/path/';
    let fakeScript = <HTMLScriptElement>{ src: `${expectedPath}script.js` };

    beforeEach(() => {
      currentScript = DomUtils.getCurrentScript;
      PublicPathUtils.reset();
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
      expect(__webpack_public_path__).toBe(expectedPath);
    });

    it('should detect the ressource root with a hash value', () => {
      let fakeScriptWithHashValue = <HTMLScriptElement>{ src: `${expectedPath}script.js#some=value&other=value` };
      DomUtils.getCurrentScript = () => fakeScriptWithHashValue;

      PublicPathUtils.detectPublicPath();

      expect(__webpack_public_path__).toBe(expectedPath);
    });

    it('should detect the ressource root with a url parameter', () => {
      let fakeScriptWithUrlParam = <HTMLScriptElement>{ src: `${expectedPath}script.js?someParam=1&otherParam=2` };
      DomUtils.getCurrentScript = () => fakeScriptWithUrlParam;

      PublicPathUtils.detectPublicPath();

      expect(__webpack_public_path__).toBe(expectedPath);
    });

    it('should use the last parsed script to detect ressource root when document.currentScript is not available', () => {
      var getElementsByTagName = () => [$$('script'), fakeScript];
      PublicPathUtils.detectPublicPath();
      expect(__webpack_public_path__).toBe(expectedPath);
    });
  });
};
