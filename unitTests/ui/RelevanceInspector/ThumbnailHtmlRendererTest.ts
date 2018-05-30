import { ThumbnailHtmlRenderer } from '../../../src/ui/RelevanceInspector/TableBuilder';
import { IQueryResult } from '../../../src/rest/QueryResult';
import { IComponentBindings } from '../../../src/ui/Base/ComponentBindings';
import { FakeResults } from '../../Fake';
import { MockEnvironmentBuilder } from '../../MockEnvironment';
import { $$ } from '../../Test';
import { ResultList } from '../../../src/ui/ResultList/ResultList';

export function ThumbnailHtmlRendererTest() {
  describe('ThumbnailHtmlRenderer', () => {
    it('should render default output if there is no element to render', () => {
      const thumbnailHtmlRenderer = new ThumbnailHtmlRenderer();
      thumbnailHtmlRenderer.init();
      expect(() => thumbnailHtmlRenderer.getGui()).not.toThrow();
      expect(thumbnailHtmlRenderer.getGui().textContent).toBe('-- NULL --');
    });

    describe('with a result and an environment bindings', () => {
      let result: IQueryResult;
      let bindings: IComponentBindings;
      let fakeGridAPI: { filterManager: { quickFilter: string } };

      beforeEach(() => {
        result = FakeResults.createFakeResult();
        bindings = new MockEnvironmentBuilder().build();
        fakeGridAPI = {
          filterManager: {
            quickFilter: ''
          }
        };
      });

      it('should render a default result link if there is no result list available', () => {
        const thumbnailHtmlRenderer = new ThumbnailHtmlRenderer();
        thumbnailHtmlRenderer.init({
          value: {
            result,
            bindings
          },
          api: fakeGridAPI
        });
        const built = thumbnailHtmlRenderer.getGui();
        expect($$(built).find('.CoveoResultLink')).toBeDefined();
      });

      it('should render using the result list if available', () => {
        const resultList = new ResultList($$('div').el, null, bindings);
        spyOn(resultList, 'buildResult').and.callThrough();

        bindings.searchInterface.getComponents = (cmp: string) => [resultList as any];

        const thumbnailHtmlRenderer = new ThumbnailHtmlRenderer();

        thumbnailHtmlRenderer.init({
          value: {
            result,
            bindings
          },
          api: fakeGridAPI
        });

        thumbnailHtmlRenderer.getGui();
        expect(resultList.buildResult).toHaveBeenCalledWith(result);
      });

      it('should highlight html built HTMLElement with the current filter', () => {
        fakeGridAPI.filterManager.quickFilter = result.title;
        const thumbnailHtmlRenderer = new ThumbnailHtmlRenderer();

        thumbnailHtmlRenderer.init({
          value: {
            result,
            bindings
          },
          api: fakeGridAPI
        });

        const built = thumbnailHtmlRenderer.getGui();
        expect($$(built).find('.coveo-relevance-inspector-highlight')).toBeDefined();
      });
    });
  });
}
