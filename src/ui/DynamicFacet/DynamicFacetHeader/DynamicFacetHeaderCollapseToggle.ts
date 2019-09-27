import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { $$ } from '../../../utils/Dom';
import { DynamicFacetHeaderButton } from './DynamicFacetHeaderButton';
import { DynamicFacet } from '../DynamicFacet';
import { ICustomHeaderRenderer } from './DynamicFacetHeader';

export interface IDynamicFacetCollapseToggleOptions {
  collapsed: boolean;
}

export class DynamicFacetHeaderCollapseToggle {
  public element: HTMLElement;
  private collapseButton: DynamicFacetHeaderButton;
  private expandButton: DynamicFacetHeaderButton;

  constructor(private facet: DynamicFacet, private customRenderer: ICustomHeaderRenderer) {
    this.create();
  }

  private create() {
    const parent = $$('div');

    this.collapseButton = new DynamicFacetHeaderButton(this.facet, {
      label: l('CollapseFacet', this.facet.options.title),
      iconSVG: SVGIcons.icons.arrowUp,
      iconClassName: 'coveo-dynamic-facet-collapse-toggle-svg',
      className: 'coveo-dynamic-facet-header-collapse',
      shouldDisplay: true,
      action: () => this.facet.collapse(),
      customRenderer: this.customRenderer.renderCollapseButton
    });
    this.expandButton = new DynamicFacetHeaderButton(this.facet, {
      label: l('ExpandFacet', this.facet.options.title),
      iconSVG: SVGIcons.icons.arrowDown,
      iconClassName: 'coveo-dynamic-facet-collapse-toggle-svg',
      className: 'coveo-dynamic-facet-header-expand',
      shouldDisplay: false,
      action: () => this.facet.expand(),
      customRenderer: this.customRenderer.renderExpandButton
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
