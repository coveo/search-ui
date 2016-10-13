import {$$, Dom} from '../../utils/Dom';
import {InitializationEvents} from '../../events/InitializationEvents';
import {IResponsiveComponent, ResponsiveComponentsManager, IResponsiveComponentOptions} from './ResponsiveComponentsManager';
import {ResponsiveComponentsUtils} from './ResponsiveComponentsUtils';
import {EventsUtils} from '../../utils/EventsUtils';
import {Component} from '../Base/Component';
import {Logger} from '../../misc/Logger';
import {l} from '../../strings/Strings';
import {PopupUtils, HorizontalAlignment, VerticalAlignment} from '../../utils/PopupUtils';
import {Utils} from '../../utils/Utils';
import {Facet} from '../Facet/Facet';
import {FacetSlider} from '../FacetSlider/FacetSlider';

export class ResponsiveFacets implements IResponsiveComponent {

  private static ACTIVE_FACET_HEADER_Z_INDEX = '20';
  private static FACET_DROPDOWN_MIN_WIDTH: number = 280;
  private static FACET_DROPDOWN_WIDTH_RATIO: number = 0.35; // Used to set the width relative to the coveo root.
  private static TRANSPARENT_BACKGROUND_OPACITY: string = '0.9';
  private static DEBOUNCE_SCROLL_WAIT = 250;
  private static RESPONSIVE_BREAKPOINT: number = 800;

  private dropdownContent: Dom;
  private previousSibling: Dom;
  private parent: Dom;
  private dropdownHeader: Dom;
  private popupBackground: Dom;
  private popupBackgroundClickListener: EventListener;
  private facets: Facet[] = [];
  private facetSliders: FacetSlider[] = [];
  private breakpoint: number;
  private logger: Logger;

  public static init(root: HTMLElement, component, options: IResponsiveComponentOptions) {
    if (!$$(root).find('.coveo-facet-column')) {
      let logger = new Logger('ResponsiveFacets');
      logger.info('No element with class coveo-facet-column. Responsive facets cannot be enabled');
      return;
    }
    ResponsiveComponentsManager.register(ResponsiveFacets, $$(root), Facet.ID, component, options);
  }

  constructor(public coveoRoot: Dom, public ID: string, options: IResponsiveComponentOptions) {
    this.buildDropdownContent();
    this.buildDropdownHeader();
    this.bindDropdownContentEvents();
    this.bindDropdownHeaderEvents();
    this.buildPopupBackground();
    this.saveFacetsPosition();
    this.bindNukeEvents();
    this.logger = new Logger(this);

    if (Utils.isNullOrUndefined(options.responsiveBreakpoint)) {
      this.breakpoint = ResponsiveFacets.RESPONSIVE_BREAKPOINT;
    } else {
      this.breakpoint = options.responsiveBreakpoint;
    }
  }

  public needSmallMode(): boolean {
    return this.coveoRoot.width() <= this.breakpoint;
  }

  private changeToSmallMode() {
    if (!$$(this.coveoRoot).find('.coveo-tab-section')) {
      this.logger.info('No element with class coveo-tab-section. Responsive facets cannot be enabled');
      return;
    }
    this.positionPopup();
    this.closeDropdown();
    this.disableFacetPreservePosition();
    $$(this.coveoRoot.find('.coveo-tab-section')).el.appendChild(this.dropdownHeader.el);
    this.dropdownContent.el.style.display = 'none';
    ResponsiveComponentsUtils.activateSmallFacet(this.coveoRoot);
  }

  private changeToLargeMode() {
    this.enableFacetPreservePosition();
    this.cleanUpDropdown();
    this.dropdownContent.el.removeAttribute('style');
    this.restoreFacetsPosition();
    ResponsiveComponentsUtils.deactivateSmallFacet(this.coveoRoot);
  }

  public registerComponent(component: Component) {
    if (component instanceof Facet) {
      this.facets.push(<Facet>component);
    } else if (component instanceof FacetSlider) {
      this.facetSliders.push(<FacetSlider>component);
    }
  }

  public needTabSection() {
    return this.needSmallMode();
  }

  public handleResizeEvent() {
    if (this.needSmallMode() && !ResponsiveComponentsUtils.isSmallFacetActivated(this.coveoRoot)) {
      this.changeToSmallMode();
    } else if (!this.needSmallMode() && ResponsiveComponentsUtils.isSmallFacetActivated(this.coveoRoot)) {
      this.changeToLargeMode();
    }
    if (this.dropdownHeader.hasClass('coveo-dropdown-header-active')) {
      this.openDropdown();
    }
  }

  private triggerFacetSliderDraw() {
    _.each(this.facetSliders, facetSlider => facetSlider.drawDelayedGraphData());
  }

  private buildDropdownContent() {
    this.dropdownContent = $$(this.coveoRoot.find('.coveo-facet-column'));
    let filterByContainer = $$('div', { className: 'coveo-facet-header-filter-by-container', style: 'display: none' });
    let filterBy = $$('div', { className: 'coveo-facet-header-filter-by' });
    filterBy.text(l('Filter by:'));
    filterByContainer.append(filterBy.el);
    this.dropdownContent.prepend(filterByContainer.el);
  }

  private buildDropdownHeader() {
    this.dropdownHeader = $$('a', { className: 'coveo-dropdown-header coveo-facet-dropdown-header' });
    let content = $$('p');
    content.text(l('Facets'));
    this.dropdownHeader.el.appendChild(content.el);
  }

