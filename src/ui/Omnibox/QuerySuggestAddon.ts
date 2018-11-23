///<reference path="Omnibox.ts"/>
import { Omnibox, IOmniboxSuggestion } from './Omnibox';
import { $$, Dom } from '../../utils/Dom';
import { IQuerySuggestCompletion, IQuerySuggestRequest, IQuerySuggestResponse } from '../../rest/QuerySuggest';
import { ComponentOptionsModel } from '../../models/ComponentOptionsModel';
import { OmniboxEvents, IPopulateOmniboxSuggestionsEventArgs } from '../../events/OmniboxEvents';
import { StringUtils } from '../../utils/StringUtils';
import { SuggestionsCache } from '../../misc/SuggestionsCache';
import * as _ from 'underscore';

export interface IQuerySuggestAddon {
  getSuggestion(): Promise<IOmniboxSuggestion[]>;
}

export class QuerySuggestAddon implements IQuerySuggestAddon {
  static INDEX = 60;

  private static suggestiontHtml(suggestion: IQuerySuggestCompletion) {
    return suggestion.highlighted.replace(/\[(.*?)\]|\{(.*?)\}|\((.*?)\)/g, (part, notMatched, matched, corrected) => {
      var className = '';
      if (matched) {
        className = 'coveo-omnibox-hightlight';
      }
      if (corrected) {
        className = 'coveo-omnibox-hightlight2';
      }

      let ret: Dom;
      if (className) {
        ret = $$('span', {
          className: className
        });
      } else {
        ret = $$('span');
      }
      ret.text(notMatched || matched || corrected);
      return ret.el.outerHTML;
    });
  }

  private static isPartialMatch(suggestion: IQuerySuggestCompletion) {
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

  private cache: SuggestionsCache<IOmniboxSuggestion[]> = new SuggestionsCache();

  constructor(public omnibox: Omnibox) {
    $$(this.omnibox.element).on(OmniboxEvents.populateOmniboxSuggestions, (e: Event, args: IPopulateOmniboxSuggestionsEventArgs) => {
      args.suggestions.push(this.getSuggestion());
    });
  }

  public getSuggestion(): Promise<IOmniboxSuggestion[]> {
    const text = this.omnibox.magicBox.getText();

    return this.cache.getSuggestions(text, () => this.getQuerySuggest(text));
  }

  private getQuerySuggest(text: string): Promise<IOmniboxSuggestion[]> {
    let payload = <IQuerySuggestRequest>{ q: text };
    let locale = <string>String['locale'];
    let searchHub = this.omnibox.getBindings().componentOptionsModel.get(ComponentOptionsModel.attributesEnum.searchHub);
    let pipeline = this.omnibox.getBindings().searchInterface.options.pipeline;
    let enableWordCompletion = this.omnibox.options.enableSearchAsYouType;
    let context = this.omnibox.getBindings().searchInterface.getQueryContext();

    if (locale) {
      payload.locale = locale;
    }

    if (searchHub) {
      payload.searchHub = searchHub;
    }

    if (pipeline) {
      payload.pipeline = pipeline;
    }

    if (context) {
      payload.context = context;
    }

    payload.enableWordCompletion = enableWordCompletion;

    return this.omnibox.queryController
      .getEndpoint()
      .getQuerySuggest(payload)
      .then((result: IQuerySuggestResponse) => {
        var completions = result.completions;
        var results: IOmniboxSuggestion[] = _.map(completions, (completion, i) => {
          return {
            html: QuerySuggestAddon.suggestiontHtml(completion),
            text: completion.expression,
            index: QuerySuggestAddon.INDEX - i / completions.length,
            partial: QuerySuggestAddon.isPartialMatch(completion),
            executableConfidence: completion.executableConfidence
          };
        });
        return results;
      });
  }
}

export class VoidQuerySuggestAddon implements IQuerySuggestAddon {
  getSuggestion(): Promise<IOmniboxSuggestion[]> {
    return Promise.resolve([]);
  }
}
