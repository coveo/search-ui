webpackJsonpCoveo__temporary([86],{

/***/ 245:
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
var Initialization_1 = __webpack_require__(2);
var Dom_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
var ChatterTopic = /** @class */ (function (_super) {
    __extends(ChatterTopic, _super);
    function ChatterTopic(element, options, bindings, result) {
        var _this = _super.call(this, element, ChatterTopic.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        if (!Utils_1.Utils.isNullOrUndefined(Utils_1.Utils.getFieldValue(_this.result, 'coveochatterfeedtopics'))) {
            var rootElement = Dom_1.$$('div', {
                className: 'coveo-chatter-result-box-row'
            });
            var topics = Utils_1.Utils.getFieldValue(result, 'coveochatterfeedtopics').split(';');
            var icon = Dom_1.$$('div', {
                className: 'coveo-sprites-common-tagging_tag coveo-chatter-result-box-icon'
            });
            rootElement.append(icon.el);
            for (var i = 0; i < topics.length; i++) {
                var topic = Dom_1.$$('span');
                topic.text(topics[i]);
                rootElement.append(topic.el);
                if (i < topics.length - 1) {
                    var separator = Dom_1.$$('span');
                    separator.text(', ');
                    rootElement.append(separator.el);
                }
            }
            Dom_1.$$(element).append(rootElement.el);
        }
        return _this;
    }
    ChatterTopic.ID = 'ChatterTopic';
    ChatterTopic.doExport = function () {
        GlobalExports_1.exportGlobally({
            ChatterTopic: ChatterTopic
        });
    };
    return ChatterTopic;
}(Component_1.Component));
exports.ChatterTopic = ChatterTopic;
Initialization_1.Initialization.registerAutoCreateComponent(ChatterTopic);


/***/ })

});
//# sourceMappingURL=ChatterTopic__b6f3a40b26ad27101c27.js.map