import {Promise} from 'es6-promise';

export interface IPopulateOmniboxObject {
  completeQueryExpression: IPopulateOmniboxQueryExpression;
  currentQueryExpression: IPopulateOmniboxQueryExpression;
  allQueryExpressions: IPopulateOmniboxQueryExpression[];
  cursorPosition: number;
  clear(): void;
  clearCurrentExpression(): void;
  replace(searchValue: string, newValue: string): void;
  replaceCurrentExpression(newValue: string): void;
  insertAt(at: number, toInsert: string): void;
  closeOmnibox(): void;
}

export interface IPopulateOmniboxQueryExpression {
  word: string;
  regex: RegExp;
}

export interface IOmniboxData extends IPopulateOmniboxObject {
  rows: IOmniboxDataRow[];
}

export interface IOmniboxDataRow {
  zIndex?: number;
  element?: HTMLElement;
  deferred?: Promise<IOmniboxDataRow>;
}
