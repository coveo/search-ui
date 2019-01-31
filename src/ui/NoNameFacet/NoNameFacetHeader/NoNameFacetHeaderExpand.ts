import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { NoNameFacetHeaderButton } from './NoNameFacetHeaderButton';

export interface INoNameFacetHeaderExpandOptions {
  onClick: () => void;
}

export class NoNameFacetHeaderExpand extends NoNameFacetHeaderButton {
  constructor(private options: INoNameFacetHeaderExpandOptions) {
    super({
      label: l('Expand'),
      className: 'coveo-facet-header-expand',
      iconSVG: SVGIcons.icons.facetExpand,
      iconClassName: 'coveo-facet-settings-section-show-svg',
      shouldDisplay: true
    });
  }

  protected onClick() {
    this.options.onClick();
  }
}
