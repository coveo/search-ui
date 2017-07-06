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

function setTemplateSettings(instance) {
  instance['templateSettings'] = {
    evaluate: /(?:<%|{{)([\s\S]+?)(?:%>|}})/g,
    interpolate: /(?:<%|{{)=([\s\S]+?)(?:%>|}})/g,
    escape: /(?:<%|{{)-([\s\S]+?)(?:%>|}})/g
  };
}

window['_'] = _;

setTemplateSettings(window['_']);
