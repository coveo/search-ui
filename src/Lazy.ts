export * from './Core';

export { SearchInterface, StandaloneSearchInterface } from './ui/SearchInterface/SearchInterface';

export { PublicPathUtils } from './utils/PublicPathUtils';

import { PublicPathUtils } from './utils/PublicPathUtils';
PublicPathUtils.detectPublicPath();

import { Initialization, LazyInitialization } from './ui/Base/Initialization';
Initialization.componentsFactory = LazyInitialization.componentsFactory;

export { LazyInitialization, EagerInitialization, Initialization } from './ui/Base/Initialization';

import { Analytics } from './ui/Analytics/Analytics';
Analytics.doExport();

import { lazyAdvancedSearch } from './ui/AdvancedSearch/LazyAdvancedSearch';
lazyAdvancedSearch();

import { lazyAggregate } from './ui/Aggregate/LazyAggregate';
lazyAggregate();

import { lazyAnalyticsSuggestions } from './ui/AnalyticsSuggestions/LazyAnalyticsSuggestions';
lazyAnalyticsSuggestions();

import { lazyAuthenticationProvider } from './ui/AuthenticationProvider/LazyAuthenticationProvider';
lazyAuthenticationProvider();

import { lazyBackdrop } from './ui/Backdrop/LazyBackdrop';
lazyBackdrop();

import { lazyBadge } from './ui/Badge/LazyBadge';
lazyBadge();

import { lazyBreadcrumb } from './ui/Breadcrumb/LazyBreadcrumb';
lazyBreadcrumb();

import { lazyCardActionBar } from './ui/CardActionBar/LazyCardActionBar';
lazyCardActionBar();

import { lazyCardOverlay } from './ui/CardOverlay/LazyCardOverlay';
lazyCardOverlay();

import { lazyChatterLikedBy } from './ui/ChatterLikedBy/LazyChatterLikedBy';
lazyChatterLikedBy();
import { registerFields as chatterLikedByRegisterFields } from './ui/ChatterLikedBy/ChatterLikedByFields';
chatterLikedByRegisterFields();

import { lazyChatterPostAttachment } from './ui/ChatterPostAttachment/LazyChatterPostAttachment';
lazyChatterPostAttachment();
import { registerFields as chatterPostAttachmentRegisterFields } from './ui/ChatterPostAttachment/ChatterPostAttachmentFields';
chatterPostAttachmentRegisterFields();

import { lazyChatterPostedBy } from './ui/ChatterPostedBy/LazyChatterPostedBy';
lazyChatterPostedBy();
import { registerFields as chatterPostedByRegisterFields } from './ui/ChatterPostedBy/ChatterPostedByFields';
chatterPostedByRegisterFields();

import { lazyChatterTopic } from './ui/ChatterTopic/LazyChatterTopic';
lazyChatterTopic();
import { registerFields as chatterTopicRegisterFields } from './ui/ChatterTopic/ChatterTopicFields';
chatterTopicRegisterFields();

import { lazyDidYouMean } from './ui/DidYouMean/LazyDidYouMean';
lazyDidYouMean();

import { lazyDistanceResources } from './ui/Distance/LazyDistanceResources';
lazyDistanceResources();

import { lazyErrorReport } from './ui/ErrorReport/LazyErrorReport';
lazyErrorReport();

import { lazyExcerpt } from './ui/Excerpt/LazyExcerpt';
lazyExcerpt();

import { lazyExportToExcel } from './ui/ExportToExcel/LazyExportToExcel';
lazyExportToExcel();

import { lazyFacet } from './ui/Facet/LazyFacet';
lazyFacet();

import { lazyFacetRange } from './ui/FacetRange/LazyFacetRange';
lazyFacetRange();

import { lazyFacetSlider } from './ui/FacetSlider/LazyFacetSlider';
lazyFacetSlider();

import { lazyFieldSuggestions } from './ui/FieldSuggestions/LazyFieldSuggestions';
lazyFieldSuggestions();

import { lazyFieldTable } from './ui/FieldTable/LazyFieldTable';
lazyFieldTable();

import { lazyFieldValue } from './ui/FieldValue/LazyFieldValue';
lazyFieldValue();

import { lazyFolding } from './ui/Folding/LazyFolding';
lazyFolding();

import { lazyFoldingForThread } from './ui/FoldingForThread/LazyFoldingForThread';
lazyFoldingForThread();

import { lazyHiddenQuery } from './ui/HiddenQuery/LazyHiddenQuery';
lazyHiddenQuery();

import { lazyHierarchicalFacet } from './ui/HierarchicalFacet/LazyHierarchicalFacet';
lazyHierarchicalFacet();

import { lazyIcon } from './ui/Icon/LazyIcon';
lazyIcon();
import { registerFields as iconRegisterFields } from './ui/Icon/IconFields';
iconRegisterFields();

import { lazyLogo } from './ui/Logo/LazyLogo';
lazyLogo();

import { lazyMatrix } from './ui/Matrix/LazyMatrix';
lazyMatrix();

import { lazyOmnibox } from './ui/Omnibox/LazyOmnibox';
lazyOmnibox();

import { lazyOmniboxResultList } from './ui/OmniboxResultList/LazyOmniboxResultList';
lazyOmniboxResultList();

