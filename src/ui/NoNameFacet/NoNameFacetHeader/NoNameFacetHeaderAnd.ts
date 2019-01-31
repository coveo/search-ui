import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { NoNameFacetHeaderButton } from './NoNameFacetHeaderButton';

export interface INoNameFacetHeaderAndOptions {
  onClick: () => void;
}

export class NoNameFacetHeaderAnd extends NoNameFacetHeaderButton {
  constructor(private options: INoNameFacetHeaderAndOptions) {
    super({
      label: l('SwitchTo', l('Or')),
      className: 'coveo-facet-header-operator',
      iconSVG: SVGIcons.icons.orAnd,
      iconClassName: 'coveo-or-and-svg',
      shouldDisplay: true,
      iconElementClassName: 'coveo-and'
    });
  }

  protected onClick() {
    this.options.onClick();
  }
}
