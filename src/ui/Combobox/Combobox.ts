import { $$ } from '../../utils/Dom';
import { ComboboxInput, IComboboxAccessibilityAttributes } from './ComboboxInput';
import { uniqueId, debounce } from 'underscore';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import { ComboboxValues, IComboboxValue } from './ComboboxValues';
import 'styling/_Combobox';
import { Utils } from '../../utils/Utils';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { l } from '../../strings/Strings';

export interface IComboboxOptions {
  label: string;
  requestValues: (terms: string) => Promise<any>;
  createValuesFromResponse: (response: any) => IComboboxValue[];
  onSelectValue: (value: IComboboxValue) => void;
  searchInterface: SearchInterface;
  noValuesFoundLabel?: string;
  placeholderText?: string;
  wrapperClassName?: string;
  debouncedDelay?: number;
  selectValueOnClick?: boolean;
  clearOnBlur?: boolean;
}

export class Combobox {
  public element: HTMLElement;
  public id: string;
  private input: ComboboxInput;
  public values: ComboboxValues;
  private waitAnimationElement: HTMLElement;
  private defaultOptions: Partial<IComboboxOptions> = {
    wrapperClassName: '',
    debouncedDelay: 400,
    noValuesFoundLabel: l('NoValuesFound'),
    selectValueOnClick: true,
    clearOnBlur: false
  };

  constructor(public options: IComboboxOptions) {
    this.options = {
      ...this.defaultOptions,
      ...this.options
    };

    this.id = uniqueId('coveo-combobox-');
    this.create();
  }

  private create() {
    this.element = $$('div', { className: `coveo-combobox-wrapper ${this.options.wrapperClassName}` }).el;
    this.createAndAppendLabel();
    this.createAndAppendInput();
    this.createAndAppendWaitAnimation();
    this.createAndAppendValues();
  }

  private createAndAppendLabel() {
    const labelElement = $$(
      'label',
      {
        id: `${this.id}-label`,
        className: 'coveo-combobox-label',
        for: `${this.id}-input`,
        // Even if the label is hidden, the screen reader will still read it
        ariaHidden: 'false'
      },
      this.options.label
    ).el;

    this.element.appendChild(labelElement);
  }

  private createAndAppendInput() {
    this.input = new ComboboxInput(this);
    this.element.appendChild(this.input.element);
  }

  private createAndAppendWaitAnimation() {
    this.waitAnimationElement = $$('div', { className: 'coveo-combobox-wait-animation' }, SVGIcons.icons.loading).el;
    SVGDom.addClassToSVGInContainer(this.waitAnimationElement, 'coveo-combobox-wait-animation-svg');
    this.toggleWaitAnimation(false);
    this.input.element.appendChild(this.waitAnimationElement);
  }

  private toggleWaitAnimation(show: boolean) {
    $$(this.waitAnimationElement).toggle(show);
  }

  private createAndAppendValues() {
    this.values = new ComboboxValues(this);
    this.element.appendChild(this.values.element);
  }

  public clearAll() {
    this.cancelRequest();
    this.input.clearInput();
    this.values.clearValues();
  }

  public onInputChange(value: string) {
    this.cancelRequest();

    if (Utils.isEmptyString(value)) {
      return this.values.clearValues();
    }

    this.toggleWaitAnimation(true);
    this.debouncedTriggerNewRequest(value);
  }

  public onInputBlur() {
    if (this.values.mouseIsOverValue) {
      return;
    }

    if (this.options.clearOnBlur) {
      return this.clearAll();
    }

    this.cancelRequest();
    this.values.clearValues();
  }

  public updateAccessibilityAttributes(attributes: IComboboxAccessibilityAttributes) {
    this.input.updateAccessibilityAttributes(attributes);
  }

  public updateAriaLive(text: string) {
    this.options.searchInterface.ariaLive.updateText(text);
  }

  private cancelRequest() {
    this.toggleWaitAnimation(false);
    this.debouncedTriggerNewRequest.cancel();
  }

  private debouncedTriggerNewRequest = debounce(this.triggerRequest, this.options.debouncedDelay);

  private async triggerRequest(terms: string) {
    const response = await this.options.requestValues(terms);
    this.toggleWaitAnimation(false);
    this.values.renderFromResponse(response);
  }
}
