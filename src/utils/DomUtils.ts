import {$$} from './Dom';
import {Utils} from './Utils';
import {StringUtils} from './StringUtils';

export class DomUtils {
  static getPopUpCloseButton(captionForClose: string, captionForReminder: string): string {
    var container = document.createElement('span');

    var closeButton = document.createElement('span');
    $$(closeButton).addClass('coveo-close-button');
    container.appendChild(closeButton);

    var iconClose = document.createElement('span');
    $$(iconClose).addClass('coveo-icon');
    $$(iconClose).addClass('coveo-sprites-quickview-close');
    closeButton.appendChild(iconClose);

    $$(closeButton).text(captionForClose);

    var closeReminder = document.createElement('span');
    $$(closeReminder).addClass('coveo-pop-up-reminder');
    $$(closeReminder).text(captionForReminder);
    container.appendChild(closeReminder);

    return container.outerHTML;
  }

  static getBasicLoadingAnimation() {
    var loadDotClass = 'coveo-loading-dot';
    var dom = document.createElement('div');
    dom.className = 'coveo-first-loading-animation';
    dom.innerHTML = `<div class='coveo-logo' ></div>
    <div class='coveo-loading-container'>
      <div class='${loadDotClass}'></div>
      <div class='${loadDotClass}'></div>
      <div class='${loadDotClass}'></div>
      <div class='${loadDotClass}'></div>
    </div>`;
    return dom;
  }

  static highlightElement(initialString: string, valueToSearch: string): string {
    var regex = new RegExp(Utils.escapeRegexCharacter(valueToSearch), "i");
    var firstChar = initialString.search(regex);
    var lastChar = firstChar + valueToSearch.length;
    return `${StringUtils.htmlEncode(initialString.slice(0, firstChar))}<span class='coveo-highlight'>${StringUtils.htmlEncode(initialString.slice(firstChar, lastChar))}</span>${StringUtils.htmlEncode(initialString.slice(lastChar))}`;
  }
}
