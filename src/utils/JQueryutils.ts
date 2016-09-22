export class JQueryUtils {
  static getJQuery() {
    if (window && window['Coveo'] && window['Coveo']['$']) {
      return window['Coveo']['$'];
    }
    return false;
  }

  static isInstanceOfJQuery(obj: Object): boolean {
    let jq = this.getJQuery();
    if (jq) {
      return obj instanceof jq;
    }
    return false;
  }

  static isInstanceOfJqueryEvent(obj: Object): boolean {
    let jq = this.getJQuery();
    if (jq) {
      return obj instanceof jq.Event;
    }
    return false;
  }
}
