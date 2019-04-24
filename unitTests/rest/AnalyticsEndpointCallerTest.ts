import { AnalyticsEndpointCaller } from '../../src/rest/AnalyticsEndpointCaller';
import { EndpointCaller } from '../../src/Core';

export const AnalyticsEndpointCallerTest = () => {
  describe('AnalyticsEndpointCaller', () => {
    let analyticsCaller: AnalyticsEndpointCaller;

    const buildRequest = (url: string) => {
      return {
        url,
        method: 'POST',
        requestData: {},
        queryString: [],
        responseType: 'text',
        errorsAsSuccess: false
      };
    };

    beforeEach(() => {
      analyticsCaller = new AnalyticsEndpointCaller();
      jasmine.Ajax.install();
    });

    afterEach(() => {
      jasmine.Ajax.uninstall();
    });

    it('should not use sendBeacon for search event', () => {
      analyticsCaller.call(buildRequest('https://blah.analytics.com/searches'));
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('https://blah.analytics.com/searches');
    });

    it('should not use sendBeacon for custom event', () => {
      analyticsCaller.call(buildRequest('https://blah.analytics.com/custom'));
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('https://blah.analytics.com/custom');
    });

    it('should use sendBeacon for click event', () => {
      analyticsCaller.call(buildRequest('https://blah.analytics.com/click'));
      expect(jasmine.Ajax.requests.mostRecent()).toBeUndefined();
    });

    it('should not use sendBeacon for click event if the API is not usable', () => {
      const origSendBeacon = navigator.sendBeacon;
      navigator.sendBeacon = { oh: 'boy' } as any;
      analyticsCaller.call(buildRequest('https://blah.analytics.com/click'));
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('https://blah.analytics.com/click');
      navigator.sendBeacon = origSendBeacon;
    });

    describe('when navigator.sendBeacon is mocked', () => {
      let spyBeacon: jasmine.Spy;
      let spyBlob: jasmine.Spy;

      let origSendBeacon: any;
      let origBlob: any;

      beforeEach(() => {
        origSendBeacon = navigator.sendBeacon;
        origBlob = window.Blob;

        spyBlob = jasmine.createSpy('blob', Blob);
        spyBeacon = jasmine.createSpy('sendBeacon', navigator.sendBeacon);
        navigator.sendBeacon = spyBeacon;
        window.Blob = spyBlob as any;
      });

      afterEach(() => {
        navigator.sendBeacon = origSendBeacon;
        window.Blob = origBlob;
      });

      it('should properly send the request type as application/x-www-form-urlencoded', () => {
        analyticsCaller.call(buildRequest('https://blah.analytics.com/click'));
        expect(spyBlob).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({ type: 'application/x-www-form-urlencoded' }));
      });

      it('should properly send the access token as a query string parameter', () => {
        analyticsCaller.options.accessToken = 'foo';
        analyticsCaller.call(buildRequest('https://blah.analytics.com/click'));
        expect(spyBeacon).toHaveBeenCalledWith('https://blah.analytics.com/click?access_token=foo', jasmine.anything());
      });

      it('should properly encode the payload', () => {
        const payload = {
          actionCause: 'something',
          customData: {
            foo: 'bar'
          }
        };

        analyticsCaller.call({
          url: 'https://blah.analytics.com/click',
          method: 'POST',
          requestData: payload,
          queryString: [],
          responseType: 'text',
          errorsAsSuccess: false
        });

        expect(spyBlob).toHaveBeenCalledWith(
          jasmine.arrayContaining([EndpointCaller.convertJsonToFormBody({ clickEvent: payload })]),
          jasmine.anything()
        );
      });
    });
  });
};
