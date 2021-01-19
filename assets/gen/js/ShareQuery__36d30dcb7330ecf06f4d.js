webpackJsonpCoveo__temporary([59],{

/***/ 280:
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
var SettingsEvents_1 = __webpack_require__(53);
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(6);
var Utils_1 = __webpack_require__(4);
var Initialization_1 = __webpack_require__(2);
var GlobalExports_1 = __webpack_require__(3);
var ExternalModulesShim_1 = __webpack_require__(26);
__webpack_require__(667);
var SVGIcons_1 = __webpack_require__(12);
/**
 * The ShareQuery component populates the {@link Settings} popup menu with the **Share Query** menu item. When the end
 * user clicks this item, it displays a panel containing two input boxes: one containing a shareable link and the other
 * containing the complete current query expression.
 */
var ShareQuery = /** @class */ (function (_super) {
    __extends(ShareQuery, _super);
    /**
     * Creates a new ShareQuery component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the ShareQuery component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function ShareQuery(element, options, bindings, ModalBox) {
        if (ModalBox === void 0) { ModalBox = ExternalModulesShim_1.ModalBox; }
        var _this = _super.call(this, element, ShareQuery.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.ModalBox = ModalBox;
        _this.bind.onRootElement(SettingsEvents_1.SettingsEvents.settingsPopulateMenu, function (args) {
            args.menuData.push({
                className: 'coveo-share-query',
                text: Strings_1.l('ShareQuery'),
                onOpen: function () { return _this.open(); },
                onClose: function () { return _this.close(); },
                svgIcon: SVGIcons_1.SVGIcons.icons.dropdownShareQuery,
                svgIconClassName: 'coveo-share-query-svg'
            });
        });
        return _this;
    }
    /**
     * Open the **Share Query** modal box.
     */
    ShareQuery.prototype.open = function () {
        if (this.modalbox == null) {
            this.dialogBoxContent = this.buildContent();
            this.modalbox = this.ModalBox.open(this.dialogBoxContent, {
                title: Strings_1.l('ShareQuery'),
                className: 'coveo-share-query-opened',
                body: this.searchInterface.options.modalContainer
            });
        }
    };
    /**
     * Close the **Share Query** modal box.
     */
    ShareQuery.prototype.close = function () {
        if (this.modalbox) {
            this.modalbox.close();
            this.modalbox = null;
        }
    };
    /**
     * Gets the link to the current query.
     */
    ShareQuery.prototype.getLinkToThisQuery = function () {
        if (!this.linkToThisQuery) {
            this.buildLinkToThisQuery();
        }
        return this.linkToThisQuery.value;
    };
    /**
     * Sets the link to the current query.
     */
    ShareQuery.prototype.setLinkToThisQuery = function (link) {
        if (!this.linkToThisQuery) {
            this.buildLinkToThisQuery();
        }
        this.linkToThisQuery.value = link;
    };
    /**
     * Gets the complete query expression string
     */
    ShareQuery.prototype.getCompleteQuery = function () {
        if (!this.completeQuery) {
            this.buildCompleteQuery();
        }
        return this.completeQuery.value;
    };
    /**
     * Set the complete query expression string.
     */
    ShareQuery.prototype.setCompleteQuery = function (completeQuery) {
        if (!this.completeQuery) {
            this.buildCompleteQuery();
        }
        this.completeQuery.value = completeQuery;
    };
    ShareQuery.prototype.outputIfNotNull = function (value) {
        if (value) {
            return '(' + value + ')';
        }
        return '';
    };
    ShareQuery.prototype.buildContent = function () {
        var content = Dom_1.$$('div', {
            className: 'coveo-share-query-summary-info'
        }).el;
        var boxes = Dom_1.$$('div', {
            className: 'coveo-share-query-summary-info-boxes'
        }).el;
        this.buildLinkToThisQuery();
        this.buildCompleteQuery();
        boxes.appendChild(this.buildTextBoxWithLabel(Strings_1.l('Link'), this.linkToThisQuery));
        boxes.appendChild(this.buildTextBoxWithLabel(Strings_1.l('CompleteQuery'), this.completeQuery));
        content.appendChild(boxes);
        Component_1.Component.pointElementsToDummyForm(content);
        return content;
    };
    ShareQuery.prototype.buildCompleteQuery = function () {
        this.completeQuery = Dom_1.$$('input', {
            type: 'text',
            className: 'coveo-share-query-summary-info-input'
        }).el;
        var lastQuery = this.queryController.getLastQuery();
        this.completeQuery.value = Utils_1.Utils.trim(this.outputIfNotNull(lastQuery.q) + " " + this.outputIfNotNull(lastQuery.aq) + " " + this.outputIfNotNull(lastQuery.cq));
    };
    ShareQuery.prototype.buildLinkToThisQuery = function () {
        var _this = this;
        this.linkToThisQuery = Dom_1.$$('input', {
            type: 'text',
            className: 'coveo-share-query-summary-info-input'
        }).el;
        Dom_1.$$(this.linkToThisQuery).on('click', function () { return _this.linkToThisQuery.select(); });
        this.linkToThisQuery.value = window.location.href;
    };
    ShareQuery.prototype.buildTextBoxWithLabel = function (label, input) {
        var labelElement = Dom_1.$$('span', {
            className: 'coveo-share-query-summary-info-label'
        });
        labelElement.text(label);
        var returnDiv = Dom_1.$$('div').el;
        returnDiv.appendChild(labelElement.el);
        returnDiv.appendChild(input);
        return returnDiv;
    };
    ShareQuery.ID = 'ShareQuery';
    ShareQuery.options = {};
    ShareQuery.doExport = function () {
        GlobalExports_1.exportGlobally({
            ShareQuery: ShareQuery
        });
    };
    return ShareQuery;
}(Component_1.Component));
exports.ShareQuery = ShareQuery;
Initialization_1.Initialization.registerAutoCreateComponent(ShareQuery);


/***/ }),

/***/ 667:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=ShareQuery__36d30dcb7330ecf06f4d.js.map