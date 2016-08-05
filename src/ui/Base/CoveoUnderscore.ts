export let underscoreInstance;
underscoreInstance = _;
setCoveoUnderscore();
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
