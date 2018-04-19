webpackJsonpCoveo__temporary([10],{

/***/ 150:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Component_1 = __webpack_require__(6);
var _ = __webpack_require__(0);
var ResultListRenderer = /** @class */ (function () {
    function ResultListRenderer(resultListOptions, autoCreateComponentsFn) {
        this.resultListOptions = resultListOptions;
        this.autoCreateComponentsFn = autoCreateComponentsFn;
    }
    ResultListRenderer.prototype.renderResults = function (resultElements, append, resultDisplayedCallback) {
        var _this = this;
        if (append === void 0) { append = false; }
        return Promise.all([this.getStartFragment(resultElements, append), this.getEndFragment(resultElements, append)]).then(function (_a) {
            var startFrag = _a[0], endFrag = _a[1];
            var resultsFragment = document.createDocumentFragment();
            if (startFrag) {
                resultsFragment.appendChild(startFrag);
            }
            _.each(resultElements, function (resultElement) {
                resultsFragment.appendChild(resultElement);
                resultDisplayedCallback(Component_1.Component.getResult(resultElement), resultElement);
            });
            if (endFrag) {
                resultsFragment.appendChild(endFrag);
            }
            _this.resultListOptions.resultContainer.appendChild(resultsFragment);
        });
    };
    ResultListRenderer.prototype.getStartFragment = function (resultElements, append) {
        return Promise.resolve(document.createDocumentFragment());
    };
    ResultListRenderer.prototype.getEndFragment = function (resultElements, append) {
        return Promise.resolve(document.createDocumentFragment());
    };
    return ResultListRenderer;
}());
exports.ResultListRenderer = ResultListRenderer;


/***/ }),

/***/ 321:
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
var Template_1 = __webpack_require__(22);
var TemplateList_1 = __webpack_require__(95);
var _ = __webpack_require__(0);
var TableTemplate = /** @class */ (function (_super) {
    __extends(TableTemplate, _super);
    function TableTemplate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultTemplate = "<td><a class=\"CoveoResultLink\"></a></td>\n                             <td><span class=\"CoveoExcerpt\"></span></td>\n                             <td><span class=\"CoveoFieldValue\" data-field=\"@date\" data-helper=\"date\"></span></td>";
        _this.defaultRoledTemplates = {
            'table-header': "<th style=\"width: 40%\">Link</th>\n                     <th>Excerpt</th>\n                     <th style=\"width: 20%\"\n                         class=\"CoveoSort coveo-table-header-sort\"\n                         data-sort-criteria=\"date ascending,date descending\"\n                         data-display-unselected-icon=\"false\">Date</th>",
            'table-footer': "<th>Link</th>\n                     <th>Excerpt</th>\n                     <th>Date</th>"
        };
        return _this;
    }
    TableTemplate.prototype.instantiateRoleToString = function (role) {
        var roledTemplate = _.find(this.templates, function (t) { return t.role === role; });
        if (roledTemplate) {
            return roledTemplate.instantiateToString(undefined, {});
        }
        else {
            return this.defaultRoledTemplates[role];
        }
    };
    TableTemplate.prototype.instantiateRoleToElement = function (role) {
        var _this = this;
        var roledTemplate = _.find(this.templates, function (t) { return t.role === role; });
        if (roledTemplate) {
            return roledTemplate.instantiateToElement(undefined, {});
        }
        else {
            var tmpl = new Template_1.Template(function () { return _this.defaultRoledTemplates[role]; });
            tmpl.layout = 'table';
            return tmpl.instantiateToElement(undefined);
        }
    };
    TableTemplate.prototype.getFallbackTemplate = function () {
        var _this = this;
        return new Template_1.Template(function () { return _this.defaultTemplate; });
    };
    TableTemplate.prototype.hasTemplateWithRole = function (role) {
        return _.find(this.templates, function (t) { return t.role === role; });
    };
    return TableTemplate;
}(TemplateList_1.TemplateList));
exports.TableTemplate = TableTemplate;


/***/ }),

/***/ 322:
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
var Template_1 = __webpack_require__(22);
var DefaultRecommendationTemplate = /** @class */ (function (_super) {
    __extends(DefaultRecommendationTemplate, _super);
    function DefaultRecommendationTemplate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultRecommendationTemplate.prototype.instantiateToString = function (object) {
        var template = "<div class=\"coveo-result-frame\">\n        <div class=\"coveo-result-row\">\n          <div class=\"coveo-result-cell\" style=\"width:40px;text-align:center;vertical-align:middle;\">\n            <span class=\"CoveoIcon\" data-small=\"true\" data-with-label=\"false\">\n            </span>\n          </div>\n          <div class=\"coveo-result-cell\" style=\"padding:0 0 3px 5px;vertical-align:middle\">\n            <div class=\"coveo-result-row\">\n              <div class=\"coveo-result-cell\" style=\"font-size:10pt;\">\n                <a class=\"CoveoResultLink\" style=\"display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis\">\n                </a>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>";
        return template;
    };
    DefaultRecommendationTemplate.prototype.instantiateToElement = function (object) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var div = document.createElement('div');
            div.innerHTML = _this.instantiateToString(object);
            resolve(div);
        });
    };
    return DefaultRecommendationTemplate;
}(Template_1.Template));
exports.DefaultRecommendationTemplate = DefaultRecommendationTemplate;


/***/ }),

