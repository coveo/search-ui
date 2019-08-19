export * from '../src/Eager';
// Get a cleaner output in phantom js for CI builds
import { Logger } from '../src/misc/Logger';
import { Simulate } from './Simulate';
if (Simulate.isChromeHeadless()) {
  Logger.disable();
}

import { defaultLanguage } from '../src/strings/DefaultLanguage';
defaultLanguage();

import { SearchEndpointTest } from './rest/SearchEndpointTest';
SearchEndpointTest();

import { BackOffRequestTest } from './rest/BackOffRequestTest';
BackOffRequestTest();

import { FacetSortCriteriaTest } from './rest/Facet/FacetSortCriteriaTest';
FacetSortCriteriaTest();

import { CookieUtilsTest } from './utils/CookieUtilsTest';
CookieUtilsTest();

import { ColorUtilsTest } from './utils/ColorUtilsTest';
ColorUtilsTest();

import { DomTests } from './utils/DomTest';
DomTests();

import { HighlightUtilsTest } from './utils/HighlightUtilsTest';
HighlightUtilsTest();

import { L10NTest } from './misc/L10NTest';
L10NTest();

import { PromisesShimTest } from './misc/PromisesShimTest';
PromisesShimTest();

import { ModelTest } from './models/ModelTest';
ModelTest();

import { QueryStateModelTest } from './models/QueryStateModelTest';
QueryStateModelTest();

import { EndpointCallerTest } from './rest/EndpointCallerTest';
EndpointCallerTest();

import { AnalyticsEndpointCallerTest } from './rest/AnalyticsEndpointCallerTest';
AnalyticsEndpointCallerTest();

import { FacetQueryControllerTest } from './controllers/FacetQueryControllerTest';
FacetQueryControllerTest();

import { HistoryControllerTest } from './controllers/HistoryControllerTest';
HistoryControllerTest();

import { QueryControllerTest } from './controllers/QueryControllerTest';
QueryControllerTest();

import { AdvancedSearchTest } from './ui/AdvancedSearch/AdvancedSearchTest';
AdvancedSearchTest();

import { TextInputTest } from './ui/TextInputTest';
TextInputTest();

import { NumericSpinnerTest } from './ui/NumericSpinnerTest';
NumericSpinnerTest();

import { DropdownTest } from './ui/DropdownTest';
DropdownTest();

import { DatePickerTest } from './ui/DatePickerTest';
DatePickerTest();

import { RadioButtonTest } from './ui/RadioButtonTest';
RadioButtonTest();

import { KeywordsInputTest } from './ui/AdvancedSearch/KeywordsInput/KeywordsInputTest';
KeywordsInputTest();

import { AnyKeywordsInputTest } from './ui/AdvancedSearch/KeywordsInput/AnyKeywordsInputTest';
AnyKeywordsInputTest();

import { ExactKeywordsInputTest } from './ui/AdvancedSearch/KeywordsInput/ExactKeywordsInputTest';
ExactKeywordsInputTest();

import { NoneKeywordsInputTest } from './ui/AdvancedSearch/KeywordsInput/NoneKeywordsInputTest';
NoneKeywordsInputTest();

import { BetweenDateInputTest } from './ui/AdvancedSearch/DateInput/BetweenDateInputTest';
BetweenDateInputTest();

import { InTheLastDateInputTest } from './ui/AdvancedSearch/DateInput/InTheLastDateInputTest';
InTheLastDateInputTest();

import { DocumentInputTest } from './ui/AdvancedSearch/DocumentInput/DocumentInputTest';
DocumentInputTest();

import { SimpleFieldInputTest } from './ui/AdvancedSearch/DocumentInput/SimpleFieldInputTest';
SimpleFieldInputTest();

import { AdvancedFieldInputTest } from './ui/AdvancedSearch/DocumentInput/AdvancedFieldInputTest';
AdvancedFieldInputTest();

import { SizeInputTest } from './ui/AdvancedSearch/DocumentInput/SizeInputTest';
SizeInputTest();

import { AggregateTest } from './ui/AggregateTest';
AggregateTest();

import { AnalyticsEndpointTest } from './ui/AnalyticsEndpointTest';
AnalyticsEndpointTest();

