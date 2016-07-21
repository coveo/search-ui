import {$$, Dom} from '../../utils/Dom';
import {InitializationEvents} from '../../events/InitializationEvents';
import {Component} from '../Base/Component';
import {Tab} from '../Tab/Tab';
import {Facet} from '../Facet/Facet';
import {FacetSlider} from '../FacetSlider/FacetSlider';
import {ResponsiveFacets} from './ResponsiveFacets';
import {IComponentDefinition} from '../Base/Component';
import _ = require('underscore');
import {SearchInterface} from '../SearchInterface/SearchInterface';

export interface IResponsiveComponentConstructor {
  new (root: Dom, ID: string): IResponsiveComponent;
}

export interface IResponsiveComponent {
  ID: string;
  needSmallMode(): boolean;
  changeToSmallMode(): void;
  changeToLargeMode(): void;
  handleResizeEvent?(): void;
}

export class ResponsiveComponentsManager {

  public static MEDIUM_MOBILE_WIDTH = 640;

  private static componentManagers: ResponsiveComponentsManager[] = [];
  private static remainingComponentInitializations: number = 0;

  private coveoRoot: Dom;
  private resizeListener;
  private responsiveComponents: IResponsiveComponent[] = [];
  private tabSection: Dom;
  private searchBoxElement: HTMLElement;
  private isTabActivated: boolean = false;
  private isFacetActivated: boolean = false;
  private responsiveFacets: ResponsiveFacets;

  // Register takes a class and will instantiate it after framework initialization has completed.
  public static register(responsiveComponentConstructor: IResponsiveComponentConstructor, root: Dom, ID: string, component: IComponentDefinition) {
    let searchInterface = <SearchInterface>Component.get(root.el, SearchInterface, true);
    if (searchInterface instanceof SearchInterface && searchInterface.options.enableAutomaticResponsiveMode) {
      root.on(InitializationEvents.afterInitialization, () => {
        let responsiveComponentsManager = _.find(this.componentManagers, (componentManager) => root.el == componentManager.coveoRoot.el);
        if (responsiveComponentsManager) {
          responsiveComponentsManager.register(responsiveComponentConstructor, root, ID, component);
        } else {
          responsiveComponentsManager = new ResponsiveComponentsManager(root);
          this.componentManagers.push(responsiveComponentsManager);
          responsiveComponentsManager.register(responsiveComponentConstructor, root, ID, component);
        }

        this.remainingComponentInitializations--;
        if (this.remainingComponentInitializations == 0) {
          this.resizeAllComponentsManager();
        }
      });
      this.remainingComponentInitializations++;
    }

  }

  private static resizeAllComponentsManager() {
    _.each(this.componentManagers, componentManager => {
      componentManager.resizeListener();
    });
  }

  constructor(root: Dom) {
    let searchInterface = <SearchInterface>Component.get(root.el, SearchInterface, true);
    this.coveoRoot = root;
    this.searchBoxElement = this.getSearchBoxElement();
    this.resizeListener = _.debounce(() => {
      for (let i = 0; i < this.responsiveComponents.length; i++) {
        if (this.responsiveComponents[i].needSmallMode()) {
          if (!searchInterface.isSmallInterface()) {
            searchInterface.setSmallInterface();
            this.changeToSmallMode();
          }
          this.handleResizeEvent();
          return;
        }
      }

      if (searchInterface.isSmallInterface()) {
        searchInterface.unsetSmallInterface();
        this.changeToLargeMode();
      }
      this.handleResizeEvent();
    }, 200);
    window.addEventListener('resize', this.resizeListener);
    this.bindNukeEvents();
  }

  public register(responsiveComponentConstructor: IResponsiveComponentConstructor, root: Dom, ID: string, component) {

    if (this.isFacet(ID) && this.isActivated(ID)) {
      this.responsiveFacets.registerComponent(component);
    }

    if (!this.isActivated(ID)) {
      let responsiveComponent = new responsiveComponentConstructor(root, ID);
      if (this.isTabs(responsiveComponent.ID)) {
        this.isTabActivated = true;
        if (this.isFacetActivated) {
          this.tabSection = null;
        }
      }

      if (this.isFacet(ID)) {
        this.responsiveFacets = <ResponsiveFacets>responsiveComponent;
        this.responsiveFacets.registerComponent(component)
        this.isFacetActivated = true;
        if (!this.isTabActivated) {
          this.tabSection = $$('div', { className: 'coveo-tab-section' });
        }
        // Facets need to be rendered before tabs, so the facet dropdown header is already there when the responsive tabs check for overflow.
        this.responsiveComponents.unshift(responsiveComponent);
      } else {
        this.responsiveComponents.push(responsiveComponent);
      }
    }

  }

  private changeToSmallMode(): void {
    if (this.searchBoxElement) {
      this.tabSection && this.tabSection.insertAfter(this.searchBoxElement);
    }
    _.each(this.responsiveComponents, responsiveComponent => {
      responsiveComponent.changeToSmallMode();
    });
  }

  private changeToLargeMode(): void {
    this.tabSection && this.tabSection.detach();
    _.each(this.responsiveComponents, responsiveComponent => {
      responsiveComponent.changeToLargeMode();
    });
  }

  private handleResizeEvent(): void {
    _.each(this.responsiveComponents, responsiveComponent => {
      responsiveComponent.handleResizeEvent && responsiveComponent.handleResizeEvent();
    });
  }

  private isFacet(ID: string): boolean {
    return ID == Facet.ID || ID == FacetSlider.ID;
  }

  private isTabs(ID: string): boolean {
    return ID == Tab.ID;
  }

  private isActivated(ID: string): boolean {
    return _.find(this.responsiveComponents, current => current.ID == ID) != undefined
  }

  private getSearchBoxElement(): HTMLElement {
    let searchBoxElement = this.coveoRoot.find('.coveo-search-section');
    if (searchBoxElement) {
      return <HTMLElement>searchBoxElement;
    } else {
      return <HTMLElement>this.coveoRoot.find('.CoveoSearchbox');
    }
  }

  private bindNukeEvents() {
    $$(this.coveoRoot).on(InitializationEvents.nuke, () => {
      window.removeEventListener('resize', this.resizeListener);
    });
  }
}
