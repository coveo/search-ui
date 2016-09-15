import {$$, Dom} from '../../utils/Dom';
import {InitializationEvents} from '../../events/InitializationEvents';
import {Component} from '../Base/Component';
import {Tab} from '../Tab/Tab';
import {Facet} from '../Facet/Facet';
import {ResponsiveFacets} from './ResponsiveFacets';
import {IComponentDefinition} from '../Base/Component';
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
  needTabSection?(): boolean;
}

export class ResponsiveComponentsManager {

  private static componentManagers: ResponsiveComponentsManager[] = [];
  private static remainingComponentInitializations: number = 0;

  private coveoRoot: Dom;
  private resizeListener;
  private responsiveComponents: IResponsiveComponent[] = [];
  private tabSection: Dom;
  private searchBoxElement: HTMLElement;
  private createdTabSection: boolean = false;
  private responsiveFacets: ResponsiveFacets;
  private tabSectionPreviousSibling: Dom;
  private tabSectionParent: Dom;
  private disabledComponents: string[] = [];

  // Register takes a class and will instantiate it after framework initialization has completed.
  public static register(responsiveComponentConstructor: IResponsiveComponentConstructor, root: Dom, ID: string,
    component: IComponentDefinition, options: IResponsiveComponentOptions): void {
    let searchInterface = <SearchInterface>Component.get(root.el, SearchInterface, true);
    if (this.shouldEnableResponsiveMode(root)) {
      root.on(InitializationEvents.afterInitialization, () => {
        let responsiveComponentsManager = _.find(this.componentManagers, (componentManager) => root.el == componentManager.coveoRoot.el);
        if (responsiveComponentsManager) {
          responsiveComponentsManager.register(responsiveComponentConstructor, root, ID, component, options);
        } else {
          responsiveComponentsManager = new ResponsiveComponentsManager(root);
          this.componentManagers.push(responsiveComponentsManager);
          responsiveComponentsManager.register(responsiveComponentConstructor, root, ID, component, options);
        }

        this.remainingComponentInitializations--;
        if (this.remainingComponentInitializations == 0) {
          this.resizeAllComponentsManager();
        }
      });
      this.remainingComponentInitializations++;
    }
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
    this.searchBoxElement = this.getSearchBoxElement();
    this.ensureTabSectionInDom();
    this.saveTabSectionPosition();
    this.resizeListener = _.debounce(() => {
      if (this.shouldSwitchToSmallMode()) {
        this.coveoRoot.addClass('coveo-small-interface');
        this.tabSection.insertAfter(this.searchBoxElement);
      } else if (this.shouldExitSmallMode()) {
        this.coveoRoot.removeClass('coveo-small-interface');
        this.restoreTabSectionPosition();
      }
      _.each(this.responsiveComponents, responsiveComponent => {
        responsiveComponent.handleResizeEvent();
      });
    }, 200);
    window.addEventListener('resize', this.resizeListener);
    this.bindNukeEvents();
  }

  public register(responsiveComponentConstructor: IResponsiveComponentConstructor, root: Dom, ID: string, component, options: IResponsiveComponentOptions): void {
    if (!this.shouldRegisterComponent(component, options)) {
      return;
    }

    if (!this.isActivated(ID)) {
      let responsiveComponent = new responsiveComponentConstructor(root, ID, options);
      if (this.isFacet(ID)) {
        this.responsiveFacets = <ResponsiveFacets>responsiveComponent;
        this.responsiveFacets.registerComponent(component);
        // Facets need to be rendered before tabs, so the facet dropdown header is already there when the responsive tabs check for overflow.
        this.responsiveComponents.unshift(responsiveComponent);
      } else {
        this.responsiveComponents.push(responsiveComponent);
      }
    } else if (this.isFacet(ID) && this.isActivated(ID)) {
      this.responsiveFacets.registerComponent(component);
    }
  }

  private shouldSwitchToSmallMode(): boolean {
    // If we had to create the tab section or if we reached the pixel breakpoint, we move the tab section below the search box
    // to switch to small mode.
    if (this.searchBoxElement && this.tabSection) {
      let aComponentNeedsTabSection = this.needTabSection() && this.createdTabSection;
      let reachedBreakpoint = this.coveoRoot.width() <= ResponsiveComponentsUtils.MEDIUM_MOBILE_WIDTH;
      return aComponentNeedsTabSection || reachedBreakpoint;
    }
    return false;
  }

  private shouldExitSmallMode(): boolean {
    return this.searchBoxElement && this.tabSection && this.coveoRoot.width() > ResponsiveComponentsUtils.MEDIUM_MOBILE_WIDTH
  }

  private needTabSection(): boolean {
    for (let i = 0; i < this.responsiveComponents.length; i++) {
      let responsiveComponent = this.responsiveComponents[i];
      if (responsiveComponent.needTabSection && responsiveComponent.needTabSection()) {
        return true;
      }
    }
    return false;
  }

  private ensureTabSectionInDom(): void {
    let tabSection = this.coveoRoot.find('.coveo-tab-section');
    if (tabSection) {
      this.tabSection = $$(tabSection);
    } else {
      this.tabSection = $$('div', { className: 'coveo-tab-section' });
      this.createdTabSection = true;
    }
  }

  private restoreTabSectionPosition(): void {
    if (this.tabSectionPreviousSibling) {
      this.tabSection.insertAfter(this.tabSectionPreviousSibling.el);
    } else if (this.tabSectionParent) {
      this.tabSectionParent.prepend(this.tabSection.el);
    } else if (!this.needTabSection()) {
      this.tabSection && this.tabSection.detach();
    }
  }

  private saveTabSectionPosition(): void {
    if (this.tabSection) {
      this.tabSectionPreviousSibling = this.tabSection.el.previousSibling ? $$(<HTMLElement>this.tabSection.el.previousSibling) : null;
      this.tabSectionParent = this.tabSection.el.parentElement ? $$(this.tabSection.el.parentElement) : null;
    }
  }

  private shouldRegisterComponent(component: IComponentDefinition, options: IResponsiveComponentOptions): boolean {
    let componentIsDisabled = _.contains(this.disabledComponents, component.ID);
    if (componentIsDisabled) {
      return false;
    }

    if (!Utils.isNullOrUndefined(options.enableResponsiveMode) && !options.enableResponsiveMode) {
      this.disabledComponents.push(component.ID);
      return false;
    }

    return true;
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
