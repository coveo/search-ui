import { IPositionProvider, DistanceEvents, IPosition } from '../../events/DistanceEvents';

/**
 * The `StaticPositionProvider` component provides a static user position to a [`DistanceResources`]{@link DistanceResources} component.
 */
export class StaticPositionProvider implements IPositionProvider {
  constructor(private latitude: number, private longitude: number) {}

  public getPosition(): Promise<IPosition> {
    return Promise.resolve({
      long: this.longitude,
      lat: this.latitude
    });
  }
}
