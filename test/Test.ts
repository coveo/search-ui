/// <reference path="lib/jasmine.d.ts" />

// ***** COVEO SEARCH ******
/// <reference path="../bin/ts/CoveoJsSearch.d.ts" />


// ***** CUSTOM MATCHER ******
/// <reference path="CustomMatchers.ts" />

// ***** TEST UTILITIES ******
/// <reference path="Fake.ts" />
/// <reference path="NoopComponent.ts" />
/// <reference path="MockEnvironment.ts" />
/// <reference path="Simulate.ts" />

// ***** TEST ON UTILS ******
/// <reference path="utils/DomTest.ts" />
/// <reference path="utils/CookieUtilsTest.ts" />
/// <reference path="utils/L10NTest.ts" />
/// <reference path="utils/HighlightUtilsTest.ts" />

// ***** TEST ON MISC ******
/// <reference path="misc/PromisesShimTest.ts" />

// ***** TEST ON MODELS ******
/// <reference path="models/ModelTest.ts" />
/// <reference path="models/QueryStateModelTest.ts" />

// ***** TEST ON CONTROLLERS ******
/// <reference path="controllers/FacetQueryControllerTest.ts" />
/// <reference path="controllers/HistoryControllerTest.ts" />
/// <reference path="controllers/QueryControllerTest.ts" />

// ***** TEST ON REST ******
/// <reference path="rest/EndpointCallerTest.ts" />
/// <reference path="rest/SearchEndpointTest.ts" />

// ***** TEST ON UI ******
/// <reference path="ui/AggregateTest.ts" />
/// <reference path="ui/AnalyticsEndpointTest.ts" />
/// <reference path="ui/AnalyticsTest.ts" />
/// <reference path="ui/BreadcrumbTest.ts" />
/// <reference path="ui/ComponentEventsTest.ts" />
/// <reference path="ui/ComponentTest.ts" />
/// <reference path="ui/DidYouMeanTest.ts" />
/// <reference path="ui/ErrorReportTest.ts" />
/// <reference path="ui/ExportToExcelTest.ts" />
/// <reference path="ui/ExpressionBuilderTest.ts" />
/// <reference path="ui/FacetHeaderTest.ts" />
/// <reference path="ui/FacetSearchParametersTest.ts" />
/// <reference path="ui/FacetSearchTest.ts" />
/// <reference path="ui/FacetSettingsTest.ts" />
/// <reference path="ui/FacetSliderTest.ts" />
/// <reference path="ui/FacetTest.ts" />
/// <reference path="ui/FieldSuggestionsTest.ts" />
/// <reference path="ui/FieldTableTest.ts" />
/// <reference path="ui/FieldValueTest.ts" />
/// <reference path="ui/FoldingTest.ts" />
/// <reference path="ui/HiddenQueryTest.ts" />
/// <reference path="ui/HierarchicalFacetTest.ts" />
/// <reference path="ui/InitializationTest.ts" />
/// <reference path="ui/LiveAnalyticsClientTest.ts" />
/// <reference path="ui/MatrixTest.ts" />
/// <reference path="ui/OmniboxTest.ts" />
/// <reference path="ui/PagerTest.ts" />
/// <reference path="ui/PreferencesPanelTest.ts" />
/// <reference path="ui/QueryboxTest.ts" />
/// <reference path="ui/QueryBuilderTest.ts" />
/// <reference path="ui/QueryDurationTest.ts" />
/// <reference path="ui/QuerySummaryTest.ts" />
/// <reference path="ui/SearchboxTest.ts" />
/// <reference path="ui/SearchButtonTest.ts" />
/// <reference path="ui/SearchInterfaceTest.ts" />
/// <reference path="ui/SettingsTest.ts" />
/// <reference path="ui/ShareQueryTest.ts" />
/// <reference path="ui/SliderTest.ts" />
/// <reference path="ui/SortCriteriaTest.ts" />
/// <reference path="ui/SortTest.ts" />
/// <reference path="ui/TabTest.ts" />
/// <reference path="ui/TriggersTest.ts" />
/// <reference path="ui/ValueElementRendererTest.ts" />
/// <reference path="ui/ExcerptTest.ts" />
/// <reference path="ui/ResultLinkTest.ts" />
/// <reference path="ui/RecommendationTest.ts" />
/// <reference path="ui/TemplateLoaderTest.ts" />
/// <reference path="ui/AnalyticsSuggestionsTest.ts" />
/// <reference path="ui/RecommendationQueryTest.ts" />
/// <reference path="ui/ResultsPreferencesTest.ts" />
/// <reference path="ui/FieldSuggestionsTest.ts" />
/// <reference path="ui/AuthenticationProviderTest.ts" />
/// <reference path="ui/CurrentTabTest.ts" />
/// <reference path="ui/QueryboxQueryParametersTest.ts" />
/// <reference path="ui/ResultListTest.ts" />
/// <reference path="ui/ImageResultListTest.ts" />
/// <reference path="ui/SearchAlertsTest.ts" />
/// <reference path="ui/FollowItemTest.ts" />
/// <reference path="ui/SearchAlertsMessageTest.ts" />
/// <reference path="ui/PendingSearchAsYouTypeSearchEventTest.ts" />
/// <reference path="ui/ChatterLikedByTest.ts" />
/// <reference path="ui/ChatterPostAttachmentTest.ts" />
/// <reference path="ui/ChatterPostedByTest.ts" />

Coveo.Logger.disable();

module Coveo {
  var _ = window['_'];
}

function isPhantomJs() {
  return navigator.userAgent.indexOf('PhantomJS') != -1;
}
