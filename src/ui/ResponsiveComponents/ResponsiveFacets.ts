import {$$, Dom} from '../../utils/Dom';
import {IResponsiveComponent, ResponsiveComponentsManager} from './ResponsiveComponentsManager';
import {Logger} from '../../misc/Logger';
import '../../../sass/_ResponsiveFacets.scss';
import {l} from '../../strings/Strings.ts';
import {PopupUtils, HorizontalAlignment, VerticalAlignment} from '../../utils/PopupUtils';

export class ResponsiveFacets implements IResponsiveComponent {

  private static ROOT_MIN_WIDTH = 800;
  private static FACETS_NOT_FOUND = 'Could not find element with class coveo-facet-column. Therefore, responsive facets cannot be enabled.';
  private static logger: Logger;

  public ID: string;
  public coveoRoot: Dom;

  private facetsColumn: Dom;
  private previousSibling: Dom;
  private parent: Dom;
  private dropdownHeader: Dom;
  private dropdownHeaderContainer: Dom;
  private tabSection: Dom;
  private popupBackground: Dom;
  private documentClickListener: EventListener;

  public static init(root: HTMLElement, ID: string) {
    this.logger = new Logger(root);
    if (!$$(root).find('.coveo-facet-column')) {
      this.logger.info(this.FACETS_NOT_FOUND);
      return;
    }
    ResponsiveComponentsManager.register(ResponsiveFacets, $$(root), ID);
  }

  constructor(root: Dom, ID: string) {
    this.ID = ID;
    this.coveoRoot = root;
    this.tabSection = $$(this.coveoRoot.find('.coveo-tab-section'));
    this.facetsColumn = $$(this.coveoRoot.find('.coveo-facet-column'));
    this.buildDropdownHeader();
    this.bindDropdownHeaderEvents();
    this.bindDropdownContentEvents();
    this.buildPopupBackground();
    this.saveFacetsPosition();
  }

  public needSmallMode(): boolean {
    return this.coveoRoot.width() <= ResponsiveFacets.ROOT_MIN_WIDTH;
  }

  public changeToSmallMode() {
    this.tabSection.el.appendChild(this.dropdownHeaderContainer.el);
    this.facetsColumn.detach();
  }

  public changeToLargeMode() {
    this.dropdownHeaderContainer.detach();
    this.facetsColumn.el.removeAttribute('style');
    this.detachDropdown();
    this.restoreFacetsPosition();
  }

  private buildDropdownHeader() {
    this.dropdownHeaderContainer = $$('div', { className: 'coveo-facet-dropdown-header-container' });
    this.dropdownHeader = $$('a', { className: 'coveo-dropdown-header coveo-facet-dropdown-header' });
    let content = $$('p');
    content.text(l('facets'));
    this.dropdownHeader.el.appendChild(content.el);
    this.dropdownHeaderContainer.el.appendChild(this.dropdownHeader.el);
  }

  private bindDropdownHeaderEvents() {
    this.dropdownHeader.on('click', () => {
      if (!this.dropdownHeader.hasClass('coveo-dropdown-header-active')) {
        this.positionPopup();
      } else {
        this.detachDropdown();
      }
    });
  }

  private bindDropdownContentEvents() {
    this.documentClickListener = event => {
      let eventTarget = $$(<HTMLElement>event.target);
      if (this.shouldDetachFacetDropdown(eventTarget)) {
        this.detachDropdown();
      }
    };
    $$(document.documentElement).on('click', this.documentClickListener);
  }

  private buildPopupBackground() {
    this.popupBackground = $$('div', { className: 'coveo-facet-dropdown-background' });
  }

  private shouldDetachFacetDropdown(eventTarget: Dom) {
    return !eventTarget.closest('coveo-facet-column') && !eventTarget.closest('coveo-facet-dropdown-header-container')
      && this.coveoRoot.hasClass('coveo-small-search-interface') && !eventTarget.closest('coveo-facet-settings-popup');
  }

  private saveFacetsPosition() {
    this.previousSibling = this.facetsColumn.el.previousSibling ? $$(<HTMLElement>this.facetsColumn.el.previousSibling) : null;
    this.parent = $$(this.facetsColumn.el.parentElement);
  }

  private restoreFacetsPosition() {
    if (this.previousSibling) {
      this.facetsColumn.insertAfter(this.previousSibling.el);
    } else {
      this.parent.prepend(this.facetsColumn.el);
    }
  }

  private positionPopup() {
    this.facetsColumn.addClass('coveo-facet-dropdown-content');
    this.dropdownHeader.addClass('coveo-dropdown-header-active');
    document.documentElement.appendChild(this.popupBackground.el);
    window.getComputedStyle(this.popupBackground.el).opacity;
    this.popupBackground.el.style.opacity = '1';
    PopupUtils.positionPopup(this.facetsColumn.el, this.tabSection.el, this.coveoRoot.el, this.coveoRoot.el,
      { horizontal: HorizontalAlignment.INNERRIGHT, vertical: VerticalAlignment.BOTTOM });
  }

  private detachDropdown() {
    this.popupBackground.el.style.opacity = '0';
    window.getComputedStyle(this.popupBackground.el).opacity;
    this.popupBackground.detach();
    this.facetsColumn.detach();
    this.facetsColumn.removeClass('coveo-facet-dropdown-content');
    this.dropdownHeader.removeClass('coveo-dropdown-header-active');
  }
  private nuke() {

  }
}
