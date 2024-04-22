import { Utils } from './Utils';
import { Logger, $$ } from '../Core';
import { find } from 'underscore';

/**
 * Set of utilities to determine where to load the lazy chunks from.
 * You should add the `coveo-script` class on the script tag that includes the Coveo framework to make sure the framework can always
 * auto-detect the path to load the lazy chunks from. More details [here]{@link https://docs.coveo.com/en/295/javascript-search-framework/lazy-versus-eager-component-loading#fixing-code-chunks-loading-path-issues}
 */
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
   * You should add the `coveo-script` class on the script tag that includes the Coveo framework
   * to make sure the framework can always auto-detect the path to load the lazy chunks from.
   * More details [here]{@link https://docs.coveo.com/en/295/javascript-search-framework/lazy-versus-eager-component-loading#fixing-code-chunks-loading-path-issues}
   */
  public static getDynamicPublicPath() {
    let currentScript = this.getCurrentScript();
    const coveoScript = this.getCoveoScript();
    if (!this.isScript(coveoScript)) {
      new Logger(this)
        .warn(`You should add the class coveo-script on the script tag that includes the Coveo framework. Not doing so may cause the framework to not be able to auto-detect the path to load the lazy chunks in certain environments.
        More details [here](https://docs.coveo.com/en/295/javascript-search-framework/lazy-versus-eager-component-loading#fixing-code-chunks-loading-path-issues).`);
    }
    if (!Utils.isNullOrUndefined(currentScript)) {
      return this.parseScriptDirectoryPath(currentScript);
    } else if (this.isScript(coveoScript)) {
      return this.parseScriptDirectoryPath(coveoScript);
    } else {
      const scripts = document.getElementsByTagName('script');
      if (scripts.length === 0) {
        return '/';
      }
      return this.parseScriptDirectoryPath(scripts[scripts.length - 1]);
    }
  }

  /**
   * @deprecated Instead of using this method, you should add the `coveo-script` class on the script tag that includes the Coveo framework.
   * @param path
   */
  public static configureResourceRoot(path: string) {
    this.pathHasBeenConfigured = true;
    __webpack_public_path__ = path;
  }

  public static reset() {
    this.pathHasBeenConfigured = false;
  }

  public static getCurrentScript() {
    return <HTMLScriptElement>document.currentScript;
  }

  public static getCoveoScript() {
    return find(document.querySelectorAll('.coveo-script'), el => this.isScript(el));
  }

  private static parseScriptDirectoryPath(script: HTMLScriptElement) {
    return script.src.replace(/\/[\w\.-]*\.js((#|\?)(.*)){0,1}$/, '/');
  }

  private static isScript(el: Element): el is HTMLScriptElement {
    return el && $$(<HTMLElement>el).is('script');
  }
}
