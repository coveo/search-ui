import * as Mock from '../MockEnvironment';
import { AuthenticationProvider, authProviderAccessToken } from '../../src/ui/AuthenticationProvider/AuthenticationProvider';
import { ModalBox } from '../../src/ExternalModulesShim';
import { IAuthenticationProviderOptions } from '../../src/ui/AuthenticationProvider/AuthenticationProvider';
import { IBuildingCallOptionsEventArgs } from '../../src/events/QueryEvents';
import { QueryEvents } from '../../src/events/QueryEvents';
import { ISettingsPopulateMenuArgs } from '../../src/ui/Settings/Settings';
import { SettingsEvents } from '../../src/events/SettingsEvents';
import { l } from '../../src/strings/Strings';
import { $$ } from '../../src/utils/Dom';
import { MissingAuthenticationError } from '../../src/rest/MissingAuthenticationError';
import _ = require('underscore');
import { SearchEndpoint } from '../../src/BaseModules';
import { InitializationEvents } from '../../src/EventsModules';
import { IInitializationEventArgs } from '../../src/events/InitializationEvents';

export function AuthenticationProviderTest() {
  describe('AuthenticationProvider', function () {
    let initializationArgs: IInitializationEventArgs;
    let options: IAuthenticationProviderOptions;
    let test: Mock.IBasicComponentSetup<AuthenticationProvider>;

    function initAuthenticationProvider() {
      test = Mock.optionsComponentSetup<AuthenticationProvider, IAuthenticationProviderOptions>(AuthenticationProvider, options);
    }

    function triggerAfterComponentsInitialization() {
      $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization, initializationArgs);
    }

    function setupEndpoint() {
      const endpoint = new SearchEndpoint({ restUri: 'https://platform.cloud.coveo.com/rest/search' });
      test.env.queryController.getEndpoint = () => endpoint;
    }

    beforeEach(function () {
      window.location.hash = '';
      localStorage.clear();

      initializationArgs = {
        defer: []
      };

      options = {
        name: 'foo',
        caption: 'foobar',
        useIFrame: true
      };

      spyOn(ModalBox, 'open').and.callFake(() => {});
      spyOn(ModalBox, 'close').and.callFake(() => {});

      initAuthenticationProvider();
    });

    afterEach(function () {
      test = null;
    });

    it(`local storage contains an access token,
    when components have initialized, it updates the endpoint to use the access token`, () => {
      const accessToken = 'access-token';
      localStorage.setItem(authProviderAccessToken, accessToken);

      initAuthenticationProvider();
      setupEndpoint();

      const spy = spyOn(test.cmp.queryController.getEndpoint().accessToken, 'updateToken');
      triggerAfterComponentsInitialization();

      expect(spy).toHaveBeenCalledWith(accessToken);
    });

    describe(`url hash contains a handshake token, when components have initialized`, () => {
      const handshakeToken = 'handshake-token';
      const accessToken = 'access-token';
      let exchangeTokenSpy: jasmine.Spy;

      beforeEach(() => {
        window.location.hash = `handshake_token=${handshakeToken}`;

        initAuthenticationProvider();
        setupEndpoint();

        exchangeTokenSpy = spyOn(test.cmp.queryController.getEndpoint(), 'exchangeAuthenticationProviderToken');
        exchangeTokenSpy.and.returnValue(Promise.resolve(accessToken));
      });

      it('exchanges the token', () => {
        triggerAfterComponentsInitialization();
        expect(exchangeTokenSpy).toHaveBeenCalledWith(handshakeToken);
      });

      it(`url hash contains multiple params including an #handshake_token param,
      it exchanges the token`, () => {
        window.location.hash = `a=b&handshake_token=${handshakeToken}`;
        triggerAfterComponentsInitialization();
        expect(exchangeTokenSpy).toHaveBeenCalledWith(handshakeToken);
      });

      it(`url hash contains an #handshake_token with encoded characters,
      it decodes the token before exchanging it`, () => {
        const token = 'test%3Etoken';
        window.location.hash = `handshake_token=${token}`;

        triggerAfterComponentsInitialization();

        expect(exchangeTokenSpy).toHaveBeenCalledWith('test>token');
      });

      it(`when the exchange throws an error, it logs an error`, async done => {
        const errorMessage = 'unable to exchange token';
        exchangeTokenSpy.and.returnValue(Promise.reject(errorMessage));

        const logggerSpy = spyOn(test.cmp.logger, 'error');
        triggerAfterComponentsInitialization();

        await Promise.resolve();

        expect(logggerSpy).toHaveBeenCalledWith(errorMessage);
        done();
      });

      it('adds an entry to the initialization args #defer array', () => {
        triggerAfterComponentsInitialization();
        expect(initializationArgs.defer.length).toBe(1);
      });

      it('adds the access token to local storage', async done => {
        triggerAfterComponentsInitialization();
        await Promise.resolve();

        const token = localStorage.getItem(authProviderAccessToken);
        expect(token).toBe(accessToken);
        done();
      });

      it('updates the endpoint to use the access token', async done => {
        const spy = spyOn(test.cmp.queryController.getEndpoint().accessToken, 'updateToken');
        triggerAfterComponentsInitialization();
        await Promise.resolve();

        expect(spy).toHaveBeenCalledWith(accessToken);
        done();
      });
    });

    describe('exposes options', function () {
      it('name should push name in buildingCallOptions', function () {
        options = { name: 'testpatate' };
        initAuthenticationProvider();

        let eventArgs: IBuildingCallOptionsEventArgs = {
          options: {
            authentication: []
          }
        };
        $$(test.cmp.root).trigger(QueryEvents.buildingCallOptions, eventArgs);
        expect(eventArgs.options.authentication).toEqual(jasmine.arrayContaining(['testpatate']));
      });

      describe('caption', function () {
        it('should set itself in the menu', function () {
          let populateMenuArgs: ISettingsPopulateMenuArgs = {
            settings: null,
            menuData: []
          };
          $$(test.cmp.root).trigger(SettingsEvents.settingsPopulateMenu, populateMenuArgs);
          expect(populateMenuArgs.menuData).toEqual(
            jasmine.arrayContaining([
              jasmine.objectContaining({
                text: l('Reauthenticate', 'foobar'),
                className: 'coveo-authentication-provider',
                onOpen: jasmine.any(Function)
              })
            ])
          );
        });

        it('should be the title of the modal box when iFrame is enabled', function () {
          $$(test.cmp.root).trigger(QueryEvents.queryError, { error: new MissingAuthenticationError('foo') });
          expect(ModalBox.open).toHaveBeenCalledWith(
            jasmine.anything(),
            jasmine.objectContaining({
              title: l('Authenticating', 'foobar')
            })
          );
        });
      });

      it('useIFrame set to false should redirect to auth provider URL', function () {
        options = {
          name: 'foo',
          caption: 'foobar',
          useIFrame: false
        };
        initAuthenticationProvider();

        let fakeWindow = Mock.mockWindow();
        test.cmp._window = fakeWindow;
        test.env.searchEndpoint.getAuthenticationProviderUri = () => 'coveo.com';
        $$(test.env.root).trigger(QueryEvents.queryError, { error: new MissingAuthenticationError('foo') });

        expect(fakeWindow.location.href).toBe('coveo.com');
      });

      it('useIFrame and showIFrame set to true should display a ModalBox containing iframe', function () {
        options = {
          name: 'foo',
          caption: 'foobar',
          useIFrame: true,
          showIFrame: true
        };
        initAuthenticationProvider();

        test.env.searchEndpoint.getAuthenticationProviderUri = () => 'http://coveo.com/';
        $$(test.env.root).trigger(QueryEvents.queryError, { error: new MissingAuthenticationError('foo') });
        expect(ModalBox.open['calls'].mostRecent().args[0].children[0].src).toBe('http://coveo.com/');
      });

      it('showIFrame set to false should show a waiting popup not containing the iframe', function () {
        options = {
          name: 'foo',
          caption: 'foobar',
          useIFrame: true,
          showIFrame: false
        };

        initAuthenticationProvider();

        $$(test.env.root).trigger(QueryEvents.queryError, { error: new MissingAuthenticationError('foo') });

        expect(ModalBox.open).toHaveBeenCalledWith(
          jasmine.objectContaining({
            className: 'coveo-waiting-for-authentication-popup'
          }),
          jasmine.anything()
        );
      });
    });

    it('should stop a redirect loop after 3 redirects', function () {
      spyOn(test.cmp.logger, 'error').and.returnValue(null);
      _.times(3, () => $$(test.env.root).trigger(QueryEvents.queryError, { error: { provider: 'foo' } }));

      $$(test.env.root).trigger(QueryEvents.queryError, { error: new MissingAuthenticationError('foo') });
      expect(test.cmp.logger.error).toHaveBeenCalledWith(
        'The AuthenticationProvider is in a redirect loop. This may be due to a back-end configuration problem.'
      );
    });
  });
}