import { lazyPager } from './ui/Pager/LazyPager';
lazyPager();

import { lazyPipelineContext } from './ui/PipelineContext/LazyPipelineContext';
lazyPipelineContext();

import { lazyPreferencesPanel } from './ui/PreferencesPanel/LazyPreferencesPanel';
lazyPreferencesPanel();

import { lazyPrintableUri } from './ui/PrintableUri/LazyPrintableUri';
lazyPrintableUri();
import { registerFields as registerFieldsPrintableUri } from './ui/PrintableUri/PrintableUriFields';
registerFieldsPrintableUri();

import { lazyQuerybox } from './ui/Querybox/LazyQuerybox';
lazyQuerybox();

import { lazyQueryDuration } from './ui/QueryDuration/LazyQueryDuration';
lazyQueryDuration();

import { lazyQuerySummary } from './ui/QuerySummary/LazyQuerySummary';
lazyQuerySummary();

import { lazyQuickview } from './ui/Quickview/LazyQuickview';
lazyQuickview();
import { registerFields as quickviewRegisterFields } from './ui/Quickview/QuickviewFields';
quickviewRegisterFields();

import { lazyRecommendation } from './ui/Recommendation/LazyRecommendation';
lazyRecommendation();

import { lazyResultAttachment } from './ui/ResultAttachments/LazyResultAttachments';
lazyResultAttachment();

import { lazyResultFolding } from './ui/ResultFolding/LazyResultFolding';
lazyResultFolding();

import { lazyResultLayout } from './ui/ResultLayout/LazyResultLayout';
lazyResultLayout();

import { lazyResultLink } from './ui/ResultLink/LazyResultLink';
lazyResultLink();
import { registerFields as resultLinkRegisterFields } from './ui/ResultLink/ResultLinkFields';
resultLinkRegisterFields();

import { lazyResultList } from './ui/ResultList/LazyResultList';
lazyResultList();

import { lazyResultRating } from './ui/ResultRating/LazyResultRating';
lazyResultRating();

import { lazyResultsFiltersPreferences } from './ui/ResultsFiltersPreferences/LazyResultsFiltersPreferences';
lazyResultsFiltersPreferences();

import { lazyResultsPerPage } from './ui/ResultsPerPage/LazyResultsPerPage';
lazyResultsPerPage();

import { lazyResultsPreferences } from './ui/ResultsPreferences/LazyResultsPreferences';
lazyResultsPreferences();

import { lazyResultTagging } from './ui/ResultTagging/LazyResultTagging';
lazyResultTagging();

import { lazyFollowItem } from './ui/FollowItem/LazyFollowItem';
lazyFollowItem();
import { registerFields as followItemRegisterFields } from './ui/FollowItem/FollowItemFields';
followItemRegisterFields();

import { lazySearchAlerts } from './ui/SearchAlerts/LazySearchAlerts';
lazySearchAlerts();

import { lazySearchbox } from './ui/Searchbox/LazySearchbox';
lazySearchbox();

import { lazySearchButton } from './ui/SearchButton/LazySearchButton';
lazySearchButton();

import { lazySettings } from './ui/Settings/LazySettings';
lazySettings();

import { lazyShareQuery } from './ui/ShareQuery/LazyShareQuery';
lazyShareQuery();

import { lazySort } from './ui/Sort/LazySort';
lazySort();

import { lazyTab } from './ui/Tab/LazyTab';
lazyTab();

import { lazyTemplateLoader } from './ui/TemplateLoader/LazyTemplateLoader';
lazyTemplateLoader();

import { lazyText } from './ui/Text/LazyText';
lazyText();

import { lazyThumbnail } from './ui/Thumbnail/LazyThumbnail';
lazyThumbnail();
import { registerFields as thumbnailRegisterFields } from './ui/Thumbnail/ThumbnailFields';
thumbnailRegisterFields();

import { lazyTriggers } from './ui/Triggers/LazyTriggers';
lazyTriggers();

import { lazyYouTubeThumbnail } from './ui/YouTube/LazyYouTubeThumbnail';
lazyYouTubeThumbnail();
import { registerFields as youtubeThumbnailRegisterFields } from './ui/YouTube/YouTubeThumbnailFields';
youtubeThumbnailRegisterFields();

import { lazyCheckbox } from './ui/FormWidgets/LazyCheckbox';
lazyCheckbox();

import { lazyDatePicker } from './ui/FormWidgets/LazyDatePicker';
lazyDatePicker();

import { lazyDropdown } from './ui/FormWidgets/LazyDropdown';
lazyDropdown();

import { lazyFormGroup } from './ui/FormWidgets/LazyFormGroup';
lazyFormGroup();

import { lazyMultiSelect } from './ui/FormWidgets/LazyMultiSelect';
lazyMultiSelect();

import { lazyNumericSpinner } from './ui/FormWidgets/LazyNumericSpinner';
lazyNumericSpinner();

import { lazyRadioButton } from './ui/FormWidgets/LazyRadioButton';
lazyRadioButton();

import { lazyTextInput } from './ui/FormWidgets/LazyTextInput';
lazyTextInput();

import { lazySimpleFilter } from './ui/SimpleFilter/LazySimpleFilter';
lazySimpleFilter();

import { swapVar } from './SwapVar';
swapVar(this);
