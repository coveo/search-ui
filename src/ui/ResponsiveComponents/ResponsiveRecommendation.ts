import {ResponsiveComponentsManager, IResponsiveComponent, IResponsiveComponentOptions} from './ResponsiveComponentsManager';
import {ResponsiveComponentsUtils} from './ResponsiveComponentsUtils';
import {Utils} from '../../utils/Utils';
import {$$, Dom} from '../../utils/Dom';
import {Logger} from '../../misc/Logger';
import {Recommendation} from '../Recommendation/Recommendation';
import {Dropdown} from './Dropdown';
import {l} from '../../strings/Strings';
import {FacetSlider} from '../FacetSlider/FacetSlider';
import {Facet} from '../Facet/Facet';
import {Component} from '../Base/Component';

export class ResponsiveRecommendation implements IResponsiveComponent {

  private static DROPDOWN_MIN_WIDTH: number = 300;
  private static DROPDOWN_WIDTH_RATIO: number = 0.35; // Used to set the width relative to the coveo root.
  public static RESPONSIVE_BREAKPOINT = 1000;

  private breakpoint: number;
  private dropdown: Dropdown;
  private logger: Logger;
  private facetSliders: FacetSlider[];
  private facets: Facet[];

  public static init(root: HTMLElement, component, options: IResponsiveComponentOptions) {
    let logger = new Logger('ResponsiveRecommendation');
    let coveoRoot = this.findParentRootOfRecommendationComponent(root);
    if (!coveoRoot) {
      logger.info('Recommendation component has no parent interface. Disabling responsive mode.');
      return;
    }
    ResponsiveComponentsManager.register(ResponsiveRecommendation, $$(coveoRoot), Recommendation.ID, component, options);
  }

  private static findParentRootOfRecommendationComponent(root: HTMLElement): Dom {
    let coveoRoot = $$(root).parents('CoveoSearchInterface');
    if (coveoRoot[0]) {
      return $$(coveoRoot[0]);
    }
    return null;
  }

  constructor(public coveoRoot: Dom, public ID: string, options: IResponsiveComponentOptions) {
    this.logger = new Logger(this);
    this.dropdown = this.buildDropdown();
    this.breakpoint = this.defineResponsiveBreakpoint(options);
    this.facets = this.getFacets();
    this.facetSliders = this.getFacetSliders();
    this.registerOnOpenHandler();
    this.registerOnCloseHandler();
  }

  public handleResizeEvent(): void {
    if (this.needSmallMode()) {
      this.changeToSmallMode();
    } else {
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
    $$(this.coveoRoot.find('.coveo-dropdown-header-wrapper')).el.appendChild(this.dropdown.dropdownHeader.element.el);
    this.disableFacetPreservePosition();
    ResponsiveComponentsUtils.activateSmallRecommendation(this.coveoRoot);
  }

  private changeToLargeMode() {
    this.enableFacetPreservePosition();
    this.dropdown.cleanUp();
    ResponsiveComponentsUtils.deactivateSmallRecommendation(this.coveoRoot);
  }

  private buildDropdown(): Dropdown {
    let dropdownContent = this.buildDropdownContent();
    let dropdownHeader = this.buildDropdownHeader();
    let dropdown = new Dropdown('recommendation', dropdownContent, dropdownHeader, this.coveoRoot, ResponsiveRecommendation.DROPDOWN_MIN_WIDTH, ResponsiveRecommendation.DROPDOWN_WIDTH_RATIO);
    return dropdown;
  }

  private buildDropdownHeader(): Dom {
    let dropdownHeader = $$('a');
    let content = $$('p');
    content.text(l('Recommendations'));
    dropdownHeader.el.appendChild(content.el);
    return dropdownHeader;
  }

  private buildDropdownContent(): Dom {
    let dropdownContent;
    let recommendationColumn = this.coveoRoot.find('.coveo-recommendation-column');
    if (recommendationColumn) {
      dropdownContent = $$(recommendationColumn);
    } else {
      dropdownContent = $$(this.coveoRoot.find('.CoveoRecommendation'));
    }
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

  private getFacetSliders(): FacetSlider[] {
    let facetSliders = []
    _.each(this.coveoRoot.findAll('.CoveoFacetSlider'), facetSliderElement => {
      let facetSlider = Component.get(facetSliderElement, FacetSlider);
      if (facetSlider instanceof FacetSlider) {
        facetSliders.push(facetSlider);
      }
    })
    return facetSliders;
  }

  private getFacets(): Facet[] {
    let facets = []
    _.each(this.coveoRoot.findAll('.CoveoFacet'), facetElement => {
      let facet = Component.get(facetElement, Facet);
      if (facet instanceof Facet) {
        facets.push(facet);
      }
    })
    return facets;
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
}
