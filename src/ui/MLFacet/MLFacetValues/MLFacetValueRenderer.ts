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
      className: 'coveo-facet-value coveo-facet-selectable',
      dataValue: this.facetValue.value
    });

    const labelElement = this.createLabel();
    this.dom.append(labelElement);

    const labelWrapperElement = this.createLabelWrapper();
    labelElement.appendChild(labelWrapperElement);

    this.createCheckbox();
    labelWrapperElement.appendChild(this.checkbox.getElement());

    const countElement = this.createCount();
    labelWrapperElement.appendChild(countElement);
    this.addFocusAndBlurEventListeners();

    this.toggleSelectedClass();

    return this.dom.el;
  }

  private toggleSelectedClass() {
    this.dom.toggleClass('coveo-selected', this.facetValue.selected);
  }

  private createLabel() {
    return $$('label', { className: 'coveo-facet-value-label' }).el;
  }

  private createLabelWrapper() {
    return $$('div', { className: 'coveo-facet-value-label-wrapper' }).el;
  }

  private createCheckbox() {
    this.checkbox = new Checkbox(() => this.selectAction(), this.facetValue.valueCaption, this.ariaLabel);
    this.facetValue.selected && this.checkbox.select(false);
  }

  private addFocusAndBlurEventListeners() {
    const checkboxButton = $$(this.checkbox.getElement()).find('button');
    $$(checkboxButton).on('focusin', () => this.dom.addClass('coveo-focused'));
    $$(checkboxButton).on('focusout', () => this.dom.removeClass('coveo-focused'));
  }

  private createCount() {
    return $$('span', { className: 'coveo-facet-value-count' }, this.facetValue.formattedCount).el;
  }

  private selectAction = () => {
    this.facet.toggleSelectValue(this.facetValue.value);
    this.toggleSelectedClass();
    this.facet.triggerNewQuery();
  };

  private get ariaLabel() {
    const selectOrUnselect = !this.facetValue.selected ? 'SelectValueWithResultCount' : 'UnselectValueWithResultCount';
    const resultCount = l('ResultCount', this.facetValue.formattedCount);

    return `${l(selectOrUnselect, this.facetValue.valueCaption, resultCount)}`;
  }
}
