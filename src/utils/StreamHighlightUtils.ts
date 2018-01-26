import { Options } from '../misc/Options';
import { HighlightUtils } from './HighlightUtils';
import { StringUtils } from './StringUtils';
import { Utils } from './Utils';
import { IHighlight } from '../rest/Highlight';
import { $$ } from './Dom';
import * as _ from 'underscore';

// \u2011: http://graphemica.com/%E2%80%91
// Used to split terms and phrases. Should match characters that can separate words.
const wordBoundary = "[\\.\\-\\u2011\\s~=,.\\|\\/:'`’;_()!?&+]";
const regexStart = '(' + wordBoundary + '|^)(';

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

export class DefaultStreamHighlightOptions extends Options implements IStreamHighlightOptions {
  constructor(public cssClass = 'coveo-highlight', public shorten = 0, public regexFlags = 'gi') {
    super();
  }
}

export class StreamHighlightUtils {
  static highlightStreamHTML(
    stream: string,
    termsToHighlight: { [originalTerm: string]: string[] },
    phrasesToHighlight: { [phrase: string]: { [originalTerm: string]: string[] } },
    options?: IStreamHighlightOptions
  ) {
    const opts = new DefaultStreamHighlightOptions().merge(options);
    const container = createStreamHTMLContainer(stream);
    const allElements = $$(container).findAll('*');
    if (allElements.length > 0) {
      _.each(allElements, (elem: HTMLElement, i: number) => {
        const text = $$(elem).text();
        elem.innerHTML = HighlightUtils.highlightString(
          text,
          getRestHighlightsForAllTerms(text, termsToHighlight, phrasesToHighlight, opts),
          [],
          opts.cssClass
        );
      });
    } else {
      return StreamHighlightUtils.highlightStreamText(stream, termsToHighlight, phrasesToHighlight, options);
    }
    return container.innerHTML;
  }

  static highlightStreamText(
    stream: string,
    termsToHighlight: { [originalTerm: string]: string[] },
    phrasesToHighlight: { [phrase: string]: { [originalTerm: string]: string[] } },
    options?: IStreamHighlightOptions
  ) {
    const opts = new DefaultStreamHighlightOptions().merge(options);
    return HighlightUtils.highlightString(
      stream,
      getRestHighlightsForAllTerms(stream, termsToHighlight, phrasesToHighlight, opts),
      [],
      opts.cssClass
    );
  }
}

export function getRestHighlightsForAllTerms(
  toHighlight: string,
  termsToHighlight: { [originalTerm: string]: string[] },
  phrasesToHighlight: { [phrase: string]: { [originalTerm: string]: string[] } },
  opts: IStreamHighlightOptions
): IHighlight[] {
  const indexes = [];
  const sortedTerms = _.keys(termsToHighlight).sort(termsSorting);
  _.each(sortedTerms, (term: string) => {
    let termsToIterate = _.compact([term].concat(termsToHighlight[term]).sort(termsSorting));
    termsToIterate = _.map(termsToIterate, term => Utils.escapeRegexCharacter(term));
    let regex = regexStart;
    regex += termsToIterate.join('|') + ')(?=(?:' + wordBoundary + '|$)+)';
    const indexesFound = StringUtils.getHighlights(toHighlight, new RegExp(regex, opts.regexFlags), term);
    if (indexesFound != undefined && Utils.isNonEmptyArray(indexesFound)) {
      indexes.push(indexesFound);
    }
  });

  _.each(phrasesToHighlight, (phrase, origPhrase) => {
    const split = origPhrase.split(' ');
    let regex = regexStart;
    _.each(split, (origWord, i) => {
      regex += '(?:' + [origWord].concat(phrase[origWord]).join('|') + ')';
      if (i == split.length - 1) {
        regex += '(?=';
      }
      regex += wordBoundary;
      if (i == split.length - 1) {
        regex += '|$)';
      }
      if (i != split.length - 1) {
        regex += '+';
      }
    });
    regex += ')';
    const indexesFound = StringUtils.getHighlights(toHighlight, new RegExp(regex, opts.regexFlags), origPhrase);
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
    .map(highlight => {
      const keysFromTerms = _.keys(termsToHighlight);
      const keysFromPhrases = _.keys(phrasesToHighlight);
      const keys = keysFromTerms.concat(keysFromPhrases);
      const group = _.indexOf(keys, highlight.dataHighlightGroupTerm) + 1;
      return _.extend(highlight, { dataHighlightGroup: group });
    })
    .value();
}

function termsSorting(first: string, second: string) {
  return first.length - second.length;
}

function createStreamHTMLContainer(stream: string) {
  const container = $$('div').el;
  container.innerHTML = stream;
  return container;
}
