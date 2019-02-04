import { $$ } from '../../../utils/Dom';
import { NoNameFacetHeaderCollapse } from './NoNameFacetHeaderCollapse';
import { NoNameFacetHeaderExpand } from './NoNameFacetHeaderExpand';

export interface INoNameFacetCollapseToggleOptions {
  collapsed: boolean;
}

export class NoNameFacetHeaderCollapseToggle {
  private collapseButton: NoNameFacetHeaderCollapse;
  private expandButton: NoNameFacetHeaderExpand;

  constructor(private options: INoNameFacetCollapseToggleOptions) {
    this.collapseButton = new NoNameFacetHeaderCollapse({ onClick: this.collapse });
    this.expandButton = new NoNameFacetHeaderExpand({ onClick: this.expand });
  }

  public create() {
    const parent = $$('div');
    parent.append(this.collapseButton.create());
    parent.append(this.expandButton.create());
    this.toggle(this.options.collapsed);

    return parent.el;
  }

  private toggle = (collapsed: boolean) => {
    this.collapseButton.toggle(!collapsed);
    this.expandButton.toggle(collapsed);
  };

  private collapse = () => {
    this.toggle(true);
    // TODO: collapse facet
  };

  private expand = () => {
    this.toggle(false);
    // TODO: expand facet
  };
}
