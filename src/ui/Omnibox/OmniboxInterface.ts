import {Promise} from 'es6-promise';

export interface IPopulateOmniboxObject {
  completeQueryExpression: PopulateOmniboxQueryExpression;
  currentQueryExpression: PopulateOmniboxQueryExpression;
  allQueryExpressions: PopulateOmniboxQueryExpression[];
  cursorPosition: number;
  clear(): void;
  clearCurrentExpression(): void;
  replace(searchValue: string, newValue: string): void;
  replaceCurrentExpression(newValue: string): void;
  insertAt(at: number, toInsert: string): void;
  closeOmnibox(): void;
}

export interface PopulateOmniboxQueryExpression {
  word: string;
  regex: RegExp;
}

export interface OmniboxData extends IPopulateOmniboxObject {
  rows: OmniboxDataRow[];
}

export interface OmniboxDataRow {
  zIndex?: number;
  element?: HTMLElement;
  deferred?: Promise<OmniboxDataRow>;
}
