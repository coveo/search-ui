import {Win, $$, Dom} from '../../utils/Dom';
import {InitializationEvents} from '../../events/InitializationEvents';
import {PopupUtils, HorizontalAlignment, VerticalAlignment} from '../../utils/PopupUtils';
import {Logger} from '../../misc/Logger';
import {IResponsiveComponent, ResponsiveComponentsManager} from './ResponsiveComponentsManager';
import _ = require('underscore');
import {l} from '../../strings/Strings.ts';
import '../../../sass/_ResponsiveTabs.scss';

export class ResponsiveTabs implements IResponsiveComponent {

  private static TABS_NOT_FOUND = 'Could not find element with class coveo-tab-section. Therefore, responsive tabs cannot be enabled.';
  private static logger: Logger;

  public ID: string;

  private dropdownHeader: Dom;
  private dropdownContent: Dom;
  private tabSection: Dom;
  private previousSibling: Dom;
  private parent: Dom;
  private searchBoxElement: HTMLElement;
  private coveoRoot: Dom;
  private resizeListener: EventListener;
  private documentClickListener: EventListener;

  constructor(root: Dom, ID: string) {
    this.ID = ID;
    this.coveoRoot = root;
    this.searchBoxElement = this.getSearchBoxElement();
    this.dropdownContent = this.buildDropdownContent();
    this.dropdownHeader = this.buildDropdownHeader();
    this.bindDropdownContentEvents();
    this.bindDropdownHeaderEvents();
    this.tabSection = $$(<HTMLElement>this.coveoRoot.find('.coveo-tab-section'));
    this.manageTabSwapping();
    this.saveTabsPosition();
  }

  public static init(root: HTMLElement, ID: string, component) {
    this.logger = new Logger(root);
    if (!$$(root).find('.coveo-tab-section')) {
      this.logger.info(this.TABS_NOT_FOUND);
      return;
    }
    ResponsiveComponentsManager.register(ResponsiveTabs, $$(root), ID, component);
  }

  public handleResizeEvent() {
    if (this.shouldAddTabsToDropdown()) {
      let currentTab;
      let overflowingElements = [];
      let tabs = this.tabSection.findAll('.CoveoTab');

      if (!this.tabSection.find('.coveo-tab-dropdown-header')) {
        let facetDropdownHeader = this.tabSection.find('.coveo-facet-dropdown-header-container');
        if (facetDropdownHeader) {
          this.dropdownHeader.insertBefore(facetDropdownHeader);
        } else {
          this.tabSection.el.appendChild(this.dropdownHeader.el);
        }
      }
      for (let i = tabs.length - 1; i >= 0; i--) {
        currentTab = tabs[i];

        if ($$(currentTab).hasClass('coveo-selected') && i > 0) {
          currentTab = tabs[--i];
        }

        this.addToDropdown(currentTab);

        if (!this.isOverflowing(this.tabSection.el)) {
          break;
        }
      }

    } else if (this.shouldRemoveTabsFromDropdown()) {
      let dropdownTabs = this.dropdownContent.findAll('.coveo-tab-dropdown');

      while (!this.isOverflowing(this.tabSection.el) && !this.isDropdownEmpty()) {
        let current = dropdownTabs.shift();
        this.removeFromDropdown(current);
        $$(current).insertBefore(this.dropdownHeader.el);
      }

      if (this.isOverflowing(this.tabSection.el)) {
        let tabs = this.tabSection.findAll('.CoveoTab');
        this.addToDropdown(tabs.pop());
      }

      if (this.isDropdownEmpty()) {
        this.detachDropdown();
      }
    }

    if (this.dropdownHeader.hasClass('coveo-dropdown-header-active')) {
      this.positionPopup();
    }

  };

  public needSmallMode(): boolean {
    let tabSectionIsOverflowing = this.isOverflowing(this.tabSection.el);
    let win = new Win(window);

    if (win.width() <= ResponsiveComponentsManager.MEDIUM_MOBILE_WIDTH) {
      return true;
    } else if (!this.coveoRoot.is('.coveo-small-search-interface')) {
      return this.isOverflowing(this.tabSection.el);
    } else {
      return this.isLargeFormatOverflowing();
    }
  }

  public changeToLargeMode() {
    this.restoreTabsPosition();
    this.emptyDropdown();
    this.detachDropdown();
  }

  public changeToSmallMode() {
    this.tabSection.insertAfter(this.searchBoxElement);
  }

  private shouldAddTabsToDropdown(): boolean {
    return this.isOverflowing(this.tabSection.el) && this.coveoRoot.is('.coveo-small-search-interface');
  }

  private shouldRemoveTabsFromDropdown(): boolean {
    return !this.isOverflowing(this.tabSection.el) && this.coveoRoot.is('.coveo-small-search-interface') && !this.isDropdownEmpty();
  }

  private emptyDropdown() {
    if (!this.isDropdownEmpty()) {
      let dropdownTabs = this.dropdownContent.findAll('.coveo-tab-dropdown');

      while (!this.isDropdownEmpty()) {
        let current = dropdownTabs.shift();
        this.removeFromDropdown(current);
        $$(current).insertBefore(this.dropdownHeader.el);
      }
    }
  }

