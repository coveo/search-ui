import { once } from 'underscore';
import { $$ } from '../../utils/Dom';

export function bindAnalyticsToLink(element: HTMLElement, logAnalytics: () => void) {
  const executeOnlyOnce = once(() => logAnalytics());

  $$(element).on(['contextmenu', 'click', 'mousedown', 'mouseup'], executeOnlyOnce);
  let longPressTimer: number;
  $$(element).on('touchstart', () => {
    longPressTimer = window.setTimeout(executeOnlyOnce, 1000);
  });
  $$(element).on('touchend', () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
  });
}
