webpackJsonpCoveo__temporary([12],{

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

/***/ 287:
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
var InitializationEvents_1 = __webpack_require__(15);
var BreadcrumbEvents_1 = __webpack_require__(43);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var Dom_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(10);
var Initialization_1 = __webpack_require__(2);
var QueryEvents_1 = __webpack_require__(11);
var KeyboardUtils_1 = __webpack_require__(21);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
__webpack_require__(561);
var SVGIcons_1 = __webpack_require__(29);
var SVGDom_1 = __webpack_require__(28);
/**
 * The Breadcrumb component displays a summary of the currently active query filters.
 *
 * For example, when the user selects a {@link Facet} value, the breadcrumbs display this value.
 *
 * The active filters are obtained by the component by firing an event in the Breadcrumb component.
 *
 * All other components having an active state can react to this event by providing custom bits of HTML to display
 * inside the breadcrumbs.
 *
 * Thus, it is possible to easily extend the Breadcrumb component using custom code to display information about custom
 * states and filters.
 *
 * See {@link BreadcrumbEvents} for the list of events and parameters sent when a Breadcrumb component is populated.
 */
var Breadcrumb = (function (_super) {
    __extends(Breadcrumb, _super);
    /**
     * Creates a new Breadcrumb component. Binds event on {@link QueryEvents.deferredQuerySuccess} to draw the
     * breadcrumbs.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Breadcrumb component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Breadcrumb(element, options, bindings) {
        var _this = _super.call(this, element, Breadcrumb.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Breadcrumb, options);
        _this.bind.oneRootElement(InitializationEvents_1.InitializationEvents.afterInitialization, function () { return _this.handleAfterInitialization(); });
        _this.bind.onRootElement(BreadcrumbEvents_1.BreadcrumbEvents.redrawBreadcrumb, function () { return _this.redrawBreadcrumb(); });
        _this.element.style.display = 'none';
        return _this;
    }
    /**
     * Triggers the event to populate the breadcrumbs. Components such as {@link Facet} can populate the breadcrumbs.
     *
     * This method triggers a {@link BreadcrumbEvents.populateBreadcrumb} event with an
     * {@link IPopulateBreadcrumbEventArgs} object (an array) that other components or code can populate.
     * @returns {IBreadcrumbItem[]} A populated breadcrumb item list.
     */
    Breadcrumb.prototype.getBreadcrumbs = function () {
        var args = { breadcrumbs: [] };
        this.bind.trigger(this.root, BreadcrumbEvents_1.BreadcrumbEvents.populateBreadcrumb, args);
        this.logger.debug('Retrieved breadcrumbs', args.breadcrumbs);
        this.lastBreadcrumbs = args.breadcrumbs;
        return args.breadcrumbs;
    };
    /**
     * Triggers the event to clear the current breadcrumbs that components such as {@link Facet} can populate.
     *
     * Also triggers a new query and logs the `breadcrumbResetAll` event in the usage analytics.
     */
    Breadcrumb.prototype.clearBreadcrumbs = function () {
        var args = {};
        this.bind.trigger(this.root, BreadcrumbEvents_1.BreadcrumbEvents.clearBreadcrumb, args);
        this.logger.debug('Clearing breadcrumbs');
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.breadcrumbResetAll, {});
        this.queryController.executeQuery();
    };
    /**
     * Draws the specified breadcrumb items.
     * @param breadcrumbs The breadcrumb items to draw.
     */
    Breadcrumb.prototype.drawBreadcrumb = function (breadcrumbs) {
        var _this = this;
        Dom_1.$$(this.element).empty();
        if (breadcrumbs.length != 0) {
            this.element.style.display = '';
        }
        else {
            this.element.style.display = 'none';
        }
        var breadcrumbItems = document.createElement('div');
        Dom_1.$$(breadcrumbItems).addClass('coveo-breadcrumb-items');
        this.element.appendChild(breadcrumbItems);
        _.each(breadcrumbs, function (bcrumb) {
            var elem = bcrumb.element;
            Dom_1.$$(elem).addClass('coveo-breadcrumb-item');
            breadcrumbItems.appendChild(elem);
        });
        var clear = Dom_1.$$('div', {
            className: 'coveo-breadcrumb-clear-all',
            title: Strings_1.l('ClearAllFilters'),
            tabindex: 0
        }).el;
        var clearIcon = Dom_1.$$('div', { className: 'coveo-icon coveo-breadcrumb-clear-all-icon' }, SVGIcons_1.SVGIcons.checkboxHookExclusionMore).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(clearIcon, 'coveo-breadcrumb-clear-all-svg');
        clear.appendChild(clearIcon);
        if (this.searchInterface.isNewDesign()) {
            var clearText = document.createElement('div');
            Dom_1.$$(clearText).text(Strings_1.l('Clear', ''));
            clear.appendChild(clearText);
            this.element.appendChild(clear);
        }
        else {
            this.element.insertBefore(clear, this.element.firstChild);
        }
        var clearAction = function () { return _this.clearBreadcrumbs(); };
        this.bind.on(clear, 'click', clearAction);
        this.bind.on(clear, 'keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, clearAction));
    };
    Breadcrumb.prototype.redrawBreadcrumb = function () {
        this.lastBreadcrumbs ? this.drawBreadcrumb(this.lastBreadcrumbs) : this.drawBreadcrumb(this.getBreadcrumbs());
    };
    Breadcrumb.prototype.handleDeferredQuerySuccess = function () {
        this.drawBreadcrumb(this.getBreadcrumbs());
    };
    Breadcrumb.prototype.handleAfterInitialization = function () {
        var _this = this;
        // We must bind to these events after the initialization to make sure the breadcrumb generation
        // is made with updated components. (E.G facet, facetrange, ...)
        this.bind.onRootElement(QueryEvents_1.QueryEvents.deferredQuerySuccess, function () { return _this.handleDeferredQuerySuccess(); });
    };
    return Breadcrumb;
}(Component_1.Component));
Breadcrumb.ID = 'Breadcrumb';
Breadcrumb.options = {};
Breadcrumb.doExport = function () {
    GlobalExports_1.exportGlobally({
        'Breadcrumb': Breadcrumb
    });
};
exports.Breadcrumb = Breadcrumb;
Initialization_1.Initialization.registerAutoCreateComponent(Breadcrumb);


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

/***/ 561:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=Breadcrumb.js.map