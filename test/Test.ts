/// <reference path="lib/jasmine.d.ts" />

//***** COVEO SEARCH ******
/// <reference path="../../target/jsSearch/package/lib/CoveoJsSearch.d.ts" />

//***** CUSTOM MATCHER ******
/// <reference path="CustomMatchers.ts" />

//***** TEST UTILITIES ******
/// <reference path="NoopComponent.ts" />
/// <reference path="MockEnvironment.ts" />
/// <reference path="Simulate.ts" />
/// <reference path="Fake.ts" />

//***** TEST ON UTILS ******
/// <reference path="utils/DomTest.ts" />
/// <reference path="utils/CookieUtilsTest.ts" />
/// <reference path="utils/L10NTest.ts" />

//***** TEST ON MODELS ******
/// <reference path="models/ModelTest.ts" />
/// <reference path="models/QueryStateModelTest.ts" />

//***** TEST ON REST ******
/// <reference path="rest/EndpointCallerTest.ts" />
/// <reference path="rest/SearchEndpointTest.ts" />

//***** TEST ON CONTROLLERS ******
/// <reference path="controllers/FacetQueryControllerTest.ts" />
/// <reference path="controllers/QueryControllerTest.ts" />
/// <reference path="controllers/HistoryControllerTest.ts" />

//***** TESTS ON UI ******
/// <reference path="ui/InitializationTest.ts" />
/// <reference path="ui/AnalyticsTest.ts" />
/// <reference path="ui/AnalyticsEndpointTest.ts" />
/// <reference path="ui/LiveAnalyticsClientTest.ts" />
/// <reference path="ui/ExpressionBuilderTest.ts" />
/// <reference path="ui/QueryBuilderTest.ts" />
/// <reference path="ui/SearchInterfaceTest.ts" />
/// <reference path="ui/ComponentTest.ts" />
/// <reference path="ui/ComponentEventsTest.ts" />
/// <reference path="ui/SearchButtonTest.ts" />
/// <reference path="ui/QueryboxTest.ts" />
/// <reference path="ui/ResultListTest.ts" />
/// <reference path="ui/OmniboxTest.ts" />
/// <reference path="ui/PagerTest.ts" />
/// <reference path="ui/TabTest.ts" />
/// <reference path="ui/BreadcrumbTest.ts" />
/// <reference path="ui/HiddenQueryTest.ts" />
/// <reference path="ui/FacetSearchParametersTest.ts" />
/// <reference path="ui/FacetSearchTest.ts" />
/// <reference path="ui/FacetSettingsTest.ts" />
/// <reference path="ui/FacetHeaderTest.ts" />
/// <reference path="ui/FacetTest.ts" />
/// <reference path="ui/ValueElementRendererTest.ts" />
/// <reference path="ui/SortTest.ts" />
/// <reference path="ui/SortCriteriaTest.ts" />
/// <reference path="ui/PreferencesPanelTest.ts" />
/// <reference path="ui/ThumbnailTest.ts" />
/// <reference path="ui/ShareQueryTest.ts" />
/// <reference path="ui/SettingsTest.ts" />
/// <reference path="ui/ExportToExcelTest.ts" />
/// <reference path="ui/TriggersTest.ts" />
/// <reference path="ui/DidYouMeanTest.ts" />
/// <reference path="ui/FoldingTest.ts" />
/// <reference path="ui/ResultFoldingTest.ts" />
/// <reference path="ui/SliderTest.ts" />
/// <reference path="ui/FacetSliderTest.ts" />
/// <reference path="ui/MatrixTest.ts" />
/// <reference path="ui/QuerySummaryTest.ts" />
/// <reference path="ui/ErrorReportTest.ts" />
/// <reference path="ui/FieldTableTest.ts" />
/// <reference path="ui/FieldValueTest.ts" />
/// <reference path="ui/AggregateTest.ts" />
/// <reference path="ui/HierarchicalFacetTest.ts" />
/// <reference path="ui/BadgeTest.ts" />
/// <reference path="ui/ResultAttachmentsTest.ts" />
/// <reference path="ui/QueryDurationTest.ts" />
/// <reference path="ui/IconTest.ts" />

// Get a much cleaner output in phantomjs
if (window['_phantom']) {
  Coveo.Logger.disable();
}

function isPhantomJs() {
  return navigator.userAgent.indexOf('PhantomJS') != -1;
}
