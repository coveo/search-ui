import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { INoNameFacetOptions } from './NoNameFacet';

export interface INoNameFacetHeaderOptions {
  title: string;
  rootFacetOptions: INoNameFacetOptions;
}

export class NoNameFacetHeader {
  public element: HTMLElement;
  private waitAnimationElement: HTMLElement;
  private clearElement: HTMLElement;
  private operatorElement: HTMLElement;

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

    return settingsSection.el;
  }

  private createTitle() {
    const title = $$('div', { className: 'coveo-facet-header-title' }, this.options.title);
    title.setAttribute('role', 'heading');
    title.setAttribute('aria-level', '2');
    title.setAttribute('aria-label', `${l('FacetTitle', this.options.title)}.`);
    return title.el;
  }

  private createWaitAnimation() {
    const waitAnimationElement = $$('div', { className: 'coveo-facet-header-wait-animation' }, SVGIcons.icons.loading).el;
    SVGDom.addClassToSVGInContainer(waitAnimationElement, 'coveo-facet-header-wait-animation-svg');
    return waitAnimationElement;
  }

  private createClear() {
    const clearElement = $$('div', { className: 'coveo-facet-header-eraser' }, SVGIcons.icons.mainClear).el;
    SVGDom.addClassToSVGInContainer(clearElement, 'coveo-facet-header-eraser-svg');

    new AccessibleButton()
      .withElement(clearElement)
      .withLabel(l('Reset'))
      .withTitle(l('Reset'))
      .withSelectAction(this.clearAction)
      .build();

    return clearElement;
  }

  private createOperator() {
    const { useAnd, enableTogglingOperator } = this.options.rootFacetOptions;
    const label = l('SwitchTo', useAnd ? l('Or') : l('And'));

    const operatorElement = $$('div', { className: 'coveo-facet-header-operator' }).el;
    const orAndIconElement = $$('span', { className: 'coveo-' + (useAnd ? 'and' : 'or') }, SVGIcons.icons.orAnd).el;
    operatorElement.appendChild(orAndIconElement);
    SVGDom.addClassToSVGInContainer(orAndIconElement, 'coveo-or-and-svg');

    new AccessibleButton()
      .withElement(operatorElement)
      .withTitle(label)
      .withLabel(label)
      .withSelectAction(this.toggleOperatorAction)
      .build();

    $$(operatorElement).toggle(enableTogglingOperator);
    return operatorElement;
  }

  private recreateOperator() {
    $$(this.operatorElement).replaceWith(this.createOperator());
  }

  private clearAction() {}

  private toggleOperatorAction() {}

  public switchToAnd(): void {
    this.options.rootFacetOptions.useAnd = true;
    this.recreateOperator();
  }

  public switchToOr(): void {
    this.options.rootFacetOptions.useAnd = false;
    this.recreateOperator();
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
