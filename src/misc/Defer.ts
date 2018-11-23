import * as _ from 'underscore';

export class Defer {
  private static functions = [];

  static defer(code: () => void) {
    Defer.functions.push(code);
    Defer.arm();
  }

  static flush() {
    while (Defer.popOne()) {}
  }

  private static arm() {
    _.defer(() => {
      if (Defer.popOne()) {
        Defer.arm();
      }
    });
  }

  private static popOne() {
    if (Defer.functions.length > 0) {
      var fun = Defer.functions[0];
      Defer.functions = _.rest(Defer.functions);
      fun();
      return Defer.functions.length > 0;
    } else {
      return false;
    }
  }
}
