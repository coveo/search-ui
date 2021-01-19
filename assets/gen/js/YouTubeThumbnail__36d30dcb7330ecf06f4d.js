webpackJsonpCoveo__temporary([25,63],{

/***/ 185:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ExternalModulesShim_1 = __webpack_require__(26);
var GlobalExports_1 = __webpack_require__(3);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var Utils_1 = __webpack_require__(4);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var RegisteredNamedMethods_1 = __webpack_require__(30);
var ResultLink_1 = __webpack_require__(92);
var AccessibleModal_1 = __webpack_require__(220);
/**
 * The YouTubeThumbnail component automatically fetches the thumbnail of a YouTube video.
 *
 * This component differs from the standard {@link Thumbnail} component because the thumbnail it outputs is always
 * clickable.
 *
 * Depending on the component configuration, clicking a YouTube thumbnail can either automatically open a modal box
 * containing the `iframe` from YouTube, or open the target URL in the current window (see
 * {@link YouTubeThumbnail.options.embed}).
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
 */
var YouTubeThumbnail = /** @class */ (function (_super) {
    __extends(YouTubeThumbnail, _super);
    function YouTubeThumbnail(element, options, bindings, result, ModalBox, origin) {
        if (ModalBox === void 0) { ModalBox = ExternalModulesShim_1.ModalBox; }
        var _this = _super.call(this, element, YouTubeThumbnail.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.origin = origin;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, YouTubeThumbnail, options);
        _this.resultLink = Dom_1.$$('a', {
            className: Component_1.Component.computeCssClassName(ResultLink_1.ResultLink)
        });
        if (!origin) {
            _this.origin = _this.resultLink.el;
        }
        var thumbnailDiv = Dom_1.$$('div', {
            className: 'coveo-youtube-thumbnail-container'
        });
        _this.resultLink.append(thumbnailDiv.el);
        var img = Dom_1.$$('img', {
            src: Utils_1.Utils.getFieldValue(_this.result, 'ytthumbnailurl'),
            className: 'coveo-youtube-thumbnail-img',
            alt: _this.result.title,
            title: _this.result.title
        });
        img.el.style.width = _this.options.width;
        img.el.style.height = _this.options.height;
        img.el.onerror = function () {
            var svgVideo = Dom_1.$$('div', {}, SVGIcons_1.SVGIcons.icons.video).el;
            SVGDom_1.SVGDom.addStyleToSVGInContainer(svgVideo, {
                width: _this.options.width
            });
            Dom_1.$$(img).remove();
            thumbnailDiv.append(svgVideo);
        };
        thumbnailDiv.append(img.el);
        var span = Dom_1.$$('span', {
            className: 'coveo-youtube-thumbnail-play-button'
        });
        thumbnailDiv.append(span.el);
        Dom_1.$$(_this.element).append(_this.resultLink.el);
        Initialization_1.Initialization.automaticallyCreateComponentsInsideResult(element, result, {
            ResultLink: _this.options.embed ? { onClick: function () { return _this.openYoutubeIframe(); } } : null
        });
        _this.modalbox = new AccessibleModal_1.AccessibleModal('coveo-youtube-player', _this.searchInterface.options.modalContainer, ModalBox, {
            overlayClose: true
        });
        return _this;
    }
    /**
     * Open the result link embedded in this component.
     *
     * With a standard configuration of this component, this will open an iframe that automatically plays the video.
     */
    YouTubeThumbnail.prototype.openResultLink = function () {
        var resultLinkComponent = RegisteredNamedMethods_1.get(this.resultLink.el);
        resultLinkComponent.openLinkAsConfigured();
    };
    YouTubeThumbnail.prototype.openYoutubeIframe = function () {
        var _this = this;
        // need to put iframe inside div : iframe with position absolute and left:0, right : 0 , bottom: 0 is not standard/supported
        var iframe = Dom_1.$$('iframe', {
            src: "https://www.youtube.com/embed/" + this.extractVideoId() + "?autoplay=1",
            allowfullscreen: 'allowfullscreen',
            width: '100%',
            height: '100%',
            title: this.result.title
        });
        var div = Dom_1.$$('div');
        div.append(iframe.el);
        this.modalbox.openResult({
            result: this.result,
            options: { showDate: true, title: this.result.title },
            bindings: this.bindings,
            content: div.el,
            validation: function () { return true; },
            origin: this.origin
        });
        Dom_1.$$(Dom_1.$$(this.modalbox.wrapper).find('.coveo-quickview-close-button')).on('click', function () {
            _this.modalbox.close();
        });
    };
    YouTubeThumbnail.prototype.extractVideoId = function () {
        return this.result.clickUri.split('watch?v=')[1];
    };
    YouTubeThumbnail.ID = 'YouTubeThumbnail';
    YouTubeThumbnail.doExport = function () {
        GlobalExports_1.exportGlobally({
            YouTubeThumbnail: YouTubeThumbnail
        });
    };
    /**
     * @componentOptions
     */
    YouTubeThumbnail.options = {
        /**
         * Specifies the width (in pixels) of the YouTube thumbnail.
         *
         * Default value is `200px`.
         */
        width: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '200px' }),
        /**
         * Specifies the height (in pixels) of the YouTube thumbnail.
         *
         * Default value is `112px`.
         */
        height: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '112px' }),
        /**
         * Specifies whether clicking on the YouTube thumbnail loads the video in a modal box.
         *
         * Setting this option to `false` causes the browser to change its current location to that of the target URL when
         * the end user clicks the YouTube thumbnail.
         *
         * Default value is `true`.
         */
        embed: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return YouTubeThumbnail;
}(Component_1.Component));
exports.YouTubeThumbnail = YouTubeThumbnail;
Initialization_1.Initialization.registerAutoCreateComponent(YouTubeThumbnail);


