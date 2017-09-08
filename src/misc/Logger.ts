// Ensure that we're not going to get console is undefined error in IE8-9

/* istanbul ignore next */
if (!window['console']) {
  console = <any>{
    log: function() {},
    debug: function() {},
    info: function() {},
    warn: function() {},
    error: function() {},
    assert: function() {},
    clear: function() {},
    count: function() {},
    dir: function() {},
    dirxml: function() {},
    group: function() {},
    groupCollapsed: function() {},
    groupEnd: function() {},
    msIsIndependentlyComposed: function(element: any): any {},
    profile: function() {},
    profileEnd: function() {},
    select: function() {},
    time: function() {},
    timeEnd: function() {},
    trace: function() {}
  };
}

/* istanbul ignore next */
export class Logger {
  static TRACE = 1;
  static DEBUG = 2;
  static INFO = 3;
  static WARN = 4;
  static ERROR = 5;
  static NOTHING = 6;

  static level = Logger.INFO;
  static executionTime = false;

  constructor(private owner: any) {}

  trace(...stuff: any[]) {
    if (Logger.level <= Logger.TRACE) {
      this.log('TRACE', stuff);
    }
  }

  debug(...stuff: any[]) {
    if (Logger.level <= Logger.DEBUG) {
      this.log('DEBUG', stuff);
    }
  }

  info(...stuff: any[]) {
    if (Logger.level <= Logger.INFO) {
      this.log('INFO', stuff);
    }
  }

  warn(...stuff: any[]) {
    if (Logger.level <= Logger.WARN) {
      this.log('WARN', stuff);
    }
  }

  error(...stuff: any[]) {
    if (Logger.level <= Logger.ERROR) {
      this.log('ERROR', stuff);
    }
  }

  private log(level: string, stuff: any[]) {
    if (window['console'] && console.log) {
      if (console.error && level == 'ERROR') {
        console.error([level, this.owner].concat(stuff));
      } else if (console.info && level == 'INFO') {
        console.info([level, this.owner].concat(stuff));
      } else if (console.warn && level == 'WARN') {
        console.warn([level, this.owner].concat(stuff));
      } else {
        console.log([level, this.owner].concat(stuff));
      }
      if (Logger.executionTime) {
        console.timeEnd('Execution time');
        console.time('Execution time');
      }
    }
  }

  static enable() {
    Logger.level = Logger.TRACE;
  }

  static disable() {
    Logger.level = Logger.NOTHING;
  }
}
