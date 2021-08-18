import * as Mock from '../MockEnvironment';
import {
  AuthenticationProvider,
  accessTokenStorageKey,
  handshakeInProgressStorageKey
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
import { QUERY_STATE_ATTRIBUTES } from '../../src/models/QueryStateModel';

export function AuthenticationProviderTest() {
  describe('AuthenticationProvider', function () {
    let initializationArgs: IInitializationEventArgs;
    let options: IAuthenticationProviderOptions;
    let test: Mock.IBasicComponentSetup<AuthenticationProvider>;

    function initAuthenticationProvider() {
      test = Mock.optionsComponentSetup<AuthenticationProvider, IAuthenticationProviderOptions>(AuthenticationProvider, options);
    }

    function setDataTab(el: HTMLElement, tab: string) {
      $$(el).setAttribute('data-tab', tab);
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
      localStorage.setItem(accessTokenStorageKey, accessToken);

      initAuthenticationProvider();
      setupEndpoint();

      const spy = spyOn(test.cmp.queryController.getEndpoint().accessToken, 'updateToken');
      triggerAfterComponentsInitialization();

      expect(spy).toHaveBeenCalledWith(accessToken);
    });

    it(`local storage contains an access token,
    auth provider has a data-tab configured,
    when components have initialized,
    it updates the endpoint to use the access token`, () => {
      const accessToken = 'access-token';
      localStorage.setItem(accessTokenStorageKey, accessToken);

      initAuthenticationProvider();
      setDataTab(test.cmp.element, 'a');
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

        exchangeTokenSpy = spyOn(test.cmp.queryController.getEndpoint(), 'exchangeHandshakeToken');
        exchangeTokenSpy.and.returnValue(Promise.resolve(accessToken));
      });

      it('sets the handshake-in-progress flag', () => {
        triggerAfterComponentsInitialization();
        expect(localStorage.getItem(handshakeInProgressStorageKey)).toBe('true');
      });

      it('exchanges the token', () => {
        triggerAfterComponentsInitialization();
        expect(exchangeTokenSpy).toHaveBeenCalledWith({ handshakeToken });
      });

      it(`when an accessToken is found in localstorage,
      it sends both the accessToken and handshake token`, () => {
        const accessToken = 'access-token';
        localStorage.setItem(accessTokenStorageKey, accessToken);
        triggerAfterComponentsInitialization();
        expect(exchangeTokenSpy).toHaveBeenCalledWith({ handshakeToken, accessToken });
      });

      it(`url hash starts with / followed by #handshake_token param,
      it exchanges the token`, () => {
        // Sharepoint adds a / between the # and the hash parameters.
        window.location.hash = `/handshake_token=${handshakeToken}`;
        triggerAfterComponentsInitialization();
        expect(exchangeTokenSpy).toHaveBeenCalledWith({ handshakeToken });
      });

      it(`url hash contains multiple params including an #handshake_token param,
      it exchanges the token`, () => {
        window.location.hash = `a=b&handshake_token=${handshakeToken}`;
        triggerAfterComponentsInitialization();
        expect(exchangeTokenSpy).toHaveBeenCalledWith({ handshakeToken });
      });

      describe(`url hash contains an active tab and a handshake token param,
      auth provider data-tab does not match the active tab`, () => {
        beforeEach(() => {
          window.location.hash = `${QUERY_STATE_ATTRIBUTES.T}=a&handshake_token=${handshakeToken}`;
          setDataTab(test.cmp.element, 'b');
        });

        it(`does not exchange the handshake token`, () => {
          triggerAfterComponentsInitialization();
          expect(exchangeTokenSpy).not.toHaveBeenCalled();
        });

        it('does not load an existing access token', () => {
          // Ensures that the AuthenticationProvider that is performing the exchange is using the
          // initially configured API key, not an access token loaded by a different instance.
          localStorage.setItem(accessTokenStorageKey, 'access-token');
          const spy = spyOn(test.cmp.queryController.getEndpoint().accessToken, 'updateToken');

          triggerAfterComponentsInitialization();
          expect(spy).not.toHaveBeenCalled();
        });
      });

      it(`url hash contains an active tab and a handshake token param,
      auth provider data-tab does not match the active tab,
      it does not exchange the token`, () => {
        window.location.hash = `${QUERY_STATE_ATTRIBUTES.T}=a&handshake_token=${handshakeToken}`;
        setDataTab(test.cmp.element, 'b');
        triggerAfterComponentsInitialization();
        expect(exchangeTokenSpy).not.toHaveBeenCalled();
      });

      it(`url hash contains an active tab and a handshake token param,
      auth provider data-tab matches the active tab,
      it exchanges the token`, () => {
        window.location.hash = `${QUERY_STATE_ATTRIBUTES.T}=a&handshake_token=${handshakeToken}`;
        setDataTab(test.cmp.element, 'a');
        $$(test.cmp.element).setAttribute('data-tab', 'a');
        triggerAfterComponentsInitialization();
        expect(exchangeTokenSpy).toHaveBeenCalledWith({ handshakeToken });
      });

      it(`url hash contains an #handshake_token with encoded characters,
      it decodes the token before exchanging it`, () => {
        const token = 'test%3Etoken';
        window.location.hash = `handshake_token=${token}`;

        triggerAfterComponentsInitialization();

        expect(exchangeTokenSpy).toHaveBeenCalledWith({ handshakeToken: 'test>token' });
      });

      it('adds an entry to the initialization args #defer array', () => {
        triggerAfterComponentsInitialization();
        expect(initializationArgs.defer.length).toBe(1);
      });

      it('adds the access token to local storage', async done => {
        triggerAfterComponentsInitialization();
        await Promise.resolve();

        const token = localStorage.getItem(accessTokenStorageKey);
        expect(token).toBe(accessToken);
        done();
      });

      it('removes the handshake-in-progress flag', done => {
        triggerAfterComponentsInitialization();

        setTimeout(() => {
          const flag = localStorage.getItem(handshakeInProgressStorageKey);
          expect(flag).toBe(null);
          done();
        }, 0);
      });

      it('it removes the handshake token from the url', async done => {
        window.location.hash = `a=b&handshake_token=${handshakeToken}`;
        triggerAfterComponentsInitialization();
        await Promise.resolve();

        expect(window.location.hash).toBe(`#a=b`);
        done();
      });

      it('when the hash starts with a /, it removes the handshake token from the url but keeps the slash', async done => {
        window.location.hash = `/a=b&handshake_token=${handshakeToken}`;
        triggerAfterComponentsInitialization();
        await Promise.resolve();

        expect(window.location.hash).toBe(`#/a=b`);
        done();
      });

      it('updates the endpoint to use the access token', done => {
        const spy = spyOn(test.cmp.queryController.getEndpoint().accessToken, 'updateToken');
        triggerAfterComponentsInitialization();

        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(accessToken);
          done();
        }, 0);
      });
    });

    describe('url hash contains a handshake token, when the exchange throws an error', () => {
      const errorMessage = 'unable to exchange token';
      let exchangeTokenSpy: jasmine.Spy;

      beforeEach(() => {
        window.location.hash = `handshake_token=token`;

        initAuthenticationProvider();
        setupEndpoint();

        exchangeTokenSpy = spyOn(test.cmp.queryController.getEndpoint(), 'exchangeHandshakeToken');
        exchangeTokenSpy.and.returnValue(Promise.reject(errorMessage));
      });

      it(`it logs an error`, async done => {
        const logggerSpy = spyOn(test.cmp.logger, 'error');
        triggerAfterComponentsInitialization();

        setTimeout(() => {
          expect(logggerSpy).toHaveBeenCalledWith(errorMessage);
          done();
        }, 0);
      });

      it('clears the handshake-in-progress flag', done => {
        triggerAfterComponentsInitialization();

        setTimeout(() => {
          expect(localStorage.getItem(handshakeInProgressStorageKey)).toBe(null);
          done();
        }, 0);
      });
    });

    describe(`a handshake is in progress`, () => {
      const accessToken = 'access-token';

      beforeEach(() => {
        localStorage.setItem(handshakeInProgressStorageKey, 'true');

        initAuthenticationProvider();
        setupEndpoint();
      });

      it('when the handshake completes, it loads the access token', done => {
        jasmine.clock().install();
        const spy = spyOn(test.cmp.queryController.getEndpoint().accessToken, 'updateToken');
        triggerAfterComponentsInitialization();

        jasmine.clock().tick(500);

        localStorage.setItem(accessTokenStorageKey, accessToken);
        localStorage.removeItem(handshakeInProgressStorageKey);

        jasmine.clock().tick(500);
        jasmine.clock().uninstall();

        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(accessToken);
          done();
        }, 0);
      });

      it('adds an entry to the initialization args #defer array', () => {
        triggerAfterComponentsInitialization();
        expect(initializationArgs.defer.length).toBe(1);
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
