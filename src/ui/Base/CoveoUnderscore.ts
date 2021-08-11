import * as _ from 'underscore';

export let underscoreInstance;
underscoreInstance = _;
setCoveoUnderscore();
function setCoveoUnderscore() {
  if (window['Coveo'] == undefined) {
    window['Coveo'] = {};
  }
  if (window['Coveo']['_'] == undefined) {
    window['Coveo']['_'] = _;
    setTemplateSettings(window['Coveo']['_']);
    underscoreInstance = window['Coveo']['_'];
  }
}

function setTemplateSettings({ templateSettings }: { templateSettings: _.TemplateSettings }) {
  templateSettings.evaluate = /(?:<%|{{)([\s\S]+?)(?:%>|}})/g;
  templateSettings.interpolate = /(?:<%|{{)=([\s\S]+?)(?:%>|}})/g;
  templateSettings.escape = /(?:<%|{{)-([\s\S]+?)(?:%>|}})/g;
}

const previousUnderscore = window['_'];
window['_'] = _;
// Run Underscore.js in "noConflict" mode, returning the `_` variable to its previous owner.
// Returns a reference to the Underscore object. This method was removed from the module in v1.10.0
window['_'].noConflict = function () {
  window['_'] = previousUnderscore;
  return _;
};

setTemplateSettings(window['_']);
