import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { $$ } from '../../../utils/Dom';
import { DynamicFacetHeaderButton } from './DynamicFacetHeaderButton';
import { IDynamicFacetHeaderOptions } from './DynamicFacetHeader';
import { SVGDom } from '../../../utils/SVGDom';

export interface IDynamicFacetCollapseToggleOptions {
  collapsed: boolean;
}

export class DynamicFacetHeaderCollapseToggle {
  public element: HTMLElement;
  private button: DynamicFacetHeaderButton;

  constructor(private options: IDynamicFacetHeaderOptions) {
    this.create();
  }

  private create() {
    const parent = $$('div');

    this.button = new DynamicFacetHeaderButton({
      label: l('CollapseFacet', this.options.title),
      iconSVG: SVGIcons.icons.arrowUp,
      iconClassName: 'coveo-dynamic-facet-collapse-toggle-svg',
      className: 'coveo-dynamic-facet-header-collapse',
      shouldDisplay: true,
      action: () => this.options.toggleCollapse()
    });

    parent.append(this.button.element);
    this.element = parent.el;
  }

  public toggleButtons(isCollapsed: boolean) {
    const node = $$(this.button.element);
    const label = isCollapsed ? l('ExpandFacet', this.options.title) : l('CollapseFacet', this.options.title);
    const icon = isCollapsed ? SVGIcons.icons.arrowDown : SVGIcons.icons.arrowUp;

    node.setAttribute('aria-label', label);
    node.setAttribute('title', label);

    node.toggleClass('coveo-dynamic-facet-header-expand', isCollapsed);
    node.toggleClass('coveo-dynamic-facet-header-collapse', !isCollapsed);

    node.setHtml(icon);
    SVGDom.addClassToSVGInContainer(node.el, 'coveo-dynamic-facet-collapse-toggle-svg');
  }
}
