webpackJsonpCoveo__temporary([76],{

/***/ 236:
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
var QueryEvents_1 = __webpack_require__(11);
var InitializationEvents_1 = __webpack_require__(17);
var SettingsEvents_1 = __webpack_require__(53);
var DomUtils_1 = __webpack_require__(91);
var Dom_1 = __webpack_require__(1);
var Initialization_1 = __webpack_require__(2);
var Strings_1 = __webpack_require__(6);
var ExternalModulesShim_1 = __webpack_require__(26);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(595);
var SVGIcons_1 = __webpack_require__(12);
/**
 * The `AuthenticationProvider` component makes it possible to execute queries with an identity that the end user
 * can obtain using an authentication provider configured on the Coveo REST Search API
 * (see [Claims Authentication](https://docs.coveo.com/en/113/)).
 *
 * When necessary, this component handles redirecting the browser to the address that starts the authentication process.
 *
 * You can use the `data-tab` attribute to enable the `AuthenticationProvider` component only for the tabs of your
 * search interface that require authentication (see the [`Tab`]{@link Tab} component).
 */
var AuthenticationProvider = /** @class */ (function (_super) {
    __extends(AuthenticationProvider, _super);
    /**
     * Creates a new `AuthenticationProvider` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `AuthenticationProvider` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function AuthenticationProvider(element, options, bindings, _window) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, element, AuthenticationProvider.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this._window = _window;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, AuthenticationProvider, options);
        Assert_1.Assert.exists(_this.options.name);
        _this.handlers = [];
        _this._window = _this._window || window;
        _this.redirectCount = 0;
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingCallOptions, _this.handleBuildingCallOptions);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, _this.handleQueryError);
        _this.bind.onRootElement(InitializationEvents_1.InitializationEvents.nuke, _this.handleNuke);
        _this.bind.onRootElement(SettingsEvents_1.SettingsEvents.settingsPopulateMenu, function (args) {
            args.menuData.push({
                text: Strings_1.l('Reauthenticate', _this.options.caption),
                className: 'coveo-authentication-provider',
                onOpen: function () { return _this.authenticateWithProvider(); },
                svgIcon: SVGIcons_1.SVGIcons.icons.dropdownAuthenticate,
                svgIconClassName: 'coveo-authentication-provider-svg'
            });
        });
        return _this;
    }
    AuthenticationProvider.prototype.handleBuildingCallOptions = function (args) {
        args.options.authentication.push(this.options.name);
    };
    AuthenticationProvider.prototype.handleQueryError = function (args) {
        var missingAuthError = args.error;
        if (missingAuthError.isMissingAuthentication &&
            missingAuthError.provider === this.options.name &&
            this.redirectCount < 2 &&
            this.redirectCount !== -1) {
            ++this.redirectCount;
            this.authenticateWithProvider();
        }
        else {
            this.logger.error('The AuthenticationProvider is in a redirect loop. This may be due to a back-end configuration problem.');
            this.redirectCount = -1;
        }
    };
    AuthenticationProvider.prototype.authenticateWithProvider = function () {
        this.options.useIFrame ? this.authenticateWithIFrame() : this.redirectToAuthenticationProvider();
    };
    AuthenticationProvider.prototype.redirectToAuthenticationProvider = function () {
        this.logger.info("Redirecting to authentication provider " + this.options.name);
        this._window.location.href = this.getAuthenticationProviderUriForRedirect();
    };
    AuthenticationProvider.prototype.authenticateWithIFrame = function () {
        this.logger.info("Using iframe to retrieve authentication for provider " + this.options.name);
        var iframe = Dom_1.$$('iframe', {
            src: this.getAuthenticationProviderUriForIFrame()
        }).el;
        var modalbox;
        modalbox = this.options.showIFrame ? this.createPopupForVisibleIFrame(iframe) : this.createPopupForWaitMessage(iframe);
        var handler = this.createHandler(modalbox, iframe);
        Dom_1.$$(this._window).one('message', handler);
        this.handlers.push(handler);
    };
    AuthenticationProvider.prototype.createHandler = function (modalbox, iframe) {
        var _this = this;
        return function () {
            Dom_1.$$(iframe).detach();
            _this.logger.info("Got authentication for provider " + _this.options.name + "; retrying query.");
            modalbox.close();
            _this.queryController.executeQuery();
        };
    };
    AuthenticationProvider.prototype.handleNuke = function () {
        var _this = this;
        _.each(this.handlers, function (handler) { return Dom_1.$$(_this._window).off('message', handler); });
    };
    AuthenticationProvider.prototype.createPopupForWaitMessage = function (iframe) {
        var popup = Dom_1.$$('div', {
            className: 'coveo-waiting-for-authentication-popup'
        }, DomUtils_1.DomUtils.getBasicLoadingAnimation()).el;
        Dom_1.$$(iframe).hide();
        document.body.appendChild(iframe);
        ExternalModulesShim_1.ModalBox.open(popup, {
            title: Strings_1.l('Authenticating', this.options.caption),
            sizeMod: 'small',
            body: this.searchInterface.options.modalContainer
        });
        return ExternalModulesShim_1.ModalBox;
    };
    AuthenticationProvider.prototype.createPopupForVisibleIFrame = function (iframe) {
        Dom_1.$$(iframe).addClass('coveo-authentication-iframe');
        var popup = Dom_1.$$('div', {}, iframe).el;
        ExternalModulesShim_1.ModalBox.open(popup, {
            title: Strings_1.l('Authenticating', this.options.caption),
            className: 'coveo-authentication-popup',
            sizeMod: 'big',
            body: this.searchInterface.options.modalContainer
        });
        return ExternalModulesShim_1.ModalBox;
    };
    AuthenticationProvider.prototype.getAuthenticationProviderUriForRedirect = function () {
        return this.queryController.getEndpoint().getAuthenticationProviderUri(this.options.name, this._window.location.href, undefined);
    };
    AuthenticationProvider.prototype.getAuthenticationProviderUriForIFrame = function () {
        return this.queryController.getEndpoint().getAuthenticationProviderUri(this.options.name, undefined, 'success');
    };
    AuthenticationProvider.ID = 'AuthenticationProvider';
    AuthenticationProvider.doExport = function () {
        GlobalExports_1.exportGlobally({
            AuthenticationProvider: AuthenticationProvider
        });
    };
    /**
     * The options for the component.
     * @componentOptions
     */
    AuthenticationProvider.options = {
        /**
         * Specifies the name of the authentication provider.
         *
         * See [SAML Authentication](https://docs.coveo.com/en/91/).
         */
        name: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Specifies the display name of the authentication provider. This is the name that you want to appear in the user
         * interface when the end user is logging in.
         *
         * Default value is the [`name`]{@link AuthenticationProvider.options.name} option value.
         */
        caption: ComponentOptions_1.ComponentOptions.buildStringOption({ postProcessing: function (value, options) { return value || options.name; } }),
        /**
         * Specifies whether to use an `<iframe>` to host the chain of redirection that make up the authentication
         * process.
         *
         * Using an `<iframe>` prevents leaving the search page as part of the authentication process. However, some login
         * providers refuse to load in an `<iframe>`.
         *
         * Default value is `false`.
         */
        useIFrame: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false,
            alias: ['useIframe']
        }),
        /**
         * If the [`useIFrame`]{@link AuthenticationProvider.options.useIFrame} option is `true`, specifies whether to make
         * the authentication `<iframe>` visible to the user (inside a popup).
         *
         * When the underlying authentication provider requires no user interaction (for example, when a user authenticates
         * using Windows authentication along with SharePoint claims), setting this option to `false` reduces the visual
         * impact of the authentication process.
         *
         * Default value is `true`.
         */
        showIFrame: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: true,
            alias: ['showIframe'],
            depend: 'useIFrame'
        })
    };
    return AuthenticationProvider;
}(Component_1.Component));
exports.AuthenticationProvider = AuthenticationProvider;
Initialization_1.Initialization.registerAutoCreateComponent(AuthenticationProvider);


/***/ }),

/***/ 595:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=AuthenticationProvider__b6f3a40b26ad27101c27.js.map