export * from '../src/Index';

// Get a cleaner output in phantom js for CI builds
import {Logger} from '../src/misc/Logger';
import {Simulate} from './Simulate';
if (Simulate.isPhantomJs()) {
  Logger.disable();
}


import {defaultLanguage} from '../src/strings/DefaultLanguage';
defaultLanguage();

import {shim} from '../src/misc/PromisesShim';
shim();

import {CookieUtilsTest} from './utils/CookieUtilsTest';
CookieUtilsTest();

import {DomTests} from './utils/DomTest';
DomTests();

import {HighlightUtilsTest} from './utils/HighlightUtilsTest';
HighlightUtilsTest();

import {L10NTest} from './utils/L10NTest';
L10NTest();

import {PromisesShimTest} from './misc/PromisesShimTest';
PromisesShimTest();

import {ModelTest} from './models/ModelTest';
ModelTest();

import {QueryStateModelTest} from './models/QueryStateModelTest';
QueryStateModelTest();

import {EndpointCallerTest} from './rest/EndpointCallerTest';
EndpointCallerTest();

import {SearchEndpointTest} from './rest/SearchEndpointTest';
SearchEndpointTest();

import {FacetQueryControllerTest} from './controllers/FacetQueryControllerTest';
FacetQueryControllerTest();

import {HistoryControllerTest} from './controllers/HistoryControllerTest';
HistoryControllerTest();

import {QueryControllerTest} from './controllers/QueryControllerTest';
QueryControllerTest();

import {AdvancedSearchTest} from './ui/AdvancedSearch/AdvancedSearchTest';
AdvancedSearchTest();

import {TextInputTest} from './ui/AdvancedSearch/Form/TextInputTest';
TextInputTest();

import {NumericSpinnerTest} from './ui/AdvancedSearch/Form/NumericSpinnerTest';
NumericSpinnerTest();

import {DropdownTest} from './ui/AdvancedSearch/Form/DropdownTest';
DropdownTest();

import {DatePickerTest} from './ui/AdvancedSearch/Form/DatePickerTest';
DatePickerTest();

import {RadioButtonTest} from './ui/AdvancedSearch/Form/RadioButtonTest';
RadioButtonTest();

import {KeywordsInputTest} from './ui/AdvancedSearch/KeywordsInput/KeywordsInputTest';
KeywordsInputTest();

import {AnyKeywordsInputTest} from './ui/AdvancedSearch/KeywordsInput/AnyKeywordsInputTest';
AnyKeywordsInputTest();

import {ExactKeywordsInputTest} from './ui/AdvancedSearch/KeywordsInput/ExactKeywordsInputTest';
ExactKeywordsInputTest();

import {NoneKeywordsInputTest} from './ui/AdvancedSearch/KeywordsInput/NoneKeywordsInputTest';
NoneKeywordsInputTest();

import {DateInputTest} from './ui/AdvancedSearch/DateInput/DateInputTest';
DateInputTest();

import {BetweenDateInputTest} from './ui/AdvancedSearch/DateInput/BetweenDateInputTest';
BetweenDateInputTest();

import {InTheLastDateInputTest} from './ui/AdvancedSearch/DateInput/InTheLastDateInputTest';
InTheLastDateInputTest();

import {DocumentInputTest} from './ui/AdvancedSearch/DocumentInput/DocumentInputTest';
DocumentInputTest();

import {SimpleFieldInputTest} from './ui/AdvancedSearch/DocumentInput/SimpleFieldInputTest';
SimpleFieldInputTest();

import {AdvancedFieldInputTest} from './ui/AdvancedSearch/DocumentInput/AdvancedFieldInputTest';
AdvancedFieldInputTest();

import {SizeInputTest} from './ui/AdvancedSearch/DocumentInput/SizeInputTest';
SizeInputTest();

import {AggregateTest} from './ui/AggregateTest';
AggregateTest();

import {AnalyticsEndpointTest} from './ui/AnalyticsEndpointTest';
AnalyticsEndpointTest();

import {AnalyticsSuggestionsTest} from './ui/AnalyticsSuggestionsTest';
AnalyticsSuggestionsTest();

import {AnalyticsTest} from './ui/AnalyticsTest';
AnalyticsTest();

import {AuthenticationProviderTest} from './ui/AuthenticationProviderTest';
AuthenticationProviderTest();

import {BadgeTest} from './ui/BadgeTest';
BadgeTest();

import {BreadcrumbTest} from './ui/BreadcrumbTest';
BreadcrumbTest();

import {ChatterLikedByTest} from './ui/ChatterLikedByTest';
ChatterLikedByTest();

import {ChatterPostAttachmentTest} from './ui/ChatterPostAttachmentTest';
ChatterPostAttachmentTest();

import {ChatterPostedByTest} from './ui/ChatterPostedByTest';
ChatterPostedByTest();

import {ComponentEventsTest} from './ui/ComponentEventsTest';
ComponentEventsTest();

import {ComponentOptionsTest} from './ui/ComponentOptionsTest';
ComponentOptionsTest();

import {ComponentTest} from './ui/ComponentTest';
ComponentTest();

import {CurrentTabTest} from './ui/CurrentTabTest';
CurrentTabTest();

import {DidYouMeanTest} from './ui/DidYouMeanTest';
DidYouMeanTest();

import {ErrorReportTest} from './ui/ErrorReportTest';
ErrorReportTest();

import {ExcerptTest} from './ui/ExcerptTest';
ExcerptTest();

import {ExportToExcelTest} from './ui/ExportToExcelTest';
ExportToExcelTest();

