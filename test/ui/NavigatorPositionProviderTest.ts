import { $$ } from '../../src/utils/Dom';
import { IResolvingPositionEventArgs, DistanceEvents } from '../../src/events/DistanceEvents';
import * as Mock from '../MockEnvironment';
import { INavigatorPositionProviderOptions, NavigatorPositionProvider } from '../../src/ui/Distance/NavigatorPositionProvider';

export function NavigatorPositionProviderTest() {
  describe('NavigatorPositionProvider', () => {
    const latitudeForANicePlace = 46.768005;
    const longitudeForANicePlace = -71.309405;

    const succeedingCurrentPosition = successCallback => {
      successCallback(<Position>{
        timestamp: new Date().getTime(),
        coords: {
          accuracy: 0,
          altitude: 1,
          altitudeAccuracy: 1,
          heading: 1,
          speed: 1,
          latitude: latitudeForANicePlace,
          longitude: longitudeForANicePlace
        }
      });
    };

    const failingCurrentPosition = (successCallback, errorCallback) => {
      errorCallback();
    };

    let test: Mock.IBasicComponentSetup<NavigatorPositionProvider>;

    beforeEach(() => {
      test = Mock.basicComponentSetup<NavigatorPositionProvider>(NavigatorPositionProvider);
      navigator.geolocation.getCurrentPosition = succeedingCurrentPosition;
    });

    afterEach(() => {
      test = null;
    });

    it('should get the position from the navigator', done => {
      const args: IResolvingPositionEventArgs = {
        providers: []
      };
      $$(test.env.element).trigger(DistanceEvents.onResolvingPosition, args);

      args.providers[0].getPosition().then(position => {
        expect(position.lat).toBe(latitudeForANicePlace);
        expect(position.long).toBe(longitudeForANicePlace);
        done();
      });
    });

    it('should fail when the navigator call fails', done => {
      navigator.geolocation.getCurrentPosition = failingCurrentPosition;
      const args: IResolvingPositionEventArgs = {
        providers: []
      };
      $$(test.env.element).trigger(DistanceEvents.onResolvingPosition, args);

      args.providers[0].getPosition().catch(position => {
        done();
      });
    });
  });
}
