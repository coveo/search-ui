import { ResponsiveComponentsManager, IResponsiveComponent, IResponsiveComponentOptions } from './ResponsiveComponentsManager';
import { ResponsiveComponentsUtils } from './ResponsiveComponentsUtils';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { Utils } from '../../utils/Utils';
import { $$, Dom } from '../../utils/Dom';
import { Logger } from '../../misc/Logger';
import { Recommendation } from '../Recommendation/Recommendation';
import { RecommendationDropdownContent } from './ResponsiveDropdown/RecommendationDropdownContent';
import { ResponsiveDropdownHeader } from './ResponsiveDropdown/ResponsiveDropdownHeader';
import { ResponsiveDropdown } from './ResponsiveDropdown/ResponsiveDropdown';
import { l } from '../../strings/Strings';
import { Component } from '../Base/Component';
import { get } from '../Base/RegisteredNamedMethods';
import { QueryEvents, IQuerySuccessEventArgs, INoResultsEventArgs } from '../../events/QueryEvents';
import * as _ from 'underscore';

import 'styling/_ResponsiveRecommendation';
import { Defer } from '../../MiscModules';

export class ResponsiveRecommendation implements IResponsiveComponent {
  public static DROPDOWN_CONTAINER_CSS_CLASS_NAME: string = 'coveo-recommendation-dropdown-container';
  public static RESPONSIVE_BREAKPOINT = 1000;

  public recommendationRoot: Dom;
  private breakpoint: number;
  private dropdown: ResponsiveDropdown;
  private facetSliders: any[];
  private facets: any[];
  private dropdownHeaderLabel: string;

  public static init(root: HTMLElement, component, options: IResponsiveComponentOptions) {
    let logger = new Logger('ResponsiveRecommendation');
    let coveoRoot = this.findParentRootOfRecommendationComponent(root);
    if (!coveoRoot) {
      logger.info('Recommendation component has no parent interface. Disabling responsive mode for this component.');
      return;
    }
    if (!$$(coveoRoot).find('.coveo-results-column')) {
      logger.info('Cannot find element with class coveo-results-column. Disabling responsive mode for this component.');
      return;
    }

    ResponsiveComponentsManager.register(
      ResponsiveRecommendation,
      $$(coveoRoot),
      Recommendation.ID,
      component,
      _.extend({}, options, { initializationEventRoot: $$(root) })
    );
  }

  private static findParentRootOfRecommendationComponent(root: HTMLElement): Dom {
    let coveoRoot = $$(root).parents(Component.computeCssClassName(SearchInterface));
    if (coveoRoot[0]) {
      return $$(coveoRoot[0]);
    }
    return null;
  }

  constructor(
    public coveoRoot: Dom,
    public ID: string,
    options: IResponsiveComponentOptions,
    public responsiveDropdown?: ResponsiveDropdown
  ) {
    this.recommendationRoot = this.getRecommendationRoot();
    this.dropdownHeaderLabel = options.dropdownHeaderLabel;
    this.breakpoint = this.defineResponsiveBreakpoint(options);
    this.dropdown = this.buildDropdown(responsiveDropdown);
    this.facets = this.getFacets();
    this.facetSliders = this.getFacetSliders();
    this.registerOnOpenHandler();
    this.registerOnCloseHandler();
    this.registerQueryEvents();
    this.handleResizeEvent();
  }

  public handleResizeEvent(): void {
    if (this.needSmallMode() && !ResponsiveComponentsUtils.isSmallRecommendationActivated(this.coveoRoot)) {
      this.changeToSmallMode();
    } else if (!this.needSmallMode() && ResponsiveComponentsUtils.isSmallRecommendationActivated(this.coveoRoot)) {
      this.changeToLargeMode();
    }

    if (this.dropdown.isOpened) {
      this.dropdown.dropdownContent.positionDropdown();
    }
  }

  public needDropdownWrapper(): boolean {
    return this.needSmallMode();
  }

  private needSmallMode(): boolean {
    return this.coveoRoot.width() <= this.breakpoint;
  }

  private changeToSmallMode() {
    this.dropdown.close();
    const header = this.coveoRoot.find(`.${ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS}`);
    if (!header) {
      // It's possible that recommendation gets initialized before the main interface is completed.
      // We defer the resize event execution in that case.
      Defer.defer(() => this.handleResizeEvent());
    } else {
      $$(header).append(this.dropdown.dropdownHeader.element.el);
      this.disableFacetPreservePosition();
      ResponsiveComponentsUtils.activateSmallRecommendation(this.coveoRoot);
      ResponsiveComponentsUtils.activateSmallRecommendation(this.recommendationRoot);
    }
  }

