import { $$, Dom } from '../../../utils/Dom';
import { SVGDom } from '../../../utils/SVGDom';

export interface IMLFacetHeaderButtonOptions {
  label: string;
  shouldDisplay?: boolean;
  className?: string;
  iconSVG?: string;
  iconClassName?: string;
  action?: () => void;
}

export class MLFacetHeaderButton {
  private button: Dom;
  public element: HTMLElement;

  constructor(private rootOptions: IMLFacetHeaderButtonOptions) {
    this.create();
  }

  private create() {
    const hasIcon = this.rootOptions.iconSVG && this.rootOptions.iconClassName;

    this.button = $$(
      'button',
      { className: `coveo-ml-facet-header-btn ${this.rootOptions.className || ''}`.trim() },
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
