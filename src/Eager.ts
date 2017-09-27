export * from './Core';

export { CoreHelpers } from './ui/Templates/CoreHelpers';
export { SearchInterface, StandaloneSearchInterface } from './ui/SearchInterface/SearchInterface';
export { jQueryInstance as $ } from './ui/Base/CoveoJQuery';
export { underscoreInstance as _ } from './ui/Base/CoveoUnderscore';
export { HashUtils } from './utils/HashUtils';
export { DeviceUtils } from './utils/DeviceUtils';
export { ColorUtils } from './utils/ColorUtils';
export { Cookie } from './utils/CookieUtils';
export { CurrencyUtils } from './utils/CurrencyUtils';
export { DateUtils } from './utils/DateUtils';

import { Initialization, EagerInitialization } from './ui/Base/Initialization';
Initialization.componentsFactory = EagerInitialization.componentsFactory;

import { AdvancedSearch } from './ui/AdvancedSearch/AdvancedSearch';
AdvancedSearch.doExport();

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

import { Badge } from './ui/Badge/Badge';
Badge.doExport();

import { Breadcrumb } from './ui/Breadcrumb/Breadcrumb';
Breadcrumb.doExport();

import { CardActionBar } from './ui/CardActionBar/CardActionBar';
CardActionBar.doExport();

import { CardOverlay } from './ui/CardOverlay/CardOverlay';
CardOverlay.doExport();

import { ChatterLikedBy } from './ui/ChatterLikedBy/ChatterLikedBy';
ChatterLikedBy.doExport();
import { registerFields as chatterLikedByRegisterFields } from './ui/ChatterLikedBy/ChatterLikedByFields';
chatterLikedByRegisterFields();

import { ChatterPostAttachment } from './ui/ChatterPostAttachment/ChatterPostAttachment';
ChatterPostAttachment.doExport();
import { registerFields as chatterPostAttachmentRegisterFields } from './ui/ChatterPostAttachment/ChatterPostAttachmentFields';
chatterPostAttachmentRegisterFields();

import { ChatterPostedBy } from './ui/ChatterPostedBy/ChatterPostedBy';
ChatterPostedBy.doExport();
import { registerFields as chatterPostedByRegisterFields } from './ui/ChatterPostedBy/ChatterPostedByFields';
chatterPostedByRegisterFields();

import { ChatterTopic } from './ui/ChatterTopic/ChatterTopic';
ChatterTopic.doExport();
import { registerFields as chatterTopicRegisterFields } from './ui/ChatterTopic/ChatterTopicFields';
chatterTopicRegisterFields();

import { DidYouMean } from './ui/DidYouMean/DidYouMean';
DidYouMean.doExport();

import { DistanceResources } from './ui/Distance/DistanceResources';
DistanceResources.doExport();

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

import { FacetSlider } from './ui/FacetSlider/FacetSlider';
FacetSlider.doExport();

import { FieldSuggestions } from './ui/FieldSuggestions/FieldSuggestions';
FieldSuggestions.doExport();

import { FieldTable } from './ui/FieldTable/FieldTable';
FieldTable.doExport();

import { FieldValue } from './ui/FieldValue/FieldValue';
FieldValue.doExport();

import { Folding } from './ui/Folding/Folding';
Folding.doExport();

import { FoldingForThread } from './ui/FoldingForThread/FoldingForThread';
FoldingForThread.doExport();

import { FollowItem } from './ui/FollowItem/FollowItem';
FollowItem.doExport();
import { registerFields as followItemRegisterFields } from './ui/FollowItem/FollowItemFields';
followItemRegisterFields();

import { HiddenQuery } from './ui/HiddenQuery/HiddenQuery';
HiddenQuery.doExport();

import { HierarchicalFacet } from './ui/HierarchicalFacet/HierarchicalFacet';
HierarchicalFacet.doExport();

import { Icon } from './ui/Icon/Icon';
Icon.doExport();
import { registerFields as iconRegisterFields } from './ui/Icon/IconFields';
iconRegisterFields();

import { Logo } from './ui/Logo/Logo';
Logo.doExport();

import { Matrix } from './ui/Matrix/Matrix';
Matrix.doExport();

import { Omnibox } from './ui/Omnibox/Omnibox';
Omnibox.doExport();

import { OmniboxResultList } from './ui/OmniboxResultList/OmniboxResultList';
OmniboxResultList.doExport();

import { Pager } from './ui/Pager/Pager';
Pager.doExport();

import { PipelineContext } from './ui/PipelineContext/PipelineContext';
PipelineContext.doExport();

