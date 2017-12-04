import { $$, Dom } from '../../utils/Dom';
import { InitializationEvents } from '../../events/InitializationEvents';
import { Component } from '../Base/Component';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { Utils } from '../../utils/Utils';
import * as _ from 'underscore';
import { QueryEvents } from '../../events/QueryEvents';
import { Logger } from '../../misc/Logger';

export interface IResponsiveComponentOptions {
  enableResponsiveMode?: boolean;
  responsiveBreakpoint?: number;
  dropdownHeaderLabel?: string;
  initializationEventRoot?: Dom;
}

export interface IResponsiveComponentConstructor {
  new (root: Dom, ID: string, options: IResponsiveComponentOptions): IResponsiveComponent;
}

export interface IResponsiveComponent {
  ID: string;
  handleResizeEvent(): void;
  needDropdownWrapper?(): boolean;
  registerComponent?(accept: Component): boolean;
}

interface IComponentInitialization {
  responsiveComponentsManager: ResponsiveComponentsManager;
  arguments: [IResponsiveComponentConstructor, Dom, string, Component, IResponsiveComponentOptions];
}

export class ResponsiveComponentsManager {
  public static DROPDOWN_HEADER_WRAPPER_CSS_CLASS = 'coveo-dropdown-header-wrapper';
  public static RESIZE_DEBOUNCE_DELAY = 200;

  private static componentManagers: ResponsiveComponentsManager[] = [];
  private static remainingComponentInitializations: number = 0;
  private static componentInitializations: IComponentInitialization[] = [];

  public resizeListener;

  private disabledComponents: string[] = [];
  private coveoRoot: Dom;
  private responsiveComponents: IResponsiveComponent[] = [];
  private searchBoxElement: HTMLElement;
  private dropdownHeadersWrapper: Dom;
  private searchInterface: SearchInterface;
  private logger: Logger;

  // Register takes a class and will instantiate it after framework initialization has completed.
  public static register(
    responsiveComponentConstructor: IResponsiveComponentConstructor,
    root: Dom,
    ID: string,
    component: Component,
    options: IResponsiveComponentOptions
  ): void {
    // options.initializationEventRoot can be set in some instance (like recommendation) where the root of the interface triggering the init event
    // is different from the one that will be used for calculation size.
    const initEventRoot = options.initializationEventRoot || root;
    initEventRoot.on(InitializationEvents.afterInitialization, () => {
      if (this.shouldEnableResponsiveMode(root)) {
        let responsiveComponentsManager = _.find(this.componentManagers, componentManager => root.el == componentManager.coveoRoot.el);
        if (!responsiveComponentsManager) {
          responsiveComponentsManager = new ResponsiveComponentsManager(root);
          this.componentManagers.push(responsiveComponentsManager);
        }

        if (!Utils.isNullOrUndefined(options.enableResponsiveMode) && !options.enableResponsiveMode) {
          responsiveComponentsManager.disableComponent(ID);
          return;
        }

        this.componentInitializations.push({
          responsiveComponentsManager: responsiveComponentsManager,
          arguments: [responsiveComponentConstructor, root, ID, component, options]
        });
      }

      this.remainingComponentInitializations--;
      if (this.remainingComponentInitializations == 0) {
        this.instantiateResponsiveComponents(); // necessary to verify if all components are disabled before they are initialized.
        if (root.width() == 0) {
          let logger = new Logger('ResponsiveComponentsManager');
          logger.info(`Search interface width is 0, cannot dispatch resize events to responsive components. Will try again after first
          query success.`);
          root.one(QueryEvents.querySuccess, () => {
            this.resizeAllComponentsManager();
          });
        } else {
          this.resizeAllComponentsManager();
        }
      }
    });
    this.remainingComponentInitializations++;
  }

  private static shouldEnableResponsiveMode(root: Dom): boolean {
    let searchInterface = <SearchInterface>Component.get(root.el, SearchInterface, true);
    return searchInterface instanceof SearchInterface && searchInterface.options.enableAutomaticResponsiveMode;
  }

  private static instantiateResponsiveComponents() {
    _.each(this.componentInitializations, componentInitialization => {
      let responsiveComponentsManager = componentInitialization.responsiveComponentsManager;
      responsiveComponentsManager.register.apply(responsiveComponentsManager, componentInitialization.arguments);
    });
  }

  private static resizeAllComponentsManager(): void {
    _.each(this.componentManagers, componentManager => {
      componentManager.resizeListener();
    });
  }

  constructor(root: Dom) {
    this.coveoRoot = root;
    this.searchInterface = <SearchInterface>Component.get(this.coveoRoot.el, SearchInterface, false);
    this.dropdownHeadersWrapper = $$('div', {
      className: ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS
    });
    this.searchBoxElement = this.getSearchBoxElement();
    this.logger = new Logger(this);
    this.resizeListener = _.debounce(
      () => {
        if (this.coveoRoot.width() != 0) {
          this.addDropdownHeaderWrapperIfNeeded();
          if (this.shouldSwitchToSmallMode()) {
            this.coveoRoot.addClass('coveo-small-interface');
          } else if (!this.shouldSwitchToSmallMode()) {
            this.coveoRoot.removeClass('coveo-small-interface');
          }
          _.each(this.responsiveComponents, responsiveComponent => {
            responsiveComponent.handleResizeEvent();
          });
        } else {
          this.logger
            .warn(`The width of the search interface is 0, cannot dispatch resize events to responsive components. This means that the tabs will not
        automatically fit in the tab section. Also, the facet and recommendation component will not hide in a menu. Could the search
        interface display property be none? Could its visibility property be set to hidden? Also, if either of these scenarios happen during
        loading, it could be the cause of this issue.`);
        }
      },
      ResponsiveComponentsManager.RESIZE_DEBOUNCE_DELAY,
      true
    );
    window.addEventListener('resize', this.resizeListener);
    this.bindNukeEvents();
  }

  public register(
    responsiveComponentConstructor: IResponsiveComponentConstructor,
    root: Dom,
    ID: string,
    component: Component,
    options: IResponsiveComponentOptions
  ): void {
    if (this.isDisabled(ID)) {
      return;
    }

    if (!this.isActivated(ID)) {
      let responsiveComponent = new responsiveComponentConstructor(root, ID, options);

      if (this.isTabs(ID)) {
        this.responsiveComponents.push(responsiveComponent);
      } else {
        // Tabs need to be rendered last, so any dropdown header(eg: facet) is already there when the responsive tabs check for overflow.
        this.responsiveComponents.unshift(responsiveComponent);
      }
    }
    _.each(this.responsiveComponents, (responsiveComponent: IResponsiveComponent) => {
      if (responsiveComponent.registerComponent != null) {
        responsiveComponent.registerComponent(component);
      }
    });
  }

  public disableComponent(ID: string) {
    this.disabledComponents.push(ID);
  }

  private isDisabled(ID: string) {
    return _.indexOf(this.disabledComponents, ID) != -1;
  }

  private shouldSwitchToSmallMode(): boolean {
    let aComponentNeedsTabSection = this.needDropdownWrapper();
    let reachedBreakpoint = this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getMediumScreenWidth();
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
        this.coveoRoot.prepend(this.dropdownHeadersWrapper.el);
      }
    }
  }

  private isTabs(ID: string): boolean {
    return ID == 'Tab';
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

      // If the interface gets nuked, we need to remove all reference to componentManagers stored which match the current search interface
      ResponsiveComponentsManager.componentManagers = _.filter(
        ResponsiveComponentsManager.componentManagers,
        manager => manager.coveoRoot.el != this.coveoRoot.el
      );
    });
  }
}
