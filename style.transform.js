module.exports = (css) => {
  if (window.COVEO_LOAD_DYNAMIC_STYLE === false) {
    return false;
  }
  return css;
}
