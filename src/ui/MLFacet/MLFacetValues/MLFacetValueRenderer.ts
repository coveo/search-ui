import { $$, Dom } from '../../../utils/Dom';
import { MLFacet } from '../MLFacet';
import { MLFacetValue } from './MLFacetValue';
import { Checkbox } from '../../FormWidgets/Checkbox';
import { l } from '../../../strings/Strings';
import { TextEllipsisTooltip } from '../../Misc/TextEllipsisTooltip';

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

    this.createTooltip();

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
      `(${this.facetValue.formattedCount})`,
      this.ariaLabel
    );
    this.facetValue.isSelected && this.checkbox.select(false);
  }

  private createTooltip() {
    const labelElement = $$(this.checkbox.getElement()).find('.coveo-checkbox-span-label');
    if (!labelElement) {
      return;
    }

    const tooltip = new TextEllipsisTooltip(labelElement, this.facetValue.valueCaption, this.facet.root);
    this.dom.append(tooltip.element);
  }

  private selectAction = () => {
    this.facet.toggleSelectValue(this.facetValue.value);
    this.toggleSelectedClass();
    this.facet.triggerNewQuery();
  };

  private get ariaLabel() {
    const selectOrUnselect = !this.facetValue.isSelected ? 'SelectValueWithResultCount' : 'UnselectValueWithResultCount';
    const resultCount = l('ResultCount', this.facetValue.formattedCount);

    return `${l(selectOrUnselect, this.facetValue.valueCaption, resultCount)}`;
  }
}
