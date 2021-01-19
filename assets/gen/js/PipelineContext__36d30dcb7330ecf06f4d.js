webpackJsonpCoveo__temporary([79],{

/***/ 261:
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
var QueryEvents_1 = __webpack_require__(11);
var GlobalExports_1 = __webpack_require__(3);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
/**
 * The `PipelineContext` component injects custom contextual information into the search requests and usage analytics search events sent from a search interface.
 *
 * This component is meant to be initialized on a `script` HTML tag whose `type` attribute is set to `text/context` and whose optional JSON content defines the custom information to send (each value can be set to a string or array of strings).
 *
 * See [Sending Custom Context Information](https://docs.coveo.com/en/399/).
 * Note: To customize the context sent on all usage analytics events, see [Sending Custom Metadata with Search, Click, or Custom Events](https://docs.coveo.com/en/2004/javascript-search-framework/sending-custom-metadata-with-search-click-or-custom-events).
 */
var PipelineContext = /** @class */ (function (_super) {
    __extends(PipelineContext, _super);
    function PipelineContext(element, options, bindings) {
        var _this = _super.call(this, element, PipelineContext.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.contextContent = {};
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, PipelineContext, options);
        _this.setContext(Dom_1.$$(_this.element)
            .text()
            .trim());
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        return _this;
    }
    /**
     * **Available since the [December 2017 Release](https://docs.coveo.com/en/373).**
     *
     * Sets a new context, replacing the previous context if applicable.
     *
     * @param newContext The new context to set, which can be directly passed as a JSON, or as a stringified JSON.
     */
    PipelineContext.prototype.setContext = function (newContext) {
        if (_.isString(newContext)) {
            var contextParsed = this.tryParseContextFromString(newContext);
            this.contextContent = contextParsed;
        }
        else {
            this.contextContent = newContext;
        }
    };
    /**
     * Returns the current context
     */
    PipelineContext.prototype.getContext = function () {
        var _this = this;
        var keys = this.getContextKeys();
        return _.object(keys, _.map(keys, function (key) { return _this.getContextValue(key); }));
    };
    /**
     * **Available since the [December 2017 Release](https://docs.coveo.com/en/373).**
     *
     * Sets a value for a context key, replacing the previous value if applicable.
     * @param contextKey
     * @param contextValue
     */
    PipelineContext.prototype.setContextValue = function (contextKey, contextValue) {
        this.contextContent[contextKey] = contextValue;
    };
    /**
     * Return all the context keys configured for context.
     * @returns {string[]}
     */
    PipelineContext.prototype.getContextKeys = function () {
        return _.keys(this.contextContent);
    };
    /**
     * Get the context value associated to the given key.
     *
     * If the global variable Coveo.context contains the requested key, this method will return the value contained in Coveo.context instead of the one contained internally.
     *
     * This is especially useful in a Coveo for Salesforce context, where context values can be extracted from a backend service.
     * @param key
     * @returns {string}
     */
    PipelineContext.prototype.getContextValue = function (key) {
        var _this = this;
        var contextValue = this.contextContent[key];
        if (_.isArray(contextValue)) {
            var contextValues_1 = [];
            _.each(this.contextContent[key], function (value) {
                contextValues_1.push(_this.getModifiedData(value));
            });
            return contextValues_1;
        }
        else if (_.isString(contextValue)) {
            return this.getModifiedData(contextValue);
        }
        return '';
    };
    PipelineContext.prototype.handleBuildingQuery = function (args) {
        var _this = this;
        var keys = this.getContextKeys();
        _.each(keys, function (key) {
            args.queryBuilder.addContextValue(key, _this.getContextValue(key));
        });
    };
    PipelineContext.prototype.tryParseContextFromString = function (contextAsString) {
        if (_.isEmpty(contextAsString)) {
            return {};
        }
        try {
            // Context could be HTML encoded (eg: Coveo for Salesforce)
            return JSON.parse(Utils_1.Utils.decodeHTMLEntities(contextAsString));
        }
        catch (e) {
            try {
                return JSON.parse(contextAsString);
            }
            catch (e) {
                this.logger.error("Error while trying to parse context from the PipelineContext component", e);
                return null;
            }
        }
    };
    PipelineContext.prototype.getModifiedData = function (value) {
        /* We need to modify the data to escape special salesforce characters. eg: {! }
         If we find the matching value in the global Coveo.context variable, we return that one instead of the one present locally.
         So, concretely, the component could contain :
         {
           "productName" : "{! productValueFromSalesforce }"
         }
    
         This means that in those case, we would try to access Coveo.context.productValueFromSalesforce (which would in theory be a "real" product value from salesforce, and not a placeholder/variable)
        */
        return value.replace(/\{\!([^\}]+)\}/g, function (all, contextKey) {
            var trimmedKey = contextKey.trim();
            if (Coveo.context && trimmedKey in Coveo.context) {
                return Coveo.context[trimmedKey];
            }
            else if (trimmedKey == PipelineContext.CURRENT_URL) {
                return window.location.href;
            }
            return '';
        });
    };
    PipelineContext.ID = 'PipelineContext';
    PipelineContext.CURRENT_URL = 'CurrentUrl';
    PipelineContext.doExport = function () {
        GlobalExports_1.exportGlobally({
            PipelineContext: PipelineContext
        });
    };
    return PipelineContext;
}(Component_1.Component));
exports.PipelineContext = PipelineContext;
Initialization_1.Initialization.registerAutoCreateComponent(PipelineContext);


/***/ })

});
//# sourceMappingURL=PipelineContext__36d30dcb7330ecf06f4d.js.map