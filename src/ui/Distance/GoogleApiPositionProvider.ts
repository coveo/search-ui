import { EndpointCaller } from '../../rest/EndpointCaller';
import { IComponentBindings } from '../Base/ComponentBindings';
import { DistanceEvents, IResolvingPositionEventArgs, IPosition, IPositionProvider } from '../../events/DistanceEvents';

const GOOGLE_MAP_BASE_URL = 'https://www.googleapis.com/geolocation/v1/geolocate';

interface IGeolocationResponse {
  location: IGeolocationResponseLocation;
}

interface IGeolocationResponseLocation {
  lat: number;
  lng: number;
}

/**
 * The `GoogleApiPositionProvider` component provides the user's position to a [`DistanceResources`]{@link DistanceResources} component using Google's geolocation API.
 */
export class GoogleApiPositionProvider implements IPositionProvider {
  constructor(private googleApiKey: string) {}

  public getPosition(): Promise<IPosition> {
    return new EndpointCaller()
      .call<IGeolocationResponse>({
        errorsAsSuccess: false,
        method: 'GET',
        queryString: [`key=${this.googleApiKey}`],
        requestData: {},
        responseType: 'json',
        url: GOOGLE_MAP_BASE_URL
      })
      .then(responseData => {
        const location = responseData.data.location;
        return {
          lat: location.lat,
          long: location.lng
        };
      });
  }
}
