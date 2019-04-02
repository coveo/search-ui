import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { $$ } from '../../../utils/Dom';
import { MLFacetHeaderButton } from './MLFacetHeaderButton';
import { MLFacet } from '../MLFacet';

export interface IMLFacetCollapseToggleOptions {
  collapsed: boolean;
}

export class MLFacetHeaderCollapseToggle {
  public element: HTMLElement;
  private collapseButton: MLFacetHeaderButton;
  private expandButton: MLFacetHeaderButton;
  private collapsed: boolean;

  constructor(private facet: MLFacet, private options: IMLFacetCollapseToggleOptions) {
    this.collapsed = this.options.collapsed;
    this.create();
  }

  private create() {
    const parent = $$('div');

    this.collapseButton = new MLFacetHeaderButton({
      label: l('Collapse'),
      iconSVG: SVGIcons.icons.arrowUp,
      iconClassName: 'coveo-ml-facet-collapse-toggle-svg',
      className: 'coveo-ml-facet-header-collapse',
      shouldDisplay: true,
      action: () => this.toggle()
    });
    this.expandButton = new MLFacetHeaderButton({
      label: l('Expand'),
      iconSVG: SVGIcons.icons.arrowDown,
      iconClassName: 'coveo-ml-facet-collapse-toggle-svg',
      className: 'coveo-ml-facet-header-expand',
      shouldDisplay: true,
      action: () => this.toggle()
    });

    parent.append(this.collapseButton.element);
    parent.append(this.expandButton.element);
    this.updateVisibility();

    this.element = parent.el;
  }

  public toggle() {
    this.collapsed = !this.collapsed;
    this.updateVisibility();
  }

  private updateVisibility() {
    this.collapseButton.toggle(!this.collapsed);
    this.expandButton.toggle(this.collapsed);
    $$(this.facet.element).toggleClass('coveo-ml-facet-collapsed', this.collapsed);
  }
}
