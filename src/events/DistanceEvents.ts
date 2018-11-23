/**
 * The `IGeolocationPosition` interface describes a geolocation position
 * usable by the [DistanceResources]{@link DistanceResources} component.
 */
export interface IGeolocationPosition {
  longitude: number;
  latitude: number;
}

/**
 * The `IGeolocationPositionProvider` interface describes an object with a method that can provide
 * a geolocation position to the [DistanceResources]{@link DistanceResources} component.
 */
export interface IGeolocationPositionProvider {
  getPosition(): Promise<IGeolocationPosition>;
}

/**
 * The `IResolvingPositionEventArgs` interface describes the object that all
 * [`onResolvingPosition`]{@link DistanceEvents.onResolvingPosition} event handlers receive as an argument.
 */
export interface IResolvingPositionEventArgs {
  /**
   * The array of providers that can provide a position. The first provider that can resolve the position will be used.
   */
  providers: IGeolocationPositionProvider[];
}

/**
 * The `IPositionResolvedEventArgs` interface describes the object that all
 * [`onPositionResolved`]{@link DistanceEvents.onPositionResolved} event handlers receive as an argument.
 */
export interface IPositionResolvedEventArgs {
  /**
   * The position that was resolved.
   */
  position: IGeolocationPosition;
}

/**
 * The `DistanceEvents` static class contains the string definitions of all events related to distance
 * list.
 *
 * See [Events](https://developers.coveo.com/x/bYGfAQ).
 */
export class DistanceEvents {
  /**
   * Triggered when the [`DistanceResources`]{@link DistanceResources} component successfully resolves the position.
   *
   * All `onPositionResolved` event handlers receive a [`PositionResolvedEventArgs`]{@link IPositionResolvedEventArgs}
   * object as an argument.
   *
   * @type {string} The string value is `onPositionResolved`.
   */
  public static onPositionResolved = 'onPositionResolved';

  /**
   * Triggered when the [`DistanceResources`]{@link DistanceResources} component tries to resolve the position.
   *
   * All `onResolvingPosition` event handlers receive a
   * [`ResolvingPositionEventArgs`]{@link IResolvingPositionEventArgs} object as an argument.
   *
   * **Note:**
   * > You should bind a handler to this event if you want to register one or several new position providers.
   *
   * @type {string} The string value is `onResolvingPosition`.
   */
  public static onResolvingPosition = 'onResolvingPosition';

  /**
   * Triggered when the [`DistanceResources`]{@link DistanceResources} component fails to resolve the position.
   *
   * **Note:**
   * > You should bind a handler to this event if you want to display an error message to the end user, or hide
   * > components that cannot be used.
   *
   * @type {string} The string value is `onPositionNotResolved`.
   */
  public static onPositionNotResolved = 'onPositionNotResolved';
}
