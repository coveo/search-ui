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
import { QuickviewDocumentWords } from './QuickviewDocumentWords';
import { each, keys } from 'underscore';
import { QuickviewDocumentWordButton } from './QuickviewDocumentWordButton';
import { QuickviewDocumentPreviewBar } from './QuickviewDocumentPreviewBar';

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
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
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

  public async open() {
    this.ensureDom();

    const beforeLoad = new Date().getTime();
    const termsToHighlight = this.initialTermsToHighlight;

    this.triggerOpenQuickViewEvent({ termsToHighlight });

    const termsWereModified = this.wereTermsToHighlightModified(termsToHighlight);
    
    if (termsWereModified) {
      this.handleTermsToHighlight(termsToHighlight, this.query);
    }

    try {
      const documentHTML = await this.queryController.getEndpoint().getDocumentHtml(this.result.uniqueId, {
        queryObject: this.query,
        requestedOutputSize: this.options.maximumDocumentSize
      } as IViewAsHtmlOptions);

      await this.iframe.render(documentHTML);

      const documentWords = new QuickviewDocumentWords(this.iframe, this.result);
      const previewBar = new QuickviewDocumentPreviewBar(this.iframe, documentWords);

      each(documentWords.words, word => {
        const button = new QuickviewDocumentWordButton(word, previewBar, this.iframe);
        this.header.addWord(button);
      });

      const afterLoad = new Date().getTime();

      this.triggerQuickviewLoaded(afterLoad - beforeLoad);
    } catch (error) {
      await this.iframe.renderError(error);
      const afterLoad = new Date().getTime();

      this.triggerQuickviewLoaded(afterLoad - beforeLoad);
    }
  }

  private get initialTermsToHighlight() {
    return keys(this.result.termsToHighlight);
  }

  private triggerOpenQuickViewEvent(args: IOpenQuickviewEventArgs) {
    $$(this.root).trigger(QuickviewEvents.openQuickview, args)
  }

  private get query() {
    return { ...this.queryController.getLastQuery() };
  }

  private triggerQuickviewLoaded(duration: number) {
    $$(this.element).trigger(QuickviewEvents.quickviewLoaded, {
      duration
    } as IQuickviewLoadedEventArgs);
  }

  private handleTermsToHighlight(termsToHighlight: string[], queryObject: IQuery) {
    for (const term in this.result.termsToHighlight) {
      delete this.result.termsToHighlight[term];
    }
    let query = '';
    each(termsToHighlight, term => {
      query += term + ' ';
      this.result.termsToHighlight[term] = [term];
    });
    query = query.substring(0, query.length - 1);
    queryObject.q = query;
  }

  private wereTermsToHighlightModified(termsToHighlight: string[]) {
    return !Utils.arrayEqual(termsToHighlight, this.initialTermsToHighlight);
  }
}

Initialization.registerAutoCreateComponent(QuickviewDocument);
