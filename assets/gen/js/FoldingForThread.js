webpackJsonpCoveo__temporary([24,41],{

/***/ 247:
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
var SortCriteria_1 = __webpack_require__(440);
var ComponentOptions_1 = __webpack_require__(9);
var Utils_1 = __webpack_require__(5);
var Assert_1 = __webpack_require__(7);
var QueryEvents_1 = __webpack_require__(11);
var Initialization_1 = __webpack_require__(2);
var Dom_1 = __webpack_require__(3);
var QueryBuilder_1 = __webpack_require__(44);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
/**
 * The `Folding` component makes it possible to render hierarchic representations of search results sharing a common
 * [`field`]{@link Folding.options.field}.
 *
 * This component has no visual impact on its own. It simply folds certain search results so that the
 * [`ResultFolding`]{@link ResultFolding} and [`ResultAttachments`]{@link ResultAttachments} components can then nicely
 * render them within result templates (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * A typical use case of the `Folding` component is to fold email conversations and message board threads results in a
 * result set in order to display them in a convenient format. Messages belonging to a single conversation typically
 * have a unique conversation ID. By indexing this ID on a field, you can use it to fold search results (see
 * [Folding Results](https://developers.coveo.com/x/7hUvAg)).
 *
 * **Note:**
 * > There can only be one `Folding` component per [`Tab`]{@link Tab} component.
 */
var Folding = (function (_super) {
    __extends(Folding, _super);
    /**
     * Creates a new `Folding` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `Folding` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Folding(element, options, bindings) {
        var _this = _super.call(this, element, Folding.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Folding, options);
        Assert_1.Assert.check(Utils_1.Utils.isCoveoField(_this.options.field), _this.options.field + ' is not a valid field');
        Assert_1.Assert.exists(_this.options.maximumExpandedResults);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, _this.handleBuildingQuery);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.preprocessResults, _this.handlepreprocessResults);
        return _this;
    }
    // From a list of results, return a list of results and their attachments
    // We use parentResult to build a tree of result
    Folding.foldWithParent = function (queryResults) {
        var rootNode = {
            score: Number.NEGATIVE_INFINITY,
            children: [],
            result: {
                raw: false
            }
        };
        _.each(queryResults, function (queryResult, i) {
            var resultNode = Folding.findUniqueId(rootNode.children, queryResult.uniqueId);
            // If he have no parent or is parent is him self, add it to the root
            if (queryResult.parentResult == null || queryResult.parentResult.uniqueId == queryResult.uniqueId) {
                // Add it only if he do not exist
                if (resultNode == null) {
                    resultNode = {
                        result: queryResult,
                        score: i,
                        children: []
                    };
                    rootNode.children.push(resultNode);
                    resultNode.parent = rootNode;
                }
            }
            else {
                // If the resultNode already exist
                if (resultNode != null) {
                    resultNode.score = Math.min(i, resultNode.score);
                    // Remove himself from his parent because it will be added in his parent. This allowed to remove duplicate.
                    resultNode.parent.children = _.without(resultNode.parent.children, resultNode);
                }
                else {
                    resultNode = {
                        result: queryResult,
                        score: i,
                        children: []
                    };
                }
                var parentResult = Folding.findUniqueId(rootNode.children, queryResult.parentResult.uniqueId);
                // If the parent does not already exist, create it and add it the root
                if (parentResult == null) {
                    parentResult = {
                        result: queryResult.parentResult,
                        score: Number.POSITIVE_INFINITY,
                        children: []
                    };
                    rootNode.children.push(parentResult);
                    parentResult.parent = rootNode;
                }
                // Add the resultNode to parent
                parentResult.children.push(resultNode);
                resultNode.parent = parentResult;
                var parent_1 = parentResult;
                while (parent_1 != null && resultNode.score < parent_1.score) {
                    parent_1.score = resultNode.score;
                    parent_1 = parent_1.parent;
                }
            }
        });
        var rootResult = Folding.resultNodeToQueryResult(rootNode);
        // Remove the root from all results
        _.each(rootResult.attachments, function (attachment) { return attachment.parentResult = null; });
        return rootResult.attachments;
    };
    // 99.9% of the folding case will be alright with those default functions.
    // Otherwise use the options getResult and getMoreResults
    Folding.defaultGetResult = function (result) {
        var results = result.childResults || [];
        // Add the top result at the top of the list
        results.unshift(result);
        // Empty childResults just to make it more clean
        result.childResults = [];
        // Fold those results
        results = Folding.foldWithParent(results);
        // The first result is the top one
        var topResult = results.shift();
        // All other the results are childResults
        topResult.childResults = results;
        return topResult;
    };
    Folding.defaultGetMoreResults = function (results) {
        // The result are flat, just do the fold
        return Folding.foldWithParent(results);
    };
    // Convert ResultNode to QueryResult
    Folding.resultNodeToQueryResult = function (resultNode) {
        var result = resultNode.result;
        result.attachments = _.map(_.sortBy(resultNode.children, 'score'), Folding.resultNodeToQueryResult);
        result.parentResult = resultNode.parent != null ? resultNode.parent.result : null;
        return result;
    };
    Folding.findUniqueId = function (resultNodes, uniqueId) {
        for (var i = 0; i < resultNodes.length; i++) {
            if (resultNodes[i].result.uniqueId == uniqueId) {
                return resultNodes[i];
            }
            var resultNode = Folding.findUniqueId(resultNodes[i].children, uniqueId);
            if (resultNode != null) {
                return resultNode;
            }
        }
        return null;
    };
    Folding.prototype.handleBuildingQuery = function (data) {
        Assert_1.Assert.exists(data);
        if (!this.disabled) {
            data.queryBuilder.childField = this.options.childField;
            data.queryBuilder.parentField = this.options.parentField;
            data.queryBuilder.filterField = this.options.field;
            data.queryBuilder.filterFieldRange = this.options.range;
            data.queryBuilder.requiredFields.push(this.options.field);
            if (this.options.childField != null) {
                data.queryBuilder.requiredFields.push(this.options.childField);
            }
            if (this.options.parentField != null) {
                data.queryBuilder.requiredFields.push(this.options.parentField);
            }
        }
    };
    Folding.prototype.handlepreprocessResults = function (data) {
        Assert_1.Assert.exists(data);
        Assert_1.Assert.check(!data.results._folded, 'Two or more Folding components are active at the same time for the same Tab. Cannot process the results.');
        data.results._folded = true;
        var queryResults = data.results;
        var getResult = this.options.getResult || Folding.defaultGetResult;
        queryResults.results = _.map(queryResults.results, getResult);
        this.addLoadMoreHandler(queryResults.results, data.query);
    };
    Folding.prototype.addLoadMoreHandler = function (results, originalQuery) {
        var _this = this;
        return _.map(results, function (result) {
            if (_this.options.enableExpand && !Utils_1.Utils.isNullOrUndefined(Utils_1.Utils.getFieldValue(result, _this.options.field))) {
                result.moreResults = function () {
                    return _this.moreResults(result, originalQuery);
                };
            }
            return result;
        });
    };
    Folding.prototype.moreResults = function (result, originalQuery) {
        var _this = this;
        var query = _.clone(originalQuery);
        var builder = new QueryBuilder_1.QueryBuilder();
        query.numberOfResults = this.options.maximumExpandedResults;
        var fieldValue = Utils_1.Utils.getFieldValue(result, this.options.field);
        if (Utils_1.Utils.isNonEmptyString(fieldValue)) {
            builder.advancedExpression.addFieldExpression(this.options.field, '=', [fieldValue]);
            query.aq = builder.build().aq;
        }
        if (Utils_1.Utils.isNonEmptyString(originalQuery.q)) {
            // We add keywords to get the highlight and we add @uri to get all results
            // To ensure it plays nicely with query syntax, we ensure that the needed part of the query
            // are correctly surrounded with the no syntax block
            if (originalQuery.enableQuerySyntax) {
                query.q = "( " + originalQuery.q + " ) OR @uri";
            }
            else {
                query.enableQuerySyntax = true;
                query.q = "( <@- " + originalQuery.q + " -@> ) OR @uri";
            }
        }
        if (Utils_1.Utils.isNonEmptyString(this.options.expandExpression)) {
            query.cq = this.options.expandExpression;
        }
        if (this.options.parentField != null) {
            query.parentField = this.options.parentField;
        }
        if (this.options.childField != null) {
            query.childField = this.options.childField;
        }
        query.filterField = null;
        query.filterFieldRange = null;
        query.firstResult = 0;
        if (this.options.rearrange) {
            this.options.rearrange.putInQueryBuilder(builder);
            query.sortCriteria = builder.sortCriteria;
            query.sortField = builder.sortField;
        }
        else {
            query.sortCriteria = originalQuery.sortCriteria;
            query.sortField = originalQuery.sortField;
        }
        return this.queryController.getEndpoint().search(query)
            .then(function (results) {
            _this.handlePreprocessMoreResults(results);
            return results.results;
        });
    };
    Folding.prototype.handlePreprocessMoreResults = function (queryResults) {
        var getResults = this.options.getMoreResults || Folding.defaultGetMoreResults;
        queryResults.results = getResults(queryResults.results);
        Dom_1.$$(this.element).trigger(QueryEvents_1.QueryEvents.preprocessMoreResults, {
            results: queryResults
        });
    };
    return Folding;
}(Component_1.Component));
Folding.ID = 'Folding';
Folding.doExport = function () {
    GlobalExports_1.exportGlobally({
        'Folding': Folding
    });
};
/**
 * The options for the component
 * @componentOptions
 */
Folding.options = {
    /**
     * Specifies the name of the field on which to do the folding.
     *
     * Specifying a value for this option is required for this component to work.
     */
    field: ComponentOptions_1.ComponentOptions.buildFieldOption({ required: true }),
    /**
     * Specifies the field that determines whether a certain result is a child of another top result.
     *
     * Default value is `@topparentid`.
     */
    childField: ComponentOptions_1.ComponentOptions.buildFieldOption({ defaultValue: '@topparentid' }),
    /**
     * Specifies the field that determines whether a certain result is a top result containing other child results.
     *
     * Default value is `@containsattachment`.
     */
    parentField: ComponentOptions_1.ComponentOptions.buildFieldOption({ defaultValue: '@containsattachment' }),
    /**
     * Specifies the maximum number of child results to fold.
     *
     * **Example:**
     * > For an email thread with a total of 20 messages, using the default value of `2` means that the component loads
     * > up to a maximum of 2 child messages under the original message, unless the end user expands the entire
     * > conversation using the **Show More** link (see the [`enableExpand`]{@link Folding.options.enableExpand}
     * > option).
     *
     * Default value is `2`. Minimum value is `0`.
     */
    range: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 2, min: 0 }),
    /**
     * Specifies the sort criteria to apply to the top result and its child results (e.g., `date ascending`,
     * `@myfield descending`, etc. [See
     * Query Parameters - sortCriteria](https://developers.coveo.com/x/iwEv#QueryParameters-sortCriteriasortCriteria)).
     *
     * **Example**
     * > If you are folding email results by conversation and you specify `date descending` as the `rearrange` value of
     * > the `Folding` component, the component re-arranges email conversations so that the newest email is always the
     * > top result. Specifying `date ascending` instead always makes the original email the top result, as it is also
     * > necessarily the oldest.
     *
     * By default, the component displays the results in the order that the index returns them.
     */
    rearrange: ComponentOptions_1.ComponentOptions.buildCustomOption(function (value) { return Utils_1.Utils.isNonEmptyString(value) ? SortCriteria_1.SortCriteria.parse(value) : null; }),
    /**
     * Specifies whether to add a callback function on the top result, allowing to make an additional query to load all
     * of its child results (e.g., to load all conversations of a given thread).
     *
     * Concretely, the [`ResultFolding`]{@link ResultFolding} component uses this for its **Show More** link.
     *
     * See also the [`expandExpression`]{@link Folding.options.expandExpression} and
     * [`maximumExpandedResults`]{@link Folding.options.maximumExpandedResults} options.
     *
     * Default value is `true`.
     */
    enableExpand: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * If the [`enableExpand`]{@link Folding.options.enableExpand} option is `true`, specifies a custom constant
     * expression to send when querying the expanded results.
     *
     * Default value is `undefined`.
     */
    expandExpression: ComponentOptions_1.ComponentOptions.buildStringOption({ depend: 'enableExpand' }),
    /**
     * If the [`enableExpand`]{@link Folding.options.enableExpand} option is `true`, specifies the maximum number of
     * results to load when expanding.
     *
     * Default value is `100`. Minimum value is `1`.
     */
    maximumExpandedResults: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 100, min: 1, depend: 'enableExpand' }),
    /**
     * Specifies the function that manages the individual folding of each result.
     *
     * Default value is:
     *
     * ```javascript
     * var results = result.childResults || [];
     * // Add the top result at the top of the list.
     * results.unshift(result);
     * // Empty childResults just to clean it.
     * result.childResults = [];
     * // Fold those results.
     * results = Coveo.Folding.foldWithParent(results);
     * // The first result is the top one.
     * var topResult = results.shift();
     * // All other results are childResults.
     * topResult.childResults = results;
     * return topResult;
     * ```
     *
     * You can pre-process all the result with this option in the [`init`]{@link init} call of your search interface:
     *
     * ```javascript
     * Coveo.init(document.querySelector('#search'), {
     *    Folding: {
     *      getResult: function(result) {
     *        result = Coveo.Folding.defaultGetResult(result);
     *        // Your code here
     *      }
     *    }
     * })
     * ```
     */
    getResult: ComponentOptions_1.ComponentOptions.buildCustomOption(function () {
        return null;
    }),
    /**
     * Specifies the function that manages the folding of all results.
     *
     * Default value is:
     *
     * ```javascript
     * Coveo.Folding.defaultGetMoreResults = function(results) {
     *    // The results are flat, just do the folding.
     *    return Coveo.Folding.foldWithParent(results);
     * }
     * ```
     */
    getMoreResults: ComponentOptions_1.ComponentOptions.buildCustomOption(function () {
        return null;
    })
};
exports.Folding = Folding;
Initialization_1.Initialization.registerAutoCreateComponent(Folding);


