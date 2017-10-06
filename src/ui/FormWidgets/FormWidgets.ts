/**
 * Describe an interface for a simple form widget.
 *
 * {@link Checkbox}, {@link DatePicker}, {@link Dropdown} are all examples of `IFormWidgets`.
 */
export interface IFormWidget {
  reset: () => void;
  getValue: () => string | number | string[];
  build: () => HTMLElement;
  getElement: () => HTMLElement;
}

export interface IFormWidgetWithLabel extends IFormWidget {
  label: string;
  getLabel: () => HTMLElement;
}

export interface IFormWidgetSelectable extends IFormWidget {
  isSelected: () => boolean;
  select: () => void;
}

export interface IFormWidgetSettable extends IFormWidget {
  setValue: (value: any) => void;
}
