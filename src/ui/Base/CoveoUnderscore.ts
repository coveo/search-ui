import {jQueryIsDefined} from './CoveoJQuery';
export var underscoreInstance;

if (underscoreIsDefined()) {
  setCoveoUnderscore();
} else {
  // Adding a check in case underscore was added after the jsSearch
  document.addEventListener('DOMContentLoaded', () => {
    if (underscoreIsDefined()) {
      setCoveoUnderscore();
    }
  })
  if (jQueryIsDefined()) {
    $(function () {
      if (underscoreIsDefined()) {
        setCoveoUnderscore();
      }
    })
  }
}

function setCoveoUnderscore() {
  if (window['Coveo'] == undefined) {
    window['Coveo'] = {};
  }
  if (window['Coveo']['_'] == undefined) {
    window['Coveo']['_'] = window['_'];
    underscoreInstance = window['Coveo']['_'];
  }
}


function underscoreIsDefined(): boolean {
  return window['_'] != undefined && window['_'].VERSION != undefined && window['_'].each != undefined;
}
