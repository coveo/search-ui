webpackJsonpCoveo__temporary([50],{

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

/***/ 242:
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
var Initialization_1 = __webpack_require__(2);
var ComponentOptions_1 = __webpack_require__(8);
var Component_1 = __webpack_require__(7);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(6);
var ChatterUtils_1 = __webpack_require__(224);
var GlobalExports_1 = __webpack_require__(3);
var ChatterLikedBy = /** @class */ (function (_super) {
    __extends(ChatterLikedBy, _super);
    function ChatterLikedBy(element, options, bindings, result) {
        var _this = _super.call(this, element, ChatterLikedBy.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ChatterLikedBy, options);
        if (!Utils_1.Utils.isNullOrUndefined(Utils_1.Utils.getFieldValue(result, 'sflikedby')) &&
            !Utils_1.Utils.isNullOrUndefined(Utils_1.Utils.getFieldValue(result, 'sflikedbyid'))) {
            var likeNames = Utils_1.Utils.getFieldValue(result, 'sflikedby').split(';');
            var likeIds = Utils_1.Utils.getFieldValue(result, 'sflikedbyid').split(';');
            var rootElement = Dom_1.$$('div', {
                className: 'coveo-chatter-result-box-row'
            });
            Dom_1.$$(element).append(rootElement.el);
            var thumbIcon = Dom_1.$$('div', {
                className: 'coveo-sprites-common-thumbup_inactive coveo-chatter-result-box-icon'
            });
            rootElement.append(thumbIcon.el);
            var fullListElement = Dom_1.$$('div', {
                className: 'coveo-chatter-result-likes'
            });
            rootElement.append(fullListElement.el);
            _this.renderLikesList(fullListElement.el, result, likeNames, likeIds, _this.options.nbLikesToRender);
        }
        return _this;
    }
    ChatterLikedBy.prototype.renderLikesList = function (element, result, likeNames, likeIds, nbLikesToRender) {
        var _this = this;
        var tempElement = Dom_1.$$('div');
        for (var i = 0; i < likeIds.length - 1 && (nbLikesToRender == 0 || i < nbLikesToRender); i++) {
            tempElement.append(this.renderLikeLink(result, likeNames[i], likeIds[i]));
            if ((nbLikesToRender == 0 || i < nbLikesToRender - 1) && i < likeIds.length - 2) {
                tempElement.append(Dom_1.$$('span', {}, ', ').el);
            }
            else if (i < likeIds.length - 1) {
                tempElement.append(Dom_1.$$('span', {}, " " + Strings_1.l('And').toLowerCase() + " ").el);
            }
        }
        if (nbLikesToRender == 0 || likeIds.length <= nbLikesToRender) {
            tempElement.append(this.renderLikeLink(result, likeNames[likeIds.length - 1], likeIds[likeIds.length - 1]));
        }
        else {
            var othersCount = likeIds.length - nbLikesToRender;
            var clickableLink = Dom_1.$$('a');
            clickableLink.text(" " + Strings_1.l('Others', othersCount.toString(), othersCount));
            clickableLink.on('click', function (e) {
                e.preventDefault();
                Dom_1.$$(element).empty();
                _this.renderLikesList(element, result, likeNames, likeIds, 0);
            });
            tempElement.append(clickableLink.el);
        }
        if (likeIds.length > 0) {
            var name_1 = Dom_1.$$('span');
            name_1.el.innerHTML = Strings_1.l('LikesThis', tempElement.el.innerHTML, likeIds.length);
            Dom_1.$$(element).append(name_1.el);
        }
    };
    ChatterLikedBy.prototype.renderLikeLink = function (result, likeName, likeId) {
        var link = Dom_1.$$('a', {
            href: ChatterUtils_1.ChatterUtils.buildURI(result.clickUri, Utils_1.Utils.getFieldValue(result, 'sffeeditemid'), likeId)
        });
        link.text(likeName);
        return link.el;
    };
    ChatterLikedBy.ID = 'ChatterLikedBy';
    ChatterLikedBy.doExport = function () {
        GlobalExports_1.exportGlobally({
            ChatterLikedBy: ChatterLikedBy
        });
    };
    ChatterLikedBy.options = {
        nbLikesToRender: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 2, min: 0 }),
        openInPrimaryTab: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        openInSubTab: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true })
    };
    return ChatterLikedBy;
}(Component_1.Component));
exports.ChatterLikedBy = ChatterLikedBy;
Initialization_1.Initialization.registerAutoCreateComponent(ChatterLikedBy);


/***/ })

});
//# sourceMappingURL=ChatterLikedBy__ec82d15c0e890cb8a4e5.js.map