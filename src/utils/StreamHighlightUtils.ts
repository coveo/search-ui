import { Options } from '../misc/Options';
import { HighlightUtils } from './HighlightUtils';
import { StringUtils } from './StringUtils';
import { Utils } from './Utils';
import { IHighlight } from '../rest/Highlight';
import { $$ } from './Dom';
import _ = require('underscore');

// \u2011: http://graphemica.com/%E2%80%91
let nonWordBoundary = '[\\.\\-\\u2011\\s~=,.\\|\\/:\'`’;_()!?]';
let regexStart = '(' + nonWordBoundary + '|^)(';

/**
 * The possible options when highlighting a stream.
 */
export interface IStreamHighlightOptions {
  /**
   * The css class that the highlight will generate.
   * Defaults to `coveo-highlight`.
   */
  cssClass?: string;
  /**
   * The regex flags that should be applied to generate the highlighting.
   * Defaults to `gi`.
   */
  regexFlags?: string;
}

class DefaultStreamHighlightOptions extends Options implements IStreamHighlightOptions {
  constructor(public cssClass = 'coveo-highlight', public shorten = 0, public regexFlags = 'gi') {
    super();
  }
}

export class StreamHighlightUtils {
  static highlightStreamHTML(stream: string, termsToHighlight: { [originalTerm: string]: string[] }, phrasesToHighlight: { [phrase: string]: { [originalTerm: string]: string[] } }, options?: IStreamHighlightOptions) {
    let opts = new DefaultStreamHighlightOptions().merge(options);
    let container = createStreamHTMLContainer(stream);
    let allElements = $$(container).findAll('*');
    if (allElements.length > 0) {
      _.each(allElements, (elem: HTMLElement, i: number) => {
        let text = $$(elem).text();
        elem.innerHTML = HighlightUtils.highlightString(text, getRestHighlightsForAllTerms(text, termsToHighlight, phrasesToHighlight, opts), [], opts.cssClass);
      });
    } else {
      return StreamHighlightUtils.highlightStreamText(stream, termsToHighlight, phrasesToHighlight, options);
    }
    return container.innerHTML;
  }

  static highlightStreamText(stream: string, termsToHighlight: { [originalTerm: string]: string[] }, phrasesToHighlight: { [phrase: string]: { [originalTerm: string]: string[] } }, options?: IStreamHighlightOptions) {
    let opts = new DefaultStreamHighlightOptions().merge(options);
    return HighlightUtils.highlightString(stream, getRestHighlightsForAllTerms(stream, termsToHighlight, phrasesToHighlight, opts), [], opts.cssClass);
  }
}


function getRestHighlightsForAllTerms(toHighlight: string, termsToHighlight: { [originalTerm: string]: string[] }, phrasesToHighlight: { [phrase: string]: { [originalTerm: string]: string[] } }, opts: IStreamHighlightOptions): IHighlight[] {
  let indexes = [];
  let sortedTerms = _.keys(termsToHighlight).sort(termsSorting);
  _.each(sortedTerms, (term: string) => {
    let termsToIterate = _.compact([term].concat(termsToHighlight[term]).sort(termsSorting));
    termsToIterate = _.map(termsToIterate, (term) => Utils.escapeRegexCharacter(term));
    let regex = regexStart;
    regex += termsToIterate.join('|') + ')(?=(?:' + nonWordBoundary + '|$)+)';
    let indexesFound = StringUtils.getHighlights(toHighlight, new RegExp(regex, opts.regexFlags), term);
    if (indexesFound != undefined && Utils.isNonEmptyArray(indexesFound)) {
      indexes.push(indexesFound);
    }
  });

  _.each(phrasesToHighlight, (phrase, origPhrase) => {
    let split = origPhrase.split(' ');
    let regex = regexStart;
    _.each(split, (origWord, i) => {
      regex += '(?:' + [origWord].concat(phrase[origWord]).join('|') + ')';
      if (i == split.length - 1) {
        regex += '(?=';
      }
      regex += nonWordBoundary;
      if (i == split.length - 1) {
        regex += ')';
      }
      if (i != split.length - 1) {
        regex += '+';
      }
    });
    regex += ')';
    let indexesFound = StringUtils.getHighlights(toHighlight, new RegExp(regex, opts.regexFlags), origPhrase);
    if (indexesFound != undefined && Utils.isNonEmptyArray(indexesFound)) {
      indexes.push(indexesFound);
    }
  });

  return _.chain(indexes)
    .flatten()
    .compact()
    .uniq((highlight: IHighlight) => {
      return highlight.offset;
    })
    .sortBy((highlight: IHighlight) => {
      return highlight.offset;
    })
    .map((highlight) => {
      let keysFromTerms = _.keys(termsToHighlight);
      let keysFromPhrases = _.keys(phrasesToHighlight);
      let keys = keysFromTerms.concat(keysFromPhrases);
      let group = _.indexOf(keys, highlight.dataHighlightGroupTerm) + 1;
      return _.extend(highlight, { dataHighlightGroup: group });
    })
    .value();
}

function termsSorting(first: string, second: string) {
  return first.length - second.length;
}

function createStreamHTMLContainer(stream: string) {
  let container = $$('div').el;
  container.innerHTML = stream;
  return container;
}
