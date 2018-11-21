import * as Mock from '../MockEnvironment';
import { ResultListUtils } from '../../src/utils/ResultListUtils';
import { IResultListOptions } from '../../src/ui/ResultList/ResultListOptions';
import { ResultList } from '../../src/ui/ResultList/ResultList';
import { $$ } from '../../src/Core';

export const ResultListUtilsTest = () => {
  describe('ResultListUtils', () => {
    const utils = ResultListUtils;
    let root: HTMLElement;

    function appendResultListToRoot(options: IResultListOptions = {}, disabled = false) {
      const resultList = Mock.optionsComponentSetup<ResultList, IResultListOptions>(ResultList, options).cmp;
      resultList.disabled = disabled;
      root.appendChild(resultList.element);
    }

    beforeEach(() => (root = $$('div').el));

    it(`when a result list with enableInfiniteScroll set to 'false' is appended to the root,
    when calling #isInfiniteScrollEnabled,
    it returns 'false'`, () => {
      appendResultListToRoot({ enableInfiniteScroll: false });
      expect(utils.isInfiniteScrollEnabled(root)).toBe(false);
    });

    it(`when a result list with enableInfiniteScroll set to 'true' is appended to the root,
    when calling #isInfiniteScrollEnabled,
    it returns 'true'`, () => {
      appendResultListToRoot({ enableInfiniteScroll: true });
      expect(utils.isInfiniteScrollEnabled(root)).toBe(true);
    });

    it(`when appending a result list where enableInfiniteScroll is 'true' but is disabled,
    when calling #isInfiniteScrollEnabled,
    it returns 'false'`, () => {
      appendResultListToRoot({ enableInfiniteScroll: true }, true);
      expect(utils.isInfiniteScrollEnabled(root)).toBe(false);
    });
  });
};
