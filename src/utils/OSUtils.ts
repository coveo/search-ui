/// <reference path="../Base.ts" />

/**
* @nodoc
*/
module Coveo.OSUtils {
  export enum NAME {
    WINDOWS,
    MACOSX,
    UNIX,
    LINUX,
    UNKNOWN
  }

  export function get(nav = navigator) {
    var osName;
    if (nav.appVersion.indexOf("Win") != -1) {
      osName = NAME.WINDOWS;
    } else if (nav.appVersion.indexOf("Mac") != -1) {
      osName = NAME.MACOSX;
    } else if (nav.appVersion.indexOf("X11") != -1) {
      osName = NAME.UNIX;
    } else if (nav.appVersion.indexOf("Linux") != -1) {
      osName = NAME.LINUX
    } else {
      osName = NAME.UNKNOWN
    }
    return osName;
  }
}