import { AnalyticsSuggestionsTest } from './ui/AnalyticsSuggestionsTest';
AnalyticsSuggestionsTest();

import { AnalyticsTest } from './ui/AnalyticsTest';
AnalyticsTest();

import { AuthenticationProviderTest } from './ui/AuthenticationProviderTest';
AuthenticationProviderTest();

import { BadgeTest } from './ui/BadgeTest';
BadgeTest();

import { BreadcrumbTest } from './ui/BreadcrumbTest';
BreadcrumbTest();

import { ChatterLikedByTest } from './ui/ChatterLikedByTest';
ChatterLikedByTest();

import { ChatterPostAttachmentTest } from './ui/ChatterPostAttachmentTest';
ChatterPostAttachmentTest();

import { ChatterPostedByTest } from './ui/ChatterPostedByTest';
ChatterPostedByTest();

import { ComponentEventsTest } from './ui/ComponentEventsTest';
ComponentEventsTest();

import { ComponentOptionsTest } from './ui/ComponentOptionsTest';
ComponentOptionsTest();

import { ComponentTest } from './ui/ComponentTest';
ComponentTest();

import { DidYouMeanTest } from './ui/DidYouMeanTest';
DidYouMeanTest();

import { DistanceResourcesTest } from './ui/DistanceResourcesTest';
DistanceResourcesTest();

import { ErrorReportTest } from './ui/ErrorReportTest';
ErrorReportTest();

import { ExcerptTest } from './ui/ExcerptTest';
ExcerptTest();

import { ExportToExcelTest } from './ui/ExportToExcelTest';
ExportToExcelTest();

import { ExpressionBuilderTest } from './ui/ExpressionBuilderTest';
ExpressionBuilderTest();

import { FacetHeaderTest } from './ui/FacetHeaderTest';
FacetHeaderTest();

import { FacetSearchParametersTest } from './ui/FacetSearchParametersTest';
FacetSearchParametersTest();

import { FacetSearchTest } from './ui/FacetSearchTest';
FacetSearchTest();

import { FacetSettingsTest } from './ui/FacetSettingsTest';
FacetSettingsTest();

import { FacetSliderTest } from './ui/FacetSliderTest';
FacetSliderTest();

import { FacetTest } from './ui/FacetTest';
FacetTest();

import { BreadcrumbValueListTest } from './ui/BreadcrumbValuesListTest';
BreadcrumbValueListTest();

import { FieldSuggestionsTest } from './ui/FieldSuggestionsTest';
FieldSuggestionsTest();

import { FieldTableTest } from './ui/FieldTableTest';
FieldTableTest();

import { FieldValueTest } from './ui/FieldValueTest';
FieldValueTest();

import { FoldingTest } from './ui/FoldingTest';
FoldingTest();

import { FollowItemTest } from './ui/FollowItemTest';
FollowItemTest();

import { HiddenQueryTest } from './ui/HiddenQueryTest';
HiddenQueryTest();

import { HierarchicalFacetTest } from './ui/HierarchicalFacetTest';
HierarchicalFacetTest();

import { IconTest } from './ui/IconTest';
IconTest();

import { InitializationTest } from './ui/InitializationTest';
InitializationTest();

import { LazyInitializationTest } from './ui/LazyInitializationTest';
LazyInitializationTest();

import { LiveAnalyticsClientTest } from './ui/LiveAnalyticsClientTest';
LiveAnalyticsClientTest();

import { MatrixTest } from './ui/MatrixTest';
MatrixTest();

import { OmniboxTest } from './ui/OmniboxTest';
OmniboxTest();

import { OmniboxResultListTest } from './ui/OmniboxResultListTest';
OmniboxResultListTest();

import { PagerTest } from './ui/PagerTest';
PagerTest();

import { PendingSearchAsYouTypeSearchEventTest } from './ui/PendingSearchAsYouTypeSearchEventTest';
PendingSearchAsYouTypeSearchEventTest();

import { PreferencesPanelTest } from './ui/PreferencesPanelTest';
PreferencesPanelTest();

import { QueryboxQueryParametersTest } from './ui/QueryboxQueryParametersTest';
QueryboxQueryParametersTest();

