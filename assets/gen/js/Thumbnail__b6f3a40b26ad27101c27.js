webpackJsonpCoveo__temporary([34,63,81],{

/***/ 188:
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
var Assert_1 = __webpack_require__(5);
var QueryUtils_1 = __webpack_require__(21);
var Initialization_1 = __webpack_require__(2);
var Utils_1 = __webpack_require__(4);
var FileTypes_1 = __webpack_require__(113);
var Dom_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
var TemplateFieldsEvaluator_1 = __webpack_require__(132);
/**
 * The Icon component outputs the corresponding icon for a given file type. The component searches for a suitable icon
 * from those available in the Coveo JavaScript Search Framework. If the component finds no suitable icon, it instead
 * outputs a generic icon.
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
 */
var Icon = /** @class */ (function (_super) {
    __extends(Icon, _super);
    /**
     * Creates a new Icon component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Icon component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function Icon(element, options, bindings, result) {
        var _this = _super.call(this, element, Icon.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Icon, options);
        _this.result = _this.result || _this.resolveResult();
        Assert_1.Assert.exists(_this.result);
        if (TemplateFieldsEvaluator_1.TemplateFieldsEvaluator.evaluateFieldsToMatch(_this.options.conditions, _this.result)) {
            _this.initialize(element, bindings);
        }
        else if (_this.element.parentElement != null) {
            _this.element.parentElement.removeChild(_this.element);
        }
        return _this;
    }
    Icon.prototype.initialize = function (element, bindings) {
        var possibleInternalQuickview = Dom_1.$$(this.element).find('.' + Component_1.Component.computeCssClassNameForType('Quickview'));
        if (!Utils_1.Utils.isNullOrUndefined(possibleInternalQuickview) && QueryUtils_1.QueryUtils.hasHTMLVersion(this.result)) {
            Dom_1.$$(this.element).addClass('coveo-with-quickview');
            Dom_1.$$(this.element).on('click', function () {
                var qv = Component_1.Component.get(possibleInternalQuickview);
                qv.open();
            });
        }
        Icon.createIcon(this.result, this.options, element, bindings);
    };
    Icon.createIcon = function (result, options, element, bindings) {
        if (options === void 0) { options = {}; }
        if (element === void 0) { element = Dom_1.$$('div').el; }
        var info = FileTypes_1.FileTypes.get(result);
        if (!bindings && result.searchInterface) {
            // try to resolve results bindings automatically
            bindings = result.searchInterface.getBindings();
        }
        info = Icon.preprocessIconInfo(options, info);
        Dom_1.$$(element).toggleClass('coveo-small', options.small === true);
        if (options.value != undefined) {
            if (options.small === true) {
                if (options.value.indexOf('-small') == -1) {
                    info.icon += '-small';
                }
            }
            if (options.small === false) {
                if (options.value.indexOf('-small') != -1) {
                    info.icon = info.icon.replace('-small', '');
                }
            }
        }
        Dom_1.$$(element).addClass(info.icon);
        element.setAttribute('title', info.caption);
        if (Icon.shouldDisplayLabel(options, bindings)) {
            element.appendChild(Dom_1.$$('span', {
                className: 'coveo-icon-caption-overlay'
            }, info.caption).el);
            Dom_1.$$(element).addClass('coveo-icon-with-caption-overlay');
            Dom_1.$$(element).setAttribute('data-with-label', 'true');
        }
        return element;
    };
    Icon.shouldDisplayLabel = function (options, bindings) {
        // If withLabel is explicitely set to false, the label will never display
        // If withLabel is explicitely set to true, the label will always display
        // If withLabel is set to default value (not a hard true or false), the label will display based on ./core/filetypes/**.json
        // with the property shouldDisplayLabel set on each file type/ objecttype
        // In this case, the generated css will take care of outputting the correct css to display : block
        return options.withLabel !== false;
    };
    Icon.preprocessIconInfo = function (options, info) {
        if (options.labelValue != null) {
            info.caption = options.labelValue;
        }
        if (options.value != null) {
            info.icon = 'coveo-icon ' + options.value;
        }
        if (info.caption == null) {
            info.caption = '';
        }
        if (info.icon == null) {
            info.icon = 'coveo-icon coveo-sprites-custom';
        }
        return info;
    };
    Icon.ID = 'Icon';
    Icon.doExport = function () {
        GlobalExports_1.exportGlobally({
            Icon: Icon
        });
    };
    /**
     * The options for the Icon
     * @componentOptions
     */
    Icon.options = {
        /**
         * Specifies the value that the Icon component should output as its CSS class instead of the auto-selected value.
         *
         * Default value is `undefined`, which means that the Coveo JavaScript Search Framework outputs a suitable icon
         * depending on the result file type.
         */
        value: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies whether the Icon component should output the smaller version of the icon instead of the regular one.
         *
         * Default value is `undefined`.
         */
        small: ComponentOptions_1.ComponentOptions.buildBooleanOption(),
        /**
         * Specifies whether the Icon component should force the output icon to display its caption/label.
         *
         * **Note:**
         *
         * > Due to limited screen real estate, setting this option to `true` has no effect on icons used inside Coveo for
         * > Salesforce Insight Panels.
         *
         * Default value is `undefined`, which means that the Coveo JavaScript Search Framework determines whether the icon
         * needs to display a caption/label depending on the result file type.
         */
        withLabel: ComponentOptions_1.ComponentOptions.buildBooleanOption(),
        /**
         * Specifies what text to display as the icon caption/label.
         *
         * Default value is `undefined`, which means that the Coveo JavaScript Search Framework determines what text the icon
         * needs to display depending on the result file type.
         */
        labelValue: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption(),
        /**
         * A field-based condition that must be satisfied by the query result item for the component to be rendered.
         *
         * Note: This option uses a distinctive markup configuration syntax allowing multiple conditions to be expressed. Its underlying logic is the same as that of the field value conditions mechanism used by result templates.
         *
         * **Examples:**
         * Render the component if the query result item's @documenttype field value is Article or Documentation.
         * ```html
         * <div class="CoveoIcon" data-field="@author" data-condition-field-documenttype="Article, Documentation"></div>
         * ```
         *
         * Render the component if the query result item's @documenttype field value is anything but Case.
         * ```html
         * <div class="CoveoIcon" data-field="@author" data-condition-field-not-documenttype="Case"></div>
         * ```
         * Render the component if the query result item's @documenttype field value is Article, and if its @author field value is anything but Anonymous.
         * ```html
         * <div class="CoveoIcon" data-field="@author" data-condition-field-documenttype="Article" data-condition-field-not-author="Anonymous"></div>
         * ```
         * Default value is `undefined`.
         */
        conditions: ComponentOptions_1.ComponentOptions.buildFieldConditionOption()
    };
    return Icon;
}(Component_1.Component));
exports.Icon = Icon;
Initialization_1.Initialization.registerAutoCreateComponent(Icon);


/***/ }),

