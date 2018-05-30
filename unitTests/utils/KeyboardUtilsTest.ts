import { KeyboardUtils, KEYBOARD } from '../../src/utils/KeyboardUtils';
export function KeyboardUtilsTests() {
  describe('KeyboardUtils', () => {
    it('should detect correct keys for omnibox events', () => {
      expect(KeyboardUtils.isAllowedKeyForOmnibox(<KeyboardEvent>{ keyCode: KEYBOARD.DELETE })).toBe(true);
      expect(KeyboardUtils.isAllowedKeyForOmnibox(<KeyboardEvent>{ keyCode: KEYBOARD.CTRL })).toBe(false);
      expect(KeyboardUtils.isAllowedKeyForOmnibox(<KeyboardEvent>{ keyCode: KEYBOARD.INSERT })).toBe(false);
      expect(KeyboardUtils.isAllowedKeyForOmnibox(<KeyboardEvent>{ keyCode: 99 })).toBe(true);
    });

    it('should detect correct keys for search as you type', () => {
      expect(KeyboardUtils.isAllowedKeyForSearchAsYouType(<KeyboardEvent>{ keyCode: KEYBOARD.DELETE })).toBe(true);
      expect(KeyboardUtils.isAllowedKeyForSearchAsYouType(<KeyboardEvent>{ keyCode: KEYBOARD.CTRL })).toBe(false);
      expect(KeyboardUtils.isAllowedKeyForSearchAsYouType(<KeyboardEvent>{ keyCode: KEYBOARD.INSERT })).toBe(false);
      expect(KeyboardUtils.isAllowedKeyForSearchAsYouType(<KeyboardEvent>{ keyCode: 99 })).toBe(true);
      expect(KeyboardUtils.isAllowedKeyForSearchAsYouType(<KeyboardEvent>{ keyCode: KEYBOARD.DOWN_ARROW })).toBe(false);
    });

    it('should detect backspace correctly', () => {
      expect(KeyboardUtils.isDeleteOrBackspace(<KeyboardEvent>{ keyCode: KEYBOARD.DELETE })).toBe(true);
      expect(KeyboardUtils.isDeleteOrBackspace(<KeyboardEvent>{ keyCode: KEYBOARD.BACKSPACE })).toBe(true);
      expect(KeyboardUtils.isDeleteOrBackspace(<KeyboardEvent>{ keyCode: KEYBOARD.INSERT })).toBe(false);
    });

    it('should detect arrow key correctly', () => {
      expect(KeyboardUtils.isArrowKeyPushed(KEYBOARD.DOWN_ARROW)).toBe(true);
      expect(KeyboardUtils.isArrowKeyPushed(KEYBOARD.UP_ARROW)).toBe(true);
      expect(KeyboardUtils.isArrowKeyPushed(KEYBOARD.DELETE)).toBe(false);
    });

    it('should detect number key correctly', () => {
      expect(KeyboardUtils.isNumberKeyPushed(KEYBOARD.UP_ARROW)).toBe(false);
      expect(KeyboardUtils.isNumberKeyPushed(50)).toBe(true);
    });

    it('should detect letter key correctly', () => {
      expect(KeyboardUtils.isLetterKeyPushed(KEYBOARD.DELETE)).toBe(false);
      expect(KeyboardUtils.isLetterKeyPushed(70)).toBe(true);
    });

    it('should execute the function correctly with keypressAction', () => {
      let spy = jasmine.createSpy('spy');
      let func = KeyboardUtils.keypressAction(KEYBOARD.ENTER, spy);

      func(<KeyboardEvent>{ keyCode: KEYBOARD.DELETE });
      expect(spy).not.toHaveBeenCalled();
      func(<KeyboardEvent>{ keyCode: KEYBOARD.ENTER });
      expect(spy).toHaveBeenCalled();
    });
  });
}
