import {$$, Dom} from '../../utils/Dom';
import {InitializationEvents} from '../../events/InitializationEvents';
import {Component} from '../Base/Component';
import {Tab} from '../Tab/Tab';
import {Facet} from '../Facet/Facet';
import {ResponsiveFacets} from './ResponsiveFacets';
import {SearchInterface} from '../SearchInterface/SearchInterface';
import {ResponsiveComponentsUtils} from './ResponsiveComponentsUtils';
import {Utils} from '../../utils/Utils';

export interface IResponsiveComponentOptions {
  enableResponsiveMode?: boolean;
  responsiveBreakpoint?: number;
}

export interface IResponsiveComponentConstructor {
  new (root: Dom, ID: string, options: IResponsiveComponentOptions): IResponsiveComponent;
}

export interface IResponsiveComponent {
  ID: string;
  handleResizeEvent(): void;
  needDropdownWrapper?(): boolean;
}

export class ResponsiveComponentsManager {

  private static componentManagers: ResponsiveComponentsManager[] = [];
  private static remainingComponentInitializations: number = 0;

  private disabledComponents: string[] = [];
  private coveoRoot: Dom;
  private resizeListener;
  private responsiveComponents: IResponsiveComponent[] = [];
  private searchBoxElement: HTMLElement;
  private responsiveFacets: ResponsiveFacets;
  private dropdownHeadersWrapper: Dom;

  // Register takes a class and will instantiate it after framework initialization has completed.
  public static register(responsiveComponentConstructor: IResponsiveComponentConstructor, root: Dom, ID: string, component: Component, options: IResponsiveComponentOptions): void {
    root.on(InitializationEvents.afterInitialization, () => {
      if (this.shouldEnableResponsiveMode(root)) {
        let responsiveComponentsManager = _.find(this.componentManagers, (componentManager) => root.el == componentManager.coveoRoot.el);
        if (!responsiveComponentsManager) {
          responsiveComponentsManager = new ResponsiveComponentsManager(root);
          this.componentManagers.push(responsiveComponentsManager);
        }

        if (!Utils.isNullOrUndefined(options.enableResponsiveMode) && !options.enableResponsiveMode) {
          responsiveComponentsManager.disableComponent(ID);
          return;
        }
        let currentResponsiveComponentsManager = _.find(this.componentManagers, (componentManager) => root.el == componentManager.coveoRoot.el);
        currentResponsiveComponentsManager.register(responsiveComponentConstructor, root, ID, component, options);
      }

      this.remainingComponentInitializations--;
      if (this.remainingComponentInitializations == 0) {
        this.resizeAllComponentsManager();
      }
    });
    this.remainingComponentInitializations++;
  }

  private static shouldEnableResponsiveMode(root: Dom): boolean {
    let searchInterface = <SearchInterface>Component.get(root.el, SearchInterface, true);
    return searchInterface instanceof SearchInterface && searchInterface.options.enableAutomaticResponsiveMode && searchInterface.isNewDesign();
  }

  private static resizeAllComponentsManager(): void {
    _.each(this.componentManagers, componentManager => {
      componentManager.resizeListener();
    });
  }

  constructor(root: Dom) {
    this.coveoRoot = root;
    this.dropdownHeadersWrapper = $$('div', { className: 'coveo-dropdown-header-wrapper' });
    this.searchBoxElement = this.getSearchBoxElement();
    this.resizeListener = _.debounce(() => {
      this.addDropdownHeaderWrapperIfNeeded();
      if (this.shouldSwitchToSmallMode()) {
        this.coveoRoot.addClass('coveo-small-interface');
      } else if (!this.shouldSwitchToSmallMode()) {
        this.coveoRoot.removeClass('coveo-small-interface');
      }
      _.each(this.responsiveComponents, responsiveComponent => {
        responsiveComponent.handleResizeEvent();
      });
    }, 200);
    window.addEventListener('resize', this.resizeListener);
    this.bindNukeEvents();
  }

  public register(responsiveComponentConstructor: IResponsiveComponentConstructor, root: Dom, ID: string, component: Component, options: IResponsiveComponentOptions): void {
    if (this.isDisabled(ID)) {
      return;
    }

    if (!this.isActivated(ID)) {
      let responsiveComponent = new responsiveComponentConstructor(root, ID, options);
      if (this.isFacet(ID)) {
        this.responsiveFacets = <ResponsiveFacets>responsiveComponent;
      }

      if (this.isTabs(ID)) {
        this.responsiveComponents.push(responsiveComponent);
      } else {
        // Tabs need to be rendered last, so any dropdown header(eg: facet) is already there when the responsive tabs check for overflow.
        this.responsiveComponents.unshift(responsiveComponent);
      }
    }

    if (this.isFacet(ID)) {
      this.responsiveFacets.registerComponent(component);
    }
  }

  public disableComponent(ID: string) {
    this.disabledComponents.push(ID);
  }

  private isDisabled(ID: string) {
    return _.indexOf(this.disabledComponents, ID) != -1;
  }

  private shouldSwitchToSmallMode(): boolean {
    let aComponentNeedsTabSection = this.needDropdownWrapper();
    let reachedBreakpoint = this.coveoRoot.width() <= ResponsiveComponentsUtils.MEDIUM_MOBILE_WIDTH;
    return aComponentNeedsTabSection || reachedBreakpoint;
  }

  private needDropdownWrapper(): boolean {
    for (let i = 0; i < this.responsiveComponents.length; i++) {
      let responsiveComponent = this.responsiveComponents[i];
      if (responsiveComponent.needDropdownWrapper && responsiveComponent.needDropdownWrapper()) {
        return true;
      }
    }
    return false;
  }

  private addDropdownHeaderWrapperIfNeeded(): void {
    if (this.needDropdownWrapper()) {
      let tabSection = $$(this.coveoRoot).find('.coveo-tab-section');
      if (this.searchBoxElement) {
        this.dropdownHeadersWrapper.insertAfter(this.searchBoxElement);
      } else if (tabSection) {
        this.dropdownHeadersWrapper.insertAfter(tabSection);
      } else {
        this.coveoRoot.prepend(tabSection);
      }
    }
  }

  private isFacet(ID: string): boolean {
    return ID == Facet.ID;
  }

  private isTabs(ID: string): boolean {
    return ID == Tab.ID;
  }

  private isActivated(ID: string): boolean {
    return _.find(this.responsiveComponents, current => current.ID == ID) != undefined;
  }

  private getSearchBoxElement(): HTMLElement {
    let searchBoxElement = this.coveoRoot.find('.coveo-search-section');
    if (searchBoxElement) {
      return <HTMLElement>searchBoxElement;
    } else {
      return <HTMLElement>this.coveoRoot.find('.CoveoSearchbox');
    }
  }

  private bindNukeEvents(): void {
    $$(this.coveoRoot).on(InitializationEvents.nuke, () => {
      window.removeEventListener('resize', this.resizeListener);
    });
  }
}
