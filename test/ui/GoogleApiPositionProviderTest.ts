import { $$ } from '../../src/utils/Dom';
import { IResolvingPositionEventArgs, DistanceEvents } from '../../src/events/DistanceEvents';
import * as Mock from '../MockEnvironment';
import { IGoogleApiPositionProviderOptions, GoogleApiPositionProvider } from '../../src/ui/Distance/GoogleApiPositionProvider';

export function GoogleApiPositionProviderTest() {
  describe('GoogleApiPositionProvider', () => {
    let test: Mock.IBasicComponentSetup<GoogleApiPositionProvider>;

    beforeEach(() => {
      test = Mock.optionsComponentSetup<
        GoogleApiPositionProvider,
        IGoogleApiPositionProviderOptions
      >(GoogleApiPositionProvider, <IGoogleApiPositionProviderOptions>{
        googleApiKey: ''
      });
    });

    afterEach(() => {
      test = null;
    });

    it('should not add provider when API key is invalid', () => {
      const args: IResolvingPositionEventArgs = {
        providers: []
      };
      $$(test.env.element).trigger(DistanceEvents.onResolvingPosition, args);

      expect(args.providers.length).toBe(0);
    });
  });
}