import { QueryboxTest } from './ui/QueryboxTest';
QueryboxTest();

import { QueryBuilderTest } from './ui/QueryBuilderTest';
QueryBuilderTest();

import { QueryDurationTest } from './ui/QueryDurationTest';
QueryDurationTest();

import { QuerySummaryTest } from './ui/QuerySummaryTest';
QuerySummaryTest();

import { RecommendationAnalyticsClientTest } from './ui/RecommendationAnalyticsClientTest';
RecommendationAnalyticsClientTest();

import { RecommendationQueryTest } from './ui/RecommendationQueryTest';
RecommendationQueryTest();

import { RecommendationTest } from './ui/RecommendationTest';
RecommendationTest();

import { ResultAttachmentsTest } from './ui/ResultAttachmentsTest';
ResultAttachmentsTest();

import { ResultFoldingTest } from './ui/ResultFoldingTest';
ResultFoldingTest();

import { ResultLinkTest } from './ui/ResultLinkTest';
ResultLinkTest();

import { PrintableUriTest } from './ui/PrintableUriTest';
PrintableUriTest();

import { ResultListTest } from './ui/ResultListTest';
ResultListTest();

import { ResultListTableRendererTest } from './ui/ResultListTableRendererTest';
ResultListTableRendererTest();

import { ResultRatingTest } from './ui/ResultRatingTest';
ResultRatingTest();

import { ResultsPreferencesTest } from './ui/ResultsPreferencesTest';
ResultsPreferencesTest();

import { SearchAlertsMessageTest } from './ui/SearchAlertsMessageTest';
SearchAlertsMessageTest();

import { SearchAlertsTest } from './ui/SearchAlertsTest';
SearchAlertsTest();

import { SearchButtonTest } from './ui/SearchButtonTest';
SearchButtonTest();

import { FacetValueStateHandlerTest } from './ui/FacetValueStateHandlerTest';
FacetValueStateHandlerTest();

import { SearchInterfaceTest } from './ui/SearchInterfaceTest';
SearchInterfaceTest();

import { SettingsTest } from './ui/SettingsTest';
SettingsTest();

import { ShareQueryTest } from './ui/ShareQueryTest';
ShareQueryTest();

import { SliderTest } from './ui/SliderTest';
SliderTest();

import { SortCriteriaTest } from './ui/SortCriteriaTest';
SortCriteriaTest();

import { SortTest } from './ui/SortTest';
SortTest();

import { TabTest } from './ui/TabTest';
TabTest();

import { TableTemplateTest } from './ui/TableTemplateTest';
TableTemplateTest();

import { TemplateLoaderTest } from './ui/TemplateLoaderTest';
TemplateLoaderTest();

import { ThumbnailTest } from './ui/ThumbnailTest';
ThumbnailTest();

import { TriggersTest } from './ui/TriggersTest';
TriggersTest();

import { ValueElementRendererTest } from './ui/ValueElementRendererTest';
ValueElementRendererTest();

import { ResultActionsMenuTest } from './ui/ResultActionsMenuTest';
ResultActionsMenuTest();

import { ResultsPerPageTest } from './ui/ResultsPerPageTest';
ResultsPerPageTest();

import { ResultLayoutTest } from './ui/ResultLayoutTest';
ResultLayoutTest();

import { LogoTest } from './ui/LogoTest';
LogoTest();

import { RegisteredNamedMethodsTest } from './ui/RegisteredNamedMethodsTest';
RegisteredNamedMethodsTest();

import { FacetValuesOrderTest } from './ui/FacetValuesOrderTest';
FacetValuesOrderTest();

import { SentryLoggerTest } from './misc/SentryLoggerTest';
SentryLoggerTest();

import { DebugTest } from './ui/DebugTest';
DebugTest();

import { StreamHighlightUtilsTest } from './utils/StreamHighlightUtilsTest';
StreamHighlightUtilsTest();

import { BackdropTest } from './ui/BackdropTest';
BackdropTest();

import { CardActionBarTest } from './ui/CardActionBarTest';
CardActionBarTest();

import { QuickviewTest } from './ui/QuickviewTest';
QuickviewTest();

