import { $$ } from '../../../utils/Dom';
import { SVGDom } from '../../../utils/SVGDom';

export interface INoNameFacetHeaderButtonOptions {
  label: string;
  action?: () => void;
  shouldDisplay: boolean;
  className: string;
  iconSVG: string;
  iconClassName: string;
  // Will use and additionnal span around the SVG
  iconElementClassName?: string;
}

export abstract class NoNameFacetHeaderButton {
  private element: HTMLElement;
  constructor(private rootOptions: INoNameFacetHeaderButtonOptions) {}

  public create() {
    const button = $$('button', { className: this.rootOptions.className });
    button.setAttribute('aria-label', this.rootOptions.label);
    button.setAttribute('title', this.rootOptions.label);
    button.on('click', () => this.onClick());

    this.element = button.el;

    if (this.rootOptions.iconElementClassName) {
      const iconElement = $$('span', { className: this.rootOptions.iconElementClassName }, this.rootOptions.iconSVG).el;
      button.append(iconElement);
    } else {
      this.element.innerHTML += this.rootOptions.iconSVG;
    }

    SVGDom.addClassToSVGInContainer(this.element, this.rootOptions.iconClassName);
    this.toggle(this.rootOptions.shouldDisplay);
    return this.element;
  }

  public toggle(shouldDisplay: boolean) {
    $$(this.element).toggle(shouldDisplay);
  }

  protected abstract onClick(): void;
}