  private changeToLargeMode() {
    this.enableFacetPreservePosition();
    this.dropdown.cleanUp();
    ResponsiveComponentsUtils.deactivateSmallRecommendation(this.coveoRoot);
    ResponsiveComponentsUtils.deactivateSmallRecommendation(this.recommendationRoot);
  }

  private buildDropdown(responsiveDropdown?: ResponsiveDropdown): ResponsiveDropdown {
    let dropdownContent = this.buildDropdownContent();
    let dropdownHeader = this.buildDropdownHeader();
    let dropdown = responsiveDropdown ? responsiveDropdown : new ResponsiveDropdown(dropdownContent, dropdownHeader, this.coveoRoot);
    dropdown.disablePopupBackground();
    return dropdown;
  }

  private buildDropdownHeader(): ResponsiveDropdownHeader {
    let dropdownHeaderElement = $$('a');
    let content = $$('p');
    content.text(l(this.dropdownHeaderLabel));
    dropdownHeaderElement.el.appendChild(content.el);
    let dropdownHeader = new ResponsiveDropdownHeader('recommendation', dropdownHeaderElement);
    return dropdownHeader;
  }

  private buildDropdownContent(): RecommendationDropdownContent {
    let dropdownContentElement: Dom;
    let recommendationColumn = this.coveoRoot.find('.coveo-recommendation-column');
    if (recommendationColumn) {
      dropdownContentElement = $$(recommendationColumn);
    } else {
      dropdownContentElement = $$(this.coveoRoot.find('.' + Component.computeCssClassName(Recommendation)));
    }

    let dropdownContent = new RecommendationDropdownContent('recommendation', dropdownContentElement, this.coveoRoot);
    return dropdownContent;
  }

  private defineResponsiveBreakpoint(options: IResponsiveComponentOptions): number {
    let breakpoint;
    if (Utils.isNullOrUndefined(options.responsiveBreakpoint)) {
      breakpoint = ResponsiveRecommendation.RESPONSIVE_BREAKPOINT;
    } else {
      breakpoint = options.responsiveBreakpoint;
    }
    return breakpoint;
  }

  private getFacetSliders(): any[] {
    let facetSliders = [];
    _.each(this.coveoRoot.findAll('.' + Component.computeCssClassNameForType(`FacetSlider`)), facetSliderElement => {
      let facetSlider = Component.get(facetSliderElement);
      facetSliders.push(facetSlider);
    });
    return facetSliders;
  }

  private getFacets(): any[] {
    let facets = [];
    _.each(this.coveoRoot.findAll('.' + Component.computeCssClassNameForType('Facet')), facetElement => {
      let facet = Component.get(facetElement);
      facets.push(facet);
    });
    return facets;
  }

  private dismissFacetSearches(): void {
    _.each(this.facets, facet => {
      if (facet.facetSearch && facet.facetSearch.currentlyDisplayedResults) {
        facet.facetSearch.completelyDismissSearch();
      }
    });
  }

  private enableFacetPreservePosition(): void {
    _.each(this.facets, facet => (facet.options.preservePosition = true));
  }

  private disableFacetPreservePosition(): void {
    _.each(this.facets, facet => (facet.options.preservePosition = false));
  }

  private drawFacetSliderGraphs(): void {
    _.each(this.facetSliders, facetSlider => facetSlider.drawDelayedGraphData());
  }

  private registerOnOpenHandler(): void {
    this.dropdown.registerOnOpenHandler(this.drawFacetSliderGraphs, this);
  }

  private registerOnCloseHandler(): void {
    this.dropdown.registerOnCloseHandler(this.dismissFacetSearches, this);
  }

  private getRecommendationRoot(): Dom {
    return $$(this.coveoRoot.find('.' + Component.computeCssClassName(Recommendation)));
  }

  private registerQueryEvents() {
    let recommendationInstance = <Recommendation>get(this.recommendationRoot.el, SearchInterface);
    if (recommendationInstance && recommendationInstance.options.hideIfNoResults) {
      this.coveoRoot.on(QueryEvents.querySuccess, (e: Event, data: IQuerySuccessEventArgs) => this.handleRecommnendationQuerySucess(data));
      this.coveoRoot.on(QueryEvents.noResults, (e: Event, data: INoResultsEventArgs) => this.handleRecommendationNoResults());
    }
    this.coveoRoot.on(QueryEvents.queryError, () => this.handleRecommendationQueryError());
  }

  private handleRecommnendationQuerySucess(data: IQuerySuccessEventArgs) {
    if (data.results.totalCount === 0) {
      this.dropdown.close();
      this.dropdown.dropdownHeader.hide();
    } else {
      this.dropdown.dropdownHeader.show();
    }
  }

  private handleRecommendationNoResults() {
    this.dropdown.close();
    this.dropdown.dropdownHeader.hide();
  }

  private handleRecommendationQueryError() {
    this.dropdown.close();
    this.dropdown.dropdownHeader.hide();
  }
}
