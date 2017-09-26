export interface IPosition {
  long: number;
  lat: number;
}

export interface IPositionProvider {
  getPosition(): Promise<IPosition>;
}

export interface IResolvingPositionEventArgs {
  providers: IPositionProvider[];
}

export interface IPositionResolvedEventArgs {
  position: IPosition;
}

export class DistanceEvents {
  public static onPositionResolved = 'onPositionResolved';
  public static onResolvingPosition = 'onResolvingPosition';
  public static onPositionNotResolved = 'onPositionNotResolved';
}
