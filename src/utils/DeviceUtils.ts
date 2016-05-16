//Not sure about this : In year 2033 who's to say that this list won't be 50 page long !
const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Urls in Phonegap starts with file:///XXX_asset in android, file:///var/mobile in iOS,  file:///[....]CoreSimulator on IOS emulator
const phonegap = /^file:\/\/\/.*_asset/i.test(document.URL) || /^file:\/\/\/.*var\/mobile/i.test(document.URL) || /^file:\/\/\/.*\/CoreSimulator/.test(document.URL);

export class DeviceUtils {
  static getDeviceName(): string {
    var userAgent = navigator.userAgent;
    if (userAgent.match(/Android/i)) {
      return "Android";
    }
    if (userAgent.match(/BlackBerry/i)) {
      return "BlackBerry";
    }
    if (userAgent.match(/iPhone/i)) {
      return "iPhone";
    }
    if (userAgent.match(/iPad/i)) {
      return "iPad";
    }
    if (userAgent.match(/iPod/i)) {
      return "iPod";
    }
    if (userAgent.match(/Opera Mini/i)) {
      return "Opera Mini";
    }
    if (userAgent.match(/IEMobile/i)) {
      return "IE Mobile";
    }
    if (userAgent.match(/Chrome/i)) {
      return "Chrome";
    }
    if (userAgent.match(/MSIE/i) || userAgent.match(/Trident/i)) {
      return "IE";
    }
    if (userAgent.match(/Opera/i)) {
      return "Opera";
    }
    if (userAgent.match(/Firefox/i)) {
      return "Firefox";
    }
    if (userAgent.match(/Safari/i)) {
      return "Safari";
    }
    return "Others";
  }

  static isAndroid() {
    return DeviceUtils.getDeviceName() == "Android";
  }

  static isIos() {
    var deviceName = DeviceUtils.getDeviceName();
    return deviceName == "iPhone" || deviceName == "iPad" || deviceName == "iPod";
  }

  static isIE8or9(): boolean {
    var myNav = navigator.userAgent.toLowerCase();
    if (myNav.indexOf('msie') == -1) {
      return false;
    }
    return parseInt(myNav.split('msie')[1]) < 10;
  }

  static isMobileDevice() {
    return mobile;
  }

  static isPhonegap() {
    return phonegap;
  }

  static isSmallScreenWidth() {
    if (window['clientWidth'] != null && window['clientWidth'] <= 480) {
      return true
    }
    return document.body.clientWidth <= 480;
  }

  static isSmallScreenHeight() {
    return document.body.clientHeight <= 640;
  }
}