import { InitializationEvents } from '../events/InitializationEvents';
import { $$ } from '../utils/Dom';
require('svg4everybody');

declare function svg4everybody(): void;

export function SvgPolyfill(root: HTMLElement) {
  $$(root).on(InitializationEvents.afterComponentsInitialization, () => {
    // svg4everybody();
  });
}
