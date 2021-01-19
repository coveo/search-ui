webpackJsonpCoveo__temporary([48],{

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

/***/ 244:
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
var ChatterUtils_1 = __webpack_require__(224);
var Initialization_1 = __webpack_require__(2);
var Strings_1 = __webpack_require__(6);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
var ChatterPostedBy = /** @class */ (function (_super) {
    __extends(ChatterPostedBy, _super);
    function ChatterPostedBy(element, options, bindings, result) {
        var _this = _super.call(this, element, ChatterPostedBy.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ChatterPostedBy, options);
        if (Utils_1.Utils.getFieldValue(_this.result, 'sfcreatedbyname') != null) {
            var from = Dom_1.$$('span');
            from.text((_this.options.useFromInstead ? Strings_1.l('From') : Strings_1.l('PostedBy')) + " ");
            Dom_1.$$(element).append(from.el);
            Dom_1.$$(element).append(_this.renderLink(Utils_1.Utils.getFieldValue(_this.result, 'sfcreatedbyname'), Utils_1.Utils.getFieldValue(_this.result, 'sfcreatedbyid')));
            if (_this.options.enablePostedOn &&
                !Utils_1.Utils.isNullOrUndefined(Utils_1.Utils.getFieldValue(_this.result, 'sfparentname')) &&
                !Utils_1.Utils.isNullOrUndefined(Utils_1.Utils.getFieldValue(_this.result, 'sfparentid'))) {
                // Post on user's wall
                if (!Utils_1.Utils.isNullOrUndefined(Utils_1.Utils.getFieldValue(_this.result, 'sfuserid')) &&
                    Utils_1.Utils.getFieldValue(_this.result, 'sfuserid') != Utils_1.Utils.getFieldValue(_this.result, 'sfinsertedbyid')) {
                    var onFeed = Dom_1.$$('span');
                    var content = " " + Strings_1.l('OnFeed', _this.renderLink(Utils_1.Utils.getFieldValue(_this.result, 'sfparentname'), Utils_1.Utils.getFieldValue(_this.result, 'sfparentid')).outerHTML);
                    onFeed.el.innerHTML = content;
                    Dom_1.$$(element).append(onFeed.el);
                }
                else if (Utils_1.Utils.isNullOrUndefined(Utils_1.Utils.getFieldValue(_this.result, 'sfuserid'))) {
                    var onUser = Dom_1.$$('span');
                    onUser.text(" " + Strings_1.l('On').toLowerCase() + " ");
                    Dom_1.$$(element).append(onUser.el);
                    Dom_1.$$(element).append(_this.renderLink(Utils_1.Utils.getFieldValue(_this.result, 'sfparentname'), Utils_1.Utils.getFieldValue(_this.result, 'sfparentid')));
                }
            }
        }
        return _this;
    }
    ChatterPostedBy.prototype.renderLink = function (text, id) {
        var link = Dom_1.$$('a', {
            href: ChatterUtils_1.ChatterUtils.buildURI(this.result.clickUri, Utils_1.Utils.getFieldValue(this.result, 'sffeeditemid'), id)
        });
        link.text(text);
        return ChatterUtils_1.ChatterUtils.bindClickEventToElement(link.el, this.options.openInPrimaryTab, this.options.openInSubTab);
    };
    ChatterPostedBy.ID = 'ChatterPostedBy';
    ChatterPostedBy.doExport = function () {
        GlobalExports_1.exportGlobally({
            ChatterPostedBy: ChatterPostedBy
        });
    };
    ChatterPostedBy.options = {
        enablePostedOn: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        useFromInstead: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        openInPrimaryTab: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        openInSubTab: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    ChatterPostedBy.fields = ['sfcreatedbyname', 'sfcreatedbyid', 'sffeeditemid', 'sfuserid', 'sfinsertedbyid', 'sfparentid', 'sfparentname'];
    return ChatterPostedBy;
}(Component_1.Component));
exports.ChatterPostedBy = ChatterPostedBy;
Initialization_1.Initialization.registerAutoCreateComponent(ChatterPostedBy);


/***/ })

});
//# sourceMappingURL=ChatterPostedBy__ec82d15c0e890cb8a4e5.js.map