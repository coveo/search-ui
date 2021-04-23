import { difference, intersection } from 'underscore';
import { Logger } from '../../misc/Logger';
import { $$, Dom } from '../../utils/Dom';
import { Component } from '../Base/Component';
import { ResultLayoutSelector } from '../ResultLayoutSelector/ResultLayoutSelector';
import { ValidLayout } from '../ResultLayoutSelector/ValidLayout';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { IResponsiveComponent, IResponsiveComponentOptions, ResponsiveComponentsManager } from './ResponsiveComponentsManager';
import { ResponsiveDropdown } from './ResponsiveDropdown/ResponsiveDropdown';

export class ResponsiveResultLayout implements IResponsiveComponent {
  private searchInterface: SearchInterface;
  private resultLayout: ResultLayoutSelector;

  public static init(root: HTMLElement, component: ResultLayoutSelector, options: IResponsiveComponentOptions) {
    if (!$$(root).find(`.${Component.computeCssClassName(ResultLayoutSelector)}`)) {
      let logger = new Logger('ResponsiveResultLayout');
      logger.trace('No ResultLayout component found : Cannot instantiate ResponsiveResultLayout');
      return;
    }
    ResponsiveComponentsManager.register(ResponsiveResultLayout, $$(root), ResultLayoutSelector.ID, component, options);
  }

  constructor(public coveoRoot: Dom, public ID: string, options: IResponsiveComponentOptions, responsiveDropdown?: ResponsiveDropdown) {
    this.searchInterface = <SearchInterface>Component.get(this.coveoRoot.el, SearchInterface, false);
    coveoRoot.on('state:change:t', () => {
      this.handleResizeEvent();
    });
  }

  public registerComponent(accept: Component) {
    if (accept instanceof ResultLayoutSelector) {
      this.resultLayout = accept;
      return true;
    }
    return false;
  }

  public handleResizeEvent() {
    if (this.needSmallMode()) {
      this.enableAndDisableLayouts(<ValidLayout[]>this.resultLayout.options.mobileLayouts);
    } else if (this.needMediumMode()) {
      this.enableAndDisableLayouts(<ValidLayout[]>this.resultLayout.options.tabletLayouts);
    } else {
      this.enableAndDisableLayouts(<ValidLayout[]>this.resultLayout.options.desktopLayouts);
    }
  }

  private enableAndDisableLayouts(validLayouts: ValidLayout[]) {
    const layoutsToDisable = difference<any>(ResultLayoutSelector.validLayouts, validLayouts);
    const layoutsToEnable = intersection<any>(ResultLayoutSelector.validLayouts, validLayouts);
    this.resultLayout.disableLayouts(layoutsToDisable);
    this.resultLayout.enableLayouts(layoutsToEnable);
  }

  private needSmallMode(): boolean {
    switch (this.searchInterface.responsiveComponents.getResponsiveMode()) {
      case 'small':
        return true;
      case 'auto':
        return this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getSmallScreenWidth();
      default:
        return false;
    }
  }

  private needMediumMode(): boolean {
    switch (this.searchInterface.responsiveComponents.getResponsiveMode()) {
      case 'medium':
        return true;
      case 'auto':
        return this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getMediumScreenWidth();
      default:
        return false;
    }
  }
}
