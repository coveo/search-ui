import {$$, Dom} from '../../utils/Dom';
import {InitializationEvents} from '../../events/InitializationEvents';
import {Component} from '../Base/Component';
import {Tab} from '../Tab/Tab';
import {Facet} from '../Facet/Facet';
import _ = require('underscore');
/*
* Register takes a class and will instantiate it after framework initialization has completed.
*/

export interface ResponsiveComponentConstructor {
  new (root: Dom, ID: string): ResponsiveComponent;
}

export interface ResponsiveComponent{
  ID: string;
  needSmallMode(): boolean;
  canSwitchToLargeMode?(): boolean;
  changeToSmallMode(): void;
  changeToLargeMode(): void;
  handleResizeEvent?(): void;
}

export class ResponsiveComponentsManager {

  private static componentManagers: Array<ResponsiveComponentsManager> = [];
  private static remainingComponentInitializations: number = 0;

  private coveoRoot: Dom;
  private resizeListener;
  private responsiveComponents: Array<ResponsiveComponent> = [];
  private tabSectionContainer: Dom;
  
  public static register(responsiveComponentConstructor: ResponsiveComponentConstructor, root: Dom, ID: string) {
    root.on(InitializationEvents.afterInitialization, () => {
      let responsiveComponent = new responsiveComponentConstructor(root, ID);

      let responsiveComponentsManager = _.find(this.componentManagers, (componentManager) => root.el.isSameNode(componentManager.coveoRoot.el));
      if (responsiveComponentsManager){
          responsiveComponentsManager.register(responsiveComponent);
      } else {
        responsiveComponentsManager = new ResponsiveComponentsManager(root);
        this.componentManagers.push(responsiveComponentsManager);
        responsiveComponentsManager.register(responsiveComponent);
      }
      
      this.remainingComponentInitializations--;
      if (this.remainingComponentInitializations == 0) {
        this.resizeAllComponentsManager();
      }
    });
    this.remainingComponentInitializations++;
  }
  
  private static resizeAllComponentsManager() {
    _.each(this.componentManagers, componentManager => {
      componentManager.resizeListener();
    });
  }

  constructor(root: Dom) {
    this.coveoRoot = root;
    this.resizeListener = () => {
      for (let i = 0; i < this.responsiveComponents.length; i++) {
        if (this.responsiveComponents[i].needSmallMode()) {
          if (!this.coveoRoot.hasClass('coveo-small-search-interface')) {
            this.coveoRoot.addClass('coveo-small-search-interface');
            this.changeToSmallMode();
          }
          this.handleResizeEvent();
          return;
        }
      }

      //TODO: do we really need this
      let shouldSwitchToLargeMode = true;
      for (let i = 0; i < this.responsiveComponents.length; i++) {
        if (this.responsiveComponents[i].canSwitchToLargeMode && !this.responsiveComponents[i].canSwitchToLargeMode()) {
          shouldSwitchToLargeMode = false;
        }
      }
      
      if (shouldSwitchToLargeMode && this.coveoRoot.hasClass('coveo-small-search-interface')) {
        this.coveoRoot.removeClass('coveo-small-search-interface');
        this.changeToLargeMode();
      }
      this.handleResizeEvent();
    };
    window.addEventListener('resize', _.debounce(this.resizeListener, 200));
  }

  public register(responsiveComponent: ResponsiveComponent) {
    
    if (this.isFacetOrTabs(responsiveComponent)) {
        this.tabSectionContainer = $$('div', {className: 'coveo-tab-section-container'});
    }
      
    if (this.isTabs(responsiveComponent)) {
      this.responsiveComponents.unshift(responsiveComponent);
    } else {
      this.responsiveComponents.push(responsiveComponent);
    }
    
  }

  private changeToSmallMode(): void {
    _.each(this.responsiveComponents, responsiveComponent => {
      responsiveComponent.changeToSmallMode();
    });
  }

  private changeToLargeMode(): void {
    _.each(this.responsiveComponents, responsiveComponent => {
      responsiveComponent.changeToLargeMode();
    });
  }
  
  private handleResizeEvent(): void {
    _.each(this.responsiveComponents, responsiveComponent => {
        responsiveComponent.handleResizeEvent && responsiveComponent.handleResizeEvent();
    });
  }
  
  private isFacetOrTabs(component: ResponsiveComponent): boolean {
    return component.ID == Tab.ID || component.ID == Facet.ID;
  }
  
  private isTabs(component: ResponsiveComponent): boolean {
    return component.ID == Tab.ID;
  }
  
  private getSearchBoxElement(): HTMLElement {
    let searchBoxElement = this.coveoRoot.find('.coveo-search-section');
    if (searchBoxElement) {
      return <HTMLElement>searchBoxElement;
    } else {
      return <HTMLElement>this.coveoRoot.find('.CoveoSearchbox');
    }
  }
}