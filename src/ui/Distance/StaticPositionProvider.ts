import { IPositionProvider, IPosition } from '../../events/DistanceEvents';

/**
 * The `StaticPositionProvider` class provides a static end user position to a
 * [`DistanceResources`]{@link DistanceResources} component.
 */
export class StaticPositionProvider implements IPositionProvider {
  constructor(private latitude: number, private longitude: number) {}

  public getPosition(): Promise<IPosition> {
    return Promise.resolve({
      longitude: this.longitude,
      latitude: this.latitude
    });
  }
}
