import { $$ } from '../../../utils/Dom';

export interface IDynamicFacetValueMoreLessButtonOptions {
  label: string;
  ariaLabel: string;
  className: string;
  action: () => void;
}

export class DynamicFacetValueShowMoreLessButton {
  public element: HTMLElement;

  constructor(options: IDynamicFacetValueMoreLessButtonOptions) {
    const btn = $$(
      'button',
      {
        className: options.className,
        ariaLabel: options.ariaLabel,
        type: 'button'
      },
      options.label
    );

    this.element = $$('li', null, btn).el;
    btn.on('click', () => options.action());
  }
}
