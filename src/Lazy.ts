export * from './Core';

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
