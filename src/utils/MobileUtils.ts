/// <reference path="../Base.ts" />

/**
* @nodoc
*/
module Coveo.MobileUtils {
  var clickCancelingOverlay = $(document.createElement('div')).addClass('coveo-click-canceling-overlay');

  export function showClickCancelingOverlay(duration:number) {
    clickCancelingOverlay.addClass('active');
    setTimeout(() => {
      clickCancelingOverlay.removeClass('active');
    }, duration);
  }

  export function showClickFeedback(element:JQuery, duration:number) {
    element.addClass('coveo-clicked');
    setTimeout(() => {
      element.removeClass('coveo-clicked');
    }, duration);
  }

  export function addToggleClassOnSearchInterface(direction:string, isPhonegap = false) {
    //TODO : This code should be changed to something sane.
    //Something event based, not arbitrary css rules

    var searchInterfaceClass = "." + Component.computeCssClassName(SearchInterface);
    $(searchInterfaceClass + ",.coveo-glass").addClass('coveo-' + direction);
    $(".coveo-glass").addClass('coveo-active-glass');
    if (isPhonegap && DeviceUtils.getDeviceName() == "Android") {
      $(document).on("backbutton", $.proxy(MobileUtils.removeToggleClassOnSearchInterface, this, true));
    }
  }

  export function removeToggleClassOnSearchInterface(isPhonegap = false) {
    //TODO : This code should be changed to something sane.
    //Something event based, not arbitrary css rules

    var searchInterfaceClass = "." + Component.computeCssClassName(SearchInterface);
    $(searchInterfaceClass + ",.coveo-glass")
        .removeClass('coveo-slide-right')
        .removeClass('coveo-slide-left')
        .removeClass('coveo-active-glass')
        .removeClass('coveo-active-glass-for-current-tab');

    $('.coveo-tab-section')
        .removeClass('coveo-opened-by-current-tab');

    var currentTabRef = Component.getComponentRef("CurrentTab");
    if (currentTabRef) {
      var classForCurrentTab = "." + Component.computeCssClassName(currentTabRef);
      $(classForCurrentTab).removeClass("coveo-opening-tab-section");
    }
    if (isPhonegap && DeviceUtils.getDeviceName() == "Android") {
      $(document).off("backbutton");
    }
  }

  function appendClickCancelingOverlay() {
    $('.' + Component.computeCssClassName(SearchInterface)).append(clickCancelingOverlay);
  }

  export function hideIOSKeyboard(activeElement) {
    $(window).focus();
    $(activeElement).blur();
  }

  function hideIOSKeyboardOnWindowClick() {
    if (DeviceUtils.isIos()) {
      $(window).on('touchstart', (e) => {
        if (!$(e.target).is('input') && $(document.activeElement).is('input')) {
          MobileUtils.hideIOSKeyboard(document.activeElement);
        }
      });
    }
  }

  function initMobileUtils() {
    if (DeviceUtils.isMobileDevice()) {
      $(() => appendClickCancelingOverlay());
      hideIOSKeyboardOnWindowClick();
    }
  }

  initMobileUtils();
}
