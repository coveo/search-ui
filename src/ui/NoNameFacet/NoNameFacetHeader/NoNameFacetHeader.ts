import { $$, Dom } from '../../../utils/Dom';
import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { SVGDom } from '../../../utils/SVGDom';
import { INoNameFacetOptions } from '../NoNameFacetOptions';
import { NoNameFacetHeaderButton } from './NoNameFacetHeaderButton';
import { NoNameFacetHeaderCollapseToggle } from './NoNameFacetHeaderCollapseToggle';

export class NoNameFacetHeader {
  public static showLoadingDelay = 2000;
  public element: HTMLElement;
  private waitAnimation: Dom;
  private clearButton: NoNameFacetHeaderButton;
  private collapseToggle: NoNameFacetHeaderCollapseToggle;
  private showLoadingTimeout: number;

  constructor(private options: INoNameFacetOptions) {
    this.element = $$('div', { className: 'coveo-facet-header' }).el;
    $$(this.element).append(this.createTitleSection());
    $$(this.element).append(this.createSettingsSection());
  }

  private createTitleSection() {
    const section = $$('div', { className: 'coveo-facet-header-title-section' });

    section.append(this.createTitle());
    section.append(this.createWaitAnimation());

    return section.el;
  }

  private createSettingsSection() {
    const section = $$('div', { className: 'coveo-facet-header-settings-section' });

    section.append(this.createClearButton());
    this.options.enableCollapse && section.append(this.createCollapseToggle());

    return section.el;
  }

  private createClearButton() {
    this.clearButton = new NoNameFacetHeaderButton({
      label: l('Reset'),
      className: 'coveo-facet-header-eraser coveo-facet-header-eraser-visible',
      iconSVG: SVGIcons.icons.mainClear,
      iconClassName: 'coveo-facet-header-eraser-svg',
      shouldDisplay: false,
      action: this.hideClear
    });

    return this.clearButton.element;
  }

  private createCollapseToggle() {
    this.collapseToggle = new NoNameFacetHeaderCollapseToggle({ collapsed: this.options.collapsedByDefault });
    return this.collapseToggle.element;
  }

  private createTitle() {
    const title = $$('div', { className: 'coveo-facet-header-title' }, this.options.title);
    title.setAttribute('role', 'heading');
    title.setAttribute('aria-level', '2');
    title.setAttribute('aria-label', `${l('FacetTitle', this.options.title)}`);

    return title.el;
  }

  private createWaitAnimation() {
    this.waitAnimation = $$('div', { className: 'coveo-facet-header-wait-animation' }, SVGIcons.icons.loading);
    SVGDom.addClassToSVGInContainer(this.waitAnimation.el, 'coveo-facet-header-wait-animation-svg');
    this.hideLoading();

    return this.waitAnimation.el;
  }

  public showClear = () => {
    this.clearButton.toggle(true);
  };

  public hideClear = () => {
    this.clearButton.toggle(false);
  };

  public showLoading = () => {
    clearTimeout(this.showLoadingTimeout);
    this.showLoadingTimeout = window.setTimeout(
      () => (this.waitAnimation.el.style.visibility = 'visible'),
      NoNameFacetHeader.showLoadingDelay
    );
  };

  public hideLoading = () => {
    clearTimeout(this.showLoadingTimeout);
    this.waitAnimation.el.style.visibility = 'hidden';
  };
}