import { CardOverlayTest } from './ui/CardOverlayTest';
CardOverlayTest();

import { ResponsiveDropdownTest } from './ui/ResponsiveComponents/ResponsiveDropdownTest';
ResponsiveDropdownTest();

import { StandaloneSearchInterfaceTest } from './ui/StandaloneSearchInterfaceTest';
StandaloneSearchInterfaceTest();

import { ResponsiveFacetsTest } from './ui/ResponsiveComponents/ResponsiveFacetsTest';
ResponsiveFacetsTest();

import { ResponsiveRecommendationTest } from './ui/ResponsiveComponents/ResponsiveRecommendationTest';
ResponsiveRecommendationTest();

import { ResponsiveTabsTest } from './ui/ResponsiveComponents/ResponsiveTabsTest';
ResponsiveTabsTest();

import { ResponsiveDropdownContentTest } from './ui/ResponsiveComponents/ResponsiveDropdownContentTest';
ResponsiveDropdownContentTest();

import { RecommendationDropdownContentTest } from './ui/ResponsiveComponents/RecommendationDropdownContentTest';
RecommendationDropdownContentTest();

import { ResponsiveDropdownHeaderTest } from './ui/ResponsiveComponents/ResponsiveDropdownHeaderTest';
ResponsiveDropdownHeaderTest();

import { KeyboardUtilsTests } from './utils/KeyboardUtilsTest';
KeyboardUtilsTests();

import { HashUtilsTest } from './utils/HashUtilsTest';
HashUtilsTest();

import { StringUtilsTests } from './utils/StringUtilsTest';
StringUtilsTests();

import { CoreHelperTest } from './ui/CoreHelpersTest';
CoreHelperTest();

import { TemplateConditionEvaluatorTest } from './ui/TemplateConditionEvaluatorTest';
TemplateConditionEvaluatorTest();

import { PipelineContextText } from './ui/PipelineContextTest';
PipelineContextText();

import { QuerySuggestAddonTest } from './ui/QuerySuggestAddonTest';
QuerySuggestAddonTest();

import { TemplateFieldsEvaluatorTest } from './ui/TemplateFieldsEvaluatorTest';
TemplateFieldsEvaluatorTest();

import { DefaultRecommendationTemplateTest } from './ui/DefaultRecommendationTemplateTest';
DefaultRecommendationTemplateTest();

import { DefaultResultTemplateTest } from './ui/DefaultResultTemplateTest';
DefaultResultTemplateTest();

import { TemplateCacheTest } from './ui/TemplateCacheTest';
TemplateCacheTest();

import { TemplateTest } from './ui/TemplateTest';
TemplateTest();

import { DefaultInstantiateTemplateOptionsTest } from './ui/DefaultInstantiateTemplateOptionsTest';
DefaultInstantiateTemplateOptionsTest();

import { HtmlTemplateTest } from './ui/HtmlTemplateTest';
HtmlTemplateTest();

import { TemplateFromAScriptTagTest } from './ui/TemplateFromAScriptTagTest';
TemplateFromAScriptTagTest();

import { TemplateListTest } from './ui/TemplateListTest';
TemplateListTest();

import { UnderscoreTemplateTest } from './ui/UnderscoreTemplateTest';
UnderscoreTemplateTest();

import { ResponsiveComponentsTest } from './ui/ResponsiveComponentsTest';
ResponsiveComponentsTest();

import { ResponsiveComponentsManagerTest } from './ui/ResponsiveComponents/ResponsiveComponentsManagerTest';
ResponsiveComponentsManagerTest();

import { YouTubeThumbnailTest } from './ui/YouTubeThumbnailTest';
YouTubeThumbnailTest();

import { ResultTaggingTest } from './ui/ResultTaggingTest';
ResultTaggingTest();

import { ResultsFiltersPreferencesTest } from './ui/ResultsFiltersPreferencesTest';
ResultsFiltersPreferencesTest();

import { FacetRangeTest } from './ui/FacetRangeTest';
FacetRangeTest();

import { InitializationPlaceholderTest } from './ui/InitializationPlaceholderTest';
InitializationPlaceholderTest();

