if (underscoreIsDefined()) {
  setCoveoUnderscore();
} else {
  // Adding a check in case underscore was added after the jsSearch
  document.addEventListener('DOMContentLoaded', () => {
    if (underscoreIsDefined()) {
      setCoveoUnderscore();
    }
  })
}

function setCoveoUnderscore() {
  window['Coveo']['_'] = window['_'];
}


function underscoreIsDefined(): boolean {
  return window['_'] != undefined && window['_'].VERSION != undefined && window['_'].each != undefined;
}

export var underscoreInstance = window['Coveo']['_'];