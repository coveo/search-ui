/// <reference path="../src/ui/SearchInterface/SearchInterface.ts" />

import {CookieUtilsTest} from './utils/CookieUtilsTest';
CookieUtilsTest();

import {DomTests} from './utils/DomTest';
DomTests();

import {HighlightUtilsTest} from './utils/HighlightUtilsTest';
HighlightUtilsTest();

import {L10NTest} from './utils/L10NTest';
L10NTest();

import {PromisesShimTest} from './misc/PromisesShimTest';
PromisesShimTest();

import {ModelTest} from './models/ModelTest';
ModelTest();

import {QueryStateModelTest} from './models/QueryStateModelTest';
QueryStateModelTest();

import {EndpointCallerTest} from './rest/EndpointCallerTest';
EndpointCallerTest();

import {SearchEndpointTest} from './rest/SearchEndpointTest';
SearchEndpointTest();

import {AggregateTest} from './ui/AggregateTest';
AggregateTest();

import {AnalyticsEndpointTest} from './ui/AnalyticsEndpointTest';
AnalyticsEndpointTest();

import {AnalyticsSuggestionsTest} from './ui/AnalyticsSuggestionsTest';
AnalyticsSuggestionsTest();

import {AnalyticsTest} from './ui/AnalyticsTest';
AnalyticsTest();
