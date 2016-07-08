import {defaultLanguage} from './strings/DefaultLanguage';
defaultLanguage();
export {setLanguageAfterPageLoaded} from './strings/DefaultLanguage';
import {shim} from './misc/PromisesShim';
shim();
import {customEventPolyfill} from './misc/CustomEventPolyfill';
customEventPolyfill();

// MISC
export {version} from './misc/Version';
export {Assert} from './misc/Assert';
export {Cache} from './misc/Cache';
export {Defer} from './misc/Defer';
export {L10N} from './misc/L10N';
export {Logger} from './misc/Logger';
export {Options} from './misc/Options';
export {l} from './strings/Strings';

// REST
export {SearchEndpoint} from './rest/SearchEndpoint';
export {AnalyticsEndpoint} from './rest/AnalyticsEndpoint';
export {EndpointCaller} from './rest/EndpointCaller';
export {QueryError} from './rest/QueryError';

// EVENTS
export {AnalyticsEvents} from './events/AnalyticsEvents';
export {BreadcrumbEvents} from './events/BreadcrumbEvents';
export {DebugEvents} from './events/DebugEvents';
export {ImageResultListEvents} from './events/ImageResultListEvents';
export {InitializationEvents} from './events/InitializationEvents';
export {OmniboxEvents} from './events/OmniboxEvents';
export {PreferencesPanelEvents} from './events/PreferencesPanelEvents';
export {QueryEvents} from './events/QueryEvents';
export {ResultListEvents} from './events/ResultListEvents';
export {SearchAlertsEvents} from './events/SearchAlertEvents';
export {SettingsEvents} from './events/SettingsEvents';
export {SliderEvents} from './events/SliderEvents';
export {StandaloneSearchInterfaceEvents} from './events/StandaloneSearchInterfaceEvents';

// UTILS
export {ColorUtils} from './utils/ColorUtils';
export {Cookie} from './utils/CookieUtils';
export {CurrencyUtils} from './utils/CurrencyUtils';
export {DateUtils} from './utils/DateUtils';
export {DeviceUtils} from './utils/DeviceUtils';
export {Dom, $$} from './utils/Dom';
export {DomUtils} from './utils/DomUtils';
export {EmailActionsUtils} from './utils/EmailActionsUtils';
export {EmailUtils} from './utils/EmailUtils';
export {FeatureDetectionUtils} from './utils/FeatureDetectionUtils';
export {HashUtils} from './utils/HashUtils';
export {HighlightUtils, StringAndHoles} from './utils/HighlightUtils';
export {HTMLUtils} from './utils/HtmlUtils';
export {KEYBOARD, KeyboardUtils} from './utils/KeyboardUtils';
export {LocalStorageUtils} from './utils/LocalStorageUtils';
export {OSUtils, OS_NAME} from './utils/OSUtils';
export {PopupUtils} from './utils/PopupUtils';
export {QueryUtils} from './utils/QueryUtils';
export {StreamHighlightUtils} from './utils/StreamHighlightUtils';
export {StringUtils} from './utils/StringUtils';
export {TimeSpan} from './utils/TimeSpanUtils';
export {Utils} from './utils/Utils';

// CONTROLLERS
export {QueryController} from './controllers/QueryController';
export {FacetQueryController} from './controllers/FacetQueryController';
export {FacetRangeQueryController} from './controllers/FacetRangeQueryController';
export {FacetSliderQueryController} from './controllers/FacetSliderQueryController';
export {HierarchicalFacetQueryController} from './controllers/HierarchicalFacetQueryController';
export {HistoryController} from './controllers/HistoryController';
export {LocalStorageHistoryController} from './controllers/LocalStorageHistoryController';

// MODELS
export {Model} from './models/Model';
export {QueryStateModel} from './models/QueryStateModel';
export {ComponentOptionsModel} from './models/ComponentOptionsModel';
export {ComponentStateModel} from './models/ComponentStateModel';

