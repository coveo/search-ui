import * as Mock from '../MockEnvironment';
import { ResultList } from '../../src/ui/ResultList/ResultList';
import { registerCustomMatcher } from '../CustomMatchers';
import { FakeResults } from '../Fake';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';
import { ResultListEvents } from '../../src/events/ResultListEvents';
import { IResultListOptions } from '../../src/ui/ResultList/ResultList';
import { UnderscoreTemplate } from '../../src/ui/Templates/UnderscoreTemplate';
import { ResultLayoutEvents } from '../../src/events/ResultLayoutEvents';
import { AdvancedComponentSetupOptions } from '../MockEnvironment';
import { TemplateList } from '../../src/ui/Templates/TemplateList';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { IQueryResults } from '../../src/rest/QueryResults';
import { Defer } from '../../src/misc/Defer';

export function ResultListTest() {
  describe('ResultList', () => {
    let test: Mock.IBasicComponentSetup<ResultList>;

    beforeEach(() => {
      test = Mock.basicComponentSetup<ResultList>(ResultList);
      registerCustomMatcher();
    });

    afterEach(() => {
      test = null;
    });

    describe('displayMoreResults', () => {
      beforeEach(() => {
        // Fill the result list one time first, so we can have more results.
        Simulate.query(test.env);
      });

      describe('when returning less than 10 results', () => {
        let promiseResults: Promise<IQueryResults>;
        beforeEach(() => {
          promiseResults = new Promise((resolve, reject) => {
            resolve(FakeResults.createFakeResults(5));
          });

          (<jasmine.Spy>test.env.queryController.fetchMore).and.returnValue(promiseResults);
        });

        it('should stop asking for more results if consecutive calls are queued', done => {
          Defer.defer(() => {
            test.cmp.displayMoreResults(10);
            test.cmp.displayMoreResults(10);
            test.cmp.displayMoreResults(10);
            expect(test.env.queryController.fetchMore).toHaveBeenCalledTimes(1);
            done();
          });
        });

        it('should stop asking for more results if less results than requested are returned', done => {
          Defer.defer(() => {
            test.cmp.displayMoreResults(10);
            promiseResults.then(() => {
              test.cmp.displayMoreResults(10);
              expect(test.env.queryController.fetchMore).toHaveBeenCalledTimes(1);
              done();
            });
          });
        });
      });

      describe('when returning 10 or more results', () => {
        let promiseResults: Promise<IQueryResults>;
        beforeEach(() => {
          promiseResults = new Promise((resolve, reject) => {
            resolve(FakeResults.createFakeResults(10));
          });

          (<jasmine.Spy>test.env.queryController.fetchMore).and.returnValue(promiseResults);
        });

        afterEach(() => {
          promiseResults = null;
        });

        it('should trigger 10 new result displayed event when fetching more results', done => {
          const newResultSpy = jasmine.createSpy('newresultspy');
          $$(test.cmp.element).on(ResultListEvents.newResultDisplayed, newResultSpy);
          Defer.defer(() => {
            test.cmp.displayMoreResults(10).then(() => {
              expect(newResultSpy).toHaveBeenCalledTimes(10);
              done();
            });
          });
        });

        it('should trigger a single new results displayed event when fetching more results', done => {
          const newResultsSpy = jasmine.createSpy('newresultsspy');
          $$(test.cmp.element).on(ResultListEvents.newResultsDisplayed, newResultsSpy);

          Defer.defer(() => {
            test.cmp.displayMoreResults(10).then(() => {
              expect(newResultsSpy).toHaveBeenCalledTimes(1);
              done();
            });
          });
        });

        it('should log an analytics event when more results are returned', done => {
          Defer.defer(() => {
            test.cmp.displayMoreResults(10).then(() => {
              expect(test.env.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
                analyticsActionCauseList.pagerScrolling,
                jasmine.any(Object),
                test.cmp.element
              );
              done();
            });
          });
        });

        it('should queue up another scroll when it receives results to fill up the container, if infinite scrolling is enabled', done => {
          test.cmp.options.enableInfiniteScroll = true;
          Defer.defer(() => {
            test.cmp.displayMoreResults(10);
            promiseResults.then(() => {
              setTimeout(() => {
                expect(test.env.queryController.fetchMore).toHaveBeenCalled();
                done();
              }, 1000);
            });
          });
        });

        it('should not queue up infinite amount of request if it is trying to fill up the scrolling container', done => {
          test.cmp.options.enableInfiniteScroll = true;
          test.cmp.displayMoreResults(10);
          promiseResults.then(() => {
            setTimeout(() => {
              // Once at the initial request, + 5 (ResultList.MAX_AMOUNT_OF_SUCESSIVE_REQUESTS)
              expect(test.env.queryController.fetchMore).toHaveBeenCalledTimes(6);
              done();
            }, 1000);
          });
        });
      });
    });

    it('should tell if there are more results to display after a successful query', done => {
      const queryBuilder = new QueryBuilder();
      queryBuilder.numberOfResults = 10;

      Simulate.query(test.env, {
        results: FakeResults.createFakeResults(10),
        query: queryBuilder.build()
      });

      Defer.defer(() => {
        expect(test.cmp.hasPotentiallyMoreResultsToDisplay()).toBeTruthy();
        done();
      });
    });

    it('should tell if there are no more results to display after a successful query with a limited amount of results returned', done => {
      const results = FakeResults.createFakeResults(5);
      const queryBuilder = new QueryBuilder();
      queryBuilder.numberOfResults = 10;

      Simulate.query(test.env, {
        results: results,
        query: queryBuilder.build()
      });

      Defer.defer(() => {
        expect(test.cmp.hasPotentiallyMoreResultsToDisplay()).toBeFalsy();
        done();
      });
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
          done();
        });
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

    it('should hide and show specific css class correctly', done => {
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

    describe('exposes options', () => {
      it('resultContainer allow to specify where to render results', done => {
        const aNewContainer = document.createElement('div');
        expect(aNewContainer.children.length).toBe(0);
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          resultContainer: aNewContainer
        });
        Simulate.query(test.env);
        Defer.defer(() => {
          expect(aNewContainer.children.length).toBe(10);
          done();
        });
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
        otherResultList.element = document.createElement('div');
        $$(otherResultList.element).addClass('CoveoResultList');
        otherResultList.element['CoveoBoundComponents'] = [otherResultList];
        $$(test.env.root).append(otherResultList.element);
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
        asSpy.instantiateToElement.and.returnValue(new Promise((resolve, reject) => resolve(document.createElement('div'))));
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

      it('enableInfiniteScroll allow to enable infinite scrolling', done => {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          enableInfiniteScroll: false
        });
        Simulate.query(test.env);
        Defer.defer(() => {
          expect(test.env.queryController.fetchMore).not.toHaveBeenCalled();

          test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
            enableInfiniteScroll: true
          });
          Simulate.query(test.env);
          Defer.defer(() => {
            expect(test.env.queryController.fetchMore).toHaveBeenCalled();
            done();
          });
        });
      });

      it('infiniteScrollPageSize allow to specify the number of result to fetch when scrolling', done => {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          enableInfiniteScroll: true,
          infiniteScrollPageSize: 26
        });
        Simulate.query(test.env);
        Defer.defer(() => {
          expect(test.env.queryController.fetchMore).toHaveBeenCalledWith(26);
          done();
        });
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
            const container = test.cmp.options.resultContainer;
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
      });
    });
  });
}