  private isLargeFormatOverflowing(): boolean {
    let virtualTabSection = $$(<HTMLElement>this.tabSection.el.cloneNode(true));

    let dropdownHeader = virtualTabSection.el.querySelector('.coveo-tab-dropdown-header');
    if (dropdownHeader) {
      virtualTabSection.el.removeChild(dropdownHeader);
    }

    virtualTabSection.el.style.position = 'absolute';
    virtualTabSection.el.style.visibility = 'hidden';

    if (!this.isDropdownEmpty()) {
      _.each(this.dropdownContent.findAll('.CoveoTab'), tab => {
        virtualTabSection.el.appendChild(tab.cloneNode(true));
      });
    }

    virtualTabSection.insertBefore(this.coveoRoot.el);
    let isOverflowing = this.isOverflowing(virtualTabSection.el);
    virtualTabSection.detach();
    return isOverflowing;
  }

  private isOverflowing(el: HTMLElement) {
    return el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
  }

  private couldNotFindSearchBoxError() {
    ResponsiveTabs.logger.info('While trying to move the tab section around the search box, could not find an element with class \
                      coveo-search-section or CoveoSearchBox');
  }

  private buildDropdownHeader(): Dom {
    let dropdownHeader = $$('a', { className: 'coveo-dropdown-header coveo-tab-dropdown-header' });
    let content = $$('p');
    content.text(l('More'));
    content.el.appendChild($$('span', { className: 'coveo-sprites-more-tabs' }).el);
    dropdownHeader.el.appendChild(content.el);
    return dropdownHeader;
  }

  private bindDropdownHeaderEvents() {
    this.dropdownHeader.on('click', () => {
      if (!this.dropdownHeader.hasClass('coveo-dropdown-header-active')) {
        this.positionPopup();
        this.dropdownHeader.addClass('coveo-dropdown-header-active');
      } else {
        this.dropdownContent.detach();
        this.dropdownHeader.removeClass('coveo-dropdown-header-active');
      }
    });
  }

  private buildDropdownContent() {
    let dropdownContent = $$('div', { className: 'coveo-tab-list-container coveo-small-search-interface' });
    let contentList = $$('ol', { className: 'coveo-tab-list' });
    dropdownContent.el.appendChild(contentList.el);
    return dropdownContent;
  }

  private bindDropdownContentEvents() {
    this.documentClickListener = event => {
      let eventTarget = $$(<HTMLElement>event.target);
      if (!eventTarget.closest('coveo-tab-list-container') && !eventTarget.closest('coveo-tab-dropdown-header')) {
        this.dropdownContent.detach();
        this.dropdownHeader.removeClass('coveo-dropdown-header-active');
      }
    };
    $$(document.documentElement).on('click', this.documentClickListener);
  }

  private addToDropdown(el: HTMLElement) {
    if (this.dropdownContent) {
      $$(el).addClass('coveo-tab-dropdown');
      let list = this.dropdownContent.find('ol');
      let listElement = $$('li');
      listElement.el.appendChild(el);
      $$(<HTMLElement>list).prepend(listElement.el);
    }
  }

  private removeFromDropdown(el: HTMLElement) {
    if (this.dropdownContent) {
      $$(el).removeClass('coveo-tab-dropdown');
      $$(el.parentElement).detach();
    }
  }

  private detachDropdown() {
    this.dropdownHeader.removeClass('coveo-dropdown-header-active');
    this.dropdownHeader.detach();
    this.dropdownContent.detach();
  }

  private addSmallClass() {
    this.coveoRoot.addClass('coveo-small-search-interface');
  }

  private removeSmallClass() {
    this.coveoRoot.removeClass('coveo-small-search-interface');
  }

  private isDropdownEmpty(): boolean {
    if (this.dropdownContent) {
      let tabs = this.dropdownContent.findAll('.CoveoTab');
      return tabs.length == 0;
    }
    return false;
  }

  private manageTabSwapping() {
    _.each(this.tabSection.findAll('.CoveoTab'), tabElement => {
      let tab = $$(tabElement);
      tab.on('click', () => {
        if (tab.hasClass('coveo-tab-dropdown')) {
          let tabsInSection = this.tabSection.findAll('.CoveoTab');
          let lastTabInSection = tabsInSection.pop();

          $$(lastTabInSection).addClass('coveo-tab-dropdown');
          tab.replaceWith(lastTabInSection);

          tab.removeClass('coveo-tab-dropdown');
          tab.insertBefore(this.dropdownHeader.el);
        }
      })
    });
  }

  private getSearchBoxElement(): HTMLElement {
    let searchBoxElement = this.coveoRoot.find('.coveo-search-section');
    if (searchBoxElement) {
      return <HTMLElement>searchBoxElement;
    } else {
      return <HTMLElement>this.coveoRoot.find('.CoveoSearchbox');
    }
  }

  private saveTabsPosition() {
    this.previousSibling = this.tabSection.el.previousSibling ? $$(<HTMLElement>this.tabSection.el.previousSibling) : null;
    this.parent = $$(this.tabSection.el.parentElement);
  }

  private restoreTabsPosition() {
    if (this.previousSibling) {
      this.tabSection.insertAfter(this.previousSibling.el);
    } else {
      this.parent.prepend(this.tabSection.el);
    }
  }

  private bindNukeEvents() {
    $$(this.coveoRoot).on(InitializationEvents.nuke, () => {
      window.removeEventListener('resize', this.resizeListener);
      $$(document.documentElement).off('click', this.documentClickListener);
    });
  }

  private positionPopup() {
    PopupUtils.positionPopup(this.dropdownContent.el, this.dropdownHeader.el, this.coveoRoot.el, this.coveoRoot.el,
      { horizontal: HorizontalAlignment.INNERLEFT, vertical: VerticalAlignment.BOTTOM });
  }
}