// UI BASE
export * from './ui/Base/RegisteredNamedMethods';
export {ComponentOptions, ComponentOptionsType} from './ui/Base/ComponentOptions';
export {Component} from './ui/Base/Component';
export {BaseComponent} from './ui/Base/BaseComponent';
export {RootComponent} from './ui/Base/RootComponent';
export {QueryBuilder} from './ui/Base/QueryBuilder';
export {ExpressionBuilder} from './ui/Base/ExpressionBuilder';
export {Initialization} from './ui/Base/Initialization';
export {IResultsComponentBindings} from './ui/Base/ResultsComponentBindings';

// TEMPLATES
export {CoreHelpers} from './ui/Templates/CoreHelpers';
export {TemplateHelpers} from './ui/Templates/TemplateHelpers';
export {HtmlTemplate} from './ui/Templates/HtmlTemplate';
export {UnderscoreTemplate} from './ui/Templates/UnderscoreTemplate';
export {TemplateCache} from './ui/Templates/TemplateCache';

// UI
export {SearchInterface, StandaloneSearchInterface} from './ui/SearchInterface/SearchInterface';
export {Aggregate} from './ui/Aggregate/Aggregate';
export {Analytics} from './ui/Analytics/Analytics';
export {PendingSearchEvent} from './ui/Analytics/PendingSearchEvent';
export {PendingSearchAsYouTypeSearchEvent} from './ui/Analytics/PendingSearchAsYouTypeSearchEvent';
export {analyticsActionCauseList} from './ui/Analytics/AnalyticsActionListMeta';
export {NoopAnalyticsClient} from './ui/Analytics/NoopAnalyticsClient';
export {LiveAnalyticsClient} from './ui/Analytics/LiveAnalyticsClient';
export {MultiAnalyticsClient} from './ui/Analytics/MultiAnalyticsClient';
export {Querybox} from './ui/Querybox/Querybox';
export {SearchButton} from './ui/SearchButton/SearchButton';
export {Searchbox} from './ui/Searchbox/Searchbox';
export {Breadcrumb} from './ui/Breadcrumb/Breadcrumb';
export {Facet} from './ui/Facet/Facet';
export {FacetHeader} from './ui/Facet/FacetHeader';
export {FacetSearchValuesList} from './ui/Facet/FacetSearchValuesList';
export {FacetSettings} from './ui/Facet/FacetSettings';
export {FacetSort} from './ui/Facet/FacetSort';
export {FacetUtils} from './ui/Facet/FacetUtils';
export {FacetValueElement} from './ui/Facet/FacetValueElement';
export {FacetValue, FacetValues} from './ui/Facet/FacetValues';
export {ValueElementRenderer} from './ui/Facet/ValueElementRenderer';
export {FacetSearch} from './ui/Facet/FacetSearch';
export {FacetSearchParameters} from './ui/Facet/FacetSearchParameters';
export {Slider} from './ui/Misc/Slider';
export {FacetSlider} from './ui/FacetSlider/FacetSlider';
export {FacetRange} from './ui/FacetRange/FacetRange';
export {Pager} from './ui/Pager/Pager';
export {ResultList} from './ui/ResultList/ResultList';
export {Excerpt} from './ui/Excerpt/Excerpt';
export {ResultLink} from './ui/ResultLink/ResultLink';
export {Icon} from './ui/Icon/Icon';
export {Thumbnail} from './ui/Thumbnail/Thumbnail';
export {PrintableUri} from './ui/PrintableUri/PrintableUri';
export {Quickview} from './ui/Quickview/Quickview';
export {DidYouMean} from './ui/DidYouMean/DidYouMean';
export {ErrorReport} from './ui/ErrorReport/ErrorReport';
export {ExportToExcel} from './ui/ExportToExcel/ExportToExcel';
export {Folding} from './ui/Folding/Folding';
export {HiddenQuery} from './ui/HiddenQuery/HiddenQuery';
export {HierarchicalFacet} from './ui/HierarchicalFacet/HierarchicalFacet';
export {Matrix} from './ui/Matrix/Matrix';
export {QuickviewDocument} from './ui/Quickview/QuickviewDocument';
export {YouTubeThumbnail} from './ui/YouTube/YouTubeThumbnail';
export {ResultAttachments} from './ui/ResultAttachments/ResultAttachments';
export {ResultFolding} from './ui/ResultFolding/ResultFolding';
export {FieldTable} from './ui/FieldTable/FieldTable';
export {FieldValue} from './ui/FieldTable/FieldValue';
export {Badge} from './ui/FieldTable/Badge';
export {ResultRating} from './ui/ResultRating/ResultRating';
export {PreferencesPanel} from './ui/PreferencesPanel/PreferencesPanel';
export {ResultsFiltersPreferences} from './ui/ResultsFiltersPreferences/ResultsFiltersPreferences';
export {Tab} from './ui/Tab/Tab';
export {Omnibox} from './ui/Omnibox/Omnibox';
export {QueryDuration} from './ui/QueryDuration/QueryDuration';
export {QuerySummary} from './ui/QuerySummary/QuerySummary';
export {Debug} from './ui/Debug/Debug';
export {Settings} from './ui/Settings/Settings';
export {ShareQuery} from './ui/ShareQuery/ShareQuery';
export {Sort} from './ui/Sort/Sort';
export {SortCriteria} from './ui/Sort/SortCriteria';
export {Triggers} from './ui/Triggers/Triggers';
export {Recommendation} from './ui/Recommendation/Recommendation';
export {RecommendationQuery} from './ui/Recommendation/RecommendationQuery';
export {TemplateLoader} from './ui/TemplateLoader/TemplateLoader';
export {Template} from './ui/Templates/Template';
export {SuggestionForOmnibox} from './ui/Misc/SuggestionForOmnibox';
export {AnalyticsSuggestions} from './ui/AnalyticsSuggestions/AnalyticsSuggestions';
export {FieldSuggestions} from './ui/FieldSuggestions/FieldSuggestions';
export {AuthenticationProvider} from './ui/AuthenticationProvider/AuthenticationProvider';
export {ResultTagging} from './ui/ResultTagging/ResultTagging';
export {ResultsPreferences} from './ui/ResultsPreferences/ResultsPreferences';
export {PipelineContext, context} from './ui/PipelineContext/PipelineContext';
export {OmniboxResultList} from './ui/OmniboxResultList/OmniboxResultList';
export {CurrentTab} from './ui/CurrentTab/CurrentTab';
export {QueryboxQueryParameters} from './ui/Querybox/QueryboxQueryParameters';
export {ImageResultList} from './ui/ImageResultList/ImageResultList';
export {CoveoJQuery} from './ui/Base/CoveoJQuery';
export {jQueryInstance as $} from './ui/Base/CoveoJQuery';
export {FollowItem} from './ui/SearchAlerts/FollowItem';
export {SearchAlerts} from './ui/SearchAlerts/SearchAlerts';
export {SearchAlertsMessage} from './ui/SearchAlerts/SearchAlertsMessage';
export {Text} from './ui/Text/Text';
export {FoldingForThread} from './ui/Folding/FoldingForThread';
export {ResponsiveFacets} from './ui/ResponsiveComponents/ResponsiveFacets';
export {IResponsiveComponent, ResponsiveComponentsManager} from './ui/ResponsiveComponents/ResponsiveComponentsManager';
export {ChatterLikedBy} from './ui/ChatterLikedBy/ChatterLikedBy';
export {ChatterPostAttachment} from './ui/ChatterPostAttachment/ChatterPostAttachment';
export {ChatterPostedBy} from './ui/ChatterPostedBy/ChatterPostedBy';
export {ChatterTopic} from './ui/ChatterTopic/ChatterTopic';
export {ChatterUtils} from './utils/ChatterUtils';
