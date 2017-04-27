import { shim } from './misc/PromisesShim';
shim();
import { customEventPolyfill } from './misc/CustomEventPolyfill';
customEventPolyfill();

// MISC
export { version } from './misc/Version';
export { SearchEndpoint } from './rest/SearchEndpoint';
export * from './ExternalModulesShim';

// Default language needs to be set after external module, since this is where l10n will be imported
import { defaultLanguage } from './strings/DefaultLanguage';
defaultLanguage();
export { setLanguageAfterPageLoaded } from './strings/DefaultLanguage';
