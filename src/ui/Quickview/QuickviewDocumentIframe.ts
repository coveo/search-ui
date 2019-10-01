import { each } from 'underscore';
import { DeviceUtils, l } from '../../Core';
import { AjaxError } from '../../rest/AjaxError';
import { $$, Dom } from '../../utils/Dom';

export class QuickviewDocumentIframe {
  public el: HTMLElement;
  private iframeElement: HTMLIFrameElement;

  constructor() {
    this.el = this.buildIFrame().el;
  }

  public get iframeHTMLElement() {
    return this.iframeElement;
  }

  public get document() {
    return this.iframeElement.contentWindow.document;
  }

  public get body() {
    return this.document.body;
  }

  public get window() {
    return this.iframeElement.contentWindow;
  }

  public isNewQuickviewDocument(): boolean {
    const meta = $$(this.document.head).find("meta[name='generator']");
    return meta && meta.getAttribute('content') == 'pdf2htmlEX';
  }

  public render(htmlDocument: HTMLDocument): Promise<HTMLIFrameElement> {
    if (this.quickviewIsClosedByEndUser()) {
      return Promise.reject(null);
    }

    return new Promise((resolve, reject) => {
      // Take care to bind the onload function before actually writing to the iframe :
      // Safari, IE, Edge need this, otherwise the onload function is never called
      this.iframeElement.onload = () => {
        resolve(this.iframeElement);
      };

      this.addClientSideTweaksToIFrameStyling(htmlDocument);
      this.writeToIFrame(htmlDocument);
    });
  }

  public renderError(error: AjaxError): Promise<HTMLIFrameElement> {
    if (this.quickviewIsClosedByEndUser()) {
      return Promise.reject(null);
    }

    return new Promise((resolve, reject) => {
      let errorMessage = '';
      switch (error.status) {
        case 400:
          errorMessage = l('NoQuickview');
          break;
        default:
          errorMessage = l('OoopsError');
          break;
      }

      const errorDocument = document.implementation.createHTMLDocument();
      errorDocument.body.style.fontFamily = `Arimo, \'Helvetica Neue\', Helvetica, Arial, sans-serif`;
      $$(errorDocument.body).text(errorMessage);

      this.writeToIFrame(errorDocument);

      resolve(this.iframeElement);
    });
  }

  private quickviewIsClosedByEndUser() {
    return this.iframeElement.contentDocument == null;
  }

  private buildIFrame(): Dom {
    const iframe = $$('iframe', {
      sandbox: 'allow-same-origin allow-top-navigation',
      src: 'about:blank'
    });
    this.iframeElement = iframe.el as HTMLIFrameElement;

    const iframewrapper = $$('div', {
      className: 'coveo-iframeWrapper'
    });
    iframewrapper.append(iframe.el);

    return iframewrapper;
  }

  private writeToIFrame(htmlDocument: HTMLDocument) {
    this.allowDocumentLinkToEscapeSandbox(htmlDocument);
    this.document.open();
    this.document.write(htmlDocument.getElementsByTagName('html')[0].outerHTML);
    this.document.close();
  }

  private allowDocumentLinkToEscapeSandbox(htmlDocument: HTMLDocument) {
    // On the iframe, we set the sandbox attribute to "allow top navigation".
    // For this to work, we need to force all link to target _top.
    // This is especially useful for quickview on web pages.
    each($$(htmlDocument.body).findAll('a'), link => {
      link.setAttribute('target', '_top');
    });
  }

  private addClientSideTweaksToIFrameStyling(htmlDocument: HTMLDocument) {
    const style = $$('style', { type: 'text/css' }).el as HTMLStyleElement;

    // Safari on iOS forces resize iframes to fit their content, even if an explicit size
    // is set on the iframe. Isn't that great? By chance there is a trick around it: by
    // setting a very small size on the body and instead using min-* to set the size to
    // 100% we're able to trick Safari from thinking it must expand the iframe. Amazed.
    // The 'scrolling' part is required otherwise the hack doesn't work.
    //
    // https://stackoverflow.com/questions/23083462/how-to-get-an-iframe-to-be-responsive-in-ios-safari
    const cssHackForIOS = `
      body, html {
        height: 1px !important;
        min-height: 100%;
        width: 1px !important;
        min-width: 100%;
        overflow: scroll;
        margin: auto
      }
      `;

    const cssText = `
      html pre {
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      body, html {
        font-family: Arimo, 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-text-size-adjust: none;
      }
      ${DeviceUtils.isIos() ? cssHackForIOS : ''}
      `;

    if (DeviceUtils.isIos()) {
      $$(this.iframeElement).setAttribute('scrolling', 'no');
      this.iframeElement.parentElement.style.margin = '0 0 5px 5px';
    }

    style.appendChild(document.createTextNode(cssText));
    htmlDocument.head.appendChild(style);
  }
}
