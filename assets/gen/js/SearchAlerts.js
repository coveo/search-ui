webpackJsonpCoveo__temporary([7,66],{

/***/ 268:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIPTION_TYPE = {
    followQuery: 'followQuery',
    followDocument: 'followDocument',
};


/***/ }),

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SVGDom = (function () {
    function SVGDom() {
    }
    SVGDom.addClassToSVGInContainer = function (svgContainer, classToAdd) {
        var svgElement = svgContainer.querySelector('svg');
        svgElement.setAttribute('class', SVGDom.getClass(svgElement) + " " + classToAdd);
    };
    SVGDom.removeClassFromSVGInContainer = function (svgContainer, classToRemove) {
        var svgElement = svgContainer.querySelector('svg');
        svgElement.setAttribute('class', SVGDom.getClass(svgElement).replace(classToRemove, ''));
    };
    SVGDom.getClass = function (svgElement) {
        var className = svgElement.getAttribute('class');
        return className ? className : '';
    };
    return SVGDom;
}());
exports.SVGDom = SVGDom;


/***/ }),

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SVGIcons = (function () {
    function SVGIcons() {
    }
    return SVGIcons;
}());
SVGIcons.search = __webpack_require__(456);
SVGIcons.more = __webpack_require__(454);
SVGIcons.loading = __webpack_require__(452);
SVGIcons.checkboxHookExclusionMore = __webpack_require__(451);
SVGIcons.arrowUp = __webpack_require__(450);
SVGIcons.arrowDown = __webpack_require__(449);
SVGIcons.mainClear = __webpack_require__(453);
SVGIcons.orAnd = __webpack_require__(455);
exports.SVGIcons = SVGIcons;


/***/ }),

