export * from './BaseModules';
export * from './MiscModules';
export * from './RestModules';
export * from './EventsModules';
export * from './UtilsModules';
export * from './ControllersModules';
export * from './ModelsModules';
export * from './UIBaseModules';
export * from './TemplatesModules';

// UI
export {CoreHelpers} from './ui/Templates/CoreHelpers';
export {SearchInterface, StandaloneSearchInterface} from './ui/SearchInterface/SearchInterface';
export {Aggregate} from './ui/Aggregate/Aggregate';
export {Analytics} from './ui/Analytics/Analytics';
export {PendingSearchEvent} from './ui/Analytics/PendingSearchEvent';
export {PendingSearchAsYouTypeSearchEvent} from './ui/Analytics/PendingSearchAsYouTypeSearchEvent';
export {analyticsActionCauseList} from './ui/Analytics/AnalyticsActionListMeta';
export {NoopAnalyticsClient} from './ui/Analytics/NoopAnalyticsClient';
export {LiveAnalyticsClient} from './ui/Analytics/LiveAnalyticsClient';
export {RecommendationAnalyticsClient} from './ui/Analytics/RecommendationAnalyticsClient';
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
export {underscoreInstance as _} from './ui/Base/CoveoUnderscore';
export {AdvancedSearch} from './ui/AdvancedSearch/AdvancedSearch';
export {TextInput} from './ui/AdvancedSearch/Form/TextInput';
export {NumericSpinner} from './ui/AdvancedSearch/Form/NumericSpinner';
export {Dropdown} from './ui/AdvancedSearch/Form/Dropdown';
export {DatePicker} from './ui/AdvancedSearch/Form/DatePicker';
export {KeywordsInput} from './ui/AdvancedSearch/KeywordsInput/KeywordsInput';
export {AllKeywordsInput} from './ui/AdvancedSearch/KeywordsInput/AllKeywordsInput';
export {AnyKeywordsInput} from './ui/AdvancedSearch/KeywordsInput/AnyKeywordsInput';
export {ExactKeywordsInput} from './ui/AdvancedSearch/KeywordsInput/ExactKeywordsInput';
export {NoneKeywordsInput} from './ui/AdvancedSearch/KeywordsInput/NoneKeywordsInput';
export {DateInput} from './ui/AdvancedSearch/DateInput/DateInput';
export {BetweenDateInput} from './ui/AdvancedSearch/DateInput/BetweenDateInput';
export {InTheLastDateInput} from './ui/AdvancedSearch/DateInput/InTheLastDateInput';
export {DocumentInput} from './ui/AdvancedSearch/DocumentInput/DocumentInput';
export {SimpleFieldInput} from './ui/AdvancedSearch/DocumentInput/SimpleFieldInput';
export {AdvancedFieldInput} from './ui/AdvancedSearch/DocumentInput/AdvancedFieldInput';
export {SizeInput} from './ui/AdvancedSearch/DocumentInput/SizeInput';
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

// Webpack output a library target with a temporary name.
// This is to allow end user to put CoveoJsSearch.Dependencie.js before or after the main CoveoJsSearch.js, without breaking
// This code swap the current module to the "real" Coveo variable.

let swapVar = () => {
  if (window['Coveo'] == undefined) {
    window['Coveo'] = this;
  } else {
    _.each(_.keys(this), (k) => {
      window['Coveo'][k] = this[k];
    })
  }
}
swapVar();
