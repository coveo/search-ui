import { Checkbox } from '../../FormWidgets/Checkbox';
import { DynamicFacetValue } from './DynamicFacetValue';
import { $$ } from '../../../utils/Dom';

export class DynamicFacetValueCheckbox {
  private checkbox: Checkbox;
  public element: HTMLElement;

  constructor(private facetValue: DynamicFacetValue, selectAction = () => {}) {
    this.checkbox = new Checkbox(
      selectAction.bind(this),
      this.facetValue.displayValue,
      this.facetValue.selectAriaLabel,
      `(${this.facetValue.formattedCount})`
    );

    const label = $$(this.checkbox.getElement()).find('.coveo-checkbox-span-label');
    const labelSuffix = $$(this.checkbox.getElement()).find('.coveo-checkbox-span-label-suffix');

    if (label && labelSuffix) {
      label.setAttribute('title', this.facetValue.displayValue);
      label.setAttribute('aria-hidden', 'true');
      labelSuffix.setAttribute('aria-hidden', 'true');
    }

    this.facetValue.isSelected && this.checkbox.select(false);
    this.element = this.checkbox.getElement();
  }
}