/***/ }),

/***/ 302:
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
var Folding_1 = __webpack_require__(247);
var Initialization_1 = __webpack_require__(2);
var GlobalExports_1 = __webpack_require__(4);
/**
 * The `FoldingForThread` component inherits from the [`Folding`]{@link Folding} component. It offers the
 * same configuration options.
 *
 * Folding conversations and threads requires different processing. When you need to fold all child items (including
 * their attachments) on the same level under a common ancestor item, use this component rather than the `Folding`
 * component.
 *
 * This component works well with Chatter and Lithium.
 *
 * **Note:**
 * > There can only be one `FoldingForThread` component per [`Tab`]{@link Tab} component.
 *
 * See [Folding Results](https://developers.coveo.com/x/7hUvAg).
 */
var FoldingForThread = (function (_super) {
    __extends(FoldingForThread, _super);
    /**
     * Creates a new `FoldingForThread` component
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `FoldingForThread` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function FoldingForThread(element, options, bindings) {
        var _this = _super.call(this, element, options, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.options.getMoreResults = function (results) {
            return Folding_1.Folding.foldWithParent(results)[0].attachments;
        };
        _this.options.getResult = function (result) {
            var defaultResult = Folding_1.Folding.defaultGetResult(result);
            defaultResult.childResults = defaultResult.attachments;
            defaultResult.attachments = [];
            return defaultResult;
        };
        return _this;
    }
    return FoldingForThread;
}(Folding_1.Folding));
FoldingForThread.ID = 'FoldingForThread';
FoldingForThread.doExport = function () {
    GlobalExports_1.exportGlobally({
        'FoldingForThread': FoldingForThread
    });
};
exports.FoldingForThread = FoldingForThread;
Initialization_1.Initialization.registerAutoCreateComponent(FoldingForThread);


/***/ }),

