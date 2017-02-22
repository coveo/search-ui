import { $$, Dom } from '../../utils/Dom';
import { IResponsiveComponent, ResponsiveComponentsManager, IResponsiveComponentOptions } from './ResponsiveComponentsManager';
import { ResponsiveComponentsUtils } from './ResponsiveComponentsUtils';
import { Component } from '../Base/Component';
import { Logger } from '../../misc/Logger';
import { l } from '../../strings/Strings';
import { Utils } from '../../utils/Utils';
import { Facet } from '../Facet/Facet';
import { FacetSlider } from '../FacetSlider/FacetSlider';
import { ResponsiveDropdown } from './ResponsiveDropdown/ResponsiveDropdown';
import { ResponsiveDropdownContent } from './ResponsiveDropdown/ResponsiveDropdownContent';
import { ResponsiveDropdownHeader } from './ResponsiveDropdown/ResponsiveDropdownHeader';
import { QueryEvents, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { ResponsiveComponents } from './ResponsiveComponents';
import _ = require('underscore');

export class ResponsiveFacets implements IResponsiveComponent {
  public static DEBOUNCE_SCROLL_WAIT = 250;

  private static DROPDOWN_MIN_WIDTH: number = 280;
  private static DROPDOWN_WIDTH_RATIO: number = 0.35; // Used to set the width relative to the coveo root.
  private static DROPDOWN_HEADER_LABEL_DEFAULT_VALUE = 'Filters';
  private searchInterface: SearchInterface;
  private facets: Facet[] = [];
  private facetSliders: FacetSlider[] = [];
  private preservePositionOriginalValues: boolean[] = [];
  private breakpoint: number;
  private logger: Logger;
  private dropdown: ResponsiveDropdown;
  private dropdownHeaderLabel: string;

  public static init(root: HTMLElement, component, options: IResponsiveComponentOptions) {
    if (!$$(root).find('.coveo-facet-column')) {
      let logger = new Logger('ResponsiveFacets');
      logger.info('No element with class coveo-facet-column. Responsive facets cannot be enabled');
      return;
    }
    ResponsiveComponentsManager.register(ResponsiveFacets, $$(root), Facet.ID, component, options);
  }

  constructor(public coveoRoot: Dom, public ID: string, options: IResponsiveComponentOptions, responsiveDropdown?: ResponsiveDropdown) {
    this.dropdownHeaderLabel = this.getDropdownHeaderLabel();
    this.dropdown = this.buildDropdown(responsiveDropdown);
    this.searchInterface = <SearchInterface>Component.get(this.coveoRoot.el, SearchInterface, false);
    this.bindDropdownContentEvents();
    this.registerOnOpenHandler();
    this.registerOnCloseHandler();
    this.registerQueryEvents();
    this.logger = new Logger(this);
    if (Utils.isNullOrUndefined(options.responsiveBreakpoint)) {
      this.breakpoint = this.searchInterface ? this.searchInterface.responsiveComponents.getMediumScreenWidth() : new ResponsiveComponents().getMediumScreenWidth();
    } else {
      this.breakpoint = options.responsiveBreakpoint;
    }
  }

  public registerComponent(accept: Component) {
    if (accept instanceof Facet) {
      this.facets.push(<Facet>accept);
      this.preservePositionOriginalValues.push((<Facet>accept).options.preservePosition);
      return true;
    } else if (accept instanceof FacetSlider) {
      this.facetSliders.push(<FacetSlider>accept);
      return false;
    }
    return false;
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

  public dismissFacetSearches() {
    _.each(this.facets, facet => {
      if (facet.facetSearch && facet.facetSearch.currentlyDisplayedResults) {
        facet.facetSearch.completelyDismissSearch();
      }
    });
  }

  public drawFacetSliderGraphs() {
    _.each(this.facetSliders, facetSlider => facetSlider.drawDelayedGraphData());
  }

  private needSmallMode(): boolean {
    return this.coveoRoot.width() <= this.breakpoint;
  }

  private changeToSmallMode() {
    this.dropdown.close();
    this.disableFacetPreservePosition();
    $$(this.coveoRoot.find(`.${ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS}`)).append(this.dropdown.dropdownHeader.element.el);
    ResponsiveComponentsUtils.activateSmallFacet(this.coveoRoot);
  }

  private changeToLargeMode() {
    this.restoreFacetPreservePositionValue();
    this.dropdown.cleanUp();
    ResponsiveComponentsUtils.deactivateSmallFacet(this.coveoRoot);
  }

  private buildDropdown(responsiveDropdown?: ResponsiveDropdown) {
    let dropdownContent = this.buildDropdownContent();
    let dropdownHeader = this.buildDropdownHeader();
    let dropdown = responsiveDropdown ? responsiveDropdown : new ResponsiveDropdown(dropdownContent, dropdownHeader, this.coveoRoot);
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
    content.text(this.dropdownHeaderLabel);
    dropdownHeaderElement.el.appendChild(content.el);
    let dropdownHeader = new ResponsiveDropdownHeader('facet', dropdownHeaderElement);
    return dropdownHeader;
  }

  private registerOnOpenHandler() {
    this.dropdown.registerOnOpenHandler(this.drawFacetSliderGraphs, this);
  }

  private registerOnCloseHandler() {
    this.dropdown.registerOnCloseHandler(this.dismissFacetSearches, this);
  }

  private registerQueryEvents() {
    this.coveoRoot.on(QueryEvents.noResults, () => this.handleNoResults());
    this.coveoRoot.on(QueryEvents.querySuccess, (e: Event, data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data));
    this.coveoRoot.on(QueryEvents.queryError, () => this.handleQueryError());
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

  private restoreFacetPreservePositionValue() {
    _.each(this.facets, (facet, index) => facet.options.preservePosition = this.preservePositionOriginalValues[index]);
  }

  private disableFacetPreservePosition() {
    _.each(this.facets, facet => facet.options.preservePosition = false);
  }

  private isFacetSearchScrolledIntoView(facetSearchElement: HTMLElement) {
    let facetTop = facetSearchElement.getBoundingClientRect().top;
    let facetBottom = facetSearchElement.getBoundingClientRect().bottom;
    let dropdownTop = this.dropdown.dropdownContent.element.el.getBoundingClientRect().top;
    let dropdownBottom = this.dropdown.dropdownContent.element.el.getBoundingClientRect().bottom;

    dropdownTop = dropdownTop >= 0 ? dropdownTop : 0;

    return (facetTop >= dropdownTop) && (facetBottom <= dropdownBottom);
  }

  private getDropdownHeaderLabel() {
    let dropdownHeaderLabel: string;
    let selector = `.${Component.computeCssClassName(Facet)}, .${Component.computeCssClassName(FacetSlider)}`;
    _.each($$(this.coveoRoot.find('.coveo-facet-column')).findAll(selector), facetElement => {
      let facet: Facet | FacetSlider;
      if ($$(facetElement).hasClass(Component.computeCssClassName(Facet))) {
        facet = <Facet>Component.get(facetElement, Facet);
      } else {
        facet = <FacetSlider>Component.get(facetElement, FacetSlider);
      }
      if (!dropdownHeaderLabel && facet.options.dropdownHeaderLabel) {
        dropdownHeaderLabel = facet.options.dropdownHeaderLabel;
      }
    });

    if (!dropdownHeaderLabel) {
      dropdownHeaderLabel = l(ResponsiveFacets.DROPDOWN_HEADER_LABEL_DEFAULT_VALUE);
    }

    return dropdownHeaderLabel;
  }

  private handleNoResults() {
    this.dropdown.dropdownHeader.hide();
  }

  private handleQueryError() {
    this.dropdown.dropdownHeader.hide();
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    if (data.results.totalCount === 0) {
      this.dropdown.dropdownHeader.hide();
    } else {
      this.dropdown.dropdownHeader.show();
    }
  }
}
