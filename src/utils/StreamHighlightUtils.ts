/// <reference path="../Base.ts" />
module Coveo {
  // \u2011: http://graphemica.com/%E2%80%91
  var nonWordBoundary = '[\\.\\-\\u2011\\s~=,.\\|\\/:\'`’;_()]';
  var regexStart = '(' + nonWordBoundary + '|^)(';
  export interface StreamHighlightOptions {
    cssClass?: string;
    regexFlags?: string;
  }

  class DefaultStreamHighlightOptions extends Options implements StreamHighlightOptions {
    constructor(public cssClass = "coveo-highlight", public shorten = 0, public regexFlags = "gi") {
      super();
    }
  }

  export function highlightStreamHTML(stream: string, termsToHighlight: {[originalTerm:string]: string[]}, phrasesToHighlight: {[phrase: string]: {[originalTerm:string]: string[]}}, options?: StreamHighlightOptions) {
    var opts = new DefaultStreamHighlightOptions().merge(options);
    var container = createStreamHTMLContainer(stream);
    container.find("*").each((i: number, elem: HTMLElement) => {
      var text = $(elem).text();
      $(elem).html(HighlightUtils.highlightString(text, getRestHighlightsForAllTerms(text, termsToHighlight, phrasesToHighlight, opts), [], opts.cssClass));
    });
    return container.html();
  }

  export function highlightStreamText(stream: string, termsToHighlight: {[originalTerm:string]: string[]}, phrasesToHighlight: {[phrase: string]: {[originalTerm:string]: string[]}}, options?: StreamHighlightOptions) {
    var opts = new DefaultStreamHighlightOptions().merge(options);
    return HighlightUtils.highlightString(stream, getRestHighlightsForAllTerms(stream, termsToHighlight, phrasesToHighlight, opts), [], opts.cssClass)
  }

  function getRestHighlightsForAllTerms(toHighlight: string, termsToHighlight: {[originalTerm:string]: string[]}, phrasesToHighlight: {[phrase: string]: {[originalTerm:string]: string[]}}, opts: StreamHighlightOptions): Highlight[] {
    var indexes = [];
    var sortedTerms = _.keys(termsToHighlight).sort(termsSorting);
    _.each(sortedTerms, (term: string) => {
      var termsToIterate = _.compact([term].concat(termsToHighlight[term]).sort(termsSorting));
      var regex = regexStart;
      regex += termsToIterate.join('|') + ')(?=(?:' + nonWordBoundary + '|$)+)';
      var indexesFound = StringUtils.getHighlights(toHighlight, new RegExp(regex, opts.regexFlags), term)
      if (indexesFound != undefined && Utils.isNonEmptyArray(indexesFound)) {
        indexes.push(indexesFound)
      }
    });

    _.each(phrasesToHighlight, (phrase, origPhrase)=> {
      var split = origPhrase.split(' ');
      var regex = regexStart;
      _.each(split, (origWord, i)=> {
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
      var indexesFound = StringUtils.getHighlights(toHighlight, new RegExp(regex, opts.regexFlags), origPhrase)
      if (indexesFound != undefined && Utils.isNonEmptyArray(indexesFound)) {
        indexes.push(indexesFound)
      }
    })

    return _.chain(indexes)
        .flatten()
        .compact()
        .uniq((highlight: Highlight)=> {
          return highlight.offset
        })
        .sortBy((highlight: Highlight)=> {
          return highlight.offset
        })
        .map((highlight)=> {
          var keysFromTerms = _.keys(termsToHighlight);
          var keysFromPhrases = _.keys(phrasesToHighlight);
          var keys = keysFromTerms.concat(keysFromPhrases);
          var group = _.indexOf(keys, highlight.dataHighlightGroupTerm) + 1
          return _.extend(highlight, {dataHighlightGroup: group});
        })
        .value()
  }

  function termsSorting(first: string, second: string) {
    return first.length - second.length
  }

  function createStreamHTMLContainer(stream: string) {
    var container = $("<div />");
    container.get(0).innerHTML = stream;
    return container;
  }
}