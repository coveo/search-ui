import {$$, Dom} from '../../utils/Dom.ts';
import {InitializationEvents} from '../../events/InitializationEvents.ts';
import {PopupUtils, HorizontalAlignment, VerticalAlignment } from '../../utils/PopupUtils';
import {Logger} from '../../misc/Logger';

export class ResponsiveTabs {
  static coveoTabSection = '.coveo-tab-section';

  private static dropdownHeader: Dom;
  private static dropdownContent: Dom;
  private static tabSection: Dom;

  private static searchBoxElement: HTMLElement;
  private static coveoRoot: HTMLElement;

  private static resizeListener: EventListener;
  private static documentClickListener: EventListener;

  private static logger: Logger;

  public static init(root: HTMLElement) {
    this.logger = new Logger(this);
    this.coveoRoot = root;
    $$(this.coveoRoot).on(InitializationEvents.afterInitialization, () => {
      this.dropdownContent = this.buildDropdownContent();
      this.dropdownHeader = this.buildDropdownHeader();
      this.searchBoxElement = this.getSearchBoxElement();
      this.bindDropdownContentEvents();
      this.bindDropdownHeaderEvents();

      let tabSectionElement = <HTMLElement>this.coveoRoot.querySelector(this.coveoTabSection);

      if (!tabSectionElement) {
        return;
      }
      this.tabSection = $$(tabSectionElement);
      this.manageTabSwapping();

      let manageResponsiveTabs = () => {

        this.toggleSmallTabsIfNeeded();

        let tabSectionIsOverflowing = this.isOverflowing(this.tabSection.el);
        if (this.shouldAddTabsToDropdown()) {
          let currentTab;
          let overflowingElements = [];
          let tabs = this.tabSection.findAll('.CoveoTab:not(.coveo-tab-dropdown)');

          this.tabSection.el.appendChild(this.dropdownHeader.el);
          for (let i = tabs.length - 1; i >= 0; i--) {
            currentTab = tabs[i];
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
            let tabs = this.tabSection.findAll('.CoveoTab:not(.coveo-tab-dropdown)');
            this.addToDropdown(tabs.pop());
          }

          if (this.isDropdownEmpty()) {
            this.dropdownHeader.removeClass('coveo-tab-dropdown-header-active');
            this.dropdownHeader.detach();
            this.dropdownContent.detach();
            this.toggleSmallTabsIfNeeded();
          }
        }
        
        if (this.dropdownHeader.hasClass('coveo-tab-dropdown-header-active')){
          this.positionPopup();
        }
        
      };
      manageResponsiveTabs();
      this.resizeListener = <EventListener>_.debounce(manageResponsiveTabs, 200);
      window.addEventListener('resize', this.resizeListener);
      this.bindNukeEvents();
    });
  }

  private static shouldAddTabsToDropdown() {
    return this.isOverflowing(this.tabSection.el) && this.tabSection.is('.coveo-small-tab-section');
  }

  private static shouldRemoveTabsFromDropdown() {
    return !this.isOverflowing(this.tabSection.el) && this.tabSection.is('.coveo-small-tab-section') && !this.isDropdownEmpty();
  }

  private static toggleSmallTabsIfNeeded() {
    let tabSectionIsOverflowing = this.isOverflowing(this.tabSection.el);
    if (tabSectionIsOverflowing && !this.tabSection.is('.coveo-small-tab-section')) {
      this.toggleSmallClass(this.tabSection);
      this.moveTabSectionDown();

    } else if (this.shouldToggleToLargeFormat()) {
      this.toggleSmallClass(this.tabSection);
      this.moveTabSectionUp();
    }
  }

  private static shouldToggleToLargeFormat() {
    return this.tabSection.is('.coveo-small-tab-section') && !this.isLargeFormatOverflowing(this.tabSection.el) && this.isDropdownEmpty()
  }

  private static isLargeFormatOverflowing(tabSectionElement: HTMLElement) {
    let virtualTabSection = $$(<HTMLElement>tabSectionElement.cloneNode(true));
    this.toggleSmallClass(virtualTabSection);

    let dropdownHeader = virtualTabSection.el.querySelector('.coveo-tab-dropdown-header');
    if (dropdownHeader) {
      virtualTabSection.el.removeChild(dropdownHeader);
    }

    virtualTabSection.el.style.position = 'absolute';
    virtualTabSection.el.style.visibility = 'hidden';

    if (!this.isDropdownEmpty) {
      _.each(this.dropdownContent.findAll('.coveo-small-tab'), tab => {
        virtualTabSection.el.appendChild(tab.cloneNode(true));
      });
    }

    virtualTabSection.insertBefore(this.coveoRoot);
    let isOverflowing = this.isOverflowing(virtualTabSection.el);
    virtualTabSection.detach();
    return isOverflowing;
  }

