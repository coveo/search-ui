import {Component} from '../Base/Component'
import {IComponentBindings} from '../Base/ComponentBindings'
import {ComponentOptions} from '../Base/ComponentOptions'
import {IQueryResult} from '../../rest/QueryResult'
import {HighlightUtils, StringAndHoles} from '../../utils/HighlightUtils'
import {Initialization} from '../Base/Initialization'
import {DeviceUtils} from '../../utils/DeviceUtils'
import {AnalyticsActionCauseList} from '../Analytics/AnalyticsActionListMeta'
import {Utils} from '../../utils/Utils'
import {$$} from '../../utils/Dom'

export interface PrintableUriOptions {
}

/*
 * This component is meant to be used inside a result template to display the URI or path to access a result.
 */
export class PrintableUri extends Component {
  static ID = 'PrintableUri';
  static options: PrintableUriOptions = {};

  static fields = [
    'parents'
  ]

  private uri: string;

  constructor(public element: HTMLElement, public options: PrintableUriOptions, bindings?: IComponentBindings, public result?: IQueryResult) {
    super(element, PrintableUri.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, PrintableUri, options);

    var parentsXml = result.raw.parents;
    if (parentsXml) {
      this.renderParentsXml(element, parentsXml);
    } else {
      this.renderUri(element, result);
    }
  }

  public renderParentsXml(element: HTMLElement, parentsXml: string) {
    var xmlDoc: XMLDocument = Utils.parseXml(parentsXml);
    var parents = xmlDoc.getElementsByTagName("parent");

    var tokens: HTMLElement[] = [];
    var seperators: HTMLElement[] = [];

    for (var i = 0; i < parents.length; i++) {
      if (i > 0) {
        var seperator = this.buildSeperator();
        seperators.push(seperator);
        element.appendChild(seperator);
      }

      var parent = <Element>parents.item(i);
      var token = this.buildHtmlToken(parent.getAttribute('name'), parent.getAttribute('uri'));
      tokens.push(token);
      element.appendChild(token);
    }

    if (tokens.length > 1) {
      var ellipsis: HTMLElement = this.buildEllipsis();
      element.insertBefore(ellipsis, seperators[0]);
      var ellipsisSeperator: HTMLElement = this.buildSeperator();
      element.insertBefore(ellipsisSeperator, ellipsis);

      var contentWidth = 0;
      var tokensWidth: number[] = [];
      for (var i = 0; i < tokens.length; i++) {
        tokensWidth[i] = tokens[i].offsetWidth;
        contentWidth += tokensWidth[i];
      }
      var seperatorWidth = seperators[0].offsetWidth;
      var ellipsisWidth = ellipsis.offsetWidth;
      var availableWidth = element.offsetWidth;

      if (availableWidth <= contentWidth) {
        contentWidth += ellipsisWidth + seperatorWidth;
        var hidden: HTMLElement[] = [];
        var i = 1;
        while (i < tokens.length && availableWidth <= contentWidth) {
          element.removeChild(tokens[i]);
          element.removeChild(seperators[i - 1]);
          if (i > 1) {
            hidden.push(seperators[i - 1]);
          }
          hidden.push(tokens[i]);
          contentWidth -= tokensWidth[i] + seperatorWidth;
          i++;
        }
        ellipsis.onclick = () => {
          for (var i = 0; i < hidden.length; i++) {
            element.insertBefore(hidden[i], ellipsis);
          }
          element.removeChild(ellipsis);
        };
      } else {
        element.removeChild(ellipsis);
        element.removeChild(ellipsisSeperator);
      }
    }
  }

  public renderUri(element: HTMLElement, result?: IQueryResult) {
    this.uri = result.clickUri;
    var stringAndHoles: StringAndHoles;
    if (result.printableUri.indexOf("\\") == -1) {
      stringAndHoles = StringAndHoles.shortenUri(result.printableUri, $$(element).width() / 7);
    } else {
      stringAndHoles = StringAndHoles.shortenPath(result.printableUri, $$(element).width() / 7);
    }
    var uri = HighlightUtils.highlightString(stringAndHoles.value, result.printableUriHighlights, stringAndHoles.holes, 'coveo-highlight');
    let link = $$('a');
    link.setAttribute('title', result.printableUri);
    link.addClass('coveo-printable-uri');
    link.setHtml(uri);
    link.setAttribute('href', result.clickUri);
    this.bindLogOpenDocument(link.el);
    element.appendChild(link.el);
  }

  public buildSeperator() {
    var seperator = document.createElement('span');
    seperator.innerText = ">";
    seperator.className = 'coveo-printable-uri-separator';
    return seperator;
  }

  public buildEllipsis() {
    var ellipsis = document.createElement('span');
    ellipsis.innerText = "...";
    ellipsis.className = 'coveo-printable-uri';
    return ellipsis;
  }

  public buildHtmlToken(name: string, uri: string) {
    var modifiedName = name.charAt(0).toUpperCase() + name.slice(1);
    var link = document.createElement('a');
    this.bindLogOpenDocument(link);
    link.href = uri;
    this.uri = uri;
    link.className = 'coveo-printable-uri';
    link.appendChild(document.createTextNode(modifiedName));
    return link;
  }

  private bindLogOpenDocument(link: HTMLElement) {
    $$(link).on(['mousedown', 'touchend'], (e: Event) => {
      var url = $$(<HTMLElement>e.srcElement).getAttribute('href');
      var title = $$(<HTMLElement>e.srcElement).text();
      this.usageAnalytics.logClickEvent(AnalyticsActionCauseList.documentOpen, {
        documentURL: url,
        documentTitle: title,
        author: this.result.raw.author
      }, this.result, this.root);
    })
  }

}

Initialization.registerAutoCreateComponent(PrintableUri);
