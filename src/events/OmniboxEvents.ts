// The reference to magic-box with the triple slash is needed for dts-generator

import { IOmniboxData, IOmniboxDataRow } from '../ui/Omnibox/OmniboxInterface';
import { Omnibox } from '../ui/Omnibox/Omnibox';
import { Suggestion } from '../magicbox/SuggestionsManager';
import { Result } from '../magicbox/Result/Result';
import { IQuerySuggestRequest, IQuerySuggestCompletion } from '../rest/QuerySuggest';

/**
 * The `IPopulateOmniboxSuggestionsEventArgs` interface describes the object that all
 * [`populateOmniboxSuggestions`]{@link OmniboxEvents.populateOmniboxSuggestions} event handlers receive as an argument.
 */
export interface IPopulateOmniboxSuggestionsEventArgs {
  /**
   * The [`Omnibox`]{@link Omnibox} component instance.
   */
  omnibox: Omnibox;

  /**
   * The list of resolved query completion suggestions, and/or query completion suggestion promises.
   */
  suggestions: Array<Suggestion[] | Promise<Suggestion[]>>;
}

export interface IPopulateOmniboxEventArgs extends IOmniboxData {}

export interface IPopulateOmniboxEventRow extends IOmniboxDataRow {}

export interface IOmniboxPreprocessResultForQueryEventArgs {
  result: Result;
}

export interface IBuildingQuerySuggestArgs {
  payload: IQuerySuggestRequest;
}

export interface IQuerySuggestSuccessArgs {
  completions: IQuerySuggestCompletion[];
}

export interface IQuerySuggestRenderedArgs {
  numberOfSuggestions: number;
}

/**
 * Describes the object that all [`querySuggestGetFocus`]{@link querySuggestGetFocus} and [`querySuggestSelection`]{@link querySuggestSelection} event handlers receive as an argument.
 */
export interface IQuerySuggestSelection {
  /**
   * The query suggestion that had focus or was selected.
   */
  suggestion: string;
}

/**
 * The `OmniboxEvents` static class contains the string definitions of all events that strongly relate to the
 * [`Omnibox`]{@link Omnibox} component.
 */
export class OmniboxEvents {
  public static populateOmnibox = 'populateOmnibox';

  /**
   * Triggered by the [`Omnibox`]{@link Omnibox} component before query completion suggestions are rendered.
   *
   * The out-of-the-box Coveo JavaScript Search Framework query completion suggestion addons (see the
   * [`enableFieldAddon`]{@link Omnibox.options.enableFieldAddon},
   * [`enableQueryExtensionAddon`]{@link Omnibox.options.enableQueryExtensionAddon}, and
   * [`enableQuerySuggestAddon`]{@link Omnibox.options.enableQuerySuggestAddon} options of the `Omnibox`) push their
   * respective suggestions in the argument object which is passed along with this event.
   *
   * All `populateOmniboxSuggestions` event handlers receive a
   * [`PopulateOmniboxSuggestionsEventArgs`]{@link IPopulateOmniboxSuggestionsEventArgs} object as an argument.
   *
   * @type {string} The string value is `populateOmniboxSuggestions`.
   */
  public static populateOmniboxSuggestions = 'populateOmniboxSuggestions';

  public static omniboxPreprocessResultForQuery = 'omniboxPreprocessResultForQuery';

  /**
   * Triggered by the [`Omnibox`]{@link Omnibox} component before sending a query suggestion request to the Search API.
   *
   * Allows external functions to refine the payload b3efore sending the request.
   *
   * This event is only triggered by standard ML-powered query suggestions, and not {@link AnalyticsSuggestions} or {@link FieldSuggestions}.
   */
  public static buildingQuerySuggest = 'buildingQuerySuggest';
  /**
   * Triggered by the [`Omnibox`]{@link Omnibox} component when query suggestions are received from the Search API.
   *
   * Allows external functions to look into the received query suggestions, and modify them if needed.
   *
   * This event is only triggered by standard ML-powered query suggestions, and not {@link AnalyticsSuggestions} or {@link FieldSuggestions}.
   */
  public static querySuggestSuccess = 'querySuggestSuccess';
  /**
   * Triggered by the [`Omnibox`]{@link Omnibox} component when a query suggestion has finished rendering.
   */
  public static querySuggestRendered = 'querySuggestRendered';
  /**
   * Triggered by the [`Omnibox`]{@link Omnibox} component when a query suggestion gets focus following a mouse hovering or keyboard navigation event.
   *
   * All `querySuggestGetFocus` event handlers receive an object implementing the [`IQuerySuggestSelection`]{@link IQuerySuggestSelection} interface as an argument.
   */
  public static querySuggestGetFocus = 'querySuggestGetFocus';
  /**
   * Triggered by the [`Omnibox`]{@link Omnibox} component when a query suggestion loses focus following a mouse hovering or keyboard navigation event.
   */
  public static querySuggestLoseFocus = 'querySuggestLooseFocus';
  /**
   * Triggered by the [`Omnibox`]{@link Omnibox} component when a query suggestion is selected by a mouse click or pressing the enter key.
   *
   * All `querySuggestSelection` event handlers receive an object implementing the [`IQuerySuggestSelection`]{@link IQuerySuggestSelection} interface as an argument.
   */
  public static querySuggestSelection = 'querySuggestSelection';
}