/***/ 440:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __webpack_require__(7);
var Utils_1 = __webpack_require__(5);
var _ = __webpack_require__(1);
var SortCriteria = (function () {
    /**
     * Create a new SortCriteria
     * @param sort The sort criteria (e.g.: relevancy, date)
     * @param direction The direction by which to sort (e.g.: ascending, descending)
     */
    function SortCriteria(sort, direction) {
        if (direction === void 0) { direction = ''; }
        this.sort = sort;
        this.direction = direction;
        Assert_1.Assert.isNonEmptyString(sort);
        Assert_1.Assert.check(_.contains(SortCriteria.validSorts, sort) || SortCriteria.sortIsField(sort));
        if (SortCriteria.sortNeedsDirection(sort)) {
            Assert_1.Assert.check(_.contains(SortCriteria.validDirections, direction));
        }
        else {
            Assert_1.Assert.check(direction == '');
        }
    }
    /**
     * Return a new SortCriteria from a string
     * @param criteria The string from which to create the SortCriteria
     */
    SortCriteria.parse = function (criteria) {
        Assert_1.Assert.isNonEmptyString(criteria);
        var split = criteria.match(/\S+/g);
        return new SortCriteria(split[0], split[1]);
    };
    /**
     * Put the sort criteria in the passed queryBuilder
     * @param queryBuilder The queryBuilder in which to put the sort criteria.
     */
    SortCriteria.prototype.putInQueryBuilder = function (queryBuilder) {
        Assert_1.Assert.exists(queryBuilder);
        if (SortCriteria.sortIsField(this.sort)) {
            queryBuilder.sortCriteria = 'field' + this.direction;
            queryBuilder.sortField = this.sort;
        }
        else if (this.direction != '') {
            queryBuilder.sortCriteria = this.sort + this.direction;
        }
        else {
            queryBuilder.sortCriteria = this.sort;
        }
    };
    /**
     * Gets the value of the sort criteria from a single {@link IQueryResult}.<br/>
     * For example, if the sort criteria is 'relevancy', it will return the value of the 'relevancy' field from result.
     * @param result The {@link IQueryResult} from which to get the value.
     */
    SortCriteria.prototype.getValueFromResult = function (result) {
        Assert_1.Assert.exists(result);
        if (SortCriteria.sortIsField(this.sort)) {
            return Utils_1.Utils.getFieldValue(result, this.sort);
        }
        else if (this.sort == 'date') {
            return result.raw['date'];
        }
        else {
            Assert_1.Assert.fail('Cannot retrieve value: ' + this.sort);
        }
    };
    /**
     * Returns a string representation of the sort criteria (e.g.: 'date ascending').
     */
    SortCriteria.prototype.toString = function () {
        if (Utils_1.Utils.isNonEmptyString(this.direction)) {
            return this.sort + ' ' + this.direction;
        }
        else {
            return this.sort;
        }
    };
    /**
     * Checks if the SortCriteria is equal to another.
     * @param criteria The SortCriteria to compare with
     */
    SortCriteria.prototype.equals = function (criteria) {
        Assert_1.Assert.exists(criteria);
        return criteria.sort == this.sort && criteria.direction == this.direction;
    };
    SortCriteria.sortIsField = function (criteria) {
        return criteria.charAt(0) == '@';
    };
    SortCriteria.sortNeedsDirection = function (sort) {
        return _.contains(SortCriteria.sortsNeedingDirection, sort) || SortCriteria.sortIsField(sort);
    };
    return SortCriteria;
}());
SortCriteria.validSorts = ['relevancy', 'date', 'qre'];
SortCriteria.sortsNeedingDirection = ['date'];
SortCriteria.validDirections = ['ascending', 'descending'];
exports.SortCriteria = SortCriteria;


/***/ })

});
//# sourceMappingURL=FoldingForThread.js.map