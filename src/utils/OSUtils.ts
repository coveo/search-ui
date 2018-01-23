export enum OS_NAME {
  WINDOWS,
  MACOSX,
  UNIX,
  LINUX,
  UNKNOWN
}

export class OSUtils {
  static get(nav = navigator) {
    var osName;
    if (nav.appVersion.indexOf('Win') != -1) {
      osName = OS_NAME.WINDOWS;
    } else if (nav.appVersion.indexOf('Mac') != -1) {
      osName = OS_NAME.MACOSX;
    } else if (nav.appVersion.indexOf('X11') != -1) {
      osName = OS_NAME.UNIX;
    } else if (nav.appVersion.indexOf('Linux') != -1) {
      osName = OS_NAME.LINUX;
    } else {
      osName = OS_NAME.UNKNOWN;
    }
    return osName;
  }
}
