// Not sure about this : In year 2033 who's to say that this list won't be 50 pages long !
import { ResponsiveComponents } from '../ui/ResponsiveComponents/ResponsiveComponents';
const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export class DeviceUtils {
  static getDeviceName(userAgent = navigator.userAgent): string {
    if (userAgent.match(/Edge/i)) {
      return 'Edge';
    }
    if (userAgent.match(/Opera Mini/i)) {
      return 'Opera Mini';
    }
    if (userAgent.match(/Android/i)) {
      return 'Android';
    }
    if (userAgent.match(/BlackBerry/i)) {
      return 'BlackBerry';
    }
    if (userAgent.match(/iPhone/i)) {
      return 'iPhone';
    }
    if (userAgent.match(/iPad/i) || this.isSafariIPadOS(userAgent)) {
      return 'iPad';
    }
    if (userAgent.match(/iPod/i)) {
      return 'iPod';
    }
    if (userAgent.match(/Chrome/i)) {
      return 'Chrome';
    }
    if (userAgent.match(/MSIE/i) || userAgent.match(/Trident/i)) {
      return 'IE';
    }
    if (userAgent.match(/Opera/i)) {
      return 'Opera';
    }
    if (userAgent.match(/Firefox/i)) {
      return 'Firefox';
    }
    if (userAgent.match(/Safari/i)) {
      return 'Safari';
    }
    return 'Others';
  }

  static isAndroid() {
    return DeviceUtils.getDeviceName() == 'Android';
  }

  static isIos() {
    var deviceName = DeviceUtils.getDeviceName();
    return deviceName == 'iPhone' || deviceName == 'iPad' || deviceName == 'iPod';
  }

  static isMobileDevice() {
    if (this.isSafariIPadOS()) {
      return true;
    }

    return mobile;
  }

  // Workaround for Safari on iPadOS https://developer.apple.com/forums/thread/119186
  private static isSafariIPadOS(userAgent = navigator.userAgent) {
    return userAgent.match(/Macintosh/i) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2;
  }

  /**
   * @deprecated
   *
   * Use ResponsiveComponents.isSmallScreenWidth() instead
   */
  static isSmallScreenWidth() {
    return new ResponsiveComponents().isSmallScreenWidth();
  }
}