import { ValueElementTest } from './ui/ValueElementTest';
ValueElementTest();

import { PublicPathUtilsTest } from './utils/PublicPathUtilsTest';
PublicPathUtilsTest();

import { DomUtilsTest } from './utils/DomUtilsTest';
DomUtilsTest();

import { UtilsTest } from './utils/UtilsTest';
UtilsTest();

import { CheckboxTest } from './ui/CheckboxTest';
CheckboxTest();

import { FormGroupTest } from './ui/FormGroupTest';
FormGroupTest();

import { MultiSelectTest } from './ui/MultiSelectTest';
MultiSelectTest();

import { FacetSliderQueryControllerTest } from './controllers/FacetSliderQueryControllerTest';
FacetSliderQueryControllerTest();

import { DateUtilsTest } from './ui/DateUtilsTest';
DateUtilsTest();

import { DebugForResultTest } from './ui/DebugForResultTest';
DebugForResultTest();

import { DebugHeaderTest } from './ui/DebugHeaderTest';
DebugHeaderTest();

import { FacetValuesTest } from './ui/FacetValuesTest';
FacetValuesTest();

import { SimpleFilterTest } from './ui/SimpleFilterTest';
SimpleFilterTest();

import { DeviceUtilsTest } from './utils/DeviceUtilsTest';
DeviceUtilsTest();

import { TimespanFacetTest } from './ui/TimespanFacetTest';
TimespanFacetTest();

import { UrlUtilsTest } from './utils/UrlUtilsTest';
UrlUtilsTest();

import { AccessTokenTest } from './rest/AccessTokenTest';
AccessTokenTest();

import { CategoryFacetTest } from './ui/CategoryFacet/CategoryFacetTest';
CategoryFacetTest();

import { CategoryFacetValuesTreeTest } from './ui/CategoryFacet/CategoryFacetValuesTreeTest';
CategoryFacetValuesTreeTest();

import { FacetValueSuggestionsTest } from './ui/FacetValueSuggestionsTest';
FacetValueSuggestionsTest();

import { FacetValueSuggestionsProviderTest } from './ui/FacetValueSuggestionsProviderTest';
FacetValueSuggestionsProviderTest();

import { FacetColumnAutoLayoutAdjustmentTest } from './ui/FacetColumnAutoLayoutAdjustmentTest';
FacetColumnAutoLayoutAdjustmentTest();

import { AgGridTest } from './ui/RelevanceInspector/AgGridTest';
AgGridTest();

import { GenericValueOutputTest } from './ui/RelevanceInspector/GenericValueOutputTest';
GenericValueOutputTest();

import { RankingInfoParserTest } from './ui/RelevanceInspector/RankingInfoParserTest';
RankingInfoParserTest();

import { InlineRankingInfoTest } from './ui/RelevanceInspector/InlineRankingInfoTest';
InlineRankingInfoTest();

import { RelevanceInspectorTabsTest } from './ui/RelevanceInspector/RelevanceInspectorTabsTest';
RelevanceInspectorTabsTest();

import { TableBuilderTest } from './ui/RelevanceInspector/TableBuilderTest';
TableBuilderTest();

import { ThumbnailHtmlRendererTest } from './ui/RelevanceInspector/ThumbnailHtmlRendererTest';
ThumbnailHtmlRendererTest();

import { GenericHtmlRendererTest } from './ui/RelevanceInspector/GenericHtmlRendererTest';
GenericHtmlRendererTest();

import { AvailableFieldsTableTest } from './ui/RelevanceInspector/AvailableFieldsTableTest';
AvailableFieldsTableTest();

import { AvailableFieldsSampleValueTest } from './ui/RelevanceInspector/AvailableFieldsSampleValueTest';
AvailableFieldsSampleValueTest();

import { AvailableFieldsDatasourceTest } from './ui/RelevanceInspector/AvailableFieldsDatasourceTest';
AvailableFieldsDatasourceTest();

import { ExecutionReportGenericSectionTest } from './ui/RelevanceInspector/ExecutionReportGenericSectionTest';
ExecutionReportGenericSectionTest();

