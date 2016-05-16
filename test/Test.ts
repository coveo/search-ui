/// <reference path="lib/jasmine.d.ts" />

//***** COVEO SEARCH ******
/// <reference path="../bin/ts/CoveoJsSearch.d.ts" />

//***** CUSTOM MATCHER ******
/// <reference path="CustomMatchers.ts" />

//***** TEST UTILITIES ******
/// <reference path="NoopComponent.ts" />
/// <reference path="MockEnvironment.ts" />
/// <reference path="Simulate.ts" />

//***** TEST ON UTILS ******
/// <reference path="utils/DomTest.ts" />



// Get a much cleaner output in phantomjs
if (window['_phantom']) {
  Coveo.Logger.disable();
}

function isPhantomJs() {
  return navigator.userAgent.indexOf('PhantomJS') != -1;
}
