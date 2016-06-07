import {$$, Dom} from '../../utils/Dom';
import {InitializationEvents} from '../../events/InitializationEvents';
import _ = require('underscore');
/*
* Register takes a class and will instantiate it after framework initialization has completed.
*/

export interface ResponsiveComponentConstructor {
  new (root: Dom): ResponsiveComponent;
}

export interface ResponsiveComponent {
  needSmallMode(): boolean;
  canSwitchToLargeMode?(): boolean;
  changeToSmallMode(): void;
  changeToLargeMode(): void;
  handleResizeEvent?(): void;
}

export class ResponsiveComponentsManager {

  private static coveoRoots: Array<Array<any>> = [];

  private coveoRoot: Dom;
  private resizeListener;
  private responsiveComponents: Array<ResponsiveComponent> = [];
  
  public static initResponsiveFacets(root: HTMLElement) {
    
  }
  
  public static initResponsiveTabs(root: HTMLElement) {
    
  }
  
  public static register(responsiveComponentConstructor: ResponsiveComponentConstructor, root: Dom) {
    root.on(InitializationEvents.afterInitialization, () => {
      let responsiveComponent = new responsiveComponentConstructor(root);
      let found = false;
      let responsiveComponentsManager;
      _.each(this.coveoRoots, currentRoot => {
        if (root.el.isSameNode(currentRoot[0])) {
          responsiveComponentsManager = currentRoot[1];
          responsiveComponentsManager.register(responsiveComponent);
          found = true;
        }
      });

      if (!found) {
        responsiveComponentsManager = new ResponsiveComponentsManager(root);
        this.coveoRoots.push([root, responsiveComponentsManager]);
        responsiveComponentsManager.register(responsiveComponent);
      }
      responsiveComponentsManager.resizeListener();
    });
  }

  constructor(root: Dom) {
    this.coveoRoot = root;
    //TODO: resize event method for one component
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
    this.responsiveComponents.push(responsiveComponent);
  }

  private changeToSmallMode() {
    _.each(this.responsiveComponents, responsiveComponent => {
      responsiveComponent.changeToSmallMode();
    });
  }

  private changeToLargeMode() {
    _.each(this.responsiveComponents, responsiveComponent => {
      responsiveComponent.changeToLargeMode();
    });
  }
  
  private handleResizeEvent() {
    _.each(this.responsiveComponents, responsiveComponent => {
        responsiveComponent.handleResizeEvent && responsiveComponent.handleResizeEvent();
    });
  }
}
