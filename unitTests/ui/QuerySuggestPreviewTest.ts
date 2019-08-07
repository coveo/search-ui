import * as Mock from '../MockEnvironment';
import { IBasicComponentSetup } from '../MockEnvironment';
import { QuerySuggestPreview } from '../../src/ui/QuerySuggestPreview/QuerySuggestPreview';
import { QuerySuggestPreviewTestUtils } from './QuerySuggestPreviewTestUtils';
import { OmniboxAnalytics } from '../../src/ui/Omnibox/OmniboxAnalytics';
import { $$, OmniboxEvents } from '../../src/Core';
import { FakeResults } from '../Fake';

export function QuerySuggestPreviewTest() {
  describe('QuerySuggestPreview', () => {
    let test: IBasicComponentSetup<QuerySuggestPreview>;
    let testEnv: Mock.MockEnvironmentBuilder;
    let utils: QuerySuggestPreviewTestUtils;

    beforeEach(() => {
      testEnv = new Mock.MockEnvironmentBuilder();
      testEnv.searchInterface.getOmniboxAnalytics = jasmine.createSpy('omniboxAnalytics').and.returnValue(new OmniboxAnalytics()) as any;
      utils = new QuerySuggestPreviewTestUtils(testEnv);
    });

    describe('expose options', () => {
      beforeEach(() => {
        jasmine.clock().install();
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      it('numberOfPreviewResults set the number of results to query', () => {
        const numberOfPreviewResults = 5;
        test = utils.setupQuerySuggestPreview({ numberOfPreviewResults });
        utils.setupSuggestion();
        utils.triggerQuerySuggestHoverAndPassTime();
        expect(test.cmp.queryController.getLastQuery().numberOfResults).toBe(numberOfPreviewResults);
      });

      it('hoverTime set the time before the query is executed', () => {
        const executeQueryDelay = 200;
        test = utils.setupQuerySuggestPreview({ executeQueryDelay });
        utils.setupSuggestion();
        expect(test.cmp.queryController.getLastQuery).not.toHaveBeenCalled();
        utils.triggerQuerySuggestHoverAndPassTime();
        expect(test.cmp.queryController.getLastQuery).toHaveBeenCalledTimes(1);
      });

      it('previewWidth change the witdh of the preview container', () => {
        const width = 500;
        test = utils.setupQuerySuggestPreview({ previewWidth: width });
        utils.setupSuggestion();
        utils.triggerQuerySuggestHoverAndPassTime();
        const previewContainer = $$(utils.suggestionContainer.el).find('.coveo-preview-container');
        expect(previewContainer.style.width).toEqual(`${width}px`);
      });

      it('suggestionWidth change the width of the suggestion container', () => {
        const suggestionWidth = 250;
        test = utils.setupQuerySuggestPreview({ suggestionWidth });
        utils.setupSuggestion();
        utils.triggerQuerySuggestHoverAndPassTime();
        const suggestionContainerById = $$(utils.suggestionContainer.el).find('.coveo-magicbox-suggestions');
        expect(suggestionContainerById.style.width).toBe(`${suggestionWidth}px`);
      });

      it('headerText change the text in the header of the preview', done => {
        const headerText = 'Super Header';
        const suggestion = 'test';
        //We can't use the clock here because we are validating a DOM element
        //Since we need to wait for some promise to finish and I can't wait for them
        //since they were triggered by an event. Meanwhile, Jasmine will continue to
        //evaluate and would fail the test
        jasmine.clock().uninstall();
        test = utils.setupQuerySuggestPreview({ headerText });
        utils.setupSuggestion();
        utils.triggerQuerySuggestHover(suggestion);
        setTimeout(() => {
          const previewContainer = $$(utils.suggestionContainer.el).find('.coveo-preview-header');
          expect(previewContainer.innerText).toBe(`${headerText} "${suggestion}"`);
          done();
        }, test.cmp.options.executeQueryDelay);
      });
    });

    describe('when the previews are rendered,', () => {
      it(`if we have four element,
      each take 50% of the remaining available space`, done => {
        test = utils.setupQuerySuggestPreview({ numberOfPreviewResults: 4 });
        utils.setupSuggestion();
        utils.triggerQuerySuggestHover();
        setTimeout(() => {
          const previewContainer = $$(utils.suggestionContainer.el).find('.CoveoResult');
          expect(previewContainer.style.flex).toBe('0 0 50%');
          done();
        }, test.cmp.options.executeQueryDelay);
      });

      it(`if we DON'T have 4 htmlElement,
      each take 33% of the remaining available space`, done => {
        test = utils.setupQuerySuggestPreview({ numberOfPreviewResults: 6 });
        utils.setupSuggestion();
        utils.triggerQuerySuggestHover();
        setTimeout(() => {
          const previewContainer = $$(utils.suggestionContainer.el).find('.CoveoResult');
          expect(previewContainer.style.flex).toBe('0 0 33%');
          done();
        }, test.cmp.options.executeQueryDelay);
      });

      it('it set the attribute coveo-preview-rank with the rank of the preview', done => {
        test = utils.setupQuerySuggestPreview();
        utils.setupSuggestion();
        utils.triggerQuerySuggestHover();
        setTimeout(() => {
          const previewContainer = $$(utils.suggestionContainer.el).find('.coveo-preview-results > .CoveoResult');
          expect(previewContainer.getAttribute('coveo-preview-rank')).toBe('0');
          done();
        }, test.cmp.options.executeQueryDelay);
      });
    });

    describe('When we hover', () => {
      beforeEach(() => {
        jasmine.clock().install();
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      it(`on the same Suggestion multiple times before the time in the option hoverTime has passed,
      the query is is executed only once`, done => {
        test = utils.setupQuerySuggestPreview();
        test.cmp.queryController.getEndpoint().search = jasmine.createSpy('execQuery');
        utils.setupSuggestion();
        utils.triggerQuerySuggestHover();
        utils.triggerQuerySuggestHover();
        utils.triggerQuerySuggestHoverAndPassTime();
        expect(test.cmp.queryController.getEndpoint().search).toHaveBeenCalledTimes(1);
        done();
      });

      it(`on multiple suggestion before the time in the option hoverTime has passed,
      the query is is executed only once with the last Suggestion we hovered on`, done => {
        const realQuery = 'testing3';
        test = utils.setupQuerySuggestPreview();
        test.cmp.queryController.getEndpoint().search = jasmine.createSpy('execQuery');
        utils.setupSuggestion();
        utils.triggerQuerySuggestHover('testing');
        utils.triggerQuerySuggestHover('testing2');
        utils.triggerQuerySuggestHoverAndPassTime(realQuery);
        expect(test.cmp.queryController.getEndpoint().search).toHaveBeenCalledTimes(1);
        expect(test.cmp.queryController.getLastQuery().q).toBe(realQuery);
        done();
      });
    });

    describe('currentlyDisplayedResults', () => {
      it('currentlyDisplayedResults get populated by rendered results', done => {
        test = utils.setupQuerySuggestPreview();
        const fakeResults = FakeResults.createFakeResults(test.cmp.options.numberOfPreviewResults);
        utils.setupSuggestion();
        utils.triggerQuerySuggestHover('test', fakeResults);
        setTimeout(() => {
          expect(test.cmp.displayedResults).toEqual(fakeResults.results);
          done();
        }, test.cmp.options.executeQueryDelay);
      });

      it('currentlyDisplayedResults get emptied when they aare no result to be rendered', done => {
        test = utils.setupQuerySuggestPreview();
        const fakeResults = FakeResults.createFakeResults(0);
        utils.setupSuggestion();
        utils.triggerQuerySuggestHover('test', fakeResults);
        setTimeout(() => {
          expect(test.cmp.displayedResults).toEqual([]);
          done();
        }, test.cmp.options.executeQueryDelay);
      });

      it('currentlyDisplayedResults get emptied when a querySuggest loose focus', done => {
        test = utils.setupQuerySuggestPreview();
        utils.setupSuggestion();
        utils.triggerQuerySuggestHover('test');
        setTimeout(() => {
          expect(test.cmp.displayedResults.length).toEqual(test.cmp.options.numberOfPreviewResults);
          $$(test.cmp.root).trigger(OmniboxEvents.querySuggestLoseFocus);
          expect(test.cmp.displayedResults).toEqual([]);
          done();
        }, test.cmp.options.executeQueryDelay);
      });
    });
  });
}
