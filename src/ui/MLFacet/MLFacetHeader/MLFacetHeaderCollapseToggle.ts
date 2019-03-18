import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { $$ } from '../../../utils/Dom';
import { MLFacetHeaderButton } from './MLFacetHeaderButton';

export interface IMLFacetCollapseToggleOptions {
  collapsed: boolean;
}

export class MLFacetHeaderCollapseToggle {
  public element: HTMLElement;
  private collapseButton: MLFacetHeaderButton;
  private expandButton: MLFacetHeaderButton;

  constructor(private options: IMLFacetCollapseToggleOptions) {
    this.create();
  }

  private create() {
    const parent = $$('div');

    this.collapseButton = new MLFacetHeaderButton({
      label: l('Collapse'),
      className: 'coveo-ml-facet-header-collapse',
      iconSVG: SVGIcons.icons.facetCollapse,
      iconClassName: 'coveo-facet-settings-section-hide-svg',
      shouldDisplay: true,
      action: () => this.collapse()
    });
    this.expandButton = new MLFacetHeaderButton({
      label: l('Expand'),
      className: 'coveo-ml-facet-header-expand',
      iconSVG: SVGIcons.icons.facetExpand,
      iconClassName: 'coveo-facet-settings-section-show-svg',
      shouldDisplay: true,
      action: () => this.expand()
    });

    parent.append(this.collapseButton.element);
    parent.append(this.expandButton.element);
    this.toggle(this.options.collapsed);

    this.element = parent.el;
  }

  private toggle = (collapsed: boolean) => {
    this.collapseButton.toggle(!collapsed);
    this.expandButton.toggle(collapsed);
  };

  private collapse() {
    this.toggle(true);
    // TODO: collapse facet
  }

  private expand() {
    this.toggle(false);
    // TODO: expand facet
  }
}
