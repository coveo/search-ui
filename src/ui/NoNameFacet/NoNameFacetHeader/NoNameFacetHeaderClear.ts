import { l } from '../../../strings/Strings';
import { SVGIcons } from '../../../utils/SVGIcons';
import { NoNameFacetHeaderButton } from './NoNameFacetHeaderButton';

export class NoNameFacetHeaderClear extends NoNameFacetHeaderButton {
  constructor() {
    super({
      label: l('Reset'),
      className: 'coveo-facet-header-eraser coveo-facet-header-eraser-visible',
      iconSVG: SVGIcons.icons.mainClear,
      iconClassName: 'coveo-facet-header-eraser-svg',
      shouldDisplay: false
    });
  }

  protected onClick() {
    this.toggle(false);
  }
}
