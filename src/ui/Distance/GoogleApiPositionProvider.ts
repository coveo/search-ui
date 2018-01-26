import { EndpointCaller } from '../../rest/EndpointCaller';
import { IGeolocationPosition, IGeolocationPositionProvider } from '../../events/DistanceEvents';

const GOOGLE_MAP_BASE_URL = 'https://www.googleapis.com/geolocation/v1/geolocate';

interface IGeolocationResponse {
  location: IGeolocationResponseLocation;
}

interface IGeolocationResponseLocation {
  lat: number;
  lng: number;
}

/**
 * The `GoogleApiPositionProvider` class uses the
 * [Google Maps Geolocation API]{https://developers.google.com/maps/documentation/geolocation/intro} to provide the
 * position of the end user to a [`DistanceResources`]{@link DistanceResources} component whose
 * [`googleApiKey`]{@link DistanceResources.options.googleApiKey} option is set to a valid  Google Maps Geolocation API
 * key.
 */
export class GoogleApiPositionProvider implements IGeolocationPositionProvider {
  constructor(private googleApiKey: string) {}

  public getPosition(): Promise<IGeolocationPosition> {
    return new EndpointCaller()
      .call<IGeolocationResponse>({
        errorsAsSuccess: false,
        method: 'POST',
        queryString: [`key=${this.googleApiKey}`],
        requestData: {},
        responseType: 'json',
        url: GOOGLE_MAP_BASE_URL
      })
      .then(responseData => {
        const location = responseData.data.location;
        return {
          longitude: location.lng,
          latitude: location.lat
        };
      });
  }
}