/***/ }),

/***/ 220:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ExternalModulesShim_1 = __webpack_require__(26);
var FocusTrap_1 = __webpack_require__(465);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var KeyboardUtils_1 = __webpack_require__(25);
var Core_1 = __webpack_require__(20);
var AccessibleModal = /** @class */ (function () {
    function AccessibleModal(className, ownerElement, modalboxModule, options) {
        if (modalboxModule === void 0) { modalboxModule = ExternalModulesShim_1.ModalBox; }
        if (options === void 0) { options = {}; }
        this.className = className;
        this.ownerElement = ownerElement;
        this.modalboxModule = modalboxModule;
        this.options = __assign({
            sizeMod: 'big'
        }, options);
    }
    Object.defineProperty(AccessibleModal.prototype, "isOpen", {
        get: function () {
            return !!this.focusTrap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccessibleModal.prototype, "element", {
        get: function () {
            return this.activeModal && this.activeModal.modalBox;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccessibleModal.prototype, "content", {
        get: function () {
            return this.activeModal && this.activeModal.content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccessibleModal.prototype, "wrapper", {
        get: function () {
            return this.activeModal && this.activeModal.wrapper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccessibleModal.prototype, "headerElement", {
        get: function () {
            return this.element && this.element.querySelector('.coveo-modal-header h1');
        },
        enumerable: true,
        configurable: true
    });
    AccessibleModal.prototype.openResult = function (parameters) {
        if (this.isOpen) {
            return;
        }
        this.openModalAndTrap({
            content: parameters.content,
            validation: parameters.validation,
            origin: parameters.origin,
            title: Core_1.DomUtils.getQuickviewHeader(parameters.result, parameters.options, parameters.bindings).el
        });
        this.makeAccessible(parameters.options.title || parameters.result.title);
    };
    AccessibleModal.prototype.open = function (parameters) {
        if (this.isOpen) {
            return;
        }
        this.openModalAndTrap(parameters);
        this.makeAccessible();
    };
    AccessibleModal.prototype.openModalAndTrap = function (parameters) {
        var _this = this;
        this.initiallyFocusedElement = parameters.origin || document.activeElement;
        this.activeModal = this.modalboxModule.open(parameters.content, {
            title: parameters.title,
            className: this.className,
            validation: function () {
                _this.onModalClose();
                return parameters.validation();
            },
            body: this.ownerElement,
            sizeMod: this.options.sizeMod,
            overlayClose: this.options.overlayClose
        });
        this.focusTrap = new FocusTrap_1.FocusTrap(this.element);
    };
    AccessibleModal.prototype.close = function () {
        if (!this.isOpen) {
            return;
        }
        this.activeModal.close();
        this.activeModal = null;
    };
    AccessibleModal.prototype.makeAccessible = function (title) {
        this.element.setAttribute('aria-modal', 'true');
        if (title) {
            this.headerElement.setAttribute('aria-label', title);
        }
        this.makeCloseButtonAccessible();
    };
    AccessibleModal.prototype.makeCloseButtonAccessible = function () {
        var closeButton = this.element.querySelector('.coveo-small-close');
        closeButton.setAttribute('aria-label', Strings_1.l('Close'));
        closeButton.setAttribute('role', 'button');
        closeButton.tabIndex = 0;
        closeButton.focus();
        Dom_1.$$(closeButton).on('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, function () { return closeButton.click(); }));
    };
    AccessibleModal.prototype.onModalClose = function () {
        this.focusTrap.disable();
        this.focusTrap = null;
        if (this.initiallyFocusedElement && document.body.contains(this.initiallyFocusedElement)) {
            this.initiallyFocusedElement.focus();
        }
    };
    return AccessibleModal;
}());
exports.AccessibleModal = AccessibleModal;


/***/ }),

/***/ 465:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Defer_1 = __webpack_require__(31);
var underscore_1 = __webpack_require__(0);
var Dom_1 = __webpack_require__(1);
var FocusTrap = /** @class */ (function () {
    function FocusTrap(container) {
        this.container = container;
        this.hiddenElements = [];
        this.enable();
    }
    Object.defineProperty(FocusTrap.prototype, "focusableElements", {
        get: function () {
            return underscore_1.sortBy(this.container.querySelectorAll('[tabindex]'), function (element) { return element.tabIndex; });
        },
        enumerable: true,
        configurable: true
    });
    FocusTrap.prototype.disable = function () {
        document.removeEventListener('focusin', this.focusInEvent);
        document.removeEventListener('focusout', this.focusOutEvent);
        this.showHiddenElements();
        this.enabled = false;
    };
    FocusTrap.prototype.enable = function () {
        var _this = this;
        document.addEventListener('focusin', (this.focusInEvent = function (e) { return _this.onFocusIn(e); }));
        document.addEventListener('focusout', (this.focusOutEvent = function (e) { return _this.onFocusOut(e); }));
        this.hideAllExcept(this.container);
        this.enabled = true;
    };
    FocusTrap.prototype.showHiddenElements = function () {
        while (this.hiddenElements.length) {
            this.hiddenElements.pop().removeAttribute('aria-hidden');
        }
    };
    FocusTrap.prototype.hideElement = function (element) {
        if (element.getAttribute('aria-hidden')) {
            return;
        }
        this.hiddenElements.push(element);
        element.setAttribute('aria-hidden', "" + true);
    };
    FocusTrap.prototype.hideSiblings = function (allowedElement) {
        var _this = this;
        var parent = allowedElement.parentElement;
        if (parent) {
            underscore_1.without(Dom_1.$$(parent).children(), allowedElement).forEach(function (elementToHide) {
                _this.hideElement(elementToHide);
            });
        }
    };
    FocusTrap.prototype.hideAllExcept = function (allowedElement) {
        this.hideSiblings(allowedElement);
        var parent = allowedElement.parentElement;
        if (parent && parent !== document.body) {
            this.hideAllExcept(parent);
        }
    };
    FocusTrap.prototype.getFocusableSibling = function (element, previous) {
        if (previous === void 0) { previous = false; }
        var elements = this.focusableElements;
        var currentIndex = elements.indexOf(element);
        if (currentIndex === -1) {
            return null;
        }
        return elements[(currentIndex + (previous ? -1 : 1) + elements.length) % elements.length];
    };
    FocusTrap.prototype.focusSibling = function (element, previous) {
        if (previous === void 0) { previous = false; }
        var sibling = this.getFocusableSibling(element, previous);
        if (sibling) {
            sibling.focus();
        }
    };
    FocusTrap.prototype.focusFirstElement = function () {
        var elements = this.focusableElements;
        if (elements.length) {
            elements[0].focus();
        }
    };
    FocusTrap.prototype.elementIsBefore = function (oldElement, newElement) {
        if (!newElement) {
            return false;
        }
        return oldElement.compareDocumentPosition(newElement) === Node.DOCUMENT_POSITION_PRECEDING;
    };
    FocusTrap.prototype.onLosingFocus = function (oldElement, newElement) {
        var _this = this;
        Defer_1.Defer.defer(function () {
            if (!_this.enabled) {
                return;
            }
            _this.enabled = false;
            if (oldElement && _this.focusIsAllowed(oldElement)) {
                _this.focusSibling(oldElement, _this.elementIsBefore(oldElement, newElement));
            }
            else {
                _this.focusFirstElement();
            }
            _this.enabled = true;
        });
    };
    FocusTrap.prototype.focusIsAllowed = function (element) {
        return this.container.contains(element);
    };
    FocusTrap.prototype.elementIsInPage = function (element) {
        return element && element !== document.body.parentElement;
    };
    FocusTrap.prototype.onFocusIn = function (e) {
        if (!this.enabled) {
            return;
        }
        var oldElement = e.relatedTarget;
        var handledByFocusOut = this.elementIsInPage(oldElement);
        if (handledByFocusOut) {
            return;
        }
        var newElement = e.target;
        if (!this.elementIsInPage(newElement)) {
            return;
        }
        if (!this.focusIsAllowed(newElement)) {
            this.onLosingFocus(null, newElement);
        }
    };
    FocusTrap.prototype.onFocusOut = function (e) {
        if (!this.enabled) {
            return;
        }
        var newElement = e.relatedTarget;
        if (!this.elementIsInPage(newElement)) {
            return;
        }
        if (!newElement || !this.focusIsAllowed(newElement)) {
            this.onLosingFocus(e.target, newElement);
        }
    };
    return FocusTrap;
}());
exports.FocusTrap = FocusTrap;


/***/ }),

/***/ 532:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 92:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var ComponentOptionsModel_1 = __webpack_require__(28);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var ResultListEvents_1 = __webpack_require__(29);
var HighlightUtils_1 = __webpack_require__(68);
var DeviceUtils_1 = __webpack_require__(24);
var OSUtils_1 = __webpack_require__(181);
var Initialization_1 = __webpack_require__(2);
var QueryUtils_1 = __webpack_require__(21);
var Assert_1 = __webpack_require__(5);
var Utils_1 = __webpack_require__(4);
var Defer_1 = __webpack_require__(31);
var Dom_1 = __webpack_require__(1);
var StreamHighlightUtils_1 = __webpack_require__(114);
var StringUtils_1 = __webpack_require__(22);
var underscore_1 = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(532);
var AccessibleButton_1 = __webpack_require__(15);
/**
 * The `ResultLink` component automatically transform a search result title into a clickable link pointing to the
 * original item.
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
 */
var ResultLink = /** @class */ (function (_super) {
    __extends(ResultLink, _super);
    /**
     * Creates a new `ResultLink` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `ResultLink` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     * @param os
     */
    function ResultLink(element, options, bindings, result, os) {
        var _this = _super.call(this, element, ResultLink.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.os = os;
        _this.logOpenDocument = underscore_1.debounce(function () {
            _this.queryController.saveLastQuery();
            var documentURL = Dom_1.$$(_this.element).getAttribute('href');
            if (documentURL == undefined || documentURL == '') {
                documentURL = _this.escapedClickUri;
            }
            _this.usageAnalytics.logClickEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.documentOpen, {
                documentURL: documentURL,
                documentTitle: _this.result.title,
                author: Utils_1.Utils.getFieldValue(_this.result, 'author')
            }, _this.result, _this.root);
            Defer_1.Defer.flush();
        }, 1500, true);
        var initialOptions = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultLink, options);
        var resultLinkOptions = _this.componentOptionsModel.get(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.resultLink);
        _this.options = underscore_1.extend({}, initialOptions, resultLinkOptions);
        _this.result = result || _this.resolveResult();
        if (_this.options.openQuickview == null) {
            _this.options.openQuickview = result.raw['connectortype'] == 'ExchangeCrawler' && DeviceUtils_1.DeviceUtils.isMobileDevice();
        }
        _this.element.setAttribute('tabindex', '0');
        Assert_1.Assert.exists(_this.componentOptionsModel);
        Assert_1.Assert.exists(_this.result);
        if (!_this.quickviewShouldBeOpened()) {
            // Bind on multiple "click" or "mouse" events.
            // Create a function that will be executed only once, so as not to log multiple events
            // Once a result link has been opened, and that we log at least one analytics event,
            // it should not matter if the end user open the same link multiple times with different methods.
            // It's still only one "click" event as far as UA is concerned.
            // Also need to handle "longpress" on mobile (the contextual menu), which we assume to be 1 s long.
            var executeOnlyOnce_1 = underscore_1.once(function () { return _this.logOpenDocument(); });
            Dom_1.$$(element).on(['contextmenu', 'click', 'mousedown', 'mouseup'], executeOnlyOnce_1);
            var longPressTimer_1;
            Dom_1.$$(element).on('touchstart', function () {
                longPressTimer_1 = window.setTimeout(executeOnlyOnce_1, 1000);
            });
            Dom_1.$$(element).on('touchend', function () {
                if (longPressTimer_1) {
                    clearTimeout(longPressTimer_1);
                }
            });
        }
        _this.renderUri(element, result);
        _this.bindEventToOpen();
        return _this;
    }
    ResultLink.prototype.renderUri = function (element, result) {
        if (/^\s*$/.test(this.element.innerHTML)) {
            var title = this.getDisplayedTitle();
            this.element.innerHTML = title;
            if (!this.element.title) {
                this.element.title = this.getDisplayedTitleAsText();
            }
        }
    };
    /**
     * Opens the result in the same window, no matter how the actual component is configured for the end user.
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLink = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (logAnalytics) {
            this.logOpenDocument();
        }
        window.location.href = this.getResultUri();
    };
    /**
     * Opens the result in a new window, no matter how the actual component is configured for the end user.
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLinkInNewWindow = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (logAnalytics) {
            this.logOpenDocument();
        }
        window.open(this.getResultUri(), '_blank');
    };
    /**
     * Tries to open the result in Microsoft Outlook if the result has an `outlookformacuri` or `outlookuri` field.
     *
     * Normally, this implies the result should be a link to an email.
     *
     * If the needed fields are not present, this method does nothing.
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLinkInOutlook = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (this.hasOutlookField()) {
            if (logAnalytics) {
                this.logOpenDocument();
            }
            this.openLink();
        }
    };
    /**
     * Opens the link in the same manner the end user would.
     *
     * This essentially simulates a click on the result link.
     *
     * @param logAnalytics Specifies whether the method should log an analytics event.
     */
    ResultLink.prototype.openLinkAsConfigured = function (logAnalytics) {
        if (logAnalytics === void 0) { logAnalytics = true; }
        if (this.toExecuteOnOpen) {
            if (logAnalytics) {
                this.logOpenDocument();
            }
            this.toExecuteOnOpen();
        }
    };
    ResultLink.prototype.bindEventToOpen = function () {
        return (this.bindOnClickIfNotUndefined() ||
            this.bindOpenQuickviewIfNotUndefined() ||
            this.setHrefIfNotAlready() ||
            this.openLinkThatIsNotAnAnchor());
    };
    ResultLink.prototype.getDisplayedTitle = function () {
        if (!this.options.titleTemplate) {
            return this.result.title
                ? HighlightUtils_1.HighlightUtils.highlightString(this.result.title, this.result.titleHighlights, null, 'coveo-highlight')
                : this.escapedClickUri;
        }
        else {
            var newTitle = StringUtils_1.StringUtils.buildStringTemplateFromResult(this.options.titleTemplate, this.result);
            return newTitle
                ? StreamHighlightUtils_1.StreamHighlightUtils.highlightStreamText(newTitle, this.result.termsToHighlight, this.result.phrasesToHighlight)
                : this.escapedClickUri;
        }
    };
    ResultLink.prototype.getDisplayedTitleAsText = function () {
        var container = Dom_1.$$('div');
        container.setHtml(this.getDisplayedTitle());
        return container.text();
    };
    Object.defineProperty(ResultLink.prototype, "escapedClickUri", {
        get: function () {
            return underscore_1.escape(this.result.clickUri);
        },
        enumerable: true,
        configurable: true
    });
    ResultLink.prototype.bindOnClickIfNotUndefined = function () {
        var _this = this;
        if (this.options.onClick != undefined) {
            this.toExecuteOnOpen = function (e) {
                _this.options.onClick.call(_this, e, _this.result);
            };
            new AccessibleButton_1.AccessibleButton()
                .withElement(this.element)
                .withLabel(this.result.title)
                .withSelectAction(function (e) { return _this.toExecuteOnOpen(e); })
                .build();
            return true;
        }
        else {
            return false;
        }
    };
    ResultLink.prototype.bindOpenQuickviewIfNotUndefined = function () {
        var _this = this;
        if (this.quickviewShouldBeOpened()) {
            this.toExecuteOnOpen = function () {
                Dom_1.$$(_this.bindings.resultElement).trigger(ResultListEvents_1.ResultListEvents.openQuickview);
            };
            Dom_1.$$(this.element).on('click', function (e) {
                e.preventDefault();
                _this.toExecuteOnOpen();
            });
            return true;
        }
        else {
            return false;
        }
    };
    ResultLink.prototype.openLinkThatIsNotAnAnchor = function () {
        var _this = this;
        if (!this.elementIsAnAnchor()) {
            this.toExecuteOnOpen = function () {
                if (_this.options.alwaysOpenInNewWindow) {
                    if (_this.options.openInOutlook) {
                        _this.openLinkInOutlook();
                    }
                    else {
                        _this.openLinkInNewWindow();
                    }
                }
                else {
                    _this.openLink();
                }
            };
            Dom_1.$$(this.element).on('click', function () {
                _this.toExecuteOnOpen();
            });
            return true;
        }
        return false;
    };
    ResultLink.prototype.setHrefIfNotAlready = function () {
        // Do not erase any value put in href by the template, etc. Allows
        // using custom click urls while still keeping analytics recording
        // and other behavior brought by the component.
        if (this.elementIsAnAnchor() && !Utils_1.Utils.isNonEmptyString(Dom_1.$$(this.element).getAttribute('href'))) {
            Dom_1.$$(this.element).setAttribute('href', this.getResultUri());
            if (this.options.alwaysOpenInNewWindow && !(this.options.openInOutlook && this.hasOutlookField())) {
                Dom_1.$$(this.element).setAttribute('target', '_blank');
            }
            return true;
        }
        else {
            return false;
        }
    };
    ResultLink.prototype.filterProtocol = function (uri) {
        var isAbsolute = /^(https?|ftp|file|mailto|tel):/i.test(uri);
        var isRelative = /^\//.test(uri);
        return isAbsolute || isRelative ? uri : '';
    };
    ResultLink.prototype.getResultUri = function () {
        if (this.options.hrefTemplate) {
            var uri = StringUtils_1.StringUtils.buildStringTemplateFromResult(this.options.hrefTemplate, this.result);
            return this.filterProtocol(uri);
        }
        if (this.options.field == undefined && this.options.openInOutlook) {
            this.setField();
        }
        if (this.options.field != undefined) {
            return this.filterProtocol(Utils_1.Utils.getFieldValue(this.result, this.options.field));
        }
        return this.filterProtocol(this.result.clickUri);
    };
    ResultLink.prototype.elementIsAnAnchor = function () {
        return this.element.tagName == 'A';
    };
    ResultLink.prototype.setField = function () {
        var os = Utils_1.Utils.exists(this.os) ? this.os : OSUtils_1.OSUtils.get();
        if (os == OSUtils_1.OS_NAME.MACOSX && this.hasOutlookField()) {
            this.options.field = '@outlookformacuri';
        }
        else if (os == OSUtils_1.OS_NAME.WINDOWS && this.hasOutlookField()) {
            this.options.field = '@outlookuri';
        }
    };
    ResultLink.prototype.hasOutlookField = function () {
        var os = Utils_1.Utils.exists(this.os) ? this.os : OSUtils_1.OSUtils.get();
        if (os == OSUtils_1.OS_NAME.MACOSX && this.result.raw['outlookformacuri'] != undefined) {
            return true;
        }
        else if (os == OSUtils_1.OS_NAME.WINDOWS && this.result.raw['outlookuri'] != undefined) {
            return true;
        }
        return false;
    };
    ResultLink.prototype.isUriThatMustBeOpenedInQuickview = function () {
        return this.escapedClickUri.toLowerCase().indexOf('ldap://') == 0;
    };
    ResultLink.prototype.quickviewShouldBeOpened = function () {
        return (this.options.openQuickview || this.isUriThatMustBeOpenedInQuickview()) && QueryUtils_1.QueryUtils.hasHTMLVersion(this.result);
    };
    ResultLink.ID = 'ResultLink';
    ResultLink.doExport = function () {
        GlobalExports_1.exportGlobally({
            ResultLink: ResultLink
        });
    };
    /**
     * The options for the ResultLink
     * @componentOptions
     */
    ResultLink.options = {
        /**
         * Specifies the field to use to output the component `href` attribute value.
         *
         * **Tip:**
         * > Instead of specifying a value for the `field` option, you can directly add an `href` attribute to the
         * > `ResultLink` HTML element. Then, you can use a custom script to generate the `href` value.
         *
         * **Examples:**
         * - With the following markup, the `ResultLink` outputs its `href` value using the `@uri` field (rather than the
         * default field):
         *
         * ```html
         * <a class="CoveoResultLink" data-field="@uri"></a>
         * ```
         *
         * - In the following result template, the custom `getMyKBUri()` function provides the `href` value:
         *
         * ```html
         * <script id="KnowledgeArticle" type="text/underscore" class="result-template">
         *   <div class='CoveoIcon>'></div>
         *   <a class="CoveoResultLink" href="<%= getMyKBUri(raw) %>"></a>
         *   <div class="CoveoExcerpt"></div>
         * </script>
         * ```
         *
         * See also [`hrefTemplate`]{@link ResultLink.options.hrefTemplate}, which can override this option.
         *
         * By default, the component uses the `@clickUri` field of the item to output the value of its `href` attribute.
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption(),
        /**
         * Specifies whether the component should try to open its link in Microsoft Outlook.
         *
         * Setting this option to `true` is normally useful for `ResultLink` instances related to Microsoft Exchange emails.
         *
         * If this option is `true`, clicking the `ResultLink` calls the
         * [`openLinkInOutlook`]{@link ResultLink.openLinkInOutlook} method instead of the
         * [`openLink`]{@link ResultLink.openLink} method.
         *
         * Default value is `false`.
         */
        openInOutlook: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies whether the component should open its link in the [`Quickview`]{@link Quickview} component rather than
         * loading through the original URL.
         *
         * Default value is `false`.
         */
        openQuickview: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies whether the component should open its link in a new window instead of opening it in the current
         * context.
         *
         * If this option is `true`, clicking the `ResultLink` calls the
         * [`openLinkInNewWindow`]{@link ResultLink.openLinkInNewWindow} method instead of the
         * [`openLink`]{@link ResultLink.openLink} method.
         *
         * **Note:**
         * > If a search page contains a [`ResultPreferences`]{@link ResultsPreferences} component whose
         * > [`enableOpenInNewWindow`]{@link ResultsPreferences.options.enableOpenInNewWindow} option is `true`, and the end
         * > user checks the <b>Always open results in new window</b> box, `ResultLink` components in this page will always
         * > open their links in a new window when the end user clicks them, no matter what the value of their
         * > `alwaysOpenInNewWindow` option is.
         *
         * Default value is `false`.
         */
        alwaysOpenInNewWindow: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies a template literal from which to generate the `ResultLink` `href` attribute value (see
         * [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)).
         *
         * This option overrides the [`field`]{@link ResultLink.options.field} option value.
         *
         * The template literal can reference any number of fields from the parent result. It can also reference global
         * scope properties.
         *
         * **Examples:**
         *
         * - The following markup generates an `href` value such as `http://uri.com?id=itemTitle`:
         *
         * ```html
         * <a class='CoveoResultLink' data-href-template='${clickUri}?id=${raw.title}'></a>
         * ```
         *
         * - The following markup generates an `href` value such as `localhost/fooBar`:
         *
         * ```html
         * <a class='CoveoResultLink' data-href-template='${window.location.hostname}/{Foo.Bar}'></a>
         * ```
         *
         * Default value is `undefined`.
         */
        hrefTemplate: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies a template literal from which to generate the `ResultLink` display title (see
         * [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)).
         *
         * This option overrides the default `ResultLink` display title behavior.
         *
         * The template literal can reference any number of fields from the parent result. However, if the template literal
         * references a key whose value is undefined in the parent result fields, the `ResultLink` title displays the
         * name of this key instead.
         *
         * This option is ignored if the `ResultLink` innerHTML contains any value.
         *
         * **Examples:**
         *
         * - The following markup generates a `ResultLink` display title such as `Case number: 123456` if both the
         * `raw.objecttype` and `raw.objectnumber` keys are defined in the parent result fields:
         *
         * ```html
         * <a class="CoveoResultLink" data-title-template="${raw.objecttype} number: ${raw.objectnumber}"></a>
         * ```
         *
         * - The following markup generates `${myField}` as a `ResultLink` display title if the `myField` key is undefined
         * in the parent result fields:
         *
         * ```html
         * <a class="CoveoResultLink" data-title-template="${myField}"></a>
         * ```
         *
         * - The following markup generates `Foobar` as a `ResultLink` display title, because the `ResultLink` innterHTML is
         * not empty:
         *
         * ```html
         * <a class="CoveoResultLink" data-title-template="${will} ${be} ${ignored}">Foobar</a>
         * ```
         *
         * Default value is `undefined`.
         *
         * @availablesince [January 2017 Release (v1.1865.9)](https://docs.coveo.com/en/396/#january-2017-release-v118659)
         */
        titleTemplate: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies an event handler function to execute when the user clicks the `ResultLink` component.
         *
         * The handler function takes a JavaScript [`Event`](https://developer.mozilla.org/en/docs/Web/API/Event) object and
         * an [`IQueryResult`]{@link IQueryResult} as its parameters.
         *
         * Overriding the default behavior of the `onClick` event can allow you to execute specific code instead.
         *
         * **Note:**
         * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
         * > [`init`]{@link init} call of your search interface (see
         * > [Passing Component Options in the init Call](https://docs.coveo.com/en/346/#passing-component-options-in-the-init-call)),
         * > or before the `init` call, using the `options` top-level function (see
         * > [Passing Component Options Before the init Call](https://docs.coveo.com/en/346/#passing-component-options-before-the-init-call)).
         *
         * **Example:**
         * ```javascript
         * // You can set the option in the 'init' call:
         * Coveo.init(document.querySelector("#search"), {
         *   ResultLink : {
         *     onClick : function(e, result) {
         *       e.preventDefault();
         *       // Custom code to execute with the item URI and title.
         *       openUriInASpecialTab(result.clickUri, result.title);
         *     }
         *   }
         * });
         *
         * // Or before the 'init' call, using the 'options' top-level function:
         * // Coveo.options(document.querySelector('#search'), {
         * //   ResultLink : {
         * //     onClick : function(e, result) {
         * //       e.preventDefault();
         * //       // Custom code to execute with the item URI and title.
         * //       openUriInASpecialTab(result.clickUri, result.title);
         * //     }
         * //   }
         * // });
         * ```
         */
        onClick: ComponentOptions_1.ComponentOptions.buildCustomOption(function () {
            return null;
        })
    };
    return ResultLink;
}(Component_1.Component));
exports.ResultLink = ResultLink;
Initialization_1.Initialization.registerAutoCreateComponent(ResultLink);


/***/ })

});
//# sourceMappingURL=YouTubeThumbnail__36d30dcb7330ecf06f4d.js.map