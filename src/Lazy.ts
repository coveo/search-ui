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

import { lazySearchbox } from './ui/Searchbox/LazySearchbox';
lazySearchbox();

import { lazyFacet } from './ui/Facet/LazyFacet';
lazyFacet();

import { swapVar } from './SwapVar';
swapVar(this);

