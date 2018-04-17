import * as Mock from '../MockEnvironment';
import { IQueryResult } from '../../src/rest/QueryResult';
import { FakeResults } from '../Fake';
import { ResultActionsMenu } from '../../src/ui/ResultActions/ResultActionsMenu';
import { $$ } from '../../src/utils/Dom';

export function ResultActionsMenuTest() {
  describe('ResultActionsMenu', () => {
    let resultActions: ResultActionsMenu;
    let test: Mock.IBasicComponentSetup<ResultActionsMenu>;
    let fakeResult: IQueryResult;

    beforeEach(() => {
      fakeResult = FakeResults.createFakeResult();
      test = Mock.advancedResultComponentSetup<ResultActionsMenu>(ResultActionsMenu, fakeResult, undefined);
      spyOn(test.cmp, 'show');
      spyOn(test.cmp, 'hide');
    });

    afterEach(() => {
      test = null;
      fakeResult = null;
    });

    it('should add show class when show is called', () => {
      const component = $$(test.cmp.element);
      expect(component.hasClass(ResultActionsMenu.SHOW_CLASS)).toBe(false);

      test.cmp.show();

      expect(component.hasClass(ResultActionsMenu.SHOW_CLASS)).toBe(true);
    });

    it('should remove show class when hide is called', () => {
      const component = $$(test.cmp.element);
      test.cmp.show();
      expect(component.hasClass(ResultActionsMenu.SHOW_CLASS)).toBe(true);

      test.cmp.hide();

      expect(component.hasClass(ResultActionsMenu.SHOW_CLASS)).toBe(false);
    });
  });
}
