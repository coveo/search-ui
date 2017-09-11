import { AnalyticsEndpoint } from '../../src/rest/AnalyticsEndpoint';
import { IErrorResponse } from '../../src/rest/EndpointCaller';
import { FakeResults } from '../Fake';
import { IAPIAnalyticsSearchEventsResponse } from '../../src/rest/APIAnalyticsSearchEventsResponse';
import { IAPIAnalyticsEventResponse } from '../../src/rest/APIAnalyticsEventResponse';
export function AnalyticsEndpointTest() {
  function buildUrl(endpoint: AnalyticsEndpoint, path: string) {
    return endpoint.options.serviceUrl + '/rest/' + AnalyticsEndpoint.DEFAULT_ANALYTICS_VERSION + path;
  }

  describe('AnalyticsEndpoint', () => {
    let endpoint: AnalyticsEndpoint;

    beforeEach(() => {
      endpoint = new AnalyticsEndpoint({
        serviceUrl: 'foo.com',
        token: 'token',
        organization: 'organization'
      });
      jasmine.Ajax.install();
    });

    afterEach(() => {
      endpoint = null;
      AnalyticsEndpoint.pendingRequest = null;
      jasmine.Ajax.uninstall();
    });

    it('allow to get the current visit id', done => {
      endpoint
        .getCurrentVisitIdPromise()
        .then((res: string) => {
          expect(res).toBe('visitid');
          // Here, the current visit id is already set, so it should return immediately.
          expect(endpoint.getCurrentVisitId()).toBe('visitid');
        })
        .catch((e: IErrorResponse) => {
          fail(e);
          return e;
        })
        .then(() => done());
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(buildUrl(endpoint, '/analytics/visit?org=organization&access_token=token'));
      expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: '200',
        response: { id: 'visitid' }
      });
    });

    it('allow to sendSearchEvents', done => {
      let fakeSearchEvent = FakeResults.createFakeSearchEvent();
      endpoint
        .sendSearchEvents([fakeSearchEvent])
        .then((res: IAPIAnalyticsSearchEventsResponse) => {
          expect(res.searchEventResponses[0].visitId).toBe('visitid');
          // Here, the current visit id is already set, so it should return immediately.
          expect(endpoint.getCurrentVisitId()).toBe('visitid');
        })
        .catch((e: IErrorResponse) => {
          fail(e);
          return e;
        })
        .then(() => done());

      // Here, the current visit id should be undefined
      expect(endpoint.getCurrentVisitId()).toBeUndefined();
      expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
      expect(jasmine.Ajax.requests.mostRecent().requestHeaders['Authorization']).toBe('Bearer token');
      expect(jasmine.Ajax.requests.mostRecent().requestHeaders['Content-Type']).toBe('application/json; charset="UTF-8"');
      expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params)[0]['actionCause']).toBe(fakeSearchEvent.actionCause);
      expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params)[0]['queryPipeline']).toBe(fakeSearchEvent.queryPipeline);
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        responseText: JSON.stringify({ searchEventResponses: [{ visitId: 'visitid' }] })
      });
    });

    it('allow to sendDocumentViewEvent', done => {
      let fakeClickEvent = FakeResults.createFakeClickEvent();
      endpoint
        .sendDocumentViewEvent(fakeClickEvent)
        .then((res: IAPIAnalyticsEventResponse) => {
          expect(res.visitId).toBe('visitid');
          // Here, the current visit id is already set, so it should return immediately.
          expect(endpoint.getCurrentVisitId()).toBe('visitid');
        })
        .catch((e: IErrorResponse) => {
          fail(e);
          return e;
        })
        .then(() => done());

      // Here, the current visit id should be undefined
      expect(endpoint.getCurrentVisitId()).toBeUndefined();
      expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
      expect(jasmine.Ajax.requests.mostRecent().requestHeaders['Authorization']).toBe('Bearer token');
      expect(jasmine.Ajax.requests.mostRecent().requestHeaders['Content-Type']).toBe('application/json; charset="UTF-8"');
      expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params)['viewMethod']).toBe(fakeClickEvent.viewMethod);
      expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params)['documentUrl']).toBe(fakeClickEvent.documentUrl);

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        responseText: JSON.stringify({ visitId: 'visitid' })
      });
    });

    it('sends organization as parameter when sending a document view event', () => {
      let fakeClickEvent = FakeResults.createFakeClickEvent();
      endpoint.sendDocumentViewEvent(fakeClickEvent);

      expect(jasmine.Ajax.requests.mostRecent().url.indexOf('org=organization') != -1).toBe(true);
    });

    it('sends organization as parameter when sending a search event', () => {
      let fakeSearchEvent = FakeResults.createFakeSearchEvent();
      endpoint.sendSearchEvents([fakeSearchEvent]);

      expect(jasmine.Ajax.requests.mostRecent().url.indexOf('org=organization') != -1).toBe(true);
    });

    it('allow to getTopQueries', done => {
      endpoint
        .getTopQueries({ pageSize: 10, queryText: 'foobar' })
        .then((res: string[]) => {
          expect(res.length).toBe(3);
          expect(res[0]).toBe('foo');
        })
        .catch((e: IErrorResponse) => {
          fail(e);
          return e;
        })
        .then(() => done());

      expect(jasmine.Ajax.requests.mostRecent().url).toBe(
        buildUrl(endpoint, '/stats/topQueries?org=organization&access_token=token&pageSize=10&queryText=foobar')
      );
      expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        response: ['foo', 'bar', 'foobar']
      });
    });
  });
}
