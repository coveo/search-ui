import { $$ } from '../../../utils/Dom';
import { INoNameFacetOptions } from '../NoNameFacetOptions';
import { NoNameFacetValueCheckbox } from './NoNameFacetValueCheckbox';
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
  private checkbox: NoNameFacetValueCheckbox;

  constructor(options: INoNameFacetOptions, private facetValue: INoNameFacetValue) {
    this.create();
  }

  private create() {
    this.createContainer();
    this.createAndAppendLabel();
    this.createAndAppendLabelWrapper();
    this.createAndAppendCheckbox();
    this.createAndAppendCount();
    this.createAndAppendCaption();
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
    this.checkbox = new NoNameFacetValueCheckbox(this.facetValue, { label: this.label });
    this.labelWrapperElement.appendChild(this.checkbox.element);
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

  private get count() {
    // TODO: call utils
    return this.facetValue.numberOfResults.toString();
  }

  private get caption() {
    // TODO: call utils
    return this.facetValue.value;
  }

  private get label() {
    const selectOrUnselect = !this.facetValue.selected ? 'SelectValueWithResultCount' : 'UnselectValueWithResultCount';
    const resultCount = l('ResultCount', this.count);

    return `${l(selectOrUnselect, this.caption, resultCount)}`;
  }
}
