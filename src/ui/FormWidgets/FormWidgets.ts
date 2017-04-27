export interface IFormWidgets {
  reset: () => void;
  getValue: () => string | number;
  build: () => HTMLElement;
}

export interface IFormWidgetsWithLabel extends IFormWidgets {
  label: string;
  getLabel: () => HTMLElement;
}

export interface IFormWidgetsSelectable extends IFormWidgets {
  isSelected: () => boolean;
  select: () => void;
}


