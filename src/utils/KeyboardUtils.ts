import { Utils } from './Utils';
import * as _ from 'underscore';

export enum KEYBOARD {
  BACKSPACE = 8,
  TAB = 9,
  ENTER = 13,
  SHIFT = 16,
  CTRL = 17,
  ALT = 18,
  ESCAPE = 27,
  SPACEBAR = 32,
  PAGE_UP = 33,
  PAGE_DOWN = 34,
  HOME = 36,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  RIGHT_ARROW = 39,
  DOWN_ARROW = 40,
  INSERT = 45,
  DELETE = 46
}

export class KeyboardUtils {
  static keysEqual(key, code) {
    if (!Utils.isNullOrUndefined(key.keyCode)) {
      return key.keyCode == code;
    } else if (!Utils.isNullOrUndefined(key.which)) {
      return key.which == code;
    }
    return false;
  }

  static isAllowedKeyForOmnibox(e: KeyboardEvent): boolean {
    var keycode = e.keyCode;
    var valid =
      KeyboardUtils.isNumberKeyPushed(keycode) ||
      (keycode == 32 || keycode == 13) || // spacebar & return key(s)
      KeyboardUtils.isLetterKeyPushed(keycode) ||
      (keycode > 95 && keycode < 112) || // numpad keys
      (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
      (keycode > 218 && keycode < 223) || // [\]' (in order)
      (keycode == KEYBOARD.BACKSPACE || keycode == KEYBOARD.DELETE) ||
      KeyboardUtils.isArrowKeyPushed(keycode);

    return valid;
  }

  static isAllowedKeyForSearchAsYouType(e: KeyboardEvent): boolean {
    return KeyboardUtils.isAllowedKeyForOmnibox(e) && !KeyboardUtils.isArrowKeyPushed(e.keyCode);
  }

  static isDeleteOrBackspace(e: KeyboardEvent) {
    return KeyboardUtils.keysEqual(e, KEYBOARD.BACKSPACE) || KeyboardUtils.keysEqual(e, KEYBOARD.DELETE);
  }

  static isArrowKeyPushed(keycode: number): boolean {
    return (
      keycode == KEYBOARD.LEFT_ARROW || keycode == KEYBOARD.UP_ARROW || keycode == KEYBOARD.RIGHT_ARROW || keycode == KEYBOARD.DOWN_ARROW
    );
  }

  static isNumberKeyPushed(keycode: number): boolean {
    return keycode > 47 && keycode < 58;
  }

  static isLetterKeyPushed(keycode: number): boolean {
    return keycode > 64 && keycode < 91;
  }

  // Return a keyboard event listener that only executes the function if certain keys are pressed.
  static keypressAction(keyCode: KEYBOARD | KEYBOARD[], action: Function) {
    return (e: KeyboardEvent, ...data: any[]) => {
      if (e) {
        const eventCode = e.charCode || e.keyCode;
        if (eventCode) {
          if (_.isArray(keyCode) && _.contains(keyCode, eventCode)) {
            action(e);
          } else if (eventCode === keyCode) {
            action(e);
          }
        }
      }
    };
  }
}
