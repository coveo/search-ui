webpackJsonpCoveo__temporary([61],{

/***/ 275:
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
__webpack_require__(662);
var _ = __webpack_require__(0);
var GlobalExports_1 = __webpack_require__(3);
var Assert_1 = __webpack_require__(5);
var QueryStateModel_1 = __webpack_require__(13);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var KeyboardUtils_1 = __webpack_require__(25);
var StringUtils_1 = __webpack_require__(22);
var SVGDom_1 = __webpack_require__(16);
var SVGIcons_1 = __webpack_require__(12);
var Utils_1 = __webpack_require__(4);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
/**
 * The ResultTagging component lists the current tag field values of its associated result and renders a control that
 * allows the end user to add values to a tag field.
 *
 * This component is a result template component (see [Result Templates](https://docs.coveo.com/en/413/)).
 *
 * **Note:**
 * > The ResultTagging component is not supported with Coveo Cloud V2. To implement the ResultTagging component in Coveo Cloud V1, contact [Coveo Support](https://support.coveo.com/s/).
 *
 * @notSupportedIn salesforcefree
 */
var ResultTagging = /** @class */ (function (_super) {
    __extends(ResultTagging, _super);
    /**
     * Creates a new ResultTagging component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the ResultTagging component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function ResultTagging(element, options, bindings, result) {
        var _this = _super.call(this, element, ResultTagging.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultTagging, options);
        _this.result = result || _this.resolveResult();
        Assert_1.Assert.exists(_this.componentOptionsModel);
        Assert_1.Assert.exists(_this.result);
        if (!_this.options.field) {
            _this.logger.error('You must specify a field to the ResultTagging component');
            return _this;
        }
        var fieldValue = Utils_1.Utils.getFieldValue(_this.result, _this.options.field);
        if (fieldValue && Utils_1.Utils.isNonEmptyString(fieldValue)) {
            _this.tags = fieldValue.split(';');
        }
        else if (fieldValue && Utils_1.Utils.isNonEmptyArray(fieldValue)) {
            _this.tags = fieldValue;
        }
        else {
            _this.tags = [];
        }
        _this.tags = _.map(_this.tags, function (t) {
            return t.trim();
        });
        _this.tagZone = Dom_1.$$('div', {
            className: 'coveo-result-tagging-tag-zone'
        }).el;
        element.appendChild(_this.tagZone);
        element.appendChild(_this.buildTagIcon());
        _this.autoCompleteZone = Dom_1.$$('div', {
            className: 'coveo-result-tagging-auto-complete-zone'
        }).el;
        element.appendChild(_this.autoCompleteZone);
        _this.autoCompleteZone.appendChild(_this.buildTextBox());
        _this.autoCompleteZone.appendChild(_this.buildAddIcon());
        _this.autoCompleteZone.appendChild(_this.buildClearIcon());
        _this.buildExistingTags();
        return _this;
    }
    ResultTagging.prototype.buildExistingTags = function () {
        var _this = this;
        if (this.tags) {
            _.each(this.tags, function (tag) {
                _this.tagZone.appendChild(_this.buildTagValue(tag));
            });
        }
    };
    ResultTagging.prototype.buildTagIcon = function () {
        var _this = this;
        var tagZone = Dom_1.$$('div', {
            className: 'coveo-result-tagging-add-tag'
        });
        var tagTextBox = Dom_1.$$('span', {
            className: 'coveo-result-tagging-add-tag-text'
        });
        tagTextBox.text(Strings_1.l('EnterTag'));
        var tagIcon = Dom_1.$$('span', {
            className: 'coveo-result-tagging-add-tag-icon'
        });
        tagIcon.on('click', function () {
            _.defer(function () {
                _this.focusOnTextBox();
            }, 20);
        });
        tagZone.el.appendChild(tagIcon.el);
        tagZone.append(tagTextBox.el);
        tagZone.setAttribute('title', Strings_1.l('EnterTag'));
        return tagZone.el;
    };
    ResultTagging.prototype.focusOnTextBox = function () {
        this.textBox.focus();
    };
    ResultTagging.prototype.buildTagValue = function (tagValue) {
        var _this = this;
        var tag = Dom_1.$$('div', {
            className: 'coveo-result-tagging-coveo-tag'
        });
        tag.el.appendChild(this.buildShortenedTagWithTitle(tagValue));
        var deleteIcon = Dom_1.$$('span', {
            className: 'coveo-result-tagging-delete-icon'
        }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore);
        SVGDom_1.SVGDom.addClassToSVGInContainer(deleteIcon.el, 'coveo-result-tagging-delete-icon-svg');
        tag.el.appendChild(deleteIcon.el);
        deleteIcon.on('click', function () {
            _this.doRemoveTag(tag.el, tagValue.toLowerCase());
        });
        return tag.el;
    };
    ResultTagging.prototype.buildShortenedTagWithTitle = function (tagValue) {
        var shortenedTag = StringUtils_1.StringUtils.removeMiddle(tagValue, 16, '...');
        var clickableValue = Dom_1.$$('a', {
            title: tagValue,
            href: 'javascript:void(0);'
        });
        clickableValue.text(shortenedTag);
        this.bindFacetEventOnValue(clickableValue.el, tagValue);
        return clickableValue.el;
    };
    ResultTagging.prototype.buildTextBox = function () {
        var _this = this;
        this.textBox = Dom_1.$$('input', {
            type: 'text',
            className: 'coveo-add-tag-textbox',
            placeholder: Strings_1.l('EnterTag')
        }).el;
        this.autoCompletePopup = Dom_1.$$('div', {
            className: ResultTagging.autoCompleteClass
        }).el;
        this.autoCompleteZone.appendChild(this.autoCompletePopup);
        this.manageAutocompleteAutoHide();
        Dom_1.$$(this.textBox).on('keyup', function (e) {
            if (e.keyCode == KeyboardUtils_1.KEYBOARD.UP_ARROW || e.keyCode == KeyboardUtils_1.KEYBOARD.DOWN_ARROW || e.keyCode == KeyboardUtils_1.KEYBOARD.ENTER) {
                _this.manageUpDownEnter(e.keyCode);
            }
            else if (!KeyboardUtils_1.KeyboardUtils.isArrowKeyPushed(e.keyCode)) {
                _this.populateSuggestions();
            }
            Dom_1.$$(_this.element).removeClass('coveo-error');
        });
        Dom_1.$$(this.textBox).on('click', function () {
            _this.populateSuggestions();
        });
        return this.textBox;
    };
    ResultTagging.prototype.buildAddIcon = function () {
        var _this = this;
        var icon = Dom_1.$$('div', {
            className: 'coveo-result-tagging-add-tag-tick-icon'
        }, SVGIcons_1.SVGIcons.icons.taggingOk);
        SVGDom_1.SVGDom.addClassToSVGInContainer(icon.el, 'coveo-result-tagging-add-tag-tick-icon-svg');
        var clickable = Dom_1.$$('span');
        clickable.on('click', function () {
            _this.doAddTag();
        });
        icon.el.appendChild(clickable.el);
        return icon.el;
    };
    ResultTagging.prototype.buildClearIcon = function () {
        var _this = this;
        var icon = Dom_1.$$('div', {
            className: 'coveo-result-tagging-clear-icon'
        }, SVGIcons_1.SVGIcons.icons.checkboxHookExclusionMore);
        SVGDom_1.SVGDom.addClassToSVGInContainer(icon.el, 'coveo-result-tagging-clear-icon-svg');
        var clickable = Dom_1.$$('span');
        clickable.on('click', function () {
            _this.textBox.value = '';
        });
        icon.el.appendChild(clickable.el);
        return icon.el;
    };
    ResultTagging.prototype.bindFacetEventOnValue = function (element, value) {
        var _this = this;
        var facetAttributeName = QueryStateModel_1.QueryStateModel.getFacetId(this.options.field);
        var facetModel = this.queryStateModel.get(facetAttributeName);
        var facets = this.componentStateModel.get(facetAttributeName);
        var atLeastOneFacetIsEnabled = _.filter(facets, function (value) { return !value.disabled; }).length > 0;
        if (facetModel != null && atLeastOneFacetIsEnabled) {
            Dom_1.$$(element).on('click', function () {
                if (_.contains(facetModel, value)) {
                    _this.queryStateModel.set(facetAttributeName, _.without(facetModel, value));
                }
                else {
                    _this.queryStateModel.set(facetAttributeName, _.union(facetModel, [value]));
                }
                _this.queryController.deferExecuteQuery({
                    beforeExecuteQuery: function () {
                        return _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.documentTag, {
                            facetId: _this.options.field,
                            facetField: _this.options.field,
                            facetValue: value
                        });
                    }
                });
            });
            if (_.contains(facetModel, value)) {
                Dom_1.$$(element).addClass('coveo-selected');
            }
            Dom_1.$$(element).addClass('coveo-clickable');
        }
    };
    ResultTagging.prototype.clearPopup = function () {
        Dom_1.$$(this.autoCompletePopup).hide();
        Dom_1.$$(this.autoCompletePopup).empty();
    };
    ResultTagging.prototype.showPopup = function () {
        Dom_1.$$(this.autoCompletePopup).show();
    };
    ResultTagging.prototype.populateSuggestions = function () {
        var _this = this;
        var endpoint = this.queryController.getEndpoint();
        var searchText = this.textBox.value;
        var searchOptions = {
            field: this.options.field,
            ignoreAccents: true,
            sortCriteria: 'occurences',
            maximumNumberOfValues: this.options.suggestBoxSize,
            queryOverride: '@uri',
            pattern: this.buildRegEx(searchText),
            patternType: 'RegularExpression'
        };
        endpoint.listFieldValues(searchOptions).then(function (fieldValues) {
            _this.clearPopup();
            _.each(fieldValues, function (fieldValue) {
                _this.autoCompletePopup.appendChild(_this.buildSelectableValue(fieldValue.lookupValue));
            });
            _this.showPopup();
            _this.autoCompletePopup.style.width = _this.textBox.offsetWidth + ' px';
        });
    };
    ResultTagging.prototype.manageAutocompleteAutoHide = function () {
        var _this = this;
        var timeout;
        Dom_1.$$(this.textBox).on('mouseover', function () {
            clearTimeout(timeout);
        });
        Dom_1.$$(this.autoCompletePopup).on('mouseout', function (e) {
            if (Dom_1.$$(e.target).hasClass(ResultTagging.autoCompleteClass)) {
                timeout = setTimeout(function () {
                    _this.clearPopup();
                }, _this.options.autoCompleteTimer);
            }
        });
        Dom_1.$$(this.autoCompletePopup).on('mouseenter', function () {
            clearTimeout(timeout);
        });
        Dom_1.$$(this.element).on('mouseenter', function () {
            _this.clearPopup();
            Dom_1.$$(_this.element).addClass('coveo-opened');
        });
        Dom_1.$$(Dom_1.$$(this.element).closest('.CoveoResult')).on('mouseleave', function () {
            _this.clearPopup();
            if (_this.textBox.value == '') {
                Dom_1.$$(_this.element).removeClass('coveo-opened');
            }
        });
        Dom_1.$$(Dom_1.$$(this.element).closest('.CoveoResult')).on('focusout', function (e) {
            if (_this.textBox.value != '' && Dom_1.$$(e.target).closest('.CoveoResult') != Dom_1.$$(_this.element).closest('.CoveoResult')) {
                Dom_1.$$(_this.element).addClass('coveo-error');
            }
        });
        Dom_1.$$(Dom_1.$$(this.element).closest('.CoveoResult')).on('focusin', function () {
            Dom_1.$$(_this.element).removeClass('coveo-error');
        });
    };
    // Exclude tags that are already on the result (Since we can tag with the same value twice.
    ResultTagging.prototype.buildRegEx = function (searchTerm) {
        var _this = this;
        return '(?=.*' + searchTerm + ')' + _.map(this.tags, function (tag) { return _this.buildTermToExclude(tag); }).join('') + '.*';
    };
    ResultTagging.prototype.buildTermToExclude = function (term) {
        return '(?!^' + term + '$)';
    };
    ResultTagging.prototype.manageUpDownEnter = function (code) {
        var selectableArray = Dom_1.$$(this.element).findAll('.coveo-selectable');
        if (code == KeyboardUtils_1.KEYBOARD.ENTER) {
            this.doAddTag();
            return;
        }
        if (selectableArray.length > 0) {
            var newIndex = this.computeNextIndex(code, selectableArray);
            newIndex = Math.max(0, newIndex);
            newIndex = Math.min(selectableArray.length - 1, newIndex);
            var selected = Dom_1.$$(selectableArray[newIndex]);
            selected.addClass('coveo-selected');
            this.textBox.value = selected.text();
        }
    };
    ResultTagging.prototype.computeNextIndex = function (code, selectableArray) {
        var nextIndex = 0;
        _.each(selectableArray, function (selectable, index) {
            if (Dom_1.$$(selectable).hasClass('coveo-selected')) {
                if (code == KeyboardUtils_1.KEYBOARD.UP_ARROW) {
                    nextIndex = index - 1;
                }
                else if (code == KeyboardUtils_1.KEYBOARD.DOWN_ARROW) {
                    nextIndex = index + 1;
                }
                Dom_1.$$(selectable).removeClass('coveo-selected');
            }
        });
        return nextIndex;
    };
    ResultTagging.prototype.buildSelectableValue = function (lookupValue) {
        var _this = this;
        var line = Dom_1.$$('div', {
            className: 'coveo-selectable'
        });
        line.el.appendChild(this.buildShortenedTagWithTitle(lookupValue));
        line.on('click', function () {
            _this.doAddTagWithValue(lookupValue);
        });
        return line.el;
    };
    ResultTagging.prototype.doRemoveTag = function (element, tagValue) {
        var _this = this;
        var request = {
            fieldName: this.options.field,
            fieldValue: tagValue,
            doAdd: false,
            uniqueId: this.result.uniqueId
        };
        this.queryController
            .getEndpoint()
            .tagDocument(request)
            .then(function () {
            _this.tags.splice(_.indexOf(_this.tags, tagValue), 1);
            Dom_1.$$(element).detach();
        });
    };
    ResultTagging.prototype.doAddTagWithValue = function (tagValue) {
        var _this = this;
        _.each(tagValue.split(','), function (tag) {
            _this.doAddSingleTagValue(tag);
        });
    };
    ResultTagging.prototype.doAddSingleTagValue = function (tagValue) {
        var _this = this;
        this.clearPopup();
        if (_.indexOf(this.tags, tagValue) > -1) {
            Dom_1.$$(this.element).addClass('coveo-error');
            return;
        }
        this.tags.push(tagValue);
        var request = {
            fieldName: this.options.field,
            fieldValue: tagValue,
            doAdd: true,
            uniqueId: this.result.uniqueId
        };
        this.queryController
            .getEndpoint()
            .tagDocument(request)
            .then(function () {
            _this.tagZone.appendChild(_this.buildTagValue(tagValue));
            _this.textBox.value = '';
            Dom_1.$$(_this.element).removeClass('coveo-error');
        })
            .catch(function () {
            // We do this otherwise it's possible to add the same tag while we wait for the server's response
            _this.tags = _.without(_this.tags, _.findWhere(_this.tags, tagValue));
        });
    };
    ResultTagging.prototype.doAddTag = function () {
        var tagValue = Utils_1.Utils.trim(this.textBox.value.toLowerCase());
        this.doAddTagWithValue(tagValue);
    };
    ResultTagging.ID = 'ResultTagging';
    ResultTagging.autoCompleteClass = 'coveo-result-tagging-auto-complete';
    ResultTagging.doExport = function () {
        GlobalExports_1.exportGlobally({
            ResultTagging: ResultTagging
        });
    };
    /**
     * @componentOptions
     */
    ResultTagging.options = {
        /**
         * Specifies the tag field that the component will use.
         *
         * Specifying a value for this options is necessary for this component to work.
         */
        field: ComponentOptions_1.ComponentOptions.buildFieldOption({
            match: function (field) { return field.type == 'Tag'; },
            required: true
        }),
        /**
         * Specifies the number of items to show in the list of suggested items.
         *
         * Default value is `5`. Minimum value is `0 `.
         */
        suggestBoxSize: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 0 }),
        /**
         * Specifies how much time (in milliseconds) it takes for the list of suggested items to disappear when it loses
         * focus.
         *
         * Default value is `2000`. Minimum value is `0`.
         */
        autoCompleteTimer: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 2000, min: 0 })
    };
    ResultTagging.AUTO_COMPLETE_CLASS = 'coveo-result-tagging-auto-complete';
    return ResultTagging;
}(Component_1.Component));
exports.ResultTagging = ResultTagging;
Initialization_1.Initialization.registerAutoCreateComponent(ResultTagging);


/***/ }),

/***/ 662:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=ResultTagging__b6f3a40b26ad27101c27.js.map