/***/ 322:
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
var Component_1 = __webpack_require__(8);
var ComponentOptions_1 = __webpack_require__(9);
var SearchAlertsMessage_1 = __webpack_require__(633);
var SettingsEvents_1 = __webpack_require__(40);
var QueryEvents_1 = __webpack_require__(11);
var Assert_1 = __webpack_require__(7);
var SearchAlertEvents_1 = __webpack_require__(58);
var Subscription_1 = __webpack_require__(268);
var Initialization_1 = __webpack_require__(2);
var Strings_1 = __webpack_require__(10);
var Dom_1 = __webpack_require__(3);
var ExternalModulesShim_1 = __webpack_require__(22);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
var Dropdown_1 = __webpack_require__(52);
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
var SearchAlerts = (function (_super) {
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
                        onClose: function () { return _this.close(); }
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
                _this.queryController.getEndpoint().listSubscriptions()
                    .then(function () {
                    _this.bind.onRootElement(SettingsEvents_1.SettingsEvents.settingsPopulateMenu, function (args) {
                        if (_this.options.enableFollowQuery) {
                            args.menuData.push({
                                text: Strings_1.l('SearchAlerts_followQuery'),
                                className: 'coveo-follow-query',
                                tooltip: Strings_1.l('FollowQueryDescription'),
                                onOpen: function () { return _this.followQuery(); },
                                onClose: function () {
                                }
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
        this.queryController.getEndpoint().follow(request)
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
            className: 'coveo-subscriptions-panel-content-type',
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
        return this.queryController.getEndpoint().listSubscriptions().then(function (subscriptions) {
            _.each(subscriptions, function (subscription) {
                _this.addSearchAlert(subscription, container);
            });
        }).catch(function () {
            sizeModForModalBox = 'small';
            container.empty();
            container.append(_this.getFailureMessage().el);
        }).finally(function () {
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
        var buildDropdown = function () {
            return new Dropdown_1.Dropdown(function (dropdownInstance) {
                _this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchAlertsUpdateSubscription, {
                    subscription: context,
                    frequency: dropdownInstance.getValue()
                }, _this.element);
                _this.updateAndSyncSearchAlert(subscription);
            }, _.map(frequencies, function (frequency) { return frequency.value; })).build();
        };
        var contentTypeElement = Dom_1.$$('td', {
            className: 'coveo-subscriptions-panel-content-type'
        }, Strings_1.l('SearchAlerts_Type_' + subscription.type));
        var contextElement = Dom_1.$$('td', {
            className: 'coveo-subscriptions-panel-context',
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
            _this.queryController.getEndpoint()
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
            _this.queryController.getEndpoint()
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
        this.queryController.getEndpoint()
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
        return new SearchAlerts(element, options, root);
    };
    return SearchAlerts;
}(Component_1.Component));
SearchAlerts.ID = 'SearchAlerts';
SearchAlerts.doExport = function () {
    GlobalExports_1.exportGlobally({
        'SearchAlerts': SearchAlerts,
        'SearchAlertsMessage': SearchAlertsMessage_1.SearchAlertsMessage
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
    messageCloseDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 2000, min: 0, depend: 'enableMessage' }),
};
exports.SearchAlerts = SearchAlerts;
Initialization_1.Initialization.registerAutoCreateComponent(SearchAlerts);


/***/ }),

/***/ 449:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 10 6\" viewBox=\"0 0 10 6\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m5 5.932c-.222 0-.443-.084-.612-.253l-4.134-4.134c-.338-.338-.338-.886 0-1.224s.886-.338 1.224 0l3.522 3.521 3.523-3.521c.336-.338.886-.338 1.224 0s .337.886-.001 1.224l-4.135 4.134c-.168.169-.39.253-.611.253z\"></path></g></svg>"

/***/ }),

/***/ 450:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 10 6\" viewBox=\"0 0 10 6\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m5 .068c.222 0 .443.084.612.253l4.134 4.134c.338.338.338.886 0 1.224s-.886.338-1.224 0l-3.522-3.521-3.523 3.521c-.336.338-.886.338-1.224 0s-.337-.886.001-1.224l4.134-4.134c.168-.169.39-.253.612-.253z\"></path></g></svg>"

/***/ }),

/***/ 451:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 11 11\" viewBox=\"0 0 11 11\" xmlns=\"http://www.w3.org/2000/svg\"><g class=\"coveo-more-svg\" fill=\"none\"><path d=\"m10.083 4.583h-3.666v-3.666c0-.524-.393-.917-.917-.917s-.917.393-.917.917v3.667h-3.666c-.524-.001-.917.392-.917.916s.393.917.917.917h3.667v3.667c-.001.523.392.916.916.916s.917-.393.917-.917v-3.666h3.667c.523 0 .916-.393.916-.917-.001-.524-.394-.917-.917-.917z\"></path></g><g class=\"coveo-exclusion-svg\" fill=\"none\"><path d=\"m9.233 7.989-2.489-2.489 2.489-2.489c.356-.356.356-.889 0-1.244-.356-.356-.889-.356-1.244 0l-2.489 2.489-2.489-2.489c-.356-.356-.889-.356-1.244 0-.356.356-.356.889 0 1.244l2.489 2.489-2.489 2.489c-.356.356-.356.889 0 1.244.356.356.889.356 1.244 0l2.489-2.489 2.489 2.489c.356.356.889.356 1.244 0 .356-.355.356-.889 0-1.244z\"></path></g><g class=\"coveo-hook-svg\" fill=\"none\"><path d=\"m10.252 2.213c-.155-.142-.354-.211-.573-.213-.215.005-.414.091-.561.24l-4.873 4.932-2.39-2.19c-.154-.144-.385-.214-.57-.214-.214.004-.415.09-.563.24-.148.147-.227.343-.222.549.005.207.093.4.249.542l2.905 2.662c.168.154.388.239.618.239h.022.003c.237-.007.457-.101.618-.266l5.362-5.428c.148-.148.228-.344.223-.551s-.093-.399-.248-.542z\"></path></g></svg>"

/***/ }),

/***/ 452:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 18 18\" viewBox=\"0 0 18 18\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m16.76 8.051c-.448 0-.855-.303-.969-.757-.78-3.117-3.573-5.294-6.791-5.294s-6.01 2.177-6.79 5.294c-.134.537-.679.861-1.213.727-.536-.134-.861-.677-.728-1.212 1.004-4.009 4.594-6.809 8.731-6.809 4.138 0 7.728 2.8 8.73 6.809.135.536-.191 1.079-.727 1.213-.081.02-.162.029-.243.029z\"></path><path d=\"m9 18c-4.238 0-7.943-3.007-8.809-7.149-.113-.541.234-1.071.774-1.184.541-.112 1.071.232 1.184.773.674 3.222 3.555 5.56 6.851 5.56s6.178-2.338 6.852-5.56c.113-.539.634-.892 1.184-.773.54.112.887.643.773 1.184-.866 4.142-4.57 7.149-8.809 7.149z\"></path></g></svg>"

/***/ }),

