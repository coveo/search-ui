webpackJsonpCoveo__temporary([47],{

/***/ 187:
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
var underscore_1 = __webpack_require__(0);
var QueryEvents_1 = __webpack_require__(11);
var GlobalExports_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(1);
var Utils_1 = __webpack_require__(4);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var QueryBuilder_1 = __webpack_require__(46);
var SortCriteria_1 = __webpack_require__(498);
/**
 * The `Folding` component makes it possible to render hierarchic representations of search results sharing a common
 * [`field`]{@link Folding.options.field}.
 *
 * This component has no visual impact on its own. It simply folds certain search results so that the
 * [`ResultFolding`]{@link ResultFolding} and [`ResultAttachments`]{@link ResultAttachments} components can then nicely
 * render them within result templates (see [Result Templates](https://docs.coveo.com/en/413/)).
 *
 * A typical use case of the `Folding` component is to fold email conversations and message board threads results in a
 * result set in order to display them in a convenient format. Messages belonging to a single conversation typically
 * have a unique conversation ID. By indexing this ID on a field, you can use it to fold search results (see
 * [Folding Results](https://docs.coveo.com/en/428/)).
 *
 * **Note:**
 * > There can only be one `Folding` component per [`Tab`]{@link Tab} component.
 *
 */
var Folding = /** @class */ (function (_super) {
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
        _this.swapParentChildFoldingFields();
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
        underscore_1.each(queryResults, function (queryResult, i) {
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
                    resultNode.parent.children = underscore_1.without(resultNode.parent.children, resultNode);
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
        underscore_1.each(rootResult.attachments, function (attachment) { return (attachment.parentResult = null); });
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
        result.attachments = underscore_1.map(underscore_1.sortBy(resultNode.children, 'score'), Folding.resultNodeToQueryResult);
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
    Folding.prototype.swapParentChildFoldingFields = function () {
        // Swap "old" childField and parentField and assign them to the "new" parent option
        // This needs to be done because connectors push the default data in *reverse* order compared to what the index expect.
        if (this.options.childField != null) {
            this.logger.warn('Detecting usage of deprecated option "childField". Assigning it automatically to the "parent" option instead.');
            this.logger.warn('The option definition was changed to support universal folding across all sources.');
            this.logger.warn('To remove this warning, rename the "childField" option (data-child-field) to "parent" (data-parent).');
            this.options.parent = this.options.childField;
        }
        if (this.options.parentField != null) {
            this.logger.warn('Detecting usage of deprecated option "parentField". Assigning it automatically to the "child" option instead.');
            this.logger.warn('The option definition was changed to support universal folding across all sources.');
            this.logger.warn('To remove this warning, rename the "parentField" option (data-parent-field) to "child" (data-child).');
            this.options.child = this.options.parentField;
        }
    };
    Folding.prototype.handleBuildingQuery = function (data) {
        Assert_1.Assert.exists(data);
        if (!this.disabled) {
            data.queryBuilder.childField = this.options.parent;
            data.queryBuilder.parentField = this.options.child;
            data.queryBuilder.filterField = this.options.field;
            data.queryBuilder.filterFieldRange = this.options.range;
            data.queryBuilder.requiredFields.push(this.options.field);
            if (this.options.parent != null) {
                data.queryBuilder.requiredFields.push(this.options.parent);
            }
            if (this.options.child != null) {
                data.queryBuilder.requiredFields.push(this.options.child);
            }
        }
    };
    Folding.prototype.handlepreprocessResults = function (data) {
        var _this = this;
        Assert_1.Assert.exists(data);
        Assert_1.Assert.check(!data.results._folded, 'Two or more Folding components are active at the same time for the same Tab. Cannot process the results.');
        data.results._folded = true;
        var queryResults = data.results;
        var getResult = this.options.getResult || Folding.defaultGetResult;
        queryResults.results = underscore_1.map(queryResults.results, getResult);
        if (this.options.rearrange) {
            queryResults.results.forEach(function (result) {
                result.childResults = underscore_1.sortBy(result.childResults, function (result) { return Utils_1.Utils.getFieldValue(result, _this.options.rearrange.sort); });
                if (_this.shouldBeReversed(result.childResults)) {
                    result.childResults = result.childResults.reverse();
                }
            });
        }
        this.addLoadMoreHandler(queryResults.results, data.query);
    };
    Folding.prototype.shouldBeReversed = function (childResults) {
        var _this = this;
        if (this.options.rearrange.direction == 'ascending') {
            return false;
        }
        var childMissingSortByValue = underscore_1.any(childResults, function (childResult) {
            return Utils_1.Utils.isNullOrUndefined(Utils_1.Utils.getFieldValue(childResult, _this.options.rearrange.sort));
        });
        if (childMissingSortByValue) {
            return false;
        }
        return true;
    };
    Folding.prototype.addLoadMoreHandler = function (results, originalQuery) {
        var _this = this;
        return underscore_1.map(results, function (result) {
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
        var query = underscore_1.clone(originalQuery);
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
        if (this.options.child != null) {
            query.parentField = this.options.child;
        }
        if (this.options.parent != null) {
            query.childField = this.options.parent;
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
        return this.queryController
            .getEndpoint()
            .search(query)
            .then(function (results) {
            _this.handlePreprocessMoreResults(results);
            return results.results;
        })
            .catch(function (e) {
            _this.logger.error("Invalid query performed while trying to retrieve more results for folding.", e);
            return [];
        });
    };
    Folding.prototype.handlePreprocessMoreResults = function (queryResults) {
        var getResults = this.options.getMoreResults || Folding.defaultGetMoreResults;
        queryResults.results = getResults(queryResults.results);
        Dom_1.$$(this.element).trigger(QueryEvents_1.QueryEvents.preprocessMoreResults, {
            results: queryResults
        });
    };
    Folding.ID = 'Folding';
    Folding.doExport = function () {
        GlobalExports_1.exportGlobally({
            Folding: Folding
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
         *
         * **Note:**
         * > In an Elasticsearch index, the corresponding field must be configured as a *Facet* field
         * > (see [Add or Edit Fields](https://docs.coveo.com/en/1982/)).
         * > This limitation does not apply to Coveo indexes.
         *
         * Default value is `@foldingcollection`.
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({ defaultValue: '@foldingcollection' }),
        /**
         * Specifies the field that determines whether a certain result is a child of another top result.
         *
         * **Note:**
         * > In the index, the values of the corresponding field must:
         * > - Contain alphanumerical characters only.
         * > - Contain no more than 60 characters.
         *
         * Default value is `@foldingchild`.
         */
        child: ComponentOptions_1.ComponentOptions.buildFieldOption({ defaultValue: '@foldingchild' }),
        /**
         * Specifies the field that determines whether a certain result is a top result containing other child results.
         *
         * **Note:**
         * > In the index, the values of the corresponding field must:
         * > - Contain alphanumerical characters only.
         * > - Contain no more than 60 characters.
         *
         * Default value is `@foldingparent`.
         */
        parent: ComponentOptions_1.ComponentOptions.buildFieldOption({ defaultValue: '@foldingparent' }),
        /**
         * This option is deprecated. Instead, use the {@link Folding.options.parent} option.
         * @deprecated
         */
        childField: ComponentOptions_1.ComponentOptions.buildFieldOption({
            deprecated: 'This option is deprecated. Instead, use the data-parent option.'
        }),
        /**
         * This option is deprecated. Instead, use the {@link Folding.options.child} option.
         * @deprecated
         */
        parentField: ComponentOptions_1.ComponentOptions.buildFieldOption({
            deprecated: 'This option is deprecated. Instead, use the data-child option.'
        }),
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
         * `@myfield descending`, etc.). See [sortCriteria](https://docs.coveo.com/en/1461/#RestQueryParameters-sortCriteria).
         *
         * This option works from the results returned by the index. This means that if only the three most relevant folded results are returned by the index
         * and you choose to rearrange the folded results by date, then the three most relevant results will be rearranged by date,
         * meaning that the first folded result is not necessarily the oldest or newest item.
         *
         * However, since clicking on the `Show More` button triggers a new query, you would receive new results based on the sort criteria of this option.
         *
         * **Example**
         * > If you are folding email results by conversation and you specify `date descending` as the `rearrange` value of
         * > the `Folding` component, the component re-arranges email conversations so that the newest email is always the
         * > top result. Specifying `date ascending` instead always makes the original email the top result, as it is also
         * > necessarily the oldest.
         *
         * By default, the component displays the results in the order that the index returns them.
         */
        rearrange: ComponentOptions_1.ComponentOptions.buildCustomOption(function (value) { return (Utils_1.Utils.isNonEmptyString(value) ? SortCriteria_1.SortCriteria.parse(value) : null); }),
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
        expandExpression: ComponentOptions_1.ComponentOptions.buildQueryExpressionOption({ depend: 'enableExpand' }),
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
    return Folding;
}(Component_1.Component));
exports.Folding = Folding;
Initialization_1.Initialization.registerAutoCreateComponent(Folding);


/***/ }),

/***/ 498:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var underscore_1 = __webpack_require__(0);
var Assert_1 = __webpack_require__(5);
var VALID_SORT;
(function (VALID_SORT) {
    VALID_SORT["RELEVANCY"] = "relevancy";
    VALID_SORT["DATE"] = "date";
    VALID_SORT["QRE"] = "qre";
})(VALID_SORT = exports.VALID_SORT || (exports.VALID_SORT = {}));
var VALID_DIRECTION;
(function (VALID_DIRECTION) {
    VALID_DIRECTION["ASCENDING"] = "ascending";
    VALID_DIRECTION["DESCENDING"] = "descending";
})(VALID_DIRECTION = exports.VALID_DIRECTION || (exports.VALID_DIRECTION = {}));
var SortCriterion = /** @class */ (function () {
    /**
     * Create a new SortCriteria
     * @param sort The sort criteria (e.g.: relevancy, date)
     * @param direction The direction by which to sort (e.g.: ascending, descending)
     */
    function SortCriterion(sort, direction) {
        if (direction === void 0) { direction = ''; }
        this.sort = sort;
        this.direction = direction;
        if (!SortCriterion.sortIsField(sort)) {
            Assert_1.Assert.check(this.isValidSort(sort), sort + " is not a valid sort criteria. Valid values are " + underscore_1.values(VALID_SORT) + " or a valid index sortable index field.");
        }
        if (SortCriterion.sortNeedsDirection(sort)) {
            Assert_1.Assert.check(this.isValidDirection(direction), direction + " is not a valid sort criteria direction. Valid values are " + underscore_1.values(VALID_DIRECTION));
        }
        else {
            Assert_1.Assert.check(direction == '');
        }
    }
    SortCriterion.prototype.isValidDirection = function (direction) {
        return underscore_1.chain(VALID_DIRECTION)
            .values()
            .contains(direction)
            .value();
    };
    SortCriterion.prototype.isValidSort = function (sort) {
        return underscore_1.chain(VALID_SORT)
            .values()
            .contains(sort)
            .value();
    };
    SortCriterion.sortIsField = function (criteria) {
        return criteria.charAt(0) == '@';
    };
    SortCriterion.sortNeedsDirection = function (sort) {
        return underscore_1.contains(SortCriterion.sortsNeedingDirection, sort) || SortCriterion.sortIsField(sort);
    };
    SortCriterion.sortsNeedingDirection = [VALID_SORT.DATE];
    return SortCriterion;
}());
exports.SortCriterion = SortCriterion;
var SortCriteria = /** @class */ (function () {
    function SortCriteria(rawCriteriaString) {
        var _this = this;
        this.criteria = [];
        var criteria = rawCriteriaString.split(';');
        criteria.forEach(function (criterion) {
            var split = criterion.match(/\S+/g);
            _this.criteria.push(new SortCriterion(split[0], split[1]));
        });
    }
    Object.defineProperty(SortCriteria.prototype, "direction", {
        get: function () {
            return underscore_1.first(this.criteria).direction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortCriteria.prototype, "sort", {
        get: function () {
            return underscore_1.first(this.criteria).sort;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return a new SortCriteria from a string
     * @param criteria The string from which to create the SortCriteria
     */
    SortCriteria.parse = function (criteria) {
        return new SortCriteria(criteria);
    };
    /**
     * Put the sort criteria in the passed queryBuilder
     * @param queryBuilder The queryBuilder in which to put the sort criteria.
     */
    SortCriteria.prototype.putInQueryBuilder = function (queryBuilder) {
        Assert_1.Assert.exists(queryBuilder);
        queryBuilder.sortCriteria = this.toString()
            .split(';')
            .join(',');
    };
    /**
     * Returns a string representation of the sort criteria (e.g.: 'date ascending').
     */
    SortCriteria.prototype.toString = function () {
        return this.criteria
            .map(function (criterion) {
            return criterion.direction ? criterion.sort + " " + criterion.direction : "" + criterion.sort;
        })
            .join(';');
    };
    /**
     * Checks if the SortCriteria is equal to another.
     * @param criteria The SortCriteria to compare with
     */
    SortCriteria.prototype.equals = function (criteria) {
        return criteria.toString() == this.toString();
    };
    return SortCriteria;
}());
exports.SortCriteria = SortCriteria;


/***/ })

});
//# sourceMappingURL=Folding__ec82d15c0e890cb8a4e5.js.map