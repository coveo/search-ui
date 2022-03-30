import 'styling/_ResponsiveFacets';
import { IQuerySuccessEventArgs, QueryEvents } from '../../events/QueryEvents';
import { Logger } from '../../misc/Logger';
import { l } from '../../strings/Strings';
import { $$, Dom } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { Component } from '../Base/Component';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { ResponsiveComponents } from './ResponsiveComponents';
import { IResponsiveComponent, IResponsiveComponentOptions, ResponsiveComponentsManager } from './ResponsiveComponentsManager';
import { ResponsiveComponentsUtils } from './ResponsiveComponentsUtils';
import { ResponsiveDropdown } from './ResponsiveDropdown/ResponsiveDropdown';
import { ResponsiveDropdownContent, IResponsiveDropdownContent } from './ResponsiveDropdown/ResponsiveDropdownContent';
import { ResponsiveDropdownHeader } from './ResponsiveDropdown/ResponsiveDropdownHeader';
import { each, debounce } from 'underscore';
import { ComponentsTypes } from '../../utils/ComponentsTypes';
import { ResponsiveDropdownModalContent } from './ResponsiveDropdown/ResponsiveDropdownModalContent';
import { FacetsMobileMode, IFacetsMobileModeOptions } from '../FacetsMobileMode/FacetsMobileMode';
import { FacetsMobileModeEvents } from '../../events/FacetsMobileModeEvents';

export class ResponsiveFacetColumn implements IResponsiveComponent {
  public static DEBOUNCE_SCROLL_WAIT = 250;

  private static logger = new Logger('ResponsiveFacets');
  private static DROPDOWN_MIN_WIDTH: number = 280;
  private static DROPDOWN_WIDTH_RATIO: number = 0.35; // Used to set the width relative to the coveo root.
  private static DROPDOWN_HEADER_LABEL_DEFAULT_VALUE = 'Filters';

  private searchInterface: SearchInterface;
  private componentsInFacetColumn: any[] = [];
  private preservePositionOriginalValues: boolean[] = [];
  private breakpoint: number;
  protected dropdown: ResponsiveDropdown;
  private dropdownHeaderLabel: string;

  public static init(responsiveComponentConstructor, root: HTMLElement, component, options: IResponsiveComponentOptions, ID: string) {
    const column = this.findColumn(root);
    if (!column) {
      return;
    }

    ResponsiveComponentsManager.register(ResponsiveFacetColumn, $$(root), 'ResponsiveFacetColumn', component, options);
    ResponsiveComponentsManager.register(responsiveComponentConstructor, $$(root), ID, component, options);
  }

  private static findColumn(root: HTMLElement) {
    const column = $$(root).find('.coveo-facet-column');
    if (!column) {
      this.logger.info('No element with class coveo-facet-column. Responsive facets cannot be enabled');
    }
    return column;
  }

  constructor(public coveoRoot: Dom, public ID: string, options: IResponsiveComponentOptions, responsiveDropdown?: ResponsiveDropdown) {
    this.searchInterface = <SearchInterface>Component.get(this.coveoRoot.el, SearchInterface, false);
    this.dropdownHeaderLabel = this.getDropdownHeaderLabel();
    this.dropdown = this.buildDropdown(responsiveDropdown);
    this.bindDropdownContentEvents();
    this.bindFacetsMobileModeEvents();
    this.registerOnCloseHandler();
    this.registerQueryEvents();
    this.initializeBreakpoint(options.responsiveBreakpoint);
  }

  private get facetsMobileModeComponent() {
    return this.searchInterface ? this.searchInterface.getComponents<FacetsMobileMode>(FacetsMobileMode.ID)[0] : null;
  }

  private get facetsMobileModeOptions(): IFacetsMobileModeOptions {
    const facetsMobileModeComponent = this.facetsMobileModeComponent;
    if (!facetsMobileModeComponent) {
      ResponsiveFacetColumn.logger.warn('The "FacetsMobileMode" component did not load properly, disabling the ResponsiveFacets modal.');
      return {
        isModal: false,
        preventScrolling: false,
        displayOverlayWhileOpen: true
      };
    }

    return facetsMobileModeComponent.options;
  }

  public registerComponent(accept: Component) {
    this.componentsInFacetColumn.push(accept);
    this.preservePositionOriginalValues.push(accept.options.preservePosition);
    return true;
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
    each(this.componentsInFacetColumn, component => {
      if (component.facetSearch && component.facetSearch.currentlyDisplayedResults) {
        component.facetSearch.dismissSearchResults();
      }
    });
  }

  private needSmallMode(): boolean {
    if (!this.searchInterface) {
      return (
        this.coveoRoot.width() <=
        (Utils.isNullOrUndefined(this.breakpoint) ? new ResponsiveComponents().getMediumScreenWidth() : this.breakpoint)
      );
    }
    switch (this.searchInterface.responsiveComponents.getResponsiveMode()) {
      case 'small':
      case 'medium':
        return true;
      case 'auto':
        return (
          this.coveoRoot.width() <=
          (Utils.isNullOrUndefined(this.breakpoint) ? this.searchInterface.responsiveComponents.getMediumScreenWidth() : this.breakpoint)
        );
      default:
        return false;
    }
  }