/***/ 326:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TemplateHelpers_1 = __webpack_require__(77);
var HighlightUtils_1 = __webpack_require__(49);
var DateUtils_1 = __webpack_require__(29);
var CurrencyUtils_1 = __webpack_require__(101);
var HtmlUtils_1 = __webpack_require__(134);
var Utils_1 = __webpack_require__(4);
var StringUtils_1 = __webpack_require__(18);
var TimeSpanUtils_1 = __webpack_require__(55);
var EmailUtils_1 = __webpack_require__(133);
var QueryUtils_1 = __webpack_require__(19);
var DeviceUtils_1 = __webpack_require__(21);
var Dom_1 = __webpack_require__(2);
var SearchEndpoint_1 = __webpack_require__(41);
var StreamHighlightUtils_1 = __webpack_require__(76);
var FacetUtils_1 = __webpack_require__(44);
var Globalize = __webpack_require__(25);
var _ = __webpack_require__(0);
var Component_1 = __webpack_require__(6);
var TemplateCache_1 = __webpack_require__(54);
var CoreHelpers = /** @class */ (function () {
    function CoreHelpers() {
    }
    /**
     * For backward compatibility reason, the "global" template helper should be available under the
     * coveo namespace.
     * @param scope
     */
    CoreHelpers.exportAllHelpersGlobally = function (scope) {
        _.each(TemplateHelpers_1.TemplateHelpers.getHelpers(), function (helper, name) {
            if (scope[name] == undefined) {
                scope[name] = helper;
            }
        });
    };
    return CoreHelpers;
}());
exports.CoreHelpers = CoreHelpers;
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('javascriptEncode', function (value) {
    return Utils_1.Utils.exists(value) ? StringUtils_1.StringUtils.javascriptEncode(value) : undefined;
});
var executeShorten = function (content, options) {
    var strAndHoles = HighlightUtils_1.StringAndHoles.shortenString(content, options.length, '...');
    if (Utils_1.Utils.exists(options.highlights)) {
        return HighlightUtils_1.HighlightUtils.highlightString(strAndHoles.value, options.highlights, strAndHoles.holes, options.cssClass || 'highlight');
    }
    else {
        return strAndHoles.value;
    }
};
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('shorten', function (content, length, highlights, cssClass) {
    return executeShorten(content, {
        length: length,
        highlights: highlights,
        cssClass: cssClass
    });
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('shortenv2', function (content, options) {
    return executeShorten(content, options);
});
var executeShortenPath = function (content, options) {
    var strAndHoles = HighlightUtils_1.StringAndHoles.shortenPath(content, options.length);
    if (Utils_1.Utils.exists(options.highlights)) {
        return HighlightUtils_1.HighlightUtils.highlightString(strAndHoles.value, options.highlights, strAndHoles.holes, options.cssClass || 'highlight');
    }
    else {
        return strAndHoles.value;
    }
};
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('shortenPath', function (content, length, highlights, cssClass) {
    return executeShortenPath(content, {
        length: length,
        highlights: highlights,
        cssClass: cssClass
    });
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('shortenPathv2', function (content, options) {
    return executeShortenPath(content, options);
});
var executeShortenUri = function (content, options) {
    var strAndHoles = HighlightUtils_1.StringAndHoles.shortenUri(content, options.length);
    if (Utils_1.Utils.exists(options.highlights)) {
        return HighlightUtils_1.HighlightUtils.highlightString(strAndHoles.value, options.highlights, strAndHoles.holes, options.cssClass || 'highlight');
    }
    else {
        return strAndHoles.value;
    }
};
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('shortenUri', function (content, length, highlights, cssClass) {
    return executeShortenUri(content, {
        length: length,
        highlights: highlights,
        cssClass: cssClass
    });
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('shortenUriv2', function (content, options) {
    return executeShortenUri(content, options);
});
var executeHighlight = function (content, options) {
    if (Utils_1.Utils.exists(content)) {
        if (Utils_1.Utils.exists(options.highlights)) {
            return HighlightUtils_1.HighlightUtils.highlightString(content, options.highlights, null, options.cssClass || 'highlight');
        }
        else {
            return content;
        }
    }
    else {
        return undefined;
    }
};
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlight', function (content, highlights, cssClass) {
    return executeHighlight(content, {
        highlights: highlights,
        cssClass: cssClass
    });
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlightv2', function (content, options) {
    return executeHighlight(content, options);
});
var executeHighlightStreamText = function (content, options) {
    if (Utils_1.Utils.exists(content) && Utils_1.Utils.exists(options.termsToHighlight) && Utils_1.Utils.exists(options.phrasesToHighlight)) {
        if (termsToHighlightAreDefined(options.termsToHighlight, options.phrasesToHighlight)) {
            return StreamHighlightUtils_1.StreamHighlightUtils.highlightStreamText(content, options.termsToHighlight, options.phrasesToHighlight, options.opts);
        }
        else {
            return content;
        }
    }
    else {
        return undefined;
    }
};
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlightStreamText', function (content, termsToHighlight, phrasesToHighlight, opts) {
    if (termsToHighlight === void 0) { termsToHighlight = resolveTermsToHighlight(); }
    if (phrasesToHighlight === void 0) { phrasesToHighlight = resolvePhrasesToHighlight(); }
    return executeHighlightStreamText(content, {
        termsToHighlight: termsToHighlight,
        phrasesToHighlight: phrasesToHighlight,
        opts: opts
    });
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlightStreamTextv2', function (content, options) {
    var mergedOptions = __assign({ termsToHighlight: resolveTermsToHighlight(), phrasesToHighlight: resolvePhrasesToHighlight() }, options);
    return executeHighlightStreamText(content, mergedOptions);
});
var executeHighlightStreamHTML = function (content, options) {
    if (Utils_1.Utils.exists(content) && Utils_1.Utils.exists(options.termsToHighlight) && Utils_1.Utils.exists(options.phrasesToHighlight)) {
        if (termsToHighlightAreDefined(options.termsToHighlight, options.phrasesToHighlight)) {
            return StreamHighlightUtils_1.StreamHighlightUtils.highlightStreamHTML(content, options.termsToHighlight, options.phrasesToHighlight, options.opts);
        }
        else {
            return content;
        }
    }
    else {
        return undefined;
    }
};
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlightStreamHTML', function (content, termsToHighlight, phrasesToHighlight, opts) {
    if (termsToHighlight === void 0) { termsToHighlight = resolveTermsToHighlight(); }
    if (phrasesToHighlight === void 0) { phrasesToHighlight = resolvePhrasesToHighlight(); }
    return executeHighlightStreamHTML(content, {
        termsToHighlight: termsToHighlight,
        phrasesToHighlight: phrasesToHighlight,
        opts: opts
    });
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('highlightStreamHTMLv2', function (content, options) {
    return executeHighlightStreamHTML(content, options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('number', function (value, options) {
    var numberValue = Number(value);
    if (Utils_1.Utils.exists(value)) {
        if (_.isString(options)) {
            return StringUtils_1.StringUtils.htmlEncode(Globalize.format(numberValue, options));
        }
        else {
            return StringUtils_1.StringUtils.htmlEncode(numberValue.toString());
        }
    }
    else {
        return undefined;
    }
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('date', function (value, options) {
    return DateUtils_1.DateUtils.dateToString(DateUtils_1.DateUtils.convertFromJsonDateIfNeeded(value), options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('time', function (value, options) {
    return DateUtils_1.DateUtils.timeToString(DateUtils_1.DateUtils.convertFromJsonDateIfNeeded(value), options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('dateTime', function (value, options) {
    return DateUtils_1.DateUtils.dateTimeToString(DateUtils_1.DateUtils.convertFromJsonDateIfNeeded(value), options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('emailDateTime', function (value, options) {
    var defaultOptions = {};
    defaultOptions.includeTimeIfThisWeek = true;
    var optionsToUse = _.extend(options, defaultOptions);
    return value ? DateUtils_1.DateUtils.dateTimeToString(DateUtils_1.DateUtils.convertFromJsonDateIfNeeded(value), optionsToUse) : undefined;
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('currency', function (value, options) {
    return CurrencyUtils_1.CurrencyUtils.currencyToString(value, options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('timeSpan', function (value, options) {
    if (options === void 0) { options = { isMilliseconds: false }; }
    return new TimeSpanUtils_1.TimeSpan(value, options.isMilliseconds).getHHMMSS();
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('email', function (value) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // support old arguments (value: any, companyDomain: string, me: string, lengthLimit = 2, truncateName = false)
    var companyDomain;
    var me;
    var lengthLimit;
    var truncateName;
    if (_.isObject(args[0])) {
        companyDomain = args[0]['companyDomain'];
        me = args[0]['me'];
        lengthLimit = args[0]['lengthLimit'];
        truncateName = args[0]['truncateName'];
    }
    else {
        companyDomain = args[0];
        me = args[1];
        lengthLimit = args[2];
        truncateName = args[3];
    }
    if (lengthLimit == undefined) {
        lengthLimit = 2;
    }
    if (truncateName == undefined) {
        truncateName = false;
    }
    if (_.isString(value)) {
        var listOfAddresses = EmailUtils_1.EmailUtils.splitSemicolonSeparatedListOfEmailAddresses(value);
        return EmailUtils_1.EmailUtils.emailAddressesToHyperlinks(listOfAddresses, companyDomain, me, lengthLimit, truncateName);
    }
    else if (_.isArray(value)) {
        return EmailUtils_1.EmailUtils.emailAddressesToHyperlinks(value, companyDomain, me, lengthLimit, truncateName);
    }
    else {
        return undefined;
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('excessEmailToggle', function (target) {
    Dom_1.$$(target).removeClass('coveo-active');
    if (Dom_1.$$(target).hasClass('coveo-emails-excess-collapsed')) {
        _.each(Dom_1.$$(target).siblings('.coveo-emails-excess-expanded'), function (sibling) {
            Dom_1.$$(sibling).addClass('coveo-active');
        });
    }
    else if (Dom_1.$$(target).hasClass('coveo-hide-expanded')) {
        Dom_1.$$(target.parentElement).addClass('coveo-inactive');
        _.each(Dom_1.$$(target.parentElement).siblings('.coveo-emails-excess-collapsed'), function (sibling) {
            Dom_1.$$(sibling).addClass('coveo-active');
        });
    }
    return undefined;
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('anchor', function (href, options) {
    return HtmlUtils_1.AnchorUtils.buildAnchor(href, options);
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('image', function (src, options) {
    return HtmlUtils_1.ImageUtils.buildImage(src, options);
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('thumbnail', function (result, endpoint, options) {
    if (result === void 0) { result = resolveQueryResult(); }
    if (endpoint === void 0) { endpoint = 'default'; }
    if (QueryUtils_1.QueryUtils.hasThumbnail(result)) {
        return HtmlUtils_1.ImageUtils.buildImageFromResult(result, SearchEndpoint_1.SearchEndpoint.endpoints[endpoint], options);
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('fromFileTypeToIcon', function (result, options) {
    if (result === void 0) { result = resolveQueryResult(); }
    if (options === void 0) { options = {}; }
    var icon = Component_1.Component.getComponentRef('Icon');
    if (icon) {
        return icon.createIcon(result, options).outerHTML;
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('attrEncode', function (value) {
    return ('' + value) /* Forces the conversion to string. */
        .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
        .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
        .replace(/'/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('loadTemplates', function (templatesToLoad, once) {
    if (once === void 0) { once = true; }
    var ret = '';
    var data = resolveQueryResult();
    var atLeastOneWasLoaded = false;
    var toLoad = templatesToLoad;
    var defaultTmpl;
    _.each(templatesToLoad, function (value, key, obj) {
        if (value == 'default') {
            defaultTmpl = key;
        }
    });
    if (defaultTmpl != undefined) {
        toLoad = _.omit(templatesToLoad, defaultTmpl);
    }
    _.each(toLoad, function (condition, id, obj) {
        if (!atLeastOneWasLoaded || !once) {
            atLeastOneWasLoaded = atLeastOneWasLoaded || condition;
            ret += TemplateHelpers_1.TemplateHelpers.getHelper('loadTemplate')(id, condition, data);
        }
    });
    if (!atLeastOneWasLoaded && defaultTmpl != undefined) {
        ret += TemplateHelpers_1.TemplateHelpers.getHelper('loadTemplate')(defaultTmpl, true, data);
    }
    return ret;
});
var byteMeasure = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('size', function (value, options) {
    var size = parseInt(value, 10);
    var precision = options != null && options.precision != null ? options.precision : 2;
    var base = options != null && options.base != null ? options.base : 0;
    while (size > 1024 && base + 1 < byteMeasure.length) {
        size /= 1024;
        base++;
    }
    size = Math.floor(size * Math.pow(10, precision)) / Math.pow(10, precision);
    return size + ' ' + byteMeasure[base];
});
TemplateHelpers_1.TemplateHelpers.registerFieldHelper('translatedCaption', function (value) {
    return FacetUtils_1.FacetUtils.tryToGetTranslatedCaption('@filetype', value);
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('loadTemplate', function (id, condition, data) {
    if (condition === void 0) { condition = true; }
    if (Utils_1.Utils.isNullOrUndefined(data)) {
        data = resolveQueryResult();
    }
    if (condition) {
        return TemplateCache_1.TemplateCache.getTemplate(id).instantiateToString(data, {
            checkCondition: false
        });
    }
    return '';
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('encodeCarriageReturn', function (data) {
    if (Utils_1.Utils.isNullOrUndefined(data)) {
        return undefined;
    }
    else {
        return StringUtils_1.StringUtils.encodeCarriageReturn(data);
    }
});
TemplateHelpers_1.TemplateHelpers.registerTemplateHelper('isMobileDevice', function () {
    return DeviceUtils_1.DeviceUtils.isMobileDevice() ? DeviceUtils_1.DeviceUtils.getDeviceName() : null;
});
function resolveQueryResult() {
    var found;
    var resultList = Component_1.Component.getComponentRef('ResultList');
    if (resultList) {
        found = resultList.resultCurrentlyBeingRendered;
    }
    if (!found) {
        var quickview = Component_1.Component.getComponentRef('Quickview');
        if (quickview) {
            found = quickview.resultCurrentlyBeingRendered;
        }
    }
    return found;
}
function resolveTermsToHighlight() {
    var currentQueryResult = resolveQueryResult();
    if (currentQueryResult) {
        return currentQueryResult.termsToHighlight;
    }
}
function resolvePhrasesToHighlight() {
    var currentQueryResult = resolveQueryResult();
    if (currentQueryResult) {
        return currentQueryResult.phrasesToHighlight;
    }
}
function termsToHighlightAreDefined(termsToHighlight, phrasesToHighlight) {
    return Utils_1.Utils.isNonEmptyArray(_.keys(termsToHighlight)) || Utils_1.Utils.isNonEmptyArray(_.keys(phrasesToHighlight));
}


/***/ }),

/***/ 347:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ResponsiveComponentsManager_1 = __webpack_require__(74);
var SearchInterface_1 = __webpack_require__(17);
var ResultList_1 = __webpack_require__(93);
var Dom_1 = __webpack_require__(2);
var Component_1 = __webpack_require__(6);
var Logger_1 = __webpack_require__(11);
var ResponsiveDefaultResultTemplate = /** @class */ (function () {
    function ResponsiveDefaultResultTemplate(coveoRoot, ID, options, responsiveDropdown) {
        this.coveoRoot = coveoRoot;
        this.ID = ID;
        this.searchInterface = Component_1.Component.get(this.coveoRoot.el, SearchInterface_1.SearchInterface, false);
        this.currentMode = 'large';
    }
    ResponsiveDefaultResultTemplate.init = function (root, component, options) {
        if (!Dom_1.$$(root).find("." + Component_1.Component.computeCssClassName(ResultList_1.ResultList))) {
            var logger = new Logger_1.Logger('ResponsiveDefaultResultTemplate');
            logger.trace('No ResultLayout component found : Cannot instantiate ResponsiveResultLayout');
            return;
        }
        ResponsiveComponentsManager_1.ResponsiveComponentsManager.register(ResponsiveDefaultResultTemplate, Dom_1.$$(root), ResultList_1.ResultList.ID, component, options);
    };
    ResponsiveDefaultResultTemplate.prototype.registerComponent = function (accept) {
        if (accept instanceof ResultList_1.ResultList) {
            this.resultList = accept;
            return true;
        }
        return false;
    };
    ResponsiveDefaultResultTemplate.prototype.handleResizeEvent = function () {
        var _this = this;
        var lastResults = this.resultList.queryController.getLastResults();
        if (this.needSmallMode()) {
            Dom_1.$$(this.resultList.options.resultContainer).addClass('coveo-card-layout-container');
            Dom_1.$$(this.resultList.options.resultContainer).removeClass("coveo-list-layout-container");
            if (this.currentMode != 'small') {
                if (lastResults) {
                    this.resultList.buildResults(lastResults).then(function (elements) {
                        _this.resultList.renderResults(elements);
                    });
                }
                this.currentMode = 'small';
            }
        }
        else {
            Dom_1.$$(this.resultList.options.resultContainer).removeClass('coveo-card-layout-container');
            Dom_1.$$(this.resultList.options.resultContainer).addClass("coveo-list-layout-container");
            if (this.currentMode != 'large') {
                if (lastResults) {
                    this.resultList.buildResults(lastResults).then(function (elements) {
                        _this.resultList.renderResults(elements);
                    });
                }
                this.currentMode = 'large';
            }
        }
    };
    ResponsiveDefaultResultTemplate.prototype.needSmallMode = function () {
        return this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getSmallScreenWidth();
    };
    return ResponsiveDefaultResultTemplate;
}());
exports.ResponsiveDefaultResultTemplate = ResponsiveDefaultResultTemplate;


/***/ }),

/***/ 348:
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ResultListRenderer_1 = __webpack_require__(150);
var TableTemplate_1 = __webpack_require__(321);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var ResultListTableRenderer = /** @class */ (function (_super) {
    __extends(ResultListTableRenderer, _super);
    function ResultListTableRenderer(resultListOptions, autoCreateComponentsFn) {
        var _this = _super.call(this, resultListOptions, autoCreateComponentsFn) || this;
        _this.resultListOptions = resultListOptions;
        _this.autoCreateComponentsFn = autoCreateComponentsFn;
        _this.shouldDisplayHeader = true;
        _this.shouldDisplayFooter = false;
        if (_this.resultListOptions.resultTemplate instanceof TableTemplate_1.TableTemplate) {
            if (_this.resultListOptions.resultTemplate.hasTemplateWithRole('table-footer')) {
                _this.shouldDisplayFooter = true;
            }
            // If custom templates are defined but no header template, do not display it.
            if (_this.resultListOptions.resultTemplate.templates.length !== 0 &&
                !_this.resultListOptions.resultTemplate.hasTemplateWithRole('table-header')) {
                _this.shouldDisplayHeader = false;
            }
        }
        return _this;
    }
    ResultListTableRenderer.prototype.getStartFragment = function (resultElements, append) {
        if (!append && !_.isEmpty(resultElements) && this.shouldDisplayHeader) {
            return this.renderRoledTemplate('table-header');
        }
    };
    ResultListTableRenderer.prototype.getEndFragment = function (resultElements, append) {
        if (!append && !_.isEmpty(resultElements) && this.shouldDisplayFooter) {
            return this.renderRoledTemplate('table-footer');
        }
    };
    ResultListTableRenderer.prototype.renderRoledTemplate = function (role) {
        return __awaiter(this, void 0, void 0, function () {
            var elem, frag;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resultListOptions.resultTemplate.instantiateRoleToElement(role)];
                    case 1:
                        elem = _a.sent();
                        Dom_1.$$(elem).addClass("coveo-result-list-" + role);
                        this.autoCreateComponentsFn(elem, undefined);
                        frag = document.createDocumentFragment();
                        frag.appendChild(elem);
                        return [2 /*return*/, frag];
                }
            });
        });
    };
    return ResultListTableRenderer;
}(ResultListRenderer_1.ResultListRenderer));
exports.ResultListTableRenderer = ResultListTableRenderer;


/***/ }),

/***/ 349:
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
var ResultListRenderer_1 = __webpack_require__(150);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var ResultListCardRenderer = /** @class */ (function (_super) {
    __extends(ResultListCardRenderer, _super);
    function ResultListCardRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResultListCardRenderer.prototype.getEndFragment = function (resultElements) {
        var _this = this;
        return new Promise(function (resolve) {
            if (!_.isEmpty(resultElements)) {
                // with infinite scrolling, we want the additional results to append at the end of the previous query.
                // For this, we need to remove the padding.
                if (_this.resultListOptions.enableInfiniteScroll) {
                    var needToBeRemoved = Dom_1.$$(_this.resultListOptions.resultContainer).findAll('.coveo-card-layout-padding');
                    _.each(needToBeRemoved, function (toRemove) { return Dom_1.$$(toRemove).remove(); });
                }
                // Used to prevent last card from spanning the grid's whole width
                var emptyCards_1 = document.createDocumentFragment();
                _.times(3, function () { return emptyCards_1.appendChild(Dom_1.$$('div', { className: 'coveo-card-layout coveo-card-layout-padding' }).el); });
                resolve(emptyCards_1);
            }
            resolve(null);
        });
    };
    return ResultListCardRenderer;
}(ResultListRenderer_1.ResultListRenderer));
exports.ResultListCardRenderer = ResultListCardRenderer;


/***/ }),

/***/ 350:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 351:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 352:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='Facet.ts' />
var StringUtils_1 = __webpack_require__(18);
var QueryUtils_1 = __webpack_require__(19);
var FileTypes_1 = __webpack_require__(89);
var DateUtils_1 = __webpack_require__(29);
var Utils_1 = __webpack_require__(4);
var Dom_1 = __webpack_require__(2);
var _ = __webpack_require__(0);
var Strings_1 = __webpack_require__(8);
var FacetUtils = /** @class */ (function () {
    function FacetUtils() {
    }
    FacetUtils.getRegexToUseForFacetSearch = function (value, ignoreAccent) {
        return new RegExp(StringUtils_1.StringUtils.stringToRegex(value, ignoreAccent), 'i');
    };
    FacetUtils.getValuesToUseForSearchInFacet = function (original, facet) {
        var ret = [original];
        var regex = this.getRegexToUseForFacetSearch(original, facet.options.facetSearchIgnoreAccents);
        if (facet.options.valueCaption) {
            _.chain(facet.options.valueCaption)
                .pairs()
                .filter(function (pair) {
                return regex.test(pair[1]);
            })
                .each(function (match) {
                ret.push(match[0]);
            });
            if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@objecttype') ||
                QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@filetype')) {
                _.each(FileTypes_1.FileTypes.getFileTypeCaptions(), function (value, key) {
                    if (!(key in facet.options.valueCaption) && regex.test(value)) {
                        ret.push(key);
                    }
                });
            }
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@objecttype') ||
            QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@filetype')) {
            _.each(_.filter(_.pairs(FileTypes_1.FileTypes.getFileTypeCaptions()), function (pair) {
                return regex.test(pair[1]);
            }), function (match) {
                ret.push(match[0]);
            });
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(facet.options.field, '@month')) {
            _.each(_.range(1, 13), function (month) {
                if (regex.test(DateUtils_1.DateUtils.monthToString(month - 1))) {
                    ret.push(('0' + month.toString()).substr(-2));
                }
            });
        }
        return ret;
    };
    FacetUtils.buildFacetSearchPattern = function (values) {
        values = _.map(values, function (value) {
            return Utils_1.Utils.escapeRegexCharacter(value);
        });
        values[0] = '.*' + values[0] + '.*';
        return values.join('|');
    };
    FacetUtils.needAnotherFacetSearch = function (currentSearchLength, newSearchLength, oldSearchLength, desiredSearchLength) {
        // Something was removed (currentSearch < newSearch)
        // && we might want to display more facet search result(currentSearch < desiredSearch)
        // && the new query returned more stuff than the old one so there's still more results(currentSearchLength > oldLength)
        return currentSearchLength < newSearchLength && currentSearchLength < desiredSearchLength && currentSearchLength > oldSearchLength;
    };
    FacetUtils.addNoStateCssClassToFacetValues = function (facet, container) {
        // This takes care of adding the correct css class on each facet value checkbox (empty white box) if at least one value is selected in that facet
        if (facet.values.getSelected().length != 0) {
            var noStates = Dom_1.$$(container).findAll('li:not(.coveo-selected)');
            _.each(noStates, function (noState) {
                Dom_1.$$(noState).addClass('coveo-no-state');
            });
        }
    };
    FacetUtils.tryToGetTranslatedCaption = function (field, value) {
        var found;
        if (QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@filetype')) {
            found = FileTypes_1.FileTypes.getFileType(value).caption;
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@objecttype')) {
            found = FileTypes_1.FileTypes.getObjectType(value).caption;
        }
        else if (QueryUtils_1.QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@month') && value != 'Search') {
            try {
                var month = parseInt(value);
                found = DateUtils_1.DateUtils.monthToString(month - 1);
            }
            catch (ex) {
                // Do nothing
            }
        }
        else {
            found = Strings_1.l(value);
        }
        return found != undefined && Utils_1.Utils.isNonEmptyString(found) ? found : value;
    };
    return FacetUtils;
}());
exports.FacetUtils = FacetUtils;


/***/ }),

/***/ 74:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(2);
var InitializationEvents_1 = __webpack_require__(15);
var Component_1 = __webpack_require__(6);
var SearchInterface_1 = __webpack_require__(17);
var Utils_1 = __webpack_require__(4);
var _ = __webpack_require__(0);
var QueryEvents_1 = __webpack_require__(10);
var Logger_1 = __webpack_require__(11);
var ResponsiveComponentsManager = /** @class */ (function () {
    function ResponsiveComponentsManager(root) {
        var _this = this;
        this.disabledComponents = [];
        this.responsiveComponents = [];
        this.coveoRoot = root;
        this.searchInterface = Component_1.Component.get(this.coveoRoot.el, SearchInterface_1.SearchInterface, false);
        this.dropdownHeadersWrapper = Dom_1.$$('div', {
            className: ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS
        });
        this.searchBoxElement = this.getSearchBoxElement();
        this.logger = new Logger_1.Logger(this);
        this.resizeListener = function () {
            if (_this.coveoRoot.width() != 0) {
                _this.addDropdownHeaderWrapperIfNeeded();
                if (_this.shouldSwitchToSmallMode()) {
                    _this.coveoRoot.addClass('coveo-small-interface');
                }
                else if (!_this.shouldSwitchToSmallMode()) {
                    _this.coveoRoot.removeClass('coveo-small-interface');
                }
                _.each(_this.responsiveComponents, function (responsiveComponent) {
                    responsiveComponent.handleResizeEvent();
                });
            }
            else {
                _this.logger
                    .warn("The width of the search interface is 0, cannot dispatch resize events to responsive components. This means that the tabs will not\n        automatically fit in the tab section. Also, the facet and recommendation component will not hide in a menu. Could the search\n        interface display property be none? Could its visibility property be set to hidden? Also, if either of these scenarios happen during\n        loading, it could be the cause of this issue.");
            }
        };
        window.addEventListener('resize', this.resizeListener);
        this.bindNukeEvents();
    }
    // Register takes a class and will instantiate it after framework initialization has completed.
    ResponsiveComponentsManager.register = function (responsiveComponentConstructor, root, ID, component, options) {
        var _this = this;
        // options.initializationEventRoot can be set in some instance (like recommendation) where the root of the interface triggering the init event
        // is different from the one that will be used for calculation size.
        var initEventRoot = options.initializationEventRoot || root;
        initEventRoot.on(InitializationEvents_1.InitializationEvents.afterInitialization, function () {
            if (_this.shouldEnableResponsiveMode(root)) {
                var responsiveComponentsManager = _.find(_this.componentManagers, function (componentManager) { return root.el == componentManager.coveoRoot.el; });
                if (!responsiveComponentsManager) {
                    responsiveComponentsManager = new ResponsiveComponentsManager(root);
                    _this.componentManagers.push(responsiveComponentsManager);
                }
                if (!Utils_1.Utils.isNullOrUndefined(options.enableResponsiveMode) && !options.enableResponsiveMode) {
                    responsiveComponentsManager.disableComponent(ID);
                    return;
                }
                _this.componentInitializations.push({
                    responsiveComponentsManager: responsiveComponentsManager,
                    arguments: [responsiveComponentConstructor, root, ID, component, options]
                });
            }
            _this.remainingComponentInitializations--;
            if (_this.remainingComponentInitializations == 0) {
                _this.instantiateResponsiveComponents(); // necessary to verify if all components are disabled before they are initialized.
                if (root.width() == 0) {
                    var logger = new Logger_1.Logger('ResponsiveComponentsManager');
                    logger.info("Search interface width is 0, cannot dispatch resize events to responsive components. Will try again after first\n          query success.");
                    root.one(QueryEvents_1.QueryEvents.querySuccess, function () {
                        _this.resizeAllComponentsManager();
                    });
                }
                else {
                    _this.resizeAllComponentsManager();
                }
            }
        });
        this.remainingComponentInitializations++;
    };
    ResponsiveComponentsManager.shouldEnableResponsiveMode = function (root) {
        var searchInterface = Component_1.Component.get(root.el, SearchInterface_1.SearchInterface, true);
        return searchInterface instanceof SearchInterface_1.SearchInterface && searchInterface.options.enableAutomaticResponsiveMode;
    };
    ResponsiveComponentsManager.instantiateResponsiveComponents = function () {
        _.each(this.componentInitializations, function (componentInitialization) {
            var responsiveComponentsManager = componentInitialization.responsiveComponentsManager;
            responsiveComponentsManager.register.apply(responsiveComponentsManager, componentInitialization.arguments);
        });
    };
    ResponsiveComponentsManager.resizeAllComponentsManager = function () {
        _.each(this.componentManagers, function (componentManager) {
            componentManager.resizeListener();
        });
    };
    ResponsiveComponentsManager.prototype.register = function (responsiveComponentConstructor, root, ID, component, options) {
        if (this.isDisabled(ID)) {
            return;
        }
        if (!this.isActivated(ID)) {
            var responsiveComponent = new responsiveComponentConstructor(root, ID, options);
            if (this.isTabs(ID)) {
                this.responsiveComponents.push(responsiveComponent);
            }
            else {
                // Tabs need to be rendered last, so any dropdown header(eg: facet) is already there when the responsive tabs check for overflow.
                this.responsiveComponents.unshift(responsiveComponent);
            }
        }
        _.each(this.responsiveComponents, function (responsiveComponent) {
            if (responsiveComponent.registerComponent != null) {
                responsiveComponent.registerComponent(component);
            }
        });
    };
    ResponsiveComponentsManager.prototype.disableComponent = function (ID) {
        this.disabledComponents.push(ID);
    };
    ResponsiveComponentsManager.prototype.isDisabled = function (ID) {
        return _.indexOf(this.disabledComponents, ID) != -1;
    };
    ResponsiveComponentsManager.prototype.shouldSwitchToSmallMode = function () {
        var aComponentNeedsTabSection = this.needDropdownWrapper();
        var reachedBreakpoint = this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getMediumScreenWidth();
        return aComponentNeedsTabSection || reachedBreakpoint;
    };
    ResponsiveComponentsManager.prototype.needDropdownWrapper = function () {
        for (var i = 0; i < this.responsiveComponents.length; i++) {
            var responsiveComponent = this.responsiveComponents[i];
            if (responsiveComponent.needDropdownWrapper && responsiveComponent.needDropdownWrapper()) {
                return true;
            }
        }
        return false;
    };
    ResponsiveComponentsManager.prototype.addDropdownHeaderWrapperIfNeeded = function () {
        if (this.needDropdownWrapper()) {
            var tabSection = Dom_1.$$(this.coveoRoot).find('.coveo-tab-section');
            if (this.searchBoxElement) {
                this.dropdownHeadersWrapper.insertAfter(this.searchBoxElement);
            }
            else if (tabSection) {
                this.dropdownHeadersWrapper.insertAfter(tabSection);
            }
            else {
                this.coveoRoot.prepend(this.dropdownHeadersWrapper.el);
            }
        }
    };
    ResponsiveComponentsManager.prototype.isTabs = function (ID) {
        return ID == 'Tab';
    };
    ResponsiveComponentsManager.prototype.isActivated = function (ID) {
        return _.find(this.responsiveComponents, function (current) { return current.ID == ID; }) != undefined;
    };
    ResponsiveComponentsManager.prototype.getSearchBoxElement = function () {
        var searchBoxElement = this.coveoRoot.find('.coveo-search-section');
        if (searchBoxElement) {
            return searchBoxElement;
        }
        else {
            return this.coveoRoot.find('.CoveoSearchbox');
        }
    };
    ResponsiveComponentsManager.prototype.bindNukeEvents = function () {
        var _this = this;
        Dom_1.$$(this.coveoRoot).on(InitializationEvents_1.InitializationEvents.nuke, function () {
            window.removeEventListener('resize', _this.resizeListener);
            // If the interface gets nuked, we need to remove all reference to componentManagers stored which match the current search interface
            ResponsiveComponentsManager.componentManagers = _.filter(ResponsiveComponentsManager.componentManagers, function (manager) { return manager.coveoRoot.el != _this.coveoRoot.el; });
        });
    };
    ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS = 'coveo-dropdown-header-wrapper';
    ResponsiveComponentsManager.componentManagers = [];
    ResponsiveComponentsManager.remainingComponentInitializations = 0;
    ResponsiveComponentsManager.componentInitializations = [];
    return ResponsiveComponentsManager;
}());
exports.ResponsiveComponentsManager = ResponsiveComponentsManager;


/***/ }),

/***/ 93:
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
var TableTemplate_1 = __webpack_require__(321);
var DefaultResultTemplate_1 = __webpack_require__(83);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(7);
var Assert_1 = __webpack_require__(5);
var QueryEvents_1 = __webpack_require__(10);
var Model_1 = __webpack_require__(16);
var QueryStateModel_1 = __webpack_require__(12);
var QueryUtils_1 = __webpack_require__(19);
var Dom_1 = __webpack_require__(2);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Initialization_1 = __webpack_require__(1);
var Defer_1 = __webpack_require__(28);
var DeviceUtils_1 = __webpack_require__(21);
var ResultListEvents_1 = __webpack_require__(32);
var ResultLayoutEvents_1 = __webpack_require__(97);
var Utils_1 = __webpack_require__(4);
var DomUtils_1 = __webpack_require__(62);
var DefaultRecommendationTemplate_1 = __webpack_require__(322);
var TemplateList_1 = __webpack_require__(95);
var TemplateCache_1 = __webpack_require__(54);
var ResponsiveDefaultResultTemplate_1 = __webpack_require__(347);
var ResultListRenderer_1 = __webpack_require__(150);
var ResultListTableRenderer_1 = __webpack_require__(348);
var ResultListCardRenderer_1 = __webpack_require__(349);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(350);
__webpack_require__(351);
__webpack_require__(352);
var InitializationPlaceholder_1 = __webpack_require__(132);
var RegisteredNamedMethods_1 = __webpack_require__(26);
var TemplateComponentOptions_1 = __webpack_require__(51);
var CoreHelpers_1 = __webpack_require__(326);
CoreHelpers_1.CoreHelpers.exportAllHelpersGlobally(window['Coveo']);
/**
 * The `ResultList` component is responsible for displaying query results by applying one or several result templates
 * (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * It is possible to include multiple `ResultList` components along with a single `ResultLayout`
 * component in a search page to provide different result layouts (see
 * [Result Layouts](https://developers.coveo.com/x/yQUvAg)).
 *
 * This component supports infinite scrolling (see the
 * [`enableInfiniteScroll`]{@link ResultList.options.enableInfiniteScroll} option).
 */
var ResultList = /** @class */ (function (_super) {
    __extends(ResultList, _super);
    /**
     * Creates a new `ResultList` component. Binds various event related to queries (e.g., on querySuccess ->
     * renderResults). Binds scroll event if the [`enableInfiniteScroll`]{@link ResultList.options.enableInfiniteScroll}
     * option is `true`.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `ResultList` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param elementClassId The class that this component should instantiate. Components that extend the base ResultList
     * use this. Default value is `CoveoResultList`.
     */
    function ResultList(element, options, bindings, elementClassId) {
        if (elementClassId === void 0) { elementClassId = ResultList.ID; }
        var _this = _super.call(this, element, elementClassId, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.currentlyDisplayedResults = [];
        _this.reachedTheEndOfResults = false;
        // This variable serves to block some setup where the framework fails to correctly identify the "real" scrolling container.
        // Since it's not technically feasible to correctly identify the scrolling container in every possible scenario without some very complex logic, we instead try to add some kind of mechanism to
        // block runaway requests where UI will keep asking more results in the index, eventually bringing the browser to it's knee.
        // Those successive request are needed in "displayMoreResults" to ensure we fill the scrolling container correctly.
        // Since the container is not identified correctly, it is never "full", so we keep asking for more.
        // It is reset every time the user actually scroll the container manually.
        _this.successiveScrollCount = 0;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultList, options);
        Assert_1.Assert.exists(element);
        Assert_1.Assert.exists(_this.options);
        Assert_1.Assert.exists(_this.options.resultTemplate);
        Assert_1.Assert.exists(_this.options.infiniteScrollContainer);
        _this.showOrHideElementsDependingOnState(false, false);
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.newQuery, function (args) { return _this.handleNewQuery(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) {
            return _this.handleBuildingQuery(args);
        });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.querySuccess, function (args) {
            return _this.handleQuerySuccess(args);
        });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.duringQuery, function (args) { return _this.handleDuringQuery(); });
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.queryError, function (args) { return _this.handleQueryError(); });
        Dom_1.$$(_this.root).on(ResultListEvents_1.ResultListEvents.changeLayout, function (e, args) { return _this.handleChangeLayout(args); });
        if (_this.options.enableInfiniteScroll) {
            _this.handlePageChanged();
            _this.bind.on(_this.options.infiniteScrollContainer, 'scroll', function (e) {
                _this.successiveScrollCount = 0;
                _this.handleScrollOfResultList();
            });
        }
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.FIRST, function () { return _this.handlePageChanged(); });
        _this.initResultContainer();
        Assert_1.Assert.exists(_this.options.resultContainer);
        _this.initWaitAnimationContainer();
        Assert_1.Assert.exists(_this.options.waitAnimationContainer);
        _this.setupTemplatesVersusLayouts();
        Dom_1.$$(_this.root).on(ResultLayoutEvents_1.ResultLayoutEvents.populateResultLayout, function (e, args) {
            return args.layouts.push(_this.options.layout);
        });
        _this.setupRenderer();
        return _this;
    }
    ResultList.getDefaultTemplate = function (e) {
        var template = ResultList.loadTemplatesFromCache();
        if (template != null) {
            return template;
        }
        var component = Component_1.Component.get(e);
        if (Coveo['Recommendation'] && component.searchInterface instanceof Coveo['Recommendation']) {
            return new DefaultRecommendationTemplate_1.DefaultRecommendationTemplate();
        }
        return new DefaultResultTemplate_1.DefaultResultTemplate();
    };
    ResultList.loadTemplatesFromCache = function () {
        var pageTemplateNames = TemplateCache_1.TemplateCache.getResultListTemplateNames();
        if (pageTemplateNames.length > 0) {
            return new TemplateList_1.TemplateList(_.compact(_.map(pageTemplateNames, function (templateName) { return TemplateCache_1.TemplateCache.getTemplate(templateName); })));
        }
        return null;
    };
    /**
     * Get the fields needed to be automatically included in the query for this result list.
     * @returns {string[]}
     */
    ResultList.prototype.getAutoSelectedFieldsToInclude = function () {
        return _.chain(this.options.resultTemplate.getFields())
            .concat(this.getMinimalFieldsToInclude())
            .compact()
            .unique()
            .value();
    };
    ResultList.prototype.setupTemplatesVersusLayouts = function () {
        var _this = this;
        var layoutClassToAdd = "coveo-" + this.options.layout + "-layout-container";
        Dom_1.$$(this.options.resultContainer).addClass(layoutClassToAdd);
        if (this.options.layout === 'table') {
            this.options.resultTemplate = new TableTemplate_1.TableTemplate(this.options.resultTemplate.templates || []);
        }
        // A TemplateList is the scenario where the result template are directly embedded inside the ResultList
        // This is the typical scenario when a page gets created by the interface editor, for example.
        // In that case, we try to stick closely that what is actually configured inside the page, and do no "special magic".
        // Stick to the "hardcoded" configuration present in the page.
        // We only add the correct layout options if it has not been set manually.
        if (this.options.resultTemplate instanceof TemplateList_1.TemplateList) {
            _.each(this.options.resultTemplate.templates, function (tmpl) {
                if (!tmpl.layout) {
                    tmpl.layout = _this.options.layout;
                }
            });
        }
        else if (this.options.resultTemplate instanceof DefaultResultTemplate_1.DefaultResultTemplate && this.options.layout == 'list') {
            ResponsiveDefaultResultTemplate_1.ResponsiveDefaultResultTemplate.init(this.root, this, {});
        }
    };
    /**
     * Empties the current result list content and appends the given array of HTMLElement.
     *
     * Can append to existing elements in the result list, or replace them.
     *
     * Triggers the `newResultsDisplayed` and `newResultDisplayed` events.
     * @param resultsElement
     * @param append
     */
    ResultList.prototype.renderResults = function (resultElements, append) {
        var _this = this;
        if (append === void 0) { append = false; }
        if (!append) {
            this.options.resultContainer.innerHTML = '';
        }
        return this.renderer
            .renderResults(resultElements, append, this.triggerNewResultDisplayed.bind(this))
            .then(function () { return _this.triggerNewResultsDisplayed(); });
    };
    /**
     * Builds and returns an array of HTMLElement with the given result set.
     * @param results the result set to build an array of HTMLElement from.
     */
    ResultList.prototype.buildResults = function (results) {
        var _this = this;
        var res = [];
        var resultsPromises = _.map(results.results, function (result, index) {
            return _this.buildResult(result).then(function (resultElement) {
                if (resultElement != null) {
                    res.push({ elem: resultElement, idx: index });
                }
                ResultList.resultCurrentlyBeingRendered = null;
                return resultElement;
            });
        });
        // We need to sort by the original index order, because in lazy loading mode, it's possible that results does not gets rendered
        // in the correct order returned by the index, depending on the time it takes to load all the results component for a given result template
        return Promise.all(resultsPromises).then(function () {
            return _.pluck(_.sortBy(res, 'idx'), 'elem');
        });
    };
    /**
     * Builds and returns an HTMLElement for the given result.
     * @param result the result to build an HTMLElement from.
     * @returns {HTMLElement}
     */
    ResultList.prototype.buildResult = function (result) {
        var _this = this;
        Assert_1.Assert.exists(result);
        QueryUtils_1.QueryUtils.setStateObjectOnQueryResult(this.queryStateModel.get(), result);
        QueryUtils_1.QueryUtils.setSearchInterfaceObjectOnQueryResult(this.searchInterface, result);
        ResultList.resultCurrentlyBeingRendered = result;
        return this.options.resultTemplate
            .instantiateToElement(result, {
            wrapInDiv: true,
            checkCondition: true,
            currentLayout: this.options.layout,
            responsiveComponents: this.searchInterface.responsiveComponents
        })
            .then(function (resultElement) {
            if (resultElement != null) {
                Component_1.Component.bindResultToElement(resultElement, result);
            }
            _this.currentlyDisplayedResults.push(result);
            return _this.autoCreateComponentsInsideResult(resultElement, result).initResult.then(function () {
                return resultElement;
            });
        });
    };
    /**
     * Executes a query to fetch new results. After the query returns, renders the new results.
     *
     * Asserts that there are more results to display by verifying whether the last query has returned as many results as
     * requested.
     *
     * Asserts that the `ResultList` is not currently fetching results.
     * @param count The number of results to fetch and display.
     */
    ResultList.prototype.displayMoreResults = function (count) {
        var _this = this;
        Assert_1.Assert.isLargerOrEqualsThan(1, count);
        if (this.isCurrentlyFetchingMoreResults()) {
            this.logger.warn("Ignoring request to display more results since we're already doing so");
            return;
        }
        if (!this.hasPotentiallyMoreResultsToDisplay()) {
            this.logger.warn("Ignoring request to display more results since we know there aren't more to display");
            return;
        }
        if (this.options.enableInfiniteScrollWaitingAnimation) {
            this.showWaitingAnimationForInfiniteScrolling();
        }
        this.fetchingMoreResults = this.queryController.fetchMore(count);
        this.fetchingMoreResults.then(function (data) {
            Assert_1.Assert.exists(data);
            _this.usageAnalytics.logCustomEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.pagerScrolling, {}, _this.element);
            var results = data.results;
            _this.reachedTheEndOfResults = count > data.results.length;
            _this.buildResults(data).then(function (elements) {
                _this.renderResults(elements, true);
                _.each(results, function (result) {
                    _this.currentlyDisplayedResults.push(result);
                });
                _this.triggerNewResultsDisplayed();
            });
        });
        this.fetchingMoreResults.finally(function () {
            _this.hideWaitingAnimationForInfiniteScrolling();
            _this.fetchingMoreResults = undefined;
            Defer_1.Defer.defer(function () {
                _this.successiveScrollCount++;
                if (_this.successiveScrollCount <= ResultList.MAX_AMOUNT_OF_SUCESSIVE_REQUESTS) {
                    _this.handleScrollOfResultList();
                }
                else {
                    _this.logger.info("Result list has triggered 5 consecutive queries to try and fill up the scrolling container, but it is still unable to do so");
                    _this.logger.info("Try explicitly setting the 'data-infinite-scroll-container-selector' option on the result list. See : https://coveo.github.io/search-ui/components/resultlist.html#options.infinitescrollcontainer");
                }
            });
        });
        return this.fetchingMoreResults;
    };
    /**
     * Gets the list of currently displayed result.
     * @returns {IQueryResult[]}
     */
    ResultList.prototype.getDisplayedResults = function () {
        return this.currentlyDisplayedResults;
    };
    /**
     * Gets the list of currently displayed result HTMLElement.
     * @returns {HTMLElement[]}
     */
    ResultList.prototype.getDisplayedResultsElements = function () {
        return Dom_1.$$(this.options.resultContainer).findAll('.CoveoResult');
    };
    ResultList.prototype.enable = function () {
        _super.prototype.enable.call(this);
        Dom_1.$$(this.element).removeClass('coveo-hidden');
    };
    ResultList.prototype.disable = function () {
        _super.prototype.disable.call(this);
        Dom_1.$$(this.element).addClass('coveo-hidden');
    };
    ResultList.prototype.autoCreateComponentsInsideResult = function (element, result) {
        Assert_1.Assert.exists(element);
        var initOptions = this.searchInterface.options.originalOptionsObject;
        var resultComponentBindings = _.extend({}, this.getBindings(), {
            resultElement: element
        });
        var initParameters = {
            options: initOptions,
            bindings: resultComponentBindings,
            result: result
        };
        return Initialization_1.Initialization.automaticallyCreateComponentsInside(element, initParameters);
    };
    ResultList.prototype.triggerNewResultDisplayed = function (result, resultElement) {
        var args = {
            result: result,
            item: resultElement
        };
        Dom_1.$$(this.element).trigger(ResultListEvents_1.ResultListEvents.newResultDisplayed, args);
    };
    ResultList.prototype.triggerNewResultsDisplayed = function () {
        Dom_1.$$(this.element).trigger(ResultListEvents_1.ResultListEvents.newResultsDisplayed, {});
    };
    ResultList.prototype.handleDuringQuery = function () {
        this.logger.trace('Emptying the result container');
        this.cancelFetchingMoreResultsIfNeeded();
        this.showWaitingAnimation();
        this.showOrHideElementsDependingOnState(false, false);
    };
    ResultList.prototype.handleQueryError = function () {
        this.hideWaitingAnimation();
        Dom_1.$$(this.options.resultContainer).empty();
        this.currentlyDisplayedResults = [];
        this.reachedTheEndOfResults = true;
    };
    ResultList.prototype.handleQuerySuccess = function (data) {
        var _this = this;
        Assert_1.Assert.exists(data);
        Assert_1.Assert.exists(data.results);
        var results = data.results;
        this.logger.trace('Received query results from new query', results);
        this.hideWaitingAnimation();
        ResultList.resultCurrentlyBeingRendered = undefined;
        this.reachedTheEndOfResults = data.query.numberOfResults > data.results.results.length;
        this.currentlyDisplayedResults = [];
        this.buildResults(data.results).then(function (elements) {
            _this.renderResults(elements);
            _this.showOrHideElementsDependingOnState(true, _this.currentlyDisplayedResults.length != 0);
            if (DeviceUtils_1.DeviceUtils.isMobileDevice() && _this.options.mobileScrollContainer != undefined) {
                _this.options.mobileScrollContainer.scrollTop = 0;
            }
            if (_this.options.enableInfiniteScroll && results.results.length == data.queryBuilder.numberOfResults) {
                // This will check right away if we need to add more results to make the scroll container full & scrolling.
                _this.scrollBackToTop();
                _this.handleScrollOfResultList();
            }
        });
    };
    ResultList.prototype.handleScrollOfResultList = function () {
        if (this.isCurrentlyFetchingMoreResults() || !this.options.enableInfiniteScroll) {
            return;
        }
        if (this.isScrollingOfResultListAlmostAtTheBottom() && this.hasPotentiallyMoreResultsToDisplay()) {
            this.displayMoreResults(this.options.infiniteScrollPageSize);
        }
    };
    ResultList.prototype.handlePageChanged = function () {
        var _this = this;
        this.bind.onRootElement(QueryEvents_1.QueryEvents.deferredQuerySuccess, function () {
            setTimeout(function () {
                _this.scrollBackToTop();
            }, 0);
        });
    };
    ResultList.prototype.scrollBackToTop = function () {
        if (this.options.infiniteScrollContainer instanceof Window) {
            var win = this.options.infiniteScrollContainer;
            var searchInterfacePosition = win.pageYOffset + this.searchInterface.element.getBoundingClientRect().top;
            win.scrollTo(0, searchInterfacePosition);
        }
        else {
            var el = this.options.infiniteScrollContainer;
            el.scrollTop = 0;
        }
    };
    ResultList.prototype.handleNewQuery = function () {
        Dom_1.$$(this.element).removeClass('coveo-hidden');
        ResultList.resultCurrentlyBeingRendered = undefined;
    };
    ResultList.prototype.handleBuildingQuery = function (args) {
        var _this = this;
        if (this.options.fieldsToInclude != null) {
            // remove the @
            args.queryBuilder.addFieldsToInclude(_.map(this.options.fieldsToInclude, function (field) { return field.substr(1); }));
        }
        if (this.options.autoSelectFieldsToInclude) {
            var otherResultListsElements = _.reject(Dom_1.$$(this.root).findAll("." + Component_1.Component.computeCssClassName(ResultList)), function (resultListElement) { return resultListElement == _this.element; });
            var otherFields = _.flatten(_.map(otherResultListsElements, function (otherResultListElement) {
                var otherResultListInstance = RegisteredNamedMethods_1.get(otherResultListElement);
                if (otherResultListInstance) {
                    return otherResultListInstance.getAutoSelectedFieldsToInclude();
                }
                else {
                    return [];
                }
            }));
            args.queryBuilder.addRequiredFields(_.unique(otherFields.concat(this.getAutoSelectedFieldsToInclude())));
            args.queryBuilder.includeRequiredFields = true;
        }
    };
    ResultList.prototype.handleChangeLayout = function (args) {
        var _this = this;
        if (args.layout === this.options.layout) {
            this.enable();
            this.options.resultTemplate.layout = this.options.layout;
            if (args.results) {
                // Prevent flickering when switching to a new layout that is empty
                // add a temporary placeholder, the same that is used on initialization
                if (this.options.resultContainer.innerHTML == '') {
                    new InitializationPlaceholder_1.InitializationPlaceholder(this.root).withVisibleRootElement().withPlaceholderForResultList();
                }
                Defer_1.Defer.defer(function () {
                    _this.buildResults(args.results).then(function (elements) {
                        _this.renderResults(elements);
                    });
                });
            }
        }
        else {
            this.disable();
        }
    };
    ResultList.prototype.isCurrentlyFetchingMoreResults = function () {
        return Utils_1.Utils.exists(this.fetchingMoreResults);
    };
    ResultList.prototype.getMinimalFieldsToInclude = function () {
        // these fields are needed for analytics click event
        return ['author', 'language', 'urihash', 'objecttype', 'collection', 'source', 'language', 'permanentid'];
    };
    ResultList.prototype.isScrollingOfResultListAlmostAtTheBottom = function () {
        // this is in a try catch because the unit test fail otherwise (Window does not exist for phantom js in the console)
        var isWindow;
        try {
            isWindow = this.options.infiniteScrollContainer instanceof Window;
        }
        catch (e) {
            isWindow = false;
        }
        return isWindow ? this.isScrollAtBottomForWindowElement() : this.isScrollAtBottomForHtmlElement();
    };
    ResultList.prototype.isScrollAtBottomForWindowElement = function () {
        var win = new Dom_1.Win(window);
        var windowHeight = win.height();
        var scrollTop = win.scrollY();
        var bodyHeight = new Dom_1.Doc(document).height();
        return bodyHeight - (windowHeight + scrollTop) < windowHeight / 2;
    };
    ResultList.prototype.isScrollAtBottomForHtmlElement = function () {
        var el = this.options.infiniteScrollContainer;
        var elementHeight = el.clientHeight;
        var scrollHeight = el.scrollHeight;
        var bottomPosition = el.scrollTop + elementHeight;
        return scrollHeight - bottomPosition < elementHeight / 2;
    };
    ResultList.prototype.hasPotentiallyMoreResultsToDisplay = function () {
        return this.currentlyDisplayedResults.length > 0 && !this.reachedTheEndOfResults;
    };
    ResultList.prototype.cancelFetchingMoreResultsIfNeeded = function () {
        if (this.isCurrentlyFetchingMoreResults()) {
            this.logger.trace('Cancelling fetching more results');
            Promise.reject(this.fetchingMoreResults);
            this.fetchingMoreResults = undefined;
        }
    };
    ResultList.prototype.showOrHideElementsDependingOnState = function (hasQuery, hasResults) {
        var showIfQuery = Dom_1.$$(this.element).findAll('.coveo-show-if-query');
        var showIfNoQuery = Dom_1.$$(this.element).findAll('.coveo-show-if-no-query');
        var showIfResults = Dom_1.$$(this.element).findAll('.coveo-show-if-results');
        var showIfNoResults = Dom_1.$$(this.element).findAll('.coveo-show-if-no-results');
        _.each(showIfQuery, function (s) {
            Dom_1.$$(s).toggle(hasQuery);
        });
        _.each(showIfNoQuery, function (s) {
            Dom_1.$$(s).toggle(!hasQuery);
        });
        _.each(showIfResults, function (s) {
            Dom_1.$$(s).toggle(hasQuery && hasResults);
        });
        _.each(showIfNoResults, function (s) {
            Dom_1.$$(s).toggle(hasQuery && !hasResults);
        });
    };
    ResultList.prototype.showWaitingAnimation = function () {
        switch (this.options.waitAnimation.toLowerCase()) {
            case 'fade':
                Dom_1.$$(this.options.waitAnimationContainer).addClass('coveo-fade-out');
                break;
            case 'spinner':
                _.each(this.options.resultContainer.children, function (child) {
                    Dom_1.$$(child).hide();
                });
                if (Dom_1.$$(this.options.waitAnimationContainer).find('.coveo-wait-animation') == undefined) {
                    this.options.waitAnimationContainer.appendChild(DomUtils_1.DomUtils.getBasicLoadingAnimation());
                }
                break;
        }
    };
    ResultList.prototype.hideWaitingAnimation = function () {
        switch (this.options.waitAnimation.toLowerCase()) {
            case 'fade':
                Dom_1.$$(this.options.waitAnimationContainer).removeClass('coveo-fade-out');
                break;
            case 'spinner':
                var spinner = Dom_1.$$(this.options.waitAnimationContainer).find('.coveo-loading-spinner');
                if (spinner) {
                    Dom_1.$$(spinner).detach();
                }
                break;
        }
    };
    ResultList.prototype.showWaitingAnimationForInfiniteScrolling = function () {
        var spinner = DomUtils_1.DomUtils.getLoadingSpinner();
        if (this.options.layout == 'card' && this.options.enableInfiniteScroll) {
            var previousSpinnerContainer = Dom_1.$$(this.options.waitAnimationContainer).findAll('.coveo-loading-spinner-container');
            _.each(previousSpinnerContainer, function (previousSpinner) { return Dom_1.$$(previousSpinner).remove(); });
            var spinnerContainer = Dom_1.$$('div', {
                className: 'coveo-loading-spinner-container'
            });
            spinnerContainer.append(spinner);
            this.options.waitAnimationContainer.appendChild(spinnerContainer.el);
        }
        else {
            this.options.waitAnimationContainer.appendChild(DomUtils_1.DomUtils.getLoadingSpinner());
        }
    };
    ResultList.prototype.hideWaitingAnimationForInfiniteScrolling = function () {
        var spinners = Dom_1.$$(this.options.waitAnimationContainer).findAll('.coveo-loading-spinner');
        var containers = Dom_1.$$(this.options.waitAnimationContainer).findAll('.coveo-loading-spinner-container');
        _.each(spinners, function (spinner) { return Dom_1.$$(spinner).remove(); });
        _.each(containers, function (container) { return Dom_1.$$(container).remove(); });
    };
    ResultList.prototype.initResultContainer = function () {
        if (!this.options.resultContainer) {
            var elemType = this.options.layout === 'table' ? 'table' : 'div';
            this.options.resultContainer = Dom_1.$$(elemType, { className: 'coveo-result-list-container' }).el;
            this.element.appendChild(this.options.resultContainer);
        }
    };
    ResultList.prototype.initWaitAnimationContainer = function () {
        if (!this.options.waitAnimationContainer) {
            this.options.waitAnimationContainer = this.options.resultContainer;
        }
    };
    ResultList.prototype.setupRenderer = function () {
        var autoCreateComponentsFn = this.autoCreateComponentsInsideResult.bind(this);
        switch (this.options.layout) {
            case 'card':
                this.renderer = new ResultListCardRenderer_1.ResultListCardRenderer(this.options, autoCreateComponentsFn);
                break;
            case 'table':
                this.renderer = new ResultListTableRenderer_1.ResultListTableRenderer(this.options, autoCreateComponentsFn);
                break;
            case 'list':
            default:
                this.renderer = new ResultListRenderer_1.ResultListRenderer(this.options, autoCreateComponentsFn);
                break;
        }
    };
    ResultList.ID = 'ResultList';
    ResultList.doExport = function () {
        GlobalExports_1.exportGlobally({
            ResultList: ResultList
        });
    };
    /**
     * The options for the ResultList
     * @componentOptions
     */
    ResultList.options = {
        /**
         * Specifies the element inside which to insert the rendered result templates.
         *
         * Performing a new query clears the content of this element.
         *
         * You can change the container by specifying its selector (e.g.,
         * `data-result-container-selector='#someCssSelector'`).
         *
         * If you specify no value for this option, a `div` element will be dynamically created and appended to the result
         * list. This element will then be used as a result container.
         */
        resultContainer: ComponentOptions_1.ComponentOptions.buildChildHtmlElementOption(),
        resultTemplate: TemplateComponentOptions_1.TemplateComponentOptions.buildTemplateOption({ defaultFunction: ResultList.getDefaultTemplate }),
        /**
         * Specifies the type of animation to display while waiting for a query to return.
         *
         * The possible values are:
         * - `fade`: Fades out the current list of results while the query is executing.
         * - `spinner`: Shows a spinning animation while the query is executing.
         * - `none`: Use no animation during queries.
         *
         * See also the [`waitAnimationContainer`]{@link ResultList.options.waitAnimationContainer} option.
         *
         * Default value is `none`.
         */
        waitAnimation: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: 'none' }),
        /**
         * Specifies the element inside which to display the [`waitAnimation`]{@link ResultList.options.waitAnimation}.
         *
         * You can change this by specifying a CSS selector (e.g.,
         * `data-wait-animation-container-selector='#someCssSelector'`).
         *
         * Default value is the value of the [`resultContainer`]{@link ResultList.options.resultContainer} option.
         */
        waitAnimationContainer: ComponentOptions_1.ComponentOptions.buildChildHtmlElementOption({
            postProcessing: function (value, options) { return value || options.resultContainer; }
        }),
        /**
         * Specifies whether to automatically retrieve an additional page of results and append it to the
         * results that the `ResultList` is currently displaying when the user scrolls down to the bottom of the
         * [`infiniteScrollContainer`]{@link ResultList.options.infiniteScrollContainer}.
         *
         * See also the [`infiniteScrollPageSize`]{@link ResultList.options.infiniteScrollPageSize} and
         * [`enableInfiniteScrollWaitingAnimation`]{@link ResultList.options.enableInfiniteScrollWaitingAnimation} options.
         *
         * It is important to specify the `infiniteScrollContainer` option manually if you want the scrolling element to be
         * something else than the default `window` element. Otherwise, you might find yourself in a strange state where the
         * framework rapidly triggers multiple successive query.
         *
         * Default value is `false`.
         */
        enableInfiniteScroll: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * If the [`enableInfiniteScroll`]{@link ResultList.options.enableInfiniteScroll} option is `true`, specifies the
         * number of additional results to fetch when the user scrolls down to the bottom of the
         * [`infiniteScrollContainer`]{@link ResultList.options.infiniteScrollContainer}.
         *
         * Default value is `10`. Minimum value is `1`.
         */
        infiniteScrollPageSize: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultValue: 10,
            min: 1,
            depend: 'enableInfiniteScroll'
        }),
        /**
         * If the [`enableInfiniteScroll`]{@link ResultList.options.enableInfiniteScroll} option is `true`, specifies the
         * element that triggers fetching additional results when the end user scrolls down to its bottom.
         *
         * You can change the container by specifying its selector (e.g.,
         * `data-infinite-scroll-container-selector='#someCssSelector'`).
         *
         * By default, the framework uses the first vertically scrollable parent element it finds, starting from the
         * `ResultList` element itself. A vertically scrollable element is an element whose CSS `overflow-y` attribute is
         * `scroll`.
         *
         * This implies that if the framework can find no scrollable parent, it uses the `window` itself as a scrollable
         * container.
         *
         * This heuristic is not perfect, for technical reasons. There are always some corner case CSS combination which the
         * framework will not be able to correctly detect as 'scrollable'.
         *
         * It is highly recommended that you manually set this option if you wish something else than the `window` to be the
         * scrollable element.
         */
        infiniteScrollContainer: ComponentOptions_1.ComponentOptions.buildChildHtmlElementOption({
            depend: 'enableInfiniteScroll',
            defaultFunction: function (element) { return ComponentOptions_1.ComponentOptions.findParentScrolling(element); }
        }),
        /**
         * If the [`enableInfiniteScroll`]{@link ResultList.options.enableInfiniteScroll} option is `true`, specifies
         * whether to display the [`waitingAnimation`]{@link ResultList.options.waitAnimation} while fetching additional
         * results.
         *
         * Default value is `true`.
         */
        enableInfiniteScrollWaitingAnimation: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            depend: 'enableInfiniteScroll',
            defaultValue: true
        }),
        mobileScrollContainer: ComponentOptions_1.ComponentOptions.buildSelectorOption({
            defaultFunction: function () { return document.querySelector('.coveo-results-column'); }
        }),
        /**
         * Specifies whether the `ResultList` should scan its result templates to discover which fields it must request to
         * be able to render all results.
         *
         * Setting this option to `true` ensures that the Coveo Search API does not return fields that are unnecessary for
         * the UI to function.
         *
         * Default value is `false`, which means that for each result, the Coveo Search API returns all available fields
         * (unless you specify a list of values in the [`fieldsToInclude`]{@link ResultList.options.fieldsToInclude} option,
         * in which case the Coveo Search API only returns those fields, if they are available).
         *
         * **Notes:**
         * > * Many interfaces created with the JavaScript Search Interface Editor explicitly set this option to `true`.
         * > * You cannot set this option to `true` in the Coveo for Sitecore integration.
         */
        autoSelectFieldsToInclude: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies a list of fields to include in the query results.
         *
         * If you set the [`autoSelectFieldsToInclude`]{@link ResultList.options.autoSelectFieldsToInclude} option to
         * `true`, the Coveo Search API returns the fields you specify for this option (if those fields are available) in
         * addition to the fields which the `ResultList` automatically requests.
         *
         * Otherwise, the Coveo Search API only returns the fields you specify for this option (if those fields are
         * available), unless you leave this option undefined, in which case the Coveo Search API returns all available
         * fields.
         */
        fieldsToInclude: ComponentOptions_1.ComponentOptions.buildFieldsOption({ includeInResults: true }),
        /**
         * Specifies the layout to use when displaying results in this `ResultList` (see
         * [Result Layouts](https://developers.coveo.com/x/yQUvAg)). Specifying a value for this option automatically
         * populates a [`ResultLayout`]{@link ResultLayout} component with a switcher for the layout.
         *
         * For example, if there are two `ResultList` components in the page, one with its `layout` set to `list` and the
         * other with the same option set to `card`, then the `ResultLayout` component will render two buttons respectively
         * entitled **List** and **Card**.
         *
         * See the [`ValidLayout`]{@link ValidLayout} type for the list of possible values.
         *
         * Default value is `list`.
         */
        layout: ComponentOptions_1.ComponentOptions.buildStringOption({
            defaultValue: 'list',
            required: true
        })
    };
    ResultList.resultCurrentlyBeingRendered = null;
    ResultList.MAX_AMOUNT_OF_SUCESSIVE_REQUESTS = 5;
    return ResultList;
}(Component_1.Component));
exports.ResultList = ResultList;
Initialization_1.Initialization.registerAutoCreateComponent(ResultList);


/***/ })

});
//# sourceMappingURL=ResultList__7adec7eb6144877a5629.js.map