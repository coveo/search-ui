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
import { Initialization } from '../Core';
import { Assert } from '../misc/Assert';

export interface IQuickViewHeaderOptions {
  showDate: boolean;
  title: string;
}

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

  static highlight(content: string, classToApply = 'coveo-highlight', htmlEncode = true) {
    const trimmedClass = classToApply !== null ? classToApply.trim() : null;
    if (trimmedClass !== null) {
      Assert.check(/^([^\s\-][a-z\s\-]*[^\s\-])?$/i.test(trimmedClass), 'Invalid class');
    }
    return `<span${trimmedClass !== null && trimmedClass.length > 0 ? ` class='${trimmedClass}'` : ''}>${
      htmlEncode ? StringUtils.htmlEncode(content) : content
    }</span>`;
  }

  static highlightElement(initialString: string, valueToSearch: string, classToApply: string = 'coveo-highlight'): string {
    let regex = new RegExp(Utils.escapeRegexCharacter(StringUtils.latinize(valueToSearch)), 'i');
    let firstChar = StringUtils.latinize(initialString).search(regex);
    if (firstChar >= 0) {
      let lastChar = firstChar + valueToSearch.length;
      return (
        StringUtils.htmlEncode(initialString.slice(0, firstChar)) +
        this.highlight(initialString.slice(firstChar, lastChar), classToApply, true) +
        StringUtils.htmlEncode(initialString.slice(lastChar))
      );
    } else {
      return initialString;
    }
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

  static getQuickviewHeader(result: IQueryResult, options: IQuickViewHeaderOptions, bindings: IComponentBindings): Dom {
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
    const resultForResultLink = { ...result };
    if (options.title) {
      resultForResultLink.title = options.title;
    }

    DomUtils.loadResultLink(toLoad, clickableLinkElement, header, resultForResultLink, options);

    return header;
  }

  private static async loadResultLink(
    toLoad: string,
    clickableLinkElement: Dom,
    header: Dom,
    resultForResultLink: IQueryResult,
    options: IQuickViewHeaderOptions
  ) {
    try {
      await load(toLoad);
      clickableLinkElement.addClass(`Coveo${toLoad}`);
      Initialization.automaticallyCreateComponentsInsideResult(clickableLinkElement.el, resultForResultLink);
    } catch (err) {
      const logger = new Logger(this);
      logger.error(`Failed to load module ${toLoad} : ${err}`);
      logger.info(`Fallback on displaying a non clickable header`);
      clickableLinkElement.text(options.title);
    }

    $$(header.find('.coveo-quickview-left-header')).append(clickableLinkElement.el);
  }
}
