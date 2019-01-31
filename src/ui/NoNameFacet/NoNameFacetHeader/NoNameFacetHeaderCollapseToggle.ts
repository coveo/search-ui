import { $$ } from '../../../utils/Dom';
import { NoNameFacetHeaderCollapse } from './NoNameFacetHeaderCollapse';
import { NoNameFacetHeaderExpand } from './NoNameFacetHeaderExpand';

export interface INoNameFacetCollapseToggleOptions {
  isCollapsed: boolean;
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
    this.toggle(this.options.isCollapsed);

    return parent.el;
  }

  private toggle = (isCollapsed: boolean) => {
    this.collapseButton.toggle(!isCollapsed);
    this.expandButton.toggle(isCollapsed);
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
