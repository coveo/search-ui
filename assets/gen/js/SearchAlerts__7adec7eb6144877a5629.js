webpackJsonpCoveo__temporary([17,72],{

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var SVGDom = /** @class */ (function () {
    function SVGDom() {
    }
    SVGDom.addClassToSVGInContainer = function (svgContainer, classToAdd) {
        var svgElement = svgContainer.querySelector('svg');
        svgElement.setAttribute('class', "" + SVGDom.getClass(svgElement) + classToAdd);
    };
    SVGDom.removeClassFromSVGInContainer = function (svgContainer, classToRemove) {
        var svgElement = svgContainer.querySelector('svg');
        svgElement.setAttribute('class', SVGDom.getClass(svgElement).replace(classToRemove, ''));
    };
    SVGDom.addStyleToSVGInContainer = function (svgContainer, styleToAdd) {
        var svgElement = svgContainer.querySelector('svg');
        _.each(styleToAdd, function (styleValue, styleKey) {
            svgElement.style[styleKey] = styleValue;
        });
    };
    SVGDom.getClass = function (svgElement) {
        var className = svgElement.getAttribute('class');
        return className ? className + ' ' : '';
    };
    return SVGDom;
}());
exports.SVGDom = SVGDom;


/***/ }),

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIPTION_TYPE = {
    followQuery: 'followQuery',
    followDocument: 'followDocument'
};


/***/ }),

/***/ 202:
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
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(7);
var SearchAlertsMessage_1 = __webpack_require__(426);
var SettingsEvents_1 = __webpack_require__(39);
var QueryEvents_1 = __webpack_require__(10);
var Assert_1 = __webpack_require__(5);
var SearchAlertEvents_1 = __webpack_require__(61);
var Subscription_1 = __webpack_require__(153);
var Initialization_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(8);
var Dom_1 = __webpack_require__(2);
var ExternalModulesShim_1 = __webpack_require__(23);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var Dropdown_1 = __webpack_require__(50);
var SVGIcons_1 = __webpack_require__(13);
var RegisteredNamedMethods_1 = __webpack_require__(26);
var SearchInterface_1 = __webpack_require__(17);
/**
 * The Search Alerts component renders items in the {@link Settings} menu that allow the end user to follow queries
 * and to manage search alerts. A user following a query receives email notifications when the query results change.
 *
 * **Note:**
 * > It is necessary to meet certain requirements to be able to use this component (see
 * > [Deploying Search Alerts on a Coveo JS Search Page](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=248)).
 *
 * See also the {@link FollowItem} component.
 */
