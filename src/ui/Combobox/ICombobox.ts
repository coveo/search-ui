import { IAriaLive } from '../AriaLive/AriaLive';

export interface IComboboxValue {
  value: any;
  element: HTMLElement;
}

export interface IComboboxOptions {
  label: string;
  requestValues: (terms: string) => Promise<any>;
  createValuesFromResponse: (response: any) => IComboboxValue[];
  onSelectValue: (value: IComboboxValue) => void;
  ariaLive: IAriaLive;
  noValuesFoundLabel?: string;
  placeholderText?: string;
  wrapperClassName?: string;
  clearOnBlur?: boolean;
  scrollable?: {
    maxDropdownHeight: () => number;
    requestMoreValues: () => Promise<any>;
    areMoreValuesAvailable: () => boolean;
  };
}

export interface ICombobox {
  options: IComboboxOptions;
  element: HTMLElement;
  id: string;
  values: IComboboxValues;
  clearAll(): void;
  onInputChange(value: string): void;
  onInputBlur(): void;
  updateAccessibilityAttributes(attributes: IComboboxAccessibilityAttributes): void;
  updateAriaLive(value: string): void;
  onScrollEndReached(): void;
}

export interface IComboboxValues {
  element: HTMLElement;
  mouseIsOverValue: boolean;
  isRenderingNewValues: boolean;
  renderFromResponse(response: any): void;
  clearValues(): void;
  selectActiveValue(): void;
  resetScroll(): void;
  focusNextValue(): void;
  focusPreviousValue(): void;
  focusFirstValue(): void;
  focusLastValue(): void;
  saveFocusedValue(): void;
  restoreFocusedValue(): void;
}

export interface IComboboxAccessibilityAttributes {
  activeDescendant: string;
  expanded: boolean;
}