  private changeToSmallMode() {
    this.dropdown.close();
    this.disableFacetPreservePosition();
    $$(this.coveoRoot.find(`.${ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS}`)).append(
      this.dropdown.dropdownHeader.element.el
    );
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
    if (!this.facetsMobileModeOptions.displayOverlayWhileOpen) {
      dropdown.disablePopupBackground();
    }
    if (this.facetsMobileModeOptions.preventScrolling) {
      dropdown.enableScrollLocking(this.facetsMobileModeOptions.scrollContainer);
    }
    return dropdown;
  }

  private buildDropdownContent(): IResponsiveDropdownContent {
    let dropdownContentElement = $$(this.coveoRoot.find('.coveo-facet-column'));
    let filterByContainer = $$('div', { className: 'coveo-facet-header-filter-by-container', style: 'display: none' });
    let filterBy = $$('div', { className: 'coveo-facet-header-filter-by' });
    filterBy.text(l('Filter by:'));
    filterByContainer.append(filterBy.el);
    dropdownContentElement.prepend(filterByContainer.el);
    if (this.facetsMobileModeOptions.isModal) {
      return new ResponsiveDropdownModalContent('facet', dropdownContentElement, l('CloseFiltersDropdown'), () => this.dropdown.close());
    }
    return new ResponsiveDropdownContent(
      'facet',
      dropdownContentElement,
      this.coveoRoot,
      ResponsiveFacetColumn.DROPDOWN_MIN_WIDTH,
      ResponsiveFacetColumn.DROPDOWN_WIDTH_RATIO
    );
  }

  private buildDropdownHeader() {
    let dropdownHeaderElement = $$('a');
    let content = $$('p');
    content.text(this.dropdownHeaderLabel);
    dropdownHeaderElement.el.appendChild(content.el);
    let dropdownHeader = new ResponsiveDropdownHeader('facet', dropdownHeaderElement);
    return dropdownHeader;
  }

  private initializeBreakpoint(defaultBreakpoint: number) {
    const facetsMobileModeBreakpoint = this.facetsMobileModeOptions.breakpoint;
    this.breakpoint = Utils.isNullOrUndefined(facetsMobileModeBreakpoint) ? defaultBreakpoint : facetsMobileModeBreakpoint;
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
    this.dropdown.dropdownContent.element.on(
      'scroll',
      debounce(() => {
        each(this.componentsInFacetColumn, component => {
          let facetSearch = component.facetSearch;
          if (facetSearch && facetSearch.currentlyDisplayedResults && !this.isFacetSearchScrolledIntoView(facetSearch.search)) {
            component.facetSearch.positionSearchResults(this.dropdown.dropdownContent.element.el);
          } else if (facetSearch && component.facetSearch.currentlyDisplayedResults) {
            component.facetSearch.positionSearchResults();
          }
        });
      }, ResponsiveFacetColumn.DEBOUNCE_SCROLL_WAIT)
    );
  }

  private bindFacetsMobileModeEvents() {
    const facetsMobileModeComponent = this.facetsMobileModeComponent;
    if (facetsMobileModeComponent) {
      this.dropdown.registerOnOpenHandler(
        () => $$(facetsMobileModeComponent.element).trigger(FacetsMobileModeEvents.popupOpened),
        facetsMobileModeComponent
      );
      this.dropdown.registerOnCloseHandler(
        () => $$(facetsMobileModeComponent.element).trigger(FacetsMobileModeEvents.popupClosed),
        facetsMobileModeComponent
      );
    }
  }

  private restoreFacetPreservePositionValue() {
    each(this.componentsInFacetColumn, (component, index) => {
      if (component.options) {
        component.options.preservePosition = this.preservePositionOriginalValues[index];
      }
    });
  }

  private disableFacetPreservePosition() {
    each(this.componentsInFacetColumn, component => {
      if (component.options) {
        component.options.preservePosition = false;
      }
    });
  }

  private isFacetSearchScrolledIntoView(facetSearchElement: HTMLElement) {
    let facetTop = facetSearchElement.getBoundingClientRect().top;
    let facetBottom = facetSearchElement.getBoundingClientRect().bottom;
    let dropdownTop = this.dropdown.dropdownContent.element.el.getBoundingClientRect().top;
    let dropdownBottom = this.dropdown.dropdownContent.element.el.getBoundingClientRect().bottom;

    dropdownTop = dropdownTop >= 0 ? dropdownTop : 0;

    return facetTop >= dropdownTop && facetBottom <= dropdownBottom;
  }

  private getDropdownHeaderLabel() {
    let dropdownHeaderLabel: string;
    ComponentsTypes.getAllFacetInstancesFromElement(this.coveoRoot.find('.coveo-facet-column')).forEach(facet => {
      const options = facet.options as IResponsiveComponentOptions;

      if (!dropdownHeaderLabel && options.dropdownHeaderLabel) {
        dropdownHeaderLabel = options.dropdownHeaderLabel;
      }
    });

    if (!dropdownHeaderLabel) {
      dropdownHeaderLabel = l(ResponsiveFacetColumn.DROPDOWN_HEADER_LABEL_DEFAULT_VALUE);
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
