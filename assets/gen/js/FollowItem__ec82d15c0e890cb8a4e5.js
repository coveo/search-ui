webpackJsonpCoveo__temporary([52],{

/***/ 226:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIPTION_TYPE = {
    followQuery: 'followQuery',
    followDocument: 'followDocument'
};


/***/ }),

/***/ 276:
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
var SearchAlertEvents_1 = __webpack_require__(83);
var GlobalExports_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(5);
var Subscription_1 = __webpack_require__(226);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var KeyboardUtils_1 = __webpack_require__(25);
var QueryUtils_1 = __webpack_require__(21);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
/**
 * The FollowItem component renders a widget that the end user can click to follow a particular item. A user following
 * an item receives email notifications when the item changes.
 *
 * **Note:**
 * > A {@link SearchAlerts} component must be present in the page for this component to work. It is also necessary to
 * > meet certain requirements to be able to use this component (see
 * > [Deploying Search Alerts on a Coveo JS Search Page](https://docs.coveo.com/en/1932/)).
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
 */
var FollowItem = /** @class */ (function (_super) {
    __extends(FollowItem, _super);
    /**
     * Creates a new FollowItem component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the FollowItem component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time)
     * @param result The result to associate the component with.
     */
    function FollowItem(element, options, bindings, result) {
        var _this = _super.call(this, element, FollowItem.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, FollowItem, options);
        Assert_1.Assert.exists(_this.result);
        _this.container = Dom_1.$$(_this.element);
        _this.text = Dom_1.$$('span');
        var icon = _this.buildIcon();
        var loadingIcon = _this.buildLoadingIcon();
        _this.container.append(icon);
        _this.container.append(loadingIcon);
        _this.container.append(_this.text.el);
        _this.container.on('click', function () { return _this.toggleFollow(); });
        _this.container.setAttribute('tabindex', '0');
        _this.bind.on(_this.container, 'keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, function () { return _this.toggleFollow(); }));
        _this.bind.onRootElement(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsDeleted, function (args) { return _this.handleSubscriptionDeleted(args); });
        _this.bind.onRootElement(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsCreated, function (args) { return _this.handleSubscriptionCreated(args); });
        _this.container.addClass('coveo-follow-item-loading');
        _this.updateIsFollowed();
        return _this;
    }
    FollowItem.prototype.setFollowed = function (subscription) {
        this.container.removeClass('coveo-follow-item-loading');
        this.subscription = subscription;
        this.container.addClass('coveo-follow-item-followed');
        this.text.text(Strings_1.l('SearchAlerts_unFollowing'));
    };
    FollowItem.prototype.setNotFollowed = function () {
        this.container.removeClass('coveo-follow-item-loading');
        this.subscription = FollowItem.buildFollowRequest(this.getId(), this.result.title, this.options);
        this.container.removeClass('coveo-follow-item-followed');
        this.text.text(Strings_1.l('SearchAlerts_follow'));
    };
    /**
     * Follows the item if not already following it. Stops following the item otherwise.
     *
     * Also logs the appropriate event in the usage analytics (either `searchAlertsFollowDocument` or
     * `searchAlertsUnfollowDocument`).
     */
    FollowItem.prototype.toggleFollow = function () {
        var _this = this;
        if (!this.container.hasClass('coveo-follow-item-loading')) {
            this.container.removeClass('coveo-follow-item-followed');
            this.container.addClass('coveo-follow-item-loading');
            if (this.subscription.id) {
                this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchAlertsUnfollowDocument);
                this.queryController
                    .getEndpoint()
                    .deleteSubscription(this.subscription)
                    .then(function () {
                    var eventArgs = {
                        subscription: _this.subscription,
                        dom: _this.element
                    };
                    Dom_1.$$(_this.root).trigger(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsDeleted, eventArgs);
                })
                    .catch(function () {
                    _this.container.removeClass('coveo-follow-item-loading');
                    var eventArgs = {
                        dom: _this.element
                    };
                    Dom_1.$$(_this.root).trigger(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsFail, eventArgs);
                });
            }
            else {
                this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchAlertsFollowDocument);
                this.queryController
                    .getEndpoint()
                    .follow(this.subscription)
                    .then(function (subscription) {
                    var eventArgs = {
                        subscription: subscription,
                        dom: _this.element
                    };
                    Dom_1.$$(_this.root).trigger(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsCreated, eventArgs);
                })
                    .catch(function () {
                    _this.container.removeClass('coveo-follow-item-loading');
                    var eventArgs = {
                        dom: _this.element
                    };
                    Dom_1.$$(_this.root).trigger(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsFail, eventArgs);
                });
            }
        }
    };
    FollowItem.prototype.getText = function () {
        return this.text.text();
    };
    FollowItem.prototype.updateIsFollowed = function () {
        var _this = this;
        this.queryController
            .getEndpoint()
            .listSubscriptions()
            .then(function (subscriptions) {
            if (_.isArray(subscriptions)) {
                var subscription = _.find(subscriptions, function (subscription) {
                    var typeConfig = subscription.typeConfig;
                    return typeConfig && typeConfig.id != null && typeConfig.id == _this.getId();
                });
                if (subscription != null) {
                    _this.setFollowed(subscription);
                }
                else {
                    _this.setNotFollowed();
                }
            }
            else {
                _this.remove();
            }
        })
            .catch(function () {
            _this.remove();
        });
    };
    FollowItem.prototype.buildIcon = function () {
        var icon = Dom_1.$$('span', { className: 'coveo-follow-item-icon' }, SVGIcons_1.SVGIcons.icons.dropdownFollowQuery);
        SVGDom_1.SVGDom.addClassToSVGInContainer(icon.el, 'coveo-follow-item-icon-svg');
        return icon.el;
    };
    FollowItem.prototype.buildLoadingIcon = function () {
        var loadingIcon = Dom_1.$$('span', { className: 'coveo-follow-item-icon-loading' }, SVGIcons_1.SVGIcons.icons.loading);
        SVGDom_1.SVGDom.addClassToSVGInContainer(loadingIcon.el, 'coveo-follow-item-icon-loading-svg');
        return loadingIcon.el;
    };
    FollowItem.prototype.handleSubscriptionDeleted = function (args) {
        if (args.subscription && args.subscription.type == Subscription_1.SUBSCRIPTION_TYPE.followDocument) {
            var typeConfig = args.subscription.typeConfig;
            if (typeConfig.id == this.getId()) {
                this.setNotFollowed();
            }
        }
    };
    FollowItem.prototype.handleSubscriptionCreated = function (args) {
        if (args.subscription && args.subscription.type == Subscription_1.SUBSCRIPTION_TYPE.followDocument) {
            var typeConfig = args.subscription.typeConfig;
            if (typeConfig.id == this.getId()) {
                this.setFollowed(args.subscription);
            }
        }
    };
    FollowItem.prototype.remove = function () {
        this.element.parentElement && this.element.parentElement.removeChild(this.element);
    };
    FollowItem.prototype.getId = function () {
        return Utils_1.Utils.getFieldValue(this.result, 'sysurihash') || Utils_1.Utils.getFieldValue(this.result, 'urihash');
    };
    FollowItem.buildFollowRequest = function (id, title, options) {
        var typeCofig = {
            id: id,
            title: title
        };
        if (options.modifiedDateField) {
            typeCofig.modifiedDateField = options.modifiedDateField;
        }
        if (options.watchedFields) {
            typeCofig.watchedFields = options.watchedFields;
        }
        return {
            type: Subscription_1.SUBSCRIPTION_TYPE.followDocument,
            typeConfig: typeCofig,
            name: title
        };
    };
    FollowItem.prototype.logAnalyticsEvent = function (type) {
        this.usageAnalytics.logCustomEvent(type, {
            author: QueryUtils_1.QueryUtils.getAuthor(this.result),
            documentLanguage: QueryUtils_1.QueryUtils.getLanguage(this.result),
            documentSource: QueryUtils_1.QueryUtils.getSource(this.result),
            documentTitle: this.result.title,
            contentIDValue: QueryUtils_1.QueryUtils.getPermanentId(this.result).fieldValue,
            contentIDKey: QueryUtils_1.QueryUtils.getPermanentId(this.result).fieldUsed
        }, this.element);
    };
    FollowItem.ID = 'FollowItem';
    FollowItem.doExport = function () {
        GlobalExports_1.exportGlobally({
            FollowItem: FollowItem
        });
    };
    /**
     * The options for the follow item component
     * @componentOptions
     */
    FollowItem.options = {
        /**
         * Specifies the {@link ISubscriptionItemRequest.watchedFields} to use when sending the
         * {@link ISubscriptionItemRequest}.
         *
         * Default value is `undefined`.
         */
        watchedFields: ComponentOptions_1.ComponentOptions.buildFieldsOption(),
        /**
         * Specifies the {@link ISubscriptionItemRequest.modifiedDateField} to use when sending the
         * {@link ISubscriptionItemRequest}.
         *
         * Default value is `undefined`.
         */
        modifiedDateField: ComponentOptions_1.ComponentOptions.buildStringOption()
    };
    return FollowItem;
}(Component_1.Component));
exports.FollowItem = FollowItem;
Initialization_1.Initialization.registerAutoCreateComponent(FollowItem);


/***/ })

});
//# sourceMappingURL=FollowItem__ec82d15c0e890cb8a4e5.js.map