import { $$, Dom } from '../../../utils/Dom';
import { MLFacet } from '../MLFacet';
import { MLFacetValue } from './MLFacetValue';
import { Checkbox } from '../../FormWidgets/Checkbox';
import { l } from '../../../strings/Strings';

export class MLFacetValueRenderer {
  private dom: Dom;
  private checkbox: Checkbox;

  constructor(private facetValue: MLFacetValue, private facet: MLFacet) {}

  public render() {
    this.dom = $$('li', {
      className: 'coveo-ml-facet-value coveo-ml-facet-selectable',
      dataValue: this.facetValue.value
    });

    this.createCheckbox();
    this.dom.append(this.checkbox.getElement());

    this.addFocusAndBlurEventListeners();

    this.toggleSelectedClass();

    return this.dom.el;
  }

  private toggleSelectedClass() {
    this.dom.toggleClass('coveo-selected', this.facetValue.isSelected);
  }

  private createCheckbox() {
    this.checkbox = new Checkbox(
      () => this.selectAction(),
      this.facetValue.valueCaption,
      this.ariaLabel,
      `(${this.facetValue.formattedCount})`
    );

    const label = $$(this.checkbox.getElement()).find('.coveo-checkbox-span-label');
    const labelSuffix = $$(this.checkbox.getElement()).find('.coveo-checkbox-span-label-suffix');

    if (label && labelSuffix) {
      label.setAttribute('title', this.facetValue.valueCaption);
      label.setAttribute('aria-hidden', 'true');
      labelSuffix.setAttribute('aria-hidden', 'true');
    }

    this.facetValue.isSelected && this.checkbox.select(false);
  }

  private addFocusAndBlurEventListeners() {
    const checkboxButton = $$(this.checkbox.getElement()).find('button');
    $$(checkboxButton).on('focusin', () => this.dom.addClass('coveo-focused'));
    $$(checkboxButton).on('focusout', () => this.dom.removeClass('coveo-focused'));
  }

  private selectAction = () => {
    this.facet.toggleSelectValue(this.facetValue.value);
    this.toggleSelectedClass();
    this.facet.enableFreezeCurrentValuesFlag();
    this.facet.triggerNewQuery();
  };

  private get ariaLabel() {
    const selectOrUnselect = !this.facetValue.isSelected ? 'SelectValueWithResultCount' : 'UnselectValueWithResultCount';
    const resultCount = l('ResultCount', this.facetValue.formattedCount);

    return `${l(selectOrUnselect, this.facetValue.valueCaption, resultCount)}`;
  }
}
