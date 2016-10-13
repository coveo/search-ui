import {ResponsiveComponentsManager, IResponsiveComponent, IResponsiveComponentOptions} from './ResponsiveComponentsManager'
import {Utils} from '../../utils/Utils';
import {$$, Dom} from '../../utils/Dom';
import {Logger} from '../../misc/Logger';
import {Recommendation} from '../Recommendation/Recommendation';

export class ResponsiveRecommendation implements IResponsiveComponent {

  private static RESPONSIVE_BREAKPOINT = 1000;

  private breakpoint: number;
  private dropdownContent: Dom;
  private dropdownHeader: Dom;

  public static init(root: HTMLElement, component, options: IResponsiveComponentOptions) {
    ResponsiveComponentsManager.register(ResponsiveRecommendation, $$(root), Recommendation.ID, component, options);
  }

  constructor(public coveoRoot: Dom, public ID: string, options: IResponsiveComponentOptions) {
    this.buildDropdownContent();


    if (Utils.isNullOrUndefined(options.responsiveBreakpoint)) {
      this.breakpoint = ResponsiveRecommendation.RESPONSIVE_BREAKPOINT;
    } else {
      this.breakpoint = options.responsiveBreakpoint;
    }
  }

  public handleResizeEvent(): void {
    if (this.needSmallMode()) {
      this.changeToSmallMode();
    } else {
      this.changeToLargeMode();
    }
  }

  public needTabSection(): boolean {
    return this.needSmallMode();
  }

  private needSmallMode(): boolean {
    return this.coveoRoot.width() <= this.breakpoint;
  }

  private changeToSmallMode() {

  }

  private changeToLargeMode() {

  }

  private buildDropdownContent() {
    this.dropdownContent = $$(this.coveoRoot.find('.coveo-recommendation-column'));
    if (!this.dropdownContent) {
      this.dropdownContent = $$(this.coveoRoot.find('CoveoRecommendation'));
    }
  }
}
