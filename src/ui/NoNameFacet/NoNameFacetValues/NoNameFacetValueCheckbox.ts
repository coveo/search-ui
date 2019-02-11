import { $$ } from '../../../utils/Dom';
import { SVGIcons } from '../../../utils/SVGIcons';
import { SVGDom } from '../../../utils/SVGDom';

export class NoNameFacetValueCheckbox {
  public element: HTMLElement;

  constructor(private label: string) {
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
        ariaLabel: this.label
      },
      SVGIcons.icons.checkboxHookExclusionMore
    ).el;

    SVGDom.addClassToSVGInContainer(this.element, 'coveo-facet-value-checkbox-svg');
  }
}
