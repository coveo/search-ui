/// <reference path="../Test.ts" />

module Coveo {
  describe('Analytics', function () {

    describe('with default setup', function () {
      var test: Mock.IBasicComponentSetup<Analytics>;
      beforeEach(function () {
        SearchEndpoint.endpoints['default'] = new SearchEndpoint({
          accessToken: 'some token'
        })
        test = Mock.basicComponentSetup<Analytics>(Analytics);
      })
      afterEach(function () {
        SearchEndpoint.endpoints['default'] = null;
        test = null;
      })

      it('use access token from default endpoint if not specified', function () {
        expect(test.cmp.options.token).toBe('some token');
      })

      it('log an event on query error', function () {
        spyOn(test.cmp.client, 'logCustomEvent')
        Simulate.query(test.env, {
          error: {
            message: 'oops',
            type: 'pretty bad',
            name: 'oops pretty bad'
          }
        })
        expect(test.cmp.client.logCustomEvent).toHaveBeenCalledWith(AnalyticsActionCauseList.queryError, jasmine.any(Object), jasmine.any(HTMLElement));
      })
    })

    describe('using the static create call', function () {
      var env: Mock.MockEnvironment;
      var analytics: HTMLDivElement;

      beforeEach(function () {
        env = new Mock.MockEnvironmentBuilder().build();
        env.usageAnalytics = null;
        analytics = document.createElement('div');
        analytics.className = 'CoveoAnalytics';
      })

      afterEach(function () {
        env = null;
        analytics = null;
      })

      it('should be Noop if not present in the interface', function () {
        expect(Analytics.create(env.root, undefined, env) instanceof NoopAnalyticsClient).toBe(true);
      })

      it('should be a LiveAnalyticsClient if present inside the interface', function () {
        env.root.appendChild(analytics);
        expect(Analytics.create(env.root, undefined, env) instanceof LiveAnalyticsClient).toBe(true);
      })

      it('should be a LiveAnalyticsClient if present outside the interface', function () {
        analytics.appendChild(env.root);
        expect(Analytics.create(env.root, undefined, env) instanceof LiveAnalyticsClient).toBe(true);
      })

      it('should be a MultiAnalyticsClient if present inside the interface multiple time', function () {
        var analytics2 = document.createElement('div');
        analytics2.className = 'CoveoAnalytics';
        env.root.appendChild(analytics);
        env.root.appendChild(analytics2);
        expect(Analytics.create(env.root, undefined, env) instanceof MultiAnalyticsClient).toBe(true);
      })

      it('should be a MultiAnalyticsClient if present both inside and outside', function () {
        var analytics2 = document.createElement('div');
        analytics2.className = 'CoveoAnalytics';
        env.root.appendChild(analytics2);
        analytics.appendChild(env.root);
        expect(Analytics.create(env.root, undefined, env) instanceof MultiAnalyticsClient).toBe(true);
      })

      it('should be a LiveAnalyticsClient if present outside the interface, shared between multiple interface', function () {
        var env2 = new Mock.MockEnvironmentBuilder().build();
        analytics.appendChild(env.root);
        analytics.appendChild(env2.root);
        var client = Analytics.create(env.root, undefined, env);
        var client2 = Analytics.create(env2.root, undefined, env);
        expect(client instanceof LiveAnalyticsClient).toBe(true);
        expect(client2 instanceof LiveAnalyticsClient).toBe(true);
        expect(client).toBe(client2);
      })

      it('should be LiveAnalyticsClient if present inside the interface, and NoopAnalyticsClient for another interface with no analytics', function () {
        var env2 = new Mock.MockEnvironmentBuilder().build();
        env.root.appendChild(analytics);
        expect(Analytics.create(env.root, undefined, env) instanceof LiveAnalyticsClient).toBe(true);
        expect(Analytics.create(env2.root, undefined, env2) instanceof NoopAnalyticsClient).toBe(true);
      })
    })

    describe('exposes options', function () {
      var test: Mock.IBasicComponentSetup<Analytics>;

      afterEach(function () {
        test = null;
      })

      it('user can be specified', function () {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          user: 'foobar'
        })
        var client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.userId).toBe('foobar');
      })

      it('userdisplayname can be specified', function () {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          userDisplayName: 'foobar'
        })
        var client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.userDisplayName).toBe('foobar');
      })

      it('token can be specified', function () {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          token: 'qwerty123'
        })
        var client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.endpoint.endpointCaller.options.accessToken).toBe('qwerty123');
      })

      it('endpoint can be specified', function () {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          endpoint: 'somewhere.com'
        })
        var client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.endpoint.options.serviceUrl).toBe('somewhere.com');
      })

      it('anonymous can be specified', function () {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          anonymous: true
        })
        var client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.anonymous).toBe(true);
      })

      it('searchHub can be specified', function () {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          searchHub: 'foobar'
        })
        var client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.originLevel1).toBe('foobar');
      })

      it('searchhub will be put in the query params', function () {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          searchHub: 'yoo'
        })
        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().searchHub).toBe('yoo');
      })

      it('searchhub should be put in the component options model for other component to see it\'s value', function () {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          searchHub: 'mama mia'
        })

        expect(test.env.componentOptionsModel.set).toHaveBeenCalledWith('searchHub', 'mama mia');
      })

      it('splitTestRunName can be specified', function () {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          splitTestRunName: 'foobar'
        })
        var client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.splitTestRunName).toBe('foobar');
      })

      it('splitTestRunVersion can be specified', function () {
        test = Mock.optionsComponentSetup<Analytics, IAnalyticsOptions>(Analytics, {
          splitTestRunVersion: 'foobar'
        })
        var client: LiveAnalyticsClient = <LiveAnalyticsClient>test.cmp.client;
        expect(client.splitTestRunVersion).toBe('foobar');
      })
    })
  })
}