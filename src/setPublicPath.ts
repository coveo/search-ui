import { Utils } from './utils/Utils';

// Dynamically set the public path to load the chunks relative to the Coveo script
// Fallback on last parsed script of document.currentScript is not available.
export function setPublicPath() {
  let path;
  if (Utils.isNullOrUndefined(document.currentScript)) {
    let scripts = document.getElementsByTagName('script');
    path = parseScriptDirectoryPath(scripts[scripts.length - 1]);
  } else {
    let script = <HTMLScriptElement>document.currentScript;
    path = parseScriptDirectoryPath(script);
  }
  __webpack_public_path__ = path;
}

function parseScriptDirectoryPath(script: HTMLScriptElement) {
  return script.src.replace(/[\w.]*.\.js/, '');
}
