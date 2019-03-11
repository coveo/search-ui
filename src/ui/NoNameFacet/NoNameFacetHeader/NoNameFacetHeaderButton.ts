import { $$, Dom } from '../../../utils/Dom';
import { SVGDom } from '../../../utils/SVGDom';

export interface INoNameFacetHeaderButtonOptions {
  label: string;
  shouldDisplay?: boolean;
  className?: string;
  iconSVG?: string;
  iconClassName?: string;
  action?: () => void;
}

export class NoNameFacetHeaderButton {
  private button: Dom;
  public element: HTMLElement;

  constructor(private rootOptions: INoNameFacetHeaderButtonOptions) {
    this.create();
  }

  private create() {
    const hasIcon = this.rootOptions.iconSVG && this.rootOptions.iconClassName;

    this.button = $$(
      'button',
      { className: this.rootOptions.className || '' },
      hasIcon ? this.rootOptions.iconSVG : this.rootOptions.label
    );

    this.rootOptions.action && this.button.on('click', this.rootOptions.action);

    if (hasIcon) {
      this.button.setAttribute('aria-label', this.rootOptions.label);
      this.button.setAttribute('title', this.rootOptions.label);
      SVGDom.addClassToSVGInContainer(this.button.el, this.rootOptions.iconClassName);
    }

    if (this.rootOptions.shouldDisplay !== undefined) {
      this.toggle(this.rootOptions.shouldDisplay);
    }

    this.element = this.button.el;
  }

  public toggle(shouldDisplay: boolean) {
    this.button.toggle(shouldDisplay);
  }
}
