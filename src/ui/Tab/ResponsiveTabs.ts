import {$$, Dom} from '../../utils/Dom.ts';
import {InitializationEvents} from '../../events/InitializationEvents.ts';
import {PopupUtils, HorizontalAlignment, VerticalAlignment } from '../../utils/PopupUtils';

export class ResponsiveTabs {
  static coveoTabSection = '.coveo-tab-section';
  
  private static dropdownHeader: Dom;
  private static dropdownContent: Dom;
  private static tabSection: Dom;
  private static searchBarElement: HTMLElement;
  private static coveoRoot: HTMLElement;
  
  public static init() {
    this.coveoRoot = <HTMLElement>document.querySelector('.CoveoSearchInterface');
    $$(this.coveoRoot).on(InitializationEvents.afterInitialization, () => {
      this.dropdownContent = this.buildDropdownContent();
      this.dropdownHeader = this.buildDropdownHeader();
      this.bindDropdownContentEvents();
      this.bindDropdownHeaderEvents();
      
      this.searchBarElement = this.getSearchBoxElement();
      let tabSectionElement = <HTMLElement>document.querySelector(this.coveoTabSection);

      if (!tabSectionElement) {
        return;
      }
      this.tabSection = $$(tabSectionElement);

      let manageResponsiveTabs = () => {
        this.toggleSmallTabsIfNeeded();
        
        let tabSectionIsOverflowing = this.isOverflowing(this.tabSection.el);
        if (tabSectionIsOverflowing && this.tabSection.is('.coveo-small-tab-section')) {
          let currentTab;
          let overflowingElements = [];
          let tabs = this.tabSection.findAll('.CoveoTab:not(.coveo-tab-dropdown)');
          
          this.tabSection.el.appendChild(this.dropdownHeader.el);
          for(let i = tabs.length - 1; i >= 0; i--) {
            currentTab = tabs[i];
            this.addToDropdown(currentTab);
            if(!this.isOverflowing(this.tabSection.el)) {
              break;
            }
          }
          
        } else if(!tabSectionIsOverflowing && this.tabSection.is('.coveo-small-tab-section') && !this.isDropdownEmpty()) {
          let dropdownTabs = this.dropdownContent.findAll('.coveo-small-tab');
          
          while (!this.isOverflowing(this.tabSection.el) && !this.isDropdownEmpty()) {
            let current = dropdownTabs.shift();
            this.removeFromDropdown(current);
            $$(current).insertBefore(this.dropdownHeader.el);
          }
          
          if (this.isOverflowing(this.tabSection.el)) {
            let tabs = this.tabSection.findAll('.coveo-small-tab');
            this.addToDropdown(tabs.pop());
          }
          
          if (this.isDropdownEmpty()) {
            this.dropdownHeader.removeClass('coveo-tab-dropdown-header-active');
            this.dropdownHeader.detach();
            this.dropdownContent.detach();
            this.toggleSmallTabsIfNeeded();
          }
        }
        
      };
      manageResponsiveTabs();
      window.addEventListener('resize', <EventListener>_.debounce(manageResponsiveTabs, 200));
    });
  }


  private static toggleSmallTabsIfNeeded() {
    let tabSectionIsOverflowing = this.isOverflowing(this.tabSection.el);
    if (tabSectionIsOverflowing && !this.tabSection.is('.coveo-small-tab-section')) {
          this.toggleSmallClass(this.tabSection);
          
          if (this.searchBarElement) {
            this.tabSection.insertAfter(this.searchBarElement);
          }
    } else if (this.tabSection.is('.coveo-small-tab-section')
                   && !this.isLargeFormatOverflowing(this.tabSection.el)
                   && this.isDropdownEmpty()) {
      this.toggleSmallClass(this.tabSection);
      
      if (this.searchBarElement) {
        this.tabSection.insertBefore(this.searchBarElement);
      }
    }
  }
  
  private static isLargeFormatOverflowing(tabSectionElement: HTMLElement){
    let virtualTabSection = $$(<HTMLElement>tabSectionElement.cloneNode(true));
    this.toggleSmallClass(virtualTabSection);
    
    let dropdownHeader = virtualTabSection.el.querySelector('.coveo-tab-dropdown-header');
    if (dropdownHeader) {
      virtualTabSection.el.removeChild(dropdownHeader);
    }
    
    virtualTabSection.el.style.position = "absolute";
    virtualTabSection.el.style.visibility = "hidden";
    
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
  
  private static buildDropdownHeader(): Dom {
    let dropdownHeader = $$('a', {className: 'coveo-tab-dropdown-header'});
    let content = $$('p');
    content.text('more tabs');
    content.el.appendChild($$('span', {className: 'coveo-sprites-more-tabs'}).el);
    dropdownHeader.el.appendChild(content.el);
    return dropdownHeader;
  }
  
  private static bindDropdownHeaderEvents() {
    this.dropdownHeader.on('click', () => {
      if (!this.dropdownHeader.hasClass('coveo-tab-dropdown-header-active')) {
        PopupUtils.positionPopup(this.dropdownContent.el, this.dropdownHeader.el, this.tabSection.el, this.coveoRoot,
                                {horizontal: HorizontalAlignment.CENTER, vertical: VerticalAlignment.BOTTOM});
        this.dropdownHeader.addClass('coveo-tab-dropdown-header-active');
      } else {
        this.dropdownContent.detach();
        this.dropdownHeader.removeClass('coveo-tab-dropdown-header-active');
      }
    });
  }
  
  private static buildDropdownContent() {
    let dropdownContent = $$('div', {className: 'coveo-tab-list-container'});
    let contentList = $$('ol', {className: 'coveo-tab-list'});
    dropdownContent.el.appendChild(contentList.el);
    return dropdownContent;
  }
  
  private static bindDropdownContentEvents() {
    $$(document.documentElement).on('click', event => {
      let eventTarget = $$(<HTMLElement>event.target);
      if (!eventTarget.closest('coveo-tab-list-container')
          && !eventTarget.closest('coveo-tab-dropdown-header')) {
        this.dropdownContent.detach();
        this.dropdownHeader.removeClass('coveo-tab-dropdown-header-active');
      }
    });
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
  
  private static getSearchBoxElement(): HTMLElement {
    let searchBoxElement = document.querySelector('.coveo-search-section');
    if (searchBoxElement){
      return <HTMLElement>searchBoxElement;
    } else {
      return <HTMLElement>document.querySelector('.CoveoSearchbox');
    }
  }
}


