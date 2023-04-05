import * as Mock from '../MockEnvironment';
import { AnalyticsEndpoint } from '../../src/rest/AnalyticsEndpoint';
import { LiveAnalyticsClient } from '../../src/ui/Analytics/LiveAnalyticsClient';
import { IQueryResults } from '../../src/rest/QueryResults';
import { FakeResults } from '../Fake';
import { IAnalyticsNoMeta } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { PendingSearchAsYouTypeSearchEvent } from '../../src/ui/Analytics/PendingSearchAsYouTypeSearchEvent';
import { PendingSearchEvent } from '../../src/ui/Analytics/PendingSearchEvent';
import { IQuery } from '../../src/rest/Query';
import { Simulate, ISimulateQueryData } from '../Simulate';
import { $$ } from '../../src/utils/Dom';
import { AnalyticsEvents } from '../../src/events/AnalyticsEvents';
import { Defer } from '../../src/misc/Defer';
import { IQueryResult } from '../../src/rest/QueryResult';
import _ = require('underscore');

export function LiveAnalyticsClientTest() {
  describe('LiveAnalyticsClient', function () {
    var endpoint: AnalyticsEndpoint;
    var env: Mock.IMockEnvironment;
    var client: LiveAnalyticsClient;
    let results: IQueryResults;
    var promise: Promise<IQueryResults>;

    beforeEach(function () {
      // Thanks phantom js for bad native event support
      if (Simulate.isPhantomJs()) {
        Simulate.addJQuery();
      }

      env = new Mock.MockEnvironmentBuilder().build();
      endpoint = Mock.mockAnalyticsEndpoint();
      client = new LiveAnalyticsClient(
        endpoint,
        env.root,
        'foo',
        'foo display',
        false,
        'foo run name',
        'foo run version',
        'default',
        true,
        { searchInterface: env.searchInterface }
      );
      promise = new Promise((resolve, reject) => {
        resolve((results = FakeResults.createFakeResults(3)));
      });
    });

    afterEach(function () {
      env = null;
      endpoint = null;
      client = null;
      promise = null;
      Simulate.removeJQuery();
    });

    it('should return pending event', () => {
      client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
      expect(client.getPendingSearchEvent() instanceof PendingSearchEvent).toBe(true);
      client.cancelAllPendingEvents();
      client.logSearchAsYouType<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
      expect(client.getPendingSearchEvent() instanceof PendingSearchAsYouTypeSearchEvent).toBe(true);
    });

    it('originContext can be specified', () => {
      client.setOriginContext('context');
      client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
      expect(client.getPendingSearchEvent().templateSearchEvent.originContext).toBe('context');
    });

    it('should send proper information on logSearchEvent', function (done) {
      client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
      var query: IQuery = {
        q: 'the query',
        aq: 'the advanced query',
        firstResult: 20,
        numberOfResults: 10,
        enableDidYouMean: true,
        context: { key1: 'value1', key2: 'value2' }
      };

      Simulate.query(env, {
        query: query,
        promise: promise
      });
      _.defer(function () {
        var jasmineMatcher = jasmine.arrayContaining([
          jasmine.objectContaining({
            queryText: 'the query',
            advancedQuery: 'the advanced query',
            didYouMean: true,
            numberOfResults: 3,
            resultsPerPage: 10,
            pageNumber: 2,
            username: 'foo',
            userDisplayName: 'foo display',
            splitTestRunName: 'foo run name',
            splitTestRunVersion: 'foo run version',
            customData: jasmine.objectContaining({
              context_key1: 'value1',
              context_key2: 'value2'
            })
          })
        ]);
        expect(endpoint.sendSearchEvents).toHaveBeenCalledWith(jasmineMatcher);
        done();
      });
    });

    it('should give precedence to query from the query state model instead of the one sent to the search api', done => {
      client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
      var query: IQuery = {
        q: 'the query',
        aq: 'the advanced query',
        firstResult: 20,
        numberOfResults: 10,
        enableDidYouMean: true
      };

      env.queryStateModel.get = () => {
        return 'another query';
      };

      Simulate.query(env, {
        query: query,
        promise: promise
      });

      _.defer(function () {
        var jasmineMatcher = jasmine.arrayContaining([
          jasmine.objectContaining({
            queryText: 'another query',
            advancedQuery: 'the advanced query',
            didYouMean: true,
            numberOfResults: 3,
            resultsPerPage: 10,
            pageNumber: 2,
            username: 'foo',
            userDisplayName: 'foo display',
            splitTestRunName: 'foo run name',
            splitTestRunVersion: 'foo run version'
          })
        ]);
        expect(endpoint.sendSearchEvents).toHaveBeenCalledWith(jasmineMatcher);
        done();
      });
    });

    describe('with multiple (3) search events', function () {
      var root: HTMLElement;
      var env2: Mock.IMockEnvironment;
      var env3: Mock.IMockEnvironment;

      beforeEach(function () {
        root = document.createElement('div');
        env2 = new Mock.MockEnvironmentBuilder().build();
        env3 = new Mock.MockEnvironmentBuilder().build();
        root.appendChild(env.root);
        root.appendChild(env2.root);
        root.appendChild(env3.root);
        client = new LiveAnalyticsClient(endpoint, root, 'foo', 'foo display', false, 'foo run name', 'foo run version', 'default', true, {
          searchInterface: env.searchInterface
        });
      });

      afterEach(function () {
        env = null;
        env2 = null;
        env3 = null;
        client = null;
        root = null;
      });

      it('should support when 3 analytics search events are triggered together, 3 events are pushed to the endpoint at the same time', done => {
        client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
        Simulate.query(env, {
          promise: promise,
          query: {
            q: 'the query 1'
          },
          deferSuccess: true
        });
        Simulate.query(env2, {
          promise: promise,
          query: {
            q: 'the query 2'
          },
          deferSuccess: true
        });
        Simulate.query(env3, {
          promise: promise,
          query: {
            q: 'the query 3'
          },
          deferSuccess: true
        });

        _.defer(function () {
          var jasmineMatcher = jasmine.arrayContaining([
            jasmine.objectContaining({
              queryText: 'the query 1'
            }),
            jasmine.objectContaining({
              queryText: 'the query 2'
            }),
            jasmine.objectContaining({
              queryText: 'the query 3'
            })
          ]);
          expect(endpoint.sendSearchEvents).toHaveBeenCalledWith(jasmineMatcher);
          done();
        });
      });

      it('should send only the new batch when search events are triggered together multiple times', function (done) {
        client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
        Simulate.query(env, {
          promise: promise,
          query: {
            q: 'the query 1'
          },
          deferSuccess: true
        });
        Simulate.query(env2, {
          promise: promise,
          query: {
            q: 'the query 2'
          },
          deferSuccess: true
        });
        Simulate.query(env3, {
          promise: promise,
          query: {
            q: 'the query 3'
          },
          deferSuccess: true
        });

        _.defer(function () {
          var jasmineMatcher = jasmine.arrayContaining([
            jasmine.objectContaining({
              queryText: 'the query 1'
            }),
            jasmine.objectContaining({
              queryText: 'the query 2'
            }),
            jasmine.objectContaining({
              queryText: 'the query 3'
            })
          ]);
          expect(endpoint.sendSearchEvents).toHaveBeenCalledWith(jasmineMatcher);
        });

        Simulate.query(env, {
          promise: promise,
          query: {
            q: 'the query 3'
          },
          deferSuccess: true
        });
        Simulate.query(env2, {
          promise: promise,
          query: {
            q: 'the query 4'
          },
          deferSuccess: true
        });
        Simulate.query(env3, {
          promise: promise,
          query: {
            q: 'the query 5'
          },
          deferSuccess: true
        });

        _.defer(function () {
          var jasmineMatcher = jasmine.arrayContaining([
            jasmine.objectContaining({
              queryText: 'the query 3'
            }),
            jasmine.objectContaining({
              queryText: 'the query 4'
            }),
            jasmine.objectContaining({
              queryText: 'the query 5'
            })
          ]);
          expect(endpoint.sendSearchEvents).toHaveBeenCalledWith(jasmineMatcher);
          done();
        });
      });

      it('should not break if a search event is followed by 0 during query', function (done) {
        client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
        Defer.flush();
        client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
        Simulate.query(env, {
          promise: promise,
          query: {
            q: 'the query 1'
          },
          deferSuccess: true
        });
        Simulate.query(env2, {
          promise: promise,
          query: {
            q: 'the query 2'
          },
          deferSuccess: true
        });
        Simulate.query(env3, {
          promise: promise,
          query: {
            q: 'the query 3'
          },
          deferSuccess: true
        });
        _.defer(function () {
          var jasmineMatcher = jasmine.arrayContaining([
            jasmine.objectContaining({
              queryText: 'the query 1'
            }),
            jasmine.objectContaining({
              queryText: 'the query 2'
            }),
            jasmine.objectContaining({
              queryText: 'the query 3'
            })
          ]);
          expect(endpoint.sendSearchEvents).toHaveBeenCalledWith(jasmineMatcher);
          done();
        });
      });

      it('should only send success events to the endpoint', function (done) {
        client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
        var promise2 = new Promise((resolve, reject) => {
          reject();
        });

        promise2.catch(() => {});

        Simulate.query(env, {
          promise: promise,
          query: {
            q: 'the query 1'
          },
          deferSuccess: true
        });
        Simulate.query(env2, <ISimulateQueryData>{
          promise: promise2,
          query: {
            q: 'the query 2'
          },
          deferSuccess: true
        });
        Simulate.query(env3, {
          promise: promise,
          query: {
            q: 'the query 3'
          },
          deferSuccess: true
        });
        _.defer(function () {
          var jasmineMatcher = jasmine.arrayContaining([
            jasmine.objectContaining({
              queryText: 'the query 1'
            }),
            jasmine.objectContaining({
              queryText: 'the query 3'
            })
          ]);

          var jasmineMatcherNot = jasmine.arrayContaining([
            jasmine.objectContaining({
              queryText: 'the query 2'
            })
          ]);
          expect(endpoint.sendSearchEvents).toHaveBeenCalledWith(jasmineMatcher);
          expect(endpoint.sendSearchEvents).not.toHaveBeenCalledWith(jasmineMatcherNot);
          done();
        });
      });

      it('should include searchQueryUid', function (done) {
        client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
        Simulate.query(env, { promise });
        _.defer(function () {
          expect(endpoint.sendSearchEvents).toHaveBeenCalledWith(
            jasmine.arrayContaining([
              jasmine.objectContaining({
                searchQueryUid: results.searchUid
              })
            ])
          );

          done();
        });
      });
    });

    it('should trigger an analytics event on document view', function () {
      var spy = jasmine.createSpy('spy');
      $$(env.root).on(AnalyticsEvents.documentViewEvent, spy);
      client.logClickEvent<IAnalyticsNoMeta>(
        analyticsActionCauseList.documentOpen,
        {},
        FakeResults.createFakeResult('foo'),
        document.createElement('div')
      );
      Defer.flush();
      expect(spy).toHaveBeenCalled();
    });

    it('should trigger an analytics ready event on document view', function () {
      var spy = jasmine.createSpy('spy');
      $$(env.root).on(AnalyticsEvents.analyticsEventReady, spy);
      client.logClickEvent<IAnalyticsNoMeta>(
        analyticsActionCauseList.documentOpen,
        {},
        FakeResults.createFakeResult('foo'),
        document.createElement('div')
      );
      Defer.flush();
      expect(spy).toHaveBeenCalled();
    });

    it('should trigger an analytics event on search event', function (done) {
      var spy = jasmine.createSpy('spy');
      $$(env.root).on(AnalyticsEvents.searchEvent, spy);
      client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
      Simulate.query(env, {
        query: {
          q: 'the query 1'
        },
        promise: new Promise((resolve, reject) => {
          resolve(FakeResults.createFakeResults(3));
        })
      });
      _.defer(function () {
        expect(spy).toHaveBeenCalled();
        done();
      });
    });

    it('should trigger an analytics ready event on search event', function (done) {
      var spy = jasmine.createSpy('spy');
      $$(env.root).on(AnalyticsEvents.analyticsEventReady, spy);
      client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
      Simulate.query(env, {
        query: {
          q: 'the query 1'
        },
        promise: new Promise((resolve, reject) => {
          resolve(FakeResults.createFakeResults(3));
        })
      });
      _.defer(function () {
        expect(spy).toHaveBeenCalled();
        done();
      });
    });

    describe('with custom event', () => {
      let customEventSpy: jasmine.Spy;
      let analyticsEventReadySpy: jasmine.Spy;

      beforeEach(() => {
        customEventSpy = jasmine.createSpy('customEventSpy');
        analyticsEventReadySpy = jasmine.createSpy('analyticsEventReadySpy');
        $$(env.root).on(AnalyticsEvents.customEvent, customEventSpy);
        $$(env.root).on(AnalyticsEvents.analyticsEventReady, analyticsEventReadySpy);
      });

      it('should trigger an analytics event on custom event', function () {
        client.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.documentOpen, {}, document.createElement('div'));
        Defer.flush();
        expect(customEventSpy).toHaveBeenCalled();
      });

      it('should trigger an analytics ready event on custom event', function () {
        client.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.documentOpen, {}, document.createElement('div'));
        Defer.flush();
        expect(analyticsEventReadySpy).toHaveBeenCalled();
      });

      it('should include searchQueryUid', function (done) {
        Simulate.query(env, { promise });
        env.queryController.getLastResults = () => results;
        _.defer(function () {
          client.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.documentOpen, {}, document.createElement('div'));
          expect(endpoint.sendCustomEvent).toHaveBeenCalledWith(
            jasmine.objectContaining({
              searchQueryUid: results.searchUid
            })
          );
          done();
        });
      });
    });

    it('should trigger change analytics metadata event', function () {
      var spy = jasmine.createSpy('spy');
      $$(env.root).on(AnalyticsEvents.changeAnalyticsCustomData, spy);
      client.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.documentOpen, {}, document.createElement('div'));
      Defer.flush();
      expect(spy).toHaveBeenCalledWith(
        jasmine.any(Object),
        jasmine.objectContaining({
          originLevel1: 'default',
          originLevel2: 'default',
          originLevel3: jasmine.any(String),
          language: String['locale'],
          type: 'CustomEvent',
          metaObject: jasmine.any(Object)
        })
      );
    });

    it(`when calling #logCustomEvent without the result argument,
    it does not add contentIDKey and contentIDValue to the metadata object`, () => {
      const spy = jasmine.createSpy('spy');
      $$(env.root).on(AnalyticsEvents.changeAnalyticsCustomData, spy);

      client.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.documentOpen, {}, document.createElement('div'));
      const metaData = spy.calls.mostRecent().args[1].metaObject;
      const metaDataKeys = Object.keys(metaData);

      expect(metaDataKeys).not.toContain('contentIDKey');
      expect(metaDataKeys).not.toContain('contentIDValue');
    });

    it(`when specifying a result having a #permanentid as an argument for #logCustomEvent,
    it adds contentIDKey and contentIDValue properties to the metadata object`, () => {
      const spy = jasmine.createSpy('spy');
      $$(env.root).on(AnalyticsEvents.changeAnalyticsCustomData, spy);

      const id = {
        key: 'permanentid',
        value: '123'
      };
      const result = FakeResults.createFakeResult();
      result[id.key] = id.value;
      client.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.documentOpen, {}, document.createElement('div'), result);
      const metaData = spy.calls.mostRecent().args[1].metaObject;

      expect(metaData.contentIDKey).toBe(id.key);
      expect(metaData.contentIDValue).toBe(id.value);
    });

    it(`when specifying contentIDKey and contentIDValue for #logCustomEvent, it should keep them in the metadata object`, () => {
      const spy = jasmine.createSpy('spy');
      $$(env.root).on(AnalyticsEvents.changeAnalyticsCustomData, spy);

      const customData = {
        contentIDKey: 'groupid',
        contentIDValue: 'my-id-abc-123'
      };
      const result = FakeResults.createFakeResult();
      client.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.documentOpen, customData, document.createElement('div'), result);
      const metaData = spy.calls.mostRecent().args[1].metaObject;

      expect(metaData.contentIDKey).toBe('groupid');
      expect(metaData.contentIDValue).toBe('my-id-abc-123');
    });

    it(`when specifying contentIDKey only for #logCustomEvent, it should update with urihash in the metadata object`, () => {
      const spy = jasmine.createSpy('spy');
      $$(env.root).on(AnalyticsEvents.changeAnalyticsCustomData, spy);

      const customData = {
        contentIDKey: 'groupid'
      };
      const result = FakeResults.createFakeResult();
      client.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.documentOpen, customData, document.createElement('div'), result);
      const metaData = spy.calls.mostRecent().args[1].metaObject;

      expect(metaData.contentIDKey).toBe('urihash');
      expect(metaData.contentIDValue).toBe(result.raw.urihash);
    });

    it(`when specifying contentIDValue only for #logCustomEvent, it should update with urihash in the metadata object`, () => {
      const spy = jasmine.createSpy('spy');
      $$(env.root).on(AnalyticsEvents.changeAnalyticsCustomData, spy);

      const customData = {
        contentIDValue: 'my-id-abc-123'
      };
      const result = FakeResults.createFakeResult();
      client.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.documentOpen, customData, document.createElement('div'), result);
      const metaData = spy.calls.mostRecent().args[1].metaObject;

      expect(metaData.contentIDKey).toBe('urihash');
      expect(metaData.contentIDValue).toBe(result.raw.urihash);
    });

    describe('with click event', () => {
      let spy: jasmine.Spy;
      let fakeResult: IQueryResult;

      beforeEach(() => {
        spy = jasmine.createSpy('spy');
        $$(env.root).on(AnalyticsEvents.changeAnalyticsCustomData, spy);
        fakeResult = FakeResults.createFakeResult();
      });

      afterEach(() => {
        spy = null;
        fakeResult = null;
      });

      it('should send the result data on click event', () => {
        client.logClickEvent<IAnalyticsNoMeta>(analyticsActionCauseList.documentQuickview, {}, fakeResult, document.createElement('div'));
        Defer.flush();
        expect(spy).toHaveBeenCalledWith(
          jasmine.any(Object),
          jasmine.objectContaining({
            originLevel1: 'default',
            originLevel2: 'default',
            originLevel3: jasmine.any(String),
            language: String['locale'],
            type: 'ClickEvent',
            metaObject: jasmine.any(Object),
            resultData: fakeResult
          })
        );
      });

      it('should send the urihash in metadata on click event', () => {
        fakeResult.raw['urihash'] = '1234567890';
        client.logClickEvent<IAnalyticsNoMeta>(analyticsActionCauseList.documentQuickview, {}, fakeResult, document.createElement('div'));
        Defer.flush();
        expect(spy).toHaveBeenCalledWith(
          jasmine.any(Object),
          jasmine.objectContaining({
            metaObject: jasmine.objectContaining({ contentIDKey: 'urihash', contentIDValue: '1234567890' })
          })
        );
      });

      it('should send the permanentid in metadata on click event, with a precedence over the uri hash', () => {
        fakeResult.raw['urihash'] = '1234567890';
        fakeResult.raw['permanentid'] = '0987654321';
        client.logClickEvent<IAnalyticsNoMeta>(analyticsActionCauseList.documentQuickview, {}, fakeResult, document.createElement('div'));
        Defer.flush();
        expect(spy).toHaveBeenCalledWith(
          jasmine.any(Object),
          jasmine.objectContaining({
            metaObject: jasmine.objectContaining({ contentIDKey: 'permanentid', contentIDValue: '0987654321' })
          })
        );
      });

      it('should include searchQueryUid', function (done) {
        client.logClickEvent<IAnalyticsNoMeta>(analyticsActionCauseList.documentQuickview, {}, fakeResult, document.createElement('div'));
        _.defer(function () {
          expect(endpoint.sendDocumentViewEvent).toHaveBeenCalledWith(
            jasmine.objectContaining({
              searchQueryUid: fakeResult.queryUid
            })
          );
          done();
        });
      });
    });

    describe('search as you type', function () {
      beforeEach(function () {
        jasmine.clock().install();
      });
      afterEach(function () {
        jasmine.clock().uninstall();
      });

      it('should log after 5 seconds have passed since the last duringQueryEvent', function () {
        client.logSearchAsYouType<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
        Simulate.query(env, {
          query: {
            q: 'the query 1'
          },
          promise: promise
        });
        jasmine.clock().tick(5);
        expect(client['pendingSearchAsYouTypeSearchEvent']['searchPromises'].length).toBe(0);
        jasmine.clock().tick(5000);
        expect(client['pendingSearchAsYouTypeSearchEvent']['searchPromises'].length).toBe(1);
      });

      it("should not log after 5 seconds have passed since the last duringQueryEvent if another event is pushed and it's a search box", function () {
        client.logSearchAsYouType<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
        Simulate.query(env, {
          query: {
            q: 'the query 1'
          },
          promise: promise
        });
        jasmine.clock().tick(5);
        expect(client['pendingSearchAsYouTypeSearchEvent']).toBeDefined();
        client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
        Simulate.query(env, {
          query: {
            q: 'the query 1'
          },
          promise: promise
        });
        expect(client['pendingSearchAsYouTypeSearchEvent']).toBeUndefined();
      });

      it("should log after 5 seconds have passed since the last duringQueryEvent if another event is pushed and it's not a search box", function () {
        client.logSearchAsYouType<IAnalyticsNoMeta>(analyticsActionCauseList.searchboxSubmit, {});
        Simulate.query(env, {
          query: {
            q: 'the query 1'
          },
          promise: promise
        });
        jasmine.clock().tick(5);
        expect(client['pendingSearchAsYouTypeSearchEvent']).toBeDefined();
        client.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.facetClearAll, {});
        Simulate.query(env, {
          query: {
            q: 'the query 1'
          },
          promise: promise
        });
        expect(client['pendingSearchAsYouTypeSearchEvent']).toBeDefined();
      });
    });
  });
}
