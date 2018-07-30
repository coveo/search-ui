import * as Mock from '../MockEnvironment';
import { ResultTagging, IResultTaggingOptions } from '../../src/ui/ResultTagging/ResultTagging';
import { FakeResults } from '../Fake';
import { IQueryResult } from '../../src/rest/QueryResult';
import { $$ } from '../../src/utils/Dom';

export function ResultTaggingTest() {
  describe('ResultTagging', () => {
    let test: Mock.IBasicComponentSetup<ResultTagging>;
    let result: IQueryResult;

    beforeEach(() => {
      result = FakeResults.createFakeResult();
      result.raw['foo'] = 'value1;value2;value3';
      test = Mock.optionsResultComponentSetup<ResultTagging, IResultTaggingOptions>(
        ResultTagging,
        <IResultTaggingOptions>{
          field: '@foo'
        },
        result
      );
    });

    afterEach(() => {
      result = null;
      test = null;
    });

    it('should display the current tags values', () => {
      let tags = $$(test.cmp.element).findAll('.coveo-result-tagging-coveo-tag');
      expect(tags.length).toBe(3);
      expect($$(tags[0]).text()).toBe('value1');
      expect($$(tags[1]).text()).toBe('value2');
      expect($$(tags[2]).text()).toBe('value3');
    });
  });
}
