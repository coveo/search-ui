import * as _ from 'underscore';
import { IQuickviewLoadedEventArgs, QuickviewEvents } from '../../events/QuickviewEvents';
import { IOpenQuickviewEventArgs } from '../../events/ResultListEvents';
import { Assert } from '../../misc/Assert';
import { AjaxError } from '../../rest/AjaxError';
import { IQuery } from '../../rest/Query';
import { IQueryResult } from '../../rest/QueryResult';
import { IViewAsHtmlOptions } from '../../rest/SearchEndpointInterface';
import { l } from '../../strings/Strings';
import { ColorUtils } from '../../utils/ColorUtils';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { $$, Doc, Dom } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { QuickviewDocumentIframe } from './QuickviewDocumentIframe';
import { QuickviewDocumentHeader } from './QuickviewDocumentHeader';
import { Quickview } from './Quickview';
import { QuickviewDocumentWordButton } from './QuickviewDocumentWordButton';

const HIGHLIGHT_PREFIX = 'CoveoHighlight';

export interface IQuickviewDocumentOptions {
  maximumDocumentSize?: number;
}

interface IWord {
  text: string;
  count: number;
  index: number;
  termsCount: number;
  element: HTMLElement;
  occurence: number;
}

export interface IWordState {
  word: IWord;
  color: string;
  currentIndex: number;
  index: number;
}

