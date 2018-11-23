export * from './ui/Base/RegisteredNamedMethods';
export { ComponentOptions, ComponentOptionsType } from './ui/Base/ComponentOptions';
export { Component } from './ui/Base/Component';
export { BaseComponent } from './ui/Base/BaseComponent';
export { RootComponent } from './ui/Base/RootComponent';
export { QueryBuilder } from './ui/Base/QueryBuilder';
export { ExpressionBuilder } from './ui/Base/ExpressionBuilder';
export { IResultsComponentBindings } from './ui/Base/ResultsComponentBindings';
// Export Initialization under both name, for legacy reason and old code in the wild that
// reference the old CoveoJQuery module
export { Initialization } from './ui/Base/Initialization';
export { Initialization as CoveoJQuery } from './ui/Base/Initialization';
export { initCoveoJQuery } from './ui/Base/CoveoJQuery';
