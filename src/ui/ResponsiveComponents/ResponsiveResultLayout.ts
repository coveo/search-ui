import {
    IResponsiveComponent, IResponsiveComponentOptions,
    ResponsiveComponentsManager
} from './ResponsiveComponentsManager';
import {Dom, $$} from '../../utils/Dom';
import {ResponsiveDropdown} from './ResponsiveDropdown/ResponsiveDropdown';
import {Component} from '../Base/Component';
import {ResultLayout, ValidLayout} from '../ResultLayout/ResultLayout';
import {Logger} from '../../misc/Logger';
import {SearchInterface} from '../SearchInterface/SearchInterface';

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

  public registerComponent(component: ResultLayout) {
    this.resultLayout = component;
  }

  public handleResizeEvent() {
    if (this.needSmallMode()) {
      this.enableAndDisableLayout(<ValidLayout[]>this.resultLayout.options.mobileLayouts);
    } else if (this.needMediumMode()) {
      this.enableAndDisableLayout(<ValidLayout[]>this.resultLayout.options.tabletLayouts);
    } else {
      this.enableAndDisableLayout(<ValidLayout[]>this.resultLayout.options.desktopLayouts);
    }
  }

  private enableAndDisableLayout(validLayouts: ValidLayout[]) {
    let needToDisable = _.difference<any>(ResultLayout.validLayouts, validLayouts);
    let needToEnable = _.intersection<any>(ResultLayout.validLayouts, validLayouts);
    _.each(needToDisable, (toDisable: ValidLayout)=> {
      this.resultLayout.disableLayout(toDisable);
    });
    _.each(needToEnable, (toEnable: ValidLayout)=> {
      this.resultLayout.enableLayout(toEnable);
    });
  }

  private needSmallMode(): boolean {
    return this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getSmallScreenWidth();
  }

  private needMediumMode(): boolean {
    return this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getMediumScreenWidth();
  }
}
