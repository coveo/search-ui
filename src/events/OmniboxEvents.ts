/// <reference path="../../lib/magic-box/index.d.ts" />

// The reference to magic-box with the triple slash is needed for dts-generator

import { IOmniboxData, IOmniboxDataRow } from '../ui/Omnibox/OmniboxInterface';
import { Omnibox } from '../ui/Omnibox/Omnibox';

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
  suggestions: Array<Coveo.MagicBox.Suggestion[] | Promise<Coveo.MagicBox.Suggestion[]>>;
}

export interface IPopulateOmniboxEventArgs extends IOmniboxData {}

export interface IPopulateOmniboxEventRow extends IOmniboxDataRow {}

export interface IOmniboxPreprocessResultForQueryEventArgs {
  result: Coveo.MagicBox.Result;
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
}
