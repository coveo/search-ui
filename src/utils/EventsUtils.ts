import * as _ from 'underscore';

export class EventsUtils {
  private static prefixes = ['webkit', 'moz', 'MS', 'o', ''];

  // eventName must be in PascalCase
  public static addPrefixedEvent(element: HTMLElement, pascalCaseEventName: string, callback) {
    _.each(this.prefixes, prefix => {
      if (prefix == '') {
        pascalCaseEventName = pascalCaseEventName.toLowerCase();
      }
      element.addEventListener(prefix + pascalCaseEventName, callback, false);
    });
  }

  // eventName must be in PascalCase
  public static removePrefixedEvent(element: HTMLElement, pascalCaseEventName: string, callback) {
    _.each(this.prefixes, prefix => {
      if (prefix == '') {
        pascalCaseEventName = pascalCaseEventName.toLowerCase();
      }
      element.removeEventListener(prefix + pascalCaseEventName, callback, false);
    });
  }
}
