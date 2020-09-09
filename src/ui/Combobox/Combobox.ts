import { $$ } from '../../utils/Dom';
import { ComboboxInput } from './ComboboxInput';
import { uniqueId, throttle } from 'underscore';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import { ComboboxValues } from './ComboboxValues';
import 'styling/_Combobox';
import { Utils } from '../../utils/Utils';
import { l } from '../../strings/Strings';
import { IComboboxOptions, ICombobox, IComboboxAccessibilityAttributes } from './ICombobox';

export class Combobox implements ICombobox {
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
  private throttlingDelay = 600;
  private isRequestCancelled = false;

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
    this.throttledRequest.cancel();
    this.isRequestCancelled = true;
  }

  public onInputChange(value: string) {
    if (Utils.isEmptyString(value)) {
      return this.clearValues();
    }

    this.throttledRequest(this.options.requestValues(value), () => this.values.resetScroll());
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
    this.options.ariaLive.updateText(text);
  }

  public onScrollEndReached() {
    this.options.scrollable && this.throttledRequest(this.options.scrollable.requestMoreValues());
  }

  private throttledRequest = throttle(this.triggerRequest, this.throttlingDelay, {
    leading: true,
    trailing: true
  });

  private async triggerRequest(request: Promise<any>, callback?: Function) {
    this.isRequestCancelled = false;
    this.toggleWaitAnimation(true);

    const response = await request;
    this.toggleWaitAnimation(false);

    if (!this.isRequestCancelled) {
      this.values.renderFromResponse(response);
      callback && callback();
    }
  }
}
