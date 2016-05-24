import {$$, Dom} from '../../utils/Dom.ts';
import {InitializationEvents} from '../../events/InitializationEvents.ts';

export class ResponsiveTabs {
  private static dropdownHeader: Dom;
  private static dropdownContent: Dom;
  
  public static init() {
    $$(document.getElementById('search')).on(InitializationEvents.afterInitialization, () => {
      this.dropdownContent = $$('div');
      this.dropdownHeader = this.buildDropdownHeader();
      let searchBarElement = <HTMLElement>document.querySelector('.coveo-search-section');
      let tabSectionElement = <HTMLElement>document.querySelector('.coveo-tab-section');

      if (!tabSectionElement) {
        return;
      }
      let tabSection = $$(tabSectionElement);

      let toggleSmallTabsIfNeeded = () => {
        let tabSectionIsOverflowing = this.isOverflowing(tabSection.el);
        
        if (tabSectionIsOverflowing && !tabSection.is('.coveo-small-tab-section')) {
          this.toggleSmallClass(tabSection);
          if (searchBarElement) {
            tabSection.insertAfter(searchBarElement);
          }
        } else if (tabSection.is('.coveo-small-tab-section')
                    && !this.isLargeFormatOverflowing(tabSectionElement)) {
            this.dropdownHeader.detach();
            this.toggleSmallClass(tabSection);
            if (searchBarElement) {
              tabSection.insertBefore(searchBarElement);
            }
        }
        
        if(tabSectionIsOverflowing && tabSection.is('.coveo-small-tab-section')) {
          let currentTab;
          let overflowingElements = [];
          let tabs = tabSection.findAll('.CoveoTab');
          
          for(let i = tabs.length - 1; i >= 0; i--) {     
            currentTab = tabs[i];
            this.dropdownContent.prepend(currentTab);
            if(!ResponsiveTabs.isOverflowing(tabSection.el)) {
              break;
            }
          }
          
          tabSection.el.appendChild(this.dropdownHeader.el);
          
          
          //PopupUtils.positionPopup(dropdown.el, this.element, this.root, this.root, this.getPopupPositioning());
          
        } else if(!tabSectionIsOverflowing && tabSection.is('.coveo-small-tab-section')) {
          this.dropdownHeader.detach();
        }
        
      };
      toggleSmallTabsIfNeeded();
      window.addEventListener('resize', <EventListener>_.debounce(toggleSmallTabsIfNeeded, 200));
    });
  }


  private static isLargeFormatOverflowing(tabSectionElement: HTMLElement){
    let virtualTabSection = $$(<HTMLElement>tabSectionElement.cloneNode(true));
    ResponsiveTabs.toggleSmallClass(virtualTabSection);
    
    virtualTabSection.el.style.position = "absolute";
    virtualTabSection.el.style.visibility = "hidden";
    
    virtualTabSection.insertBefore(<HTMLElement>document.querySelector('#search'));
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
  
  private static numberOfElementInDropdown(): number {
    if (this.dropdownContent) {
      let tabs = this.dropdownContent.findAll('.coveo-small-tab');
      return tabs.length;
    }
    
    return 0;
  }
}


