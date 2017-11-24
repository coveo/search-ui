/// <reference path="../../lib/jasmine/index.d.ts" />
import * as Mock from '../MockEnvironment';
import { SearchInterface } from '../../src/ui/SearchInterface/SearchInterface';
import { QueryController } from '../../src/controllers/QueryController';
import { QueryStateModel } from '../../src/models/QueryStateModel';
import { ComponentOptionsModel } from '../../src/models/ComponentOptionsModel';
import { ComponentStateModel } from '../../src/models/ComponentStateModel';
import { Querybox } from '../../src/ui/Querybox/Querybox';
import { $$ } from '../../src/utils/Dom';
import { QueryEvents, IDoneBuildingQueryEventArgs } from '../../src/events/QueryEvents';
import { Component } from '../../src/ui/Base/Component';
import { HistoryController } from '../../src/controllers/HistoryController';
import { LocalStorageHistoryController } from '../../src/controllers/LocalStorageHistoryController';
import { Simulate } from '../Simulate';
import { Debug } from '../../src/ui/Debug/Debug';
import { FakeResults } from '../Fake';
import _ = require('underscore');
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { PipelineContext } from '../../src/ui/PipelineContext/PipelineContext';

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

    describe('usage analytics', () => {
      let searchInterfaceDiv: HTMLDivElement;
      let analyticsDiv: HTMLDivElement;

      beforeEach(() => {
        searchInterfaceDiv = document.createElement('div');
        analyticsDiv = document.createElement('div');
        analyticsDiv.className = 'CoveoAnalytics';
      });

      afterEach(() => {
        searchInterfaceDiv = null;
        analyticsDiv = null;
      });

      it('should initialize if found inside the root', () => {
        searchInterfaceDiv.appendChild(analyticsDiv);
        const searchInterface = new SearchInterface(searchInterfaceDiv);
        expect(searchInterface.usageAnalytics instanceof Coveo['LiveAnalyticsClient']).toBe(true);
      });
    });

    it('should set the correct css class on facet section, if available', () => {
      const facetSection = $$('div', { className: 'coveo-facet-column' });
      cmp.element.appendChild(facetSection.el);

      $$(cmp.element).trigger(QueryEvents.querySuccess, {
        results: FakeResults.createFakeResults(0)
      });
      expect(facetSection.hasClass('coveo-no-results')).toBe(true);

      $$(cmp.element).trigger(QueryEvents.querySuccess, {
        results: FakeResults.createFakeResults(10)
      });
      expect(facetSection.hasClass('coveo-no-results')).toBe(false);

      $$(cmp.element).trigger(QueryEvents.queryError);
      expect(facetSection.hasClass('coveo-no-results')).toBe(true);

      $$(cmp.element).trigger(QueryEvents.querySuccess, {
        results: FakeResults.createFakeResults(10)
      });
      expect(facetSection.hasClass('coveo-no-results')).toBe(false);
    });

    it('should set the correct css class on result section, if available', () => {
      const resultsSection = $$('div', { className: 'coveo-results-column' });

      cmp.element.appendChild(resultsSection.el);
      $$(cmp.element).trigger(QueryEvents.querySuccess, {
        results: FakeResults.createFakeResults(0)
      });
      expect(resultsSection.hasClass('coveo-no-results')).toBe(true);

      $$(cmp.element).trigger(QueryEvents.querySuccess, {
        results: FakeResults.createFakeResults(10)
      });

      expect(resultsSection.hasClass('coveo-no-results')).toBe(false);

      $$(cmp.element).trigger(QueryEvents.queryError);

      expect(resultsSection.hasClass('coveo-no-results')).toBe(true);

      $$(cmp.element).trigger(QueryEvents.querySuccess, {
        results: FakeResults.createFakeResults(10)
      });

      expect(resultsSection.hasClass('coveo-no-results')).toBe(false);
    });

    it('should set the correct css class on recommendation section, if available', () => {
      const recommendationSection = $$('div', { className: 'coveo-recommendation-main-section' });

      cmp.element.appendChild(recommendationSection.el);

      $$(cmp.element).trigger(QueryEvents.querySuccess, {
        results: FakeResults.createFakeResults(0)
      });

      expect(recommendationSection.hasClass('coveo-no-results')).toBe(true);
      $$(cmp.element).trigger(QueryEvents.querySuccess, {
        results: FakeResults.createFakeResults(10)
      });

      expect(recommendationSection.hasClass('coveo-no-results')).toBe(false);
      $$(cmp.element).trigger(QueryEvents.queryError);

      expect(recommendationSection.hasClass('coveo-no-results')).toBe(true);
      $$(cmp.element).trigger(QueryEvents.querySuccess, {
        results: FakeResults.createFakeResults(10)
      });

      expect(recommendationSection.hasClass('coveo-no-results')).toBe(false);
    });

    describe('with an environment', () => {
      let div: HTMLDivElement;
      let mockWindow: Window;
      let env: Mock.IMockEnvironment;

      beforeEach(() => {
        div = document.createElement('div');
        env = new Mock.MockEnvironmentBuilder().withRoot(div).build();
        mockWindow = Mock.mockWindow();
      });

      afterEach(() => {
        div = null;
        env = null;
        mockWindow = null;
      });

      it('should return undefined if no query context exists', () => {
        new SearchInterface(div, undefined, undefined, mockWindow);
        expect(cmp.getQueryContext()).toBeUndefined();
      });

      it('should allow to retrieve the context after a query', () => {
        const queryBuilder = new QueryBuilder();
        queryBuilder.addContextValue('123', 456);
        cmp.queryController.getLastQuery = () => queryBuilder.build();
        Simulate.query(env, {
          query: queryBuilder.build()
        });
        expect(cmp.getQueryContext()).toEqual({ '123': 456 });
      });

      it('should allow to retrieve the context from a PipelineContext if present', () => {
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
          const cmp = new SearchInterface(
            div,
            {
              enableHistory: true
            },
            undefined,
            mockWindow
          );
          expect(Component.resolveBinding(cmp.element, HistoryController)).toBeDefined();
        });

        it("enableHistory can be disabled and won't save history in the url", () => {
          const cmp = new SearchInterface(
            div,
            {
              enableHistory: false
            },
            undefined,
            mockWindow
          );
          expect(Component.resolveBinding(cmp.element, HistoryController)).toBeUndefined();
        });

        it('useLocalStorageForHistory allow to use local storage for history', () => {
          const cmp = new SearchInterface(
            div,
            {
              enableHistory: true,
              useLocalStorageForHistory: true
            },
            undefined,
            mockWindow
          );
          expect(Component.resolveBinding(cmp.element, HistoryController)).toBeUndefined();
          expect(Component.resolveBinding(cmp.element, LocalStorageHistoryController)).toBeDefined();
        });

        it('useLocalStorageForHistory allow to use local storage for history, but not if history is disabled', () => {
          const cmp = new SearchInterface(
            div,
            {
              enableHistory: false,
              useLocalStorageForHistory: true
            },
            undefined,
            mockWindow
          );
          expect(Component.resolveBinding(cmp.element, HistoryController)).toBeUndefined();
          expect(Component.resolveBinding(cmp.element, LocalStorageHistoryController)).toBeUndefined();
        });

        it('resultsPerPage allow to specify the number of results in query', () => {
          new SearchInterface(div, { resultsPerPage: 123 }, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.numberOfResults).toBe(123);
        });

        it('resultsPerPage should be 10 by default', () => {
          new SearchInterface(div, undefined, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.numberOfResults).toBe(10);
        });

        it('excerptLength allow to specify the excerpt length of results in a query', () => {
          new SearchInterface(
            div,
            {
              excerptLength: 123
            },
            undefined,
            mockWindow
          );
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.excerptLength).toBe(123);
        });

        it('excerptLength should be 200 by default', () => {
          new SearchInterface(div, undefined, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.excerptLength).toBe(200);
        });

        it('expression allow to specify and advanced expression to add to the query', () => {
          new SearchInterface(div, { expression: 'foobar' }, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.constantExpression.build()).toBe('foobar');
        });

        it('expression should not be added if empty', () => {
          new SearchInterface(div, { expression: '' }, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.constantExpression.build()).toBeUndefined();
        });

        it('expression should be empty by default', () => {
          new SearchInterface(div, undefined, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.constantExpression.build()).toBeUndefined();
        });

        it('filterField allow to specify a filtering field', () => {
          new SearchInterface(div, { filterField: '@foobar' }, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.filterField).toBe('@foobar');
        });

        it('filterField should be empty by default', () => {
          new SearchInterface(div, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.filterField).toBeUndefined();
        });

        it('timezone allow to specify a timezone in the query', () => {
          new SearchInterface(div, { timezone: 'aa-bb' }, undefined, mockWindow);
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
          _.defer(() => {
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
          _.defer(() => {
            expect(Component.resolveBinding(cmp.element, Debug)).toBeUndefined();
            done();
          });
        });

        it('enableCollaborativeRating allow to specify the collaborative rating in the query', () => {
          new SearchInterface(div, { enableCollaborativeRating: true }, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.enableCollaborativeRating).toBe(true);
        });

        it('enableCollaborativeRating to false allow to disable the collaborative rating in the query', () => {
          new SearchInterface(div, { enableCollaborativeRating: false }, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.enableCollaborativeRating).toBe(false);
        });

        it('enableDuplicateFiltering allow to filter duplicate in the query', () => {
          new SearchInterface(div, { enableDuplicateFiltering: true }, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.enableDuplicateFiltering).toBe(true);
        });

        it('enableDuplicateFiltering to false allow to disable the filter duplicate in the query', () => {
          new SearchInterface(div, { enableDuplicateFiltering: false }, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.enableDuplicateFiltering).toBe(false);
        });

        it('pipeline allow to specify the pipeline to use in a query', () => {
          new SearchInterface(div, { pipeline: 'foobar' }, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.pipeline).toBe('foobar');
        });

        it('maximumAge allow to specify the duration of the cache in a query', () => {
          new SearchInterface(div, { maximumAge: 123 }, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.maximumAge).toBe(123);
        });
      });

      describe('when allowQueriesWithoutKeywords if true', () => {
        beforeEach(() => {
          new SearchInterface(div, { allowQueriesWithoutKeywords: true }, undefined, mockWindow);
        });

        it('it does not cancel the query if there are no keywords', done => {
          $$(div).on(QueryEvents.doneBuildingQuery, (e, args: IDoneBuildingQueryEventArgs) => {
            expect(args.cancel).toBe(false);
            done();
          });
          Simulate.query(env);
        });

        it('allowQueriesWithoutKeywords to true should be sent as a flag in the query', () => {
          new SearchInterface(div, { allowQueriesWithoutKeywords: true }, undefined, mockWindow);
          const simulation = Simulate.query(env);
          expect(simulation.queryBuilder.build().allowQueriesWithoutKeywords).toBe(true);
        });
      });

      describe('when allowQueriesWithoutKeywords if false', () => {
        beforeEach(() => {
          new SearchInterface(div, { allowQueriesWithoutKeywords: false }, undefined, mockWindow);
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
      });
    });
  });
}
