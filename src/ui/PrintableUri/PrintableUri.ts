import { ComponentOptions } from '../Base/ComponentOptions';
import { IQueryResult } from '../../rest/QueryResult';
import { HighlightUtils, StringAndHoles } from '../../utils/HighlightUtils';
import { Initialization } from '../Base/Initialization';
import { Utils } from '../../utils/Utils';
import { $$ } from '../../utils/Dom';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_PrintableUri';
import { ResultLink } from '../ResultLink/ResultLink';
import { IResultLinkOptions } from '../ResultLink/ResultLinkOptions';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { getRestHighlightsForAllTerms, DefaultStreamHighlightOptions } from '../../utils/StreamHighlightUtils';
import * as _ from 'underscore';
import { ComponentOptionsModel } from '../../models/ComponentOptionsModel';
import { Component } from '../Base/Component';
import { IHighlight } from '../../rest/Highlight';

export interface IPrintableUriOptions extends IResultLinkOptions {}

/**
 * The `PrintableUri` component inherits from the [ `ResultLink` ]{@link ResultLink} component and supports all of its options.
 *
 * This component displays the URI, or path, to access a result.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
export class PrintableUri extends Component {
  static ID = 'PrintableUri';
  static options: IPrintableUriOptions = {};
  static doExport = () => {
    exportGlobally({
      PrintableUri: PrintableUri
    });
  };

  private links: ResultLink[] = [];

  /**
   * Creates a new PrintableUri.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the PrintableUri component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(
    public element: HTMLElement,
    public options: IPrintableUriOptions,
    public bindings?: IResultsComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, PrintableUri.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, PrintableUri, options);
    this.options = _.extend({}, this.options, this.componentOptionsModel.get(ComponentOptionsModel.attributesEnum.resultLink));
    this.renderUri(this.element, this.result);
  }

  /**
   * Opens the result in the same window, no matter how the actual component is configured for the end user.
   * @param logAnalytics Specifies whether the method should log an analytics event.
   */
  public openLink(logAnalytics = true) {
    _.last(this.links).openLink(logAnalytics);
  }

  /**
   * Opens the result in a new window, no matter how the actual component is configured for the end user.
   * @param logAnalytics Specifies whether the method should log an analytics event.
   */
  public openLinkInNewWindow(logAnalytics = true) {
    _.last(this.links).openLinkInNewWindow(logAnalytics);
  }

  /**
   * Opens the link in the same manner the end user would.
   *
   * This essentially simulates a click on the result link.
   *
   * @param logAnalytics Specifies whether the method should log an analytics event.
   */
  public openLinkAsConfigured(logAnalytics = true) {
    _.last(this.links).openLinkAsConfigured(logAnalytics);
  }

  private renderUri(element: HTMLElement, result: IQueryResult) {
    const parentsXml = Utils.getFieldValue(result, 'parents');
    if (parentsXml) {
      this.renderParentsXml(element, parentsXml);
    } else if (this.options.titleTemplate) {
      const link = new ResultLink(this.buildElementForResultLink(result.printableUri), this.options, this.bindings, this.result);
      this.links.push(link);
      this.element.appendChild(link.element);
    } else {
      this.renderShortenedUri();
    }
  }

  private buildSeparator(): HTMLElement {
    const separator = $$('span', { className: 'coveo-printable-uri-separator' }, ' > ');
    return separator.el;
  }

  private buildHtmlToken(name: string, uri: string): HTMLElement {
    let modifiedName = name.charAt(0).toUpperCase() + name.slice(1);
    const resultPart: IQueryResult = _.extend({}, this.result, {
      clickUri: uri,
      title: modifiedName,
      titleHighlights: this.getModifiedHighlightsForModifiedResultTitle(modifiedName)
    });
    const link = new ResultLink(this.buildElementForResultLink(modifiedName), this.options, this.bindings, resultPart);
    this.links.push(link);
    return link.element;
  }

  private renderParentsXml(element: HTMLElement, parentsXml: string) {
    const xmlDoc: XMLDocument = Utils.parseXml(parentsXml);
    const parents = xmlDoc.getElementsByTagName('parent');
    const tokens: HTMLElement[] = [];
    const separators: HTMLElement[] = [];
    for (let i = 0; i < parents.length; i++) {
      if (i > 0) {
        const separator = this.buildSeparator();
        separators.push(separator);
        element.appendChild(separator);
      }
      const parent = <Element>parents.item(i);
      const token = this.buildHtmlToken(parent.getAttribute('name'), parent.getAttribute('uri'));
      tokens.push(token);

      element.appendChild(token);
    }
  }

  private renderShortenedUri() {
    let stringAndHoles: StringAndHoles;
    if (this.result.printableUri.indexOf('\\') == -1) {
      stringAndHoles = StringAndHoles.shortenUri(this.result.printableUri, $$(this.element).width());
    } else {
      stringAndHoles = StringAndHoles.shortenPath(this.result.printableUri, $$(this.element).width());
    }
    const shortenedUri = HighlightUtils.highlightString(
      stringAndHoles.value,
      this.result.printableUriHighlights,
      stringAndHoles.holes,
      'coveo-highlight'
    );
    const resultPart: IQueryResult = _.extend({}, this.result, {
      title: shortenedUri,
      titleHighlights: this.getModifiedHighlightsForModifiedResultTitle(shortenedUri)
    });
    const link = new ResultLink(this.buildElementForResultLink(this.result.printableUri), this.options, this.bindings, resultPart);
    this.links.push(link);
    this.element.appendChild(link.element);
  }

  private buildElementForResultLink(title: string): HTMLElement {
    return $$('a', {
      className: 'CoveoResultLink coveo-printable-uri-part',
      title
    }).el;
  }

  private getModifiedHighlightsForModifiedResultTitle(newTitle: string): IHighlight[] {
    return getRestHighlightsForAllTerms(
      newTitle,
      this.result.termsToHighlight,
      this.result.phrasesToHighlight,
      new DefaultStreamHighlightOptions()
    );
  }
}

PrintableUri.options = _.extend({}, PrintableUri.options, ResultLink.options);
Initialization.registerAutoCreateComponent(PrintableUri);