import { ExecutionReportEffectiveIndexQueryTest } from './ui/RelevanceInspector/ExecutionReportEffectiveIndexQuerySectionTest';
ExecutionReportEffectiveIndexQueryTest();

import { ExecutionReportSimpleSectionTest } from './ui/RelevanceInspector/ExecutionReportSimpleSectionTest';
ExecutionReportSimpleSectionTest();

import { ExecutionReportResolvedPipelineSectionTest } from './ui/RelevanceInspector/ExecutionReportResolvedPipelineSectionTest';
ExecutionReportResolvedPipelineSectionTest();

import { ExecutionReportRankingModifiersTest } from './ui/RelevanceInspector/ExecutionReportRankingModifiersTest';
ExecutionReportRankingModifiersTest();

import { ExecutionReportQueryOverrideSectionTest } from './ui/RelevanceInspector/ExecutionReportQueryOverrideSectionTest';
ExecutionReportQueryOverrideSectionTest();

import { ExecutionReportAuthenticationSectionTest } from './ui/RelevanceInspector/ExecutionReportAuthenticationSectionTest';
ExecutionReportAuthenticationSectionTest();

import { ExecutionReportITDSectionTest } from './ui/RelevanceInspector/ExecutionReportITDSectionTest';
ExecutionReportITDSectionTest();

import { ExecutionReportTest } from './ui/RelevanceInspector/ExecutionReportTest';
ExecutionReportTest();

import { RelevanceInspectorTest } from './ui/RelevanceInspector/RelevanceInspectorTest';
RelevanceInspectorTest();

import { FieldValuesRendererTest } from './ui/RelevanceInspector/FieldValuesRendererTest';
FieldValuesRendererTest();

import { MetaDataTableTest } from './ui/RelevanceInspector/MetaDataTableTest';
MetaDataTableTest();

import { QueryUtilsTest } from './utils/QueryUtilsTest';
QueryUtilsTest();

import { QuickviewDocumentWordTest } from './ui/QuickviewDocumentWordTest';
QuickviewDocumentWordTest();

import { QuickviewDocumentIframeTest } from './ui/QuickviewDocumentIframeTest';
QuickviewDocumentIframeTest();

import { QuickviewDocumentWordsTest } from './ui/QuickviewDocumentWordsTest';
QuickviewDocumentWordsTest();

import { QuickviewDocumentWordColorTest } from './ui/QuickviewDocumentWordColorTest';
QuickviewDocumentWordColorTest();

import { QuickviewDocumentPreviewBarTest } from './ui/QuickviewDocumentPreviewBarTest';
QuickviewDocumentPreviewBarTest();

import { QuickviewDocumentHeaderTest } from './ui/QuickviewDocumentHeaderTest';
QuickviewDocumentHeaderTest();

import { QuickviewDocumentWordButtonTest } from './ui/QuickviewDocumentWordButtonTest';
QuickviewDocumentWordButtonTest();

import { QuickviewDocumentTest } from './ui/QuickviewDocumentTest';
QuickviewDocumentTest();

import { CategoryFacetDebugTest } from './ui/CategoryFacet/CategoryFacetDebugTest';
CategoryFacetDebugTest();

import { CategoryFacetSearchTest } from './ui/CategoryFacet/CategoryFacetSearchTest';
CategoryFacetSearchTest();

import { CategoryFacetBreadcrumbTest } from './ui/CategoryFacet/CategoryFacetBreadcrumbTest';
CategoryFacetBreadcrumbTest();

import { CategoryValueTest } from './ui/CategoryFacet/CategoryValueTest';
CategoryValueTest();

import { CategoryFacetHeaderTest } from './ui/CategoryFacet/CategoryFacetHeaderTest';
CategoryFacetHeaderTest();

import { GrammarTest } from './magicbox/GrammarTest';
GrammarTest();

import { SuggestionsManagerTest } from './magicbox/SuggestionsManagerTest';
SuggestionsManagerTest();

import { MagicBoxClearTest } from './magicbox/MagicBoxClearTest';
MagicBoxClearTest();

import { AccessibleButtonTest } from './utils/AccessibleButtonTest';
AccessibleButtonTest();

import { AriaLiveTest } from './ui/AriaLiveTest';
AriaLiveTest();

