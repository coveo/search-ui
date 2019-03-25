import 'styling/_TextEllipsisTooltip';
import PopperJs from 'popper.js';
import { $$ } from '../../utils/Dom';

export class TextEllipsisTooltip {
  public element: HTMLElement;
  private arrow: HTMLElement;

  constructor(private textReference: HTMLElement, private caption: string, private root: HTMLElement) {
    this.element = $$('div', { className: 'coveo-text-ellipsis-tooltip coveo-hidden' }, this.caption).el;
    this.arrow = $$('div', { className: 'coveo-text-ellipsis-tooltip-arrow' }).el;

    this.element.appendChild(this.arrow);

    this.buildPopper();
  }

  private buildPopper() {
    const popperReference = new PopperJs(this.textReference, this.element, {
      placement: 'top',
      modifiers: {
        preventOverflow: {
          boundariesElement: this.root,
          padding: 0
        },
        arrow: {
          element: this.arrow
        },
        // X,Y offset of the tooltip relative to the icon
        offset: {
          offset: '0,8'
        }
      }
    });

    $$(this.textReference).on('mouseenter', () => {
      if (this.textReference.offsetWidth < this.textReference.scrollWidth) {
        popperReference.update();
        $$(this.element).removeClass('coveo-hidden');
      }
    });

    $$(this.textReference).on('mouseout', () => {
      $$(this.element).addClass('coveo-hidden');
    });
  }
}
