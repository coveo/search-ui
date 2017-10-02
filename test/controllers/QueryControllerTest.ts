import * as Mock from '../MockEnvironment';
import { QueryController } from '../../src/controllers/QueryController';
import { $$ } from '../../src/utils/Dom';
import { FakeResults } from '../Fake';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { QueryEvents, IBuildingQueryEventArgs } from '../../src/events/QueryEvents';
import { Simulate } from '../Simulate';

export function QueryControllerTest() {
  describe('QueryController', function() {
    var test: Mock.IBasicComponentSetup<QueryController>;

    beforeEach(function() {
      test = <Mock.IBasicComponentSetup<QueryController>>{};
      test.env = new Mock.MockEnvironmentBuilder().build();
      test.cmp = new QueryController(test.env.root, {}, test.env.usageAnalytics, test.env.searchInterface);
      test.cmp.setEndpoint(test.env.searchEndpoint);
      test.cmp.element = test.env.root;
    });

    afterEach(function() {
      test = null;
    });

    it('should correctly raise errors from the endpoint', done => {
      var spy = <jasmine.Spy>test.env.searchEndpoint.search;
      var error = {
        statusCode: 401,
        data: {
          message: 'the message',
          type: 'the type',
          queryExecutionReport: {}
        }
      };

      spy.and.returnValue(
        new Promise((resolve, reject) => {
          reject(error);
        })
      );

      test.env.searchEndpoint.search = spy;
      expect(
        test.cmp.executeQuery().catch(data => {
          expect(data).toEqual(error);
          done();
        })
      );
    });

    it('should allow to fetchMore', function() {
      test.cmp.fetchMore(50);
      expect(test.env.searchEndpoint.search).toHaveBeenCalledWith(
        jasmine.objectContaining({
          firstResult: 10,
          numberOfResults: 50
        }),
        jasmine.any(Object)
      );
    });

    it('should allow to get the last query', done => {
      $$(test.cmp.element).on(QueryEvents.buildingQuery, (e, args: IBuildingQueryEventArgs) => {
        args.queryBuilder.expression.add('mamamia');
      });
      var search = <jasmine.Spy>test.env.searchEndpoint.search;
      var results = FakeResults.createFakeResults();
      search.and.returnValue(
        new Promise((resolve, reject) => {
          resolve(results);
        })
      );

      test.cmp.executeQuery();
      setTimeout(() => {
        expect(test.cmp.getLastQuery().q).toContain('mamamia');
        done();
      }, 10);
    });

    it('should allow to get the last query results', done => {
      var search = <jasmine.Spy>test.env.searchEndpoint.search;
      var results = FakeResults.createFakeResults();
      search.and.returnValue(
        new Promise((resolve, reject) => {
          resolve(results);
        })
      );

      test.cmp.executeQuery();
      setTimeout(() => {
        expect(test.cmp.getLastResults()).toEqual(results);
        done();
      }, 10);
    });

    describe('trigger query events', function() {
      it('should trigger newQuery', function(done) {
        var spy = jasmine.createSpy('spy');
        $$(test.env.root).on('newQuery', spy);
        var search = <jasmine.Spy>test.env.searchEndpoint.search;
        search.and.returnValue(
          new Promise((resolve, reject) => {
            resolve(FakeResults.createFakeResults());
          })
        );

        test.cmp.executeQuery();
        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(
            jasmine.any(Object),
            jasmine.objectContaining({
              searchAsYouType: false,
              cancel: false,
              origin: undefined
            })
          );
          done();
        }, 10);
      });

      it('should trigger buildingQuery', function(done) {
        var spy = jasmine.createSpy('spy');
        $$(test.env.root).on('buildingQuery', spy);
        var search = <jasmine.Spy>test.env.searchEndpoint.search;
        search.and.returnValue(
          new Promise((resolve, reject) => {
            resolve(FakeResults.createFakeResults());
          })
        );

        test.cmp.executeQuery();
        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(
            jasmine.any(Object),
            jasmine.objectContaining({
              queryBuilder: jasmine.any(QueryBuilder),
              searchAsYouType: false,
              cancel: false
            })
          );
          done();
        }, 10);
      });

      it('should trigger doneBuildingQuery', function(done) {
        var spy = jasmine.createSpy('spy');
        $$(test.env.root).on('doneBuildingQuery', spy);
        var search = <jasmine.Spy>test.env.searchEndpoint.search;
        search.and.returnValue(
          new Promise((resolve, reject) => {
            resolve(FakeResults.createFakeResults());
          })
        );
        test.cmp.executeQuery();
        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(
            jasmine.any(Object),
            jasmine.objectContaining({
              queryBuilder: jasmine.any(QueryBuilder),
              searchAsYouType: false,
              cancel: false
            })
          );
          done();
        }, 10);
      });

      it('should trigger querySuccess', function(done) {
        var spy = jasmine.createSpy('spy');
        $$(test.env.root).on('querySuccess', spy);
        var search = <jasmine.Spy>test.env.searchEndpoint.search;
        search.and.returnValue(
          new Promise((resolve, reject) => {
            resolve(FakeResults.createFakeResults());
          })
        );
        test.cmp.executeQuery();

        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(
            jasmine.any(Object),
            jasmine.objectContaining({
              queryBuilder: jasmine.any(QueryBuilder),
              query: jasmine.any(Object),
              results: jasmine.any(Object),
              searchAsYouType: false
            })
          );
          done();
        }, 10);
      });

      it('should trigger preprocessResults', function(done) {
        var spy = jasmine.createSpy('spy');
        $$(test.env.root).on('preprocessResults', spy);
        var search = <jasmine.Spy>test.env.searchEndpoint.search;
        var results = FakeResults.createFakeResults();
        search.and.returnValue(
          new Promise((resolve, reject) => {
            resolve(results);
          })
        );

        test.cmp.executeQuery();
        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(
            jasmine.any(Object),
            jasmine.objectContaining({
              queryBuilder: jasmine.any(QueryBuilder),
              query: jasmine.any(Object),
              results: results,
              searchAsYouType: false
            })
          );
          done();
        }, 10);
      });

      it('should trigger noResults', function(done) {
        var spy = jasmine.createSpy('spy');
        $$(test.env.root).on('noResults', spy);
        var search = <jasmine.Spy>test.env.searchEndpoint.search;
        var results = FakeResults.createFakeResults(0);
        search.and.returnValue(
          new Promise((resolve, reject) => {
            resolve(results);
          })
        );

        test.cmp.executeQuery();
        setTimeout(() => {
          expect(spy).toHaveBeenCalledWith(
            jasmine.any(Object),
            jasmine.objectContaining({
              queryBuilder: jasmine.any(QueryBuilder),
              query: jasmine.any(Object),
              results: results,
              searchAsYouType: false,
              retryTheQuery: false
            })
          );
          done();
        }, 10);
      });

      it('should cancel the query if set during an event', function() {
        $$(test.env.root).on('newQuery', (e, args) => {
          args.cancel = true;
        });
        test.cmp.executeQuery();
        expect(test.env.searchEndpoint.search).not.toHaveBeenCalled();
      });
    });

    describe('coveoanalytics', function() {
      let store: CoveoAnalytics.HistoryStore;

      beforeEach(function() {
        store = Simulate.analyticsStoreModule();
        test.cmp.historyStore = store;
        spyOn(store, 'addElement');
      });

      afterEach(function() {
        store = undefined;
        window['coveoanalytics'] = undefined;
      });

      it('should not log the query in the user history if not specified', function() {
        test.cmp.executeQuery({ logInActionsHistory: false });
        expect(store.addElement).not.toHaveBeenCalled();
      });

      it('should log the query in the user history if specified', function() {
        test.cmp.executeQuery({ logInActionsHistory: true });
        expect(store.addElement).toHaveBeenCalled();
      });
    });
  });
}
