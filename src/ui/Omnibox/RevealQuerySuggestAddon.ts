///<reference path="Omnibox.ts"/>
import {Omnibox, IPopulateOmniboxSuggestionsEventArgs, IOmniboxSuggestion} from './Omnibox';
import {$$} from '../../utils/Dom';
import {IRevealQuerySuggestCompletion, IRevealQuerySuggestRequest, IRevealQuerySuggestResponse} from '../../rest/RevealQuerySuggest';
import {ComponentOptionsModel} from '../../models/ComponentOptionsModel';
import {OmniboxEvents} from '../../events/OmniboxEvents';
import {StringUtils} from '../../utils/StringUtils';
import _ = require('underscore');

export class RevealQuerySuggestAddon {

  static INDEX = 60;

  static suggestiontHtmlTemplate = _.template('<span<%= className? \' class="\'+className+\'"\':\'\' %>><%- text %></span>');

  private static suggestiontHtml(suggestion: IRevealQuerySuggestCompletion) {
    return suggestion.highlighted.replace(/\[(.*?)\]|\{(.*?)\}|\((.*?)\)/g, (part, notMatched, matched, corrected) => {
      var className = '';
      if (matched) {
        className = 'coveo-omnibox-hightlight'
      }
      if (corrected) {
        className = 'coveo-omnibox-hightlight2'
      }
      return RevealQuerySuggestAddon.suggestiontHtmlTemplate({
        className: className,
        text: notMatched || matched || corrected
      });
    });
  }

  private static isPartialMatch(suggestion: IRevealQuerySuggestCompletion) {
    // groups : 1=notMatched, 2=matched, 3=corrected
    var parts = StringUtils.match(suggestion.highlighted, /\[(.*?)\]|\{(.*?)\}|\((.*?)\)/g);
    var firstFail = _.find(parts, (part: string[]) => part[1] != null);
    // if no fail found, this is a partial or a full match
    if (firstFail == null) {
      return true;
    }
    // if all right parts are notMatched, the right parts is autocomplete
    return _.every(_.last(parts, _.indexOf(parts, firstFail) - parts.length), (part: string[]) => part[1] != null);
  }

  private cache: { [hash: string]: Promise<IOmniboxSuggestion[]> } = {};

  constructor(public omnibox: Omnibox) {
    $$(this.omnibox.element).on(OmniboxEvents.populateOmniboxSuggestions, (e: Event, args: IPopulateOmniboxSuggestionsEventArgs) => {
      args.suggestions.push(this.getSuggestion());
    });
  }

  private currentPromise: Promise<IOmniboxSuggestion[]>;

  private waitingRequest: {
    text: string;
  }

  public getSuggestion(): Promise<IOmniboxSuggestion[]> {

    var text = this.omnibox.magicBox.getText();

    if (text.length == 0) {
      return null;
    }

    if (this.cache[text] != null) {
      return this.cache[text];
    }

    if (this.currentPromise == null) {
      var promise = this.getRevealQuerySuggest(text);
      this.cache[text] = promise;
      promise.catch(() => {
        delete this.cache[text];
      })
    } else {
      if (this.waitingRequest != null) {
        this.waitingRequest = null;
      }
      this.waitingRequest = {
        text: text
      };
    }
    return this.cache[text];
  }

  private getRevealQuerySuggest(text: string): Promise<IOmniboxSuggestion[]> {
    var payload = <IRevealQuerySuggestRequest>{ q: text },
      language = <string>String['locale'],
      searchHub = this.omnibox.getBindings().componentOptionsModel.get(ComponentOptionsModel.attributesEnum.searchHub);

    if (language) {
      payload.language = language;
    }

    if (searchHub) {
      payload.searchHub = searchHub;
    }

    this.currentPromise = this.omnibox.queryController.getEndpoint()
      .getRevealQuerySuggest(payload)
      .then((result: IRevealQuerySuggestResponse) => {
        var completions = result.completions;
        var results: IOmniboxSuggestion[] = _.map(completions, (completion, i) => {
          return {
            html: RevealQuerySuggestAddon.suggestiontHtml(completion),
            text: completion.expression,
            index: RevealQuerySuggestAddon.INDEX - i / completions.length,
            partial: RevealQuerySuggestAddon.isPartialMatch(completion)
          }
        });
        return results;
      })

    this.currentPromise.finally(() => {
      this.currentPromise = null;
      if (this.waitingRequest != null) {
        this.getRevealQuerySuggest(this.waitingRequest.text);
        this.waitingRequest = null;
      }
    })

    return this.currentPromise;
  }
}
