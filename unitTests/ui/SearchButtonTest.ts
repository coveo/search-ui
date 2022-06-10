import * as Mock from '../MockEnvironment';
import { SearchButton, ISearchButtonOptions } from '../../src/ui/SearchButton/SearchButton';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { QueryStateModel } from '../../src/Core';

export function SearchButtonTest() {
  describe('SearchButton', () => {
    var test: Mock.IBasicComponentSetup<SearchButton>;

    beforeEach(function () {
      test = Mock.basicComponentSetup<SearchButton>(SearchButton);
    });

    afterEach(function () {
      test = null;
    });

    it('can be initialized', function () {
      expect(test.cmp).toBeDefined();
    });

    it('will trigger a query on click', function () {
      test.cmp.click();
      expect(test.env.queryController.executeQuery).toHaveBeenCalledWith(jasmine.objectContaining({ logInActionsHistory: true }));
    });

    it('will log an analytics event', function () {
      test.cmp.click();
      expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.searchboxSubmit, {});
    });

    it(`when the #options.searchbox is defined, when clicking the button,
    it calls QueryStateModel #set to update the query`, () => {
      const options: ISearchButtonOptions = {
        searchbox: { getText: () => 'some query' }
      };

      test = Mock.basicComponentSetup<SearchButton>(SearchButton, options);
      test.cmp.click();

      expect(test.env.queryStateModel.set).toHaveBeenCalledWith(QueryStateModel.attributesEnum.q, options.searchbox.getText());
    });

    it(`when the #options is null, when clicking the button, it does not throw an error`, () => {
      test = Mock.basicComponentSetup<SearchButton>(SearchButton, null);
      expect(() => test.cmp.click()).not.toThrow();
    });
  });
}
