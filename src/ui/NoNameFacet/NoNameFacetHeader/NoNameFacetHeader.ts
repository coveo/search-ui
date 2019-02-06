import { debounce } from 'underscore';
import { $$ } from '../../../utils/Dom';
import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { SVGDom } from '../../../utils/SVGDom';
import { INoNameFacetOptions } from '../NoNameFacetOptions';
import { NoNameFacetHeaderClear } from './NoNameFacetHeaderClear';
import { NoNameFacetHeaderCollapseToggle } from './NoNameFacetHeaderCollapseToggle';

export { Cancelable } from 'underscore';

export class NoNameFacetHeader {
  public static showLoadingDelay = 2000;
  public element: HTMLElement;
  private waitAnimationElement: HTMLElement;
  private clearButton: NoNameFacetHeaderClear;
  private collapseToggle: NoNameFacetHeaderCollapseToggle;

  constructor(private options: INoNameFacetOptions) {
    this.element = $$('div', { className: 'coveo-facet-header' }).el;
    $$(this.element).append(this.createTitleSection());
    $$(this.element).append(this.createSettingsSection());
  }

  private createTitleSection() {
    const section = $$('div', { className: 'coveo-facet-header-title-section' });

    section.append(this.createTitle());

    this.waitAnimationElement = this.createWaitAnimation();
    section.append(this.waitAnimationElement);
    this.hideLoading();

    return section.el;
  }

  private createSettingsSection() {
    const section = $$('div', { className: 'coveo-facet-header-settings-section' });

    this.clearButton = new NoNameFacetHeaderClear();
    section.append(this.clearButton.create());

    this.collapseToggle = new NoNameFacetHeaderCollapseToggle({ collapsed: this.options.collapsedByDefault });
    this.options.enableCollapse && section.append(this.collapseToggle.create());

    return section.el;
  }

  private createTitle() {
    const title = $$('div', { className: 'coveo-facet-header-title' }, this.options.title);
    title.setAttribute('role', 'heading');
    title.setAttribute('aria-level', '2');
    title.setAttribute('aria-label', `${l('FacetTitle', this.options.title)}`);
    return title.el;
  }

  private createWaitAnimation() {
    const waitAnimationElement = $$('div', { className: 'coveo-facet-header-wait-animation' }, SVGIcons.icons.loading).el;
    SVGDom.addClassToSVGInContainer(waitAnimationElement, 'coveo-facet-header-wait-animation-svg');
    return waitAnimationElement;
  }

  public showClear() {
    this.clearButton.toggle(true);
  }

  public hideClear() {
    this.clearButton.toggle(false);
  }

  public showLoading: Function & Cancelable = debounce(
    () => $$(this.waitAnimationElement).toggle(true),
    NoNameFacetHeader.showLoadingDelay
  );

  public hideLoading() {
    this.showLoading.cancel();
    $$(this.waitAnimationElement).toggle(false);
  }
}
