/// <reference path="../Test.ts" />
module Coveo {
  describe('AuthenticationProvider', function () {
    let test: Mock.IBasicComponentSetup<AuthenticationProvider>;
    let modalBoxCloseSpy: Function;

    beforeEach(function () {
      modalBoxCloseSpy = jasmine.createSpy('modalBoxClose');
      spyOn(ModalBox, 'open').and.returnValue({ close: modalBoxCloseSpy });

      test = Mock.optionsComponentSetup<AuthenticationProvider, IAuthenticationProviderOptions>(AuthenticationProvider, <IAuthenticationProviderOptions>{
        name: 'foo',
        caption: 'foobar',
        useIFrame: true
      })
    })

    afterEach(function () {
      test = null;
      modalBoxCloseSpy = null;
    })

    describe('exposes options', function () {
      it('name should push name in buildingCallOptions', function () {
        test = Mock.optionsComponentSetup<AuthenticationProvider, IAuthenticationProviderOptions>(AuthenticationProvider, <IAuthenticationProviderOptions>{
          name: 'testpatate'
        })
        let eventArgs: IBuildingCallOptionsEventArgs = {
          options: {
            authentication: []
          }
        };
        $$(test.cmp.root).trigger(QueryEvents.buildingCallOptions, eventArgs);
        expect(eventArgs.options.authentication).toEqual(jasmine.arrayContaining(['testpatate']));
      })

      describe('caption', function () {
        it('should set itself in the menu', function () {
          let populateMenuArgs: ISettingsPopulateMenuArgs = {
            settings: null,
            menuData: []
          }
          $$(test.cmp.root).trigger(SettingsEvents.settingsPopulateMenu, populateMenuArgs);
          expect(populateMenuArgs.menuData).toEqual(jasmine.arrayContaining([
            jasmine.objectContaining({
              text: l('Reauthenticate', 'foobar'),
              className: 'coveo-authentication-provider',
              onOpen: jasmine.any(Function)
            })
          ]))
        })

        it('should be the title of the modal box when iFrame is enabled', function () {
          test = Mock.optionsComponentSetup<AuthenticationProvider, IAuthenticationProviderOptions>(AuthenticationProvider, {
            name: 'foo',
            caption: 'foobar',
            useIFrame: true,
          })
          $$(test.cmp.root).trigger(QueryEvents.queryError, { error: { provider: 'foo' } })
          expect(ModalBox.open).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({
            title: l('Authenticating', 'foobar')
          }))
        })
      })

      it('useIFrame set to false should redirect to auth provider URL', function () {
        let fakeWindow = Mock.mockWindow();

        test = Mock.optionsComponentSetup<AuthenticationProvider, IAuthenticationProviderOptions>(AuthenticationProvider, {
          name: 'foo',
          caption: 'foobar',
          useIFrame: false
        })
        test.cmp._window = fakeWindow;
        test.env.searchEndpoint.getAuthenticationProviderUri = () => 'coveo.com';
        $$(test.env.root).trigger(QueryEvents.queryError, { error: { provider: 'foo' } });

        expect(fakeWindow.location.href).toBe('coveo.com');
      })

      it('useIFrame and showIFrame set to true should display a ModalBox containing iframe', function () {
        test = Mock.optionsComponentSetup<AuthenticationProvider, IAuthenticationProviderOptions>(AuthenticationProvider, {
          name: 'foo',
          caption: 'foobar',
          useIFrame: true,
          showIFrame: true
        })
        test.env.searchEndpoint.getAuthenticationProviderUri = () => 'http://coveo.com/';
        $$(test.env.root).trigger(QueryEvents.queryError, { error: { provider: 'foo' } });

        expect(ModalBox.open['calls'].mostRecent().args[0].children[0].src).toBe('http://coveo.com/');
      })

      it('showIFrame set to false should show a waiting popup not containing the iframe', function () {
        test = Mock.optionsComponentSetup<AuthenticationProvider, IAuthenticationProviderOptions>(AuthenticationProvider, {
          name: 'foo',
          caption: 'foobar',
          useIFrame: true,
          showIFrame: false
        })
        $$(test.env.root).trigger(QueryEvents.queryError, { error: { provider: 'foo' } });

        expect(ModalBox.open).toHaveBeenCalledWith(jasmine.objectContaining({
          className: 'coveo-waiting-for-authentication-popup'
        }), jasmine.anything());
      })
    })

    it('should close the ModalBox when a "success" message is posted on window', function () {
      let fakeWindow = Mock.mockWindow();
      test.cmp._window = fakeWindow;
      $$(test.env.root).trigger(QueryEvents.queryError, { error: { provider: 'foo' } });
      $$(<any>fakeWindow).trigger('message', { data: 'success' });
      expect(modalBoxCloseSpy).toHaveBeenCalled();
    })

    it('should stop a redirect loop after 3 redirects', function () {
      spyOn(test.cmp.logger, 'error').and.returnValue(null);
      _.times(3, () => $$(test.env.root).trigger(QueryEvents.queryError, { error: { provider: 'foo' } }));

      $$(test.env.root).trigger(QueryEvents.queryError, { error: { provider: 'foo' } });
      expect(test.cmp.logger.error).toHaveBeenCalledWith('The AuthenticationProvider is in a redirect loop. This may be due to a back-end configuration problem.');
    })
  })
}
