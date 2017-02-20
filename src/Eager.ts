export * from './Core';

// UI
export { CoreHelpers } from './ui/Templates/CoreHelpers';
export { SearchInterface, StandaloneSearchInterface } from './ui/SearchInterface/SearchInterface';

import { Aggregate } from './ui/Aggregate/Aggregate';
Aggregate.doExport();

import { Analytics } from './ui/Analytics/Analytics';
Analytics.doExport();

import { AnalyticsSuggestions } from './ui/AnalyticsSuggestions/AnalyticsSuggestions';
AnalyticsSuggestions.doExport();

import { AuthenticationProvider } from './ui/AuthenticationProvider/AuthenticationProvider';
AuthenticationProvider.doExport();

import { Backdrop } from './ui/Backdrop/Backdrop';
Backdrop.doExport();

import { Breadcrumb } from './ui/Breadcrumb/Breadcrumb';
Breadcrumb.doExport();

import { CardActionBar } from './ui/CardActionBar/CardActionBar';
CardActionBar.doExport();

import { CardOverlay } from './ui/CardOverlay/CardOverlay';
CardOverlay.doExport();

import { ChatterLikedBy } from './ui/ChatterLikedBy/ChatterLikedBy';
ChatterLikedBy.doExport();

import { ChatterPostAttachment } from './ui/ChatterPostAttachment/ChatterPostAttachment';
ChatterPostAttachment.doExport();

import { ChatterPostedBy } from './ui/ChatterPostedBy/ChatterPostedBy';
ChatterPostedBy.doExport();

import { ChatterTopic } from './ui/ChatterTopic/ChatterTopic';
ChatterTopic.doExport();

import { DidYouMean } from './ui/DidYouMean/DidYouMean';
DidYouMean.doExport();

import { ErrorReport } from './ui/ErrorReport/ErrorReport';
ErrorReport.doExport();

import { Excerpt } from './ui/Excerpt/Excerpt';
Excerpt.doExport();

import { ExportToExcel } from './ui/ExportToExcel/ExportToExcel';
ExportToExcel.doExport();

import { Facet } from './ui/Facet/Facet';
Facet.doExport();

import { FacetRange } from './ui/FacetRange/FacetRange';
FacetRange.doExport();

export { RecommendationAnalyticsClient } from './ui/Analytics/RecommendationAnalyticsClient';

import { Querybox } from './ui/Querybox/Querybox';
Querybox.doExport();

import { SearchButton } from './ui/SearchButton/SearchButton';
SearchButton.doExport();

export { Searchbox } from './ui/Searchbox/Searchbox';
export { Breadcrumb } from './ui/Breadcrumb/Breadcrumb';
export { Logo } from './ui/Logo/Logo';


export { Slider } from './ui/Misc/Slider';
export { FacetSlider } from './ui/FacetSlider/FacetSlider';


