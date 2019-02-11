import { $$ } from '../../../utils/Dom';
import { INoNameFacetOptions } from '../NoNameFacetOptions';
import { NoNameFacetValueCheckbox } from './NoNameFacetValueCheckbox';
import { NoNameFacetValueUtils } from './NoNameFacetValueUtils';
import { l } from '../../../strings/Strings';

export interface INoNameFacetValue {
  value: string;
  selected: boolean;
  numberOfResults: number;
}

export class NoNameFacetValue {
  public element: HTMLElement;
  private labelElement: HTMLElement;
  private labelWrapperElement: HTMLElement;
  private captionElement: HTMLElement;
  private countElement: HTMLElement;
  private checkboxElement: HTMLElement;

  constructor(private options: INoNameFacetOptions, private facetValue: INoNameFacetValue) {
    this.create();
  }

  private create() {
    this.createContainer();
    this.createAndAppendLabel();
    this.createAndAppendLabelWrapper();
    this.createAndAppendCheckbox();
    this.createAndAppendCount();
    this.createAndAppendCaption();

    this.toggleSelectedClass();
    this.addFocusAndBlurEventListeners();
  }

  private createContainer() {
    this.element = $$('li', {
      className: 'coveo-facet-value coveo-facet-selectable',
      dataValue: this.facetValue.value
    }).el;
  }

  private createAndAppendLabel() {
    this.labelElement = $$('label', { className: 'coveo-facet-value-label' }).el;
    this.element.appendChild(this.labelElement);
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
    this.countElement = $$('span', { className: 'coveo-facet-value-count' }, this.count).el;
    this.labelWrapperElement.appendChild(this.countElement);
  }

  private createAndAppendCaption() {
    this.captionElement = $$(
      'span',
      {
        className: 'coveo-facet-value-caption',
        title: this.caption,
        dataOriginalValue: this.facetValue.value
      },
      this.caption
    ).el;
    this.labelWrapperElement.appendChild(this.captionElement);
  }

  private toggleSelectedClass() {
    $$(this.element).toggleClass('coveo-selected', this.facetValue.selected);
  }

  private addFocusAndBlurEventListeners() {
    $$(this.checkboxElement).on('focus', () => $$(this.element).addClass('coveo-focused'));
    $$(this.checkboxElement).on('blur', () => $$(this.element).removeClass('coveo-focused'));
  }

  private get count() {
    return NoNameFacetValueUtils.getFormattedCount(this.facetValue.numberOfResults);
  }

  private get caption() {
    return NoNameFacetValueUtils.getValueCaption(this.facetValue.value, this.options);
  }

  private get label() {
    const selectOrUnselect = !this.facetValue.selected ? 'SelectValueWithResultCount' : 'UnselectValueWithResultCount';
    const resultCount = l('ResultCount', this.count);

    return `${l(selectOrUnselect, this.caption, resultCount)}`;
  }
}
