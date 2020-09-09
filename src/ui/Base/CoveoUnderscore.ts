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

window['_'] = _;

setTemplateSettings(window['_']);
