var Coveo;
(function (Coveo) {
  var ModalBox;
  (function (ModalBox) {
    /**
     * The button to use when creating a ModalBox
     */
    (function (BUTTON) {
      BUTTON[(BUTTON['OK'] = 1)] = 'OK';
      BUTTON[(BUTTON['APPLY'] = 2)] = 'APPLY';
      BUTTON[(BUTTON['YES'] = 4)] = 'YES';
      BUTTON[(BUTTON['NO'] = 8)] = 'NO';
      BUTTON[(BUTTON['CANCEL'] = 16)] = 'CANCEL';
    })(ModalBox.BUTTON || (ModalBox.BUTTON = {}));
    var BUTTON = ModalBox.BUTTON;
    var closeFunctions = [];
    /**
     * Open a modal box with the given content
     * @param content The content to display, as an HTMLElement
     * @param options The {@link Options} to use for this modal box
     * @returns {{modalBox: (HTMLDivElement|HTMLElement), overlay: (HTMLDivElement|HTMLElement), wrapper: (HTMLDivElement|HTMLElement), buttons: HTMLElement, content: HTMLElement, close: (function(BUTTON=, boolean=): (boolean|boolean))}}
     */
    function open(content, options) {
      if (options === void 0) {
        options = {};
      }
      var body = options.body || document.body;
      if (body.className) {
        if (body.className.indexOf('coveo-modal-opened') == -1) {
          body.className += ' coveo-modal-opened';
        }
      } else {
        body.className = 'coveo-modal-opened';
      }
      var modalBox = document.createElement('div');
      modalBox.className = 'coveo-modal-container coveo-opened ';
      if (options.sizeMod == 'small') {
        modalBox.className += ' coveo-mod-small';
      }
      if (options.sizeMod == 'big') {
        modalBox.className += ' coveo-mod-big';
      }
      setTimeout(function () {
        modalBox.className += ' coveo-mod-fade-in-scale';
      }, 0);
      body.appendChild(modalBox);
      if (options.fullscreen === true) {
        modalBox.className += ' coveo-fullscreen';
      }
      var overlay = document.createElement('div');
      overlay.className = 'coveo-modal-backdrop coveo-modal-transparent';
      body.appendChild(overlay);
      setTimeout(function () {
        removeClassName(overlay, 'coveo-modal-transparent');
      }, 0);
      var modalBoxContent = document.createElement('div');
      modalBoxContent.className = 'coveo-modal-content';
      modalBox.appendChild(modalBoxContent);
      var close = function (button, forceClose) {
        if (button === void 0) {
          button = 0;
        }
        if (forceClose === void 0) {
          forceClose = false;
        }
        var valid = options.validation == null || options.validation(button);
        if (valid !== false || forceClose) {
          modalBox.parentElement && modalBox.parentElement.removeChild(modalBox);
          var index = closeFunctions.indexOf(close);
          if (index >= 0) {
            closeFunctions.splice(index, 1);
          }
          if (body.querySelector('.coveo-modal-container') == null) {
            removeClassName(body, 'coveo-modal-opened');
          }
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
          document.removeEventListener('keyup', closeOnEscape);
          return true;
        }
        return false;
      };
      var _a = buildHeader(options, close),
        header = _a.header,
        closeIcon = _a.closeIcon;
      modalBoxContent.appendChild(header);
      modalBoxContent.appendChild(buildBody(options, content));
      closeIcon.addEventListener('click', function () {
        close();
      });
      overlay.addEventListener('click', function () {
        close();
      });
      var closeOnEscape = function (e) {
        if (e.keyCode == 27 && body.className.indexOf('coveo-modal-opened') != -1) {
          close();
        }
      };
      document.addEventListener('keyup', closeOnEscape);
      var buttonsContainer;
      var buildButton = function (text, type) {
        var btn = document.createElement('button');
        btn.className = 'coveo-btn';
        btn.textContent = text;
        btn.addEventListener('click', function () {
          return close(type);
        });
        buttonsContainer.appendChild(btn);
      };
      if (options.buttons != null) {
        buttonsContainer = document.createElement('footer');
        buttonsContainer.className = 'coveo-modal-footer';
        modalBoxContent.appendChild(buttonsContainer);
        if (options.buttons & BUTTON.OK) {
          buildButton('Ok', BUTTON.OK);
        }
        if (options.buttons & BUTTON.APPLY) {
          buildButton('Apply', BUTTON.APPLY);
        }
        if (options.buttons & BUTTON.YES) {
          buildButton('Yes', BUTTON.YES);
        }
        if (options.buttons & BUTTON.NO) {
          buildButton('No', BUTTON.NO);
        }
        if (options.buttons & BUTTON.CANCEL) {
          buildButton('Cancel', BUTTON.CANCEL);
        }
      }
      closeFunctions.push(close);
      if (options.className != null) {
        modalBox.className += ' ' + options.className;
      }
      return {
        modalBox: modalBox,
        wrapper: modalBoxContent,
        buttons: buttonsContainer,
        content: modalBoxContent,
        overlay: overlay,
        close: close
      };
    }
    ModalBox.open = open;
    /**
     * Close all open modal box instance
     * @param forceClose Will skip validation
     */
    function close(forceClose) {
      if (forceClose === void 0) {
        forceClose = false;
      }
      var i = 0;
      while (closeFunctions.length > i) {
        var closed = closeFunctions[i](0, forceClose);
        if (!closed) {
          i++;
        }
      }
    }
    ModalBox.close = close;
    function buildHeader(options, close) {
      var header = document.createElement('header');
      header.className = 'coveo-modal-header';
      if (options.title != null) {
        var title = document.createElement('h1');
        header.appendChild(title);
        if (options.title instanceof HTMLElement) {
          title.appendChild(options.title);
        } else {
          title.innerHTML = options.title;
        }
        if (options.titleClose === true) {
          title.addEventListener('click', function () {
            return close();
          });
        }
      }
      var closeIcon = document.createElement('span');
      closeIcon.className = 'coveo-small-close';
      header.appendChild(closeIcon);
      var svgCloseIcon =
        '<svg viewBox="0 0 22 22" class="coveo-icon coveo-fill-pure-white">\n                    <g transform="matrix(.7071-.7071.7071.7071-3.142 11)">\n                        <path d="m9-3.4h2v26.9h-2z"></path>\n                        <path d="m-3.4 9h26.9v2h-26.9z"></path>\n                    </g>\n                </svg>';
      closeIcon.innerHTML = svgCloseIcon;
      return {
        header: header,
        closeIcon: closeIcon
      };
    }
    function buildBody(options, content) {
      var modalBoxBody = document.createElement('div');
      modalBoxBody.className = 'coveo-modal-body coveo-mod-header-paddding coveo-mod-form-top-bottom-padding';
      modalBoxBody.appendChild(content);
      return modalBoxBody;
    }
    function removeClassName(el, className) {
      el.className = el.className.replace(new RegExp('(^|\\s)' + className + '(\\s|\\b)', 'g'), '$1');
    }
  })((ModalBox = Coveo.ModalBox || (Coveo.ModalBox = {})));
})(Coveo || (Coveo = {}));
