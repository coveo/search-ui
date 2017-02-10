export { underscoreInstance as _ } from './ui/Base/CoveoUnderscore';
export * from './BaseModules';
export * from './MiscModules';
export * from './RestModules';
export * from './EventsModules';
export * from './UtilsModules';
export * from './ControllersModules';
export * from './ModelsModules';
export * from './UIBaseModules';
export * from './TemplatesModules';

export { Analytics } from './ui/Analytics/Analytics';
export { AnalyticsSuggestions } from './ui/AnalyticsSuggestions/AnalyticsSuggestions';
export { FieldSuggestions } from './ui/FieldSuggestions/FieldSuggestions';
export { Omnibox } from './ui/Omnibox/Omnibox';
export { Querybox } from './ui/Querybox/Querybox';
export { SearchButton } from './ui/SearchButton/SearchButton';
export { Searchbox } from './ui/Searchbox/Searchbox';

import { swapVar } from './SwapVar';
swapVar(this);
