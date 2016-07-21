import {jQueryIsDefined} from './CoveoJQuery';
export var underscoreInstance;
underscoreInstance = _;

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
    window['Coveo']['_'] = _;
    underscoreInstance = window['Coveo']['_'];
  }
}

window['_'] = _;