  private bindDropdownHeaderEvents() {
    this.dropdownHeader.on('click', () => {
      if (!this.dropdownHeader.hasClass('coveo-dropdown-header-active')) {
        this.openDropdown();
        this.drawFacetSliderGraphs();
      } else {
        this.closeDropdown();
      }
    });
  }

  private bindDropdownContentEvents() {
    this.dropdownContent.on('scroll', _.debounce(() => {
      _.each(this.facets, facet => {
        let facetSearch = facet.facetSearch;
        if (facetSearch && facetSearch.currentlyDisplayedResults && !this.isFacetSearchScrolledIntoView(facetSearch.search)) {
          facet.facetSearch.positionSearchResults(this.dropdownContent.el);
        } else if (facetSearch && facet.facetSearch.currentlyDisplayedResults) {
          facet.facetSearch.positionSearchResults();
        }
      });
    }, ResponsiveFacets.DEBOUNCE_SCROLL_WAIT));
  }

  private buildPopupBackground() {
    this.popupBackground = $$('div', { className: 'coveo-facet-dropdown-background' });
    EventsUtils.addPrefixedEvent(this.popupBackground.el, 'TransitionEnd', () => {
      if (this.popupBackground.el.style.opacity == '0') {
        this.popupBackground.detach();
      }
    });
    this.popupBackground.on('click', () => this.closeDropdown());
  }

  private saveFacetsPosition() {
    this.previousSibling = this.dropdownContent.el.previousSibling ? $$(<HTMLElement>this.dropdownContent.el.previousSibling) : null;
    this.parent = $$(this.dropdownContent.el.parentElement);
  }

  private restoreFacetsPosition() {
    if (this.previousSibling) {
      this.dropdownContent.insertAfter(this.previousSibling.el);
    } else {
      this.parent.prepend(this.dropdownContent.el);
    }
  }

  private openDropdown() {
    this.positionPopup();
    document.documentElement.appendChild(this.popupBackground.el);
    this.coveoRoot.el.appendChild(this.popupBackground.el);
    window.getComputedStyle(this.popupBackground.el).opacity;
    this.popupBackground.el.style.opacity = ResponsiveFacets.TRANSPARENT_BACKGROUND_OPACITY;
    this.triggerFacetSliderDraw();
  }

  private positionPopup() {
    this.dropdownHeader.el.style.zIndex = ResponsiveFacets.ACTIVE_FACET_HEADER_Z_INDEX;

    this.dropdownContent.addClass('coveo-facet-dropdown-content');
    this.dropdownHeader.addClass('coveo-dropdown-header-active');
    this.dropdownContent.el.style.display = '';
    let width = ResponsiveFacets.FACET_DROPDOWN_WIDTH_RATIO * this.coveoRoot.el.offsetWidth;
    if (width <= ResponsiveFacets.FACET_DROPDOWN_MIN_WIDTH) {
      width = ResponsiveFacets.FACET_DROPDOWN_MIN_WIDTH;
    }
    this.dropdownContent.el.style.width = width.toString() + 'px';

    PopupUtils.positionPopup(this.dropdownContent.el, $$(this.coveoRoot.find('.coveo-tab-section')).el, this.coveoRoot.el,
      { horizontal: HorizontalAlignment.INNERRIGHT, vertical: VerticalAlignment.BOTTOM }, this.coveoRoot.el);
  }

  private closeDropdown() {
    // Because of DOM manipulation, sometimes the animation will not trigger. Accessing the computed styles makes sure
    // the animation will happen. Adding this here because its possible that this element has recently been manipulated.
    window.getComputedStyle(this.popupBackground.el).opacity;
    this.popupBackground.el.style.opacity = '0';
    this.dropdownHeader.el.style.zIndex = '';
    this.dropdownContent.el.style.display = 'none';
    this.dropdownContent.removeClass('coveo-facet-dropdown-content');
    this.dropdownHeader.removeClass('coveo-dropdown-header-active');
    this.dismissFacetSearches();
  }

  private dismissFacetSearches() {
    _.each(this.facets, facet => {
      if (facet.facetSearch && facet.facetSearch.currentlyDisplayedResults) {
        facet.facetSearch.completelyDismissSearch();
      }
    });
  }

  private cleanUpDropdown() {
    this.closeDropdown();
    this.dropdownHeader.detach();
    this.dropdownHeader.el.style.zIndex = '';
  }

  private enableFacetPreservePosition() {
    _.each(this.facets, facet => facet.options.preservePosition = true);
  }

  private disableFacetPreservePosition() {
    _.each(this.facets, facet => facet.options.preservePosition = false);
  }

  private bindNukeEvents() {
    $$(this.coveoRoot).on(InitializationEvents.nuke, () => {
      $$(document.documentElement).off('click', this.popupBackgroundClickListener);
    });
  }

  private drawFacetSliderGraphs() {
    _.each(this.facetSliders, facetSlider => facetSlider.drawDelayedGraphData());
  }

  private isFacetSearchScrolledIntoView(facetSearchElement: HTMLElement) {
    let facetTop = facetSearchElement.getBoundingClientRect().top;
    let facetBottom = facetSearchElement.getBoundingClientRect().bottom;
    let dropdownTop = this.dropdownContent.el.getBoundingClientRect().top;
    let dropdownBottom = this.dropdownContent.el.getBoundingClientRect().bottom;

    dropdownTop = dropdownTop >= 0 ? dropdownTop : 0;

    return (facetTop >= dropdownTop) && (facetBottom <= dropdownBottom);
  }
}
