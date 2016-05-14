/// <reference path="../Test.ts" />

module Coveo {
  function buildUrl(endpoint: AnalyticsEndpoint, path: string) {
    return endpoint.options.serviceUrl + '/rest/' + AnalyticsEndpoint.DEFAULT_ANALYTICS_VERSION + path;
  }

  describe('AnalyticsEndpoint', function () {
    var endpoint: AnalyticsEndpoint;

    beforeEach(function () {
      endpoint = new AnalyticsEndpoint({
        serviceUrl: 'foo.com',
        token: 'token'
      })
      jasmine.Ajax.install();
    })

    afterEach(function () {
      endpoint = null;
      jasmine.Ajax.uninstall();
    })

    it('allow to get the current visit id', function (done) {
      endpoint.getCurrentVisitIdPromise()
          .then((res: string)=> {
            expect(res).toBe('visitid');
            // Here, the current visit id is already set, so it should return immediately.
            expect(endpoint.getCurrentVisitId()).toBe('visitid');
          })
          .catch((e: IErrorResponse)=> {
            fail(e)
          })
          .finally(()=> done());
      expect(jasmine.Ajax.requests.mostRecent().url).toBe(buildUrl(endpoint, '/analytics/visit?access_token=token'));
      expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: '200',
        response: {id: 'visitid'}
      })
    })

    it('allow to sendSearchEvents', function (done) {
      var fakeSearchEvent = FakeResults.createFakeSearchEvent();
      endpoint.sendSearchEvents([fakeSearchEvent])
          .then((res: IAPIAnalyticsSearchEventsResponse)=> {
            expect(res.searchEventResponses[0].visitId).toBe('visitid');
            // Here, the current visit id is already set, so it should return immediately.
            expect(endpoint.getCurrentVisitId()).toBe('visitid');
          })
          .catch((e: IErrorResponse)=> {
            fail(e)
          })
          .finally(()=> done());

      // Here, the current visit id should be undefined
      expect(endpoint.getCurrentVisitId()).toBeUndefined();
      expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
      expect(jasmine.Ajax.requests.mostRecent().requestHeaders['Authorization']).toBe('Bearer token');
      expect(jasmine.Ajax.requests.mostRecent().requestHeaders['Content-Type']).toBe('application/json; charset="UTF-8"');
      expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params)[0]['actionCause']).toBe(fakeSearchEvent.actionCause);
      expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params)[0]['queryPipeline']).toBe(fakeSearchEvent.queryPipeline);
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        responseText: JSON.stringify({searchEventResponses: [{visitId: 'visitid'}]})
      })
    })

    it('allow to sendDocumentViewEvent', function (done) {
      var fakeClickEvent = FakeResults.createFakeClickEvent();
      endpoint.sendDocumentViewEvent(fakeClickEvent)
          .then((res: IAPIAnalyticsEventResponse)=> {
            expect(res.visitId).toBe('visitid')
            // Here, the current visit id is already set, so it should return immediately.
            expect(endpoint.getCurrentVisitId()).toBe('visitid');
          })
          .catch((e: IErrorResponse)=> {
            fail(e)
          })
          .finally(()=> done());

      // Here, the current visit id should be undefined
      expect(endpoint.getCurrentVisitId()).toBeUndefined();
      expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
      expect(jasmine.Ajax.requests.mostRecent().requestHeaders['Authorization']).toBe('Bearer token');
      expect(jasmine.Ajax.requests.mostRecent().requestHeaders['Content-Type']).toBe('application/json; charset="UTF-8"');
      expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params)['viewMethod']).toBe(fakeClickEvent.viewMethod);
      expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params)['documentUrl']).toBe(fakeClickEvent.documentUrl);
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        responseText: JSON.stringify({visitId: 'visitid'})
      })
    })

    it('allow to getTopQueries', function (done) {
      endpoint.getTopQueries({pageSize: 10, queryText: 'foobar'})
          .then((res: string[])=> {
            expect(res.length).toBe(3);
            expect(res[0]).toBe('foo');
          })
          .catch((e: IErrorResponse)=> {
            fail(e)
          })
          .finally(()=> done())

      expect(jasmine.Ajax.requests.mostRecent().url).toBe(buildUrl(endpoint, '/stats/topQueries?access_token=token&pageSize=10&queryText=foobar'));
      expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');
      jasmine.Ajax.requests.mostRecent().respondWith({
        status: 200,
        response: ['foo', 'bar', 'foobar']
      })
    })
  })
}