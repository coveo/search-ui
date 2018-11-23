import * as Mock from '../MockEnvironment';
import { SearchButton } from '../../src/ui/SearchButton/SearchButton';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';

export function SearchButtonTest() {
  describe('SearchButton', () => {
    var test: Mock.IBasicComponentSetup<SearchButton>;

    beforeEach(function() {
      test = Mock.basicComponentSetup<SearchButton>(SearchButton);
    });

    afterEach(function() {
      test = null;
    });

    it('can be initialized', function() {
      expect(test.cmp).toBeDefined();
    });

    it('will trigger a query on click', function() {
      test.cmp.click();
      expect(test.env.queryController.executeQuery).toHaveBeenCalled();
    });

    it('will log an analytics event', function() {
      test.cmp.click();
      expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.searchboxSubmit, {});
    });
  });
}
