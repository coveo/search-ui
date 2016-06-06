module Coveo {
  if (DeviceUtils.isMobileDevice()) {
    var resize = function() {
      $('html, body').height(window.innerHeight);
      $('html, body').width(window.innerWidth);
      /* Fix for iphone scroll. This force redraw after chanfging orientation */
      $('body').removeClass('coveo-portrait coveo-landscape');
      setTimeout(() => {
        if (window.innerHeight > window.innerWidth) {
          $('body').addClass('coveo-portrait');
        } else {
          $('body').addClass('coveo-landscape');
        }
      })
    };
    $(window).one('orientationchange', () => {
      $(window).on('resize', resize);
      resize();
    });
    resize();
  }
}
