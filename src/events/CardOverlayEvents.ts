/**
 * The CardOverlayEvents class contains string definitions for all events related to the {@link CardOverlay} component.
 */
export class CardOverlayEvents {

  /**
   * Opening a {@link CardOverlay} component triggers this event (see {@link CardOverlay.openOverlay}).
   *
   * Handlers receive the HTML element corresponding to the current CardOverlay.
   *
   * @type {string}
   */
  public static openCardOverlay = 'openCardOverlay';

  /**
   * Closing a {@link CardOverlay} component triggers this event (see {@link CardOverlay.closeOverlay}).
   *
   * Handlers receive the HTML element corresponding to the current CardOverlay.
   *
   * @type {string}
   */
  public static closeCardOverlay = 'closeCardOverlay';
}
