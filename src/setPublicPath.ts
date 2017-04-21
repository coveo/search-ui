// Dynamically set the public path to load the chunks relative to the Coveo script
export function setPublicPath() {
  let scripts = document.getElementsByTagName('script');
  let path = scripts[scripts.length - 1].src.replace(/[\w.]*.\.js/, '');
  __webpack_public_path__ = path;
}
