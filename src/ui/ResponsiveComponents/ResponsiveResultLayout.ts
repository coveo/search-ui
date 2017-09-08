import { IResponsiveComponent, IResponsiveComponentOptions, ResponsiveComponentsManager } from './ResponsiveComponentsManager';
import { Dom, $$ } from '../../utils/Dom';
import { ResponsiveDropdown } from './ResponsiveDropdown/ResponsiveDropdown';
import { Component } from '../Base/Component';
import { ResultLayout, ValidLayout } from '../ResultLayout/ResultLayout';
import { Logger } from '../../misc/Logger';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import * as _ from 'underscore';

export class ResponsiveResultLayout implements IResponsiveComponent {
  private searchInterface: SearchInterface;
  private resultLayout: ResultLayout;

  public static init(root: HTMLElement, component: ResultLayout, options: IResponsiveComponentOptions) {
    if (!$$(root).find(`.${Component.computeCssClassName(ResultLayout)}`)) {
      let logger = new Logger('ResponsiveResultLayout');
      logger.trace('No ResultLayout component found : Cannot instantiate ResponsiveResultLayout');
      return;
    }
    ResponsiveComponentsManager.register(ResponsiveResultLayout, $$(root), ResultLayout.ID, component, options);
  }

  constructor(public coveoRoot: Dom, public ID: string, options: IResponsiveComponentOptions, responsiveDropdown?: ResponsiveDropdown) {
    this.searchInterface = <SearchInterface>Component.get(this.coveoRoot.el, SearchInterface, false);
  }

  public registerComponent(accept: Component) {
    if (accept instanceof ResultLayout) {
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
    const layoutsToDisable = _.difference<any>(ResultLayout.validLayouts, validLayouts);
    const layoutsToEnable = _.intersection<any>(ResultLayout.validLayouts, validLayouts);
    this.resultLayout.disableLayouts(layoutsToDisable);
    this.resultLayout.enableLayouts(layoutsToEnable);
  }

  private needSmallMode(): boolean {
    return this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getSmallScreenWidth();
  }

  private needMediumMode(): boolean {
    return this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getMediumScreenWidth();
  }
}
