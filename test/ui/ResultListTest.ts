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

    it('should allow to return the currently displayed result', () => {
      expect(ResultList.resultCurrentlyBeingRendered).toBeNull();
      let data = FakeResults.createFakeResult();
      test.cmp.buildResult(data);
      expect(ResultList.resultCurrentlyBeingRendered).toBe(data);
    });

    it('should set currently displayed result to undefined when they are all rendered', () => {
      let data = FakeResults.createFakeResults(13);
      test.cmp.buildResults(data);
      expect(ResultList.resultCurrentlyBeingRendered).toBeNull();
    });

    it('should reset currently displayed on new query', () => {
      let data = FakeResults.createFakeResult();
      test.cmp.buildResult(data);
      expect(ResultList.resultCurrentlyBeingRendered).toBe(data);
      Simulate.query(test.env);
      expect(ResultList.resultCurrentlyBeingRendered).toBeNull();
    });

    it('should allow to build a single result element', () => {
      let data = FakeResults.createFakeResult();
      let built = test.cmp.buildResult(data);
      expect(built).toBeDefined();
      let rs = $$(built).find('.CoveoResultLink');
      expect($$(rs).text()).toBe(data.title);
    });

    it('should allow to build multiple results element', () => {
      let data = FakeResults.createFakeResults(13);
      let built = test.cmp.buildResults(data);
      expect(built.length).toBe(13);
      let rs = $$(built[0]).find('.CoveoResultLink');
      expect($$(rs).text()).toBe(data.results[0].title);
      rs = $$(built[12]).find('.CoveoResultLink');
      expect($$(rs).text()).toBe(data.results[12].title);
    });

    it('should bind result on the HTMLElement', () => {
      let data = FakeResults.createFakeResults(13);
      let built = test.cmp.buildResults(data);

      expect(built[0]['CoveoResult']).toEqual(jasmine.objectContaining({ title: 'Title0' }));
      let jQuery = Simulate.addJQuery();
      built = test.cmp.buildResults(data);
      expect(jQuery(built[3]).data()).toEqual(jasmine.objectContaining({ title: 'Title3' }));
      Simulate.removeJQuery();
    });

    it('should allow to render results inside the result list', () => {
      let data = FakeResults.createFakeResults(13);
      test.cmp.renderResults(test.cmp.buildResults(data));
      expect($$(test.cmp.element).findAll('.CoveoResult').length).toBe(13);
    });

    it('should trigger result displayed event when rendering', () => {
      let data = FakeResults.createFakeResults(6);
      let spyResult = jasmine.createSpy('spyResult');
      let spyResults = jasmine.createSpy('spyResults');
      $$(test.cmp.element).on(ResultListEvents.newResultDisplayed, spyResult);
      $$(test.cmp.element).on(ResultListEvents.newResultsDisplayed, spyResults);
      test.cmp.renderResults(test.cmp.buildResults(data));
      expect(spyResult).toHaveBeenCalledTimes(6);
      expect(spyResults).toHaveBeenCalledTimes(1);
    });

    it('should render itself correctly after a full query', () => {
      let spyResult = jasmine.createSpy('spyResult');
      let spyResults = jasmine.createSpy('spyResults');
      $$(test.cmp.element).on(ResultListEvents.newResultDisplayed, spyResult);
      $$(test.cmp.element).on(ResultListEvents.newResultsDisplayed, spyResults);
      Simulate.query(test.env);
      expect(test.cmp.getDisplayedResults().length).toBe(10);
      expect(test.cmp.getDisplayedResultsElements().length).toBe(10);
      expect(spyResult).toHaveBeenCalledTimes(10);
      expect(spyResults).toHaveBeenCalledTimes(1);
    });


    it('should clear itself on query error', () => {
      Simulate.query(test.env);
      expect(test.cmp.getDisplayedResults().length).toBe(10);
      expect(test.cmp.getDisplayedResultsElements().length).toBe(10);
      Simulate.query(test.env, {
        error: {
          message: 'oh noes',
          type: 'very bad',
          name: 'oh noes very bad'
        }
      });
      expect(test.cmp.getDisplayedResults().length).toBe(0);
      expect(test.cmp.getDisplayedResultsElements().length).toBe(0);
    });

    it('should add and remove a hidden css class on enable/disable', () => {
      test.cmp.disable();
      expect($$(test.cmp.element).hasClass('coveo-hidden')).toBe(true);
      test.cmp.enable();
      expect($$(test.cmp.element).hasClass('coveo-hidden')).toBe(false);
    });

    it('should hide and show specific css class correctly', () => {
      let showIfQuery = $$('div', {
        className: 'coveo-show-if-query'
      });
      let showIfNoQuery = $$('div', {
        className: 'coveo-show-if-no-query'
      });
      let showIfResults = $$('div', {
        className: 'coveo-show-if-results'
      });
      let showIfNoResults = $$('div', {
        className: 'coveo-show-if-no-results'
      });

      test.cmp.element.appendChild(showIfQuery.el);
      test.cmp.element.appendChild(showIfNoQuery.el);
      test.cmp.element.appendChild(showIfResults.el);
      test.cmp.element.appendChild(showIfNoResults.el);

      let withAQuery = new QueryBuilder();
      withAQuery.expression.add('foo');

      Simulate.query(test.env, {
        query: withAQuery.build()
      });

      expect(showIfQuery.el.style.display).toBe('block');
      expect(showIfNoQuery.el.style.display).toBe('none');

      Simulate.query(test.env, {
        results: FakeResults.createFakeResults(0)
      });

      expect(showIfResults.el.style.display).toBe('none');
      expect(showIfNoResults.el.style.display).toBe('block');

      Simulate.query(test.env, {
        results: FakeResults.createFakeResults(10)
      });

      expect(showIfResults.el.style.display).toBe('block');
      expect(showIfNoResults.el.style.display).toBe('none');

    });

    describe('exposes options', () => {
      it('resultContainer allow to specify where to render results', () => {
        let aNewContainer = document.createElement('div');
        expect(aNewContainer.children.length).toBe(0);
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          resultContainer: aNewContainer
        });
        Simulate.query(test.env);
        expect(aNewContainer.children.length).toBe(10);
      });

      it('should get the minimal amount of fields to include when the option is true', () => {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          autoSelectFieldsToInclude: true
        });

        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().fieldsToInclude).toEqual(jasmine.arrayContaining(['author', 'language', 'urihash', 'objecttype', 'collection', 'source', 'language', 'uniqueid']));
      });

      it('resultTemplate allow to specify a template manually', () => {
        let tmpl: UnderscoreTemplate = Mock.mock<UnderscoreTemplate>(UnderscoreTemplate);
        let asSpy = <any>tmpl;
        asSpy.instantiateToElement.and.returnValue(document.createElement('div'));
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          resultTemplate: tmpl
        });
        Simulate.query(test.env);
        expect(tmpl.instantiateToElement).toHaveBeenCalledTimes(10);
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
        let aNewContainer = document.createElement('div');
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

      it('enableInfiniteScroll allow to enable infinite scrolling', () => {

        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          enableInfiniteScroll: false
        });
        Simulate.query(test.env);
        expect(test.env.queryController.fetchMore).not.toHaveBeenCalled();

        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          enableInfiniteScroll: true
        });
        Simulate.query(test.env);
        expect(test.env.queryController.fetchMore).toHaveBeenCalled();
      });

      it('infiniteScrollPageSize allow to specify the number of result to fetch when scrolling', () => {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          enableInfiniteScroll: true,
          infiniteScrollPageSize: 26
        });
        Simulate.query(test.env);
        expect(test.env.queryController.fetchMore).toHaveBeenCalledWith(26);
      });

      it('fieldsToInclude allow to specify an array of fields to include in the query', () => {
        test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
          fieldsToInclude: ['@field1', '@field2', '@field3']
        });
        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.fieldsToInclude).toContain('field1');
        expect(simulation.queryBuilder.fieldsToInclude).toContain('field2');
        expect(simulation.queryBuilder.fieldsToInclude).toContain('field3');
      });

      describe('layout', () => {
        it('should correctly listen to populateResultLayout', () => {
          test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
            layout: 'card'
          });
          let layoutsPopulated = [];
          $$(test.env.root).trigger(ResultLayoutEvents.populateResultLayout, { layouts: layoutsPopulated });
          expect(layoutsPopulated).toEqual(jasmine.arrayContaining(['card']));

        });

        it('should set the correct layout on each child template if it contains a TemplateList', () => {
          let elem = $$('div', {
            className: 'CoveoResultList'
          });
          let scriptOne = $$('script', {
            className: 'result-template',
            type: 'text/html'
          });
          let scriptTwo = $$('script', {
            className: 'result-template',
            type: 'text/html'
          });
          elem.append(scriptOne.el);
          elem.append(scriptTwo.el);
          test = Mock.advancedComponentSetup<ResultList>(ResultList, new AdvancedComponentSetupOptions(elem.el, {
            layout: 'card'
          }));

          expect(test.cmp.options.resultTemplate instanceof TemplateList).toBe(true);
          expect((<TemplateList>test.cmp.options.resultTemplate).templates[0].layout).toBe('card');
          expect((<TemplateList>test.cmp.options.resultTemplate).templates[1].layout).toBe('card');
        });

        it('should add 3 empty div at the end of the results when it\'s a card template and infinite scroll is not enabled', () => {
          test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
            layout: 'card',
            enableInfiniteScroll: false
          });
          Simulate.query(test.env);
          let container = test.cmp.options.resultContainer;
          expect(container.children.item(container.children.length - 1).innerHTML).toBe('');
          expect(container.children.item(container.children.length - 2).innerHTML).toBe('');
          expect(container.children.item(container.children.length - 3).innerHTML).toBe('');
          expect(container.children.item(container.children.length - 4).innerHTML).not.toBe('');
        });

        it('should add 3 empty div at the end of the results when it\'s a card template and infinite scroll is enabled', () => {
          test = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, {
            layout: 'card',
            enableInfiniteScroll: true
          });
          Simulate.query(test.env);
          let container = test.cmp.options.resultContainer;
          expect(container.children.item(container.children.length - 1).innerHTML).not.toBe('');
          expect(container.children.item(container.children.length - 2).innerHTML).not.toBe('');
          expect(container.children.item(container.children.length - 3).innerHTML).not.toBe('');
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
