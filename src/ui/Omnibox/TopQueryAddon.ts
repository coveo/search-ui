///<reference path="Omnibox.ts"/>
import { IOmniboxSuggestion, Omnibox, IPopulateOmniboxSuggestionsEventArgs } from './Omnibox';
import { OmniboxEvents } from '../../events/OmniboxEvents';
import { $$ } from '../../utils/Dom';
import { MagicBox } from '../../ExternalModulesShim';
import _ = require('underscore');

export class TopQueryAddon {

  static INDEX = 61;

  cache: { [hash: string]: Promise<IOmniboxSuggestion[]> } = {};

  constructor(public omnibox: Omnibox) {
    $$(this.omnibox.element).on(OmniboxEvents.populateOmniboxSuggestions, (e, args: IPopulateOmniboxSuggestionsEventArgs) => {
      args.suggestions.push(this.getSuggestion());
    });
  }

  public getSuggestion(): Promise<IOmniboxSuggestion[]> {
    var text = this.omnibox.magicBox.getText();

    if (text.length == 0) {
      return null;
    }

    if (this.cache[text] != null) {
      return this.cache[text];
    }

    var promise = this.omnibox.usageAnalytics.getTopQueries({ queryText: text, pageSize: 5 })
      .then((results) => {
        if (results.length == 1 && results[0].toLowerCase() == text.toLowerCase()) {
          results = [];
        }

        return _.map(results, (result, i) => {
          return {
            html: MagicBox.Utils.highlightText(result, text, true),
            text: result,
            index: TopQueryAddon.INDEX - i / results.length
          };
        });
      });

    promise.catch(() => {
      delete this.cache[text];
    });

    return promise;
  }
}
