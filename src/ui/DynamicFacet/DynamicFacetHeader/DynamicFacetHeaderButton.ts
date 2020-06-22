import { $$, Dom } from '../../../utils/Dom';
import { SVGDom } from '../../../utils/SVGDom';

export interface IDynamicFacetHeaderButtonOptions {
  label: string;
  ariaLabel?: string;
  shouldDisplay?: boolean;
  className?: string;
  iconSVG?: string;
  iconClassName?: string;
  action?: () => void;
}

export class DynamicFacetHeaderButton {
  private button: Dom;
  public element: HTMLElement;

  constructor(private rootOptions: IDynamicFacetHeaderButtonOptions) {
    this.create();
  }

  private create() {
    const hasIcon = this.rootOptions.iconSVG && this.rootOptions.iconClassName;

    this.button = $$(
      'button',
      {
        className: `coveo-dynamic-facet-header-btn ${this.rootOptions.className || ''}`.trim(),
        type: 'button'
      },
      hasIcon ? this.rootOptions.iconSVG : this.rootOptions.label
    );

    this.rootOptions.action && this.button.on('click', this.rootOptions.action);

    if (hasIcon) {
      this.button.setAttribute('aria-label', this.rootOptions.label);
      this.button.setAttribute('title', this.rootOptions.label);
      SVGDom.addClassToSVGInContainer(this.button.el, this.rootOptions.iconClassName);
    }

    if (this.rootOptions.ariaLabel) {
      this.button.setAttribute('aria-label', this.rootOptions.ariaLabel);
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