var SearchAlerts = /** @class */ (function (_super) {
    __extends(SearchAlerts, _super);
    /**
     * Creates a new SearchAlerts component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the SearchAlerts component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function SearchAlerts(element, options, bindings, ModalBox) {
        if (ModalBox === void 0) { ModalBox = ExternalModulesShim_1.ModalBox; }
        var _this = _super.call(this, element, SearchAlerts.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.ModalBox = ModalBox;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, SearchAlerts, options);
        if (_this.options.enableMessage) {
            _this.message = new SearchAlertsMessage_1.SearchAlertsMessage(element, { closeDelay: _this.options.messageCloseDelay }, _this.getBindings());
        }
        if (!_this.queryController.getEndpoint().options.isGuestUser) {
            _this.bind.onRootElement(SettingsEvents_1.SettingsEvents.settingsPopulateMenu, function (args) {
                if (_this.options.enableManagePanel) {
                    args.menuData.push({
                        text: Strings_1.l('SearchAlerts_Panel'),
                        className: 'coveo-subscriptions-panel',
                        onOpen: function () { return _this.openPanel(); },
                        onClose: function () { return _this.close(); },
                        svgIcon: SVGIcons_1.SVGIcons.icons.dropdownFollowQuery,
                        svgIconClassName: 'coveo-subscriptions-panel-svg'
                    });
                }
            });
        }
        else {
            _this.logger.warn('Logged in as guest user, search alerts are therefore not available.');
        }
        var once = false;
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function () {
            if (!once) {
                once = true;
                _this.queryController
                    .getEndpoint()
                    .listSubscriptions()
                    .then(function () {
                    _this.bind.onRootElement(SettingsEvents_1.SettingsEvents.settingsPopulateMenu, function (args) {
                        if (_this.options.enableFollowQuery) {
                            args.menuData.push({
                                text: Strings_1.l('SearchAlerts_followQuery'),
                                className: 'coveo-follow-query',
                                tooltip: Strings_1.l('FollowQueryDescription'),
                                onOpen: function () { return _this.followQuery(); },
                                onClose: function () { },
                                svgIcon: SVGIcons_1.SVGIcons.icons.dropdownFollowQuery,
                                svgIconClassName: 'coveo-follow-query-svg'
                            });
                        }
                    });
                })
                    .catch(function (e) {
                    // Trap 403 error, as the listSubscription call is called on every page initialization
                    // to check for current subscriptions. By default, the search alert service is not enabled for most organization
                    // Don't want to pollute the console with un-needed noise and confusion
                    if (e.status != 403) {
                        throw e;
                    }
                });
            }
        });
        return _this;
    }
    /**
     * Follows the last query. The user will start receiving email notifications when the query results change.
     *
     * Also logs the `searchAlertsFollowQuery` event in the usage analytics with the name of the request as meta data.
     */
    SearchAlerts.prototype.followQuery = function () {
        var _this = this;
        var queryBuilder = this.queryController.createQueryBuilder({});
        var request = this.buildFollowQueryRequest(queryBuilder.build(), this.options);
        this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchAlertsFollowQuery, {
            subscription: request.name
        }, this.element);
        this.queryController
            .getEndpoint()
            .follow(request)
            .then(function (subscription) {
            if (subscription) {
                var eventArgs = {
                    subscription: subscription,
                    dom: _this.findQueryBoxDom()
                };
                Dom_1.$$(_this.root).trigger(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsCreated, eventArgs);
            }
            else {
                _this.triggerSearchAlertsFail();
            }
        })
            .catch(function () {
            _this.triggerSearchAlertsFail();
        });
    };
    /**
     * Opens the **Manage Alerts** panel. This panel allows the end user to stop following queries or items. It also
     * allows the end user to specify email notification frequency for each followed query or item.
     */
    SearchAlerts.prototype.openPanel = function () {
        var _this = this;
        var title = Dom_1.$$('div');
        var titleInfo = Dom_1.$$('div', {
            className: 'coveo-subscriptions-panel-title'
        }, Strings_1.l('SearchAlerts_Panel'));
        title.append(titleInfo.el);
        var container = Dom_1.$$('div');
        var table = Dom_1.$$('table', {
            className: 'coveo-subscriptions-panel-content',
            cellspacing: 0
        });
        container.append(table.el);
        var tableHead = Dom_1.$$('thead');
        table.append(tableHead.el);
        var rowHead = Dom_1.$$('tr');
        tableHead.append(rowHead.el);
        var headerType = Dom_1.$$('th', {
            className: 'coveo-subscriptions-panel-content-type'
        }, Strings_1.l('SearchAlerts_Type'));
        var headerContent = Dom_1.$$('th', null, Strings_1.l('SearchAlerts_Content'));
        var headerFrequency = Dom_1.$$('th', null, Strings_1.l('SearchAlerts_Frequency'));
        var headerActions = Dom_1.$$('th', {
            className: 'coveo-subscriptions-panel-content-actions'
        }, Strings_1.l('SearchAlerts_Actions'));
        rowHead.append(headerType.el);
        rowHead.append(headerContent.el);
        rowHead.append(headerFrequency.el);
        rowHead.append(headerActions.el);
        var tableBodySpacer = Dom_1.$$('tbody', {
            className: 'coveo-subscriptions-panel-spacer'
        }, Dom_1.$$('tr', null, Dom_1.$$('td', {
            colsspan: 3
        })));
        table.append(tableBodySpacer.el);
        var tableBodySubscriptions = Dom_1.$$('tbody', {
            className: 'coveo-subscriptions-panel-subscriptions'
        }, Dom_1.$$('tr', {
            className: 'coveo-subscriptions-panel-no-subscriptions'
        }, Dom_1.$$('td', {
            colspan: 3
        }, Strings_1.l('SearchAlerts_PanelNoSearchAlerts'))));
        table.append(tableBodySubscriptions.el);
        var sizeModForModalBox = 'big';
        return this.queryController
            .getEndpoint()
            .listSubscriptions()
            .then(function (subscriptions) {
            _.each(subscriptions, function (subscription) {
                _this.addSearchAlert(subscription, container);
            });
        })
            .catch(function () {
            sizeModForModalBox = 'small';
            container.empty();
            container.append(_this.getFailureMessage().el);
        })
            .finally(function () {
            _this.modal = _this.ModalBox.open(container.el, {
                title: title.el.outerHTML,
                className: 'coveo-subscriptions-panel',
                sizeMod: sizeModForModalBox
            });
        });
    };
    SearchAlerts.prototype.getFailureMessage = function () {
        return Dom_1.$$('div', {
            className: 'coveo-subscriptions-panel-fail'
        }, Strings_1.l('SearchAlerts_Fail'));
    };
    SearchAlerts.prototype.handleSearchAlertsFail = function () {
        if (this.modal != null) {
            var modalBody = Dom_1.$$(this.modal.wrapper).find('.coveo-modal-body');
            Dom_1.$$(modalBody).empty();
            Dom_1.$$(modalBody).append(this.getFailureMessage().el);
        }
    };
    SearchAlerts.prototype.close = function () {
        if (this.modal) {
            this.modal.close();
            this.modal = null;
        }
    };
    SearchAlerts.prototype.addSearchAlert = function (subscription, container) {
        var _this = this;
        var frequencies = [
            { value: 'monthly', label: Strings_1.l('Monthly') },
            { value: 'daily', label: Strings_1.l('Daily') },
            { value: 'monday', label: Strings_1.l('Monday') },
            { value: 'tuesday', label: Strings_1.l('Tuesday') },
            { value: 'wednesday', label: Strings_1.l('Wednesday') },
            { value: 'thursday', label: Strings_1.l('Thursday') },
            { value: 'friday', label: Strings_1.l('Friday') },
            { value: 'saturday', label: Strings_1.l('Saturday') },
            { value: 'sunday', label: Strings_1.l('Sunday') }
        ];
        var context;
        if (subscription.name) {
            if (subscription.name == '<empty>') {
                context = '&lt;empty&gt;';
            }
            else {
                var textExtracted = Dom_1.$$('div').el;
                textExtracted.innerHTML = subscription.name;
                context = Dom_1.$$(textExtracted).text();
            }
        }
        else if (subscription.type == Subscription_1.SUBSCRIPTION_TYPE.followQuery) {
            var typeConfig = subscription.typeConfig;
            context = _.escape(typeConfig.query.q) || Strings_1.l('EmptyQuery');
        }
        else {
            var typeConfig = subscription.typeConfig;
            context = _.escape(typeConfig.title || typeConfig.id);
        }
        var row = Dom_1.$$('tr', {
            className: 'coveo-subscriptions-panel-subscription'
        });
        var pluckFrequenciesValues = _.pluck(frequencies, 'value');
        var valueToLabel = function (valueMappedToLabel) { return _.findWhere(frequencies, { value: valueMappedToLabel }).label; };
        var buildDropdown = function () {
            return new Dropdown_1.Dropdown(function (dropdownInstance) {
                _this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchAlertsUpdateSubscription, {
                    subscription: context,
                    frequency: dropdownInstance.getValue()
                }, _this.element);
                subscription.frequency = dropdownInstance.getValue();
                _this.updateAndSyncSearchAlert(subscription);
            }, pluckFrequenciesValues, valueToLabel).build();
        };
        var contentTypeElement = Dom_1.$$('td', {
            className: 'coveo-subscriptions-panel-content-type'
        }, Strings_1.l('SearchAlerts_Type_' + subscription.type));
        var contextElement = Dom_1.$$('td', {
            className: 'coveo-subscriptions-panel-context',
            title: context
        });
        contextElement.setHtml(context);
        var frequencyElement = Dom_1.$$('td', null, Dom_1.$$('div', {
            className: 'coveo-subscriptions-panel-frequency'
        }, buildDropdown()));
        var contentActionsElement = Dom_1.$$('td', {
            className: 'coveo-subscriptions-panel-content-actions'
        }, null, Dom_1.$$('div', {
            className: 'coveo-subscriptions-panel-action coveo-subscriptions-panel-action-unfollow'
        }, Strings_1.l('SearchAlerts_unFollowing')), Dom_1.$$('div', {
            className: 'coveo-subscriptions-panel-action coveo-subscriptions-panel-action-follow'
        }, Strings_1.l('SearchAlerts_follow')));
        row.append(contentTypeElement.el);
        row.append(contextElement.el);
        row.append(frequencyElement.el);
        row.append(contentActionsElement.el);
        var noSearchAlerts = container.find('.coveo-subscriptions-panel-no-subscriptions');
        row.insertBefore(noSearchAlerts);
        var frequencyInput = frequencyElement.find('select');
        frequencyInput.value = subscription.frequency;
        Dom_1.$$(row.find('.coveo-subscriptions-panel-action-unfollow')).on('click', function () {
            row.addClass('coveo-subscription-unfollowed');
            _this.queryController
                .getEndpoint()
                .deleteSubscription(subscription)
                .then(function () {
                if (subscription.type == Subscription_1.SUBSCRIPTION_TYPE.followDocument) {
                    _this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchAlertsUnfollowDocument, subscription);
                }
                else if (subscription.type == Subscription_1.SUBSCRIPTION_TYPE.followQuery) {
                    _this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchAlertsUnfollowQuery, subscription);
                }
                delete subscription.id;
                var eventArgs = { subscription: subscription };
                Dom_1.$$(_this.root).trigger(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsDeleted, eventArgs);
            })
                .catch(function () {
                _this.handleSearchAlertsFail();
            });
        });
        Dom_1.$$(row.find('.coveo-subscriptions-panel-action-follow')).on('click', function () {
            row.removeClass('coveo-subscription-unfollowed');
            _this.queryController
                .getEndpoint()
                .follow(subscription)
                .then(function (updatedSearchAlert) {
                if (subscription.type == Subscription_1.SUBSCRIPTION_TYPE.followDocument) {
                    _this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchAlertsFollowDocument, subscription);
                }
                else if (subscription.type == Subscription_1.SUBSCRIPTION_TYPE.followQuery) {
                    _this.logAnalyticsEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchAlertsFollowQuery, subscription);
                }
                subscription.id = updatedSearchAlert.id;
                var eventArgs = { subscription: subscription };
                Dom_1.$$(_this.root).trigger(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsCreated, eventArgs);
            })
                .catch(function () {
                _this.handleSearchAlertsFail();
            });
        });
    };
    SearchAlerts.prototype.updateAndSyncSearchAlert = function (subscription) {
        var _this = this;
        this.queryController
            .getEndpoint()
            .updateSubscription(subscription)
            .then(function (updated) { return _.extend(subscription, updated); })
            .catch(function () {
            _this.handleSearchAlertsFail();
        });
    };
    SearchAlerts.prototype.triggerSearchAlertsFail = function () {
        var eventArgs = {
            dom: this.findQueryBoxDom()
        };
        Dom_1.$$(this.root).trigger(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsFail, eventArgs);
    };
    SearchAlerts.prototype.findQueryBoxDom = function () {
        var dom;
        var components = this.searchInterface.getComponents('Querybox');
        if (components && components.length > 0) {
            dom = _.first(components).element;
        }
        else {
            var components_1 = this.searchInterface.getComponents('Omnibox');
            if (components_1 && components_1.length > 0) {
                dom = _.first(components_1).element;
            }
        }
        return dom;
    };
    SearchAlerts.prototype.buildFollowQueryRequest = function (query, options) {
        var typeConfig = {
            query: query
        };
        if (options.modifiedDateField) {
            typeConfig.modifiedDateField = options.modifiedDateField;
        }
        return {
            type: Subscription_1.SUBSCRIPTION_TYPE.followQuery,
            typeConfig: typeConfig,
            name: this.message.getFollowQueryMessage(query.q)
        };
    };
    SearchAlerts.prototype.logAnalyticsEvent = function (cause, subscription) {
        this.usageAnalytics.logCustomEvent(cause, {
            subscription: subscription.name
        }, this.element);
    };
    SearchAlerts.create = function (element, options, root) {
        Assert_1.Assert.exists(element);
        return new SearchAlerts(element, options, RegisteredNamedMethods_1.get(root, SearchInterface_1.SearchInterface).getBindings());
    };
    SearchAlerts.ID = 'SearchAlerts';
    SearchAlerts.doExport = function () {
        GlobalExports_1.exportGlobally({
            SearchAlerts: SearchAlerts,
            SearchAlertsMessage: SearchAlertsMessage_1.SearchAlertsMessage
        });
    };
    /**
     * The options for the search alerts
     * @componentOptions
     */
    SearchAlerts.options = {
        /**
         * Specifies whether to add the **Manage Alerts** item in the {@link Settings} menu to allow the end user to manage
         * search alerts.
         *
         * Clicking the **Manage Alerts** item calls the {@link SearchAlerts.openPanel} method.
         *
         * Default value is `true`.
         */
        enableManagePanel: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies whether to add the **Follow Query** item in the {@link Settings} menu to allow the end user to follow
         * the last query.
         *
         * Clicking the **Follow Query** item calls the {@link SearchAlerts.followQuery} method.
         *
         * Default value is `true`.
         */
        enableFollowQuery: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies which field to use to represent the modification date when sending the
         * {@link ISubscriptionQueryRequest}.
         *
         * Default value is `undefined`.
         */
        modifiedDateField: ComponentOptions_1.ComponentOptions.buildFieldOption(),
        /**
         * Specifies whether to display info and error messages when performing search alerts actions.
         *
         * If this options is `true`, the SearchAlerts constructor will automatically instantiate a
         * {@link SearchAlertsMessage} component and set it to the {@link SearchAlerts.message} attribute.
         *
         * See also {@link SearchAlerts.options.messageCloseDelay}.
         *
         * Default value is `true`.
         */
        enableMessage: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * If {@link SearchAlerts.options.enableMessage} is `true`, specifies how long to display the search alert messages
         * (in milliseconds).
         *
         * Default value is `2000`. Minimum value is `0`.
         */
        messageCloseDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 2000, min: 0, depend: 'enableMessage' })
    };
    return SearchAlerts;
}(Component_1.Component));
exports.SearchAlerts = SearchAlerts;
Initialization_1.Initialization.registerAutoCreateComponent(SearchAlerts);


