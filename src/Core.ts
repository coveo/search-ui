declare function require(modname: string);
// Shim for IE11 promise
// Will not override native promise in browsers that support them
require('es6-promise/auto');
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
