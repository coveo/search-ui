import { Utils } from './Utils';
import { DomUtils } from './DomUtils';

export class PublicPathUtils {

  private static pathHasBeenConfigured = false;

  // Dynamically set the public path to load the chunks relative to the Coveo script
  // Fallback on last parsed script if document.currentScript is not available.
  public static detectPublicPath() {
    if (!this.pathHasBeenConfigured) {
      let path;
      let currentScript = DomUtils.getCurrentScript();
      if (Utils.isNullOrUndefined(currentScript)) {
        let scripts = document.getElementsByTagName('script');
        path = this.parseScriptDirectoryPath(scripts[scripts.length - 1]);
      } else {
        let script = currentScript;
        path = this.parseScriptDirectoryPath(script);
      }
      __webpack_public_path__ = path;
    }
  }

  public static configureRessourceRoot(path: string) {
    this.pathHasBeenConfigured = true;
    __webpack_public_path__ = path;
  }

  public static reset() {
    this.pathHasBeenConfigured = false;
  }

  private static parseScriptDirectoryPath(script: HTMLScriptElement) {
    return script.src.replace(/[\w]*\.js((#|\?)(.*)){0,1}$/, '');
  }
}
