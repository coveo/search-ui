import 'styling/_ResponsiveTabs';
import { filter, each, last } from 'underscore';
import { InitializationEvents } from '../../events/InitializationEvents';
import { Logger } from '../../misc/Logger';
import { l } from '../../strings/Strings';
import { $$, Dom } from '../../utils/Dom';
import { EventsUtils } from '../../utils/EventsUtils';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { Utils } from '../../utils/Utils';
import { Component } from '../Base/Component';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { Tab } from '../Tab/Tab';
import { ResponsiveComponents } from './ResponsiveComponents';
import { IResponsiveComponent, IResponsiveComponentOptions, ResponsiveComponentsManager } from './ResponsiveComponentsManager';
import { ResponsiveComponentsUtils } from './ResponsiveComponentsUtils';
import { AccessibleButton } from '../../utils/AccessibleButton';
import Popper from 'popper.js';
import { KeyboardUtils, KEYBOARD } from '../../utils/KeyboardUtils';

export class ResponsiveTabs implements IResponsiveComponent {
  private static DROPDOWN_HEADER_LABEL_DEFAULT_VALUE = 'More';
  private static TAB_IN_DROPDOWN_CSS_CLASS = 'coveo-tab-dropdown';
  private static TAB_IN_DROPDOWN_HEADER_CSS_CLASS = `${ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS}-header`;
  private static ACTIVE_DROPDOWN_CSS_CLASS = 'coveo-dropdown-header-active';
  private static logger: Logger;
  private dropdownHeader: Dom;
  private dropdownContent: Dom;
  private tabSection: Dom;
  private searchInterface: SearchInterface;
  private dropdownHeaderLabel: string;
  private initialTabOrder: HTMLElement[];

  private documentClickListener: EventListener;
  private dropdownClickListener: EventListener;
  private ignoreNextDocumentClick = false;

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
    this.initialTabOrder = [...this.tabsInTabSection];
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

