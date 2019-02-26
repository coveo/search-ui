import { $$ } from '../../../utils/Dom';
import { SVGIcons } from '../../../utils/SVGIcons';
import { l } from '../../../strings/Strings';
import { SVGDom } from '../../../utils/SVGDom';
import { NoNameFacetValue } from './NoNameFacetValue';

export class NoNameFacetValueCheckbox {
  public element: HTMLElement;

  constructor(private facetValue: NoNameFacetValue) {
    this.create();
  }

  private create() {
    this.element = $$(
      'div',
      {
        className: 'coveo-facet-value-checkbox',
        tabindex: 0,
        role: 'heading',
        ariaLevel: '3',
        ariaLabel: this.ariaLabel
      },
      SVGIcons.icons.checkboxHookExclusionMore
    ).el;

    SVGDom.addClassToSVGInContainer(this.element, 'coveo-facet-value-checkbox-svg');
  }

  private get ariaLabel() {
    const selectOrUnselect = !this.facetValue.selected ? 'SelectValueWithResultCount' : 'UnselectValueWithResultCount';
    const resultCount = l('ResultCount', this.facetValue.formattedCount);

    return `${l(selectOrUnselect, this.facetValue.valueCaption, resultCount)}`;
  }
}
