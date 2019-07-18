import { $$ } from '../../utils/Dom';
import { ComboboxInput, IComboboxAccessibilityAttributes } from './ComboboxInput';
import { uniqueId, throttle } from 'underscore';
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
  clearOnBlur?: boolean;
}

export class Combobox {
  public element: HTMLElement;
  public id: string;
  public values: ComboboxValues;
  private input: ComboboxInput;
  private waitAnimationElement: HTMLElement;
  private defaultOptions: Partial<IComboboxOptions> = {
    wrapperClassName: '',
    noValuesFoundLabel: l('NoValuesFound'),
    clearOnBlur: false
  };
  private isThrottledRequestCancelled = false;
  private throttlingDelay = 600;

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
    this.createAndAppendInput();
    this.createAndAppendWaitAnimation();
    this.createAndAppendValues();
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
    this.clearValues();
    this.input.clearInput();
  }

  private clearValues() {
    this.values.clearValues();
    this.cancelRequest();
  }

  private cancelRequest() {
    this.toggleWaitAnimation(false);
    this.throttledTriggerNewRequest.cancel();
    this.isThrottledRequestCancelled = true;
  }

  public onInputChange(value: string) {
    if (Utils.isEmptyString(value)) {
      return this.clearValues();
    }

    this.toggleWaitAnimation(true);
    this.throttledTriggerNewRequest(value);
  }

  public onInputBlur() {
    if (this.values.mouseIsOverValue) {
      return;
    }

    if (this.options.clearOnBlur) {
      return this.clearAll();
    }

    this.clearValues();
  }

  public updateAccessibilityAttributes(attributes: IComboboxAccessibilityAttributes) {
    this.input.updateAccessibilityAttributes(attributes);
  }

  public updateAriaLive(text: string) {
    this.options.searchInterface.ariaLive.updateText(text);
  }

  private throttledTriggerNewRequest = throttle(this.triggerRequest, this.throttlingDelay, {
    leading: true,
    trailing: true
  });

  private async triggerRequest(terms: string) {
    this.isThrottledRequestCancelled = false;
    const response = await this.options.requestValues(terms);
    this.toggleWaitAnimation(false);

    if (!this.isThrottledRequestCancelled) {
      this.values.renderFromResponse(response);
    }
  }
}
