/**
 * The `IQuickviewLoadedEventArgs` interface describes the object that all
 * [`quickviewLoaded`]{@link QuickviewEvents.quickviewLoaded} event handlers receive as an argument.
 */
export interface IQuickviewLoadedEventArgs {
  /**
   * The amount of time it took to download the content to display in the quickview modal window (in milliseconds).
   */
  duration: number;
}

/**
 * The `QuickviewEvents` static class contains the string definitions of all events that strongly relate to the
 * [`Quickview`]{@link Quickview} component.
 */
export class QuickviewEvents {
  /**
   * Triggered by the [`QuickviewDocument`]{@link QuickviewDocument} component when the content to display in the
   * quickview modal window has just finished downloading.
   *
   * The [`Quickview`]{@link Quickview} component listens to this event to know when to remove its loading animation.
   *
   * All `quickviewLoaded` event handlers receive a [`QuickviewLoadedEventArgs`]{@link IQuickviewLoadedEventArgs} object
   * as an argument.
   *
   * @type {string} The string value is `quickviewLoaded`.
   */
  public static quickviewLoaded = 'quickviewLoaded';

  /**
   * Triggered by the [`QuickviewDocument`]{@link QuickviewDocument} component when the end user has just clicked the
   * **Quickview** button/link to open the quickview modal window.
   *
   * This event allows external code to modify the terms to highlight before the content of the quickview modal window
   * is rendered.
   *
   * All `openQuickview` event handlers receive an
   * [`OpenQuickviewEventArgs`]{@link ResultListEvents.IOpenQuickviewEventArgs} object as an argument.
   *
   * @type {string} The string value is `openQuickview`.
   */
  public static openQuickview = 'openQuickview';
}
