import * as Mock from '../MockEnvironment';
import {
  AuthenticationProvider,
  authProviderAccessToken,
  authProviderTemporaryToken
} from '../../src/ui/AuthenticationProvider/AuthenticationProvider';
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

    function setupDefaultEndpoint() {
      SearchEndpoint.endpoints['default'] = new SearchEndpoint({
        restUri: 'https://platform.cloud.coveo.com/rest/search'
      });
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

    it('url hash contains an #access_token param, it stores the token in localstorage', () => {
      const token = 'test-token';
      window.location.hash = `access_token=${token}`;

      initAuthenticationProvider();

      expect(localStorage.getItem(authProviderTemporaryToken)).toBe(token);
    });

    it('url hash contains multiple params including an #access_token param, it stores the token in localstorage', () => {
      const token = 'test-token';
      window.location.hash = `a=b&access_token=${token}`;

      initAuthenticationProvider();

      expect(localStorage.getItem(authProviderTemporaryToken)).toBe(token);
    });

    it('url hash contains an #access_token param, it decodes the token before storing it', () => {
      const token = 'test%3Etoken';
      window.location.hash = `access_token=${token}`;

      initAuthenticationProvider();

      expect(localStorage.getItem(authProviderTemporaryToken)).toBe('test>token');
    });

    it(`local storage contains an access token and no temporary token,
    when components have initialized, it updates the endpoint to use the access token`, () => {
      const accessToken = 'access-token';
      localStorage.setItem(authProviderAccessToken, accessToken);

      setupDefaultEndpoint();
      const spy = spyOn(SearchEndpoint.endpoints['default'].accessToken, 'updateToken');
      initAuthenticationProvider();

      triggerAfterComponentsInitialization();

      expect(spy).toHaveBeenCalledWith(accessToken);
    });

    describe(`local storage contains a temporary token, when components have initialized`, () => {
      const accessToken = 'access-token';

      beforeEach(() => {
        localStorage.setItem(authProviderTemporaryToken, 'temporary-token');
        setupDefaultEndpoint();

        spyOn(SearchEndpoint.endpoints['default'], 'exchangeAuthenticationProviderTemporaryTokenForAccessToken').and.returnValue(
          accessToken
        );

        initAuthenticationProvider();
      });

      it('adds an entry to the initialization args #defer array', () => {
        triggerAfterComponentsInitialization();
        expect(initializationArgs.defer.length).toBe(1);
      });

      it('removes the temporary token from local storage', done => {
        triggerAfterComponentsInitialization();

        setTimeout(() => {
          const token = localStorage.getItem(authProviderTemporaryToken);
          expect(token).toBe(null);
          done();
        }, 0);
      });

      it('adds the access token to local storage', done => {
        triggerAfterComponentsInitialization();

        setTimeout(() => {
          const token = localStorage.getItem(authProviderAccessToken);
          expect(token).toBe(accessToken);
          done();
        }, 0);
      });

      it('updates the endpoint to use the access token', done => {
        const spy = spyOn(SearchEndpoint.endpoints['default'].accessToken, 'updateToken');

        triggerAfterComponentsInitialization();

        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(accessToken);
          done();
        }, 0);
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
