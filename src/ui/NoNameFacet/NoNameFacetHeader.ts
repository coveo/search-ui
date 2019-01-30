import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import { INoNameFacetOptions } from './NoNameFacetOptions';

export interface INoNameFacetHeaderOptions {
  rootFacetOptions: INoNameFacetOptions;
}

export class NoNameFacetHeader {
  public element: HTMLElement;
  private waitAnimationElement: HTMLElement;
  private clearElement: HTMLElement;
  private operatorElement: HTMLElement;
  private collapseElement: HTMLElement;

  constructor(private options: INoNameFacetHeaderOptions) {
    this.element = $$('div', { className: 'coveo-facet-header' }).el;
    $$(this.element).append(this.createTitleSection());
    $$(this.element).append(this.createSettingsSection());
  }

  private createTitleSection() {
    const titleSection = $$('div', { className: 'coveo-facet-header-title-section' });

    titleSection.append(this.createTitle());

    this.waitAnimationElement = this.createWaitAnimation();
    titleSection.append(this.waitAnimationElement);
    this.hideWaitAnimation();

    return titleSection.el;
  }

  private createSettingsSection() {
    const settingsSection = $$('div', { className: 'coveo-facet-header-settings-section' });

    this.clearElement = this.createClear();
    settingsSection.append(this.clearElement);

    this.operatorElement = this.createOperator();
    settingsSection.append(this.operatorElement);

    this.collapseElement = this.createCollapse();
    settingsSection.append(this.collapseElement);

    return settingsSection.el;
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

  private createClear() {
    const clearBtn = $$('button', { className: 'coveo-facet-header-eraser' }, SVGIcons.icons.mainClear);
    SVGDom.addClassToSVGInContainer(clearBtn.el, 'coveo-facet-header-eraser-svg');

    clearBtn.setAttribute('aria-label', l('Reset'));
    clearBtn.setAttribute('title', l('Reset'));

    clearBtn.on('click', this.clearAction);

    return clearBtn.el;
  }

  private createOperator() {
    const { useAnd, enableTogglingOperator } = this.options.rootFacetOptions;
    const operatorBtn = $$('button', { className: 'coveo-facet-header-operator' });
    const orAndIconElement = $$('span', { className: 'coveo-' + (useAnd ? 'and' : 'or') }, SVGIcons.icons.orAnd).el;
    SVGDom.addClassToSVGInContainer(orAndIconElement, 'coveo-or-and-svg');
    operatorBtn.append(orAndIconElement);

    const label = l('SwitchTo', useAnd ? l('Or') : l('And'));
    operatorBtn.setAttribute('aria-label', label);
    operatorBtn.setAttribute('title', label);

    operatorBtn.on('click', this.toggleOperatorAction);
    operatorBtn.toggle(enableTogglingOperator);

    return operatorBtn.el;
  }

  private recreateOperator() {
    const newElement = this.createOperator();
    $$(this.operatorElement).replaceWith(newElement);
    this.operatorElement = newElement;
  }

  private createCollapse() {
    const { enableTogglingCollapse, isCollapsed } = this.options.rootFacetOptions;
    const svgIcon = isCollapsed ? SVGIcons.icons.facetExpand : SVGIcons.icons.facetCollapse;
    const collapseBtn = $$('button', { className: 'coveo-facet-header-collapse' }, svgIcon);
    const className = `coveo-facet-settings-section-${isCollapsed ? 'show' : 'hide'}-svg`;
    SVGDom.addClassToSVGInContainer(collapseBtn.el, className);

    const label = isCollapsed ? l('Expand') : l('Collapse');
    collapseBtn.setAttribute('aria-label', label);
    collapseBtn.setAttribute('title', label);

    collapseBtn.on('click', this.toggleCollapseAction);
    collapseBtn.toggle(enableTogglingCollapse);

    return collapseBtn.el;
  }

  private recreateCollapse() {
    const newElement = this.createCollapse();
    $$(this.collapseElement).replaceWith(newElement);
    this.collapseElement = newElement;
  }

  private clearAction = () => {};

  private toggleOperatorAction = () => {
    this.options.rootFacetOptions.useAnd = !this.options.rootFacetOptions.useAnd;
    this.recreateOperator();
  };

  private toggleCollapseAction = () => {
    this.options.rootFacetOptions.isCollapsed = !this.options.rootFacetOptions.isCollapsed;
    this.recreateCollapse();
  };

  public switchToAnd() {
    this.options.rootFacetOptions.useAnd = true;
    this.recreateOperator();
  }

  public switchToOr() {
    this.options.rootFacetOptions.useAnd = false;
    this.recreateOperator();
  }

  public collapse() {
    this.options.rootFacetOptions.isCollapsed = true;
    this.recreateCollapse();
  }

  public expand() {
    this.options.rootFacetOptions.isCollapsed = false;
    this.recreateCollapse();
  }

  public showWaitAnimation() {
    $$(this.waitAnimationElement).toggle(true);
  }

  public hideWaitAnimation() {
    $$(this.waitAnimationElement).toggle(false);
  }

  public showClear() {
    $$(this.clearElement).toggleClass('coveo-facet-header-eraser-visible', true);
  }

  public hideClear() {
    $$(this.clearElement).toggleClass('coveo-facet-header-eraser-visible', false);
  }
}