import {ExpressionBuilderTest} from './ui/ExpressionBuilderTest';
ExpressionBuilderTest();

import {FacetHeaderTest} from './ui/FacetHeaderTest';
FacetHeaderTest();

import {FacetSearchParametersTest} from './ui/FacetSearchParametersTest';
FacetSearchParametersTest();

import {FacetSearchTest} from './ui/FacetSearchTest';
FacetSearchTest();

import {FacetSettingsTest} from './ui/FacetSettingsTest';
FacetSettingsTest();

import {FacetSliderTest} from './ui/FacetSliderTest';
FacetSliderTest();

import {FacetTest} from './ui/FacetTest';
FacetTest();

import {FieldSuggestionsTest} from './ui/FieldSuggestionsTest';
FieldSuggestionsTest();

import {FieldTableTest} from './ui/FieldTableTest';
FieldTableTest();

import {FieldValueTest} from './ui/FieldValueTest';
FieldValueTest();

import {FoldingTest} from './ui/FoldingTest';
FoldingTest();

import {FollowItemTest} from './ui/FollowItemTest';
FollowItemTest();

import {HiddenQueryTest} from './ui/HiddenQueryTest';
HiddenQueryTest();

import {HierarchicalFacetTest} from './ui/HierarchicalFacetTest';
HierarchicalFacetTest();

import {IconTest} from './ui/IconTest';
IconTest();

import {ImageResultListTest} from './ui/ImageResultListTest';
ImageResultListTest();

import {InitializationTest} from './ui/InitializationTest';
InitializationTest();

import {LiveAnalyticsClientTest} from './ui/LiveAnalyticsClientTest';
LiveAnalyticsClientTest();

import {MatrixTest} from './ui/MatrixTest';
MatrixTest();

import {OmniboxTest} from './ui/OmniboxTest';
OmniboxTest();

import {PagerTest} from './ui/PagerTest';
PagerTest();

import {PendingSearchAsYouTypeSearchEventTest} from './ui/PendingSearchAsYouTypeSearchEventTest';
PendingSearchAsYouTypeSearchEventTest();

import {PreferencesPanelTest} from './ui/PreferencesPanelTest';
PreferencesPanelTest();

import {QueryboxQueryParametersTest} from './ui/QueryboxQueryParametersTest';
QueryboxQueryParametersTest();

import {QueryboxTest} from './ui/QueryboxTest';
QueryboxTest();

import {QueryBuilderTest} from './ui/QueryBuilderTest';
QueryBuilderTest();

import {QueryDurationTest} from './ui/QueryDurationTest';
QueryDurationTest();

import {QuerySummaryTest} from './ui/QuerySummaryTest';
QuerySummaryTest();

import {RecommendationAnalyticsClientTest} from './ui/RecommendationAnalyticsClientTest';
RecommendationAnalyticsClientTest();

import {RecommendationQueryTest} from './ui/RecommendationQueryTest';
RecommendationQueryTest();

import {RecommendationTest} from './ui/RecommendationTest';
RecommendationTest();

import {ResultAttachmentsTest} from './ui/ResultAttachmentsTest';
ResultAttachmentsTest();

import {ResultFoldingTest} from './ui/ResultFoldingTest';
ResultFoldingTest();

import {ResultLinkTest} from './ui/ResultLinkTest';
ResultLinkTest();

import {ResultListTest} from './ui/ResultListTest';
ResultListTest();

import {ResultRatingTest} from './ui/ResultRatingTest';
ResultRatingTest();

import {ResultsPreferencesTest} from './ui/ResultsPreferencesTest';
ResultsPreferencesTest();

import {SearchAlertsMessageTest} from './ui/SearchAlertsMessageTest';
SearchAlertsMessageTest();

import {SearchAlertsTest} from './ui/SearchAlertsTest';
SearchAlertsTest();

import {SearchButtonTest} from './ui/SearchButtonTest';
SearchButtonTest();

import {SearchInterfaceTest} from './ui/SearchInterfaceTest';
SearchInterfaceTest();

import {SettingsTest} from './ui/SettingsTest';
SettingsTest();

import {ShareQueryTest} from './ui/ShareQueryTest';
ShareQueryTest();

import {SliderTest} from './ui/SliderTest';
SliderTest();

import {SortCriteriaTest} from './ui/SortCriteriaTest';
SortCriteriaTest();

import {SortTest} from './ui/SortTest';
SortTest();

import {TabTest} from './ui/TabTest';
TabTest();

import {TemplateLoaderTest} from './ui/TemplateLoaderTest';
TemplateLoaderTest();

import {ThumbnailTest} from './ui/ThumbnailTest';
ThumbnailTest();

import {TriggersTest} from './ui/TriggersTest';
TriggersTest();

import {ValueElementRendererTest} from './ui/ValueElementRendererTest';
ValueElementRendererTest();

import {ResultsPerPageTest} from './ui/ResultsPerPageTest';
ResultsPerPageTest();

import { LogoTest } from './ui/LogoTest';
LogoTest();

import {RegisteredNamedMethodsTest} from './ui/RegisteredNamedMethodsTest';
RegisteredNamedMethodsTest();

import {FacetValuesOrderTest} from './ui/FacetValuesOrderTest';
FacetValuesOrderTest();

import {SentryLoggerTest} from './misc/SentryLoggerTest';
SentryLoggerTest();

import {DebugTest} from './ui/DebugTest';
DebugTest();

import {StreamHighlightUtilsTest} from './utils/StreamHighlightUtilsTest';
StreamHighlightUtilsTest();

import {QuickviewTest} from './ui/QuickviewTest';
QuickviewTest();
