webpackJsonpCoveo__temporary([49],{

/***/ 224:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChatterUtils = /** @class */ (function () {
    function ChatterUtils() {
    }
    ChatterUtils.buildURI = function (objectURI, objectId, newObjectId) {
        return objectURI.replace(objectId, newObjectId);
    };
    ChatterUtils.bindClickEventToElement = function (element, openInPrimaryTab, openInSubTab) {
        return element;
    };
    return ChatterUtils;
}());
exports.ChatterUtils = ChatterUtils;


/***/ }),

/***/ 243:
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
var Utils_1 = __webpack_require__(4);
var ChatterUtils_1 = __webpack_require__(224);
var Strings_1 = __webpack_require__(6);
var Initialization_1 = __webpack_require__(2);
var Dom_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
var ChatterPostAttachment = /** @class */ (function (_super) {
    __extends(ChatterPostAttachment, _super);
    function ChatterPostAttachment(element, options, bindings, result) {
        var _this = _super.call(this, element, ChatterPostAttachment.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        if (!Utils_1.Utils.isNullOrUndefined(Utils_1.Utils.getFieldValue(result, 'sfcontentversionid'))) {
            var rootElement = Dom_1.$$('div', {
                className: 'coveo-chatter-result-box-row'
            });
            Dom_1.$$(element).append(rootElement.el);
            var icon = Dom_1.$$('div', {
                className: 'coveo-sprites-common-system coveo-chatter-result-box-icon'
            });
            rootElement.append(icon.el);
            var linkElement = Dom_1.$$('a', {
                href: ChatterUtils_1.ChatterUtils.buildURI(result.clickUri, Utils_1.Utils.getFieldValue(result, 'sffeeditemid'), Utils_1.Utils.getFieldValue(result, 'sfcontentversionid'))
            });
            rootElement.append(linkElement.el);
            var fieldValue = Utils_1.Utils.getFirstAvailableFieldValue(result, ['sfcontentfilename', 'sftitle', 'sf_title']);
            if (!Utils_1.Utils.isNullOrUndefined(fieldValue)) {
                linkElement.text(fieldValue);
            }
            else {
                linkElement.text(Strings_1.l('ShowAttachment'));
            }
        }
        return _this;
    }
    ChatterPostAttachment.ID = 'ChatterPostAttachment';
    ChatterPostAttachment.doExport = function () {
        GlobalExports_1.exportGlobally({
            ChatterPostAttachment: ChatterPostAttachment
        });
    };
    return ChatterPostAttachment;
}(Component_1.Component));
exports.ChatterPostAttachment = ChatterPostAttachment;
Initialization_1.Initialization.registerAutoCreateComponent(ChatterPostAttachment);


/***/ })

});
//# sourceMappingURL=ChatterPostAttachment__ec82d15c0e890cb8a4e5.js.map