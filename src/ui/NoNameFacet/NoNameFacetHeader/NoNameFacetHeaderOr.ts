import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { NoNameFacetHeaderButton } from './NoNameFacetHeaderButton';

export interface INoNameFacetHeaderOrOptions {
  onClick: () => void;
}

export class NoNameFacetHeaderOr extends NoNameFacetHeaderButton {
  constructor(private options: INoNameFacetHeaderOrOptions) {
    super({
      label: l('SwitchTo', l('And')),
      className: 'coveo-facet-header-operator',
      iconSVG: SVGIcons.icons.orAnd,
      iconClassName: 'coveo-or-and-svg',
      shouldDisplay: true,
      iconElementClassName: 'coveo-or'
    });
  }

  protected onClick() {
    this.options.onClick();
  }
}
