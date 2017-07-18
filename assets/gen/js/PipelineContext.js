webpackJsonpCoveo__temporary([64],{

/***/ 310:
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
var Utils_1 = __webpack_require__(5);
var QueryEvents_1 = __webpack_require__(11);
var Dom_1 = __webpack_require__(3);
var Initialization_1 = __webpack_require__(2);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
/**
 * A PipelineContext is used to add contextual information about the environment inside which the query is executed.
 *
 * It allows to pass arbitrary key values pairs ( think `JSON` ), which can then be leveraged by the [Query Pipeline](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=108),
 * or by Coveo Machine Learning.
 *
 * This can be any arbitrary information that you can use to contextualize the query and help Coveo improve relevance by returning results tailored to a specific context.
 *
 * This component is meant to be configured using a script tag, with a JSON content.
 *
 * ```
 * <script class='CoveoPipelineContext' type='text/context'>
 *   {
 *      "foo" : "bar"
 *   }
 * </script>
 * ```
 *
 * You can also simply use JavaScript code to pass context values, using the {@link QueryBuilder.addContextValue} method.
 *
 * This mean you do not necessarily need to use this component to pass context.
 * ```
 * Coveo.$$(root).on('buildingQuery', function(args) {
 *     args.queryBuilder.addContextValue('foo', 'bar');
 * })
 * ```
 *
 * Using this component as opposed to JavaScript code means you will be able to leverage the interface editor.
 *
 * Regardless of if you use this component or JavaScript to add context, both will add the needed data in the [Query.Context]{@link IQuery.context} parameter.
 */
var PipelineContext = (function (_super) {
    __extends(PipelineContext, _super);
    function PipelineContext(element, options, bindings) {
        var _this = _super.call(this, element, PipelineContext.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, PipelineContext, options);
        if (_this.element.tagName.toLowerCase() == 'script') {
            try {
                // Content can be HTML encoded for special char ({!})
                _this.content = JSON.parse(Utils_1.Utils.decodeHTMLEntities(Dom_1.$$(_this.element).text()));
            }
            catch (e) {
                try {
                    _this.content = JSON.parse(Dom_1.$$(_this.element).text());
                }
                catch (e) {
                    return _this;
                }
            }
        }
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        return _this;
    }
    /**
     * Return all the context keys configured for context.
     * @returns {string[]|Array}
     */
    PipelineContext.prototype.getContextKeys = function () {
        return this.content ? _.keys(this.content) : [];
    };
    /**
     * Get the context value associated to the given key.
     * @param key
     * @returns {string}
     */
    PipelineContext.prototype.getContextValue = function (key) {
        return this.content[key].replace(/\{\!([^\}]+)\}/g, function (all, contextKey) {
            if (Coveo.context != null && contextKey in Coveo.context) {
                return Coveo.context[contextKey];
            }
            else if (contextKey == PipelineContext.CURRENT_URL) {
                return window.location.href;
            }
            return '';
        });
    };
    PipelineContext.prototype.handleBuildingQuery = function (args) {
        var _this = this;
        var keys = this.getContextKeys();
        _.each(keys, function (key) {
            args.queryBuilder.addContextValue(key, _this.getContextValue(key));
        });
    };
    return PipelineContext;
}(Component_1.Component));
PipelineContext.ID = 'PipelineContext';
PipelineContext.CURRENT_URL = 'CurrentUrl';
PipelineContext.doExport = function () {
    GlobalExports_1.exportGlobally({
        'PipelineContext': PipelineContext,
        'context': exports.context
    });
};
exports.PipelineContext = PipelineContext;
Initialization_1.Initialization.registerAutoCreateComponent(PipelineContext);


/***/ })

});
//# sourceMappingURL=PipelineContext.js.map