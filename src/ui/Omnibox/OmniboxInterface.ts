/**
 * The `IPopulateOmniboxObject` is an interface that is used by components to interact with the Omnibox and provides a framework for type-ahead suggestions.
 */
export interface IPopulateOmniboxObject {
  /**
   * A {@link IPopulateOmniboxQueryExpression} object used to describe the complete content of the Querybox component.
   */
  completeQueryExpression: IPopulateOmniboxQueryExpression;
  /**
   * A {@link IPopulateOmniboxQueryExpression} object used to describe the current active content (the current position of the cursor/caret) of the Omnibox component.
   */
  currentQueryExpression: IPopulateOmniboxQueryExpression;
  /**
   * An array {@link IPopulateOmniboxQueryExpression} used to describe each part of the content of the Omnibox component.
   */
  allQueryExpressions: IPopulateOmniboxQueryExpression[];
  /**
   * The number representing the current position of the cursor/caret inside the {@link Omnibox} component.
   */
  cursorPosition: number;
  /**
   * Clears the content of the {@link Omnibox} Component.
   */
  clear(): void;
  /**
   * Clears the current expression (current cursor position in the Omnibox).
   */
  clearCurrentExpression(): void;
  /**
   * Replaces the specified `searchValue` by the `newValue` in the Omnibox.
   * @param searchValue
   * @param newValue
   */
  replace(searchValue: string, newValue: string): void;
  /**
   * Replaces the current expression in the `QueryBox` (the current cursor position in the omnibox) by the `newValue`.
   * @param newValue
   */
  replaceCurrentExpression(newValue: string): void;
  /**
   * Inserts new content in the omnibox at the specified position.
   * @param at
   * @param toInsert
   */
  insertAt(at: number, toInsert: string): void;
  /**
   * Closes the Omnibox.
   */
  closeOmnibox(): void;
}

/**
 * This object is a simple interface that describes the content of an omnibox query expression.
 */
export interface IPopulateOmniboxQueryExpression {
  /**
   * This is a simple string with the plain content of the {@link Omnibox}.
   */
  word: string;
  /**
   * This is a regex of the content of the {@link Omnibox} with some special character escaped.
   */
  regex: RegExp;
}

export interface IOmniboxData extends IPopulateOmniboxObject {
  rows: IOmniboxDataRow[];
}

/**
 * The content that external code that wants to populate the omnibox need to populate.
 */
export interface IOmniboxDataRow {
  /**
   * This is an optional property. It is used by each component to influence their rendering order in the Omnibox. It works like a normal CSS `zIndex`: higher value will render at the top most level. Providing no `zIndex` will make your item render with a low priority.
   */
  zIndex?: number;
  /**
   * This an `HTMLElement` that you want the Omnibox to render.
   *
   * It can be any valid HTML element (div, span, image, table, etc.). You can bind any event you want to this element and also add logic to handle the Omnibox (e.g. should the Omnibox close itself when clicking on your suggestion, should the Omnibox clear itself?).
   *
   * This element you provide can be as complex as you want it to be (see Providing Suggestions for the Omnibox).
   */
  element?: HTMLElement;
  /**
   * This is a Promise object. It is used when you want to make an asynchronous call (most likely an Ajax request) to a service in order to retrieve the data that you will use to build your HTML content.
   */
  deferred?: Promise<IOmniboxDataRow>;
}
