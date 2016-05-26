module Coveo {
  import SearchEndpoint = Coveo.SearchEndpoint;
  describe('SearchEndpoint', function () {

    beforeEach(function () {
      Coveo.SearchEndpoint.endpoints = {};
    })

    afterEach(function () {
      Coveo.SearchEndpoint.endpoints = {};
    })

    it('allow to setup easily a search endpoint to point to a sample endpoint', function () {
      SearchEndpoint.configureSampleEndpoint();
      var ep: SearchEndpoint = Coveo.SearchEndpoint.endpoints['default']
      expect(ep).toBeDefined();
      expect(ep.options.accessToken).toBeDefined();
      expect(ep.options.restUri).toBeDefined();
    });

    it('allow to setup easily a cloud endpoint', function () {
      SearchEndpoint.configureCloudEndpoint('foo', 'bar');
      var ep: SearchEndpoint = Coveo.SearchEndpoint.endpoints['default'];
      expect(ep).toBeDefined();
      expect(ep.options.accessToken).toBe('bar');
      expect(ep.options.queryStringArguments['organizationId']).toBe('foo');
    });

    it('allow to setup easily a on prem endpoint', function () {
      SearchEndpoint.configureOnPremiseEndpoint('foo.com')
      var ep: SearchEndpoint = Coveo.SearchEndpoint.endpoints['default'];
      expect(ep).toBeDefined();
      expect(ep.options.restUri).toBe('foo.com');
    })

    describe('with a basic setup', function () {
      var ep: SearchEndpoint;

      beforeEach(function () {
        ep = new SearchEndpoint({
          restUri: 'foo/rest/search',
          queryStringArguments: {
            workgroup: 'myOrgId',
            patate: 'pilees'
          }
        })
      })

      afterEach(function () {
        ep = null;
      })

      it('allow to get the base uri', function () {
        expect(ep.getBaseUri()).toBe('foo/rest/search/v2')
      })

      it('allow to get the auth provider uri', function () {
        expect(ep.getAuthenticationProviderUri('ad')).toBe(ep.getBaseUri() + '/login/ad?');
        expect(ep.getAuthenticationProviderUri('email', 'myreturnurl')).toBe(ep.getBaseUri() + '/login/email?redirectUri=myreturnurl');
        expect(ep.getAuthenticationProviderUri('troll', undefined, 'msg')).toBe(ep.getBaseUri() + '/login/troll?message=msg');
      })

      it('allow to check if endpoint is jsonp', function () {
        expect(ep.isJsonp()).toBe(false);
      })

      it('allow to get an export to excel link', function () {
        var qbuilder = new QueryBuilder()
        qbuilder.expression.add('batman');
        expect(ep.getExportToExcelLink(qbuilder.build(), 56)).toBe(ep.getBaseUri() + '/?organizationId=myOrgId&patate=pilees&q=batman&numberOfResults=56&format=xlsx')
      })

      it('allow to get an uri to view as datastream', function () {
        var fakeResult = FakeResults.createFakeResult();
        expect(ep.getViewAsDatastreamUri(fakeResult.uniqueId, '$Thumbnail')).toBe(ep.getBaseUri() + '/datastream?organizationId=myOrgId&patate=pilees&uniqueId=' + fakeResult.uniqueId + '&dataStream=' + encodeURIComponent('$Thumbnail'));
      })

      it('allow to get an uri to view as html', function () {
        var fakeResult = FakeResults.createFakeResult();
        expect(ep.getViewAsHtmlUri(fakeResult.uniqueId)).toBe(ep.getBaseUri() + '/html?organizationId=myOrgId&patate=pilees&uniqueId=' + fakeResult.uniqueId)
      })

      describe('will execute requests on the search api', function () {
        beforeEach(function () {
          jasmine.Ajax.install();
        })

        afterEach(function () {
          jasmine.Ajax.uninstall();
        })

        it('for search', function (done) {
          var qbuilder = new QueryBuilder();
          qbuilder.expression.add('batman');
          qbuilder.numberOfResults = 153;
          qbuilder.enableCollaborativeRating = true;
          var promiseSuccess = ep.search(qbuilder.build());
          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseUri() + '/?organizationId=myOrgId&patate=pilees&errorsAsSuccess=1');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('q=batman');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('numberOfResults=153');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('enableCollaborativeRating=true');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
          promiseSuccess
              .then((data: IQueryResults)=> {
                expect(data.results.length).toBe(10);
              })
          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify(FakeResults.createFakeResults())
          })

          var promiseFail = ep.search(qbuilder.build());
          promiseFail
              .catch((e: AjaxError)=> {
                expect(e).toBeDefined();
                expect(e.status).toBe(500);
              })
              .catch((e: IErrorResponse)=> {
                fail(e);
              })
              .finally(()=> done())

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 500
          })
        })

        it('for getRawDataStream', function (done) {
          var fakeResult = FakeResults.createFakeResult();
          var promiseSuccess = ep.getRawDataStream(fakeResult.uniqueId, '$Thumbnail');
          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseUri() + '/datastream?organizationId=myOrgId&patate=pilees&uniqueId=' + fakeResult.uniqueId + '&dataStream=$Thumbnail');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');
          promiseSuccess
              .then((data: ArrayBuffer)=> {
                expect(data).toBeDefined();
                expect(data.byteLength).toBe(123);
                expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('arraybuffer');
              })
              .catch((e: IErrorResponse)=> {
                fail(e);
              })
              .finally(()=>done())

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            response: new ArrayBuffer(123),
            responseType: 'arraybuffer'
          })
        })

        it('for getDocument', function (done) {
          var fakeResult = FakeResults.createFakeResult();
          var promiseSuccess = ep.getDocument(fakeResult.uniqueId);
          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseUri() + '/document?organizationId=myOrgId&patate=pilees&uniqueId=' + fakeResult.uniqueId + '&errorsAsSuccess=1');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');
          promiseSuccess
              .then((data: IQueryResult)=> {
                expect(data.uniqueId).toBe(fakeResult.uniqueId);
                expect(data.title).toBe(fakeResult.title);
                expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('text');
              })
              .catch((e: IErrorResponse)=> {
                fail(e);
              })
              .finally(()=>done())

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify(fakeResult),
            responseType: 'text'
          })
        })

        it('for getDocumentText', function (done) {
          var fakeResult = FakeResults.createFakeResult();
          var promiseSuccess = ep.getDocumentText(fakeResult.uniqueId);
          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseUri() + '/text?organizationId=myOrgId&patate=pilees&uniqueId=' + fakeResult.uniqueId + '&errorsAsSuccess=1');

          expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');
          promiseSuccess
              .then((data: string)=> {
                expect(data).toBe(fakeResult.excerpt);
                expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('text');
              })
              .catch((e: IErrorResponse)=> {
                fail(e);
              })
              .finally(()=>done())

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({content: fakeResult.excerpt}),
            responseType: 'text'
          })
        })

        it('for getDocumentHtml', function (done) {
          var fakeResult = FakeResults.createFakeResult();
          var fakeDocument = document.implementation.createHTMLDocument(fakeResult.title);
          var promiseSuccess = ep.getDocumentHtml(fakeResult.uniqueId);
          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseUri() + '/html?organizationId=myOrgId&patate=pilees&uniqueId=' + fakeResult.uniqueId);

          expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
          promiseSuccess
              .then((data: HTMLDocument)=> {
                expect(data.title).toBe(fakeResult.title);
                expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('document');
              })
              .catch((e: IErrorResponse)=> {
                fail(e)
              })
              .finally(()=>done())

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            response: fakeDocument,
            responseType: 'document'
          })
        })

        it('for listFieldValues', function (done) {
          var request: IListFieldValuesRequest = {
            field: '@field',
            maximumNumberOfValues: 153,
            pattern: '.*$',
            patternType: 'regex'
          }
          var promisesSuccess = ep.listFieldValues(request);
          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseUri() + '/values?organizationId=myOrgId&patate=pilees&errorsAsSuccess=1');

          expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('field=' + encodeURIComponent('@field'));
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('maximumNumberOfValues=153');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('pattern=' + encodeURIComponent('.*$'));
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('patternType=regex');
          promisesSuccess
              .then((values: IIndexFieldValue[])=> {
                expect(values.length).toBe(10);
                expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('text');
              })
              .catch((e: IErrorResponse)=> {
                fail(e)
              })
              .finally(()=> done());

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({values: FakeResults.createFakeFieldValues('foo', 10)}),
            responseType: 'text'
          })
        })

        it('for listFields', function (done) {
          var promiseSuccess = ep.listFields();
          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseUri() + '/fields?organizationId=myOrgId&patate=pilees&errorsAsSuccess=1');

          expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

          promiseSuccess
              .then((fields: IFieldDescription[])=> {
                expect(fields.length).toBe(10)
                expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('text');
              })
              .catch((e: IErrorResponse)=> {
                fail(e);
              })
              .finally(()=> done());

          // Not real field description, but will suffice for test purpose
          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({fields: _.range(10)}),
            responseType: 'text'
          })
        })

        it('for extensions', function (done) {
          var promiseSuccess = ep.extensions();
          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseUri() + '/extensions?organizationId=myOrgId&patate=pilees&errorsAsSuccess=1');

          expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

          promiseSuccess
              .then((extensions: IExtension[])=> {
                expect(extensions.length).toBe(10);
                expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('text');
              })
              .catch((e: IErrorResponse)=> {
                fail(e);
              })
              .finally(()=> done());

          // Not real extensions, but will suffice for test purpose
          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify(_.range(10)),
            responseType: 'text'
          })
        })

        it('for rateDocument', function (done) {
          var fakeResult = FakeResults.createFakeResult();
          var promiseSuccess = ep.rateDocument({
            rating: 'Best',
            uniqueId: fakeResult.uniqueId
          });
          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseUri() + '/rating?organizationId=myOrgId&patate=pilees');

          expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');

          promiseSuccess
              .then((response: boolean)=> {
                expect(response).toBe(true);
                expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('text');
              })
              .catch((e: IErrorResponse)=> {
                fail(e);
              })
              .finally(()=> done());
          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseType: 'text'
          })
        })

        it('for tagDocument', function (done) {
          var fakeResult = FakeResults.createFakeResult();
          var promiseSuccess = ep.tagDocument({
            uniqueId: fakeResult.uniqueId,
            doAdd: true,
            fieldName: '@field',
            fieldValue: 'foobar',

          });
          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseUri() + '/tag?organizationId=myOrgId&patate=pilees');

          expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('fieldName=' + encodeURIComponent('@field'));
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('fieldValue=foobar');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('doAdd=true');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('uniqueId=' + encodeURIComponent(fakeResult.uniqueId));

          promiseSuccess
              .then((response: boolean)=> {
                expect(response).toBe(true)
                expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('text');
              })
              .catch((e: IErrorResponse)=> {
                fail(e);
              })
              .finally(()=> done());

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseType: 'text'
          })
        })

        it('for getRevealQuerySuggest', function (done) {
          var promiseSuccess = ep.getRevealQuerySuggest({
            q: 'foobar',
            count: 10
          });

          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseUri() + '/querySuggest?organizationId=myOrgId&patate=pilees&errorsAsSuccess=1&q=foobar&count=10');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

          // Not real extensions, but will suffice for test purpose
          promiseSuccess
              .then((response: IRevealQuerySuggestResponse)=> {
                expect(response.completions.length).toBe(10);
              })
              .catch((e: IErrorResponse)=> {
                fail(e);
              })
              .finally(()=> done());

          // Not real completions, but will suffice for test purpose
          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({completions: _.range(10)})
          })
        })

        it('for follow', function (done) {
          var qbuilder = new QueryBuilder();
          qbuilder.expression.add('batman');
          var promiseSuccess = ep.follow({
            frequency: 'weekly',
            type: 'query',
            typeConfig: {
              query: qbuilder.build()
            }
          })

          promiseSuccess
              .then((sub: ISubscription)=> {
                expect(sub.id).toBeDefined();
              })
              .catch((e: IErrorResponse)=> {
                fail(e)
              })
              .finally(()=>done())

          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseAlertsUri() + '/subscriptions?organizationId=myOrgId&patate=pilees&errorsAsSuccess=1');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
          expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).frequency).toBe('weekly');

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({
              id: 'foobar',
              type: 'query',
              typeConfig: {
                query: qbuilder.build()
              }
            })
          })
        })

        it('for listSubscriptions', function (done) {
          var promiseSuccess = ep.listSubscriptions(15);
          promiseSuccess
              .then((subs: ISubscription[])=> {
                expect(subs.length).toBe(44)
              })
              .catch((e: IErrorResponse)=> {
                fail(e)
              })
              .finally(()=> done());

          // Should return the same promise, since it's not resolved yet
          var promiseSuccess2 = ep.listSubscriptions(15);
          expect(promiseSuccess).toBe(promiseSuccess2);

          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseAlertsUri() + '/subscriptions?organizationId=myOrgId&patate=pilees&page=15&errorsAsSuccess=1');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify(_.range(44))
          })
        })

        it('for updateSubscription', function (done) {
          var qbuilder = new QueryBuilder();
          qbuilder.expression.add('batman');
          var promiseSuccess = ep.updateSubscription({
            id: 'foobar',
            type: 'query',
            typeConfig: {
              query: qbuilder.build()
            }
          })
          promiseSuccess
              .then((sub: ISubscription)=> {
                expect(sub.id).toBe('foobar');
              })
              .catch((e: IErrorResponse)=> {
                fail(e);
              })
              .finally(()=> done());

          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseAlertsUri() + '/subscriptions/foobar?organizationId=myOrgId&patate=pilees&errorsAsSuccess=1');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('PUT');
          expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).type).toBe('query');

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({id: 'foobar'})
          })
        })

        it('for deleteSubscription', function (done) {
          var qbuilder = new QueryBuilder();
          qbuilder.expression.add('batman');
          var promiseSuccess = ep.deleteSubscription({
            id: 'foobar',
            type: 'query',
            typeConfig: {
              query: qbuilder.build()
            }
          })

          promiseSuccess
              .then((sub: ISubscription)=> {
                expect(sub.id).toBe('foobar');
              })
              .catch((e: IErrorResponse)=> {
                fail(e)
              })
              .finally(()=>done())

          expect(jasmine.Ajax.requests.mostRecent().url).toBe(ep.getBaseAlertsUri() + '/subscriptions/foobar?organizationId=myOrgId&patate=pilees&errorsAsSuccess=1');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('DELETE');
          expect(jasmine.Ajax.requests.mostRecent().params).toBe('{}');

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({id: 'foobar'})
          })
        })
      })
    })
  })
}