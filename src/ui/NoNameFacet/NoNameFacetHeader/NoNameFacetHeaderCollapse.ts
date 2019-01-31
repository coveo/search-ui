import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { NoNameFacetHeaderButton } from './NoNameFacetHeaderButton';

export interface INoNameFacetHeaderCollapseOptions {
  onClick: () => void;
}

export class NoNameFacetHeaderCollapse extends NoNameFacetHeaderButton {
  constructor(private options: INoNameFacetHeaderCollapseOptions) {
    super({
      label: l('Collapse'),
      className: 'coveo-facet-header-collapse',
      iconSVG: SVGIcons.icons.facetCollapse,
      iconClassName: 'coveo-facet-settings-section-hide-svg',
      shouldDisplay: true
    });
  }

  protected onClick() {
    this.options.onClick();
  }
}
