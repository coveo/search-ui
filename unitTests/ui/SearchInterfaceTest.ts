import { defer } from 'underscore';
import { HistoryController } from '../../src/controllers/HistoryController';
import { LocalStorageHistoryController } from '../../src/controllers/LocalStorageHistoryController';
import { QueryController } from '../../src/controllers/QueryController';
import { InitializationEvents } from '../../src/Core';
import { IDoneBuildingQueryEventArgs, QueryEvents } from '../../src/events/QueryEvents';
import { ComponentOptionsModel } from '../../src/models/ComponentOptionsModel';
import { ComponentStateModel } from '../../src/models/ComponentStateModel';
import { QueryStateModel } from '../../src/models/QueryStateModel';
import { Component } from '../../src/ui/Base/Component';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { Debug } from '../../src/ui/Debug/Debug';
import { PipelineContext } from '../../src/ui/PipelineContext/PipelineContext';
import { Querybox } from '../../src/ui/Querybox/Querybox';
import { Quickview } from '../../src/ui/Quickview/Quickview';
import { MEDIUM_SCREEN_WIDTH, SMALL_SCREEN_WIDTH } from '../../src/ui/ResponsiveComponents/ResponsiveComponents';
import { ISearchInterfaceOptions, SearchInterface } from '../../src/ui/SearchInterface/SearchInterface';
import { $$ } from '../../src/utils/Dom';
import { FakeResults } from '../Fake';
import * as Mock from '../MockEnvironment';
import { Simulate } from '../Simulate';
import { SearchEndpoint } from '../Test';
import { NoopHistoryController } from '../../src/controllers/NoopHistoryController';
import { MockEnvironmentBuilder } from '../MockEnvironment';

