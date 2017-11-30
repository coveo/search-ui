import { $$, Dom } from './Dom';
import { IQueryResult } from '../rest/QueryResult';
import { DateUtils } from './DateUtils';
import { FileTypes } from '../ui/Misc/FileTypes';
import { Utils } from './Utils';
import { StringUtils } from './StringUtils';
import { SVGIcons } from './SVGIcons';
import { load } from '../ui/Base/RegisteredNamedMethods';
import { Logger } from '../misc/Logger';
import { IComponentBindings } from '../ui/Base/ComponentBindings';
export class DomUtils {
  static getPopUpCloseButton(captionForClose: string, captionForReminder: string): string {
    let container = document.createElement('span');

    let closeButton = document.createElement('span');
    $$(closeButton).addClass('coveo-close-button');
    container.appendChild(closeButton);

    let iconClose = document.createElement('span');
    $$(iconClose).addClass('coveo-icon');
    $$(iconClose).addClass('coveo-sprites-quickview-close');
    closeButton.appendChild(iconClose);

    $$(closeButton).text(captionForClose);

    let closeReminder = document.createElement('span');
    $$(closeReminder).addClass('coveo-pop-up-reminder');
    $$(closeReminder).text(captionForReminder);
    container.appendChild(closeReminder);

    return container.outerHTML;
  }

  static getBasicLoadingAnimation() {
    let loadDotClass = 'coveo-loading-dot';
    let dom = document.createElement('div');
    dom.className = 'coveo-first-loading-animation';
    dom.innerHTML = `<div class='coveo-logo'>${SVGIcons.icons.coveoLogo}</div>
    <div class='coveo-loading-container'>
      <div class='${loadDotClass}'></div>
      <div class='${loadDotClass}'></div>
      <div class='${loadDotClass}'></div>
      <div class='${loadDotClass}'></div>
    </div>`;
    return dom;
  }

  static highlightElement(initialString: string, valueToSearch: string): string {
    let regex = new RegExp(Utils.escapeRegexCharacter(StringUtils.latinize(valueToSearch)), 'i');
    let firstChar = StringUtils.latinize(initialString).search(regex);
    let lastChar = firstChar + valueToSearch.length;
    return `${StringUtils.htmlEncode(initialString.slice(0, firstChar))}<span class='coveo-highlight'>${StringUtils.htmlEncode(
      initialString.slice(firstChar, lastChar)
    )}</span>${StringUtils.htmlEncode(initialString.slice(lastChar))}`;
  }

  static getLoadingSpinner(): HTMLElement {
    let loading = $$('div', {
      className: 'coveo-loading-spinner'
    });
    return loading.el;
  }

  static getModalBoxHeader(title: string): Dom {
    let header = $$('div');
    header.el.innerHTML = `<div class='coveo-modalbox-right-header'>
        <span class='coveo-modalbox-close-button'>
          <span class='coveo-icon coveo-sprites-common-clear'></span>
        </span>
      </div>
      <div class='coveo-modalbox-left-header'>
        <span class='coveo-modalbox-pop-up-reminder'> ${title || ''}</span>
      </div>`;
    return header;
  }

  static getQuickviewHeader(result: IQueryResult, options: { showDate: boolean; title: string }, bindings: IComponentBindings): Dom {
    let date = '';
    if (options.showDate) {
      const dateValueFromResult = Utils.getFieldValue(result, 'date');
      if (dateValueFromResult) {
        date = DateUtils.dateTimeToString(new Date(dateValueFromResult));
      }
    }
    const fileType = FileTypes.get(result);
    const header = $$('div');

    header.el.innerHTML = `<div class='coveo-quickview-right-header'>
        <span class='coveo-quickview-time'>${date}</span>
        <span class='coveo-quickview-close-button'>
          <span class='coveo-icon coveo-sprites-common-clear'></span>
        </span>
      </div>
      <div class='coveo-quickview-left-header'>
        <span class='coveo-quickview-icon coveo-small ${fileType.icon}'></span>
      </div>`;

    const clickableLinkElement = $$('a', { className: 'coveo-quickview-pop-up-reminder' });

    const toLoad = Coveo['Salesforce'] ? 'SalesforceResultLink' : 'ResultLink';

    load(toLoad)
      .then(() => {
        new Coveo[toLoad](clickableLinkElement.el, undefined, bindings, { ...result, title: options.title });
      })
      .catch(err => {
        const logger = new Logger(this);
        logger.error(`Failed to load module ${toLoad} : ${err}`);
        logger.info(`Fallback on displaying a non clickable header`);
        clickableLinkElement.text(options.title);
      })
      .finally(() => {
        $$(header.find('.coveo-quickview-left-header')).append(clickableLinkElement.el);
      });

    return header;
  }

  static getCurrentScript(): HTMLScriptElement {
    return <HTMLScriptElement>document.currentScript;
  }
}
