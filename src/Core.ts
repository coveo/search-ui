// We need a custom trigger function for our Promise polyfill
// because the default one can cause issues in other frameworks that relies on
// their own Promise polyfill like the Salesforce Aura framework.
const promise = window['Promise'];
if (!(promise instanceof Function)) {
  require('es6-promise/auto');
}

export { underscoreInstance as _ } from './ui/Base/CoveoUnderscore';
export * from './BaseModules';
export * from './MiscModules';
export * from './RestModules';
export * from './EventsModules';
export * from './ControllersModules';
export * from './ModelsModules';
export * from './UIBaseModules';
export * from './TemplatesModules';
export * from './UtilsModules';
