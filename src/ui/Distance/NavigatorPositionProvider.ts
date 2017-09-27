import { IPositionProvider, IPosition } from '../../events/DistanceEvents';

/**
 * The `NavigatorPositionProvider` component provides the user's position to a [`DistanceResources`]{@link DistanceResources} component according to the current navigator.
 *
 * Note that most browser requires your site to be in HTTPS to use this API.
 */
export class NavigatorPositionProvider implements IPositionProvider {
  public getPosition(): Promise<IPosition> {
    return new Promise<IPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            lat: position.coords.latitude,
            long: position.coords.longitude
          });
        },
        error => {
          reject(error);
        }
      );
    });
  }
}
