export class EventsUtils {
  private static prefixes = ['webkit', 'moz', 'MS', 'o', ''];

  // eventName must be in CamelCase
  public static addPrefixedEvent(element: HTMLElement, eventName: string, callback) {
    _.each(this.prefixes, prefix => {
      if (prefix == '') {
        eventName = eventName.toLowerCase();
      }
      element.addEventListener(prefix + eventName, callback, false);
    });
  }

  // eventName must be in CamelCase
  public static removePrefixedEvent(element: HTMLElement, eventName: string, callback) {
    _.each(this.prefixes, prefix => {
      if (prefix == '') {
        eventName = eventName.toLowerCase();
      }
      element.removeEventListener(prefix + eventName, callback, false);
    });
  }
}
