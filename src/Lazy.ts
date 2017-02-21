export * from './Core';

// Hack for local dev ...
// This publicPath is never set for some reason when using the dev server ...
declare var __webpack_require__: any;
if (__webpack_require__.p == '') {
  __webpack_require__.p = 'http://localhost:8080/js/';
}

import { lazyAdvancedSearch } from './ui/AdvancedSearch/LazyAdvancedSearch';
lazyAdvancedSearch();

import { lazyAggregate } from './ui/Aggregate/LazyAggregate';
lazyAggregate();

import { lazyAnalytics } from './ui/Analytics/LazyAnalytics';
lazyAnalytics();

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

import { lazyChatterPostAttachment } from './ui/ChatterPostAttachment/LazyChatterPostAttachment';
lazyChatterPostAttachment();

import { lazyChatterPostedBy } from './ui/ChatterPostedBy/LazyChatterPostedBy';
lazyChatterPostedBy();

import  { lazyChatterTopic } from './ui/ChatterTopic/LazyChatterTopic';
lazyChatterTopic();

import { lazyDidYouMean } from './ui/DidYouMean/LazyDidYouMean';
lazyDidYouMean();

import { lazyErrorReport } from './ui/ErrorReport/LazyErrorReport';
lazyErrorReport();

import { lazyExcerpt } from './ui/Excerpt/LazyExcerpt';
lazyExcerpt();

import { lazyExportToExcel } from './ui/ExportToExcel/LazyExportToExcel';
lazyExportToExcel();

import { lazySearchbox } from './ui/Searchbox/LazySearchbox';
lazySearchbox();

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

import { lazyImageResultList } from './ui/ImageResultList/LazyImageResultList';
lazyImageResultList();

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

import { lazyQuerybox } from './ui/Querybox/LazyQuerybox';
lazyQuerybox();

import { lazyQueryDuration } from './ui/QueryDuration/LazyQueryDuration';
lazyQueryDuration();

import { lazyQuerySummary } from './ui/QuerySummary/LazyQuerySummary';
lazyQuerySummary();

import { lazyQuickview } from './ui/Quickview/LazyQuickview';
lazyQuickview();

import {} from './'

import { swapVar } from './SwapVar';
swapVar(this);