export { Pager } from './ui/Pager/Pager';
export { ResultsPerPage } from './ui/ResultsPerPage/ResultsPerPage';
export { ResultList } from './ui/ResultList/ResultList';
export { ResultLayout } from './ui/ResultLayout/ResultLayout';
export { DefaultRecommendationTemplate } from './ui/Templates/DefaultRecommendationTemplate';
export { Excerpt } from './ui/Excerpt/Excerpt';
export { ResultLink } from './ui/ResultLink/ResultLink';
export { Icon } from './ui/Icon/Icon';
export { Thumbnail } from './ui/Thumbnail/Thumbnail';
export { PrintableUri } from './ui/PrintableUri/PrintableUri';
export { Quickview } from './ui/Quickview/Quickview';
export { ErrorReport } from './ui/ErrorReport/ErrorReport';
export { ExportToExcel } from './ui/ExportToExcel/ExportToExcel';
export { Folding } from './ui/Folding/Folding';
export { HiddenQuery } from './ui/HiddenQuery/HiddenQuery';
export { HierarchicalFacet } from './ui/HierarchicalFacet/HierarchicalFacet';
export { Matrix } from './ui/Matrix/Matrix';
export { QuickviewDocument } from './ui/Quickview/QuickviewDocument';
export { YouTubeThumbnail } from './ui/YouTube/YouTubeThumbnail';
export { ResultAttachments } from './ui/ResultAttachments/ResultAttachments';
export { ResultFolding } from './ui/ResultFolding/ResultFolding';
export { FieldTable } from './ui/FieldTable/FieldTable';
export { FieldValue } from './ui/FieldTable/FieldValue';
export { Badge } from './ui/FieldTable/Badge';
export { ResultRating } from './ui/ResultRating/ResultRating';
export { PreferencesPanel } from './ui/PreferencesPanel/PreferencesPanel';
export { ResultsFiltersPreferences } from './ui/ResultsFiltersPreferences/ResultsFiltersPreferences';
export { Tab } from './ui/Tab/Tab';
export { Omnibox } from './ui/Omnibox/Omnibox';
export { QueryDuration } from './ui/QueryDuration/QueryDuration';
export { QuerySummary } from './ui/QuerySummary/QuerySummary';
export { Debug } from './ui/Debug/Debug';
export { Settings } from './ui/Settings/Settings';
export { ShareQuery } from './ui/ShareQuery/ShareQuery';
export { Sort } from './ui/Sort/Sort';
export { SortCriteria } from './ui/Sort/SortCriteria';
export { Triggers } from './ui/Triggers/Triggers';
export { Recommendation } from './ui/Recommendation/Recommendation';
export { RecommendationQuery } from './ui/Recommendation/RecommendationQuery';
export { TemplateLoader } from './ui/TemplateLoader/TemplateLoader';
export { Template } from './ui/Templates/Template';
export { SuggestionForOmnibox } from './ui/Misc/SuggestionForOmnibox';

export { FieldSuggestions } from './ui/FieldSuggestions/FieldSuggestions';

export { ResultTagging } from './ui/ResultTagging/ResultTagging';
export { ResultsPreferences } from './ui/ResultsPreferences/ResultsPreferences';
export { PipelineContext, context } from './ui/PipelineContext/PipelineContext';
export { OmniboxResultList } from './ui/OmniboxResultList/OmniboxResultList';
export { QueryboxQueryParameters } from './ui/Querybox/QueryboxQueryParameters';
export { ImageResultList } from './ui/ImageResultList/ImageResultList';
export { jQueryInstance as $ } from './ui/Base/CoveoJQuery';
export { underscoreInstance as _ } from './ui/Base/CoveoUnderscore';
export { AdvancedSearch } from './ui/AdvancedSearch/AdvancedSearch';
export { NumericSpinner } from './ui/AdvancedSearch/Form/NumericSpinner';
export { DatePicker } from './ui/AdvancedSearch/Form/DatePicker';
export { Dropdown } from './ui/AdvancedSearch/Form/Dropdown';
export { TextInput } from './ui/AdvancedSearch/Form/TextInput';
export { RadioButton } from './ui/AdvancedSearch/Form/RadioButton';
export { FollowItem } from './ui/SearchAlerts/FollowItem';
export { SearchAlerts } from './ui/SearchAlerts/SearchAlerts';
export { SearchAlertsMessage } from './ui/SearchAlerts/SearchAlertsMessage';
export { Text } from './ui/Text/Text';
export { FoldingForThread } from './ui/Folding/FoldingForThread';
export { HashUtils } from './utils/HashUtils';
export { DeviceUtils } from './utils/DeviceUtils';
export { ColorUtils } from './utils/ColorUtils';
export { Cookie } from './utils/CookieUtils';
export { CurrencyUtils } from './utils/CurrencyUtils';
export { DateUtils } from './utils/DateUtils';

import { swapVar } from './SwapVar';
swapVar(this);
