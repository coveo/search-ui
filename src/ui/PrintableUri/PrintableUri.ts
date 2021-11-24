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
import { AccessibleButton } from '../../utils/AccessibleButton';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { l } from '../../strings/Strings';

export interface IPrintableUriOptions extends IResultLinkOptions {}

interface IPrintableUriRenderOptions {
  parents: Element[];
  firstIndexToRender: number;
  maxNumOfParts: number;
}

/**
 * The `PrintableUri` component inherits from the [ `ResultLink` ]{@link ResultLink} component and supports all of its options.
 *
 * This component displays the URI, or path, to access a result.
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
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
    this.renderUri(this.result);
    this.addAccessibilityAttributes();
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

  private renderUri(result: IQueryResult) {
    const parentsXml = Utils.getFieldValue(result, 'parents');
    if (parentsXml) {
      this.renderParents({
        parents: this.parseXmlParents(parentsXml),
        firstIndexToRender: 0,
        maxNumOfParts: DeviceUtils.isMobileDevice() ? 3 : 5
      });
    } else if (this.options.titleTemplate) {
      const link = new ResultLink(this.buildElementForResultLink(result.printableUri), this.options, this.bindings, this.result);
      this.links.push(link);
      this.element.appendChild(this.makeLinkAccessible(link.element));
    } else {
      this.renderShortenedUri();
    }
  }

  private buildSeparator(): HTMLElement {
    const separator = $$('span', { className: 'coveo-printable-uri-separator', role: 'separator' }, ' > ');
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

  private parseXmlParents(parentsXml: string): Element[] {
    const elements = Utils.parseXml(parentsXml).getElementsByTagName('parent');
    const parents: Element[] = [];
    for (let i = 0; i < elements.length; i++) {
      parents.push(elements.item(i));
    }
    return parents;
  }

  private renderParents(renderOptions: IPrintableUriRenderOptions) {
    $$(this.element).empty();
    const lastIndex = renderOptions.parents.length - 1;
    const beforeLastIndex = lastIndex - 1;
    const maxMiddleParts = renderOptions.maxNumOfParts - 1;
    const lastMiddlePartIndex = Math.min(beforeLastIndex, renderOptions.firstIndexToRender + maxMiddleParts - 1);
    const partsBetweenMiddlePartsAndLastPart = beforeLastIndex - lastMiddlePartIndex;

    this.optionallyRenderFirstEllipsis(renderOptions);
    this.renderMiddleParts(renderOptions, lastMiddlePartIndex);
    if (partsBetweenMiddlePartsAndLastPart > 0) {
      this.renderLastEllipsis({
        ...renderOptions,
        firstIndexToRender: Math.min(Math.max(lastMiddlePartIndex + 1, 0), renderOptions.parents.length - renderOptions.maxNumOfParts)
      });
    }
    this.renderLastPart(renderOptions);
  }

  private optionallyRenderFirstEllipsis(nextRenderOptions: IPrintableUriRenderOptions) {
    if (nextRenderOptions.firstIndexToRender > 0) {
      this.appendEllipsis({
        ...nextRenderOptions,
        firstIndexToRender: Math.max(0, nextRenderOptions.firstIndexToRender - nextRenderOptions.maxNumOfParts + 1)
      });
      this.appendSeparator();
    }
  }

  private renderMiddleParts(renderOptions: IPrintableUriRenderOptions, lastIndexToRender: number) {
    for (let i = renderOptions.firstIndexToRender; i <= lastIndexToRender; i++) {
      if (i > renderOptions.firstIndexToRender) {
        this.appendSeparator();
      }
      this.appendToken(renderOptions.parents[i]);
    }
  }

  private renderLastEllipsis(nextRenderOptions: IPrintableUriRenderOptions) {
    this.appendSeparator();
    this.appendEllipsis(nextRenderOptions);
  }

  private renderLastPart(renderOptions: IPrintableUriRenderOptions) {
    this.appendSeparator();
    this.appendToken(renderOptions.parents[renderOptions.parents.length - 1]);
  }

  private appendSeparator() {
    this.element.appendChild(this.buildSeparator());
  }

  private appendEllipsis(nextRenderOptions: IPrintableUriRenderOptions) {
    this.element.appendChild(
      this.buildEllipsis(() => {
        this.renderParents(nextRenderOptions);
        (this.element.firstChild.firstChild as HTMLElement).focus();
      })
    );
  }

  private appendToken(part: Element) {
    this.element.appendChild(this.makeLinkAccessible(this.buildHtmlToken(part.getAttribute('name'), part.getAttribute('uri'))));
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
    this.element.appendChild(this.makeLinkAccessible(link.element));
  }

  private makeLinkAccessible(link: HTMLElement) {
    return $$(
      'span',
      {
        className: 'coveo-printable-uri-part',
        role: 'listitem'
      },
      link
    ).el;
  }

  private buildEllipsis(action: (e: Event) => void) {
    const button = $$('button', { type: 'button' }, '...');
    const element = $$(
      'span',
      {
        className: 'coveo-printable-uri-ellipsis',
        role: 'listitem'
      },
      button
    ).el;
    new AccessibleButton().withElement(button).withLabel(l('CollapsedUriParts')).withSelectAction(action).build();
    return element;
  }

  private buildElementForResultLink(title: string): HTMLElement {
    return $$('a', {
      className: 'CoveoResultLink',
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

  private addAccessibilityAttributes() {
    this.element.setAttribute('role', 'list');
  }
}

PrintableUri.options = _.extend({}, PrintableUri.options, ResultLink.options);
Initialization.registerAutoCreateComponent(PrintableUri);
