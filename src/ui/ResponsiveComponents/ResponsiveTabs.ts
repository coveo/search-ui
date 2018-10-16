import 'styling/_ResponsiveTabs';
import { reject, each, find } from 'underscore';
import { InitializationEvents } from '../../events/InitializationEvents';
import { Logger } from '../../misc/Logger';
import { l } from '../../strings/Strings';
import { $$, Dom } from '../../utils/Dom';
import { EventsUtils } from '../../utils/EventsUtils';
import { PopupHorizontalAlignment, PopupUtils, PopupVerticalAlignment } from '../../utils/PopupUtils';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { Utils } from '../../utils/Utils';
import { Component } from '../Base/Component';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { Tab } from '../Tab/Tab';
import { ResponsiveComponents } from './ResponsiveComponents';
import { IResponsiveComponent, IResponsiveComponentOptions, ResponsiveComponentsManager } from './ResponsiveComponentsManager';
import { ResponsiveComponentsUtils } from './ResponsiveComponentsUtils';

export class ResponsiveTabs implements IResponsiveComponent {
  private static DROPDOWN_HEADER_LABEL_DEFAULT_VALUE = 'More';
  private static logger: Logger;
  private dropdownHeader: Dom;
  private dropdownContent: Dom;
  private tabSection: Dom;
  private documentClickListener: EventListener;
  private searchInterface: SearchInterface;
  private dropdownHeaderLabel: string;

  private _initialTabsOrder: HTMLElement[];

  constructor(private coveoRoot: Dom, public ID: string) {
    this.dropdownHeaderLabel = this.getDropdownHeaderLabel();
    this.searchInterface = <SearchInterface>Component.get(this.coveoRoot.el, SearchInterface, false);
    this.dropdownContent = this.buildDropdownContent();
    this.dropdownHeader = this.buildDropdownHeader();
    this.bindDropdownContentEvents();
    this.bindDropdownHeaderEvents();
    this.tabSection = $$(<HTMLElement>this.coveoRoot.find('.coveo-tab-section'));
    this.manageTabSwapping();
    this.bindNukeEvents();
  }

  private get initialTabsOrder(): HTMLElement[] {
    if (!this._initialTabsOrder) {
      this._initialTabsOrder = [...this.getTabsInTabSection()];
    }
    return this._initialTabsOrder;
  }

  public static init(root: HTMLElement, component: Component, options: IResponsiveComponentOptions) {
    this.logger = new Logger('ResponsiveTabs');
    if (!$$(root).find('.coveo-tab-section')) {
      this.logger.info('No element with class coveo-tab-section. Responsive tabs cannot be enabled.');
      return;
    }
    ResponsiveComponentsManager.register(ResponsiveTabs, $$(root), Tab.ID, component, options);
  }

