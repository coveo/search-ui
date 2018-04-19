import * as _ from 'underscore';
import { IQuickviewLoadedEventArgs, QuickviewEvents } from '../../events/QuickviewEvents';
import { IOpenQuickviewEventArgs } from '../../events/ResultListEvents';
import { Assert } from '../../misc/Assert';
import { IQuery } from '../../rest/Query';
import { IQueryResult } from '../../rest/QueryResult';
import { IViewAsHtmlOptions } from '../../rest/SearchEndpointInterface';
import { $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { QuickviewDocumentIframe } from './QuickviewDocumentIframe';
import { QuickviewDocumentHeader } from './QuickviewDocumentHeader';
//import { QuickviewDocumentWordButton } from './QuickviewDocumentWordButton';
import {} from './QuickviewdocumentKeywords';
import { QuickviewDocumentWords } from './QuickviewDocumentWords';
import { each } from 'underscore';
import { QuickviewDocumentWordButton } from './QuickviewDocumentWordButton';

export const HIGHLIGHT_PREFIX = 'CoveoHighlight';

export interface IQuickviewDocumentOptions {
  maximumDocumentSize?: number;
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
  //  private keywordsState: IWordState[];

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
      this.computeHighlights();
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
  public computeHighlights() {
    const documentWords = new QuickviewDocumentWords(this.iframe);
    each(documentWords.words, word => {
      const button = new QuickviewDocumentWordButton(word, this.iframe);
      this.header.addWord(button);
    });
  }

  /*  private getHighlightIdParts(element: HTMLElement): string[] {
      const parts = element.id.substr(HIGHLIGHT_PREFIX.length + 1).match(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/);
  
      return parts && parts.length > 3 ? parts : null;
    }*/

  /*private getHighlightInnerText(element: HTMLElement): string {
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
  }*/

  /*private renderPreviewBar(win: Window) {
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
  }*/

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
}

Initialization.registerAutoCreateComponent(QuickviewDocument);