/**
 * The `QuickviewDocument` component normally exists within a [`Quickview`]{@link Quickview} component. The sole purpose
 * of this component is to add an `<iframe>` which loads the correct HTML version of the current item.
 *
 * The default [`contentTemplate`]{@link Quickview.options.contentTemplate} of the
 * `Quickview` component includes the `QuickviewDocument` component.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
export class QuickviewDocument extends Component {
  static ID = 'QuickviewDocument';

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IQuickviewDocumentOptions = {
    /**
     * Specifies the maximum preview size that the index should return.
     *
     * Default value is `0`, and the index returns the entire preview. Minimum value is `0`.
     */
    maximumDocumentSize: ComponentOptions.buildNumberOption({ defaultValue: 0, min: 0 })
  };

  private iframe: QuickviewDocumentIframe;
  private header: QuickviewDocumentHeader;
  private termsToHighlightWereModified: boolean;
  private keywordsState: IWordState[];

  /**
   * Creates a new `QuickviewDocument` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `QuickviewDocument` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The current result.
   */
  constructor(
    public element: HTMLElement,
    public options?: IQuickviewDocumentOptions,
    bindings?: IComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, QuickviewDocument.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, QuickviewDocument, options);
    this.result = result || this.resolveResult();
    this.termsToHighlightWereModified = false;
    Assert.exists(this.result);
  }

  public createDom() {
    const container = $$('div', {
      className: 'coveo-quickview-document'
    });
    this.element.appendChild(container.el);

    this.header = new QuickviewDocumentHeader();
    this.iframe = new QuickviewDocumentIframe();

    container.append(this.header.el);
    container.append(this.iframe.el);
  }

  private get query() {
    return { ...this.queryController.getLastQuery() };
  }

  public async open() {
    this.ensureDom();

    const beforeLoad = new Date().getTime();
    const termsToHighlight = _.keys(this.result.termsToHighlight);

    $$(this.element).trigger(QuickviewEvents.openQuickview, {
      termsToHighlight
    } as IOpenQuickviewEventArgs);

    this.checkIfTermsToHighlightWereModified(termsToHighlight);

    if (this.termsToHighlightWereModified) {
      this.handleTermsToHighlight(termsToHighlight, this.query);
    }

    try {
      const documentHTML = await this.queryController.getEndpoint().getDocumentHtml(this.result.uniqueId, {
        queryObject: this.query,
        requestedOutputSize: this.options.maximumDocumentSize
      } as IViewAsHtmlOptions);

      await this.iframe.render(documentHTML);

      const afterLoad = new Date().getTime();

      this.triggerQuickviewLoaded(afterLoad - beforeLoad);
    } catch (error) {
      await this.iframe.renderError(error);
      const afterLoad = new Date().getTime();

      this.triggerQuickviewLoaded(afterLoad - beforeLoad);
    }
  }

  private triggerQuickviewLoaded(duration: number) {
    $$(this.element).trigger(QuickviewEvents.quickviewLoaded, {
      duration
    } as IQuickviewLoadedEventArgs);
  }

  // An highlighted term looks like:
  //
  //     <span id='CoveoHighlight:X.Y.Z'>a</span>
  //
  // The id has 3 components:
  // - X: the term
  // - Y: the term occurence
  // - Z: the term part
  //
  // For the 'Z' component, if the term 'foo bar' is found in multiple elements, we will see:
  //
  //     <span id='CoveoHighlight:1.1.1'>foo</span>
  //     <span id='CoveoHighlight:1.1.2'>bar</span>
  //
  // Highlighted words can overlap, which looks like:
  //
  //     <span id='CoveoHighlight:1.Y.Z'>
  //         a
  //         <coveotaggedword id='CoveoHighlight:2.Y.Z'>b</coveotaggedword>
  //     </span>
  //     <span id='CoveoHighlight:2.Y.Z'>c</span>
  //
  // In the previous example, the words 'ab' and 'bc' are highlighted.
  //
  // One thing important to note is that the id of all 'coveotaggedword' for
  // the same word AND the first 'span' for that word will have the same id.
  //
  // Example:
  //
  //     <span id='CoveoHighlight:1.1.1'>
  //         a
  //         <coveotaggedword id='CoveoHighlight:2.1.1'>b</coveotaggedword>
  //     </span>
  //     <span id='CoveoHighlight:1.1.2'>
  //         c
  //         <coveotaggedword id='CoveoHighlight:2.1.1'>d</coveotaggedword>
  //     </span>
  //     <span id='CoveoHighlight:2.1.1'>e</span>
  //     <span id='CoveoHighlight:2.1.2'>f</span>
  //
  // In the previous example, the words 'abcd' and 'bcdef' are highlighted.
  public computeHighlights(window: Window): string[] {
    //$$(this.header).empty();
    this.keywordsState = [];

    const words: { [index: string]: IWord } = {};
    let highlightsCount = 0;
    _.each($$(window.document.body).findAll('[id^="' + HIGHLIGHT_PREFIX + '"]'), (element: HTMLElement, index: number) => {
      const idParts = this.getHighlightIdParts(element);

      if (idParts) {
        const idIndexPart = idParts[1]; // X
        const idOccurencePart = parseInt(idParts[2], 10); // Y
        const idTermPart = parseInt(idParts[3], 10); // Z in <span id='CoveoHighlight:X.Y.Z'>a</span>

        let word = words[idIndexPart];

        // The 'idTermPart' check is to circumvent a bug from the index
        // where an highlight of an empty string start with an idTermPart > 1.
        if (word == null && idTermPart == 1) {
          words[idIndexPart] = word = {
            text: this.getHighlightInnerText(element),
            count: 1,
            index: parseInt(idIndexPart, 10),

            // Here I try to be clever.
            // An overlaping word:
            // 1) always start with a 'coveotaggedword' element.
            // 2) then other 'coveotaggedword' elements may follow
            // 3) then a 'span' element may follow.
            //
            // All 1), 2) and 3) will have the same id so I consider them as
            // a whole having the id 0 instead of 1.
            termsCount: element.nodeName.toLowerCase() == 'coveotaggedword' ? 0 : 1,
            element: element,
            occurence: idOccurencePart
          };
        } else if (word) {
          if (word.occurence == idOccurencePart) {
            if (element.nodeName.toLowerCase() == 'coveotaggedword') {
              word.text += this.getHighlightInnerText(element);
              // Doesn't count as a term part (see method description for more info).
            } else if (word.termsCount < idTermPart) {
              word.text += this.getHighlightInnerText(element);
              word.termsCount += 1;
            }
          }

          word.count = Math.max(word.count, idOccurencePart);
          highlightsCount += 1;
        }

        // See the method description to understand why this code const us
        // create the word 'bcdef' instead of 'bdef'.
        if (word && word.occurence == idOccurencePart && element.nodeName.toLowerCase() == 'span') {
          const embeddedWordParts = this.getHightlightEmbeddedWordIdParts(element);
          const embeddedWord = embeddedWordParts ? words[embeddedWordParts[1]] : null;

          if (embeddedWord && embeddedWord.occurence == parseInt(embeddedWordParts[2], 10)) {
            embeddedWord.text += element.childNodes[0].nodeValue || ''; // only immediate text without children.
          }
        }
      }
    });

    if (highlightsCount == 0) {
      this.header.el.style.minHeight = '0';
    }

    const resolvedWords = [];

    _.each(words, word => {
      // When possible, take care to find the original term from the query instead of the
      // first highlighted version we encounter. This relies on a recent feature by the
      // Search API, but will fallback properly on older versions.
      word.text = this.resolveOriginalTermFromHighlight(word.text);

      const state = {
        word: word,
        color: word.element.style.backgroundColor,
        currentIndex: 0,
        index: word.index
      };

      this.keywordsState.push(state);
      this.header.addWord(new QuickviewDocumentWordButton(state, this.iframe));
      //      $$(this.header).append(this.buildWordButton(state, window));
    });

    return resolvedWords;
  }

  private getHighlightIdParts(element: HTMLElement): string[] {
    const parts = element.id.substr(HIGHLIGHT_PREFIX.length + 1).match(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/);

    return parts && parts.length > 3 ? parts : null;
  }

  private getHighlightInnerText(element: HTMLElement): string {
    if (element.nodeName.toLowerCase() == 'coveotaggedword') {
      // only immediate text without children.
      return element.childNodes.length >= 1 ? element.childNodes.item(0).textContent || '' : '';
    } else {
      return element.textContent || '';
    }
  }

  private getHightlightEmbeddedWordIdParts(element: HTMLElement): string[] {
    const embedded = element.getElementsByTagName('coveotaggedword')[0];

    return embedded ? this.getHighlightIdParts(<HTMLElement>embedded) : null;
  }

  private resolveOriginalTermFromHighlight(highlight: string): string {
    let found = highlight;

    // Beware, terms to highlight is only set by recent search APIs.
    if (this.result.termsToHighlight) {
      // We look for the term expansion and we'll return the corresponding
      // original term is one is found.
      found =
        _.find(_.keys(this.result.termsToHighlight), (originalTerm: string) => {
          // The expansions do NOT include the original term (makes sense), so be sure to check
          // the original term for a match too.
          return (
            originalTerm.toLowerCase() == highlight.toLowerCase() ||
            _.find(this.result.termsToHighlight[originalTerm], (expansion: string) => expansion.toLowerCase() == highlight.toLowerCase()) !=
              undefined
          );
        }) || found;
    }
    return found;
  }

  private buildWordButton(wordState: IWordState, window: Window): HTMLElement {}

  private renderPreviewBar(win: Window) {
    const docHeight = new Doc(win.document).height();
    const previewBar = $$('div');

    previewBar.el.style.width = '15px';
    previewBar.el.style.position = 'fixed';
    previewBar.el.style.top = '0';
    previewBar.el.style.right = '0';
    previewBar.el.style.height = '100%';

    win.document.body.appendChild(previewBar.el);
    _.each($$(win.document.body).findAll('[id^="' + HIGHLIGHT_PREFIX + '"]'), (element: HTMLElement, index: number) => {
      const elementPosition = element.getBoundingClientRect().top;

      const previewUnit = $$('div');
      previewUnit.el.style.position = 'absolute';
      previewUnit.el.style.top = `${elementPosition / docHeight * 100}%`;
      previewUnit.el.style.width = '100%';
      previewUnit.el.style.height = '2px';
      previewUnit.el.style.border = `1px solid ${element.style.backgroundColor}`;
      previewUnit.el.style.backgroundColor = element.style.backgroundColor;
      previewBar.append(previewUnit.el);
    });
  }

  private navigate(state: IWordState, backward: boolean, window: Window) {
    const fromIndex = state.currentIndex;
    let toIndex: number;
    if (!backward) {
      toIndex = fromIndex == state.word.count ? 1 : fromIndex + 1;
    } else {
      toIndex = fromIndex <= 1 ? state.word.count : fromIndex - 1;
    }

    const scroll = this.getScrollingElement(window);

    // Un-highlight any currently selected element
    const current = $$(scroll).find('[id^="' + HIGHLIGHT_PREFIX + ':' + state.word.index + '.' + fromIndex + '"]');
    if (current) {
      current.style.border = '';
    }

    // Find and highlight the new element.
    const element = $$(window.document.body).find('[id^="' + HIGHLIGHT_PREFIX + ':' + state.word.index + '.' + toIndex + '"]');
    element.style.border = '1px dotted #333';
    state.currentIndex = toIndex;

    // pdf2html docs hide the non-visible frames by default, to speed up browsers.
    // But this prevents keyword navigation from working so we must force show it. This
    // is done by adding the 'opened' class to it (defined by pdf2html).
    if (this.isNewQuickviewDocument(window)) {
      const pdf = $$(element).closest('.pc');
      $$(pdf).addClass('opened');
    }

    element.scrollIntoView();

    document.body.scrollLeft = 0;
    document.body.scrollTop = 0;
  }

  private getScrollingElement(iframeWindow: Window): HTMLElement {
    let found: HTMLElement;

    if (this.isNewQuickviewDocument(iframeWindow)) {
      // 'New' quick views have a #page-container element generated by the pdf2html thing.
      // This is the element we want to scroll on.
      found = $$(iframeWindow.document.body).find('#page-container');
    }

    // If all else fails, we use the body
    if (!found) {
      found = $$(iframeWindow.document.body).el;
    }

    return found;
  }

  private isNewQuickviewDocument(iframeWindow: Window): boolean {
    const meta = $$(iframeWindow.document.head).find("meta[name='generator']");
    return meta && meta.getAttribute('content') == 'pdf2htmlEX';
  }

  private handleTermsToHighlight(termsToHighlight: Array<string>, queryObject: IQuery) {
    for (const term in this.result.termsToHighlight) {
      delete this.result.termsToHighlight[term];
    }
    let query = '';
    _.each(termsToHighlight, term => {
      query += term + ' ';
      this.result.termsToHighlight[term] = new Array<string>(term);
    });
    query = query.substring(0, query.length - 1);
    queryObject.q = query;
  }

  private checkIfTermsToHighlightWereModified(termsToHighlight: Array<string>) {
    if (!Utils.arrayEqual(termsToHighlight, _.keys(this.result.termsToHighlight))) {
      this.termsToHighlightWereModified = true;
    }
  }

  private getSaturatedColor(color: string): string {
    const r = parseInt(color.substring(4, 7));
    const g = parseInt(color.substring(9, 12));
    const b = parseInt(color.substring(14, 17));
    const hsv = ColorUtils.rgbToHsv(r, g, b);
    hsv[1] *= 2;
    if (hsv[1] > 1) {
      hsv[1] = 1;
    }
    const rgb = ColorUtils.hsvToRgb(hsv[0], hsv[1], hsv[2]);
    return 'rgb(' + rgb[0].toString() + ', ' + rgb[1].toString() + ', ' + rgb[2].toString() + ')';
  }
}

Initialization.registerAutoCreateComponent(QuickviewDocument);
