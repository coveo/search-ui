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

  constructor(private facet: MLFacet) {
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
      action: () => this.facet.collapse()
    });
    this.expandButton = new MLFacetHeaderButton({
      label: l('Expand'),
      iconSVG: SVGIcons.icons.arrowDown,
      iconClassName: 'coveo-ml-facet-collapse-toggle-svg',
      className: 'coveo-ml-facet-header-expand',
      shouldDisplay: false,
      action: () => this.facet.expand()
    });

    parent.append(this.collapseButton.element);
    parent.append(this.expandButton.element);

    this.element = parent.el;
  }

  public toggleButtons(isCollapsed: boolean) {
    this.collapseButton.toggle(!isCollapsed);
    this.expandButton.toggle(isCollapsed);
  }
}
