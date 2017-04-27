import {Options} from '../misc/Options';
import {HighlightUtils} from './HighlightUtils';
import {StringUtils} from './StringUtils';
import {Utils} from './Utils';
import {IHighlight} from '../rest/Highlight';

// \u2011: http://graphemica.com/%E2%80%91
let nonWordBoundary = '[\\.\\-\\u2011\\s~=,.\\|\\/:\'`’;_()]';
let regexStart = '(' + nonWordBoundary + '|^)(';
export interface IStreamHighlightOptions {
  cssClass?: string;
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
    container.find('*').each((i: number, elem: HTMLElement) => {
      let text = $(elem).text();
      $(elem).html(HighlightUtils.highlightString(text, getRestHighlightsForAllTerms(text, termsToHighlight, phrasesToHighlight, opts), [], opts.cssClass));
    });
    return container.html();
  }

  static highlightStreamText(stream: string, termsToHighlight: { [originalTerm: string]: string[] }, phrasesToHighlight: { [phrase: string]: { [originalTerm: string]: string[] } }, options?: IStreamHighlightOptions) {
    let opts = new DefaultStreamHighlightOptions().merge(options);
    return HighlightUtils.highlightString(stream, getRestHighlightsForAllTerms(stream, termsToHighlight, phrasesToHighlight, opts), [], opts.cssClass)
  }
}


function getRestHighlightsForAllTerms(toHighlight: string, termsToHighlight: { [originalTerm: string]: string[] }, phrasesToHighlight: { [phrase: string]: { [originalTerm: string]: string[] } }, opts: IStreamHighlightOptions): IHighlight[] {
  let indexes = [];
  let sortedTerms = _.keys(termsToHighlight).sort(termsSorting);
  _.each(sortedTerms, (term: string) => {
    let termsToIterate = _.compact([term].concat(termsToHighlight[term]).sort(termsSorting));
    let regex = regexStart;
    regex += termsToIterate.join('|') + ')(?=(?:' + nonWordBoundary + '|$)+)';
    let indexesFound = StringUtils.getHighlights(toHighlight, new RegExp(regex, opts.regexFlags), term)
    if (indexesFound != undefined && Utils.isNonEmptyArray(indexesFound)) {
      indexes.push(indexesFound)
    }
  });

  _.each(phrasesToHighlight, (phrase, origPhrase) => {
    let split = origPhrase.split(' ');
    let regex = regexStart;
    _.each(split, (origWord, i) => {
      regex += '(?:' + [origWord].concat(phrase[origWord]).join('|') + ')';
      if (i == split.length - 1) {
        regex += '(?='
      }
      regex += nonWordBoundary;
      if (i == split.length - 1) {
        regex += ')'
      }
      if (i != split.length - 1) {
        regex += '+';
      }
    })
    regex += ')';
    let indexesFound = StringUtils.getHighlights(toHighlight, new RegExp(regex, opts.regexFlags), origPhrase)
    if (indexesFound != undefined && Utils.isNonEmptyArray(indexesFound)) {
      indexes.push(indexesFound)
    }
  })

  return _.chain(indexes)
    .flatten()
    .compact()
    .uniq((highlight: IHighlight) => {
      return highlight.offset
    })
    .sortBy((highlight: IHighlight) => {
      return highlight.offset
    })
    .map((highlight) => {
      let keysFromTerms = _.keys(termsToHighlight);
      let keysFromPhrases = _.keys(phrasesToHighlight);
      let keys = keysFromTerms.concat(keysFromPhrases);
      let group = _.indexOf(keys, highlight.dataHighlightGroupTerm) + 1
      return _.extend(highlight, { dataHighlightGroup: group });
    })
    .value()
}

function termsSorting(first: string, second: string) {
  return first.length - second.length
}

function createStreamHTMLContainer(stream: string) {
  let container = $('<div />');
  container.get(0).innerHTML = stream;
  return container;
}
