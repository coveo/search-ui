import { Utils } from './Utils';
import { DomUtils } from './DomUtils';

export class PublicPathUtils {
  private static pathHasBeenConfigured = false;

  // Dynamically set the public path to load the chunks relative to the Coveo script
  // Fallback on last parsed script if document.currentScript is not available.
  public static detectPublicPath() {
    if (!this.pathHasBeenConfigured) {
      __webpack_public_path__ = PublicPathUtils.getDynamicPublicPath();
    }
  }

  /**
   * Helper function to resolve the public path used to load the chunks relative to the Coveo script.
   */
  public static getDynamicPublicPath() {
    let currentScript = DomUtils.getCurrentScript();
    if (Utils.isNullOrUndefined(currentScript)) {
      let scripts = document.getElementsByTagName('script');
      return this.parseScriptDirectoryPath(scripts[scripts.length - 1]);
    } else {
      let script = currentScript;
      return this.parseScriptDirectoryPath(script);
    }
  }

  public static configureResourceRoot(path: string) {
    this.pathHasBeenConfigured = true;
    __webpack_public_path__ = path;
  }

  public static reset() {
    this.pathHasBeenConfigured = false;
  }

  private static parseScriptDirectoryPath(script: HTMLScriptElement) {
    return script.src.replace(/\/[\w\.-]*\.js((#|\?)(.*)){0,1}$/, '/');
  }
}
