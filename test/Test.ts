/// <reference path="lib/jasmine.d.ts" />

//***** COVEO SEARCH ******
/// <reference path="../bin/ts/CoveoJsSearch.d.ts" />


//***** CUSTOM MATCHER ******
/// <reference path="CustomMatchers.ts" />

//***** TEST UTILITIES ******
/// <reference path="Fake.ts" />
/// <reference path="NoopComponent.ts" />
/// <reference path="MockEnvironment.ts" />
/// <reference path="Simulate.ts" />

//***** TEST ON UTILS ******
/// <reference path="utils/DomTest.ts" />
/// <reference path="utils/CookieUtilsTest.ts" />
/// <reference path="utils/L10NTest.ts" />

//***** TEST ON MODELS ******
/// <reference path="models/ModelTest.ts" />
/// <reference path="models/QueryStateModelTest.ts" />

//***** TEST ON CONTROLLERS ******
/// <reference path="controllers/FacetQueryControllerTest.ts" />
/// <reference path="controllers/HistoryControllerTest.ts" />
/// <reference path="controllers/QueryControllerTest.ts" />

//***** TEST ON UI ******
/// <reference path="ui/AggregateTest.ts" />
/// <reference path="ui/AnalyticsEndpointTest.ts" />
/// <reference path="ui/AnalyticsTest.ts" />
/// <reference path="ui/BreadcrumbTest.ts" />
/// <reference path="ui/ComponentEventsTest.ts" />
/// <reference path="ui/ComponentTest.ts" />
/// <reference path="ui/DidYouMeanTest.ts" />
/// <reference path="ui/ErrorReportTest.ts" />
/// <reference path="ui/PagerTest.ts" />
/// <reference path="ui/FacetTest.ts" />


Coveo.Logger.disable();

module Coveo {
  var _ = window['_'];
  Coveo._ = _;
}

function isPhantomJs() {
  return navigator.userAgent.indexOf('PhantomJS') != -1;
}





