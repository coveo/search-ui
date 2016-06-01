import {$$, Dom} from './Dom';
import {IQueryResult} from '../rest/QueryResult'
import {IResultsComponentBindings} from '../ui/Base/ResultsComponentBindings'
import {DateUtils} from './DateUtils'
import {FileTypes} from '../ui/Misc/FileTypes'
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
    var regex = new RegExp(Utils.escapeRegexCharacter(valueToSearch), 'i');
    var firstChar = initialString.search(regex);
    var lastChar = firstChar + valueToSearch.length;
    return `${StringUtils.htmlEncode(initialString.slice(0, firstChar))}<span class='coveo-highlight'>${StringUtils.htmlEncode(initialString.slice(firstChar, lastChar))}</span>${StringUtils.htmlEncode(initialString.slice(lastChar))}`;
  }

  static getLoadingSpinner(): HTMLElement {
    let loading = $$('div');
    loading.addClass('coveo-loading-spinner');
    return loading.el;
  }

  static getQuickviewHeader(result: IQueryResult, options: { showDate: boolean; title: string }, bindings: IResultsComponentBindings): Dom {
    var date = '';
    if (options.showDate) {
      date = DateUtils.dateTimeToString(new Date(result.raw.date));
    }
    var fileType = FileTypes.get(result);
    var header = $$('div');
    header.el.innerHTML = `<div class='coveo-quickview-right-header'>
        <span class='coveo-quickview-time'>${date}</span>
        <span class='coveo-quickview-close-button'>
          <span class='coveo-icon coveo-sprites-common-clear'></span>
        </span>
      </div>
      <div class='coveo-quickview-left-header'>
        <span class='coveo-quickview-icon coveo-small ${fileType.icon}'></span>
        <span class='coveo-quickview-pop-up-reminder'> ${options.title || ''}</span>
      </div>`;
    new Coveo[Coveo['Salesforce'] ? 'SalesforceResultLink' : 'ResultLink'](header.find('.coveo-quickview-pop-up-reminder'), undefined, bindings, result);
    return header;
  }
}
