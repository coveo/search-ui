/// <reference path="../lib/jasmine/index.d.ts" />
export * from '../src/Eager';
// Get a cleaner output in phantom js for CI builds
import { Logger } from '../src/misc/Logger';
import { Simulate } from './Simulate';
if (Simulate.isChromeHeadless()) {
  Logger.disable();
}

import { FacetValueSuggestionsProviderTest } from "./ui/FacetValueSuggestionsProviderTest";
FacetValueSuggestionsProviderTest();