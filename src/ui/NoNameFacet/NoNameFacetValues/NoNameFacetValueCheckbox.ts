import { $$ } from '../../../utils/Dom';
import { INoNameFacetValue } from './NoNameFacetValue';

export interface INoNameFacetValueCheckboxOptions {
  label: string;
}

export class NoNameFacetValueCheckbox {
  public element: HTMLElement;

  constructor(facetValue: INoNameFacetValue, private options: INoNameFacetValueCheckboxOptions) {
    this.create();
    // TODO: manage selection
  }

  private create() {
    this.element = $$('div', {
      className: 'coveo-facet-value-checkbox',
      tabindex: 0,
      role: 'heading',
      ariaLevel: '3',
      ariaLabel: this.options.label
    }).el;
  }
}
