import 'styling/MLFacet/_MLFacetHeader';
import { $$, Dom } from '../../../utils/Dom';
import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { SVGDom } from '../../../utils/SVGDom';
import { MLFacet } from '../MLFacet';
import { MLFacetHeaderButton } from './MLFacetHeaderButton';
import { MLFacetHeaderCollapseToggle } from './MLFacetHeaderCollapseToggle';

export class MLFacetHeader {
  public static showLoadingDelay = 2000;
  public element: HTMLElement;
  private waitAnimation: Dom;
  private clearButton: MLFacetHeaderButton;
  private collapseToggle: MLFacetHeaderCollapseToggle;
  private showLoadingTimeout: number;

  constructor(private facet: MLFacet) {
    this.element = $$('div', { className: 'coveo-ml-facet-header' }).el;
    const titleElement = this.createTitle();
    $$(this.element).append(titleElement);
    $$(this.element).append(this.createWaitAnimation());
    $$(this.element).append(this.createClearButton());
    this.facet.options.enableCollapse && $$(this.element).append(this.createCollapseToggle());
  }

  private createClearButton() {
    this.clearButton = new MLFacetHeaderButton({
      label: l('Clear'),
      className: 'coveo-ml-facet-header-clear',
      shouldDisplay: false,
      action: () => this.clear()
    });

    return this.clearButton.element;
  }

  private clear() {
    this.facet.reset();
    this.facet.triggerNewQuery();
  }

  private createCollapseToggle() {
    this.collapseToggle = new MLFacetHeaderCollapseToggle({ collapsed: this.facet.options.collapsedByDefault });
    return this.collapseToggle.element;
  }

  private createTitle() {
    const title = $$(
      'h2',
      {
        className: 'coveo-ml-facet-header-title',
        ariaLabel: `${l('FacetTitle', this.facet.options.title)}`
      },
      $$('span', { ariaHidden: true, title: this.facet.options.title }, this.facet.options.title)
    );

    return title.el;
  }

  private createWaitAnimation() {
    this.waitAnimation = $$('div', { className: 'coveo-ml-facet-header-wait-animation' }, SVGIcons.icons.loading);
    SVGDom.addClassToSVGInContainer(this.waitAnimation.el, 'coveo-ml-facet-header-wait-animation-svg');
    this.waitAnimation.toggle(false);

    return this.waitAnimation.el;
  }

  public toggleClear(visible: boolean) {
    this.clearButton.toggle(visible);
  }

  public showLoading() {
    clearTimeout(this.showLoadingTimeout);
    this.showLoadingTimeout = window.setTimeout(() => this.waitAnimation.toggle(true), MLFacetHeader.showLoadingDelay);
  }

  public hideLoading() {
    clearTimeout(this.showLoadingTimeout);
    this.waitAnimation.toggle(false);
  }
}
