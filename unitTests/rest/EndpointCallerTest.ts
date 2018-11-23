import { EndpointCaller, IErrorResponse, ISuccessResponse } from '../../src/rest/EndpointCaller';
import { IQueryResults } from '../../src/rest/QueryResults';
import { FakeResults } from '../Fake';

export function EndpointCallerTest() {
  describe('EndpointCaller', function() {
    describe('using generic call', function() {
      beforeEach(function() {
        jasmine.Ajax.install();
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it('should use XMLHTTPRequest by default', function() {
        var endpointCaller = new EndpointCaller();
        endpointCaller.call({
          method: 'POST',
          requestData: {},
          url: 'this is an XMLHTTPRequest',
          queryString: [],
          responseType: 'text',
          errorsAsSuccess: false
        });
        expect(jasmine.Ajax.requests.mostRecent().url).toBe('this is an XMLHTTPRequest');
      });

      it('should use the provided XMLHTTPRequest', function() {
        class CustomXMLHttpRequest extends XMLHttpRequest {}

        var endpointCaller = new EndpointCaller({ xmlHttpRequest: CustomXMLHttpRequest });
        endpointCaller.call({
          method: 'POST',
          requestData: {},
          url: 'this is an XMLHTTPRequest',
          queryString: [],
          responseType: 'text',
          errorsAsSuccess: false
        });
        expect(jasmine.Ajax.requests.mostRecent() instanceof CustomXMLHttpRequest).toBe(true);
      });

      it('should set the auth if provided', function() {
        var endpointCaller = new EndpointCaller({
          accessToken: 'myToken'
        });
        endpointCaller.call({
          method: 'POST',
          requestData: {},
          url: 'this is an XMLHTTPRequest',
          queryString: [],
          responseType: 'text',
          errorsAsSuccess: false
        });
        expect(jasmine.Ajax.requests.mostRecent().requestHeaders['Authorization']).toBe('Bearer myToken');

        endpointCaller = new EndpointCaller({
          username: 'john@doe.com',
          password: 'hunter123'
        });
        endpointCaller.call({
          method: 'POST',
          requestData: {},
          url: 'this is an XMLHTTPRequest',
          queryString: [],
          responseType: 'text',
          errorsAsSuccess: false
        });
        expect(jasmine.Ajax.requests.mostRecent().requestHeaders['Authorization']).toBe('Basic ' + btoa('john@doe.com:hunter123'));
      });
    });

    describe('using XMLHTTPRequest', function() {
      beforeEach(function() {
        jasmine.Ajax.install();
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it('should set the correct requested params on the XMLHTTPRequest', function() {
        var endpointCaller = new EndpointCaller();
        endpointCaller.call({
          method: 'POST',
          requestData: {
            foo: 'bar',
            bar: 'foo',
            bahh: 'bohh'
          },
          url: 'foo.bar.com',
          queryString: [],
          responseType: 'text',
          errorsAsSuccess: false
        });
        var fakeRequest = jasmine.Ajax.requests.mostRecent();
        expect(fakeRequest.method).toBe('POST');
        expect(fakeRequest.params).toBe('foo=bar&bar=foo&bahh=bohh');
        expect(fakeRequest.url).toBe('foo.bar.com');
        expect(fakeRequest.requestHeaders['Content-Type']).toBe('application/x-www-form-urlencoded; charset="UTF-8"');

        endpointCaller.call({
          method: 'GET',
          requestData: {},
          url: 'foo.bar.com',
          queryString: ['a=b', 'c=d'],
          responseType: 'arraybuffer',
          errorsAsSuccess: false
        });
        fakeRequest = jasmine.Ajax.requests.mostRecent();
        expect(fakeRequest.method).toBe('GET');
        expect(fakeRequest.params).toBeUndefined();
        expect(fakeRequest.url).toBe('foo.bar.com?a=b&c=d');
        expect(Object.keys(fakeRequest.requestHeaders).length).toBe(0);

        endpointCaller.call({
          method: 'GET',
          requestData: {
            e: 'f',
            g: 'h'
          },
          url: 'foo.bar.com',
          queryString: ['a=b', 'c=d'],
          responseType: 'json',
          errorsAsSuccess: false
        });
        fakeRequest = jasmine.Ajax.requests.mostRecent();
        expect(fakeRequest.method).toBe('GET');
        expect(fakeRequest.params).toBeUndefined();
        expect(fakeRequest.url).toBe('foo.bar.com?a=b&c=d&e=f&g=h');
        expect(Object.keys(fakeRequest.requestHeaders).length).toBe(0);
      });

      describe('using response type text', function() {
        beforeEach(function() {
          this.endpointCaller = new EndpointCaller();
          this.promise = this.endpointCaller.call({
            method: 'POST',
            requestData: {
              foo: 'bar',
              bar: 'foo',
              bahh: 'bohh'
            },
            url: 'foo.bar.com',
            queryString: [],
            responseType: 'text',
            errorsAsSuccess: false
          });
        });

        afterEach(function() {
          this.endpointCaller = undefined;
          this.promise = undefined;
        });

        it('should work if responseContentType is text', function(done) {
          this.promise
            .then((response: ISuccessResponse<IQueryResults>) => {
              expect(response.data.results.length).toBe(10);
              expect(response.duration).toBeDefined();
            })
            .then(() => {
              done();
            });

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'text',
            responseText: FakeResults.createFakeResults()
          });
        });

        it('should work if responseContentType is application/json', function(done) {
          this.promise
            .then((response: ISuccessResponse<IQueryResults>) => {
              expect(response.data.results.length).toBe(10);
              expect(response.duration).toBeDefined();
            })
            .then(() => {
              done();
            });
          var fakeRequest = jasmine.Ajax.requests.mostRecent();
          fakeRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(FakeResults.createFakeResults())
          });
        });

        it('should behave properly if there is an error', function(done) {
          this.promise
            .then((response: ISuccessResponse<IQueryResults>) => {
              // This should never execute, and always go to the catch statement
              expect(false).toBe(true);
            })
            .catch((error: IErrorResponse) => {
              expect(error.statusCode).toBe(500);
              return error.statusCode;
            })
            .then(() => {
              done();
            });

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 500
          });
        });

        it('should behave properly if there is an error in the body', function(done) {
          this.promise
            .then((response: ISuccessResponse<IQueryResults>) => {
              // This should never execute, and always go to the catch statement
              expect(false).toBe(true);
            })
            .catch((error: IErrorResponse) => {
              expect(error.statusCode).toBe(404);
              return error.statusCode;
            })
            .then(() => {
              done();
            });

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            responseText: {
              statusCode: 404
            },
            contentType: 'text'
          });
        });
      });

      describe('using response type json', function() {
        beforeEach(function() {
          this.endpointCaller = new EndpointCaller();
          this.promise = this.endpointCaller.call({
            method: 'POST',
            requestData: {
              foo: 'bar',
              bar: 'foo',
              bahh: 'bohh'
            },
            url: 'foo.bar.com',
            queryString: [],
            responseType: 'json',
            errorsAsSuccess: false
          });
        });
        afterEach(function() {
          this.endpointCaller = undefined;
          this.promise = undefined;
        });

        it('should work if responseContentType is text', function(done) {
          this.promise
            .then((response: ISuccessResponse<IQueryResults>) => {
              expect(response.data.results.length).toBe(10);
              expect(response.duration).toBeDefined();
              return response.duration;
            })
            .then(() => {
              done();
            });

          jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'text',
            response: FakeResults.createFakeResults()
          });
        });

        it('should work if responseContentType is application/json', function(done) {
          this.promise
            .then((response: ISuccessResponse<IQueryResults>) => {
              expect(response.data.results.length).toBe(10);
              expect(response.duration).toBeDefined();
              return response.duration;
            })
            .then(() => {
              done();
            });

          var fakeRequest = jasmine.Ajax.requests.mostRecent();
          fakeRequest.respondWith({
            status: 200,
            contentType: 'application/json',
            response: FakeResults.createFakeResults()
          });
        });

        it('should allow to modify the request with an option', function() {
          let endpointCaller = new EndpointCaller({
            accessToken: 'myToken',
            requestModifier: requestInfo => {
              requestInfo.method = 'GET';
              return requestInfo;
            }
          });
          endpointCaller.call({
            method: 'POST',
            requestData: {},
            url: 'this is an XMLHTTPRequest',
            queryString: [],
            responseType: 'text',
            errorsAsSuccess: false
          });
          expect(jasmine.Ajax.requests.mostRecent().method).toBe('GET');
        });
      });
    });
  });
}
