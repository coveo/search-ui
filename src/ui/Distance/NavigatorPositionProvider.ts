import { IPositionProvider, IPosition } from '../../events/DistanceEvents';

/**
 * The `NavigatorPositionProvider` class uses the current web browser to provide the position of the end user to
 * a [`DistanceResources`]{@link DistanceResources} component whose
 * [`useNavigator`]{DistanceResources.options.useNavigator} option is set to `true`.
 *
 * **Note:**
 * > Recent web browsers typically require a site to be in HTTPS to enable their geolocation service.
 */
export class NavigatorPositionProvider implements IPositionProvider {
  public getPosition(): Promise<IPosition> {
    return new Promise<IPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          reject(error);
        }
      );
    });
  }
}