    if (this.isDropdownOpen()) {
      this.positionPopup();
    }
  }

  private needSmallMode(): boolean {
    // Ignore everything if the responsiveMode is not auto.
    if (!this.searchInterface) {
      return this.shouldAutoModeResolveToSmall();
    }
    switch (this.searchInterface.responsiveComponents.getResponsiveMode()) {
      case 'small':
      case 'medium':
        return true;
      case 'auto':
      default:
        return this.shouldAutoModeResolveToSmall();
    }
  }

  private shouldAutoModeResolveToSmall() {
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
    return (
      (this.isOverflowing(this.tabSection.el) || this.tabSection.el.clientWidth === 0) &&
      ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot)
    );
  }

  private addTabsToDropdown(): void {
    let currentTab;
    if (!this.tabSection.find(`.${ResponsiveTabs.TAB_IN_DROPDOWN_HEADER_CSS_CLASS}`)) {
      const facetDropdownHeader = this.tabSection.find('.coveo-facet-dropdown-header');
      if (facetDropdownHeader) {
        this.dropdownHeader.insertBefore(facetDropdownHeader);
      } else {
        this.tabSection.el.appendChild(this.dropdownHeader.el);
      }
    }
    for (let i = this.initialTabOrder.length - 1; i >= 0; i--) {
      currentTab = this.initialTabOrder[i];

      if (this.tabIsSelected(currentTab) && i > 0) {
        currentTab = this.initialTabOrder[--i];
      }

      this.addToDropdownIfNeeded(currentTab);

      if (!this.isOverflowing(this.tabSection.el)) {
        break;
      }
    }
  }

  private shouldRemoveTabsFromDropdown(): boolean {
    return (
      !this.isOverflowing(this.tabSection.el) &&
      this.tabSection.el.clientWidth !== 0 &&
      ResponsiveComponentsUtils.isSmallTabsActivated(this.coveoRoot) &&
      !this.isDropdownEmpty()
    );
  }

  private removeTabsFromDropdown() {
    const dropdownTabs = this.tabsInTabDropdown;

    let current: HTMLElement;
    while (!this.isOverflowing(this.tabSection.el) && !this.isDropdownEmpty()) {
      current = dropdownTabs.shift();
      this.removeFromDropdownIfNeeded(current);
      this.fromDropdownToTabSection($$(current));
    }

    if (this.isOverflowing(this.tabSection.el)) {
      const unselectedTabs = filter(this.tabsInTabSection, tab => !this.tabIsSelected(tab));
      this.addToDropdownIfNeeded(unselectedTabs.pop());
    }

    if (this.isDropdownEmpty()) {
      this.cleanUpDropdown();
    }
  }

  private emptyDropdown(): void {
    if (!this.isDropdownEmpty()) {
      const dropdownTabs = this.tabsInTabDropdown;
      while (!this.isDropdownEmpty()) {
        const current = dropdownTabs.shift();
        this.removeFromDropdownIfNeeded(current);
      }
      this.initialTabOrder.forEach(tab => this.tabSection.append(tab));
    }
  }

  private isLargeFormatOverflowing(): boolean {
    const virtualTabSection = $$(<HTMLElement>this.tabSection.el.cloneNode(true));

    const dropdownHeader = virtualTabSection.find(`.${ResponsiveTabs.TAB_IN_DROPDOWN_HEADER_CSS_CLASS}`);
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
    const dropdownHeader = $$('a', { className: `coveo-dropdown-header ${ResponsiveTabs.TAB_IN_DROPDOWN_HEADER_CSS_CLASS}` });
    const content = $$('p');
    content.text(this.dropdownHeaderLabel);
    const icon = $$('span', { className: 'coveo-more-tabs' }, SVGIcons.icons.arrowDown);
    SVGDom.addClassToSVGInContainer(icon.el, 'coveo-more-tabs-svg');
    content.el.appendChild(icon.el);
    dropdownHeader.el.appendChild(content.el);
    return dropdownHeader;
  }

  private bindDropdownHeaderEvents() {
    const toggle = (event: Event) => {
      if (this.isDropdownOpen()) {
        this.closeDropdown();
      } else {
        this.openDropdown();
      }

      if (event.type === 'click') {
        this.ignoreNextDocumentClick = true;
      }
    };
    new AccessibleButton()
      .withElement(this.dropdownHeader)
      .withSelectAction(toggle)
      .withLabel(this.getDropdownHeaderLabel())
      .build();
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
    this.dropdownClickListener = () => {
      if (this.isDropdownOpen()) {
        this.ignoreNextDocumentClick = true;
      }
    };

    this.documentClickListener = event => {
      if (!this.ignoreNextDocumentClick) {
        this.closeDropdown();
      }
      this.ignoreNextDocumentClick = false;
    };
    $$(this.dropdownHeader).on('click', this.dropdownClickListener);
    $$(this.dropdownContent).on('click', this.dropdownClickListener);
  }

  private isDropdownOpen(): boolean {
    return this.dropdownHeader.hasClass(ResponsiveTabs.ACTIVE_DROPDOWN_CSS_CLASS);
  }

  private closeDropdown(): void {
    $$(document.documentElement).off('click', this.documentClickListener);
    this.dropdownContent.detach();
    this.dropdownHeader.removeClass(ResponsiveTabs.ACTIVE_DROPDOWN_CSS_CLASS);
  }

  private openDropdown(): void {
    $$(document.documentElement).on('click', this.documentClickListener);
    this.positionPopup();
    this.dropdownHeader.addClass(ResponsiveTabs.ACTIVE_DROPDOWN_CSS_CLASS);
  }

  private addToDropdownIfNeeded(tab: HTMLElement) {
    if (!this.canAddTabToDropdown(tab)) {
      return;
    }

    $$(tab).addClass(ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS);
    const list = $$(this.dropdownContent.find('ol'));
    const listElement = $$('li', null, tab);
    list.prepend(listElement.el);
  }

  private removeFromDropdownIfNeeded(tab: HTMLElement) {
    if (!this.canRemoveTabFromDropdown(tab)) {
      return;
    }

    $$(tab as HTMLElement).removeClass(ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS);
    $$(tab.parentElement).detach();
  }

  private canAddTabToDropdown(tab: HTMLElement) {
    return tab && !this.tabIsInDropdown(tab) && this.dropdownHeader;
  }

  private canRemoveTabFromDropdown(tab: HTMLElement) {
    return tab && this.tabIsInDropdown(tab) && this.dropdownContent;
  }

  private cleanUpDropdown() {
    this.dropdownHeader.removeClass(ResponsiveTabs.ACTIVE_DROPDOWN_CSS_CLASS);
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
        const lastTabInSection = this.tabsInTabSection.pop();

        if (event.propertyName == 'opacity') {
          if (tab.el.style.opacity == '0') {
            $$(lastTabInSection).addClass(ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS);
            tab.replaceWith(lastTabInSection);
            tab.removeClass(ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS);

            this.fromDropdownToTabSection(tab);

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

      const swapOnSelect = () => {
        if (this.tabIsInDropdown(tab)) {
          let lastTabInSection = this.tabsInTabSection.pop();
          if (lastTabInSection) {
            EventsUtils.addPrefixedEvent(tab.el, 'TransitionEnd', fadeOutFadeIn);
            tab.el.style.opacity = lastTabInSection.style.opacity = '0';
          }
        }
      };

      tab.on('click', () => swapOnSelect());
      tab.on('keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, swapOnSelect));
      tab.on('blur', (e: FocusEvent) => {
        if (e.relatedTarget && !this.tabIsInDropdown(e.relatedTarget as HTMLElement)) {
          this.closeDropdown();
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
    this.dropdownContent.insertAfter(this.dropdownHeader.el);

    new Popper(this.dropdownHeader.el, this.dropdownContent.el, {
      modifiers: {
        preventOverflow: {
          boundariesElement: this.coveoRoot.el
        }
      }
    });
  }

  private fromDropdownToTabSection(tab: Dom) {
    const lastTabInTabSection = last(this.tabsInTabSection);
    if (!lastTabInTabSection) {
      this.tabSection.prepend(tab.el);
      return;
    }

    const comesAfterInitialTabOrder = this.initialTabOrder.indexOf(tab.el) > this.initialTabOrder.indexOf(lastTabInTabSection);
    if (comesAfterInitialTabOrder) {
      tab.insertAfter(lastTabInTabSection);
    } else {
      tab.insertBefore(lastTabInTabSection);
    }
  }

  private getDropdownHeaderLabel() {
    let dropdownHeaderLabel: string;
    each($$(this.coveoRoot.find('.coveo-tab-section')).findAll('.' + Component.computeCssClassName(Tab)), tabElement => {
      const tab = <Tab>Component.get(tabElement, Tab);
      if (!dropdownHeaderLabel && tab && tab.options.dropdownHeaderLabel) {
        dropdownHeaderLabel = tab.options.dropdownHeaderLabel;
      }
    });

    if (!dropdownHeaderLabel) {
      dropdownHeaderLabel = l(ResponsiveTabs.DROPDOWN_HEADER_LABEL_DEFAULT_VALUE);
    }

    return dropdownHeaderLabel;
  }

  private tabIsSelected(tab: Dom | HTMLElement) {
    return $$(tab as HTMLElement).hasClass('coveo-selected');
  }

  private tabIsInDropdown(tab: Dom | HTMLElement) {
    return $$(tab as HTMLElement).hasClass(ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS);
  }

  private get tabsInTabSection(): HTMLElement[] {
    const tabsInSection = [];
    each(this.tabSection.children(), childElement => {
      if (Utils.isHtmlElement(childElement)) {
        const child = $$(childElement);
        const childHasTabCssClassName = child.hasClass(Component.computeCssClassNameForType(this.ID));
        if (!this.tabIsInDropdown(child) && childHasTabCssClassName) {
          tabsInSection.push(child.el);
        }
      }
    });
    return tabsInSection;
  }

  private get tabsInTabDropdown(): HTMLElement[] {
    if (!this.dropdownContent) {
      return [];
    }
    return this.dropdownContent.findAll(`.${ResponsiveTabs.TAB_IN_DROPDOWN_CSS_CLASS}`);
  }
}