export function SearchInterfaceTest() {
  describe('SearchInterface', () => {
    let cmp: SearchInterface;

    beforeEach(() => {
      cmp = new SearchInterface(document.createElement('div'));
    });

    afterEach(() => {
      cmp = null;
    });

    it('should create an analytics client', () => {
      expect(cmp.usageAnalytics instanceof Coveo['NoopAnalyticsClient']).toBe(true);
    });

    it('should create a query controller', () => {
      expect(cmp.queryController instanceof QueryController).toBe(true);
    });

    it('should create a query state model', () => {
      expect(cmp.queryStateModel instanceof QueryStateModel).toBe(true);
    });

    it('should create a component options model', () => {
      expect(cmp.componentOptionsModel instanceof ComponentOptionsModel).toBe(true, 'Not a component options model');
    });

    it('should create a component state model', () => {
      expect(cmp.componentStateModel instanceof ComponentStateModel).toBe(true, 'Not a component state model');
    });

    it('should create a search interface', () => {
      expect(cmp instanceof SearchInterface).toBe(true);
    });

    it('should set the root as itself', () => {
      expect(cmp.root).toBe(cmp.element, 'Not an element');
    });

    it('should allow to attach and detach component', () => {
      const cmpToAttach = Mock.mockComponent(Querybox);
      cmp.attachComponent('Querybox', cmpToAttach);
      expect(cmp.getComponents('Querybox')).toContain(cmpToAttach);
      cmp.detachComponent('Querybox', cmpToAttach);
      expect(cmp.getComponents('Querybox')).not.toContain(cmpToAttach);
    });

    describe('detachComponentsInside', () => {
      let querybox: Querybox;
      let quickview: Quickview;

      beforeEach(() => {
        querybox = Mock.mockComponent(Querybox);
        quickview = Mock.mockComponent(Quickview);
        querybox.element = $$('div').el;
        quickview.element = $$('div').el;
        cmp.attachComponent('Querybox', querybox);
        cmp.attachComponent('Quickview', quickview);
      });

      it('should detach every component inside a given element', () => {
        const container = $$('div', {}, querybox.element, quickview.element);

        cmp.detachComponentsInside(container.el);

        expect(cmp.getComponents('Querybox')).not.toContain(querybox);
        expect(cmp.getComponents('Quickview')).not.toContain(quickview);
      });

      it('should not detach components outside the given element', () => {
        const container = $$('div', {}, quickview.element);

        cmp.detachComponentsInside(container.el);

        expect(cmp.getComponents('Querybox')).toContain(querybox);
        expect(cmp.getComponents('Quickview')).not.toContain(quickview);
      });
    });

    describe('usage analytics', () => {
      let searchInterfaceDiv: HTMLElement;
      let analyticsDiv: HTMLElement;

      beforeEach(() => {
        searchInterfaceDiv = $$('div').el;
        analyticsDiv = $$('div', {
          className: 'CoveoAnalytics',
          'data-token': 'el-tokeno'
        }).el;

        searchInterfaceDiv.appendChild(analyticsDiv);
      });

      afterEach(() => {
        searchInterfaceDiv = null;
        analyticsDiv = null;
      });

      it('should initialize if found inside the root', () => {
        const searchInterface = new SearchInterface(searchInterfaceDiv);
        expect(searchInterface.usageAnalytics instanceof Coveo['LiveAnalyticsClient']).toBe(true);
      });
    });

    it('should set the correct css class on facet section, if available', () => {
      const facetSection = $$('div', { className: 'coveo-facet-column' });
      cmp.element.appendChild(facetSection.el);
      cmp.queryController.options.endpoint = Mock.mockSearchEndpoint();
      const env = new MockEnvironmentBuilder().withRoot(cmp.element).build();

      Simulate.query(env, { results: FakeResults.createFakeResults(0) });
      expect(facetSection.hasClass('coveo-no-results')).toBe(true);

      Simulate.query(env, { results: FakeResults.createFakeResults(10) });
      expect(facetSection.hasClass('coveo-no-results')).toBe(false);

      Simulate.queryError(env);
      expect(facetSection.hasClass('coveo-no-results')).toBe(true);

      Simulate.query(env, { results: FakeResults.createFakeResults(10) });
      expect(facetSection.hasClass('coveo-no-results')).toBe(false);
    });

    it('should set the correct css class on result section, if available', () => {
      const resultsSection = $$('div', { className: 'coveo-results-column' });
      cmp.element.appendChild(resultsSection.el);
      cmp.queryController.options.endpoint = Mock.mockSearchEndpoint();
      const env = new MockEnvironmentBuilder().withRoot(cmp.element).build();

      Simulate.query(env, { results: FakeResults.createFakeResults(0) });
      expect(resultsSection.hasClass('coveo-no-results')).toBe(true);

      Simulate.query(env, { results: FakeResults.createFakeResults(10) });
      expect(resultsSection.hasClass('coveo-no-results')).toBe(false);

      Simulate.queryError(env);
      expect(resultsSection.hasClass('coveo-no-results')).toBe(true);

      Simulate.query(env, { results: FakeResults.createFakeResults(10) });
      expect(resultsSection.hasClass('coveo-no-results')).toBe(false);
    });

    it('should set the correct css class on recommendation section, if available', () => {
      const recommendationSection = $$('div', { className: 'coveo-recommendation-main-section' });
      cmp.element.appendChild(recommendationSection.el);
      cmp.queryController.options.endpoint = Mock.mockSearchEndpoint();
      const env = new MockEnvironmentBuilder().withRoot(cmp.element).build();

      Simulate.query(env, { results: FakeResults.createFakeResults(0) });
      expect(recommendationSection.hasClass('coveo-no-results')).toBe(true);

      Simulate.query(env, { results: FakeResults.createFakeResults(10) });
      expect(recommendationSection.hasClass('coveo-no-results')).toBe(false);

      Simulate.queryError(env);
      expect(recommendationSection.hasClass('coveo-no-results')).toBe(true);

      Simulate.query(env, { results: FakeResults.createFakeResults(10) });
      expect(recommendationSection.hasClass('coveo-no-results')).toBe(false);
    });

    describe('with an environment', () => {
      let div: HTMLDivElement;
      let mockWindow: Window;
      let env: Mock.IMockEnvironment;

      beforeEach(() => {
        div = document.createElement('div');
        env = new Mock.MockEnvironmentBuilder()
          .withRoot(div)
          .withEndpoint(
            new SearchEndpoint({
              restUri: 'foo/rest/search'
            })
          )
          .withLiveQueryStateModel()
          .build();
        env.queryController.setEndpoint(env.searchEndpoint);
        env.queryController.getEndpoint = () => env.searchEndpoint;
        mockWindow = Mock.mockWindow();
      });

      const setupSearchInterface = (options?: ISearchInterfaceOptions, analyticsOptions?: any) => {
        cmp = new SearchInterface(div, options, analyticsOptions, mockWindow);
        cmp.queryController = env.queryController;
        cmp.queryStateModel = env.queryStateModel;
        cmp.usageAnalytics = env.usageAnalytics;
        return cmp;
      };

      afterEach(() => {
        div = null;
        env = null;
        mockWindow = null;
      });

      describe('when modifying results per page', () => {
        let searchInterface: SearchInterface;

        beforeEach(() => {
          Simulate.removeJQuery();
          searchInterface = new SearchInterface(div, undefined, undefined, mockWindow);
          searchInterface.queryController.setEndpoint(Mock.mockSearchEndpoint());
        });

        it('should adapt the query controller options', () => {
          searchInterface.resultsPerPage = 1235;
          expect(searchInterface.queryController.options.resultsPerPage).toBe(1235);
        });

        it('should tell correctly when the parameter has been overwritten by a query pipeline', () => {
          // Component is configured to request 15 results, but receives only 7, meaning the setting was overwritten by the backend
          searchInterface.resultsPerPage = 15;
          let fakeResults = FakeResults.createFakeResults(7);
          fakeResults.totalCountFiltered = fakeResults.totalCount = 999;
          let builder = new QueryBuilder();
          builder.numberOfResults = 15;

          Simulate.query(
            { element: searchInterface.root, result: null, searchEndpoint: null, ...searchInterface.getBindings() },
            {
              results: fakeResults,
              query: builder.build()
            }
          );

          expect(searchInterface.isResultsPerPageModifiedByPipeline).toBeTruthy();

          // Component is configured to request 15 results, and exactly 15 results are returned
          searchInterface.resultsPerPage = 15;
          fakeResults = FakeResults.createFakeResults(15);
          fakeResults.totalCountFiltered = fakeResults.totalCount = 999;
          builder = new QueryBuilder();
          builder.numberOfResults = 15;

          Simulate.query(
            { element: searchInterface.root, result: null, searchEndpoint: null, ...searchInterface.getBindings() },
            {
              results: fakeResults,
              query: builder.build()
            }
          );

          expect(searchInterface.isResultsPerPageModifiedByPipeline).toBeFalsy();
        });

        it(`when the actual number of results is less than requested due to being on the last page,
        it should mark #isResultsPerPageModifiedByPipeline as false`, () => {
          const totalNumberOfResults = 13;
          const resultsPerPage = 10;
          const numOfResultsToReturn = totalNumberOfResults - resultsPerPage;
          const fakeResults = FakeResults.createFakeResults(numOfResultsToReturn);
          fakeResults.totalCountFiltered = fakeResults.totalCount = totalNumberOfResults;

          searchInterface.resultsPerPage = resultsPerPage;
          const builder = new QueryBuilder();
          builder.numberOfResults = resultsPerPage;
          builder.firstResult = resultsPerPage;

          Simulate.query(
            { element: searchInterface.root, result: null, searchEndpoint: null, ...searchInterface.getBindings() },
            {
              results: fakeResults,
              query: builder.build()
            }
          );

          expect(searchInterface.isResultsPerPageModifiedByPipeline).toBeFalsy();
        });
      });

      it('should return undefined if no query context exists', () => {
        setupSearchInterface();
        expect(cmp.getQueryContext()).toBeUndefined();
      });

      it('should allow to retrieve the context after a query', () => {
        setupSearchInterface();
        const queryBuilder = new QueryBuilder();
        queryBuilder.addContextValue('123', '456');
        cmp.queryController.getLastQuery = () => queryBuilder.build();
        Simulate.query(env, {
          query: queryBuilder.build()
        });
        expect(cmp.getQueryContext()).toEqual({ '123': '456' });
      });

      it('should allow to retrieve the context from a PipelineContext if present', () => {
        setupSearchInterface();
        const pipeline = new PipelineContext($$('script').el, {}, cmp.getBindings());
        pipeline.setContext({
          foo: 'bar'
        });
        expect(cmp.getQueryContext()).toEqual({ foo: 'bar' });
      });

      it('should allow to retrieve the context from multiple PipelineContext if present', () => {
        const pipeline1 = new PipelineContext($$('script').el, {}, cmp.getBindings());
        pipeline1.setContext({
          foo: 'bar'
        });

        const pipeline2 = new PipelineContext($$('script').el, {}, cmp.getBindings());
        pipeline2.setContext({
          buzz: 'bazz'
        });

        expect(cmp.getQueryContext()).toEqual({ foo: 'bar', buzz: 'bazz' });
      });

      it('should allow to retrieve the context from the multiple PipelineContext if they have conflicting context', () => {
        const pipeline1 = new PipelineContext($$('script').el, {}, cmp.getBindings());
        pipeline1.setContext({
          foo: 'bar'
        });

        const pipeline2 = new PipelineContext($$('script').el, {}, cmp.getBindings());
        pipeline2.setContext({
          foo: 'not bar'
        });

        expect(cmp.getQueryContext()).toEqual({ foo: 'not bar' });
      });

      describe('exposes options', () => {
        it('enableHistory allow to enable history in the url', () => {
          setupSearchInterface({
            enableHistory: true
          });
          expect(Component.resolveBinding(cmp.element, HistoryController)).toBeDefined();
        });

        it("enableHistory uses a full fledge HistoryController by default as it's manager", () => {
          const searchInterface = setupSearchInterface({
            enableHistory: true
          });
          expect(searchInterface.historyManager instanceof HistoryController).toBe(true);
        });

        it("enableHistory can be disabled and won't save history in the url", () => {
          setupSearchInterface({
            enableHistory: false
          });
          expect(Component.resolveBinding(cmp.element, HistoryController)).toBeUndefined();
        });

        it('enableHistory can be disabled and there will still be an history manager to access', () => {
          const searchInterface = setupSearchInterface({
            enableHistory: false
          });
          expect(searchInterface.historyManager instanceof NoopHistoryController).toBe(true);
        });

        it('useLocalStorageForHistory allow to use local storage for history', () => {
          setupSearchInterface({
            enableHistory: true,
            useLocalStorageForHistory: true
          });
          expect(Component.resolveBinding(cmp.element, HistoryController)).toBeUndefined();
          expect(Component.resolveBinding(cmp.element, LocalStorageHistoryController)).toBeDefined();
        });

        it("useLocalStorageForHistory uses a LocalStorageHistoryController as it's manager", () => {
          const searchInterface = setupSearchInterface({
            enableHistory: true,
            useLocalStorageForHistory: true
          });
          expect(searchInterface.historyManager instanceof LocalStorageHistoryController).toBe(true);
        });

        it('useLocalStorageForHistory allow to use local storage for history, but not if history is disabled', () => {
          setupSearchInterface({
            enableHistory: false,
            useLocalStorageForHistory: true
          });
          expect(Component.resolveBinding(cmp.element, HistoryController)).toBeUndefined();
          expect(Component.resolveBinding(cmp.element, LocalStorageHistoryController)).toBeUndefined();
        });

        it('resultsPerPage allow to specify the number of results in query', () => {
          setupSearchInterface({ resultsPerPage: 123 });
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.numberOfResults).toBe(123);
        });

        it('resultsPerPage should be 10 by default', () => {
          setupSearchInterface();
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.numberOfResults).toBe(10);
        });

        it('excerptLength allow to specify the excerpt length of results in a query', () => {
          setupSearchInterface({ excerptLength: 123 });
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.excerptLength).toBe(123);
        });

        it('excerptLength should be 200 by default', () => {
          setupSearchInterface();
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.excerptLength).toBe(200);
        });

        it('expression allow to specify and advanced expression to add to the query', () => {
          setupSearchInterface({ expression: 'foobar' });
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.constantExpression.build()).toBe('foobar');
        });

        it('expression should not be added if empty', () => {
          setupSearchInterface({ expression: '' });
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.constantExpression.build()).toBeUndefined();
        });

        it('expression should be empty by default', () => {
          setupSearchInterface();
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.constantExpression.build()).toBeUndefined();
        });

        it('filterField allow to specify a filtering field', () => {
          setupSearchInterface({ filterField: '@foobar' });
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.filterField).toBe('@foobar');
        });

        it('filterField should be empty by default', () => {
          setupSearchInterface();
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.filterField).toBeUndefined();
        });

        it('timezone allow to specify a timezone in the query', () => {
          setupSearchInterface({ timezone: 'aa-bb' });
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.timezone).toBe('aa-bb');
        });

        it('enableDebugInfo should create a debug component', function(done) {
          const cmp = new SearchInterface(
            div,
            {
              enableDebugInfo: true
            },
            undefined,
            mockWindow
          );
          defer(() => {
            expect(Component.resolveBinding(cmp.element, Debug)).toBeDefined();
            done();
          });
        });

        it('enableDebugInfo disabled should not create a debug component', function(done) {
          const cmp = new SearchInterface(
            div,
            {
              enableDebugInfo: false
            },
            undefined,
            mockWindow
          );
          defer(() => {
            expect(Component.resolveBinding(cmp.element, Debug)).toBeUndefined();
            done();
          });
        });

        it('enableCollaborativeRating allow to specify the collaborative rating in the query', () => {
          setupSearchInterface({ enableCollaborativeRating: true });

          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.enableCollaborativeRating).toBe(true);
        });

        it('enableCollaborativeRating to false allow to disable the collaborative rating in the query', () => {
          setupSearchInterface({ enableCollaborativeRating: false });
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.enableCollaborativeRating).toBe(false);
        });

        it('enableDuplicateFiltering allow to filter duplicate in the query', () => {
          setupSearchInterface({ enableDuplicateFiltering: true });
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.enableDuplicateFiltering).toBe(true);
        });

        it('enableDuplicateFiltering to false allow to disable the filter duplicate in the query', () => {
          setupSearchInterface({ enableDuplicateFiltering: false });
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.enableDuplicateFiltering).toBe(false);
        });

        it('pipeline allow to specify the pipeline to use in a query', () => {
          setupSearchInterface({ pipeline: 'foobar' });
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.pipeline).toBe('foobar');
        });

        it('maximumAge allow to specify the duration of the cache in a query', () => {
          setupSearchInterface({ maximumAge: 123 });
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.maximumAge).toBe(123);
        });

        it('responsiveMediumBreakpoint will set the value properly in the underlying ResponsiveComponent', () => {
          const searchInterface = setupSearchInterface({ responsiveMediumBreakpoint: 12345 });
          expect(searchInterface.responsiveComponents.getMediumScreenWidth()).toBe(12345);
        });

        it('responsiveMediumBreakpoint will default to a proper value', () => {
          const searchInterface = setupSearchInterface({});
          expect(searchInterface.responsiveComponents.getMediumScreenWidth()).toBe(MEDIUM_SCREEN_WIDTH);
        });

        it('responsiveSmallBreakpoint will set the value properly in the underlying ResponsiveComponent', () => {
          const searchInterface = setupSearchInterface({ responsiveSmallBreakpoint: 123 });
          expect(searchInterface.responsiveComponents.getSmallScreenWidth()).toBe(123);
        });

        it('responsiveSmallBreakpoint will default to a proper value', () => {
          const searchInterface = setupSearchInterface({});
          expect(searchInterface.responsiveComponents.getSmallScreenWidth()).toBe(SMALL_SCREEN_WIDTH);
        });

        it('enableScrollRestoration should create a scroll restoration instance if true', () => {
          setupSearchInterface({
            enableScrollRestoration: true
          });
          expect(cmp.scrollRestorer).toBeDefined();
        });

        it('enableScrollRestoration should not create a scroll restoration instance if false', () => {
          setupSearchInterface({
            enableScrollRestoration: false
          });
          expect(cmp.scrollRestorer).toBeUndefined();
        });
      });

      describe('when allowQueriesWithoutKeywords if true', () => {
        beforeEach(() => {
          setupSearchInterface({ allowQueriesWithoutKeywords: true });
        });

        it('it does not cancel the query if there are no keywords', done => {
          $$(div).on(QueryEvents.doneBuildingQuery, (e, args: IDoneBuildingQueryEventArgs) => {
            expect(args.cancel).toBe(false);
            done();
          });
          Simulate.query(env);
        });

        it('allowQueriesWithoutKeywords to true should be sent as a flag in the query', () => {
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.build().allowQueriesWithoutKeywords).toBe(true);
        });
      });

      describe('when allowQueriesWithoutKeywords is false', () => {
        let searchInterface: SearchInterface;
        beforeEach(() => {
          searchInterface = setupSearchInterface({ allowQueriesWithoutKeywords: false });
        });

        it('it does cancel the query if there are no keywords', done => {
          $$(div).on(QueryEvents.doneBuildingQuery, (e, args: IDoneBuildingQueryEventArgs) => {
            expect(args.cancel).toBe(true);
            done();
          });
          Simulate.query(env);
        });

        it('it does not cancel the query if there are keywords', done => {
          const queryBuilder = new QueryBuilder();
          queryBuilder.expression.add('foo');

          $$(div).on(QueryEvents.doneBuildingQuery, (e, args: IDoneBuildingQueryEventArgs) => {
            expect(args.cancel).toBe(false);
            done();
          });

          Simulate.query(env, {
            queryBuilder: queryBuilder
          });
        });

        it('it should set a flag in the query', () => {
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.build().allowQueriesWithoutKeywords).toBe(false);
        });

        it('should not cancel the query if there is no keyword currently, but there is a previous query available which contains keyword', done => {
          searchInterface.queryController.getLastQuery = () => {
            const queryBuilder = new QueryBuilder();
            queryBuilder.expression.add('foo');
            return queryBuilder.build();
          };

          $$(div).on(QueryEvents.doneBuildingQuery, (e, args: IDoneBuildingQueryEventArgs) => {
            expect(args.cancel).toBe(false);
            expect(args.queryBuilder.build().q).toBe('foo');
            done();
          });

          const currentlyEmptyQueryBuilder = new QueryBuilder();
          Simulate.query(env, {
            queryBuilder: currentlyEmptyQueryBuilder
          });
        });

        describe('using css classes', () => {
          const isInWaitingForQueryModeInitially = () => {
            $$(cmp.element).trigger(InitializationEvents.restoreHistoryState);
            return $$(cmp.element).hasClass('coveo-waiting-for-query');
          };

          const isInWaitingForQueryModeAfterQuery = (query: string) => {
            return new Promise<boolean>(resolve => {
              $$(div).one(QueryEvents.deferredQuerySuccess, (e, args: IDoneBuildingQueryEventArgs) => {
                resolve($$(cmp.element).hasClass('coveo-waiting-for-query'));
              });

              $$(div).one(QueryEvents.doneBuildingQuery, (e, args: IDoneBuildingQueryEventArgs) => {
                if (args.cancel) {
                  resolve($$(cmp.element).hasClass('coveo-waiting-for-query'));
                }
              });
              const queryBuilder = new QueryBuilder();

              if (query) {
                queryBuilder.expression.add(query);
              }

              Simulate.query(env, {
                queryBuilder
              });
            });
          };

          it('should put the interface in waiting for first query mode during initialization', () => {
            expect(isInWaitingForQueryModeInitially()).toBe(true);
          });

          it('should put the interface in standard mode after the first non empty query is performed', async done => {
            expect(await isInWaitingForQueryModeAfterQuery('foo')).toBe(false);
            done();
          });

          it('should not put the interface in standard mode after the first empty query is performed', async done => {
            expect(await isInWaitingForQueryModeAfterQuery('')).toBe(true);
            done();
          });

          it('should allow to switch back to a waiting mode if a new empty query is performed', async done => {
            await isInWaitingForQueryModeAfterQuery('foo');
            expect(await isInWaitingForQueryModeAfterQuery('')).toBe(true);
            done();
          });

          it('should allow to switch back to standard mode after an empty query is performed', async done => {
            await isInWaitingForQueryModeAfterQuery('foo');
            await isInWaitingForQueryModeAfterQuery('');
            expect(await isInWaitingForQueryModeAfterQuery('bar')).toBe(false);
            done();
          });
        });
      });
    });
  });
}
