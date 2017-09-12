import * as Mock from '../MockEnvironment';
import { Analytics } from '../../src/ui/Analytics/Analytics';
import { SearchEndpoint } from '../../src/rest/SearchEndpoint';
import { IAnalyticsOptions } from '../../src/ui/Analytics/Analytics';
import { Simulate } from '../Simulate';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { NoopAnalyticsClient } from '../../src/ui/Analytics/NoopAnalyticsClient';
import { LiveAnalyticsClient } from '../../src/ui/Analytics/LiveAnalyticsClient';
import { MultiAnalyticsClient } from '../../src/ui/Analytics/MultiAnalyticsClient';

export function AnalyticsTest() {
  describe('Analytics', () => {
    describe('with default setup', () => {
      let test: Mock.IBasicComponentSetup<Analytics>;
      beforeEach(() => {
        SearchEndpoint.endpoints['default'] = new SearchEndpoint({
          accessToken: 'some token',
          queryStringArguments: { workgroup: 'organization' },
          restUri: 'some/uri'
        });
        test = Mock.basicComponentSetup<Analytics>(Analytics);
      });
      afterEach(() => {
        SearchEndpoint.endpoints['default'] = null;
        test = null;
      });

      it('use access token from default endpoint if not specified', () => {
        expect(test.cmp.options.token).toBe('some token');
      });

      it('uses organization from the search endpoint if not specified', () => {
        expect(test.cmp.options.organization).toBe('organization');
      });

      it('uses organization from options when specified', () => {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          organization: 'orgFromOptions'
        });
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

    describe('exposes options', () => {
      let test: Mock.IBasicComponentSetup<Analytics>;

      afterEach(() => {
        test = null;
      });

      it('user can be specified', () => {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          user: 'foobar'
        });
        let client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.userId).toBe('foobar');
      });

      it('userdisplayname can be specified', () => {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          userDisplayName: 'foobar'
        });
        let client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.userDisplayName).toBe('foobar');
      });

      it('token can be specified', () => {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          token: 'qwerty123'
        });
        let client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.endpoint.endpointCaller.options.accessToken).toBe('qwerty123');
      });

      it('endpoint can be specified', () => {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          endpoint: 'somewhere.com'
        });
        let client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.endpoint.options.serviceUrl).toBe('somewhere.com');
      });

      it('anonymous can be specified', () => {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          anonymous: true
        });
        let client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.anonymous).toBe(true);
      });

      it('searchHub can be specified', () => {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          searchHub: 'foobar'
        });
        let client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.originLevel1).toBe('foobar');
      });

      it('searchhub will be put in the query params', () => {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          searchHub: 'yoo'
        });
        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().searchHub).toBe('yoo');
      });

      it("searchhub should be put in the component options model for other component to see it's value", () => {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          searchHub: 'mama mia'
        });

        expect(test.env.componentOptionsModel.set).toHaveBeenCalledWith('searchHub', 'mama mia');
      });

      it('splitTestRunName can be specified', () => {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          splitTestRunName: 'foobar'
        });
        let client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.splitTestRunName).toBe('foobar');
      });

      it('splitTestRunVersion can be specified', () => {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          splitTestRunVersion: 'foobar'
        });
        let client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.splitTestRunVersion).toBe('foobar');
      });
    });
  });
}
