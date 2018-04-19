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

    it('should add and remove show class on concecutive clicks', () => {
      const component = $$(test.cmp.element);

      component.trigger("click");
      expect(component.hasClass(ResultActionsMenu.SHOW_CLASS)).toBe(true);

      component.trigger("click");

      expect(component.hasClass(ResultActionsMenu.SHOW_CLASS)).toBe(false);
    });

    it('should add show class on mouseenter when openOnMouseOver option is true', () => {
      test = Mock.basicResultComponentSetup<ResultActionsMenu>(ResultActionsMenu, { openOnMouseOver: true });
      const component = $$(test.cmp.element);

      component.trigger("mouseenter");
      expect(component.hasClass(ResultActionsMenu.SHOW_CLASS)).toBe(true);
    });

    it('should remove show class on mouseleave', () => {
      const component = $$(test.cmp.element);

      component.trigger("click");
      expect(component.hasClass(ResultActionsMenu.SHOW_CLASS)).toBe(true);

      component.trigger("mouseleave");
      expect(component.hasClass(ResultActionsMenu.SHOW_CLASS)).toBe(false);
    });

    it('should not add show class on mouseenter when openOnMouseOver option is false', () => {
      test = Mock.basicResultComponentSetup<ResultActionsMenu>(ResultActionsMenu, { openOnMouseOver: false });
      const component = $$(test.cmp.element);

      component.trigger("mouseenter");
      expect(component.hasClass(ResultActionsMenu.SHOW_CLASS)).toBe(false);
    });
  });
}