  public handleResizeEvent(): void {
    if (this.needSmallMode() && !ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot)) {
      this.changeToSmallMode();
    } else if (!this.needSmallMode() && ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot)) {
      this.changeToLargeMode();
    }

    if (this.shouldAddTabsToDropdown()) {
      this.addTabsToDropdown();
    } else if (this.shouldRemoveTabsFromDropdown()) {
      this.removeTabsFromDropdown();
    }

    if (this.dropdownHeader.hasClass('coveo-dropdown-header-active')) {
      this.positionPopup();
    }
  }

  private needSmallMode(): boolean {
    const mediumWidth = this.searchInterface
      ? this.searchInterface.responsiveComponents.getMediumScreenWidth()
      : new ResponsiveComponents().getMediumScreenWidth();
    if (this.coveoRoot.width() <= mediumWidth) {
      return true;
    } else if (!ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot)) {
      return this.isOverflowing(this.tabSection.el);
    } else {
      return this.isLargeFormatOverflowing();
    }
  }

  private changeToSmallMode(): void {
    ResponsiveComponentsUtils.activateSmallTabs(this.coveoRoot);
  }

  private changeToLargeMode(): void {
    this.emptyDropdown();
    this.cleanUpDropdown();
    ResponsiveComponentsUtils.deactivateSmallTabs(this.coveoRoot);
  }

  private shouldAddTabsToDropdown(): boolean {
    return this.isOverflowing(this.tabSection.el) && ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot);
  }

  private addTabsToDropdown(): void {
    let currentTab;
    if (!this.tabSection.find('.coveo-tab-dropdown-header')) {
      const facetDropdownHeader = this.tabSection.find('.coveo-facet-dropdown-header');
      if (facetDropdownHeader) {
        this.dropdownHeader.insertBefore(facetDropdownHeader);
      } else {
        this.tabSection.el.appendChild(this.dropdownHeader.el);
      }
    }
    for (let i = this.initialTabsOrder.length - 1; i >= 0; i--) {
      currentTab = this.initialTabsOrder[i];

      if (this.isSelectedTab(currentTab) && i > 0) {
        currentTab = this.initialTabsOrder[--i];
      }

      this.addToDropdown(currentTab);

      if (!this.isOverflowing(this.tabSection.el)) {
        break;
      }
    }
  }

  private shouldRemoveTabsFromDropdown(): boolean {
    return (
      !this.isOverflowing(this.tabSection.el) && ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot) && !this.isDropdownEmpty()
    );
  }

  private removeTabsFromDropdown() {
    const dropdownTabs = this.dropdownContent.findAll('.coveo-tab-dropdown');
    const currentlySelectedTab = find(this.getTabsInTabSection(), tab => this.isSelectedTab(tab));

    let current: HTMLElement;
    while (!this.isOverflowing(this.tabSection.el) && !this.isDropdownEmpty()) {
      current = dropdownTabs.shift();
      this.removeFromDropdown(current);
      this.fromDropdownToTabSection($$(current), currentlySelectedTab);
    }

    if (this.isOverflowing(this.tabSection.el)) {
      const tabs = reject(this.getTabsInTabSection(), tab => this.isSelectedTab(tab));
      this.addToDropdown(tabs.pop());
    }

    if (this.isDropdownEmpty()) {
      this.cleanUpDropdown();
    }
  }

  private emptyDropdown(): void {
    if (!this.isDropdownEmpty()) {
      const dropdownTabs = this.dropdownContent.findAll('.coveo-tab-dropdown');
      while (!this.isDropdownEmpty()) {
        const current = dropdownTabs.shift();
        this.removeFromDropdown(current);
      }
      this.initialTabsOrder.forEach(tab => this.tabSection.append(tab));
    }
  }

  private isLargeFormatOverflowing(): boolean {
    const virtualTabSection = $$(<HTMLElement>this.tabSection.el.cloneNode(true));

    const dropdownHeader = virtualTabSection.find('.coveo-tab-dropdown-header');
    if (dropdownHeader) {
      virtualTabSection.el.removeChild(dropdownHeader);
    }

    virtualTabSection.el.style.position = 'absolute';
    virtualTabSection.el.style.visibility = 'hidden';

    if (!this.isDropdownEmpty()) {
      each(this.dropdownContent.findAll('.CoveoTab'), tab => {
        virtualTabSection.el.appendChild(tab.cloneNode(true));
      });
    }
    virtualTabSection.insertBefore(this.tabSection.el);

    ResponsiveComponentsUtils.deactivateSmallTabs(this.coveoRoot);
    const isOverflowing = this.isOverflowing(this.tabSection.el) || this.isOverflowing(virtualTabSection.el);
    ResponsiveComponentsUtils.activateSmallTabs(this.coveoRoot);

    virtualTabSection.detach();
    return isOverflowing;
  }

  private isOverflowing(el: HTMLElement) {
    return el.clientWidth < el.scrollWidth;
  }

  private buildDropdownHeader(): Dom {
    const dropdownHeader = $$('a', { className: 'coveo-dropdown-header coveo-tab-dropdown-header' });
    const content = $$('p');
    content.text(this.dropdownHeaderLabel);
    const icon = $$('span', { className: 'coveo-more-tabs' }, SVGIcons.icons.arrowDown);
    SVGDom.addClassToSVGInContainer(icon.el, 'coveo-more-tabs-svg');
    content.el.appendChild(icon.el);
    dropdownHeader.el.appendChild(content.el);
    return dropdownHeader;
  }

  private bindDropdownHeaderEvents() {
    this.dropdownHeader.on('click', () => {
      if (!this.dropdownHeader.hasClass('coveo-dropdown-header-active')) {
        this.positionPopup();
        this.dropdownHeader.addClass('coveo-dropdown-header-active');
      } else {
        this.closeDropdown();
      }
    });
  }

  private buildDropdownContent() {
    const dropdownContent = $$('div', {
      className: 'coveo-tab-list-container ' + SearchInterface.SMALL_INTERFACE_CLASS_NAME
    });
    const contentList = $$('ol', { className: 'coveo-tab-list' });
    dropdownContent.el.appendChild(contentList.el);
    return dropdownContent;
  }

  private bindDropdownContentEvents() {
    this.documentClickListener = event => {
      if (Utils.isHtmlElement(event.target)) {
        const eventTarget = $$(<HTMLElement>event.target);
        if (
          !eventTarget.closest('coveo-tab-list-container') &&
          !eventTarget.closest('coveo-tab-dropdown-header') &&
          !eventTarget.closest('coveo-tab-dropdown')
        ) {
          this.closeDropdown();
        }
      }
    };
    $$(document.documentElement).on('click', this.documentClickListener);
  }

  private closeDropdown(): void {
    this.dropdownContent.detach();
    this.dropdownHeader.removeClass('coveo-dropdown-header-active');
  }

  private addToDropdown(el: HTMLElement) {
    if (this.dropdownContent) {
      $$(el).addClass('coveo-tab-dropdown');
      const list = this.dropdownContent.find('ol');
      const listElement = $$('li');
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

  private cleanUpDropdown() {
    this.dropdownHeader.removeClass('coveo-dropdown-header-active');
    this.dropdownHeader.detach();
    this.dropdownContent.detach();
  }

  private isDropdownEmpty(): boolean {
    if (this.dropdownContent) {
      const tabs = this.dropdownContent.findAll('.CoveoTab');
      return tabs.length == 0;
    }
    return false;
  }

  private manageTabSwapping() {
    each(this.coveoRoot.findAll('.' + Component.computeCssClassNameForType(this.ID)), tabElement => {
      const tab = $$(tabElement);
      const fadeOutFadeIn = event => {
        const tabsInSection = this.getTabsInTabSection();
        const lastTabInSection = tabsInSection.pop();
        const lastTabSectionSibling = lastTabInSection.previousSibling;
        if (event.propertyName == 'opacity') {
          if (tab.el.style.opacity == '0') {
            $$(lastTabInSection).addClass('coveo-tab-dropdown');
            tab.replaceWith(lastTabInSection);
            tab.removeClass('coveo-tab-dropdown');

            this.fromDropdownToTabSection(tab, <HTMLElement>lastTabSectionSibling);

            // Because of the DOM manipulation, sometimes the animation will not trigger. Accessing the computed styles makes sure
            // the animation will happen.
            window.getComputedStyle(tab.el).opacity;
            window.getComputedStyle(lastTabInSection).opacity;

            tab.el.style.opacity = lastTabInSection.style.opacity = '1';
          } else if (tab.el.style.opacity == '1') {
            this.closeDropdown();
            EventsUtils.removePrefixedEvent(tab.el, 'TransitionEnd', fadeOutFadeIn);
            this.handleResizeEvent();
          }
        }
      };

      tab.on('click', () => {
        if (tab.hasClass('coveo-tab-dropdown')) {
          const tabsInSection = this.getTabsInTabSection();
          let lastTabInSection = tabsInSection.pop();
          if (lastTabInSection) {
            EventsUtils.addPrefixedEvent(tab.el, 'TransitionEnd', fadeOutFadeIn);
            tab.el.style.opacity = lastTabInSection.style.opacity = '0';
          }
        }
      });
    });
  }

  private bindNukeEvents() {
    $$(this.coveoRoot).on(InitializationEvents.nuke, () => {
      $$(document.documentElement).off('click', this.documentClickListener);
    });
  }

  private positionPopup() {
    PopupUtils.positionPopup(
      this.dropdownContent.el,
      this.dropdownHeader.el,
      this.coveoRoot.el,
      { horizontal: PopupHorizontalAlignment.INNERRIGHT, vertical: PopupVerticalAlignment.BOTTOM },
      this.coveoRoot.el
    );
  }

  private getTabsInTabSection(): HTMLElement[] {
    let tabsInSection = [];
    each(this.tabSection.el.children, childElement => {
      if (Utils.isHtmlElement(childElement)) {
        let child = $$(<HTMLElement>childElement);
        if (!child.hasClass('coveo-tab-dropdown') && child.hasClass(Component.computeCssClassNameForType(this.ID))) {
          tabsInSection.push(child.el);
        }
      }
    });
    return tabsInSection;
  }

  private fromDropdownToTabSection(tab: Dom, lastTabInTabSection: HTMLElement) {
    if (lastTabInTabSection) {
      if (this.initialTabsOrder.indexOf(tab.el) > this.initialTabsOrder.indexOf(lastTabInTabSection)) {
        tab.insertAfter(<HTMLElement>lastTabInTabSection);
      } else {
        tab.insertBefore(<HTMLElement>lastTabInTabSection);
      }
    } else {
      this.tabSection.prepend(tab.el);
    }
  }

  private getDropdownHeaderLabel() {
    let dropdownHeaderLabel: string;
    each($$(this.coveoRoot.find('.coveo-tab-section')).findAll('.' + Component.computeCssClassName(Tab)), tabElement => {
      let tab = <Tab>Component.get(tabElement, Tab);
      if (!dropdownHeaderLabel && tab.options.dropdownHeaderLabel) {
        dropdownHeaderLabel = tab.options.dropdownHeaderLabel;
      }
    });

    if (!dropdownHeaderLabel) {
      dropdownHeaderLabel = l(ResponsiveTabs.DROPDOWN_HEADER_LABEL_DEFAULT_VALUE);
    }

    return dropdownHeaderLabel;
  }

  private isSelectedTab(tab: Dom | HTMLElement) {
    return $$(tab as HTMLElement).hasClass('coveo-selected');
  }
}