import { QuerySummaryUtilsTest } from './utils/QuerySummaryUtilsTest';
QuerySummaryUtilsTest();

import { CategoryFacetQueryControllerTest } from './controllers/CategoryFacetQueryControllerTest';
CategoryFacetQueryControllerTest();

import { ComponentsTypesTest } from './utils/ComponentsTypesTest';
ComponentsTypesTest();

import { PromotedResultsBadgeTest } from './ui/PromotedResultsBadgeTest';
PromotedResultsBadgeTest();

import { ResultListUtilsTest } from './utils/ResultListUtilsTest';
ResultListUtilsTest();

import { FacetUtilsTest } from './utils/FacetUtilsTest';
FacetUtilsTest();

import { DynamicFacetTest } from './ui/DynamicFacet/DynamicFacetTest';
DynamicFacetTest();

import { DynamicFacetHeaderTest } from './ui/DynamicFacet/DynamicFacetHeader/DynamicFacetHeaderTest';
DynamicFacetHeaderTest();

import { DynamicFacetHeaderButtonTest } from './ui/DynamicFacet/DynamicFacetHeader/DynamicFacetHeaderButtonTest';
DynamicFacetHeaderButtonTest();

import { DynamicFacetHeaderCollapseToggleTest } from './ui/DynamicFacet/DynamicFacetHeader/DynamicFacetHeaderCollapseToggleTest';
DynamicFacetHeaderCollapseToggleTest();

import { DynamicFacetValuesTest } from './ui/DynamicFacet/DynamicFacetValues/DynamicFacetValuesTest';
DynamicFacetValuesTest();

import { DynamicFacetValueTest } from './ui/DynamicFacet/DynamicFacetValues/DynamicFacetValueTest';
DynamicFacetValueTest();

import { DynamicFacetValueCheckboxTest } from './ui/DynamicFacet/DynamicFacetValues/DynamicFacetValueCheckboxTest';
DynamicFacetValueCheckboxTest();

import { DynamicFacetValueRendererTest } from './ui/DynamicFacet/DynamicFacetValues/DynamicFacetValueRendererTest';
DynamicFacetValueRendererTest();

import { DynamicFacetSearchValueRendererTest } from './ui/DynamicFacet/DynamicFacetValues/DynamicFacetSearchValueRendererTest';
DynamicFacetSearchValueRendererTest();

import { DynamicFacetBreadcrumbsTest } from './ui/DynamicFacet/DynamicFacetBreadcrumbsTest';
DynamicFacetBreadcrumbsTest();

import { DynamicFacetQueryControllerTest } from './controllers/DynamicFacetQueryControllerTest';
DynamicFacetQueryControllerTest();

import { DynamicFacetManagerTest } from './ui/DynamicFacetManagerTest';
DynamicFacetManagerTest();

import { DynamicFacetValueFormatterTest } from './ui/DynamicFacet/DynamicFacetValues/DynamicFacetValueFormatterTest';
DynamicFacetValueFormatterTest();

import { FacetSearchControllerTest } from './controllers/FacetSearchControllerTest';
FacetSearchControllerTest();

import { MissingTermsTest } from './ui/MissingTermsTest';
MissingTermsTest();

import { MissingTermsManagerTest } from './ui/MissingTermManagerTest';
MissingTermsManagerTest();

import { SearchboxResizeTest } from './utils/SearchboxResizeTest';
SearchboxResizeTest();

import { DependsOnManagerTest } from './utils/DependsOnManagerTest';
DependsOnManagerTest();

import { ComboboxTest } from './ui/Combobox/ComboboxTest';
ComboboxTest();

import { ComboboxInputTest } from './ui/Combobox/ComboboxInputTest';
ComboboxInputTest();

import { ComboboxValuesTest } from './ui/Combobox/ComboboxValuesTest';
ComboboxValuesTest();

import { QuerySuggestPreviewTest } from './ui/QuerySuggestPreviewTest';
QuerySuggestPreviewTest();

import { FieldImageTest } from './ui/ImageFieldValueTest';
FieldImageTest();

import { OmniboxAnalyticsTest } from './ui/OmniboxAnalyticsTest';
OmniboxAnalyticsTest();
