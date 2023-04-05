import * as Mock from '../MockEnvironment';
import { ResultList } from '../../src/ui/ResultList/ResultList';
import { registerCustomMatcher } from '../CustomMatchers';
import { FakeResults } from '../Fake';
import { ISimulateQueryData, Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';
import { ResultListEvents, IChangeLayoutEventArgs } from '../../src/events/ResultListEvents';
import { IResultListOptions } from '../../src/ui/ResultList/ResultListOptions';
import { UnderscoreTemplate } from '../../src/ui/Templates/UnderscoreTemplate';
import { ResultLayoutEvents } from '../../src/events/ResultLayoutEvents';
import { AdvancedComponentSetupOptions } from '../MockEnvironment';
import { TemplateList } from '../../src/ui/Templates/TemplateList';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { Defer } from '../../src/misc/Defer';
import { ResultLayoutSelector } from '../../src/ui/ResultLayoutSelector/ResultLayoutSelector';
import { ResultListUtils } from '../../src/utils/ResultListUtils';
import { QUERY_STATE_ATTRIBUTES } from '../../src/models/QueryStateModel';
import { Utils } from '../../src/utils/Utils';

export function ResultListTest() {
  describe('ResultList', () => {
    function waitForResultsToBeDisplayed() {
      return new Promise(resolve => $$(test.env.root).one(ResultListEvents.newResultsDisplayed, resolve));
    }

    async function simulateSearch(simulateQueryData?: Partial<ISimulateQueryData>) {
      const promise = waitForResultsToBeDisplayed();
      await (test.env.queryController.executeQuery as jasmine.Spy)(undefined, simulateQueryData);
      await promise;
    }

    async function simulateFetchMore() {
      const promise = waitForResultsToBeDisplayed();
      const results = await test.cmp.displayMoreResults(resultsPerPage);
      if (results) {
        await promise;
      }
    }

    function mockQueryControllerSearches() {
      function getSimulateQueryData(count?: number): Partial<ISimulateQueryData> {
        return {
          simulatedIndex: {
            results: FakeResults.createFakeResults(resultsPerPage * numberOfPages).results
          },
          numberOfResults: Utils.isNullOrUndefined(count) ? resultsPerPage : count
        };
      }

      (<jasmine.Spy>test.env.queryController.executeQuery).and.callFake(
        (_: undefined, simulateQueryData?: Partial<ISimulateQueryData>) =>
          Simulate.query(test.env, simulateQueryData || getSimulateQueryData()).promise
      );
      (<jasmine.Spy>test.env.queryController.fetchMore).and.callFake(
        (count: number) => Simulate.fetchMore(test.env, getSimulateQueryData(count)).promise
      );
    }

    let test: Mock.IBasicComponentSetup<ResultList>;
    const resultsPerPage = 10;
    const numberOfPages = 3;
    beforeEach(() => {
      test = Mock.basicComponentSetup<ResultList>(ResultList);
      registerCustomMatcher();
      mockQueryControllerSearches();
    });

    afterEach(() => {
      test = null;
    });

    describe('displayMoreResults', () => {
      beforeEach(async done => {
        // Fill the result list one time first, so we can have more results.
        await simulateSearch();
        done();
      });

      it('should stop asking for more results if consecutive calls are queued', async done => {
        await Promise.all([simulateFetchMore(), simulateFetchMore(), simulateFetchMore()]);
        expect(test.env.queryController.fetchMore).toHaveBeenCalledTimes(1);
        done();
      });

      it('should stop asking for more results if totalCount implies there are no more results left', async done => {
        await simulateFetchMore();
        await simulateFetchMore();
        await simulateFetchMore();
        expect(test.env.queryController.fetchMore).toHaveBeenCalledTimes(2);
        done();
      });

      it('should trigger 10 new result displayed event when fetching more results', async done => {
        const newResultSpy = jasmine.createSpy('newresultspy');
        $$(test.cmp.element).on(ResultListEvents.newResultDisplayed, newResultSpy);
        await simulateFetchMore();
        expect(newResultSpy).toHaveBeenCalledTimes(10);
        done();
      });

      it('should trigger a single new results displayed event when fetching more results', async done => {
        const newResultsSpy = jasmine.createSpy('newresultsspy');
        $$(test.cmp.element).on(ResultListEvents.newResultsDisplayed, newResultsSpy);
        await simulateFetchMore();
        expect(newResultsSpy).toHaveBeenCalledTimes(1);
        done();
      });

      it('should log an analytics event when more results are returned', async done => {
        await simulateFetchMore();
        expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.pagerScrolling,
          jasmine.any(Object),
          test.cmp.element
        );
        done();
      });

      describe('when infinite scrolling is enabled', () => {
        beforeEach(async done => {
          test = Mock.basicComponentSetup<ResultList>(ResultList, { enableInfiniteScroll: true, infiniteScrollPageSize: 1 });
          mockQueryControllerSearches();
          await simulateSearch();
          spyOn(test.cmp as any, 'isScrollingOfResultListAlmostAtTheBottom').and.returnValue(true);
          done();
        });

        it('should queue up another scroll when it receives results to fill up the container, if infinite scrolling is enabled', async done => {
          await simulateFetchMore();
          expect(test.env.queryController.fetchMore).toHaveBeenCalled();
          done();
        });

        it('should not queue up infinite amount of request if it is trying to fill up the scrolling container', async done => {
          async function waitForFetchingMoreResults() {
            const fetchingMoreResults = test.cmp['fetchingMoreResults'];
            if (!!fetchingMoreResults) {
              await fetchingMoreResults;
            } else {
              await Utils.resolveAfter(0);
              const newFetchingMoreResults = test.cmp['fetchingMoreResults'];
              if (!newFetchingMoreResults) {
                return;
              }
              await newFetchingMoreResults;
            }
            await waitForFetchingMoreResults();
          }

          test.cmp.displayMoreResults(resultsPerPage);
          await waitForFetchingMoreResults();
          // Once at the initial request, + 5 (ResultList.MAX_AMOUNT_OF_SUCESSIVE_REQUESTS)
          expect(test.env.queryController.fetchMore).toHaveBeenCalledTimes(6);
          done();
        });
      });
    });

    it('should tell if there are more results to display after a successful query', async done => {
      const results = FakeResults.createFakeResults(10, { totalCount: 11 });
      const queryBuilder = new QueryBuilder();
      queryBuilder.numberOfResults = 10;

      await simulateSearch({
        results,
        query: queryBuilder.build()
      });

      expect(test.cmp.hasPotentiallyMoreResultsToDisplay()).toBeTruthy();
      done();
    });

    it('should tell if there are no more results to display after a successful query with a limited amount of results returned', async done => {
      const results = FakeResults.createFakeResults(10, { totalCount: 10 });
      const queryBuilder = new QueryBuilder();
      queryBuilder.numberOfResults = 10;

      await simulateSearch({
        results,
        query: queryBuilder.build()
      });

      expect(test.cmp.hasPotentiallyMoreResultsToDisplay()).toBeFalsy();
      done();
    });

    it('should allow to return the currently displayed result', () => {
      expect(ResultList.resultCurrentlyBeingRendered).toBeNull();
      const data = FakeResults.createFakeResult();
      test.cmp.buildResult(data);
      expect(ResultList.resultCurrentlyBeingRendered).toBe(data);
    });

    it('should set currently displayed result to undefined when they are all rendered', done => {
      const data = FakeResults.createFakeResults(13);
      test.cmp.buildResults(data).then(() => {
        expect(ResultList.resultCurrentlyBeingRendered).toBeNull();
        done();
      });
    });

    it('should update the currentlyDisplayedResults when building a single result', done => {
      const data = FakeResults.createFakeResult();
      expect(test.cmp.getDisplayedResults().length).toEqual(0);
      test.cmp.buildResult(data).then(() => {
        expect(test.cmp.getDisplayedResults().length).toEqual(1);
        expect(test.cmp.getDisplayedResults()[0]).toEqual(data);
        done();
      });
    });

    it('should update the currentlyDisplayedResults when building multiple results', done => {
      const data = FakeResults.createFakeResults(5);
      expect(test.cmp.getDisplayedResults().length).toEqual(0);
      test.cmp.buildResults(data).then(() => {
        expect(test.cmp.getDisplayedResults().length).toEqual(5);
        expect(test.cmp.getDisplayedResults()[0]).toEqual(data.results[0]);
        expect(test.cmp.getDisplayedResults()[4]).toEqual(data.results[4]);
        done();
      });
    });

    it('should reset currently displayed on new query', done => {
      const data = FakeResults.createFakeResult();
      test.cmp.buildResult(data).then(() => {
        expect(ResultList.resultCurrentlyBeingRendered).toBe(data);
        Simulate.query(test.env);
        Defer.defer(() => {
          expect(ResultList.resultCurrentlyBeingRendered).toBeNull();
          done();
        });
      });
    });

    it('should allow to build a single result element', done => {
      const data = FakeResults.createFakeResult();
      test.cmp.buildResult(data).then(built => {
        expect(built).toBeDefined();
        const rs = $$(built).find('.CoveoResultLink');
        expect($$(rs).text()).toBe(data.title);
        done();
      });
    });

    it('should allow to build multiple results element', done => {
      const data = FakeResults.createFakeResults(13);
      test.cmp.buildResults(data).then(built => {
        expect(built.length).toBe(13);
        let rs = $$(built[0]).find('.CoveoResultLink');
        expect($$(rs).text()).toBe(data.results[0].title);
        rs = $$(built[12]).find('.CoveoResultLink');
        expect($$(rs).text()).toBe(data.results[12].title);
        done();
      });
    });

    it('should bind result on the HTMLElement', done => {
      const data = FakeResults.createFakeResults(13);
      test.cmp.buildResults(data).then(built => {
        expect(built[0]['CoveoResult']).toEqual(jasmine.objectContaining({ title: 'Title0' }));
        const jQuery = Simulate.addJQuery();
        test.cmp.buildResults(data).then(built2 => {
          expect(jQuery(built2[3]).data()).toEqual(jasmine.objectContaining({ title: 'Title3' }));
          Simulate.removeJQuery();
          done();
        });
      });
    });

    it('should allow to render results inside the result list', done => {
      const data = FakeResults.createFakeResults(13);
      test.cmp
        .buildResults(data)
        .then(elem => test.cmp.renderResults(elem))
        .then(() => {
          expect($$(test.cmp.element).findAll('.CoveoResult').length).toBe(13);
          done();
        });
    });

    it('should allow to render results and append them', done => {
      const data = FakeResults.createFakeResults(13);
      test.cmp
        .buildResults(data)
        .then(elem => test.cmp.renderResults(elem))
        .then(() => test.cmp.buildResults(data))
        .then(elem => test.cmp.renderResults(elem, true))
        .then(() => {
          expect($$(test.cmp.element).findAll('.CoveoResult').length).toBe(26);
          done();
        });
    });

    it('should allow to render results and not append them', done => {
      const data = FakeResults.createFakeResults(13);
      test.cmp
        .buildResults(data)
        .then(elem => test.cmp.renderResults(elem))
        .then(() => test.cmp.buildResults(data))
        .then(elem => test.cmp.renderResults(elem, false))
        .then(() => {
          expect($$(test.cmp.element).findAll('.CoveoResult').length).toBe(13);
          done();
        });
    });

    it('should trigger result displayed event when rendering', done => {
      const data = FakeResults.createFakeResults(6);
      const spyResult = jasmine.createSpy('spyResult');
      const spyResults = jasmine.createSpy('spyResults');
      $$(test.cmp.element).on(ResultListEvents.newResultDisplayed, spyResult);
      $$(test.cmp.element).on(ResultListEvents.newResultsDisplayed, spyResults);
      test.cmp
        .buildResults(data)
        .then(elem => test.cmp.renderResults(elem))
        .then(() => {
          expect(spyResult).toHaveBeenCalledTimes(6);
          expect(spyResults).toHaveBeenCalledTimes(1);
          expect(spyResults).toHaveBeenCalledWith(
            jasmine.any(CustomEvent),
            jasmine.objectContaining({
              isInfiniteScrollEnabled: false
            })
          );
          done();
        });
    });

    it('should trigger results displayed event with isInfiniteScrollEnabled set to true if enableInfiniteScroll is true', async done => {
      const data = FakeResults.createFakeResults(6);
      const spyResults = jasmine.createSpy('spyResults');
      test.cmp.options.enableInfiniteScroll = true;
      $$(test.cmp.element).on(ResultListEvents.newResultsDisplayed, spyResults);

      const results = await test.cmp.buildResults(data);
      await test.cmp.renderResults(results);

      expect(spyResults).toHaveBeenCalledWith(
        jasmine.any(CustomEvent),
        jasmine.objectContaining({
          isInfiniteScrollEnabled: true
        })
      );
      done();
    });

    it('should render itself correctly after a full query', done => {
      const spyResult = jasmine.createSpy('spyResult');
      const spyResults = jasmine.createSpy('spyResults');
      $$(test.cmp.element).on(ResultListEvents.newResultDisplayed, spyResult);
      $$(test.cmp.element).on(ResultListEvents.newResultsDisplayed, spyResults);
      Simulate.query(test.env);
      Defer.defer(() => {
        expect(test.cmp.getDisplayedResults().length).toBe(10);
        expect(test.cmp.getDisplayedResultsElements().length).toBe(10);
        expect(spyResult).toHaveBeenCalledTimes(10);
        expect(spyResults).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should clear itself on query error', done => {
      Simulate.query(test.env);
      Defer.defer(() => {
        expect(test.cmp.getDisplayedResults().length).toBe(10);
        expect(test.cmp.getDisplayedResultsElements().length).toBe(10);
        Simulate.query(test.env, {
          error: {
            message: 'oh noes',
            type: 'very bad',
            name: 'oh noes very bad'
          }
        });
        Defer.defer(() => {
          expect(test.cmp.getDisplayedResults().length).toBe(0);
          expect(test.cmp.getDisplayedResultsElements().length).toBe(0);
          done();
        });
      });
    });

    it('should add and remove a hidden css class on enable/disable', () => {
      test.cmp.disable();
      expect($$(test.cmp.element).hasClass('coveo-hidden')).toBe(true);
      test.cmp.enable();
      expect($$(test.cmp.element).hasClass('coveo-hidden')).toBe(false);
    });

    it('enableScrollBackTop should be set', () => {
      test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
        enableScrollToTop: false
      });
      expect(test.cmp.options.enableScrollToTop).toBe(false);
    });

    describe(`when triggering a layout change event with one result`, () => {
      const layout = 'list';

      const showIfQuery = $$('div', { className: 'coveo-show-if-query' });
      const showIfNoQuery = $$('div', { className: 'coveo-show-if-no-query' });
      const showIfResults = $$('div', { className: 'coveo-show-if-results' });
      const showIfNoResults = $$('div', { className: 'coveo-show-if-no-results' });

      function triggerLayoutChange() {
        const changeLayoutArgs: IChangeLayoutEventArgs = { layout, results: FakeResults.createFakeResults(1) };
        $$(test.env.root).trigger(ResultListEvents.changeLayout, changeLayoutArgs);
      }

      beforeEach(() => {
        test.cmp.options.layout = layout;

        const nodes = [showIfQuery, showIfNoQuery, showIfResults, showIfNoResults];
        nodes.forEach(node => test.cmp.element.appendChild(node.el));

        triggerLayoutChange();
      });

      it(`should add "display: block" style to the showIfQuery element`, done => {
        Defer.defer(() => {
          expect(showIfQuery.el.style.display).toBe('block');
          done();
        });
      });

      it(`should add "display: none" style to the showIfNoQuery element`, done => {
        Defer.defer(() => {
          expect(showIfNoQuery.el.style.display).toBe('none');
          done();
        });
      });

      it(`should add "display: block" style to the showIfResults element`, done => {
        Defer.defer(() => {
          expect(showIfResults.el.style.display).toBe('block');
          done();
        });
      });

      it(`should add "display: none" style to the showIfNoResults element`, done => {
        Defer.defer(() => {
          expect(showIfNoResults.el.style.display).toBe('none');
          done();
        });
      });
    });

    it(`when triggering a query,
    it should hide and show specific css class correctly`, done => {
      const showIfQuery = $$('div', {
        className: 'coveo-show-if-query'
      });
      const showIfNoQuery = $$('div', {
        className: 'coveo-show-if-no-query'
      });
      const showIfResults = $$('div', {
        className: 'coveo-show-if-results'
      });
      const showIfNoResults = $$('div', {
        className: 'coveo-show-if-no-results'
      });

      test.cmp.element.appendChild(showIfQuery.el);
      test.cmp.element.appendChild(showIfNoQuery.el);
      test.cmp.element.appendChild(showIfResults.el);
      test.cmp.element.appendChild(showIfNoResults.el);

      const withAQuery = new QueryBuilder();
      withAQuery.expression.add('foo');

      Simulate.query(test.env, {
        query: withAQuery.build()
      });

      Defer.defer(() => {
        expect(showIfQuery.el.style.display).toBe('block');
        expect(showIfNoQuery.el.style.display).toBe('none');

        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(0)
        });

        Defer.defer(() => {
          expect(showIfResults.el.style.display).toBe('none');
          expect(showIfNoResults.el.style.display).toBe('block');

          Simulate.query(test.env, {
            results: FakeResults.createFakeResults(10)
          });
          Defer.defer(() => {
            expect(showIfResults.el.style.display).toBe('block');
            expect(showIfNoResults.el.style.display).toBe('none');
            done();
          });
        });
      });
    });

    it('should not ask for more data when infiniteScrolling is enable and the container is not a window', () => {
      const infiniteScrollContainer = $$('div');
      infiniteScrollContainer.setAttribute('style', 'height: 400px;');
      const option: IResultListOptions = {
        enableInfiniteScroll: true,
        infiniteScrollContainer: infiniteScrollContainer.el
      };
      test = Mock.basicComponentSetup<ResultList>(ResultList, option);
      spyOn(test.cmp, 'displayMoreResults');
      Simulate.query(test.env);
      expect(test.cmp.displayMoreResults).not.toHaveBeenCalled();
    });

    describe('exposes options', () => {
      it('resultContainer allow to specify where to render results', done => {
        const aNewContainer = document.createElement('div');
        expect(aNewContainer.children.length).toBe(0);
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          resultsContainer: aNewContainer
        });
        Simulate.query(test.env);
        Defer.defer(() => {
          expect(aNewContainer.children.length).toBe(10);
          done();
        });
      });

      it(`when "data-result-container-selector" attribute is set,
      it appends the result list to the element with the selector`, done => {
        const selector = 'mycontainer';
        const root = document.createElement('div');
        const target = $$('div', { id: selector });

        const resultList = $$('div', {
          className: 'CoveoResultList',
          'data-result-container-selector': `#${selector}`
        });

        root.appendChild(target.el);
        root.appendChild(resultList.el);

        document.body.appendChild(root);
        test = Mock.advancedComponentSetup<ResultList>(ResultList, <Mock.AdvancedComponentSetupOptions>{ element: resultList.el });
        document.body.removeChild(root);

        Simulate.query(test.env);

        setTimeout(() => {
          expect(target.el.children.length).toBe(10);
          done();
        }, 0);
      });

      it('should get the minimal amount of fields to include when the option is true', () => {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          autoSelectFieldsToInclude: true
        });

        const simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().fieldsToInclude).toEqual(
          jasmine.arrayContaining(['author', 'language', 'urihash', 'objecttype', 'collection', 'source', 'language', 'permanentid'])
        );
      });

      it('should allow to get the auto select fields to include', () => {
        expect(test.cmp.getAutoSelectedFieldsToInclude()).toEqual(
          jasmine.arrayContaining(['author', 'language', 'urihash', 'objecttype', 'collection', 'source', 'language', 'permanentid'])
        );
      });

      it('should call auto select fields to include on other result list', () => {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          autoSelectFieldsToInclude: true
        });

        const otherResultList = Mock.mockComponent<ResultList>(ResultList);
        (test.env.searchInterface.getComponents as jasmine.Spy).and.returnValue([otherResultList]);

        Simulate.query(test.env);
        expect(otherResultList.getAutoSelectedFieldsToInclude).toHaveBeenCalled();
      });

      it('should not throw when finding auto select fields to include on another result list that is not initialized ', () => {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          autoSelectFieldsToInclude: true
        });

        const otherResultList = Mock.mockComponent<ResultList>(ResultList);
        otherResultList.element = document.createElement('div');
        $$(otherResultList.element).addClass('CoveoResultList');
        $$(test.env.root).append(otherResultList.element);
        expect(() => Simulate.query(test.env)).not.toThrow();
      });

      it('resultTemplate allow to specify a template manually', done => {
        const tmpl: UnderscoreTemplate = Mock.mock<UnderscoreTemplate>(UnderscoreTemplate);
        const asSpy = <any>tmpl;
        asSpy.instantiateToElement.and.returnValue(new Promise(resolve => resolve(document.createElement('div'))));
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          resultTemplate: tmpl
        });
        Simulate.query(test.env);
        Defer.defer(() => {
          expect(tmpl.instantiateToElement).toHaveBeenCalledTimes(10);
          done();
        });
      });

      it('waitAnimation allow to specify a different animation such as spin or fade', () => {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          waitAnimation: 'fade'
        });

        Simulate.query(test.env, {
          callbackDuringQuery: () => {
            expect($$(test.cmp.options.waitAnimationContainer).hasClass('coveo-fade-out')).toBe(true);
          },
          callbackAfterQuery: () => {
            expect($$(test.cmp.options.waitAnimationContainer).hasClass('coveo-fade-out')).not.toBe(true);
          }
        });

        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          waitAnimation: 'spinner'
        });

        Simulate.query(test.env, {
          callbackDuringQuery: () => {
            expect($$(test.cmp.options.waitAnimationContainer).find('.coveo-loading-spinner')).toBeDefined();
          },
          callbackAfterQuery: () => {
            expect($$(test.cmp.options.waitAnimationContainer).find('.coveo-loading-spinner')).toBeNull();
          }
        });
      });

      it('waitAnimationContainer allow to specify where to display the animation', () => {
        const aNewContainer = document.createElement('div');
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          waitAnimation: 'fade',
          waitAnimationContainer: aNewContainer
        });
        Simulate.query(test.env, {
          callbackDuringQuery: () => {
            expect($$(aNewContainer).hasClass('coveo-fade-out')).toBe(true);
          }
        });
      });

      it('enableInfiniteScroll allow to enable infinite scrolling', async done => {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          enableInfiniteScroll: false
        });
        mockQueryControllerSearches();
        await simulateSearch();
        expect(test.env.queryController.fetchMore).not.toHaveBeenCalled();

        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          enableInfiniteScroll: true
        });
        mockQueryControllerSearches();
        await simulateSearch();
        expect(test.env.queryController.fetchMore).toHaveBeenCalled();
        done();
      });

      it('infiniteScrollPageSize allow to specify the number of result to fetch when scrolling', async done => {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          enableInfiniteScroll: true,
          infiniteScrollPageSize: 26
        });
        mockQueryControllerSearches();
        await simulateSearch();
        expect(test.env.queryController.fetchMore).toHaveBeenCalledWith(26);
        done();
      });

      it('fieldsToInclude allow to specify an array of fields to include in the query', () => {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          fieldsToInclude: ['@field1', '@field2', '@field3']
        });
        const simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.fieldsToInclude).toContain('field1');
        expect(simulation.queryBuilder.fieldsToInclude).toContain('field2');
        expect(simulation.queryBuilder.fieldsToInclude).toContain('field3');
      });

      describe('layout', () => {
        it('should correctly listen to populateResultLayout', () => {
          test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
            layout: 'card'
          });
          const layoutsPopulated = [];
          $$(test.env.root).trigger(ResultLayoutEvents.populateResultLayout, { layouts: layoutsPopulated });
          expect(layoutsPopulated).toEqual(jasmine.arrayContaining(['card']));
        });

        it('should set the correct layout on each child template if it contains a TemplateList', () => {
          const elem = $$('div', {
            className: 'CoveoResultList'
          });
          const scriptOne = $$('script', {
            className: 'result-template',
            type: 'text/html'
          });
          const scriptTwo = $$('script', {
            className: 'result-template',
            type: 'text/html'
          });
          elem.append(scriptOne.el);
          elem.append(scriptTwo.el);
          test = Mock.advancedComponentSetup<ResultList>(
            ResultList,
            new AdvancedComponentSetupOptions(elem.el, {
              layout: 'card'
            })
          );

          expect(test.cmp.options.resultTemplate instanceof TemplateList).toBe(true);
          expect((<TemplateList>test.cmp.options.resultTemplate).templates[0].layout).toBe('card');
          expect((<TemplateList>test.cmp.options.resultTemplate).templates[1].layout).toBe('card');
        });

        it("should add 3 empty div at the end of the results when it's a card template and infinite scroll is not enabled", done => {
          test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
            layout: 'card',
            enableInfiniteScroll: false
          });
          Simulate.query(test.env);
          Defer.defer(() => {
            const container = test.cmp.options.resultsContainer;
            expect(container.children.item(container.children.length - 1).innerHTML).toBe('');
            expect(container.children.item(container.children.length - 2).innerHTML).toBe('');
            expect(container.children.item(container.children.length - 3).innerHTML).toBe('');
            expect(container.children.item(container.children.length - 4).innerHTML).not.toBe('');
            done();
          });
        });

        it('should react to change layout event', () => {
          test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
            layout: 'card'
          });
          $$(test.env.root).trigger(ResultListEvents.changeLayout, {
            layout: 'list',
            results: FakeResults.createFakeResults()
          });
          expect($$(test.cmp.element).hasClass('coveo-hidden')).toBe(true);
          $$(test.env.root).trigger(ResultListEvents.changeLayout, {
            layout: 'card',
            results: FakeResults.createFakeResults()
          });
          expect($$(test.cmp.element).hasClass('coveo-hidden')).toBe(false);
        });

        describe('when it is disabled', () => {
          let mockResultLayoutSelector;

          beforeEach(() => {
            test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
              layout: 'card'
            });
            mockResultLayoutSelector = Mock.mock<ResultLayoutSelector>(ResultLayoutSelector);
          });

          const addAnotherResultListInTheInterface = layout => {
            const mockOtherResultList = Mock.mock<ResultList>(ResultList);
            mockOtherResultList.options = { layout };
            return mockOtherResultList;
          };

          it('should disable the layout in the layout selector', () => {
            (test.env.searchInterface.getComponents as jasmine.Spy).and.callFake(cmp => {
              if (cmp == 'ResultLayoutSelector') {
                return [mockResultLayoutSelector];
              }
              return [];
            });
            test.cmp.disable();
            expect(mockResultLayoutSelector.disableLayouts).toHaveBeenCalledWith(['card']);
          });

          it('should not disable the layout selector if there are other result list using the same layout', () => {
            (test.env.searchInterface.getComponents as jasmine.Spy).and.callFake(cmp => {
              if (cmp == 'ResultLayoutSelector') {
                return [mockResultLayoutSelector];
              } else if (cmp == 'ResultList') {
                return [test.cmp, addAnotherResultListInTheInterface('card')];
              }
              return [];
            });
            test.cmp.disable();
            expect(mockResultLayoutSelector.disableLayouts).not.toHaveBeenCalled();
          });

          it('should disable the layout selector if there are other result list using different layout', () => {
            (test.env.searchInterface.getComponents as jasmine.Spy).and.callFake(cmp => {
              if (cmp == 'ResultLayoutSelector') {
                return [mockResultLayoutSelector];
              } else if (cmp == 'ResultList') {
                return [test.cmp, addAnotherResultListInTheInterface('list')];
              }
              return [];
            });
            test.cmp.disable();
            expect(mockResultLayoutSelector.disableLayouts).toHaveBeenCalledWith(['card']);
          });

          it('should not disable the layout when the end user is simply switching layouts', () => {
            (test.env.searchInterface.getComponents as jasmine.Spy).and.callFake(cmp => {
              if (cmp == 'ResultLayoutSelector') {
                return [mockResultLayoutSelector];
              } else if (cmp == 'ResultList') {
                return [test.cmp, addAnotherResultListInTheInterface('list')];
              }
              return [];
            });

            $$(test.env.root).trigger(ResultListEvents.changeLayout, {
              layout: 'list',
              results: FakeResults.createFakeResults()
            });
            expect(mockResultLayoutSelector.disableLayouts).not.toHaveBeenCalled();
          });
        });

        describe('when it is enabled', () => {
          let mockResultLayoutSelector: ResultLayoutSelector;

          const setCurrentActiveLayouts = (layout: Record<string, {}>) => {
            (mockResultLayoutSelector as any).activeLayouts = layout;
          };

          beforeEach(() => {
            test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
              layout: 'card'
            });
            mockResultLayoutSelector = Mock.mock<ResultLayoutSelector>(ResultLayoutSelector);
            (test.env.searchInterface.getComponents as jasmine.Spy).and.callFake(requested => {
              if (requested === ResultLayoutSelector.ID) {
                return [mockResultLayoutSelector];
              }
              return [];
            });
          });

          it('should enable the layout in the layout selector', () => {
            setCurrentActiveLayouts({ card: {} });
            test.cmp.options.layout = 'card';
            test.cmp.enable();
            expect(mockResultLayoutSelector.enableLayouts).toHaveBeenCalledWith(['card']);
          });

          it('should not be enabled when it does not fit current layout', () => {
            setCurrentActiveLayouts({ card: {} });
            test.cmp.options.layout = 'table';
            test.cmp.disable();
            expect(test.cmp.disabled).toBe(true);
            test.cmp.enable();
            expect(test.cmp.disabled).toBe(true);
          });
        });

        describe('scroll to top feature', () => {
          let scrollToTopSpy: jasmine.Spy;

          const setupResultList = (options: Partial<IResultListOptions> = {}) => {
            const test = Mock.advancedComponentSetup<ResultList>(ResultList, <Mock.AdvancedComponentSetupOptions>{
              cmpOptions: {
                infiniteScrollContainer: document.createElement('div'),
                ...options
              },
              modifyBuilder: builder => {
                return builder.withLiveQueryStateModel();
              }
            });
            return test;
          };

          beforeEach(() => {
            jasmine.clock().install();
            scrollToTopSpy = spyOn(ResultListUtils, 'scrollToTop');
          });

          afterEach(() => {
            jasmine.clock().uninstall();
          });

          it(`when enableScrollToTop is true and enableInfiniteScroll is false
          should scroll to top ONCE when page changes and a query is executed`, done => {
            test = setupResultList({ enableScrollToTop: true, enableInfiniteScroll: false });

            test.cmp.queryStateModel.set(QUERY_STATE_ATTRIBUTES.FIRST, 11);
            Simulate.query(test.env);
            jasmine.clock().tick(0);
            Simulate.query(test.env);
            jasmine.clock().tick(0);

            expect(scrollToTopSpy).toHaveBeenCalledTimes(1);

            done();
          });

          it(`when enableScrollToTop is true and enableInfiniteScroll is true
          should scroll to top on every query success`, done => {
            test = setupResultList({ enableScrollToTop: true, enableInfiniteScroll: true });

            Simulate.query(test.env);
            jasmine.clock().tick(0);
            Simulate.query(test.env);
            jasmine.clock().tick(0);

            expect(scrollToTopSpy).toHaveBeenCalledTimes(2);

            done();
          });

          it(`when enableScrollToTop is false and enableInfiniteScroll is false
          should not scroll to top after a query and a page change is executed`, done => {
            test = setupResultList({ enableScrollToTop: false, enableInfiniteScroll: false });

            test.cmp.queryStateModel.set(QUERY_STATE_ATTRIBUTES.FIRST, 11);
            Simulate.query(test.env);
            jasmine.clock().tick(0);

            expect(scrollToTopSpy).not.toHaveBeenCalled();

            done();
          });
        });
      });
    });
  });
}
