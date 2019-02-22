import { $$, Dom } from '../../../utils/Dom';
import { NoNameFacet } from '../NoNameFacet';
import { NoNameFacetValueCheckbox } from './NoNameFacetValueCheckbox';
import { NoNameFacetValue } from './NoNameFacetValue';
import { l } from '../../../strings/Strings';
import { KeyboardUtils, KEYBOARD } from '../../../utils/KeyboardUtils';

export class NoNameFacetValueRenderer {
  private dom: Dom;
  private labelElement: HTMLElement;
  private labelWrapperElement: HTMLElement;
  private captionElement: HTMLElement;
  private countElement: HTMLElement;
  private checkboxElement: HTMLElement;

  constructor(private facetValue: NoNameFacetValue, private facet: NoNameFacet) {}

  public render() {
    this.dom = $$('li', {
      className: 'coveo-facet-value coveo-facet-selectable',
      dataValue: this.facetValue.value
    });
    this.createAndAppendLabel();
    this.createAndAppendLabelWrapper();
    this.createAndAppendCheckbox();
    this.createAndAppendCount();
    this.createAndAppendCaption();

    this.toggleSelectedClass();
    this.addFocusAndBlurEventListeners();
    this.addClickEventListeners();

    return this.dom.el;
  }

  private createAndAppendLabel() {
    this.labelElement = $$('label', { className: 'coveo-facet-value-label' }).el;
    this.dom.append(this.labelElement);
  }

  private createAndAppendLabelWrapper() {
    this.labelWrapperElement = $$('div', { className: 'coveo-facet-value-label-wrapper' }).el;
    this.labelElement.appendChild(this.labelWrapperElement);
  }

  private createAndAppendCheckbox() {
    this.checkboxElement = new NoNameFacetValueCheckbox(this.label).element;
    this.labelWrapperElement.appendChild(this.checkboxElement);
  }

  private createAndAppendCount() {
    this.countElement = $$('span', { className: 'coveo-facet-value-count' }, this.facetValue.formattedCount).el;
    this.labelWrapperElement.appendChild(this.countElement);
  }

  private createAndAppendCaption() {
    const caption = this.facetValue.valueCaption;
    this.captionElement = $$(
      'span',
      {
        className: 'coveo-facet-value-caption',
        title: caption,
        dataOriginalValue: this.facetValue.value
      },
      caption
    ).el;
    this.labelWrapperElement.appendChild(this.captionElement);
  }

  private toggleSelectedClass() {
    this.dom.toggleClass('coveo-selected', this.facetValue.selected);
  }

  private addFocusAndBlurEventListeners() {
    $$(this.checkboxElement).on('focus', () => this.dom.addClass('coveo-focused'));
    $$(this.checkboxElement).on('blur', () => this.dom.removeClass('coveo-focused'));
  }

  private addClickEventListeners() {
    this.dom.on('click', this.selectAction);
    $$(this.checkboxElement).on('keydown', KeyboardUtils.keypressAction([KEYBOARD.SPACEBAR, KEYBOARD.ENTER], this.selectAction));
  }

  private get label() {
    const selectOrUnselect = !this.facetValue.selected ? 'SelectValueWithResultCount' : 'UnselectValueWithResultCount';
    const resultCount = l('ResultCount', this.facetValue.formattedCount);

    return `${l(selectOrUnselect, this.facetValue.valueCaption, resultCount)}`;
  }

  private selectAction = () => {
    this.facet.toggleSelectValue(this.facetValue.value);
    this.toggleSelectedClass();

    this.facet.triggerNewQuery();
  };
}
