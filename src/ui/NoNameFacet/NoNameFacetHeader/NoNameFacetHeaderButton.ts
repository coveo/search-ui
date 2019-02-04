import { $$ } from '../../../utils/Dom';
import { SVGDom } from '../../../utils/SVGDom';

export interface INoNameFacetHeaderButtonOptions {
  label: string;
  action?: () => void;
  shouldDisplay: boolean;
  className: string;
  iconSVG: string;
  iconClassName: string;
}

export abstract class NoNameFacetHeaderButton {
  private element: HTMLElement;
  constructor(private rootOptions: INoNameFacetHeaderButtonOptions) {}

  public create() {
    const button = $$('button', { className: this.rootOptions.className }, this.rootOptions.iconSVG);
    button.setAttribute('aria-label', this.rootOptions.label);
    button.setAttribute('title', this.rootOptions.label);
    button.on('click', () => this.onClick());

    this.element = button.el;
    SVGDom.addClassToSVGInContainer(this.element, this.rootOptions.iconClassName);
    this.toggle(this.rootOptions.shouldDisplay);
    return this.element;
  }

  public toggle(shouldDisplay: boolean) {
    $$(this.element).toggle(shouldDisplay);
  }

  protected abstract onClick(): void;
}
