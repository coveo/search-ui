import {$$, Dom} from '../../utils/Dom.ts';
import {InitializationEvents} from '../../events/InitializationEvents.ts';

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
      this.dropdownContent = $$('div');
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
            this.dropdownContent.prepend(currentTab);
            if(!this.isOverflowing(this.tabSection.el)) {
              break;
            }
          }
          
          
          //PopupUtils.positionPopup(dropdown.el, this.element, this.root, this.root, this.getPopupPositioning());
          
        } else if(!tabSectionIsOverflowing && this.tabSection.is('.coveo-small-tab-section') && !this.isDropdownEmpty()) {
          let dropdownTabs = this.dropdownContent.findAll('.coveo-small-tab');
          
          while (!this.isOverflowing(this.tabSection.el) && !this.isDropdownEmpty()) {
            let current = dropdownTabs.shift();
            $$(current).insertBefore(this.dropdownHeader.el);
          }
          
          if (this.isOverflowing(this.tabSection.el)) {
            let tabs = this.tabSection.findAll('.coveo-small-tab');
            this.dropdownContent.prepend(tabs.pop());
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
    console.log([el.clientWidth, el.scrollWidth, el.clientHeight, el.scrollHeight]);
    return el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
  }
  
  private static buildDropdownHeader(): Dom {
    //<a class="coveo-tab-dropdown-header"><p>More tabs<span class="coveo-sprites-more-tabs"></span></p></a>
    let dropdownHeader = $$('a', {className: 'coveo-tab-dropdown-header'});
    let content = $$('p');
    content.text('more tabs');
    content.el.appendChild($$('span', {className: 'coveo-sprites-more-tabs'}).el);
    dropdownHeader.el.appendChild(content.el);
    return dropdownHeader;
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


