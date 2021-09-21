import * as Mock from '../MockEnvironment';
import { Analytics } from '../../src/ui/Analytics/Analytics';
import { SearchEndpoint } from '../../src/rest/SearchEndpoint';
import { IAnalyticsOptions } from '../../src/ui/Analytics/Analytics';
import { Simulate } from '../Simulate';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { NoopAnalyticsClient } from '../../src/ui/Analytics/NoopAnalyticsClient';
import { LiveAnalyticsClient } from '../../src/ui/Analytics/LiveAnalyticsClient';
import { MultiAnalyticsClient } from '../../src/ui/Analytics/MultiAnalyticsClient';
import { AnalyticsEvents, $$ } from '../../src/Core';

export function AnalyticsTest() {
  describe('Analytics', () => {
    let options: IAnalyticsOptions = {};
    let test: Mock.IBasicComponentSetup<Analytics>;

    function initAnalytics() {
      test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, options);
    }

    beforeEach(() => {
      options = {};
      SearchEndpoint.endpoints['default'] = new SearchEndpoint({
        accessToken: 'some token',
        queryStringArguments: { organizationId: 'organization' },
        restUri: 'some/uri'
      });
    });

    afterEach(() => {
      SearchEndpoint.endpoints['default'] = null;
      test = null;
    });

    describe('with an endpoint configured directly on the search interface', () => {
      beforeEach(() => {
        test = Mock.advancedComponentSetup<Analytics>(
          Analytics,
          new Mock.AdvancedComponentSetupOptions(null, null, env => {
            env.searchInterface.options.endpoint = new SearchEndpoint({
              accessToken: 'another token',
              queryStringArguments: { organizationId: 'another organization' },
              restUri: 'another/uri'
            });
            return env;
          })
        );
      });

      it('uses access token from the endpoint set on the search interface', () => {
        expect(test.cmp.options.token).toBe('another token');
      });

      it('uses organization from the endpoint set on the search interface', () => {
        expect(test.cmp.options.organization).toBe('another organization');
      });
    });

    describe('with default setup', () => {
      beforeEach(() => {
        SearchEndpoint.endpoints['default'] = new SearchEndpoint({
          accessToken: 'some token',
          queryStringArguments: { organizationId: 'organization' },
          restUri: 'some/uri',
          renewAccessToken: async () => 'a renewed token'
        });
        test = Mock.basicComponentSetup<Analytics>(Analytics);
      });

      afterEach(() => {
        test = null;
      });

      it('use URL from default endpoint if not specified', () => {
        expect(test.cmp.options.endpoint).toBe(SearchEndpoint.endpoints['default'].options.restUri + '/rest/ua');
      });

      it('use access token from default endpoint if not specified', () => {
        expect(test.cmp.options.token).toBe('some token');
        expect(test.cmp.client.endpoint.endpointCaller.options.accessToken).toBe('some token');
      });

      it('renews the token correctly', done => {
        SearchEndpoint.endpoints['default'].accessToken.doRenew().then(() => {
          expect(test.cmp.options.token).toBe('a renewed token');
          expect(test.cmp.client.endpoint.endpointCaller.options.accessToken).toBe('a renewed token');
          done();
        });
      });

      it('uses organization from default endpoint if not specified', () => {
        expect(test.cmp.options.organization).toBe('organization');
      });

      it('uses organization from options when specified', () => {
        options.organization = 'orgFromOptions';
        initAnalytics();
        expect(test.cmp.options.organization).toBe('orgFromOptions');
      });

      it('log an event on query error', () => {
        spyOn(test.cmp.client, 'logCustomEvent');
        Simulate.query(test.env, {
          error: {
            message: 'oops',
            type: 'pretty bad',
            name: 'oops pretty bad'
          }
        });
        expect(test.cmp.client.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.queryError,
          jasmine.any(Object),
          jasmine.any(HTMLElement)
        );
      });

      describe('using the static create call', () => {
        let env: Mock.IMockEnvironment;
        let analytics: HTMLDivElement;

        beforeEach(() => {
          env = new Mock.MockEnvironmentBuilder().build();
          env.usageAnalytics = null;
          analytics = document.createElement('div');
          analytics.className = 'CoveoAnalytics';
        });

        afterEach(() => {
          env = null;
          analytics = null;
        });

        it('should be Noop if not present in the interface', () => {
          expect(Analytics.create(env.root, undefined, env) instanceof NoopAnalyticsClient).toBe(true);
        });

        it('should be a LiveAnalyticsClient if present inside the interface', () => {
          env.root.appendChild(analytics);
          expect(Analytics.create(env.root, undefined, env) instanceof LiveAnalyticsClient).toBe(true);
        });

        it('should be a LiveAnalyticsClient if present outside the interface', () => {
          analytics.appendChild(env.root);
          expect(Analytics.create(env.root, undefined, env) instanceof LiveAnalyticsClient).toBe(true);
        });

        it('should be a MultiAnalyticsClient if present inside the interface multiple time', () => {
          let analytics2 = document.createElement('div');
          analytics2.className = 'CoveoAnalytics';
          env.root.appendChild(analytics);
          env.root.appendChild(analytics2);
          expect(Analytics.create(env.root, undefined, env) instanceof MultiAnalyticsClient).toBe(true);
        });

        it('should be a MultiAnalyticsClient if present both inside and outside', () => {
          let analytics2 = document.createElement('div');
          analytics2.className = 'CoveoAnalytics';
          env.root.appendChild(analytics2);
          analytics.appendChild(env.root);
          expect(Analytics.create(env.root, undefined, env) instanceof MultiAnalyticsClient).toBe(true);
        });

        it('should be a LiveAnalyticsClient if present outside the interface, shared between multiple interface', () => {
          let env2 = new Mock.MockEnvironmentBuilder().build();
          analytics.appendChild(env.root);
          analytics.appendChild(env2.root);
          let client = Analytics.create(env.root, undefined, env);
          let client2 = Analytics.create(env2.root, undefined, env);
          expect(client instanceof LiveAnalyticsClient).toBe(true);
          expect(client2 instanceof LiveAnalyticsClient).toBe(true);
          expect(client).toBe(client2);
        });

        it('should be LiveAnalyticsClient if present inside the interface, and NoopAnalyticsClient for another interface with no analytics', () => {
          let env2 = new Mock.MockEnvironmentBuilder().build();
          env.root.appendChild(analytics);
          expect(Analytics.create(env.root, undefined, env) instanceof LiveAnalyticsClient).toBe(true);
          expect(Analytics.create(env2.root, undefined, env2) instanceof NoopAnalyticsClient).toBe(true);
        });
      });

      describe('with data layer in page', () => {
        let defaultDataLayerName = 'dataLayer';
        let customDataLayerName = 'myDataLayer';
        let data = {
          event: 'CoveoCustomEvent',
          coveoAnalyticsEventData: {
            language: 'en',
            device: 'test device',
            searchInterface: 'test interface',
            searchHub: 'test searchHub',
            responseTime: 100,
            actionType: 'testActionType',
            actionCause: 'testActionCause',
            customMetadatas: { testKey: 'testValue' }
          }
        };
        beforeEach(() => {
          (<any>window)[defaultDataLayerName] = [];
          (<any>window)[customDataLayerName] = [];
        });

        afterEach(() => {
          delete (<any>window)[customDataLayerName];
          delete (<any>window)[defaultDataLayerName];
        });

        it('should not automatically attempt to push to data layer if autoPushToGtmDataLayer is false', () => {
          test = Mock.basicComponentSetup<Analytics>(Analytics);
          spyOn(test.cmp, 'pushToGtmDataLayer');
          $$(test.env.root).trigger(AnalyticsEvents.analyticsEventReady, data);
          expect(test.cmp.pushToGtmDataLayer).not.toHaveBeenCalled();
        });

        it('should not automatically attempt to push to data layer if autoPushToGtmDataLayer is true and gtmDataLayerName is the empty string', () => {
          options = {
            autoPushToGtmDataLayer: true,
            gtmDataLayerName: ''
          };
          initAnalytics();

          spyOn(test.cmp, 'pushToGtmDataLayer');
          $$(test.env.root).trigger(AnalyticsEvents.analyticsEventReady, data);
          expect(test.cmp.pushToGtmDataLayer).not.toHaveBeenCalled();
        });

        it('should not automatically attempt to push to data layer if autoPushToGtmDataLayer is true and data layer is undefined', () => {
          options = {
            autoPushToGtmDataLayer: true,
            gtmDataLayerName: 'myImaginaryDataLayer'
          };
          initAnalytics();

          spyOn(test.cmp, 'pushToGtmDataLayer');
          $$(test.env.root).trigger(AnalyticsEvents.analyticsEventReady, data);
          expect(test.cmp.pushToGtmDataLayer).not.toHaveBeenCalled();
        });

        it('should automatically attempt to push to data layer if autoPushToGtmDataLayer is true and gtmDataLayerName is unspecified', () => {
          options = { autoPushToGtmDataLayer: true };
          initAnalytics();

          spyOn(test.cmp, 'pushToGtmDataLayer');
          $$(test.env.root).trigger(AnalyticsEvents.analyticsEventReady, data);
          expect(test.cmp.pushToGtmDataLayer).toHaveBeenCalledWith(data);
        });

        it('should automatically attempt to push to data layer if autoPushToGtmDataLayer is true and gtmDataLayerName is specified', () => {
          options = {
            autoPushToGtmDataLayer: true,
            gtmDataLayerName: customDataLayerName
          };
          initAnalytics();

          spyOn(test.cmp, 'pushToGtmDataLayer');
          $$(test.env.root).trigger(AnalyticsEvents.analyticsEventReady, data);
          expect(test.cmp.pushToGtmDataLayer).toHaveBeenCalledWith(data);
        });

        it('can push to valid default gtmDataLayerName, even if autoPushToGtmDataLayer is false', () => {
          options = { autoPushToGtmDataLayer: false };
          initAnalytics();

          test.cmp.pushToGtmDataLayer.call(test.cmp, data);
          expect((<any>window)[defaultDataLayerName][0]).toBe(data);
        });

        it('can push to valid specified gtmDataLayerName, even if autoPushToGtmDataLayer is false', () => {
          options = {
            autoPushToGtmDataLayer: false,
            gtmDataLayerName: customDataLayerName
          };
          initAnalytics();

          test.cmp.pushToGtmDataLayer.call(test.cmp, data);
          expect((<any>window)[customDataLayerName][0]).toBe(data);
        });

        it('should catch error when pushing to invalid data layer', () => {
          options = {
            autoPushToGtmDataLayer: false,
            gtmDataLayerName: 'myImaginaryDataLayer'
          };
          initAnalytics();

          test.cmp.pushToGtmDataLayer.call(test.cmp, data);
          expect(() => {
            test.cmp.pushToGtmDataLayer.call(test.cmp, data);
          }).not.toThrow();
        });
      });

      describe('exposes options', () => {
        function analyticsClient() {
          return <LiveAnalyticsClient>test.cmp.client;
        }

        it('user can be specified', () => {
          options = { user: 'foobar' };
          initAnalytics();

          expect(analyticsClient().userId).toBe('foobar');
        });

        it('userdisplayname can be specified', () => {
          options = { userDisplayName: 'foobar' };
          initAnalytics();

          expect(analyticsClient().userDisplayName).toBe('foobar');
        });

        it('token can be specified', () => {
          options = { token: 'qwerty123' };
          initAnalytics();

          expect(analyticsClient().endpoint.endpointCaller.options.accessToken).toBe('qwerty123');
        });

        it(`when a legacy usage analytics endpoint is defined that does not end with /rest,
        it ensures the endpoint ends with /rest`, () => {
          const endpoint = 'https://usageanalyticshipaa.cloud.coveo.com';

          options = { endpoint };
          initAnalytics();
          expect(test.cmp.options.endpoint).toBe(`${endpoint}/rest`);
        });

        it(`when a non-legacy endpoint is defined (i.e. not usageanalytics), it is not modified`, () => {
          const endpoint = 'https://platformhipaa.cloud.coveo.com/rest/ua';
          options = { endpoint };
          initAnalytics();

          expect(test.cmp.options.endpoint).toBe(endpoint);
        });

        it(`when an endpoint is defined that ends with /rest,
        it does not append a second /rest`, () => {
          const endpoint = 'somewhere.com/rest';
          options = { endpoint };
          initAnalytics();

          expect(test.cmp.options.endpoint).toBe(endpoint);
        });

        it('anonymous can be specified', () => {
          options = { anonymous: true };
          initAnalytics();

          expect(analyticsClient().anonymous).toBe(true);
        });

        it('searchHub can be specified', () => {
          options = { searchHub: 'foobar' };
          initAnalytics();

          expect(analyticsClient().originLevel1).toBe('foobar');
        });

        it('searchhub will be put in the query params', () => {
          options = { searchHub: 'yoo' };
          initAnalytics();

          let simulation = Simulate.query(test.env);
          expect(simulation.queryBuilder.build().searchHub).toBe('yoo');
        });

        it("searchhub should be put in the component options model for other component to see it's value", () => {
          options = { searchHub: 'mama mia' };
          initAnalytics();

          expect(test.env.componentOptionsModel.set).toHaveBeenCalledWith('searchHub', 'mama mia');
        });

        it('splitTestRunName can be specified', () => {
          options = { splitTestRunName: 'foobar' };
          initAnalytics();

          expect(analyticsClient().splitTestRunName).toBe('foobar');
        });

        it('splitTestRunVersion can be specified', () => {
          options = { splitTestRunVersion: 'foobar' };
          initAnalytics();

          expect(analyticsClient().splitTestRunVersion).toBe('foobar');
        });
      });
    });
  });
}
