import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { $$ } from '../../../utils/Dom';
import { NoNameFacetHeaderButton } from './NoNameFacetHeaderButton';

export interface INoNameFacetCollapseToggleOptions {
  collapsed: boolean;
}

export class NoNameFacetHeaderCollapseToggle {
  public element: HTMLElement;
  private collapseButton: NoNameFacetHeaderButton;
  private expandButton: NoNameFacetHeaderButton;

  constructor(private options: INoNameFacetCollapseToggleOptions) {
    this.create();
  }

  private create() {
    const parent = $$('div');

    this.collapseButton = new NoNameFacetHeaderButton({
      label: l('Collapse'),
      className: 'coveo-facet-header-collapse',
      iconSVG: SVGIcons.icons.facetCollapse,
      iconClassName: 'coveo-facet-settings-section-hide-svg',
      shouldDisplay: true,
      action: () => this.collapse()
    });
    this.expandButton = new NoNameFacetHeaderButton({
      label: l('Expand'),
      className: 'coveo-facet-header-expand',
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
