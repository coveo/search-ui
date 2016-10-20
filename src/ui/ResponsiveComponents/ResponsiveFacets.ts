import {$$, Dom} from '../../utils/Dom';
import {IResponsiveComponent, ResponsiveComponentsManager, IResponsiveComponentOptions} from './ResponsiveComponentsManager';
import {ResponsiveComponentsUtils} from './ResponsiveComponentsUtils';
import {Component} from '../Base/Component';
import {Logger} from '../../misc/Logger';
import {l} from '../../strings/Strings';
import {Utils} from '../../utils/Utils';
import {Facet} from '../Facet/Facet';
import {FacetSlider} from '../FacetSlider/FacetSlider';
import {ResponsiveDropdown} from './ResponsiveDropdown/ResponsiveDropdown';
import {ResponsiveDropdownContent} from './ResponsiveDropdown/ResponsiveDropdownContent';
import {ResponsiveDropdownHeader} from './ResponsiveDropdown/ResponsiveDropdownHeader';

export class ResponsiveFacets implements IResponsiveComponent {

  private static DROPDOWN_MIN_WIDTH: number = 280;
  private static DROPDOWN_WIDTH_RATIO: number = 0.35; // Used to set the width relative to the coveo root.

  private static DEBOUNCE_SCROLL_WAIT = 250;
  private static RESPONSIVE_BREAKPOINT: number = 800;

  private previousSibling: Dom;
  private parent: Dom;
  private facets: Facet[] = [];
  private facetSliders: FacetSlider[] = [];
  private breakpoint: number;
  private logger: Logger;
  private dropdown: ResponsiveDropdown;

  public static init(root: HTMLElement, component, options: IResponsiveComponentOptions) {
    if (!$$(root).find('.coveo-facet-column')) {
      let logger = new Logger('ResponsiveFacets');
      logger.info('No element with class coveo-facet-column. Responsive facets cannot be enabled');
      return;
    }
    ResponsiveComponentsManager.register(ResponsiveFacets, $$(root), Facet.ID, component, options);
  }

  constructor(public coveoRoot: Dom, public ID: string, options: IResponsiveComponentOptions) {
    this.dropdown = this.buildDropdown();
    this.bindDropdownContentEvents();
    this.registerOnOpenHandler();
    this.registerOnCloseHandler();
    this.saveFacetsPosition();
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
    this.dropdown.dropdownContent.positionDropdown();
    this.dropdown.close();
    this.disableFacetPreservePosition();
    $$(this.coveoRoot.find('.coveo-dropdown-header-wrapper')).el.appendChild(this.dropdown.dropdownHeader.element.el);
    ResponsiveComponentsUtils.activateSmallFacet(this.coveoRoot);
  }

  private changeToLargeMode() {
    this.enableFacetPreservePosition();
    this.dropdown.cleanUp();
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

  public needDropdownWrapper() {
    return this.needSmallMode();
  }

  public handleResizeEvent() {
    if (this.needSmallMode() && !ResponsiveComponentsUtils.isSmallFacetActivated(this.coveoRoot)) {
      this.changeToSmallMode();
    } else if (!this.needSmallMode() && ResponsiveComponentsUtils.isSmallFacetActivated(this.coveoRoot)) {
      this.changeToLargeMode();
    }

    if (this.dropdown.isOpened) {
      this.dropdown.dropdownContent.positionDropdown();
    }
  }

  private buildDropdown() {
    let dropdownContent = this.buildDropdownContent();
    let dropdownHeader = this.buildDropdownHeader();
    let dropdown = new ResponsiveDropdown(dropdownContent, dropdownHeader, this.coveoRoot);
    return dropdown;
  }

  private buildDropdownContent(): ResponsiveDropdownContent {
    let dropdownContentElement = $$(this.coveoRoot.find('.coveo-facet-column'));
    let filterByContainer = $$('div', { className: 'coveo-facet-header-filter-by-container', style: 'display: none' });
    let filterBy = $$('div', { className: 'coveo-facet-header-filter-by' });
    filterBy.text(l('Filter by:'));
    filterByContainer.append(filterBy.el);
    dropdownContentElement.prepend(filterByContainer.el);

    let dropdownContent = new ResponsiveDropdownContent('facet', dropdownContentElement, this.coveoRoot, ResponsiveFacets.DROPDOWN_MIN_WIDTH, ResponsiveFacets.DROPDOWN_WIDTH_RATIO);
    return dropdownContent;
  }

  private buildDropdownHeader(): ResponsiveDropdownHeader {
    let dropdownHeaderElement = $$('a');
    let content = $$('p');
    content.text(l('Filters'));
    dropdownHeaderElement.el.appendChild(content.el);
    
    let dropdownHeader = new ResponsiveDropdownHeader('facet', dropdownHeaderElement);
    return dropdownHeader;
  }

  private registerOnOpenHandler() {
    this.dropdown.registerOnOpenHandler(() => {
      this.drawFacetSliderGraphs();
    });
  }

  private registerOnCloseHandler() {
    this.dropdown.registerOnCloseHandler(() => {
      this.dismissFacetSearches();
    });
  }

  private bindDropdownContentEvents() {
    this.dropdown.dropdownContent.element.on('scroll', _.debounce(() => {
      _.each(this.facets, facet => {
        let facetSearch = facet.facetSearch;
        if (facetSearch && facetSearch.currentlyDisplayedResults && !this.isFacetSearchScrolledIntoView(facetSearch.search)) {
          facet.facetSearch.positionSearchResults(this.dropdown.dropdownContent.element.el);
        } else if (facetSearch && facet.facetSearch.currentlyDisplayedResults) {
          facet.facetSearch.positionSearchResults();
        }
      });
    }, ResponsiveFacets.DEBOUNCE_SCROLL_WAIT));
  }

  private saveFacetsPosition() {
    let dropdownContentPreviousSibling = this.dropdown.dropdownContent.element.el.previousSibling;
    let dropdownContentParent = this.dropdown.dropdownContent.element.el.parentElement;
    this.previousSibling = dropdownContentPreviousSibling ? $$(<HTMLElement>dropdownContentPreviousSibling) : null;
    this.parent = $$(dropdownContentParent);
  }

  private restoreFacetsPosition() {
    if (this.previousSibling) {
      this.dropdown.dropdownContent.element.insertAfter(this.previousSibling.el);
    } else {
      this.parent.prepend(this.dropdown.dropdownContent.element.el);
    }
  }

  private dismissFacetSearches() {
    _.each(this.facets, facet => {
      if (facet.facetSearch && facet.facetSearch.currentlyDisplayedResults) {
        facet.facetSearch.completelyDismissSearch();
      }
    });
  }

  private enableFacetPreservePosition() {
    _.each(this.facets, facet => facet.options.preservePosition = true);
  }

  private disableFacetPreservePosition() {
    _.each(this.facets, facet => facet.options.preservePosition = false);
  }

  private drawFacetSliderGraphs() {
    _.each(this.facetSliders, facetSlider => facetSlider.drawDelayedGraphData());
  }

  private isFacetSearchScrolledIntoView(facetSearchElement: HTMLElement) {
    let facetTop = facetSearchElement.getBoundingClientRect().top;
    let facetBottom = facetSearchElement.getBoundingClientRect().bottom;
    let dropdownTop = this.dropdown.dropdownContent.element.el.getBoundingClientRect().top;
    let dropdownBottom = this.dropdown.dropdownContent.element.el.getBoundingClientRect().bottom;

    dropdownTop = dropdownTop >= 0 ? dropdownTop : 0;

    return (facetTop >= dropdownTop) && (facetBottom <= dropdownBottom);
  }
}
