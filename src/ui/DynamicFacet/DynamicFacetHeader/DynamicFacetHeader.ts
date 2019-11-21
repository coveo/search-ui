import 'styling/DynamicFacet/_DynamicFacetHeader';
import { $$, Dom } from '../../../utils/Dom';
import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { SVGDom } from '../../../utils/SVGDom';
import { DynamicFacet } from '../DynamicFacet';
import { DynamicFacetHeaderButton } from './DynamicFacetHeaderButton';
import { DynamicFacetHeaderCollapseToggle } from './DynamicFacetHeaderCollapseToggle';
import { analyticsActionCauseList } from '../../Analytics/AnalyticsActionListMeta';

export class DynamicFacetHeader {
  public static showLoadingDelay = 2000;
  public element: HTMLElement;
  private title: Dom;
  private waitAnimation: Dom;
  private clearButton: DynamicFacetHeaderButton;
  private collapseToggle: DynamicFacetHeaderCollapseToggle;
  private showLoadingTimeout: number;

  constructor(private facet: DynamicFacet) {
    this.element = $$('div', { className: 'coveo-dynamic-facet-header' }).el;
    this.title = this.createTitle();
    $$(this.element).append(this.title.el);
    $$(this.element).append(this.createWaitAnimation());
    $$(this.element).append(this.createClearButton());
    this.facet.options.enableCollapse && this.enableCollapse();
  }

  private createClearButton() {
    this.clearButton = new DynamicFacetHeaderButton({
      label: l('Clear'),
      ariaLabel: l('Clear', this.facet.options.title),
      className: 'coveo-dynamic-facet-header-clear',
      shouldDisplay: false,
      action: () => this.clear()
    });

    return this.clearButton.element;
  }

  private clear() {
    this.facet.reset();
    this.facet.enableFreezeFacetOrderFlag();
    this.facet.scrollToTop();
    this.facet.triggerNewQuery(() => this.logClearAllToAnalytics());
  }

  private logClearAllToAnalytics() {
    this.facet.logAnalyticsEvent(analyticsActionCauseList.dynamicFacetClearAll, this.facet.basicAnalyticsFacetMeta);
  }

  private createCollapseToggle() {
    this.collapseToggle = new DynamicFacetHeaderCollapseToggle(this.facet);
    return this.collapseToggle.element;
  }

  private enableCollapse() {
    $$(this.element).append(this.createCollapseToggle());
    $$(this.title).addClass('coveo-clickable');
    $$(this.title).on('click', () => this.facet.toggleCollapse());
  }

  public toggleCollapse(isCollapsed: boolean) {
    this.facet.options.enableCollapse && this.collapseToggle.toggleButtons(isCollapsed);
  }

  private createTitle() {
    return $$(
      'h2',
      {
        className: 'coveo-dynamic-facet-header-title',
        ariaLabel: `${l('FacetTitle', this.facet.options.title)}`
      },
      $$('span', { ariaHidden: true, title: this.facet.options.title }, this.facet.options.title)
    );
  }

  private createWaitAnimation() {
    this.waitAnimation = $$('div', { className: 'coveo-dynamic-facet-header-wait-animation' }, SVGIcons.icons.loading);
    SVGDom.addClassToSVGInContainer(this.waitAnimation.el, 'coveo-dynamic-facet-header-wait-animation-svg');
    this.waitAnimation.toggle(false);

    return this.waitAnimation.el;
  }

  public toggleClear(visible: boolean) {
    this.clearButton.toggle(visible);
  }

  public showLoading() {
    clearTimeout(this.showLoadingTimeout);
    this.showLoadingTimeout = window.setTimeout(() => this.waitAnimation.toggle(true), DynamicFacetHeader.showLoadingDelay);
  }

  public hideLoading() {
    clearTimeout(this.showLoadingTimeout);
    this.waitAnimation.toggle(false);
  }
}
