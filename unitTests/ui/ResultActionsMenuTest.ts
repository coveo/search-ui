import * as Mock from '../MockEnvironment';
import { ResultActionsMenu } from '../../src/ui/ResultActions/ResultActionsMenu';
import { $$ } from '../../src/utils/Dom';

export function ResultActionsMenuTest() {
  describe('ResultActionsMenu', () => {
    let test: Mock.IBasicComponentSetup<ResultActionsMenu>;

    beforeEach(() => {
      test = Mock.basicResultComponentSetup<ResultActionsMenu>(ResultActionsMenu);
    });

    afterEach(() => {
      test = null;
    });

    function componentHasShowClass() {
      const component = $$(test.cmp.element);
      return component.hasClass(ResultActionsMenu.SHOW_CLASS);
    }

    it('should not remove show class on concecutive clicks', () => {
      const component = $$(test.cmp.element);

      component.trigger('click');
      expect(componentHasShowClass()).toBe(true);

      component.trigger('click');

      expect(componentHasShowClass()).toBe(true);
    });

    it('should add show class on mouseenter when openOnMouseOver option is true', () => {
      test = Mock.basicResultComponentSetup<ResultActionsMenu>(ResultActionsMenu, { openOnMouseOver: true });
      const component = $$(test.cmp.element);

      component.trigger('mouseenter');
      expect(componentHasShowClass()).toBe(true);
    });

    it('should remove show class on mouseleave', () => {
      const component = $$(test.cmp.element);

      component.trigger('click');
      expect(componentHasShowClass()).toBe(true);

      component.trigger('mouseleave');
      expect(componentHasShowClass()).toBe(false);
    });

    it('should not add show class on mouseenter when openOnMouseOver option is false', () => {
      test = Mock.basicResultComponentSetup<ResultActionsMenu>(ResultActionsMenu, { openOnMouseOver: false });
      const component = $$(test.cmp.element);

      component.trigger('mouseenter');
      expect(componentHasShowClass()).toBe(false);
    });

    it('when set inside a folded result, it resolves the parent correctly', () => {
      test = Mock.basicFoldedResultComponentSetup<ResultActionsMenu>(ResultActionsMenu);
      expect(test.cmp.parentResult).toBeDefined();
    });
  });
}