import { PreferencesPanel } from './ui/PreferencesPanel/PreferencesPanel';
PreferencesPanel.doExport();

import { PrintableUri } from './ui/PrintableUri/PrintableUri';
PrintableUri.doExport();
import { registerFields as registerFieldsPrintableUri } from './ui/PrintableUri/PrintableUriFields';
registerFieldsPrintableUri();

import { Querybox } from './ui/Querybox/Querybox';
Querybox.doExport();

import { QueryDuration } from './ui/QueryDuration/QueryDuration';
QueryDuration.doExport();

import { QuerySummary } from './ui/QuerySummary/QuerySummary';
QuerySummary.doExport();

import { Quickview } from './ui/Quickview/Quickview';
Quickview.doExport();
import { registerFields as quickviewRegisterFields } from './ui/Quickview/QuickviewFields';
quickviewRegisterFields();

import { Recommendation } from './ui/Recommendation/Recommendation';
Recommendation.doExport();

import { ResultAttachments } from './ui/ResultAttachments/ResultAttachments';
ResultAttachments.doExport();

import { ResultFolding } from './ui/ResultFolding/ResultFolding';
ResultFolding.doExport();

import { ResultLayout } from './ui/ResultLayout/ResultLayout';
ResultLayout.doExport();

import { ResultLink } from './ui/ResultLink/ResultLink';
ResultLink.doExport();
import { registerFields as resultLinkRegisterFields } from './ui/ResultLink/ResultLinkFields';
resultLinkRegisterFields();

import { ResultList } from './ui/ResultList/ResultList';
ResultList.doExport();

import { ResultRating } from './ui/ResultRating/ResultRating';
ResultRating.doExport();

import { ResultsFiltersPreferences } from './ui/ResultsFiltersPreferences/ResultsFiltersPreferences';
ResultsFiltersPreferences.doExport();

import { ResultsPerPage } from './ui/ResultsPerPage/ResultsPerPage';
ResultsPerPage.doExport();

import { ResultsPreferences } from './ui/ResultsPreferences/ResultsPreferences';
ResultsPreferences.doExport();

import { ResultTagging } from './ui/ResultTagging/ResultTagging';
ResultTagging.doExport();

import { SearchAlerts } from './ui/SearchAlerts/SearchAlerts';
SearchAlerts.doExport();

import { Searchbox } from './ui/Searchbox/Searchbox';
Searchbox.doExport();

import { SearchButton } from './ui/SearchButton/SearchButton';
SearchButton.doExport();

import { Settings } from './ui/Settings/Settings';
Settings.doExport();

import { ShareQuery } from './ui/ShareQuery/ShareQuery';
ShareQuery.doExport();

import { Sort } from './ui/Sort/Sort';
Sort.doExport();

import { Tab } from './ui/Tab/Tab';
Tab.doExport();

import { TemplateLoader } from './ui/TemplateLoader/TemplateLoader';
TemplateLoader.doExport();

import { Text } from './ui/Text/Text';
Text.doExport();

import { Thumbnail } from './ui/Thumbnail/Thumbnail';
Thumbnail.doExport();
import { registerFields as thumbnailRegisterFields } from './ui/Thumbnail/ThumbnailFields';
thumbnailRegisterFields();

import { Triggers } from './ui/Triggers/Triggers';
Triggers.doExport();

import { YouTubeThumbnail } from './ui/YouTube/YouTubeThumbnail';
YouTubeThumbnail.doExport();
import { registerFields as youtubeThumbnailRegisterFields } from './ui/YouTube/YouTubeThumbnailFields';
youtubeThumbnailRegisterFields();

export { Template } from './ui/Templates/Template';

import { Checkbox } from './ui/FormWidgets/Checkbox';
Checkbox.doExport();

import { DatePicker } from './ui/FormWidgets/DatePicker';
DatePicker.doExport();

import { Dropdown } from './ui/FormWidgets/Dropdown';
Dropdown.doExport();

import { FormGroup } from './ui/FormWidgets/FormGroup';
FormGroup.doExport();

import { MultiSelect } from './ui/FormWidgets/MultiSelect';
MultiSelect.doExport();

import { NumericSpinner } from './ui/FormWidgets/NumericSpinner';
NumericSpinner.doExport();

import { RadioButton } from './ui/FormWidgets/RadioButton';
RadioButton.doExport();

import { TextInput } from './ui/FormWidgets/TextInput';
TextInput.doExport();

import { SimpleFilter } from './ui/SimpleFilter/SimpleFilter';
SimpleFilter.doExport();

import { swapVar } from './SwapVar';
swapVar(this);
