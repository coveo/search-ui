/// <reference path="../Base.ts" />
/**
* @nodoc
*/
module Coveo.PhonegapUtils {
  export function bindOpenLinkInPhonegap(element: HTMLElement, uri: string) {
    $(element).click((ev: JQueryEventObject) => {
      ev.preventDefault();
      if (uri && uri.indexOf('javascript:') < 0) {
        PhonegapUtils.openInPhonegap(uri);
      }
    });
  }
  export function openInPhonegap(uri: string) {
    window.open(uri, '_system', 'location=yes');
  }
}