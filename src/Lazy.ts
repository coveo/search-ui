export * from './Core';

// Hack for local dev...
// This publicPath is never set for some reason when using the dev server...
declare var __webpack_require__: any;
if (__webpack_require__.p == '') {
  __webpack_require__.p = 'http://localhost:8080/js/';
}

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

import { swapVar } from './SwapVar';
swapVar(this);

