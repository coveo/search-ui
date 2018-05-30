import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { SearchButton } from '../../src/ui/SearchButton/SearchButton';
import { Mock } from '../../testsFramework/TestsFramework';

export function SearchButtonTest() {
  describe('SearchButton', () => {
    let test: Mock.IBasicComponentSetup<SearchButton>;

    beforeEach(() => {
      test = Mock.basicComponentSetup<SearchButton>(SearchButton);
    });

    afterEach(() => {
      test = null;
    });

    it('can be initialized', () => {
      expect(test.cmp).toBeDefined();
    });

    it('will trigger a query on click', () => {
      test.cmp.click();
      expect(test.env.queryController.executeQuery).toHaveBeenCalled();
    });

    it('will log an analytics event', () => {
      test.cmp.click();
      expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.searchboxSubmit, {});
    });
  });
}
