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
import { StreamHighlightUtils } from '../../utils/StreamHighlightUtils';
import * as _ from 'underscore';
import { ComponentOptionsModel } from '../../models/ComponentOptionsModel';


export interface IPrintableUriOptions extends IResultLinkOptions {
}

/**
 * The `PrintableUri` component inherits from the [ `ResultLink` ]{@link ResultLink} component and supports all of its options.
 *
 * This component displays the URI, or path, to access a result.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
export class PrintableUri extends ResultLink {
  static ID = 'PrintableUri';
  static options: IPrintableUriOptions = {};
  static doExport = () => {
    exportGlobally({
      'PrintableUri': PrintableUri
    });
  }
  private shortenedUri: string;
  private uri: string;

  /**
   * Creates a new PrintableUri.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the PrintableUri component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(public element: HTMLElement, public options: IPrintableUriOptions, bindings?: IResultsComponentBindings, public result?: IQueryResult) {
    super(element, ComponentOptions.initComponentOptions(element, PrintableUri, options), bindings, result);
    this.options = _.extend({}, this.options, this.componentOptionsModel.get(ComponentOptionsModel.attributesEnum.resultLink));
  }

  public renderParentsXml(element: HTMLElement, parentsXml: string) {
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

  public renderUri(element: HTMLElement, result?: IQueryResult) {
    const parentsXml = Utils.getFieldValue(result, 'parents');
    if (parentsXml) {
      this.renderParentsXml(element, parentsXml);
    } else {
      if (!this.options.titleTemplate) {
        this.uri = result.clickUri;
        let stringAndHoles: StringAndHoles;
        if (result.printableUri.indexOf('\\') == -1) {
          stringAndHoles = StringAndHoles.shortenUri(result.printableUri, $$(element).width());
        } else {
          stringAndHoles = StringAndHoles.shortenPath(result.printableUri, $$(element).width());
        }
        this.shortenedUri = HighlightUtils.highlightString(stringAndHoles.value, result.printableUriHighlights, stringAndHoles.holes, 'coveo-highlight');
        const link = $$('a', { className: 'coveo-printable-uri-part', title: result.printableUri });
        link.setHtml(this.shortenedUri);
        element.appendChild(link.el);
      } else if (this.options.titleTemplate) {
        const newTitle = this.parseStringTemplate(this.options.titleTemplate);
        this.element.innerHTML = newTitle ? StreamHighlightUtils.highlightStreamText(newTitle, this.result.termsToHighlight, this.result.phrasesToHighlight) : this.result.clickUri;
      }
    }
    element.title = this.result.printableUri;
  }

  public buildSeparator() {
    const separator = $$('span', { className: 'coveo-printable-uri-separator' }, ' > ');
    return separator.el;
  }


  public buildHtmlToken(name: string, uri: string) {
    let modifiedName = name.charAt(0).toUpperCase() + name.slice(1);
    const link = $$('span', { className: 'coveo-printable-uri-part' }, modifiedName);
    this.uri = uri;
    return link.el;
  }



}
PrintableUri.options = _.extend({}, PrintableUri.options, ResultLink.options);
Initialization.registerAutoCreateComponent(PrintableUri);