/***/ 283:
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
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var Dom_1 = __webpack_require__(1);
var QueryUtils_1 = __webpack_require__(21);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var RegisteredNamedMethods_1 = __webpack_require__(30);
var Icon_1 = __webpack_require__(188);
var ResultLink_1 = __webpack_require__(92);
var Strings_1 = __webpack_require__(6);
/**
 * The Thumbnail component automatically fetches the thumbnail of the result object and outputs an HTML `img` tag with
 * it.
 * @notSupportedIn salesforcefree
 */
var Thumbnail = /** @class */ (function (_super) {
    __extends(Thumbnail, _super);
    /**
     * Creates a new Thumbnail component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Thumbnail component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function Thumbnail(element, options, bindings, result) {
        var _this = _super.call(this, element, Thumbnail.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initOptions(element, Thumbnail.options, options, Thumbnail.ID);
        if (_this.element.tagName.toLowerCase() != 'img') {
            _this.img = Dom_1.$$('img').el;
            _this.element.appendChild(_this.img);
        }
        else {
            _this.img = _this.element;
        }
        if (_this.options.clickable) {
            if (_this.element.tagName.toLowerCase() != 'img') {
                new ResultLink_1.ResultLink(_this.element, _this.options, _this.bindings, _this.result);
            }
            else {
                var href = Dom_1.$$('a');
                Dom_1.$$(_this.element).replaceWith(href.el);
                Dom_1.$$(href).append(_this.element);
                new ResultLink_1.ResultLink(href.el, _this.options, _this.bindings, _this.result);
            }
        }
        // We need to set src to a blank image right away to avoid the image from
        // changing size once it's loaded. Also, doing this prevents a border from
        // appearing on some browsers when there is no thumbnail. I've found no other
        // way to get rid of it...
        _this.img.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
        if (QueryUtils_1.QueryUtils.hasThumbnail(result)) {
            _this.buildThumbnailImage();
        }
        else {
            _this.logger.info('Result has no thumbnail. Cannot build thumbnail image, instanciating an Icon component instead.');
            var icn = new Icon_1.Icon(Dom_1.$$('div').el, { small: true }, bindings, result);
            Dom_1.$$(_this.element).replaceWith(icn.element);
        }
        return _this;
    }
    Thumbnail.prototype.buildThumbnailImage = function () {
        var endpoint = this.bindings.queryController.getEndpoint();
        if (endpoint.isJsonp()) {
            // For jsonp we can't GET/POST for binary data. We are limited
            // to only setting the src attribute directly on the img.
            this.buildImageWithDirectSrcAttribute(endpoint);
        }
        else {
            // Base 64 img allows us to GET/POST the image as raw binary, so that we can also
            // pass the credential of the user. Useful for phonegap among others.
            this.buildImageWithBase64SrcAttribute(endpoint);
        }
        this.makeAccessible();
    };
    Thumbnail.prototype.buildImageWithDirectSrcAttribute = function (endpoint) {
        var dataStreamUri = endpoint.getViewAsDatastreamUri(this.result.uniqueId, '$Thumbnail$', {
            contentType: 'image/png'
        });
        this.img.setAttribute('src', dataStreamUri);
        this.resizeContainingFieldTable();
    };
    Thumbnail.prototype.buildImageWithBase64SrcAttribute = function (endpoint) {
        var _this = this;
        endpoint
            .getRawDataStream(this.result.uniqueId, '$Thumbnail$')
            .then(function (response) {
            var rawBinary = String.fromCharCode.apply(null, new Uint8Array(response));
            _this.img.setAttribute('src', 'data:image/png;base64, ' + btoa(rawBinary));
            _this.resizeContainingFieldTable();
        })
            .catch(function () {
            _this.setEmptyThumbnailClass();
        });
    };
    Thumbnail.prototype.makeAccessible = function () {
        this.img.setAttribute('alt', Strings_1.l('ThumbnailOf', this.result.title));
    };
    Thumbnail.prototype.resizeContainingFieldTable = function () {
        var className = Component_1.Component.computeCssClassNameForType('FieldTable');
        var closestFieldTableElement = Dom_1.$$(this.element).closest(className);
        if (closestFieldTableElement != null) {
            var fieldTable = RegisteredNamedMethods_1.get(closestFieldTableElement);
            fieldTable.updateToggleHeight();
        }
    };
    Thumbnail.prototype.setEmptyThumbnailClass = function () {
        Dom_1.$$(this.img).addClass(this.options.noThumbnailClass);
    };
    Thumbnail.ID = 'Thumbnail';
    Thumbnail.doExport = function () {
        GlobalExports_1.exportGlobally({
            Thumbnail: Thumbnail
        });
    };
    /**
     * Options for the Thumbnail
     * @componentOptions
     */
    Thumbnail.options = {
        /**
         * Specifies the CSS class to use on the `img` tag that the Thumbnail component outputs when a result has no
         * thumbnail in the index.
         *
         * Default value is `coveo-no-thumbnail`.
         */
        noThumbnailClass: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'coveo-no-thumbnail' }),
        /**
         * Specifies whether to create a clickable {@link ResultLink} around the Thumbnail.
         *
         * Default value is `false`.
         *
         * If set to true, you can use the options specified on {@link ResultLink.options}
         */
        clickable: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    Thumbnail.parent = ResultLink_1.ResultLink;
    return Thumbnail;
}(Component_1.Component));
exports.Thumbnail = Thumbnail;
Thumbnail.options = _.extend({}, ResultLink_1.ResultLink.options, Thumbnail.options);
Initialization_1.Initialization.registerAutoCreateComponent(Thumbnail);


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
//# sourceMappingURL=Thumbnail__b6f3a40b26ad27101c27.js.map