/***/ 453:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 13 13\" viewBox=\"0 0 13 13\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m7.881 6.501 4.834-4.834c.38-.38.38-1.001 0-1.381s-1.001-.38-1.381 0l-4.834 4.834-4.834-4.835c-.38-.38-1.001-.38-1.381 0s-.38 1.001 0 1.381l4.834 4.834-4.834 4.834c-.38.38-.38 1.001 0 1.381s1.001.38 1.381 0l4.834-4.834 4.834 4.834c.38.38 1.001.38 1.381 0s .38-1.001 0-1.381z\"></path></g></svg>"

/***/ }),

/***/ 454:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-opacity=\"0\" d=\"m8.03.819c3.987 0 7.227 3.222 7.227 7.181s-3.239 7.181-7.227 7.181c-3.976 0-7.209-3.222-7.209-7.181s3.237-7.181 7.209-7.181\"></path><g fill=\"currentColor\"><path d=\"m0 8c0 4.416 3.572 8 7.991 8 4.425 0 8.009-3.581 8.009-8 0-4.416-3.581-8-8.009-8-4.416 0-7.991 3.581-7.991 8m8.031-6.4c3.553 0 6.441 2.872 6.441 6.4s-2.887 6.4-6.441 6.4c-3.544 0-6.425-2.872-6.425-6.4s2.885-6.4 6.425-6.4\"></path><path d=\"m10.988 9.024c.551 0 1-.449 1-1s-.449-1-1-1-1 .449-1 1 .449 1 1 1\"></path><path d=\"m7.991 9c .551 0 1-.449 1-1s-.449-1-1-1-1 .449-1 1 .449 1 1 1\"></path><path d=\"m4.994 9c .551 0 1-.449 1-1s-.449-1-1-1-1 .449-1 1 .449 1 1 1\"></path></g></svg>"

/***/ }),

/***/ 455:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 18 18\" viewBox=\"0 0 18 18\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-and-svg\" d=\"m13.769 5.294h-1.063v-1.063c0-2.329-1.894-4.231-4.231-4.231h-4.244c-2.329 0-4.231 1.894-4.231 4.231v4.244c0 2.329 1.894 4.231 4.231 4.231h1.063v1.063c0 2.329 1.894 4.231 4.231 4.231h4.244c2.329 0 4.231-1.894 4.231-4.231v-4.244c0-2.329-1.894-4.231-4.231-4.231zm2.731 8.475c0 1.506-1.225 2.731-2.731 2.731h-4.244c-1.506 0-2.731-1.225-2.731-2.731v-2.563h-2.563c-1.506 0-2.731-1.225-2.731-2.731v-4.244c0-1.506 1.225-2.731 2.731-2.731h4.244c1.506 0 2.731 1.225 2.731 2.731v2.563h2.563c1.506 0 2.731 1.225 2.731 2.731z\"></path><path class=\"coveo-or-svg\" d=\"m11.206 6.794v1.909c0 1.38-1.123 2.503-2.503 2.503h-1.909v-1.909c0-1.38 1.123-2.503 2.503-2.503zm1.5-1.5h-3.409c-2.209 0-4.003 1.792-4.003 4.003v3.409h3.409c2.209 0 4.003-1.792 4.003-4.003z\"></path></g></svg>"

/***/ }),

