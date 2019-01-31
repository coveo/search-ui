import { $$ } from '../../../utils/Dom';
import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { SVGDom } from '../../../utils/SVGDom';
import { INoNameFacetOptions } from '../NoNameFacetOptions';
import { NoNameFacetHeaderClear } from './NoNameFacetHeaderClear';
import { NoNameFacetHeaderCollapseToggle } from './NoNameFacetHeaderCollapseToggle';
import { NoNameFacetHeaderOperatorToggle } from './NoNameFacetHeaderOperatorToggle';

export interface INoNameFacetHeaderOptions {
  rootFacetOptions: INoNameFacetOptions;
}

export class NoNameFacetHeader {
  public element: HTMLElement;
  private waitAnimationElement: HTMLElement;
  private clearButton: NoNameFacetHeaderClear;
  private operatorToggle: NoNameFacetHeaderOperatorToggle;
  private collapseToggle: NoNameFacetHeaderCollapseToggle;

  constructor(private options: INoNameFacetHeaderOptions) {
    this.element = $$('div', { className: 'coveo-facet-header' }).el;
    $$(this.element).append(this.createTitleSection());
    $$(this.element).append(this.createSettingsSection());
  }

  private createTitleSection() {
    const section = $$('div', { className: 'coveo-facet-header-title-section' });

    section.append(this.createTitle());

    this.waitAnimationElement = this.createWaitAnimation();
    section.append(this.waitAnimationElement);
    this.toggleLoading(false);

    return section.el;
  }

  private createSettingsSection() {
    const { useAnd, isCollapsed, enableCollapse, enableOperator } = this.options.rootFacetOptions;
    const section = $$('div', { className: 'coveo-facet-header-settings-section' });

    this.clearButton = new NoNameFacetHeaderClear();
    section.append(this.clearButton.create());

    this.operatorToggle = new NoNameFacetHeaderOperatorToggle({ useAnd });
    enableOperator && section.append(this.operatorToggle.create());

    this.collapseToggle = new NoNameFacetHeaderCollapseToggle({ isCollapsed });
    enableCollapse && section.append(this.collapseToggle.create());

    return section.el;
  }

  private createTitle() {
    const title = $$('div', { className: 'coveo-facet-header-title' }, this.options.rootFacetOptions.title);
    title.setAttribute('role', 'heading');
    title.setAttribute('aria-level', '2');
    title.setAttribute('aria-label', `${l('FacetTitle', this.options.rootFacetOptions.title)}`);
    return title.el;
  }

  private createWaitAnimation() {
    const waitAnimationElement = $$('div', { className: 'coveo-facet-header-wait-animation' }, SVGIcons.icons.loading).el;
    SVGDom.addClassToSVGInContainer(waitAnimationElement, 'coveo-facet-header-wait-animation-svg');
    return waitAnimationElement;
  }

  public toggleClear(visible: boolean) {
    this.clearButton.toggle(visible);
  }

  public toggleLoading(visible: boolean) {
    $$(this.waitAnimationElement).toggle(visible);
  }
}
