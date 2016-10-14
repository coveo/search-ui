import {ResponsiveComponentsManager, IResponsiveComponent, IResponsiveComponentOptions} from './ResponsiveComponentsManager'
import {Utils} from '../../utils/Utils';
import {$$, Dom} from '../../utils/Dom';
import {Logger} from '../../misc/Logger';
import {Recommendation} from '../Recommendation/Recommendation';
import {Dropdown} from './Dropdown';
import {l} from '../../strings/Strings';

export class ResponsiveRecommendation implements IResponsiveComponent {

  private static DROPDOWN_MIN_WIDTH: number = 300;
  private static DROPDOWN_WIDTH_RATIO: number = 0.35; // Used to set the width relative to the coveo root.
  public static RESPONSIVE_BREAKPOINT = 1000;

  public coveoRoot: Dom;

  private breakpoint: number;
  private dropdown: Dropdown;
  private logger: Logger;

  public static init(root: HTMLElement, component, options: IResponsiveComponentOptions) {
    ResponsiveComponentsManager.register(ResponsiveRecommendation, $$(root), Recommendation.ID, component, options);
  }

  constructor(coveoRoot: Dom, public ID: string, options: IResponsiveComponentOptions) {
    this.logger = new Logger(this);
    this.coveoRoot = this.findParentRootOfRecommendationComponent(coveoRoot);
    if (!this.coveoRoot) {
      this.logger.info('Recommendation component has no parent interface. Disabling responsive mode.');
      return;
    }
    this.dropdown = this.buildDropdown();
    this.breakpoint = this.defineResponsiveBreakpoint(options);
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
    this.dropdown.close();
    $$(this.coveoRoot.find('.coveo-dropdown-header-wrapper')).el.appendChild(this.dropdown.dropdownHeader.element.el);
  }

  private changeToLargeMode() {
    this.dropdown.cleanUp();
  }

  private buildDropdown(): Dropdown {
    let dropdownContent = this.buildDropdownContent();
    let dropdownHeader = this.buildDropdownHeader();
    let dropdown = new Dropdown('recommendation', dropdownContent, dropdownHeader, this.coveoRoot, ResponsiveRecommendation.DROPDOWN_MIN_WIDTH, ResponsiveRecommendation.DROPDOWN_WIDTH_RATIO);
    return dropdown;
  }

  private buildDropdownHeader(): Dom {
    let dropdownHeader = $$('a');
    let content = $$('p');
    content.text(l('Recommendation'));
    dropdownHeader.el.appendChild(content.el);
    return dropdownHeader;
  }

  private buildDropdownContent(): Dom {
    let dropdownContent;
    let recommendationColumn = this.coveoRoot.find('.coveo-recommendation-column');
    if (recommendationColumn) {
      dropdownContent = $$(recommendationColumn);
    } else {
      dropdownContent = $$(this.coveoRoot.find('.CoveoRecommendation'));
    }
    return dropdownContent;
  }

  private defineResponsiveBreakpoint(options: IResponsiveComponentOptions): number {
    let breakpoint;
    if (Utils.isNullOrUndefined(options.responsiveBreakpoint)) {
      breakpoint = ResponsiveRecommendation.RESPONSIVE_BREAKPOINT;
    } else {
      breakpoint = options.responsiveBreakpoint;
    }
    return breakpoint;
  }

  private findParentRootOfRecommendationComponent(root: Dom): Dom {
    let coveoRoot = root.parents('CoveoSearchInterface');
    if (coveoRoot[0]) {
      return $$(coveoRoot[0]);
    }
    return null;
  }
}
