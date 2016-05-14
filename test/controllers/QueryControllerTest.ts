/// <reference path="../Test.ts" />

module Coveo {
  describe('QueryController', function () {
    var test: Mock.IBasicComponentSetup<QueryController>;

    beforeEach(function () {
      test = Mock.optionsComponentSetup<QueryController, ISearchInterfaceOptions>(QueryController, {});
      test.cmp.setEndpoint(test.env.searchEndpoint)
      test.cmp.root = test.env.root;
    })

    afterEach(function () {
      test = null;
    })

    it('should correctly raise errors from the endpoint', (done)=> {
      var spy = <jasmine.Spy>test.env.searchEndpoint.search;
      var error = {
        statusCode: 401,
        data: {
          message: 'the message',
          type: 'the type',
          queryExecutionReport: {}
        }
      }
      spy.and.returnValue(new Promise((resolve, reject)=> {
        reject(error);
      }));
      test.env.searchEndpoint.search = spy;
      expect(test.cmp.executeQuery().catch((data)=> {
        expect(data).toEqual(error);
        done();
      }))
    })

    it('should allow to fetchMore', function () {
      test.cmp.fetchMore(50);
      expect(test.env.searchEndpoint.search).toHaveBeenCalledWith(jasmine.objectContaining({
        firstResult: 10,
        numberOfResults: 50
      }), jasmine.any(Object));
    })

    describe('trigger query events', function () {

      it('should trigger newQuery', function (done) {
        var spy = jasmine.createSpy('spy');
        $$(test.env.root).on('newQuery', spy);
        var search = <jasmine.Spy>test.env.searchEndpoint.search;
        search.and.returnValue(new Promise((resolve, reject)=> {
          resolve(FakeResults.createFakeResults());
        }));
        test.cmp.executeQuery();
        setTimeout(()=> {
          expect(spy).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({
            searchAsYouType: false,
            cancel: false,
            origin: undefined
          }));
          done();
        }, 10)
      })

      it('should trigger buildingQuery', function (done) {
        var spy = jasmine.createSpy('spy');
        $$(test.env.root).on('buildingQuery', spy);
        var search = <jasmine.Spy>test.env.searchEndpoint.search;
        search.and.returnValue(new Promise((resolve, reject)=> {
          resolve(FakeResults.createFakeResults());
        }));
        test.cmp.executeQuery();
        setTimeout(()=> {
          expect(spy).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({
            queryBuilder: jasmine.any(QueryBuilder),
            searchAsYouType: false,
            cancel: false
          }));
          done();
        }, 10)
      })

      it('should trigger doneBuildingQuery', function (done) {
        var spy = jasmine.createSpy('spy');
        $$(test.env.root).on('doneBuildingQuery', spy);
        var search = <jasmine.Spy>test.env.searchEndpoint.search;
        search.and.returnValue(new Promise((resolve, reject)=> {
          resolve(FakeResults.createFakeResults());
        }));
        test.cmp.executeQuery();
        setTimeout(()=> {
          expect(spy).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({
            queryBuilder: jasmine.any(QueryBuilder),
            searchAsYouType: false,
            cancel: false
          }));
          done();
        }, 10)
      })

      it('should trigger querySuccess', function (done) {
        var spy = jasmine.createSpy('spy');
        $$(test.env.root).on('querySuccess', spy);
        var search = <jasmine.Spy>test.env.searchEndpoint.search;
        search.and.returnValue(new Promise((resolve, reject)=> {
          resolve(FakeResults.createFakeResults());
        }));
        test.cmp.executeQuery();
        setTimeout(()=> {
          expect(spy).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({
            queryBuilder: jasmine.any(QueryBuilder),
            query: jasmine.any(Object),
            results: jasmine.any(Object),
            searchAsYouType: false
          }));
          done();
        }, 10)
      })

      it('should trigger preprocessResults', function (done) {
        var spy = jasmine.createSpy('spy');
        $$(test.env.root).on('preprocessResults', spy);
        var search = <jasmine.Spy>test.env.searchEndpoint.search;
        var results = FakeResults.createFakeResults()
        search.and.returnValue(new Promise((resolve, reject)=> {
          resolve(results);
        }));
        test.cmp.executeQuery();
        setTimeout(()=> {
          expect(spy).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({
            queryBuilder: jasmine.any(QueryBuilder),
            query: jasmine.any(Object),
            results: results,
            searchAsYouType: false
          }));
          done();
        }, 10)
      })

      it('should trigger noResults', function (done) {
        var spy = jasmine.createSpy('spy');
        $$(test.env.root).on('noResults', spy);
        var search = <jasmine.Spy>test.env.searchEndpoint.search;
        var results = FakeResults.createFakeResults(0)
        search.and.returnValue(new Promise((resolve, reject)=> {
          resolve(results);
        }));
        test.cmp.executeQuery();
        setTimeout(()=> {
          expect(spy).toHaveBeenCalledWith(jasmine.any(Object), jasmine.objectContaining({
            queryBuilder: jasmine.any(QueryBuilder),
            query: jasmine.any(Object),
            results: results,
            searchAsYouType: false,
            retryTheQuery: false
          }));
          done();
        }, 10)
      })

      it('should cancel the query if set during an event', function () {
        $$(test.env.root).on('newQuery', (e, args)=> {
          args.cancel = true;
        })
        test.cmp.executeQuery();
        expect(test.env.searchEndpoint.search).not.toHaveBeenCalled();
      })
    })
  })
}