import * as Mock from '../MockEnvironment';
import { QuerySuggestPreview, IQuerySuggestPreview } from '../../src/ui/QuerySuggestPreview/QuerySuggestPreview';
import { IBasicComponentSetup } from '../MockEnvironment';
import { $$, OmniboxEvents } from '../../src/Core';

export function QuerySuggestPreviewTest() {
  describe('QuerySuggestPreview', () => {
    let test: IBasicComponentSetup<QuerySuggestPreview>;
    let testEnv: Mock.MockEnvironmentBuilder;

    function setQuerySuggestPreview(options: IQuerySuggestPreview = {}) {
      test = Mock.advancedComponentSetup<QuerySuggestPreview>(
        QuerySuggestPreview,
        new Mock.AdvancedComponentSetupOptions(null, options, env => testEnv)
      );
    }

    function triggerQuerySuggestHover(suggestion: string = 'test') {
      $$(testEnv.root).trigger(OmniboxEvents.querySuggestGetFocus, { suggestion });
    }

    beforeEach(() => {
      testEnv = new Mock.MockEnvironmentBuilder();
    });

    describe('expose options', () => {
      it('numberOfPreviewResultsss set the number of results to query', done => {
        const numberOfPreviewResults = 5;
        setQuerySuggestPreview({ numberOfPreviewResults });
        triggerQuerySuggestHover();
        setTimeout(() => {
          expect(test.cmp.queryController.getLastQuery().numberOfResults).toBe(numberOfPreviewResults);
          done();
        });
      });
    });
  });
}
