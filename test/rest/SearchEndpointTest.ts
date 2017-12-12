import { SearchEndpoint } from '../../src/rest/SearchEndpoint';
import { FakeResults } from '../Fake';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { IQueryResults } from '../../src/rest/QueryResults';
import { IErrorResponse, IRequestInfo } from '../../src/rest/EndpointCaller';
import { IQueryResult } from '../../src/rest/QueryResult';
import { IListFieldValuesRequest } from '../../src/rest/ListFieldValuesRequest';
import { IIndexFieldValue } from '../../src/rest/FieldValue';
import { IExtension } from '../../src/rest/Extension';
import { IFieldDescription } from '../../src/rest/FieldDescription';
import { IQuerySuggestResponse } from '../../src/rest/QuerySuggest';
import { ISubscription } from '../../src/rest/Subscription';
import { AjaxError } from '../../src/rest/AjaxError';
import _ = require('underscore');

export function SearchEndpointTest() {
  describe('SearchEndpoint', () => {
    beforeEach(() => {
      SearchEndpoint.endpoints = {};
    });

    afterEach(() => {
      SearchEndpoint.endpoints = {};
    });

    it('allow to setup easily a search endpoint to point to a sample endpoint', () => {
      SearchEndpoint.configureSampleEndpoint();
      const ep: SearchEndpoint = SearchEndpoint.endpoints['default'];
      expect(ep).toBeDefined();
      expect(ep.options.accessToken).toBeDefined();
      expect(ep.options.restUri).toBeDefined();
    });

    it('allow to setup easily a cloud endpoint', () => {
      SearchEndpoint.configureCloudEndpoint('foo', 'bar');
      const ep: SearchEndpoint = SearchEndpoint.endpoints['default'];
      expect(ep).toBeDefined();
      expect(ep.options.accessToken).toBe('bar');
      expect(ep.options.queryStringArguments['organizationId']).toBe('foo');
    });

    it('allow to setup easily a on prem endpoint', () => {
      SearchEndpoint.configureOnPremiseEndpoint('foo.com');
      const ep: SearchEndpoint = SearchEndpoint.endpoints['default'];
      expect(ep).toBeDefined();
      expect(ep.options.restUri).toBe('foo.com');
    });

    describe('with a workgroup argument', () => {
      let ep: SearchEndpoint;

      beforeEach(() => {
        ep = new SearchEndpoint({
          restUri: 'foo/rest/search',
          queryStringArguments: {
            workgroup: 'myOrgId'
          }
        });
      });

      afterEach(() => {
        ep = null;
      });

      it('should not map it to organizationId', () => {
        const fakeResult = FakeResults.createFakeResult();
        expect(ep.getViewAsHtmlUri(fakeResult.uniqueId)).toBe(ep.getBaseUri() + '/html?workgroup=myOrgId&uniqueId=' + fakeResult.uniqueId);
      });
    });

    describe('with an orgaganizationId argument', () => {
      let ep: SearchEndpoint;

      beforeEach(() => {
        ep = new SearchEndpoint({
          restUri: 'foo/rest/search',
          queryStringArguments: {
            organizationId: 'myOrgId'
          }
        });
      });

      afterEach(() => {
        ep = null;
      });

      it('should not map it to workgroup', () => {
        const fakeResult = FakeResults.createFakeResult();
        expect(ep.getViewAsHtmlUri(fakeResult.uniqueId)).toBe(
          ep.getBaseUri() + '/html?organizationId=myOrgId&uniqueId=' + fakeResult.uniqueId
        );
      });
    });

    describe('with a search token argument', () => {
      let ep: SearchEndpoint;

      beforeEach(() => {
        ep = new SearchEndpoint({
          restUri: 'foo/rest/search',
          accessToken: 'token'
        });
      });

      afterEach(() => {
        ep = null;
      });

      it('will add it in the query string', () => {
        const fakeResult = FakeResults.createFakeResult();
        expect(ep.getViewAsHtmlUri(fakeResult.uniqueId)).toBe(ep.getBaseUri() + '/html?access_token=token&uniqueId=' + fakeResult.uniqueId);
      });
    });

    describe('with a basic setup', () => {
      let ep: SearchEndpoint;

      beforeEach(() => {
        ep = new SearchEndpoint({
          restUri: 'foo/rest/search',
          accessToken: 'token',
          queryStringArguments: {
            organizationId: 'myOrgId',
            potatoe: 'mashed'
          }
        });
      });

      afterEach(() => {
        ep = null;
      });

      it('allow to get the base uri', () => {
        expect(ep.getBaseUri()).toBe('foo/rest/search/v2');
      });

      it('allow to get the auth provider uri', () => {
        expect(ep.getAuthenticationProviderUri('ad')).toContain(ep.getBaseUri() + '/login/ad?');
        expect(ep.getAuthenticationProviderUri('ad')).toContain('organizationId=myOrgId');
        expect(ep.getAuthenticationProviderUri('ad')).toContain('potatoe=mashed');
        expect(ep.getAuthenticationProviderUri('email', 'myreturnurl')).toContain(ep.getBaseUri() + '/login/email?');
        expect(ep.getAuthenticationProviderUri('email', 'myreturnurl')).toContain('organizationId=myOrgId');
        expect(ep.getAuthenticationProviderUri('email', 'myreturnurl')).toContain('potatoe=mashed');
        expect(ep.getAuthenticationProviderUri('email', 'myreturnurl')).toContain('redirectUri=myreturnurl');
        expect(ep.getAuthenticationProviderUri('troll', undefined, 'msg')).toContain(ep.getBaseUri() + '/login/troll?');
        expect(ep.getAuthenticationProviderUri('troll', undefined, 'msg')).toContain('organizationId=myOrgId');
        expect(ep.getAuthenticationProviderUri('troll', undefined, 'msg')).toContain('potatoe=mashed');
        expect(ep.getAuthenticationProviderUri('troll', undefined, 'msg')).toContain('message=msg');
      });

      it('allow to check if endpoint is jsonp', () => {
        expect(ep.isJsonp()).toBe(false);
      });

      it('allow to get an export to excel link', () => {
        const qbuilder = new QueryBuilder();
        qbuilder.expression.add('batman');
        expect(ep.getExportToExcelLink(qbuilder.build(), 56)).toContain(ep.getBaseUri() + '/?');
        expect(ep.getExportToExcelLink(qbuilder.build(), 56)).toContain('organizationId=myOrgId');
        expect(ep.getExportToExcelLink(qbuilder.build(), 56)).toContain('potatoe=mashed');
        expect(ep.getExportToExcelLink(qbuilder.build(), 56)).toContain('q=batman');
        expect(ep.getExportToExcelLink(qbuilder.build(), 56)).toContain('numberOfResults=56');
        expect(ep.getExportToExcelLink(qbuilder.build(), 56)).toContain('format=xlsx');
      });

      it('allow to get an export to excel link with a context', () => {
        const qbuilder = new QueryBuilder();
        qbuilder.addContext({
          foo: 'bar'
        });
        expect(ep.getExportToExcelLink(qbuilder.build(), 56)).toContain('context[foo]=bar');
      });

      it('allow to get an export to excel link with context encoded', () => {
        const qbuilder = new QueryBuilder();
        qbuilder.addContext({
          'foo bar': 'buzz bazz'
        });
        expect(ep.getExportToExcelLink(qbuilder.build(), 56)).toContain(
          `context[foo${encodeURIComponent(' ')}bar]=buzz${encodeURIComponent(' ')}bazz`
        );
      });

      it('allow to get an export to excel link with a context array', () => {
        const qbuilder = new QueryBuilder();
        qbuilder.addContext({
          foo: ['buzz', 'bazz']
        });
        expect(ep.getExportToExcelLink(qbuilder.build(), 56)).toContain(`context[foo]=buzz${encodeURIComponent(',')}bazz`);
      });

      it('allow to get an export to excel link with a context with multiple values', () => {
        const qbuilder = new QueryBuilder();
        qbuilder.addContext({
          foo: 'bar',
          bazz: 'buzz'
        });
        expect(ep.getExportToExcelLink(qbuilder.build(), 56)).toContain('context[foo]=bar');
        expect(ep.getExportToExcelLink(qbuilder.build(), 56)).toContain('context[bazz]=buzz');
      });

      it('allow to get an uri to view as datastream', () => {
        const fakeResult = FakeResults.createFakeResult();
        expect(ep.getViewAsDatastreamUri(fakeResult.uniqueId, '$Thumbnail')).toContain(ep.getBaseUri() + '/datastream?');
        expect(ep.getViewAsDatastreamUri(fakeResult.uniqueId, '$Thumbnail')).toContain('organizationId=myOrgId');
        expect(ep.getViewAsDatastreamUri(fakeResult.uniqueId, '$Thumbnail')).toContain('potatoe=mashed');
        expect(ep.getViewAsDatastreamUri(fakeResult.uniqueId, '$Thumbnail')).toContain('uniqueId=' + fakeResult.uniqueId);
        expect(ep.getViewAsDatastreamUri(fakeResult.uniqueId, '$Thumbnail')).toContain('dataStream=' + encodeURIComponent('$Thumbnail'));
      });

      it('allow to get an uri to view as html', () => {
        const fakeResult = FakeResults.createFakeResult();
        expect(ep.getViewAsHtmlUri(fakeResult.uniqueId)).toContain(ep.getBaseUri() + '/html?');
        expect(ep.getViewAsHtmlUri(fakeResult.uniqueId)).toContain('organizationId=myOrgId');
        expect(ep.getViewAsHtmlUri(fakeResult.uniqueId)).toContain('potatoe=mashed');
        expect(ep.getViewAsHtmlUri(fakeResult.uniqueId)).toContain('uniqueId=' + fakeResult.uniqueId);
      });

      describe('will execute requests on the search api', () => {
        beforeEach(() => {
          jasmine.Ajax.install();
        });

        afterEach(() => {
          jasmine.Ajax.uninstall();
          ep.reset();
        });

        it('for search', done => {
          const qbuilder = new QueryBuilder();
          qbuilder.expression.add('batman');
          qbuilder.numberOfResults = 153;
          qbuilder.enableCollaborativeRating = true;
          const promiseSuccess = ep.search(qbuilder.build());
          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseUri() + '/?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('q=batman');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('numberOfResults=153');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('enableCollaborativeRating=true');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('actionsHistory=');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
          promiseSuccess.then((data: IQueryResults) => {
            expect(data.results.length).toBe(10);
          });
          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify(FakeResults.createFakeResults())
          });

          const promiseFail = ep.search(qbuilder.build());
          promiseFail
            .catch((e: AjaxError) => {
              expect(e).toBeDefined();
              expect(e.status).toBe(500);
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 500
          });
        });

        it('should not override actions history if specified manually on a search call', () => {
          const qbuilder = new QueryBuilder();
          const historyAsString = JSON.stringify([{ name: 'foo', value: 'bar' }]);
          qbuilder.actionsHistory = historyAsString;
          ep.search(qbuilder.build());
          expect(jasmine.Ajax.requests.mostRecent().params).toContain(`actionsHistory=${encodeURIComponent(historyAsString)}`);
        });

        it('for getRawDataStream', done => {
          const fakeResult = FakeResults.createFakeResult();
          const promiseSuccess = ep.getRawDataStream(fakeResult.uniqueId, '$Thumbnail');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseUri() + '/datastream?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('uniqueId=' + fakeResult.uniqueId);
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('dataStream=$Thumbnail');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');
          promiseSuccess
            .then((data: ArrayBuffer) => {
              expect(data).toBeDefined();
              expect(data.byteLength).toBe(123);
              expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('arraybuffer');
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            response: new ArrayBuffer(123),
            responseType: 'arraybuffer'
          });
        });

        it('for getDocument', done => {
          const fakeResult = FakeResults.createFakeResult();
          const promiseSuccess = ep.getDocument(fakeResult.uniqueId);
          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseUri() + '/document?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('uniqueId=' + fakeResult.uniqueId);
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');
          promiseSuccess
            .then((data: IQueryResult) => {
              expect(data.uniqueId).toBe(fakeResult.uniqueId);
              expect(data.title).toBe(fakeResult.title);
              expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('text');
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify(fakeResult),
            responseType: 'text'
          });
        });

        it('for getDocumentText', done => {
          const fakeResult = FakeResults.createFakeResult();
          const promiseSuccess = ep.getDocumentText(fakeResult.uniqueId);
          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseUri() + '/text?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('uniqueId=' + fakeResult.uniqueId);
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');

          expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');
          promiseSuccess
            .then((data: string) => {
              expect(data).toBe(fakeResult.excerpt);
              expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('text');
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({ content: fakeResult.excerpt }),
            responseType: 'text'
          });
        });

        it('for getDocumentHtml', done => {
          const fakeResult = FakeResults.createFakeResult();
          const fakeDocument = document.implementation.createHTMLDocument(fakeResult.title);
          const promiseSuccess = ep.getDocumentHtml(fakeResult.uniqueId);
          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseUri() + '/html?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('uniqueId=' + fakeResult.uniqueId);
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');

          expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
          promiseSuccess
            .then((data: HTMLDocument) => {
              expect(data.title).toBe(fakeResult.title);
              expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('document');
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            response: fakeDocument,
            responseType: 'document'
          });
        });

        it('for listFieldValues', done => {
          const request: IListFieldValuesRequest = {
            field: '@field',
            maximumNumberOfValues: 153,
            pattern: '.*$',
            patternType: 'regex'
          };
          const promisesSuccess = ep.listFieldValues(request);
          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseUri() + '/values?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');

          expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('field=' + encodeURIComponent('@field'));
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('maximumNumberOfValues=153');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('pattern=' + encodeURIComponent('.*$'));
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('patternType=regex');
          promisesSuccess
            .then((values: IIndexFieldValue[]) => {
              expect(values.length).toBe(10);
              expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('text');
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({ values: FakeResults.createFakeFieldValues('foo', 10) }),
            responseType: 'text'
          });
        });

        it('for listFields', done => {
          const promiseSuccess = ep.listFields();
          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseUri() + '/fields?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');

          expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

          promiseSuccess
            .then((fields: IFieldDescription[]) => {
              expect(fields.length).toBe(10);
              expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('text');
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          // Not real field description, but will suffice for test purpose
          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({ fields: _.range(10) }),
            responseType: 'text'
          });
        });

        it('for extensions', done => {
          const promiseSuccess = ep.extensions();
          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseUri() + '/extensions?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');

          expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

          promiseSuccess
            .then((extensions: IExtension[]) => {
              expect(extensions.length).toBe(10);
              expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('text');
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          // Not real extensions, but will suffice for test purpose
          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify(_.range(10)),
            responseType: 'text'
          });
        });

        it('for rateDocument', done => {
          const fakeResult = FakeResults.createFakeResult();
          const promiseSuccess = ep.rateDocument({
            rating: 'Best',
            uniqueId: fakeResult.uniqueId
          });
          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseUri() + '/rating?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');

          expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');

          promiseSuccess
            .then((response: boolean) => {
              expect(response).toBe(true);
              expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('text');
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());
          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseType: 'text'
          });
        });

        it('for tagDocument', done => {
          const fakeResult = FakeResults.createFakeResult();
          const promiseSuccess = ep.tagDocument({
            uniqueId: fakeResult.uniqueId,
            doAdd: true,
            fieldName: '@field',
            fieldValue: 'foobar'
          });
          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseUri() + '/tag?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');

          expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('fieldName=' + encodeURIComponent('@field'));
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('fieldValue=foobar');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('doAdd=true');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('uniqueId=' + encodeURIComponent(fakeResult.uniqueId));

          promiseSuccess
            .then((response: boolean) => {
              expect(response).toBe(true);
              expect(jasmine.Ajax.requests.mostRecent().responseType).toBe('text');
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseType: 'text'
          });
        });

        it('for getQuerySuggest', done => {
          const promiseSuccess = ep.getQuerySuggest({
            q: 'foobar',
            count: 10
          });

          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseUri() + '/querySuggest?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');

          expect(jasmine.Ajax.requests.mostRecent().params).toContain('q=foobar');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('count=10');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('actionsHistory=');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');

          // Not real extensions, but will suffice for test purpose
          promiseSuccess
            .then((response: IQuerySuggestResponse) => {
              expect(response.completions.length).toBe(10);
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          // Not real completions, but will suffice for test purpose
          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({ completions: _.range(10) })
          });
        });

        it('for backward compatible query suggest call', done => {
          const promiseSuccess = ep.getRevealQuerySuggest({
            q: 'foobar',
            count: 10
          });

          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseUri() + '/querySuggest?');
          expect(jasmine.Ajax.requests.mostRecent().params).toContain('q=foobar');

          // Not real extensions, but will suffice for test purpose
          promiseSuccess
            .then((response: IQuerySuggestResponse) => {
              expect(response.completions.length).toBe(10);
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          // Not real completions, but will suffice for test purpose
          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({ completions: _.range(10) })
          });
        });

        it('for follow', done => {
          const qbuilder = new QueryBuilder();
          qbuilder.expression.add('batman');
          const promiseSuccess = ep.follow({
            frequency: 'weekly',
            type: 'query',
            typeConfig: {
              query: qbuilder.build()
            },
            name: 'asdasd'
          });

          promiseSuccess
            .then((sub: ISubscription) => {
              expect(sub.id).toBeDefined();
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseAlertsUri() + '/subscriptions?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('accessToken=token');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');
          expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).frequency).toBe('weekly');
          expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).name).toBe('asdasd');

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({
              id: 'foobar',
              type: 'query',
              typeConfig: {
                query: qbuilder.build()
              }
            })
          });
        });

        it('for listSubscriptions', done => {
          const promiseSuccess = ep.listSubscriptions(15);
          promiseSuccess
            .then((subs: ISubscription[]) => {
              expect(subs.length).toBe(44);
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          // Should return the same promise, since it's not resolved yet
          const promiseSuccess2 = ep.listSubscriptions(15);
          expect(promiseSuccess).toBe(promiseSuccess2);

          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseAlertsUri() + '/subscriptions?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('page=15');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('accessToken=token');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify(_.range(44))
          });
        });

        it('for updateSubscription', done => {
          const promiseSuccess = ep.updateSubscription(getSubscriptionPromiseSuccess());
          promiseSuccess
            .then((sub: ISubscription) => {
              expect(sub.id).toBe('foobar');
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseAlertsUri() + '/subscriptions/foobar?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('accessToken=token');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('PUT');
          expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).type).toBe('query');

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({ id: 'foobar' })
          });
        });

        it('for deleteSubscription', done => {
          const promiseSuccess = ep.deleteSubscription(getSubscriptionPromiseSuccess());
          promiseSuccess
            .then((sub: ISubscription) => {
              expect(sub.id).toBe('foobar');
            })
            .catch((e: IErrorResponse) => {
              fail(e);
              return e;
            })
            .then(() => done());

          expect(jasmine.Ajax.requests.mostRecent().url).toContain(ep.getBaseAlertsUri() + '/subscriptions/foobar?');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('organizationId=myOrgId');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('potatoe=mashed');
          expect(jasmine.Ajax.requests.mostRecent().url).toContain('accessToken=token');
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('DELETE');
          expect(jasmine.Ajax.requests.mostRecent().params).toBe('{}');

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: JSON.stringify({ id: 'foobar' })
          });
        });

        it('request can be modified', () => {
          ep.setRequestModifier((requestInfo: IRequestInfo<any>) => {
            requestInfo.headers['Potato'] = 'OmgPotatoes';
            return requestInfo;
          });
          ep.search(new QueryBuilder().build());
          expect(jasmine.Ajax.requests.mostRecent().requestHeaders).toEqual(
            jasmine.objectContaining({
              Potato: 'OmgPotatoes'
            })
          );
        });
      });
    });
  });

  function getSubscriptionPromiseSuccess(): ISubscription {
    const qbuilder = new QueryBuilder();
    qbuilder.expression.add('batman');
    return {
      id: 'foobar',
      type: 'query',
      typeConfig: {
        query: qbuilder.build()
      },
      user: {
        manageToken: '1',
        email: '42@coveo.com'
      },
      name: 'asdasd'
    };
  }
}
