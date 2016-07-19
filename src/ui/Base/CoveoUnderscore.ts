export var underscoreInstance;
underscoreInstance = _;

if (window['Coveo'] == undefined) {
  window['Coveo'] = {};
}
if (window['Coveo']['_'] == undefined) {
  window['Coveo']['_'] = _;
}

window['_'] = _;