/***/ }),

/***/ 426:
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
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(7);
var SearchAlertEvents_1 = __webpack_require__(61);
var QueryEvents_1 = __webpack_require__(10);
var Subscription_1 = __webpack_require__(153);
var PopupUtils_1 = __webpack_require__(48);
var Strings_1 = __webpack_require__(8);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var SVGIcons_1 = __webpack_require__(13);
var SVGDom_1 = __webpack_require__(14);
/**
 * The SearchAlertsMessage component allows the {@link SearchAlerts} component to display messages.
 *
 * You should not include this component in your page. Instead, use a {@link SearchAlerts} component, and access the
 * {@link SearchAlerts.message} attribute.
 */
var SearchAlertsMessage = /** @class */ (function (_super) {
    __extends(SearchAlertsMessage, _super);
    /**
     * Creates a new SearchAlertsMessage component
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the SearchAlertsMessage component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function SearchAlertsMessage(element, options, bindings) {
        var _this = _super.call(this, element, SearchAlertsMessage.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.bind.onRootElement(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsCreated, function (args) { return _this.handleSubscriptionCreated(args); });
        _this.bind.oneRootElement(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsFail, function (args) { return _this.handleSearchAlertsFail(args); });
        _this.bind.oneRootElement(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsDeleted, function () { return _this.close(); });
        _this.bind.oneRootElement(QueryEvents_1.QueryEvents.newQuery, function () { return _this.close(); });
        return _this;
    }
    SearchAlertsMessage.prototype.getCssClass = function () {
        return 'coveo-subscriptions-messages';
    };
    SearchAlertsMessage.prototype.getFollowQueryMessage = function (query, htmlFormatted) {
        var _this = this;
        if (htmlFormatted === void 0) { htmlFormatted = false; }
        var populateMessageArguments = {
            text: []
        };
        var getAdditionalTextFormatted = function () {
            return _.map(populateMessageArguments.text, function (text) {
                text = _this.formatMessageArgumentsText(text);
                return "" + (htmlFormatted ? '<li>' : '(') + text + (htmlFormatted ? '</li>' : ')');
            }).join(' ');
        };
        Dom_1.$$(this.root).trigger(SearchAlertEvents_1.SearchAlertsEvents.searchAlertsPopulateMessage, populateMessageArguments);
        var additionalMessage = "" + (htmlFormatted ? '<ul>' : '') + getAdditionalTextFormatted() + (htmlFormatted ? '</ul>' : '');
        var automaticallyBuiltMessage;
        if (query && populateMessageArguments.text.length != 0) {
            automaticallyBuiltMessage = _.escape(query) + " " + additionalMessage;
        }
        if (query && populateMessageArguments.text.length == 0) {
            automaticallyBuiltMessage = "" + _.escape(query);
        }
        if (!query && populateMessageArguments.text.length != 0) {
            automaticallyBuiltMessage = "" + additionalMessage;
        }
        if (!query && populateMessageArguments.text.length == 0) {
            automaticallyBuiltMessage = htmlFormatted ? Strings_1.l('EmptyQuery') : _.unescape(Strings_1.l('EmptyQuery'));
        }
        return automaticallyBuiltMessage;
    };
    /**
     * Displays a message near the passed dom attribute.
     * @param dom Specifies where to display the message.
     * @param message The message.
     * @param error Specifies whether the message is an error message.
     */
    SearchAlertsMessage.prototype.showMessage = function (dom, message, error) {
        var _this = this;
        this.message = Dom_1.$$('div', {
            className: 'coveo-subscriptions-messages'
        });
        this.message.el.innerHTML = "\n      <div class='coveo-subscriptions-messages-message'>\n        <div class='coveo-subscriptions-messages-content'><span>" + message + "</span></div>\n        <div class='coveo-subscriptions-messages-info-close'>" + SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore + "</div>\n      </div>";
        this.message.toggleClass('coveo-subscriptions-messages-error', error);
        var closeButton = this.message.find('.coveo-subscriptions-messages-info-close');
        SVGDom_1.SVGDom.addClassToSVGInContainer(closeButton, 'coveo-subscript-messages-info-close-svg');
        Dom_1.$$(closeButton).on('click', function () { return _this.close(); });
        PopupUtils_1.PopupUtils.positionPopup(this.message.el, dom.el, this.root, {
            horizontal: PopupUtils_1.PopupHorizontalAlignment.INNERLEFT,
            vertical: PopupUtils_1.PopupVerticalAlignment.BOTTOM,
            verticalOffset: 12,
            horizontalClip: true
        }, this.root);
        this.startCloseDelay();
        this.message.on('mouseleave', function () {
            _this.startCloseDelay();
        });
        this.message.on('mouseenter', function () {
            _this.stopCloseDelay();
        });
    };
    SearchAlertsMessage.prototype.formatMessageArgumentsText = function (text) {
        if (_.isString(text)) {
            text = _.escape(text);
        }
        else if (text.lineThrough) {
            text = '<span style="text-decoration:line-through">' + _.escape(text.value) + '</span>';
        }
        else {
            text = _.escape(text.value);
        }
        return text;
    };
    SearchAlertsMessage.prototype.handleSubscriptionCreated = function (args) {
        this.close();
        if (args.dom != null) {
            if (args.subscription.type == Subscription_1.SUBSCRIPTION_TYPE.followQuery) {
                var typeConfig = args.subscription.typeConfig;
                this.showMessage(Dom_1.$$(args.dom), Strings_1.l('SubscriptionsMessageFollowQuery', this.getFollowQueryMessage(typeConfig.query.q, true)), false);
            }
            else {
                this.showMessage(Dom_1.$$(args.dom), Strings_1.l('SubscriptionsMessageFollow'), false);
            }
        }
    };
    SearchAlertsMessage.prototype.handleSearchAlertsFail = function (args) {
        this.close();
        if (args.dom != null) {
            this.showMessage(Dom_1.$$(args.dom), Strings_1.l('SearchAlerts_Fail'), true);
        }
    };
    SearchAlertsMessage.prototype.startCloseDelay = function () {
        var _this = this;
        clearTimeout(this.closeTimeout);
        this.closeTimeout = window.setTimeout(function () {
            _this.close();
        }, this.options.closeDelay);
    };
    SearchAlertsMessage.prototype.stopCloseDelay = function () {
        clearTimeout(this.closeTimeout);
    };
    SearchAlertsMessage.prototype.close = function () {
        if (this.message != null) {
            clearTimeout(this.closeTimeout);
            this.message.remove();
            this.message = null;
        }
    };
    SearchAlertsMessage.ID = 'SubscriptionsMessages';
    /**
     * The options for the SearchAlertsMessage component
     * @componentOptions
     */
    SearchAlertsMessage.options = {
        /**
         * Specifies how long to display the search alerts messages (in milliseconds).
         *
         * Default value is `2000`. Minimum value is `0`.
         */
        closeDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 2000, min: 0 })
    };
    return SearchAlertsMessage;
}(Component_1.Component));
exports.SearchAlertsMessage = SearchAlertsMessage;


