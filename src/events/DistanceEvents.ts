export interface IPosition {
  long: number;
  lat: number;
}

export interface IPositionProvider {
  getPosition(): Promise<IPosition>;
}

/**
 * Argument sent to all handlers bound on {@link DistanceEvents.onResolvingPosition}
 */
export interface IResolvingPositionEventArgs {
  /*
   * List of all the providers that can provide a position. The first one that can resolve the position will be used.
   */
  providers: IPositionProvider[];
}

/**
 * Argument sent to all handlers bound on {@link DistanceEvents.onPositionResolved}
 */
export interface IPositionResolvedEventArgs {
  /*
   * The position that was resolved.
   */
  position: IPosition;
}

export class DistanceEvents {
  /**
   * Triggered when the [`DistanceResources`]{@link DistanceResources} component sucessfully resolves the position.
   *
   * All bound handlers will receive {@link IPositionResolvedEventArgs} as an argument.
   *
   * The string value is `onPositionResolved`.
   * @type {string}
   */
  public static onPositionResolved = 'onPositionResolved';
  /**
   * Triggered when the [`DistanceResources`]{@link DistanceResources} component tries to resolve the position.
   * 
   * Use this event to register new position providers.
   *
   * All bound handlers will receive {@link IResolvingPositionEventArgs} as an argument.
   *
   * The string value is `onResolvingPosition`.
   * @type {string}
   */
  public static onResolvingPosition = 'onResolvingPosition';
  /**
   * Triggered when the [`DistanceResources`]{@link DistanceResources} component fails to resolve the position.
   * 
   * Use this event to show an error to the end user, or hide components that cannot be used.
   *
   * The string value is `onPositionNotResolved`.
   * @type {string}
   */
  public static onPositionNotResolved = 'onPositionNotResolved';
}
