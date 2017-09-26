import { $$ } from '../../src/utils/Dom';
import { IResolvingPositionEventArgs, DistanceEvents } from '../../src/events/DistanceEvents';
import * as Mock from '../MockEnvironment';
import { IStaticPositionProviderOptions, StaticPositionProvider } from '../../src/ui/Distance/StaticPositionProvider';

export function StaticPositionProviderTest() {
  describe('StaticPositionProvider', () => {
    const latitudeForANicePlace = 46.768005;
    const longitudeForANicePlace = -71.309405;

    let test: Mock.IBasicComponentSetup<StaticPositionProvider>;

    beforeEach(() => {
      test = Mock.optionsComponentSetup<
        StaticPositionProvider,
        IStaticPositionProviderOptions
      >(StaticPositionProvider, <IStaticPositionProviderOptions>{
        latitude: latitudeForANicePlace,
        longitude: longitudeForANicePlace
      });
    });

    afterEach(() => {
      test = null;
    });

    it('should register a provider that returns the position from the options', done => {
      const args: IResolvingPositionEventArgs = {
        providers: []
      };
      $$(test.env.element).trigger(DistanceEvents.onResolvingPosition, args);

      let position = args.providers[0].getPosition().then(position => {
        expect(position.lat).toBe(latitudeForANicePlace);
        expect(position.long).toBe(longitudeForANicePlace);
        done();
      });
    });
  });
}
