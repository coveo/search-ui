import {$$, Dom} from '../../utils/Dom.ts';
import {InitializationEvents} from '../../events/InitializationEvents.ts';
import {PopupUtils, HorizontalAlignment, VerticalAlignment } from '../../utils/PopupUtils';

export class ResponsiveTabs {
  static coveoRoot = '.CoveoSearchInterface';
  static coveoSearchBox = '.CoveoSearchbox';
  static coveoTabSection = '.coveo-tab-section';
  
  private static dropdownHeader: Dom;
  private static dropdownContent: Dom;
  private static tabSection: Dom;
  private static searchBarElement: HTMLElement;
  
  public static init() {
    $$(<HTMLElement>document.querySelector(this.coveoRoot)).on(InitializationEvents.afterInitialization, () => {
      this.dropdownContent = this.buildDropdownContent();
      this.dropdownHeader = this.buildDropdownHeader();
      this.searchBarElement = <HTMLElement>document.querySelector(this.coveoSearchBox);
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
          let tabs = this.tabSection.findAll('.CoveoTab');
          
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
            this.dropdownHeader.detach();
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
    ResponsiveTabs.toggleSmallClass(virtualTabSection);
    
    virtualTabSection.el.style.position = "absolute";
    virtualTabSection.el.style.visibility = "hidden";
    
    if (!this.isDropdownEmpty) {
      _.each(this.dropdownContent.findAll('.coveo-small-tab'), tab => {
        virtualTabSection.el.appendChild(tab.cloneNode(true));
      });
    }
    
    virtualTabSection.insertBefore(<HTMLElement>document.querySelector(this.coveoRoot));
    let isOverflowing = ResponsiveTabs.isOverflowing(virtualTabSection.el);
    virtualTabSection.detach();
    return isOverflowing;
  }


  private static isOverflowing(el: HTMLElement) {
    return el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
  }
  
  private static buildDropdownHeader(): Dom {
    //<a class="coveo-tab-dropdown-header"><p>More tabs<span class="coveo-sprites-more-tabs"></span></p></a>
    let dropdownHeader = $$('a', {className: 'coveo-tab-dropdown-header'});
    let content = $$('p');
    content.text('more tabs');
    content.el.appendChild($$('span', {className: 'coveo-sprites-more-tabs'}).el);
    dropdownHeader.el.appendChild(content.el);
    dropdownHeader.on('click', () => {
      PopupUtils.positionPopup(this.dropdownContent.el, this.dropdownHeader.el, <HTMLElement> document.querySelector(this.coveoRoot),
                             <HTMLElement> document.querySelector(this.coveoRoot),
                             {horizontal: HorizontalAlignment.CENTER, vertical: VerticalAlignment.BOTTOM});
    })
    return dropdownHeader;
  }
  
  private static buildDropdownContent() {
    let dropdownContent = $$('div');
    let contentList = $$('ol', {className: 'coveo-tab-list'});
    dropdownContent.el.appendChild(contentList.el);
    return dropdownContent;
  }
  
  private static addToDropdown(el: HTMLElement) {
    if (this.dropdownContent) {
      let list = this.dropdownContent.el.querySelector('ol');
      let listElement = $$('li');
      listElement.el.appendChild(el);
      $$(<HTMLElement>list).prepend(listElement.el);
    }
  }
  
  private static removeFromDropdown(el: HTMLElement) {
    if (this.dropdownContent) {
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
}


