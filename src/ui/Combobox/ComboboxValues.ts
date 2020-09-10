import { ICombobox, IComboboxValues, IComboboxValue } from './ICombobox';
import { $$ } from '../../utils/Dom';
import { find } from 'underscore';

export class ComboboxValues implements IComboboxValues {
  public element: HTMLElement;
  public mouseIsOverValue = false;
  public isRenderingNewValues = false;
  private values: IComboboxValue[] = [];
  private keyboardActiveValue?: IComboboxValue;
  private isScrollable: boolean;
  private focusedValueId: string;

  constructor(private combobox: ICombobox) {
    this.element = $$('ul', {
      id: `${this.combobox.id}-listbox`,
      role: 'listbox',
      className: 'coveo-combobox-values',
      ariaLabelledby: `${this.combobox.id}-input`
    }).el;
    $$(this.element).hide();

    this.isScrollable = !!this.combobox.options.scrollable;
    this.isScrollable && this.element.addEventListener('scroll', () => this.onScroll());
  }

  public renderFromResponse(response: any) {
    this.isRenderingNewValues = true;
    this.clearValues();
    this.values = this.combobox.options.createValuesFromResponse(response);
    this.render();
    this.isRenderingNewValues = false;
  }

  private render() {
    $$(this.element).show();

    if (!this.hasValues()) {
      return this.renderNoValuesFound();
    }

    this.renderValues();
    this.addEventListeners();
    this.updateAccessibilityAttributes();
  }

  private renderValues() {
    const fragment = document.createDocumentFragment();
    this.values.forEach((value, index) => {
      const elementWrapper = $$(
        'li',
        { id: `${this.combobox.id}-value-${index}`, className: 'coveo-combobox-value', role: 'option', tabindex: 0 },
        value.element
      ).el;
      value.element = elementWrapper;
      fragment.appendChild(value.element);
    });

    this.element.appendChild(fragment);
  }

  private hasValues() {
    return !!this.values.length;
  }

  private renderNoValuesFound() {
    const label = this.combobox.options.noValuesFoundLabel;
    const noValuesFoundElement = $$(
      'li',
      {
        role: 'option',
        className: 'coveo-combobox-value-not-found'
      },
      label
    ).el;

    this.element.appendChild(noValuesFoundElement);
    this.combobox.updateAriaLive(label);
  }

  private addEventListeners() {
    this.values.forEach(value => {
      $$(value.element).on('mouseenter', () => (this.mouseIsOverValue = true));
      $$(value.element).on('mouseleave', () => (this.mouseIsOverValue = false));
      $$(value.element).on('click', (e: MouseEvent) => this.onValueClick(e));
      $$(value.element).on('focus', () => this.setKeyboardActiveValue(value));
    });
  }

  private onValueClick(e: MouseEvent) {
    const target = <HTMLElement>e.target;
    const targetElement = $$(target).hasClass('coveo-combobox-value') ? target : $$(target).parent('coveo-combobox-value');

    if (!targetElement) {
      return;
    }

    const targetId = targetElement.getAttribute('id');
    const value = find(this.values, ({ element }) => element.getAttribute('id') === targetId);
    value && this.combobox.options.onSelectValue(value);
    this.combobox.clearAll();
  }

  private updateAccessibilityAttributes() {
    const activeDescendant = this.keyboardActiveValue ? this.keyboardActiveValue.element.getAttribute('id') : '';

    this.combobox.updateAccessibilityAttributes({
      activeDescendant,
      expanded: this.hasValues()
    });
  }

  public clearValues() {
    this.mouseIsOverValue = false;
    this.resetKeyboardActiveValue();
    $$(this.element).empty();
    $$(this.element).hide();
    this.values = [];
    this.updateAccessibilityAttributes();
  }

  private setKeyboardActiveValue(value: IComboboxValue) {
    this.resetKeyboardActiveValue();
    this.keyboardActiveValue = value;
    this.activateFocusOnValue(this.keyboardActiveValue);
    this.updateAccessibilityAttributes();
  }

  private resetKeyboardActiveValue() {
    if (!this.keyboardActiveValue) {
      return;
    }

    this.deactivateFocusOnValue(this.keyboardActiveValue);
    this.keyboardActiveValue = null;
  }

  private activateFocusOnValue({ element }: IComboboxValue) {
    $$(element).addClass('coveo-focused');
    element.setAttribute('aria-selected', 'true');
  }

  private deactivateFocusOnValue({ element }: IComboboxValue) {
    $$(element).removeClass('coveo-focused');
    element.setAttribute('aria-selected', 'false');
  }

  public selectActiveValue() {
    if (!this.keyboardActiveValue) {
      return;
    }

    this.combobox.options.onSelectValue(this.keyboardActiveValue);
    this.combobox.clearAll();
  }

  private onScroll() {
    const scrollEndReached = this.element.scrollTop + this.element.clientHeight >= this.element.scrollHeight;
    if (scrollEndReached && this.combobox.options.scrollable.areMoreValuesAvailable()) {
      this.combobox.onScrollEndReached();
    }
  }

  public resetScroll() {
    if (!this.isScrollable) {
      return;
    }
    this.element.style.maxHeight = `${this.combobox.options.scrollable.maxDropdownHeight()}px`;
    this.element.scrollTop = 0;
  }

  public moveActiveValueToTop() {
    if (!this.hasValues()) {
      return;
    }

    this.firstValue.element.focus();
  }

  public moveActiveValueToBottom() {
    if (!this.hasValues()) {
      return;
    }

    this.lastValue.element.focus();
  }

  public moveActiveValueDown() {
    if (!this.hasValues()) {
      return;
    }

    const nextActiveValue = this.nextOrFirstValue;
    nextActiveValue.element.focus();
  }

  public moveActiveValueUp() {
    if (!this.hasValues()) {
      return;
    }

    const previousActiveValue = this.previousOrLastValue;
    previousActiveValue.element.focus();
  }

  private get nextOrFirstValue() {
    if (!this.keyboardActiveValue) {
      return this.firstValue;
    }

    const nextValueIndex = (this.values.indexOf(this.keyboardActiveValue) + 1) % this.values.length;
    return this.values[nextValueIndex];
  }

  private get firstValue() {
    return this.values[0];
  }

  private get previousOrLastValue() {
    if (!this.keyboardActiveValue) {
      return this.lastValue;
    }

    const previousValueIndex = this.values.indexOf(this.keyboardActiveValue) - 1;
    return previousValueIndex >= 0 ? this.values[previousValueIndex] : this.values[this.values.length - 1];
  }

  private get lastValue() {
    const lastValueIndex = this.values.length - 1;
    return this.values[lastValueIndex];
  }

  public saveFocusedValue() {
    if (!this.keyboardActiveValue) {
      this.focusedValueId = null;
      return;
    }

    this.focusedValueId = this.keyboardActiveValue.element.id;
  }

  public restoreFocusedValue() {
    if (!this.focusedValueId) {
      return;
    }

    const element = $$(this.element).find(`#${this.focusedValueId}`);
    element.focus();
    this.focusedValueId = null;
  }
}
