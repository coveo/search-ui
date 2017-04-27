import { DomUtils } from '../../src/utils/DomUtils';
import { PublicPathUtils } from '../../src/utils/PublicPathUtils';

export function PublicPathUtilsTest() {
  describe('PublicPathUtils', () => {
    let currentScript;
    let fakeScript = <HTMLScriptElement>{ src: 'some/path/script.js#some=value'};
    beforeEach(() => {
      PublicPathUtils.reset();
      currentScript = DomUtils.getCurrentScript;
      DomUtils.getCurrentScript = () => fakeScript;
    })

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
    })
  });
}