/***/ }),

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var Strings_1 = __webpack_require__(8);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
/**
 * A dropdown widget with standard styling.
 */
var Dropdown = /** @class */ (function () {
    /**
     * Creates a new `Dropdown`.
     * @param onChange The function to call when the dropdown selected value changes. This function takes the current
     * `Dropdown` instance as an argument.
     * @param listOfValues The selectable values to display in the dropdown.
     * @param getDisplayValue An optional function to modify the display values, rather than using the values as they
     * appear in the `listOfValues`.
     * @param label The label to display for the dropdown.
     */
    function Dropdown(onChange, listOfValues, getDisplayValue) {
        if (onChange === void 0) { onChange = function (dropdown) { }; }
        if (getDisplayValue === void 0) { getDisplayValue = Strings_1.l; }
        this.onChange = onChange;
        this.listOfValues = listOfValues;
        this.getDisplayValue = getDisplayValue;
        this.optionsElement = [];
        this.buildContent();
        this.select(0, false);
        this.bindEvents();
    }
    Dropdown.doExport = function () {
        GlobalExports_1.exportGlobally({
            Dropdown: Dropdown
        });
    };
    /**
     * Resets the dropdown.
     */
    Dropdown.prototype.reset = function () {
        this.select(0, false);
    };
    Dropdown.prototype.setId = function (id) {
        Dom_1.$$(this.element).setAttribute('id', id);
    };
    /**
     * Gets the element on which the dropdown is bound.
     * @returns {HTMLElement} The dropdown element.
     */
    Dropdown.prototype.getElement = function () {
        return this.element;
    };
    /**
     * Gets the currently selected dropdown value.
     * @returns {string} The currently selected dropdown value.
     */
    Dropdown.prototype.getValue = function () {
        return this.selectElement.value;
    };
    /**
     * Selects a value from the dropdown [`listofValues`]{@link Dropdown.listOfValues}.
     * @param index The 0-based index position of the value to select in the `listOfValues`.
     * @param executeOnChange Indicates whether to execute the [`onChange`]{@link Dropdown.onChange} function when this
     * method changes the dropdown selection.
     */
    Dropdown.prototype.select = function (index, executeOnChange) {
        if (executeOnChange === void 0) { executeOnChange = true; }
        this.selectOption(this.optionsElement[index], executeOnChange);
    };
    /**
     * Gets the element on which the dropdown is bound.
     * @returns {HTMLElement} The dropdown element.
     */
    Dropdown.prototype.build = function () {
        return this.element;
    };
    /**
     * Sets the dropdown value.
     * @param value The value to set the dropdown to.
     */
    Dropdown.prototype.setValue = function (value) {
        var _this = this;
        _.each(this.optionsElement, function (option) {
            if (Dom_1.$$(option).getAttribute('data-value') == value) {
                _this.selectOption(option);
            }
        });
    };
    Dropdown.prototype.selectOption = function (option, executeOnChange) {
        if (executeOnChange === void 0) { executeOnChange = true; }
        this.selectElement.value = option.value;
        if (executeOnChange) {
            this.onChange(this);
        }
    };
    Dropdown.prototype.buildContent = function () {
        var _this = this;
        this.selectElement = Dom_1.$$('select', { className: 'coveo-dropdown' }).el;
        var selectOptions = this.buildOptions();
        _.each(selectOptions, function (opt) {
            Dom_1.$$(_this.selectElement).append(opt);
        });
        this.element = this.selectElement;
    };
    Dropdown.prototype.buildOptions = function () {
        var _this = this;
        var ret = [];
        _.each(this.listOfValues, function (value) {
            ret.push(_this.buildOption(value));
        });
        return ret;
    };
    Dropdown.prototype.buildOption = function (value) {
        var option = Dom_1.$$('option');
        option.setAttribute('data-value', value);
        option.setAttribute('value', value);
        option.text(this.getDisplayValue(value));
        this.optionsElement.push(option.el);
        return option.el;
    };
    Dropdown.prototype.bindEvents = function () {
        var _this = this;
        Dom_1.$$(this.selectElement).on('change', function () { return _this.onChange(_this); });
    };
    return Dropdown;
}());
exports.Dropdown = Dropdown;


/***/ })

});
//# sourceMappingURL=SearchAlerts__7adec7eb6144877a5629.js.map