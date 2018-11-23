export interface IMenuItem {
  text: string;
  className: string;
  tooltip?: string;
  index?: number;
  onOpen: () => void;
  onClose?: () => void;
  svgIcon?: string;
  svgIconClassName?: string;
}