/***/ 456:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 20 20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-magnifier-circle-svg\" d=\"m8.368 16.736c-4.614 0-8.368-3.754-8.368-8.368s3.754-8.368 8.368-8.368 8.368 3.754 8.368 8.368-3.754 8.368-8.368 8.368m0-14.161c-3.195 0-5.793 2.599-5.793 5.793s2.599 5.793 5.793 5.793 5.793-2.599 5.793-5.793-2.599-5.793-5.793-5.793\"></path><path d=\"m18.713 20c-.329 0-.659-.126-.91-.377l-4.552-4.551c-.503-.503-.503-1.318 0-1.82.503-.503 1.318-.503 1.82 0l4.552 4.551c.503.503.503 1.318 0 1.82-.252.251-.581.377-.91.377\"></path></g></svg>"

/***/ }),

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(10);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
/**
 * A dropdown widget with standard styling.
 */
var Dropdown = (function () {
    /**
     * Creates a new `Dropdown`.
     * @param onChange The function to call when the dropdown selected value changes. This function takes the current
     * `Dropdown` instance as an argument.
     * @param listOfValues The selectable values to display in the dropdown.
     * @param getDisplayValue An optional function to modify the display values, rather than using the values as they
     * appear in the `listOfValues`.
     * @param label The label to display for the dropdown.
     */
    function Dropdown(onChange, listOfValues, getDisplayValue, label) {
        if (onChange === void 0) { onChange = function (dropdown) {
        }; }
        if (getDisplayValue === void 0) { getDisplayValue = Strings_1.l; }
        this.onChange = onChange;
        this.listOfValues = listOfValues;
        this.getDisplayValue = getDisplayValue;
        this.label = label;
        this.optionsElement = [];
        this.buildContent();
        this.select(0, false);
        this.bindEvents();
    }
    Dropdown.doExport = function () {
        GlobalExports_1.exportGlobally({
            'Dropdown': Dropdown
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


/***/ }),

/***/ 633:
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
var Component_1 = __webpack_require__(8);
var ComponentOptions_1 = __webpack_require__(9);
var SearchAlertEvents_1 = __webpack_require__(58);
var QueryEvents_1 = __webpack_require__(11);
var Subscription_1 = __webpack_require__(268);
var PopupUtils_1 = __webpack_require__(49);
var Strings_1 = __webpack_require__(10);
var Dom_1 = __webpack_require__(3);
var _ = __webpack_require__(1);
var SVGIcons_1 = __webpack_require__(29);
var SVGDom_1 = __webpack_require__(28);
/**
 * The SearchAlertsMessage component allows the {@link SearchAlerts} component to display messages.
 *
 * You should not include this component in your page. Instead, use a {@link SearchAlerts} component, and access the
 * {@link SearchAlerts.message} attribute.
 */
var SearchAlertsMessage = (function (_super) {
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
        this.message.el.innerHTML = "\n      <div class='coveo-subscriptions-messages-message'>\n        <div class='coveo-subscriptions-messages-content'>" + message + "</div>\n        <div class='coveo-subscriptions-messages-info-close'>" + SVGIcons_1.SVGIcons.checkboxHookExclusionMore + "</div>\n      </div>";
        this.message.toggleClass('coveo-subscriptions-messages-error', error);
        var closeButton = this.message.find('.coveo-subscriptions-messages-info-close');
        SVGDom_1.SVGDom.addClassToSVGInContainer(closeButton, 'coveo-subscript-messages-info-close-svg');
        Dom_1.$$(closeButton).on('click', function () { return _this.close(); });
        PopupUtils_1.PopupUtils.positionPopup(this.message.el, dom.el, this.root, {
            horizontal: PopupUtils_1.HorizontalAlignment.INNERLEFT,
            vertical: PopupUtils_1.VerticalAlignment.BOTTOM,
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
                var typeConfig = args.subscription.typeConfig;
                this.showMessage(Dom_1.$$(args.dom), Strings_1.l('SubscriptionsMessageFollow', _.escape(typeConfig.title)), false);
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
        this.closeTimeout = setTimeout(function () {
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
    return SearchAlertsMessage;
}(Component_1.Component));
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
    closeDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 2000, min: 0 }),
};
exports.SearchAlertsMessage = SearchAlertsMessage;


/***/ })

});
//# sourceMappingURL=SearchAlerts.js.map