  private static isOverflowing(el: HTMLElement) {
    return el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
  }

  private static moveTabSectionDown() {
    if (this.searchBoxElement) {
      this.tabSection.insertAfter(this.searchBoxElement);
    } else {
      this.couldNotFindSearchBoxError();
    }
  }

  private static moveTabSectionUp() {
    if (this.searchBoxElement) {
      this.tabSection.insertBefore(this.searchBoxElement);
    } else {
      this.couldNotFindSearchBoxError();
    }
  }

  private static couldNotFindSearchBoxError() {
    this.logger.info('While trying to move the tab section around the search box, could not find an element with class \
                      coveo-search-section or CoveoSearchBox');
  }

  private static buildDropdownHeader(): Dom {
    let dropdownHeader = $$('a', { className: 'coveo-tab-dropdown-header' });
    let content = $$('p');
    content.text('more tabs');
    content.el.appendChild($$('span', { className: 'coveo-sprites-more-tabs' }).el);
    dropdownHeader.el.appendChild(content.el);
    return dropdownHeader;
  }

  private static bindDropdownHeaderEvents() {
    this.dropdownHeader.on('click', () => {
      if (!this.dropdownHeader.hasClass('coveo-tab-dropdown-header-active')) {
        this.positionPopup();
        this.dropdownHeader.addClass('coveo-tab-dropdown-header-active');
      } else {
        this.dropdownContent.detach();
        this.dropdownHeader.removeClass('coveo-tab-dropdown-header-active');
      }
    });
  }

  private static buildDropdownContent() {
    let dropdownContent = $$('div', { className: 'coveo-tab-list-container' });
    let contentList = $$('ol', { className: 'coveo-tab-list' });
    dropdownContent.el.appendChild(contentList.el);
    return dropdownContent;
  }

  private static bindDropdownContentEvents() {
    this.documentClickListener = event => {
      let eventTarget = $$(<HTMLElement>event.target);
      if (!eventTarget.closest('coveo-tab-list-container')
        && !eventTarget.closest('coveo-tab-dropdown-header')) {
        this.dropdownContent.detach();
        this.dropdownHeader.removeClass('coveo-tab-dropdown-header-active');
      }
    };
    $$(document.documentElement).on('click', this.documentClickListener);
  }

  private static addToDropdown(el: HTMLElement) {
    if (this.dropdownContent) {
      $$(el).addClass('coveo-tab-dropdown');
      let list = this.dropdownContent.el.querySelector('ol');
      let listElement = $$('li');
      listElement.el.appendChild(el);
      $$(<HTMLElement>list).prepend(listElement.el);
    }
  }

  private static removeFromDropdown(el: HTMLElement) {
    if (this.dropdownContent) {
      $$(el).removeClass('coveo-tab-dropdown');
      $$(el.parentElement).detach();
    }
  }

  private static toggleSmallClass(el: Dom) {
    el.toggleClass('coveo-small-tab-section');
    _.each(el.findAll('.CoveoTab'), tab => {
      $$(tab).toggleClass('coveo-small-tab');
    });
  }

  private static isDropdownEmpty(): boolean {
    if (this.dropdownContent) {
      let tabs = this.dropdownContent.findAll('.coveo-small-tab');
      return tabs.length == 0;
    }
    return false;
  }

  private static manageTabSwapping() {
    _.each(this.tabSection.findAll('.CoveoTab'), tabElement => {
      let tab = $$(tabElement);
      tab.on('click', () => {
        if (tab.hasClass('coveo-tab-dropdown')) {
          let tabsInSection = this.tabSection.findAll('.CoveoTab:not(.coveo-tab-dropdown)');
          let lastTabInSection = tabsInSection.pop();

          $$(lastTabInSection).addClass('coveo-tab-dropdown');
          tab.replaceWith(lastTabInSection);

          tab.removeClass('coveo-tab-dropdown');
          tab.insertBefore(this.dropdownHeader.el);
        }
      })
    });
  }

  private static getSearchBoxElement(): HTMLElement {
    let searchBoxElement = this.coveoRoot.querySelector('.coveo-search-section');
    if (searchBoxElement) {
      return <HTMLElement>searchBoxElement;
    } else {
      return <HTMLElement>this.coveoRoot.querySelector('.CoveoSearchbox');
    }
  }

  private static bindNukeEvents() {
    $$(this.coveoRoot).on(InitializationEvents.nuke, () => {
      window.removeEventListener('resize', this.resizeListener);
      $$(document.documentElement).off('click', this.documentClickListener);
    });
  }
  
  private static positionPopup() {
    PopupUtils.positionPopup(this.dropdownContent.el, this.dropdownHeader.el, this.coveoRoot, this.coveoRoot,
          { verticalOffset: -69, horizontal: HorizontalAlignment.CENTER, vertical: VerticalAlignment.BOTTOM });
  }
}
