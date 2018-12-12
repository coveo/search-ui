webpackJsonpCoveo__temporary([7],{

/***/ 126:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ExpressionRef_1 = __webpack_require__(343);
var ExpressionOptions_1 = __webpack_require__(341);
var ExpressionRegExp_1 = __webpack_require__(345);
var _ = __webpack_require__(0);
var ExpressionFunction_1 = __webpack_require__(339);
var ExpressionConstant_1 = __webpack_require__(157);
var ExpressionList_1 = __webpack_require__(340);
var Grammar = /** @class */ (function () {
    function Grammar(start, expressions) {
        if (expressions === void 0) { expressions = {}; }
        this.expressions = {};
        this.start = new ExpressionRef_1.ExpressionRef(start, null, 'start', this);
        this.addExpressions(expressions);
    }
    Grammar.prototype.addExpressions = function (expressions) {
        var _this = this;
        _.each(expressions, function (basicExpression, id) {
            _this.addExpression(id, basicExpression);
        });
    };
    Grammar.prototype.addExpression = function (id, basicExpression) {
        if (id in this.expressions) {
            throw new Error('Grammar already contain the id:' + id);
        }
        this.expressions[id] = Grammar.buildExpression(basicExpression, id, this);
    };
    Grammar.prototype.getExpression = function (id) {
        return this.expressions[id];
    };
    Grammar.prototype.parse = function (value) {
        return this.start.parse(value, true);
    };
    Grammar.buildExpression = function (value, id, grammar) {
        var type = typeof value;
        if (type == 'undefined') {
            throw new Error('Invalid Expression: ' + value);
        }
        if (_.isString(value)) {
            return this.buildStringExpression(value, id, grammar);
        }
        if (_.isArray(value)) {
            return new ExpressionOptions_1.ExpressionOptions(_.map(value, function (v, i) { return new ExpressionRef_1.ExpressionRef(v, null, id + '_' + i, grammar); }), id);
        }
        if (_.isRegExp(value)) {
            return new ExpressionRegExp_1.ExpressionRegExp(value, id, grammar);
        }
        if (_.isFunction(value)) {
            return new ExpressionFunction_1.ExpressionFunction(value, id, grammar);
        }
        throw new Error('Invalid Expression: ' + value);
    };
    Grammar.buildStringExpression = function (value, id, grammar) {
        var matchs = Grammar.stringMatch(value, Grammar.spliter);
        var expressions = _.map(matchs, function (match, i) {
            if (match[1]) {
                // Ref
                var ref = match[1];
                var occurrence = match[3] ? Number(match[3]) : match[2] || null;
                return new ExpressionRef_1.ExpressionRef(ref, occurrence, id + '_' + i, grammar);
            }
            else {
                // Constant
                return new ExpressionConstant_1.ExpressionConstant(match[4], id + '_' + i);
            }
        });
        if (expressions.length == 1) {
            var expression = expressions[0];
            expression.id = id;
            return expression;
        }
        else {
            return new ExpressionList_1.ExpressionList(expressions, id);
        }
    };
    Grammar.stringMatch = function (str, re) {
        var groups = [];
        var cloneRegExp = new RegExp(re.source, 'g');
        var group = cloneRegExp.exec(str);
        while (group !== null) {
            groups.push(group);
            group = cloneRegExp.exec(str);
        }
        return groups;
    };
    Grammar.spliter = /\[(\w+)(\*|\+|\?|\{([1-9][0-9]*)\})?\]|(.[^\[]*)/;
    return Grammar;
}());
exports.Grammar = Grammar;


/***/ }),

/***/ 157:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(40);
var Result_2 = __webpack_require__(40);
var ExpressionConstant = /** @class */ (function () {
    function ExpressionConstant(value, id) {
        this.value = value;
        this.id = id;
    }
    ExpressionConstant.prototype.parse = function (input, end) {
        // the value must be at the start of the input
        var success = input.indexOf(this.value) == 0;
        var result = new Result_1.Result(success ? this.value : null, this, input);
        // if is successful and we require the end but the length of parsed is
        // lower than the input length, return a EndOfInputExpected Result
        if (success && end && input.length > this.value.length) {
            return new Result_2.EndOfInputResult(result);
        }
        return result;
    };
    ExpressionConstant.prototype.toString = function () {
        return this.value;
    };
    return ExpressionConstant;
}());
exports.ExpressionConstant = ExpressionConstant;


/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionEndOfInput = {
    id: 'end of input',
    parse: null
};


/***/ }),

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Basic_1 = __webpack_require__(93);
var Date_1 = __webpack_require__(347);
exports.Field = {
    basicExpressions: ['FieldSimpleQuery', 'FieldQuery', 'Field'],
    grammars: {
        FieldQuery: '[Field][OptionalSpaces][FieldQueryOperation]',
        FieldQueryOperation: ['FieldQueryValue', 'FieldQueryNumeric'],
        FieldQueryValue: '[FieldOperator][OptionalSpaces][FieldValue]',
        FieldQueryNumeric: '[FieldOperatorNumeric][OptionalSpaces][FieldValueNumeric]',
        FieldSimpleQuery: '[FieldName]:[OptionalSpaces][FieldValue]',
        Field: '@[FieldName]',
        FieldName: /[a-zA-Z][a-zA-Z0-9\.\_]*/,
        FieldOperator: /==|=|<>/,
        FieldOperatorNumeric: /<=|>=|<|>/,
        FieldValue: ['DateRange', 'NumberRange', 'DateRelative', 'Date', 'Number', 'FieldValueList', 'FieldValueString'],
        FieldValueNumeric: ['DateRelative', 'Date', 'Number'],
        FieldValueString: ['DoubleQuoted', 'FieldValueNotQuoted'],
        FieldValueList: '([FieldValueString][FieldValueStringList*])',
        FieldValueStringList: '[FieldValueSeparator][FieldValueString]',
        FieldValueSeparator: / *, */,
        FieldValueNotQuoted: /[^ \(\),]+/,
        NumberRange: '[Number][Spaces?]..[Spaces?][Number]'
    },
    include: [Date_1.Date, Basic_1.Basic]
};


/***/ }),

/***/ 161:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var doMagicBoxExport_1 = __webpack_require__(380);
var SuggestionsManager_1 = __webpack_require__(351);
var InputManager_1 = __webpack_require__(350);
var underscore_1 = __webpack_require__(0);
var MagicBoxClear_1 = __webpack_require__(382);
var MagicBoxInstance = /** @class */ (function () {
    function MagicBoxInstance(element, grammar, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.element = element;
        this.grammar = grammar;
        this.options = options;
        this.lastSuggestions = [];
        if (underscore_1.isUndefined(this.options.inline)) {
            this.options.inline = false;
        }
        Dom_1.$$(element).addClass('magic-box');
        if (this.options.inline) {
            Dom_1.$$(element).addClass('magic-box-inline');
        }
        Dom_1.$$(this.element).setAttribute('role', 'combobox');
        this.result = this.grammar.parse('');
        this.displayedResult = this.result.clean();
        var inputContainer = Dom_1.$$(element).find('.magic-box-input');
        if (!inputContainer) {
            inputContainer = document.createElement('div');
            inputContainer.className = 'magic-box-input';
            element.appendChild(inputContainer);
        }
        this.inputManager = new InputManager_1.InputManager(inputContainer, function (text, wordCompletion) {
            if (!wordCompletion) {
                _this.setText(text);
                _this.showSuggestion();
                _this.onchange && _this.onchange();
            }
            else {
                _this.setText(text);
                _this.onselect && _this.onselect(_this.getFirstSuggestionText());
            }
        }, this);
        this.inputManager.ontabpress = function () {
            _this.ontabpress && _this.ontabpress();
        };
        var existingValue = this.inputManager.getValue();
        if (existingValue) {
            this.displayedResult.input = existingValue;
        }
        this.inputManager.setResult(this.displayedResult);
        var suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'magic-box-suggestions';
        this.element.appendChild(suggestionsContainer);
        this.suggestionsManager = new SuggestionsManager_1.SuggestionsManager(suggestionsContainer, this.element, this.inputManager, {
            selectableClass: this.options.selectableSuggestionClass,
            selectedClass: this.options.selectedSuggestionClass,
            timeout: this.options.suggestionTimeout
        });
        this.magicBoxClear = new MagicBoxClear_1.MagicBoxClear(this);
        this.setupHandler();
    }
    MagicBoxInstance.prototype.getResult = function () {
        return this.result;
    };
    MagicBoxInstance.prototype.getDisplayedResult = function () {
        return this.displayedResult;
    };
    MagicBoxInstance.prototype.setText = function (text) {
        Dom_1.$$(this.element).toggleClass('magic-box-notEmpty', text.length > 0);
        this.magicBoxClear.toggleTabindex(text.length > 0);
        this.result = this.grammar.parse(text);
        this.displayedResult = this.result.clean();
        this.inputManager.setResult(this.displayedResult);
    };
    MagicBoxInstance.prototype.setCursor = function (index) {
        this.inputManager.setCursor(index);
    };
    MagicBoxInstance.prototype.getCursor = function () {
        return this.inputManager.getCursor();
    };
    MagicBoxInstance.prototype.resultAtCursor = function (match) {
        return this.displayedResult.resultAt(this.getCursor(), match);
    };
    MagicBoxInstance.prototype.setupHandler = function () {
        var _this = this;
        this.inputManager.onblur = function () {
            Dom_1.$$(_this.element).removeClass('magic-box-hasFocus');
            _this.onblur && _this.onblur();
            if (!_this.options.inline) {
                _this.clearSuggestion();
            }
        };
        this.inputManager.onfocus = function () {
            Dom_1.$$(_this.element).addClass('magic-box-hasFocus');
            _this.showSuggestion();
            _this.onfocus && _this.onfocus();
        };
        this.inputManager.onkeydown = function (key) {
            if (key == 38 || key == 40) {
                // Up, Down
                return false;
            }
            if (key == 13) {
                // Enter
                var suggestion = _this.suggestionsManager.selectAndReturnKeyboardFocusedElement();
                if (suggestion == null) {
                    _this.onsubmit && _this.onsubmit();
                }
                return false;
            }
            else if (key == 27) {
                // ESC
                _this.clearSuggestion();
                _this.blur();
            }
            return true;
        };
        this.inputManager.onchangecursor = function () {
            _this.showSuggestion();
        };
        this.inputManager.onkeyup = function (key) {
            if (key == 38) {
                // Up
                _this.onmove && _this.onmove();
                _this.focusOnSuggestion(_this.suggestionsManager.moveUp());
                _this.onchange && _this.onchange();
            }
            else if (key == 40) {
                // Down
                _this.onmove && _this.onmove();
                _this.focusOnSuggestion(_this.suggestionsManager.moveDown());
                _this.onchange && _this.onchange();
            }
            else {
                return true;
            }
            return false;
        };
    };
    MagicBoxInstance.prototype.showSuggestion = function () {
        var _this = this;
        this.suggestionsManager.mergeSuggestions(this.getSuggestions != null ? this.getSuggestions() : [], function (suggestions) {
            _this.updateSuggestion(suggestions);
        });
    };
    MagicBoxInstance.prototype.updateSuggestion = function (suggestions) {
        var _this = this;
        this.lastSuggestions = suggestions;
        var firstSuggestion = this.getFirstSuggestionText();
        this.inputManager.setWordCompletion(firstSuggestion && firstSuggestion.text);
        this.onsuggestions && this.onsuggestions(suggestions);
        underscore_1.each(suggestions, function (suggestion) {
            if (suggestion.onSelect == null && suggestion.text != null) {
                suggestion.onSelect = function () {
                    _this.setText(suggestion.text);
                    _this.onselect && _this.onselect(suggestion);
                };
            }
        });
    };
    MagicBoxInstance.prototype.focus = function () {
        Dom_1.$$(this.element).addClass('magic-box-hasFocus');
        this.inputManager.focus();
    };
    MagicBoxInstance.prototype.blur = function () {
        this.inputManager.blur();
    };
    MagicBoxInstance.prototype.clearSuggestion = function () {
        var _this = this;
        this.suggestionsManager.mergeSuggestions([], function (suggestions) {
            _this.updateSuggestion(suggestions);
        });
        this.inputManager.setWordCompletion(null);
    };
    MagicBoxInstance.prototype.focusOnSuggestion = function (suggestion) {
        if (suggestion == null || suggestion.text == null) {
            suggestion = this.getFirstSuggestionText();
            this.inputManager.setResult(this.displayedResult, suggestion && suggestion.text);
        }
        else {
            this.inputManager.setResult(this.grammar.parse(suggestion.text).clean(), suggestion.text);
        }
    };
    MagicBoxInstance.prototype.getFirstSuggestionText = function () {
        return underscore_1.find(this.lastSuggestions, function (suggestion) { return suggestion.text != null; });
    };
    MagicBoxInstance.prototype.getText = function () {
        return this.inputManager.getValue();
    };
    MagicBoxInstance.prototype.getWordCompletion = function () {
        return this.inputManager.getWordCompletion();
    };
    MagicBoxInstance.prototype.clear = function () {
        this.setText('');
        this.showSuggestion();
        this.focus();
        this.onclear && this.onclear();
    };
    MagicBoxInstance.prototype.hasSuggestions = function () {
        return this.suggestionsManager.hasSuggestions;
    };
    return MagicBoxInstance;
}());
exports.MagicBoxInstance = MagicBoxInstance;
function createMagicBox(element, grammar, options) {
    return new MagicBoxInstance(element, grammar, options);
}
exports.createMagicBox = createMagicBox;
function requestAnimationFrame(callback) {
    if ('requestAnimationFrame' in window) {
        return window.requestAnimationFrame(callback);
    }
    return setTimeout(callback);
}
exports.requestAnimationFrame = requestAnimationFrame;
doMagicBoxExport_1.doMagicBoxExport();


/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var MagicBoxUtils = /** @class */ (function () {
    function MagicBoxUtils() {
    }
    MagicBoxUtils.escapeRegExp = function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    };
    MagicBoxUtils.highlightText = function (text, highligth, ignoreCase, matchClass, doNotMatchClass) {
        var _this = this;
        if (ignoreCase === void 0) { ignoreCase = false; }
        if (matchClass === void 0) { matchClass = 'magic-box-hightlight'; }
        if (doNotMatchClass === void 0) { doNotMatchClass = ''; }
        if (highligth.length == 0) {
            return text;
        }
        var escaped = this.escapeRegExp(highligth);
        var stringRegex = '(' + escaped + ')|(.*?(?=' + escaped + ')|.+)';
        var regex = new RegExp(stringRegex, ignoreCase ? 'gi' : 'g');
        return text.replace(regex, function (text, match, notmatch) { return _this.escapeText(match != null ? matchClass : doNotMatchClass, text); });
    };
    MagicBoxUtils.escapeText = function (classname, text) {
        return "<span class=\"" + classname + "\">" + _.escape(text) + "</span>";
    };
    return MagicBoxUtils;
}());
exports.MagicBoxUtils = MagicBoxUtils;


/***/ }),

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __webpack_require__(11);
var KeyboardUtils_1 = __webpack_require__(29);
var Dom_1 = __webpack_require__(1);
__webpack_require__(367);
var AccessibleButton = /** @class */ (function () {
    function AccessibleButton() {
        this.logger = new Logger_1.Logger(this);
    }
    AccessibleButton.prototype.withOwner = function (owner) {
        this.eventOwner = owner;
        return this;
    };
    AccessibleButton.prototype.withElement = function (element) {
        if (element instanceof HTMLElement) {
            this.element = Dom_1.$$(element);
        }
        else {
            this.element = element;
        }
        return this;
    };
    AccessibleButton.prototype.withLabel = function (label) {
        this.label = label;
        return this;
    };
    AccessibleButton.prototype.withTitle = function (title) {
        this.title = title;
        return this;
    };
    AccessibleButton.prototype.withSelectAction = function (action) {
        this.clickAction = action;
        this.enterKeyboardAction = action;
        return this;
    };
    AccessibleButton.prototype.withClickAction = function (clickAction) {
        this.clickAction = clickAction;
        return this;
    };
    AccessibleButton.prototype.withEnterKeyboardAction = function (enterAction) {
        this.enterKeyboardAction = enterAction;
        return this;
    };
    AccessibleButton.prototype.withFocusAndMouseEnterAction = function (action) {
        this.focusAction = action;
        this.mouseenterAction = action;
        return this;
    };
    AccessibleButton.prototype.withFocusAction = function (action) {
        this.focusAction = action;
        return this;
    };
    AccessibleButton.prototype.withMouseEnterAction = function (action) {
        this.mouseenterAction = action;
        return this;
    };
    AccessibleButton.prototype.withBlurAndMouseLeaveAction = function (action) {
        this.mouseleaveAction = action;
        this.blurAction = action;
        return this;
    };
    AccessibleButton.prototype.withMouseLeaveAction = function (action) {
        this.mouseleaveAction = action;
        return this;
    };
    AccessibleButton.prototype.withBlurAction = function (action) {
        this.blurAction = action;
        return this;
    };
    AccessibleButton.prototype.build = function () {
        if (!this.element) {
            this.element = Dom_1.$$('div');
        }
        this.ensureCorrectRole();
        this.ensureCorrectLabel();
        this.ensureTitle();
        this.ensureSelectAction();
        this.ensureUnselectAction();
        this.ensureMouseenterAndFocusAction();
        this.ensureMouseleaveAndBlurAction();
        this.ensureDifferentiationBetweenKeyboardAndMouseFocus();
        return this;
    };
    AccessibleButton.prototype.ensureDifferentiationBetweenKeyboardAndMouseFocus = function () {
        var _this = this;
        var classOnPress = 'coveo-accessible-button-pressed';
        var classOnFocus = 'coveo-accessible-button-focused';
        Dom_1.$$(this.element).addClass('coveo-accessible-button');
        Dom_1.$$(this.element).on('mousedown', function () {
            Dom_1.$$(_this.element).addClass(classOnPress);
            Dom_1.$$(_this.element).removeClass(classOnFocus);
        });
        Dom_1.$$(this.element).on('mouseup', function () { return Dom_1.$$(_this.element).removeClass(classOnPress); });
        Dom_1.$$(this.element).on('focus', function () {
            if (!Dom_1.$$(_this.element).hasClass(classOnPress)) {
                Dom_1.$$(_this.element).addClass(classOnFocus);
            }
        });
        Dom_1.$$(this.element).on('blur', function () { return Dom_1.$$(_this.element).removeClass(classOnFocus); });
    };
    AccessibleButton.prototype.ensureCorrectRole = function () {
        if (!this.element.getAttribute('role')) {
            this.element.setAttribute('role', 'button');
        }
    };
    AccessibleButton.prototype.ensureCorrectLabel = function () {
        if (!this.label) {
            this.logger.error("Missing label to create an accessible button !");
            return;
        }
        this.element.setAttribute('aria-label', this.label);
    };
    AccessibleButton.prototype.ensureTitle = function () {
        this.title && this.element.setAttribute('title', this.title);
    };
    AccessibleButton.prototype.ensureTabIndex = function () {
        this.element.setAttribute('tabindex', '0');
    };
    AccessibleButton.prototype.ensureSelectAction = function () {
        var _this = this;
        if (this.enterKeyboardAction) {
            this.ensureTabIndex();
            this.bindEvent('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, function (e) { return _this.enterKeyboardAction(e); }));
        }
        if (this.clickAction) {
            this.bindEvent('click', this.clickAction);
        }
    };
    AccessibleButton.prototype.ensureUnselectAction = function () {
        if (this.blurAction) {
            this.bindEvent('blur', this.blurAction);
        }
        if (this.mouseleaveAction) {
            this.bindEvent('mouseleave', this.mouseleaveAction);
        }
    };
    AccessibleButton.prototype.ensureMouseenterAndFocusAction = function () {
        if (this.mouseenterAction) {
            this.bindEvent('mouseenter', this.mouseenterAction);
        }
        if (this.focusAction) {
            this.bindEvent('focus', this.focusAction);
        }
    };
    AccessibleButton.prototype.ensureMouseleaveAndBlurAction = function () {
        if (this.mouseleaveAction) {
            this.bindEvent('mouseleave', this.mouseleaveAction);
        }
        if (this.blurAction) {
            this.bindEvent('blur', this.blurAction);
        }
    };
    AccessibleButton.prototype.bindEvent = function (event, action) {
        if (this.eventOwner) {
            this.eventOwner.on(this.element, event, action);
        }
        else {
            Dom_1.$$(this.element).on(event, action);
        }
    };
    return AccessibleButton;
}());
exports.AccessibleButton = AccessibleButton;


/***/ }),

/***/ 339:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ExpressionFunction = /** @class */ (function () {
    function ExpressionFunction(func, id, grammar) {
        this.func = func;
        this.id = id;
        this.grammar = grammar;
    }
    ExpressionFunction.prototype.parse = function (input, end) {
        return this.func(input, end, this);
    };
    ExpressionFunction.prototype.toString = function () {
        return this.id;
    };
    return ExpressionFunction;
}());
exports.ExpressionFunction = ExpressionFunction;


/***/ }),

/***/ 340:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(40);
var ExpressionList = /** @class */ (function () {
    function ExpressionList(parts, id) {
        this.parts = parts;
        this.id = id;
        if (parts.length == 0) {
            throw new Error(JSON.stringify(id) + ' should have at least 1 parts');
        }
    }
    ExpressionList.prototype.parse = function (input, end) {
        var subResults = [];
        var subResult;
        var subInput = input;
        for (var i = 0; i < this.parts.length; i++) {
            var part = this.parts[i];
            subResult = part.parse(subInput, end && i == this.parts.length - 1);
            subResults.push(subResult);
            // if the subResult do not succeed, stop the parsing
            if (!subResult.isSuccess()) {
                break;
            }
            else {
                subInput = subInput.substr(subResult.getLength());
            }
        }
        return new Result_1.Result(subResults, this, input);
    };
    ExpressionList.prototype.toString = function () {
        return this.id;
    };
    return ExpressionList;
}());
exports.ExpressionList = ExpressionList;


/***/ }),

/***/ 341:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var OptionResult_1 = __webpack_require__(342);
var ExpressionOptions = /** @class */ (function () {
    function ExpressionOptions(parts, id) {
        this.parts = parts;
        this.id = id;
    }
    ExpressionOptions.prototype.parse = function (input, end) {
        var failAttempt = [];
        for (var i = 0; i < this.parts.length; i++) {
            var subResult = this.parts[i].parse(input, end);
            if (subResult.isSuccess()) {
                return new OptionResult_1.OptionResult(subResult, this, input, failAttempt);
            }
            failAttempt.push(subResult);
        }
        return new OptionResult_1.OptionResult(null, this, input, failAttempt);
    };
    ExpressionOptions.prototype.toString = function () {
        return this.id;
    };
    return ExpressionOptions;
}());
exports.ExpressionOptions = ExpressionOptions;


/***/ }),

/***/ 342:
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
var Result_1 = __webpack_require__(40);
var _ = __webpack_require__(0);
var OptionResult = /** @class */ (function (_super) {
    __extends(OptionResult, _super);
    function OptionResult(result, expression, input, failAttempt) {
        var _this = _super.call(this, result != null ? [result] : null, expression, input) || this;
        _this.result = result;
        _this.expression = expression;
        _this.input = input;
        _this.failAttempt = failAttempt;
        _.forEach(_this.failAttempt, function (subResult) {
            subResult.parent = _this;
        });
        return _this;
    }
    /**
     * Return all fail result.
     */
    OptionResult.prototype.getExpect = function () {
        var _this = this;
        var expect = [];
        if (this.result != null) {
            expect = this.result.getExpect();
        }
        expect = _.reduce(this.failAttempt, function (expect, result) { return expect.concat(result.getExpect()); }, expect);
        if (expect.length > 0 && _.all(expect, function (result) { return result.input == _this.input; })) {
            return [this];
        }
        return expect;
    };
    /**
     * Clean the result to have the most relevant result. If the result is successful just return a clone of it.
     */
    OptionResult.prototype.clean = function (path) {
        if (path != null || !this.isSuccess()) {
            // Result will be a ref. We skip it for cleaner tree.
            path = _.rest(path || _.last(this.getBestExpect()).path(this));
            // next can be Result or one of the failAttempt. In both case we have only one child
            var next = _.first(path);
            if (next == null) {
                return new Result_1.Result(null, this.expression, this.input);
            }
            return new Result_1.Result([next.clean(_.rest(path))], this.expression, this.input);
        }
        // Result will be a ref. We skip it for cleaner tree.
        return new Result_1.Result(_.map(this.result.subResults, function (subResult) { return subResult.clean(); }), this.expression, this.input);
    };
    return OptionResult;
}(Result_1.Result));
exports.OptionResult = OptionResult;


/***/ }),

/***/ 343:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(40);
var RefResult_1 = __webpack_require__(344);
var ExpressionEndOfInput_1 = __webpack_require__(158);
var _ = __webpack_require__(0);
var ExpressionRef = /** @class */ (function () {
    function ExpressionRef(ref, occurrence, id, grammar) {
        this.ref = ref;
        this.occurrence = occurrence;
        this.id = id;
        this.grammar = grammar;
    }
    ExpressionRef.prototype.parse = function (input, end) {
        var ref = this.grammar.getExpression(this.ref);
        if (ref == null) {
            throw new Error('Expression not found:' + this.ref);
        }
        if (this.occurrence == '?' || this.occurrence == null) {
            return this.parseOnce(input, end, ref);
        }
        else {
            return this.parseMany(input, end, ref);
        }
    };
    ExpressionRef.prototype.parseOnce = function (input, end, ref) {
        var refResult = ref.parse(input, end);
        var success = refResult.isSuccess();
        if (!success && this.occurrence == '?') {
            if (end) {
                // if end was found
                if (input.length == 0) {
                    return new RefResult_1.RefResult([], this, input, refResult);
                }
                // if end was not found and all error expression are EndOfInput, reparse with end = false.
                if (_.all(refResult.getBestExpect(), function (expect) { return expect.expression == ExpressionEndOfInput_1.ExpressionEndOfInput; })) {
                    return new RefResult_1.RefResult([new Result_1.Result(null, ExpressionEndOfInput_1.ExpressionEndOfInput, input)], this, input, refResult);
                }
                return refResult;
            }
            // the ref is not required and it do not need to end the input
            return new RefResult_1.RefResult([], this, input, null);
        }
        return new RefResult_1.RefResult([refResult], this, input, success ? null : refResult);
    };
    ExpressionRef.prototype.parseMany = function (input, end, ref) {
        var subResults = [];
        var subResult;
        var subInput = input;
        var success;
        // try to parse until it do not match, do not manage the end yet
        do {
            subResult = ref.parse(subInput, false);
            success = subResult.isSuccess();
            if (success) {
                subResults.push(subResult);
                subInput = subInput.substr(subResult.getLength());
            }
        } while (success && subResult.input != subInput);
        // minimal occurance of a ref
        var requiredOccurance = _.isNumber(this.occurrence) ? this.occurrence : this.occurrence == '+' ? 1 : 0;
        // if the minimal occurance is not reached add the fail result to the list
        if (subResults.length < requiredOccurance) {
            subResults.push(subResult);
        }
        else if (end) {
            // if there is at least one match, check if the last match is at the end
            if (subResults.length > 0) {
                var last = _.last(subResults);
                subResult = ref.parse(last.input, true);
                if (subResult.isSuccess()) {
                    // if successful, replace the last subResult by the one with end
                    subResults[subResults.length - 1] = subResult;
                }
                else {
                    // if not successful, we keep the last successful result and we add a endOfInputExpected Result after it
                    subResults.push(new Result_1.Result(null, ExpressionEndOfInput_1.ExpressionEndOfInput, last.input.substr(last.getLength())));
                    // we parse back the last with the length of the successful Result (at the same place we put the endOfInputExpected) and put it in failAttempt
                    subResult = ref.parse(last.input.substr(last.getLength()), true);
                }
            }
            else if (input.length != 0) {
                // if there is no result at all and we are not at the end, return a endOfInputExpected Result
                var endOfInput = new Result_1.Result(null, ExpressionEndOfInput_1.ExpressionEndOfInput, input);
                return new RefResult_1.RefResult([endOfInput], this, input, subResult);
            }
        }
        return new RefResult_1.RefResult(subResults, this, input, subResult);
    };
    ExpressionRef.prototype.toString = function () {
        return this.id;
    };
    return ExpressionRef;
}());
exports.ExpressionRef = ExpressionRef;


/***/ }),

/***/ 344:
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
var Result_1 = __webpack_require__(40);
var _ = __webpack_require__(0);
var RefResult = /** @class */ (function (_super) {
    __extends(RefResult, _super);
    function RefResult(results, expression, input, lastResult) {
        var _this = _super.call(this, results, expression, input) || this;
        _this.expression = expression;
        _this.input = input;
        if (_.last(results) != lastResult) {
            _this.failAttempt = lastResult;
            if (_this.failAttempt != null) {
                _this.failAttempt.parent = _this;
            }
        }
        return _this;
    }
    /**
     * Return all fail result.
     */
    RefResult.prototype.getExpect = function () {
        var expect = _super.prototype.getExpect.call(this);
        // add the failAttempt to the expect
        if (this.failAttempt != null) {
            return expect.concat(this.failAttempt.getExpect());
        }
        return expect;
    };
    /**
     * Clean the result to have the most relevant result. If the result is successful just return a clone of it.
     */
    RefResult.prototype.clean = function (path) {
        // if there is no failAttempt, we will use the default clean
        if (this.failAttempt != null && (path != null || !this.isSuccess())) {
            path = path || _.last(this.getBestExpect()).path(this);
            var next = _.first(path);
            // if the next is in the subResults, not the failAttempt, do the default clean;
            if (next != null && next == this.failAttempt) {
                var last = _.last(this.subResults);
                // if the last is not successful, remove it because we want the failAttempt path
                var subResults = _.map(last != null && last.isSuccess() ? this.subResults : _.initial(this.subResults), function (subResult) {
                    return subResult.clean();
                });
                subResults.push(next.clean(_.rest(path)));
                return new Result_1.Result(subResults, this.expression, this.input);
            }
        }
        return _super.prototype.clean.call(this, path);
    };
    return RefResult;
}(Result_1.Result));
exports.RefResult = RefResult;


/***/ }),

/***/ 345:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(40);
var Result_2 = __webpack_require__(40);
var ExpressionRegExp = /** @class */ (function () {
    function ExpressionRegExp(value, id, grammar) {
        this.value = value;
        this.id = id;
    }
    ExpressionRegExp.prototype.parse = function (input, end) {
        var groups = input.match(this.value);
        // if the RegExp do not match at the start, ignore it
        if (groups != null && groups.index != 0) {
            groups = null;
        }
        var result = new Result_1.Result(groups != null ? groups[0] : null, this, input);
        // if is successful and we require the end but the length of parsed is
        // lower than the input length, return a EndOfInputExpected Result
        if (result.isSuccess() && end && input.length > result.value.length) {
            return new Result_2.EndOfInputResult(result);
        }
        return result;
    };
    ExpressionRegExp.prototype.toString = function () {
        return this.id;
    };
    return ExpressionRegExp;
}());
exports.ExpressionRegExp = ExpressionRegExp;


/***/ }),

/***/ 346:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Field_1 = __webpack_require__(159);
exports.NestedQuery = {
    basicExpressions: ['NestedQuery'],
    grammars: {
        NestedQuery: '[[NestedField][OptionalSpaces][Expressions]]',
        NestedField: '[[Field]]',
        FieldValue: ['NestedQuery']
    },
    include: [Field_1.Field]
};


/***/ }),

/***/ 347:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Basic_1 = __webpack_require__(93);
exports.Date = {
    grammars: {
        Date: '[DateYear]/[DateMonth]/[DateDay]',
        DateYear: /([0-9]{4})/,
        DateMonth: /(1[0-2]|0?[1-9])/,
        DateDay: /([1-2][0-9]|3[0-1]|0?[1-9])/,
        DateRange: '[Date][Spaces?]..[Spaces?][Date]',
        DateRelative: ['DateRelativeNegative', 'DateRelativeTerm'],
        DateRelativeTerm: /now|today|yesterday/,
        DateRelativeNegative: '[DateRelativeTerm][DateRelativeNegativeRef]',
        DateRelativeNegativeRef: /([\-\+][0-9]+(s|m|h|d|mo|y))/
    },
    include: [Basic_1.Basic]
};


/***/ }),

/***/ 348:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Basic_1 = __webpack_require__(93);
exports.QueryExtension = {
    basicExpressions: ['QueryExtension'],
    grammars: {
        QueryExtension: '$[QueryExtensionName]([QueryExtensionArguments])',
        QueryExtensionName: /\w+/,
        QueryExtensionArguments: '[QueryExtensionArgumentList*][QueryExtensionArgument]',
        QueryExtensionArgumentList: '[QueryExtensionArgument][Spaces?],[Spaces?]',
        QueryExtensionArgument: '[QueryExtensionArgumentName]:[Spaces?][QueryExtensionArgumentValue]',
        QueryExtensionArgumentName: /\w+/,
        QueryExtensionArgumentValue: ['SingleQuoted', 'Expressions']
    },
    include: [Basic_1.Basic]
};


/***/ }),

/***/ 349:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SubExpression = {
    basicExpressions: ['SubExpression'],
    grammars: {
        SubExpression: '([Expressions])'
    }
};


/***/ }),

/***/ 350:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var _ = __webpack_require__(0);
var KeyboardUtils_1 = __webpack_require__(29);
var Strings_1 = __webpack_require__(7);
var InputManager = /** @class */ (function () {
    function InputManager(element, onchange, magicBox) {
        this.onchange = onchange;
        this.magicBox = magicBox;
        this.hasFocus = false;
        this.underlay = document.createElement('div');
        this.underlay.className = 'magic-box-underlay';
        this.highlightContainer = document.createElement('span');
        this.highlightContainer.className = 'magic-box-highlight-container';
        this.underlay.appendChild(this.highlightContainer);
        this.ghostTextContainer = document.createElement('span');
        this.ghostTextContainer.className = 'magic-box-ghost-text';
        this.underlay.appendChild(this.ghostTextContainer);
        this.input = Dom_1.$$(element).find('input');
        if (!this.input) {
            this.input = document.createElement('input');
            element.appendChild(this.underlay);
            element.appendChild(this.input);
        }
        else {
            element.insertBefore(this.underlay, this.input);
        }
        this.setupHandler();
        this.addAccessibilitiesProperties();
    }
    /**
     * Update the input with the result value
     */
    InputManager.prototype.updateInput = function () {
        if (this.input.value != this.result.input) {
            this.input.value = this.result.input;
            if (this.hasFocus) {
                this.setCursor(this.getValue().length);
            }
        }
    };
    /**
     * Update the highlight with the result value
     */
    InputManager.prototype.updateHighlight = function () {
        Dom_1.$$(this.highlightContainer).empty();
        this.highlightContainer.appendChild(this.result.toHtmlElement());
    };
    /**
     * Update the ghostText with the wordCompletion
     */
    InputManager.prototype.updateWordCompletion = function () {
        Dom_1.$$(this.ghostTextContainer).empty();
        this.ghostTextContainer.innerHTML = '';
        if (this.wordCompletion != null) {
            this.ghostTextContainer.appendChild(document.createTextNode(this.wordCompletion.substr(this.result.input.length)));
        }
    };
    InputManager.prototype.updateScroll = function (defer) {
        var _this = this;
        if (defer === void 0) { defer = true; }
        var callback = function () {
            // this is the cheapest call we can do before update scroll
            if (_this.underlay.clientWidth < _this.underlay.scrollWidth) {
                _this.underlay.style.visibility = 'hidden';
                _this.underlay.scrollLeft = _this.input.scrollLeft;
                _this.underlay.scrollTop = _this.input.scrollTop;
                _this.underlay.style.visibility = 'visible';
            }
            _this.updateScrollDefer = null;
            // one day we will have to remove this
            if (_this.hasFocus) {
                _this.updateScroll();
            }
        };
        // sometime we want it to be updated as soon as posible to have no flickering
        if (!defer) {
            callback();
        }
        else if (this.updateScrollDefer == null) {
            this.updateScrollDefer = requestAnimationFrame(callback);
        }
    };
    /**
     * Set the result and update visual if needed
     */
    InputManager.prototype.setResult = function (result, wordCompletion) {
        this.result = result;
        this.updateInput();
        this.updateHighlight();
        // reuse last wordCompletion for a better visual
        if (_.isUndefined(wordCompletion) && this.wordCompletion != null && this.wordCompletion.indexOf(this.result.input) == 0) {
            this.updateWordCompletion();
        }
        else {
            this.setWordCompletion(wordCompletion);
        }
        this.updateScroll();
    };
    /**
     * Set the word completion. will be ignore if the word completion do not start with the result input
     */
    InputManager.prototype.setWordCompletion = function (wordCompletion) {
        if (wordCompletion != null && wordCompletion.toLowerCase().indexOf(this.result.input.toLowerCase()) != 0) {
            wordCompletion = null;
        }
        this.wordCompletion = wordCompletion;
        this.updateWordCompletion();
        this.updateScroll();
    };
    /**
     * Set cursor position
     */
    InputManager.prototype.setCursor = function (index) {
        this.input.focus();
        if (this.input.createTextRange) {
            var range = this.input.createTextRange();
            range.move('character', index);
            range.select();
        }
        else if (this.input.selectionStart != null) {
            this.input.focus();
            this.input.setSelectionRange(index, index);
        }
    };
    InputManager.prototype.getCursor = function () {
        return this.input.selectionStart;
    };
    InputManager.prototype.setupHandler = function () {
        var _this = this;
        this.input.onblur = function () {
            _this.hasFocus = false;
            setTimeout(function () {
                if (!_this.hasFocus) {
                    _this.onblur && _this.onblur();
                }
            }, 300);
            _this.updateScroll();
        };
        this.input.onfocus = function () {
            if (!_this.hasFocus) {
                _this.hasFocus = true;
                _this.updateScroll();
                _this.onfocus && _this.onfocus();
            }
        };
        this.input.onkeydown = function (e) {
            _this.keydown(e);
        };
        this.input.onkeyup = function (e) {
            _this.keyup(e);
        };
        this.input.onclick = function () {
            _this.onchangecursor();
        };
        this.input.oncut = function () {
            setTimeout(function () {
                _this.onInputChange();
            });
        };
        this.input.onpaste = function () {
            setTimeout(function () {
                _this.onInputChange();
            });
        };
    };
    InputManager.prototype.addAccessibilitiesProperties = function () {
        this.input.spellcheck = false;
        this.input.setAttribute('form', 'coveo-dummy-form');
        this.input.setAttribute('role', 'combobox');
        this.input.setAttribute('autocomplete', 'off');
        this.input.setAttribute('aria-autocomplete', 'list');
        this.input.setAttribute('title', Strings_1.l('InsertAQuery') + ". " + Strings_1.l('PressEnterToSend'));
    };
    InputManager.prototype.focus = function () {
        var _this = this;
        this.hasFocus = true;
        // neet a timeout for IE8-9
        setTimeout(function () {
            _this.input.focus();
            _this.setCursor(_this.getValue().length);
        });
    };
    InputManager.prototype.blur = function () {
        if (this.hasFocus) {
            this.input.blur();
        }
    };
    InputManager.prototype.keydown = function (e) {
        var _this = this;
        switch (e.keyCode || e.which) {
            case KeyboardUtils_1.KEYBOARD.TAB:
                // Take care of not "preventing" the default event behaviour : For accessibility reasons, it is much simpler
                // to simply let the browser do it's standard action (which is to focus out of the input).
                // Instead, handle "tabPress" immediately instead of "keyup".
                // The focus will be on the next element in the page when the key is released, so keyup on the input will never be triggered.
                this.tabPress();
                this.magicBox.clearSuggestion();
                break;
            default:
                e.stopPropagation();
                if (this.onkeydown == null || this.onkeydown(e.keyCode || e.which)) {
                    requestAnimationFrame(function () {
                        _this.onInputChange();
                    });
                }
                else {
                    e.preventDefault();
                }
                break;
        }
    };
    InputManager.prototype.keyup = function (e) {
        switch (e.keyCode || e.which) {
            case 37: // Left
            case 39: // Right
                this.onchangecursor();
                break;
            default:
                if (this.onkeydown == null || this.onkeyup(e.keyCode || e.which)) {
                    this.onInputChange();
                }
                else {
                    e.preventDefault();
                }
                break;
        }
    };
    InputManager.prototype.tabPress = function () {
        this.ontabpress && this.ontabpress();
        this.onblur && this.onblur();
    };
    InputManager.prototype.onInputChange = function () {
        if (this.result.input != this.input.value) {
            this.onchange(this.input.value, false);
        }
    };
    InputManager.prototype.getValue = function () {
        return this.input.value;
    };
    InputManager.prototype.getWordCompletion = function () {
        return this.wordCompletion;
    };
    return InputManager;
}());
exports.InputManager = InputManager;


/***/ }),

/***/ 351:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var underscore_1 = __webpack_require__(0);
var SuggestionsManager = /** @class */ (function () {
    function SuggestionsManager(element, magicBoxContainer, inputManager, options) {
        var _this = this;
        this.element = element;
        this.magicBoxContainer = magicBoxContainer;
        this.inputManager = inputManager;
        this.options = underscore_1.defaults(options, {
            selectableClass: 'magic-box-suggestion',
            selectedClass: 'magic-box-selected'
        });
        // Put in a sane default, so as to not reject every suggestions if not set on initialization
        if (this.options.timeout == undefined) {
            this.options.timeout = 500;
        }
        this.hasSuggestions = false;
        Dom_1.$$(this.element).on('mouseover', function (e) {
            _this.handleMouseOver(e);
        });
        Dom_1.$$(this.element).on('mouseout', function (e) {
            _this.handleMouseOut(e);
        });
        this.addAccessibilityProperties();
    }
    SuggestionsManager.prototype.handleMouseOver = function (e) {
        var target = Dom_1.$$(e.target);
        var parents = target.parents(this.options.selectableClass);
        if (target.hasClass(this.options.selectableClass)) {
            this.processMouseSelection(target.el);
        }
        else if (parents.length > 0 && this.element.contains(parents[0])) {
            this.processMouseSelection(parents[0]);
        }
    };
    SuggestionsManager.prototype.handleMouseOut = function (e) {
        var target = Dom_1.$$(e.target);
        var targetParents = target.parents(this.options.selectableClass);
        //e.relatedTarget is not available if moving off the browser window
        if (e.relatedTarget) {
            var relatedTargetParents = Dom_1.$$(e.relatedTarget).parents(this.options.selectableClass);
            if (target.hasClass(this.options.selectedClass) && !Dom_1.$$(e.relatedTarget).hasClass(this.options.selectableClass)) {
                this.removeSelectedStatus(target.el);
            }
            else if (relatedTargetParents.length == 0 && targetParents.length > 0) {
                this.removeSelectedStatus(targetParents[0]);
            }
        }
        else {
            if (target.hasClass(this.options.selectedClass)) {
                this.removeSelectedStatus(target.el);
            }
            else if (targetParents.length > 0) {
                this.removeSelectedStatus(targetParents[0]);
            }
        }
    };
    SuggestionsManager.prototype.moveDown = function () {
        return this.returnMoved(this.move('down'));
    };
    SuggestionsManager.prototype.moveUp = function () {
        return this.returnMoved(this.move('up'));
    };
    SuggestionsManager.prototype.selectAndReturnKeyboardFocusedElement = function () {
        var selected = this.keyboardFocusedSuggestion;
        if (selected != null) {
            Dom_1.$$(selected).trigger('keyboardSelect');
            // By definition, once an element has been "selected" with the keyboard,
            // it is not longer "active" since the event has been processed.
            this.keyboardFocusedSuggestion = null;
        }
        return selected;
    };
    SuggestionsManager.prototype.mergeSuggestions = function (suggestions, callback) {
        var _this = this;
        var results = [];
        var timeout;
        var stillNeedToResolve = true;
        // clean empty / null values in the array of suggestions
        suggestions = underscore_1.compact(suggestions);
        var promise = (this.pendingSuggestion = new Promise(function (resolve, reject) {
            // Concat all promises results together in one flat array.
            // If one promise take too long to resolve, simply skip it
            underscore_1.each(suggestions, function (suggestion) {
                var shouldRejectPart = false;
                setTimeout(function () {
                    shouldRejectPart = true;
                    stillNeedToResolve = false;
                }, _this.options.timeout);
                suggestion.then(function (item) {
                    if (!shouldRejectPart && item) {
                        results = results.concat(item);
                    }
                });
            });
            // Resolve the promise when one of those conditions is met first :
            // - All suggestions resolved
            // - Timeout is reached before all promises have processed -> resolve with what we have so far
            // - No suggestions given (length 0 or undefined)
            var onResolve = function () {
                if (stillNeedToResolve) {
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                    if (results.length == 0) {
                        resolve([]);
                    }
                    else if (promise == _this.pendingSuggestion || _this.pendingSuggestion == null) {
                        resolve(results.sort(function (a, b) { return b.index - a.index; }));
                    }
                    else {
                        reject('new request queued');
                    }
                }
                stillNeedToResolve = false;
            };
            if (suggestions.length == 0) {
                onResolve();
            }
            if (suggestions == undefined) {
                onResolve();
            }
            timeout = setTimeout(function () {
                onResolve();
            }, _this.options.timeout);
            Promise.all(suggestions).then(function () { return onResolve(); });
        }));
        promise
            .then(function (suggestions) {
            if (callback) {
                callback(suggestions);
            }
            _this.updateSuggestions(suggestions);
            return suggestions;
        })
            .catch(function () {
            return null;
        });
    };
    SuggestionsManager.prototype.updateSuggestions = function (suggestions) {
        var _this = this;
        Dom_1.$$(this.element).empty();
        this.element.className = 'magic-box-suggestions';
        var suggestionsContainer = this.buildSuggestionsContainer();
        Dom_1.$$(this.element).append(suggestionsContainer.el);
        underscore_1.each(suggestions, function (suggestion) {
            var dom = suggestion.dom ? _this.modifyDomFromExistingSuggestion(suggestion.dom) : _this.createDomFromSuggestion(suggestion);
            dom.setAttribute('id', "magic-box-suggestion-" + underscore_1.indexOf(suggestions, suggestion));
            dom.setAttribute('role', 'option');
            dom.setAttribute('aria-selected', 'false');
            dom['suggestion'] = suggestion;
            suggestionsContainer.append(dom.el);
        });
        this.hasSuggestions = suggestions.length > 0;
        Dom_1.$$(this.element).toggleClass('magic-box-hasSuggestion', this.hasSuggestions);
        Dom_1.$$(this.magicBoxContainer).setAttribute('aria-expanded', this.hasSuggestions.toString());
    };
    SuggestionsManager.prototype.processKeyboardSelection = function (suggestion) {
        this.addSelectedStatus(suggestion);
        this.keyboardFocusedSuggestion = suggestion;
        Dom_1.$$(this.inputManager.input).setAttribute('aria-activedescendant', Dom_1.$$(suggestion).getAttribute('id'));
    };
    SuggestionsManager.prototype.processMouseSelection = function (suggestion) {
        this.addSelectedStatus(suggestion);
        this.keyboardFocusedSuggestion = null;
    };
    SuggestionsManager.prototype.buildSuggestionsContainer = function () {
        return Dom_1.$$('div', {
            id: 'coveo-magicbox-suggestions',
            role: 'listbox'
        });
    };
    SuggestionsManager.prototype.createDomFromSuggestion = function (suggestion) {
        var dom = Dom_1.$$('div', {
            className: "magic-box-suggestion " + this.options.selectableClass
        });
        dom.on('click', function () {
            suggestion.onSelect();
        });
        dom.on('keyboardSelect', function () {
            suggestion.onSelect();
        });
        if (suggestion.html) {
            dom.el.innerHTML = suggestion.html;
            return dom;
        }
        if (suggestion.text) {
            dom.text(suggestion.text);
            return dom;
        }
        if (suggestion.separator) {
            dom.addClass('magic-box-suggestion-seperator');
            var suggestionLabel = Dom_1.$$('div', {
                className: 'magic-box-suggestion-seperator-label'
            }, suggestion.separator);
            dom.append(suggestionLabel.el);
            return dom;
        }
        return dom;
    };
    SuggestionsManager.prototype.modifyDomFromExistingSuggestion = function (dom) {
        // this need to be done if the selection is in cache and the dom is set in the suggestion
        this.removeSelectedStatus(dom);
        var found = Dom_1.$$(dom).find('.' + this.options.selectableClass);
        this.removeSelectedStatus(found);
        return Dom_1.$$(dom);
    };
    SuggestionsManager.prototype.move = function (direction) {
        var currentlySelected = Dom_1.$$(this.element).find("." + this.options.selectedClass);
        var selectables = Dom_1.$$(this.element).findAll("." + this.options.selectableClass);
        var currentIndex = underscore_1.indexOf(selectables, currentlySelected);
        var index = direction == 'up' ? currentIndex - 1 : currentIndex + 1;
        if (index < -1) {
            index = selectables.length - 1;
        }
        if (index > selectables.length) {
            index = 0;
        }
        var newlySelected = selectables[index];
        if (newlySelected) {
            this.processKeyboardSelection(newlySelected);
        }
        else {
            this.keyboardFocusedSuggestion = null;
            this.inputManager.input.removeAttribute('aria-activedescendant');
        }
        return newlySelected;
    };
    SuggestionsManager.prototype.returnMoved = function (selected) {
        if (selected != null) {
            if (selected['suggestion']) {
                return selected['suggestion'];
            }
            if (selected['no-text-suggestion']) {
                return null;
            }
            if (selected instanceof HTMLElement) {
                return {
                    text: Dom_1.$$(selected).text()
                };
            }
        }
        return null;
    };
    SuggestionsManager.prototype.addSelectedStatus = function (suggestion) {
        var selected = this.element.getElementsByClassName(this.options.selectedClass);
        for (var i = 0; i < selected.length; i++) {
            var elem = selected.item(i);
            this.removeSelectedStatus(elem);
        }
        Dom_1.$$(suggestion).addClass(this.options.selectedClass);
        this.updateAreaSelectedIfDefined(suggestion, 'true');
    };
    SuggestionsManager.prototype.removeSelectedStatus = function (suggestion) {
        Dom_1.$$(suggestion).removeClass(this.options.selectedClass);
        this.updateAreaSelectedIfDefined(suggestion, 'false');
    };
    SuggestionsManager.prototype.updateAreaSelectedIfDefined = function (suggestion, value) {
        if (Dom_1.$$(suggestion).getAttribute('aria-selected')) {
            Dom_1.$$(suggestion).setAttribute('aria-selected', value);
        }
    };
    SuggestionsManager.prototype.addAccessibilityProperties = function () {
        Dom_1.$$(this.magicBoxContainer).setAttribute('aria-expanded', 'false');
        Dom_1.$$(this.magicBoxContainer).setAttribute('aria-haspopup', 'listbox');
        this.inputManager.input.removeAttribute('aria-activedescendant');
    };
    return SuggestionsManager;
}());
exports.SuggestionsManager = SuggestionsManager;


/***/ }),

/***/ 352:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var MiscModules_1 = __webpack_require__(54);
var QueryboxQueryParameters = /** @class */ (function () {
    function QueryboxQueryParameters(options) {
        this.options = options;
    }
    QueryboxQueryParameters.queryIsBlocked = function () {
        // This code runs on some assumption :
        // Since all "buildingQuery" events would have to be run in the same call stack
        // We can add a static flag to block 2 or more query box/omnibox from trying to modify the query inside the same event.
        // If 2 query box are activated, we get duplicate terms in the query, or duplicate term correction with did you mean.
        // This means that only one query box/searchbox would be able to modify the query in a single search page.
        // This also means that if there is 2 search box enabled, the first one in the markup in the page would be able to do the job correctly as far as the query is concerned.
        // The second one is inactive as far as the query is concerned.
        // The flag gets reset in "defer" (setTimeout 0) so that it gets reset correctly when the query event has finished executing
        if (!QueryboxQueryParameters.queryIsCurrentlyBlocked) {
            QueryboxQueryParameters.queryIsCurrentlyBlocked = true;
            MiscModules_1.Defer.defer(function () { return QueryboxQueryParameters.allowDuplicateQuery(); });
            return false;
        }
        return true;
    };
    QueryboxQueryParameters.allowDuplicateQuery = function () {
        QueryboxQueryParameters.queryIsCurrentlyBlocked = false;
    };
    QueryboxQueryParameters.prototype.addParameters = function (queryBuilder, lastQuery) {
        if (!QueryboxQueryParameters.queryIsBlocked()) {
            if (this.options.enableWildcards) {
                queryBuilder.enableWildcards = true;
            }
            if (this.options.enableQuestionMarks) {
                queryBuilder.enableQuestionMarks = true;
            }
            if (this.options.enableLowercaseOperators) {
                queryBuilder.enableLowercaseOperators = true;
            }
            if (!_.isEmpty(lastQuery)) {
                queryBuilder.enableQuerySyntax = this.options.enableQuerySyntax;
                queryBuilder.expression.add(lastQuery);
                if (this.options.enablePartialMatch) {
                    queryBuilder.enablePartialMatch = this.options.enablePartialMatch;
                    if (this.options.partialMatchKeywords) {
                        queryBuilder.partialMatchKeywords = this.options.partialMatchKeywords;
                    }
                    if (this.options.partialMatchThreshold) {
                        queryBuilder.partialMatchThreshold = this.options.partialMatchThreshold;
                    }
                }
            }
        }
    };
    QueryboxQueryParameters.queryIsCurrentlyBlocked = false;
    return QueryboxQueryParameters;
}());
exports.QueryboxQueryParameters = QueryboxQueryParameters;


/***/ }),

/***/ 353:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var NestedQuery_1 = __webpack_require__(346);
var QueryExtension_1 = __webpack_require__(348);
var Basic_1 = __webpack_require__(93);
var Field_1 = __webpack_require__(159);
var SubExpression_1 = __webpack_require__(349);
exports.Complete = {
    include: [NestedQuery_1.NestedQuery, QueryExtension_1.QueryExtension, SubExpression_1.SubExpression, Field_1.Field, Basic_1.Basic]
};


/***/ }),

/***/ 354:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Grammar_1 = __webpack_require__(126);
var _ = __webpack_require__(0);
function loadSubGrammar(expressions, basicExpressions, grammars, subGrammar) {
    _.each(subGrammar.expressions, function (expression) {
        if (!_.contains(expressions, expression)) {
            expressions.push(expression);
        }
    });
    _.each(subGrammar.basicExpressions, function (expression) {
        if (!_.contains(basicExpressions, expression)) {
            basicExpressions.push(expression);
        }
    });
    _.each(subGrammar.grammars, function (expressionDef, id) {
        if (!(id in grammars)) {
            grammars[id] = expressionDef;
        }
        else {
            if (_.isArray(grammars[id]) && _.isArray(expressionDef)) {
                _.each(expressionDef, function (value) {
                    grammars[id].push(value);
                });
            }
            else {
                _.each(expressionDef, function (value) {
                    grammars[id].push(value);
                });
                throw new Error('Can not merge ' + id + '(' + JSON.stringify(expressionDef) + ' => ' + JSON.stringify(grammars[id]) + ')');
            }
        }
    });
}
function Expressions() {
    var subGrammars = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        subGrammars[_i] = arguments[_i];
    }
    var expressions = [];
    var BasicExpression = [];
    var grammars = {
        Start: ['Expressions', 'Empty'],
        Expressions: '[OptionalSpaces][Expression][ExpressionsList*][OptionalSpaces]',
        ExpressionsList: '[Spaces][Expression]',
        Expression: expressions,
        BasicExpression: BasicExpression,
        OptionalSpaces: / */,
        Spaces: / +/,
        Empty: /(?!.)/
    };
    for (var i = 0; i < subGrammars.length; i++) {
        loadSubGrammar(expressions, BasicExpression, grammars, subGrammars[i]);
        _.each(subGrammars[i].include, function (subGrammar) {
            if (!_.contains(subGrammars, subGrammar)) {
                subGrammars.push(subGrammar);
            }
        });
    }
    expressions.push('BasicExpression');
    return {
        start: 'Start',
        expressions: grammars
    };
}
exports.Expressions = Expressions;
function ExpressionsGrammar() {
    var subGrammars = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        subGrammars[_i] = arguments[_i];
    }
    var grammar = Expressions.apply(this, subGrammars);
    return new Grammar_1.Grammar(grammar.start, grammar.expressions);
}
exports.ExpressionsGrammar = ExpressionsGrammar;


/***/ }),

/***/ 355:
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
var ComponentOptionsModel_1 = __webpack_require__(25);
var QueryboxOptionsProcessing = /** @class */ (function () {
    function QueryboxOptionsProcessing(owner) {
        this.owner = owner;
    }
    Object.defineProperty(QueryboxOptionsProcessing.prototype, "options", {
        get: function () {
            return this.owner.options;
        },
        set: function (options) {
            this.owner.options = options;
        },
        enumerable: true,
        configurable: true
    });
    QueryboxOptionsProcessing.prototype.postProcess = function () {
        this.options = __assign({}, this.options, this.owner.componentOptionsModel.get(ComponentOptionsModel_1.ComponentOptionsModel.attributesEnum.searchBox));
        this.processQueryOnClearVersusEmptyQuery();
        this.processQueryOnClearVersusSearchAsYouType();
    };
    QueryboxOptionsProcessing.prototype.processQueryOnClearVersusEmptyQuery = function () {
        if (this.options.triggerQueryOnClear && this.owner.searchInterface.options.allowQueriesWithoutKeywords === false) {
            this.owner.logger.warn('Forcing option triggerQueryOnClear to false, as it is not supported when the search interface is configured to not allow queries without keywords (data-allow-queries-without-keywords="false")', this.owner);
            this.options.triggerQueryOnClear = false;
        }
    };
    QueryboxOptionsProcessing.prototype.processQueryOnClearVersusSearchAsYouType = function () {
        if (this.owner.searchInterface.options.allowQueriesWithoutKeywords === true &&
            this.options.triggerQueryOnClear === false &&
            this.options.enableSearchAsYouType === true) {
            this.owner.logger.warn('Forcing option triggerQueryOnClear to true, since search as you type is enabled', this.owner);
            this.options.triggerQueryOnClear = true;
        }
    };
    return QueryboxOptionsProcessing;
}());
exports.QueryboxOptionsProcessing = QueryboxOptionsProcessing;


/***/ }),

/***/ 367:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 380:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GlobalExports_1 = __webpack_require__(3);
var ExpressionConstant_1 = __webpack_require__(157);
var ExpressionEndOfInput_1 = __webpack_require__(158);
var ExpressionFunction_1 = __webpack_require__(339);
var ExpressionList_1 = __webpack_require__(340);
var ExpressionOptions_1 = __webpack_require__(341);
var ExpressionRef_1 = __webpack_require__(343);
var ExpressionRegExp_1 = __webpack_require__(345);
var Grammar_1 = __webpack_require__(126);
var Grammars_1 = __webpack_require__(381);
var InputManager_1 = __webpack_require__(350);
var MagicBox_1 = __webpack_require__(161);
var MagicBoxUtils_1 = __webpack_require__(162);
var OptionResult_1 = __webpack_require__(342);
var RefResult_1 = __webpack_require__(344);
var Result_1 = __webpack_require__(40);
var SuggestionsManager_1 = __webpack_require__(351);
exports.GrammarsImportedLocally = Grammars_1.Grammars;
function doMagicBoxExport() {
    GlobalExports_1.exportGlobally({
        MagicBox: {
            EndOfInputResult: Result_1.EndOfInputResult,
            ExpressionConstant: ExpressionConstant_1.ExpressionConstant,
            ExpressionEndOfInput: ExpressionEndOfInput_1.ExpressionEndOfInput,
            ExpressionFunction: ExpressionFunction_1.ExpressionFunction,
            ExpressionList: ExpressionList_1.ExpressionList,
            ExpressionOptions: ExpressionOptions_1.ExpressionOptions,
            ExpressionRef: ExpressionRef_1.ExpressionRef,
            ExpressionRegExp: ExpressionRegExp_1.ExpressionRegExp,
            Grammar: Grammar_1.Grammar,
            Grammars: Grammars_1.Grammars,
            InputManager: InputManager_1.InputManager,
            Instance: MagicBox_1.MagicBoxInstance,
            OptionResult: OptionResult_1.OptionResult,
            RefResult: RefResult_1.RefResult,
            Result: Result_1.Result,
            SuggestionsManager: SuggestionsManager_1.SuggestionsManager,
            Utils: MagicBoxUtils_1.MagicBoxUtils,
            create: MagicBox_1.createMagicBox,
            requestAnimationFrame: MagicBox_1.requestAnimationFrame
        }
    });
}
exports.doMagicBoxExport = doMagicBoxExport;


/***/ }),

/***/ 381:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Basic_1 = __webpack_require__(93);
var Complete_1 = __webpack_require__(353);
var Date_1 = __webpack_require__(347);
var Expressions_1 = __webpack_require__(354);
var Field_1 = __webpack_require__(159);
var NestedQuery_1 = __webpack_require__(346);
var QueryExtension_1 = __webpack_require__(348);
var SubExpression_1 = __webpack_require__(349);
exports.Grammars = {
    Basic: Basic_1.Basic,
    notInWord: Basic_1.notInWord,
    notWordStart: Basic_1.notWordStart,
    Complete: Complete_1.Complete,
    Date: Date_1.Date,
    Expressions: Expressions_1.Expressions,
    ExpressionsGrammar: Expressions_1.ExpressionsGrammar,
    Field: Field_1.Field,
    NestedQuery: NestedQuery_1.NestedQuery,
    QueryExtension: QueryExtension_1.QueryExtension,
    SubExpression: SubExpression_1.SubExpression
};


/***/ }),

/***/ 382:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Dom_1 = __webpack_require__(1);
var Strings_1 = __webpack_require__(7);
var AccessibleButton_1 = __webpack_require__(17);
var MagicBoxClear = /** @class */ (function () {
    function MagicBoxClear(magicBox) {
        this.element = Dom_1.$$('div', {
            className: 'magic-box-clear'
        });
        var clearIcon = Dom_1.$$('div', {
            className: 'magic-box-icon'
        });
        this.element.append(clearIcon.el);
        this.element.insertAfter(Dom_1.$$(magicBox.element).find('input'));
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.element)
            .withLabel(Strings_1.l('Clear'))
            .withSelectAction(function () { return magicBox.clear(); })
            .build();
        this.toggleTabindex(false);
    }
    MagicBoxClear.prototype.toggleTabindex = function (hasText) {
        var tabindex = hasText ? '0' : '-1';
        this.element.setAttribute('tabindex', tabindex);
    };
    return MagicBoxClear;
}());
exports.MagicBoxClear = MagicBoxClear;


/***/ }),

/***/ 40:
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
var ExpressionEndOfInput_1 = __webpack_require__(158);
var ExpressionConstant_1 = __webpack_require__(157);
var _ = __webpack_require__(0);
var Result = /** @class */ (function () {
    function Result(value, expression, input) {
        var _this = this;
        this.expression = expression;
        this.input = input;
        if (_.isString(value)) {
            this.value = value;
        }
        else if (_.isArray(value)) {
            this.subResults = value;
            _.forEach(this.subResults, function (subResult) {
                subResult.parent = _this;
            });
        }
    }
    Result.prototype.isSuccess = function () {
        // if null is the value, this mean the expression could not parse this input
        return this.value != null || (this.subResults != null && _.all(this.subResults, function (subResult) { return subResult.isSuccess(); }));
    };
    /**
     * Return path to this result ([parent.parent, parent, this])
     */
    Result.prototype.path = function (until) {
        var path = this.parent != null && this.parent != until ? this.parent.path(until) : [];
        path.push(this);
        return path;
    };
    /**
     * Return the closest parent that match the condition (can be it-self). If match is a string, it will search for the result expresion id
     */
    Result.prototype.findParent = function (match) {
        var parent = this;
        var iterator = _.isString(match) ? function (result) { return match == result.expression.id; } : match;
        while (parent != null && !iterator(parent)) {
            parent = parent.parent;
        }
        return parent;
    };
    /**
     * Return the first child that match the condition (can be it-self). If match is a string, it will search for the result expresion id
     */
    Result.prototype.find = function (match) {
        var iterator = _.isString(match) ? function (result) { return match == result.expression.id; } : match;
        if (iterator(this)) {
            return this;
        }
        if (this.subResults) {
            for (var i = 0; i < this.subResults.length; i++) {
                var subResultFind = this.subResults[i].find(iterator);
                if (subResultFind) {
                    return subResultFind;
                }
            }
        }
        return null;
    };
    /**
     * Return all children that match the condition (can be it-self). If match is a string, it will search for the result expresion id
     */
    Result.prototype.findAll = function (match) {
        var results = [];
        var iterator = _.isString(match) ? function (result) { return match == result.expression.id; } : match;
        if (iterator(this)) {
            results.push(this);
        }
        if (this.subResults) {
            results = _.reduce(this.subResults, function (results, subResult) { return results.concat(subResult.findAll(iterator)); }, results);
        }
        return results;
    };
    /**
     * Return the first child that match the condition (can be it-self). If match is a string, it will search for the result expresion id
     */
    Result.prototype.resultAt = function (index, match) {
        if (index < 0 || index > this.getLength()) {
            return [];
        }
        if (match != null) {
            if (_.isString(match)) {
                if (match == this.expression.id) {
                    return [this];
                }
            }
            else {
                if (match(this)) {
                    return [this];
                }
            }
        }
        else {
            var value = this.value == null && this.subResults == null ? this.input : this.value;
            if (value != null) {
                return [this];
            }
        }
        if (this.subResults != null) {
            var results = [];
            for (var i = 0; i < this.subResults.length; i++) {
                var subResult = this.subResults[i];
                results = results.concat(subResult.resultAt(index, match));
                index -= subResult.getLength();
                if (index < 0) {
                    break;
                }
            }
            return results;
        }
        return [];
    };
    /**
     * Return all fail result.
     */
    Result.prototype.getExpect = function () {
        if (this.value == null && this.subResults == null) {
            return [this];
        }
        if (this.subResults != null) {
            return _.reduce(this.subResults, function (expect, result) { return expect.concat(result.getExpect()); }, []);
        }
        return [];
    };
    /**
     * Return the best fail result (The farthest result who got parsed). We also remove duplicate and always return the simplest result of a kind
     */
    Result.prototype.getBestExpect = function () {
        var expects = this.getExpect();
        var groups = _.groupBy(expects, function (expect) { return expect.input; });
        var key = _.last(_.keys(groups).sort(function (a, b) {
            return b.length - a.length;
        }));
        var bestResults = groups[key];
        var groups = _.groupBy(bestResults, function (expect) { return expect.expression.id; });
        return _.map(groups, function (bestResults) {
            return _.chain(bestResults)
                .map(function (result) {
                return {
                    path: result.path().length,
                    result: result
                };
            })
                .sortBy('path')
                .pluck('result')
                .first()
                .value();
        });
    };
    Result.prototype.getHumanReadableExpect = function () {
        var expect = this.getBestExpect();
        var input = expect.length > 0 ? _.last(expect).input : '';
        return ('Expected ' +
            _.map(expect, function (result) { return result.getHumanReadable(); }).join(' or ') +
            ' but ' +
            (input.length > 0 ? JSON.stringify(input[0]) : 'end of input') +
            ' found.');
    };
    /**
     * Return a string that represent what is before this result
     */
    Result.prototype.before = function () {
        if (this.parent == null) {
            return '';
        }
        var index = _.indexOf(this.parent.subResults, this);
        return (this.parent.before() +
            _.chain(this.parent.subResults)
                .first(index)
                .map(function (subResult) { return subResult.toString(); })
                .join('')
                .value());
    };
    /**
     * Return a string that represent what is after this result
     */
    Result.prototype.after = function () {
        if (this.parent == null) {
            return '';
        }
        var index = _.indexOf(this.parent.subResults, this);
        return (_.chain(this.parent.subResults)
            .last(this.parent.subResults.length - index - 1)
            .map(function (subResult) { return subResult.toString(); })
            .join('')
            .value() + this.parent.after());
    };
    /**
     * Return the length of the result
     */
    Result.prototype.getLength = function () {
        if (this.value != null) {
            return this.value.length;
        }
        if (this.subResults != null) {
            return _.reduce(this.subResults, function (length, subResult) { return length + subResult.getLength(); }, 0);
        }
        return this.input.length;
    };
    Result.prototype.toHtmlElement = function () {
        var element = document.createElement('span');
        var id = this.expression != null ? this.expression.id : null;
        if (id != null) {
            element.setAttribute('data-id', id);
        }
        element.setAttribute('data-success', this.isSuccess().toString());
        if (this.value != null) {
            element.appendChild(document.createTextNode(this.value));
            element.setAttribute('data-value', this.value);
        }
        else if (this.subResults != null) {
            _.each(this.subResults, function (subResult) {
                element.appendChild(subResult.toHtmlElement());
            });
        }
        else {
            element.appendChild(document.createTextNode(this.input));
            element.setAttribute('data-input', this.input);
            element.className = 'magic-box-error' + (this.input.length > 0 ? '' : ' magic-box-error-empty');
        }
        element['result'] = this;
        return element;
    };
    /**
     * Clean the result to have the most relevant result. If the result is successful just return a clone of it.
     */
    Result.prototype.clean = function (path) {
        if (path != null || !this.isSuccess()) {
            path = path || _.last(this.getBestExpect()).path(this);
            var next = _.first(path);
            if (next != null) {
                var nextIndex = _.indexOf(this.subResults, next);
                var subResults = nextIndex == -1 ? [] : _.map(_.first(this.subResults, nextIndex), function (subResult) { return subResult.clean(); });
                subResults.push(next.clean(_.rest(path)));
                return new Result(subResults, this.expression, this.input);
            }
            else {
                return new Result(null, this.expression, this.input);
            }
        }
        if (this.value != null) {
            return new Result(this.value, this.expression, this.input);
        }
        if (this.subResults != null) {
            return new Result(_.map(this.subResults, function (subResult) { return subResult.clean(); }), this.expression, this.input);
        }
    };
    Result.prototype.clone = function () {
        if (this.value != null) {
            return new Result(this.value, this.expression, this.input);
        }
        if (this.subResults != null) {
            return new Result(_.map(this.subResults, function (subResult) { return subResult.clone(); }), this.expression, this.input);
        }
        return new Result(null, this.expression, this.input);
    };
    Result.prototype.toString = function () {
        if (this.value != null) {
            return this.value;
        }
        if (this.subResults != null) {
            return _.map(this.subResults, function (subresult) { return subresult.toString(); }).join('');
        }
        return this.input;
    };
    Result.prototype.getHumanReadable = function () {
        if (this.expression instanceof ExpressionConstant_1.ExpressionConstant) {
            return JSON.stringify(this.expression.value);
        }
        return this.expression.id;
    };
    return Result;
}());
exports.Result = Result;
var EndOfInputResult = /** @class */ (function (_super) {
    __extends(EndOfInputResult, _super);
    function EndOfInputResult(result) {
        var _this = _super.call(this, [result], ExpressionEndOfInput_1.ExpressionEndOfInput, result.input) || this;
        var endOfInput = new Result(null, ExpressionEndOfInput_1.ExpressionEndOfInput, result.input.substr(result.getLength()));
        endOfInput.parent = _this;
        _this.subResults.push(endOfInput);
        return _this;
    }
    return EndOfInputResult;
}(Result));
exports.EndOfInputResult = EndOfInputResult;


/***/ }),

/***/ 93:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Result_1 = __webpack_require__(40);
var Result_2 = __webpack_require__(40);
exports.notWordStart = ' ()[],$@\'"';
exports.notInWord = ' ()[],:';
exports.Basic = {
    basicExpressions: ['Word', 'DoubleQuoted'],
    grammars: {
        DoubleQuoted: '"[NotDoubleQuote]"',
        NotDoubleQuote: /[^"]*/,
        SingleQuoted: "'[NotSingleQuote]'",
        NotSingleQuote: /[^']*/,
        Number: /-?(0|[1-9]\d*)(\.\d+)?/,
        Word: function (input, end, expression) {
            var regex = new RegExp('[^' + exports.notWordStart.replace(/(.)/g, '\\$1') + '][^' + exports.notInWord.replace(/(.)/g, '\\$1') + ']*');
            var groups = input.match(regex);
            if (groups != null && groups.index != 0) {
                groups = null;
            }
            var result = new Result_1.Result(groups != null ? groups[0] : null, expression, input);
            if (result.isSuccess() && end && input.length > result.value.length) {
                return new Result_2.EndOfInputResult(result);
            }
            return result;
        }
    }
};


/***/ }),

/***/ 96:
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
var GlobalExports_1 = __webpack_require__(3);
var QueryEvents_1 = __webpack_require__(10);
var StandaloneSearchInterfaceEvents_1 = __webpack_require__(71);
var Assert_1 = __webpack_require__(5);
var Model_1 = __webpack_require__(15);
var QueryStateModel_1 = __webpack_require__(12);
var Strings_1 = __webpack_require__(7);
var Dom_1 = __webpack_require__(1);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var QueryboxQueryParameters_1 = __webpack_require__(352);
var MagicBox_1 = __webpack_require__(161);
var Grammar_1 = __webpack_require__(126);
var QueryboxOptionsProcessing_1 = __webpack_require__(355);
/**
 * The `Querybox` component renders an input which the end user can interact with to enter and submit queries.
 *
 * When the end user submits a search request, the `Querybox` component triggers a query and logs the corresponding
 * usage analytics data.
 *
 * For technical reasons, it is necessary to instantiate this component on a `div` element rather than on an `input`
 * element.
 *
 * See also the [`Searchbox`]{@link Searchbox} component, which can automatically instantiate a `Querybox` along with an
 * optional [`SearchButton`]{@link SearchButton} component.
 */
var Querybox = /** @class */ (function (_super) {
    __extends(Querybox, _super);
    /**
     * Creates a new `Querybox component`. Creates a new `Coveo.Magicbox` instance and wraps the Magicbox methods
     * (`onblur`, `onsubmit` etc.). Binds event on `buildingQuery` and before redirection (for standalone box).
     * @param element The HTMLElement on which to instantiate the component. This cannot be an HTMLInputElement for
     * technical reasons.
     * @param options The options for the `Querybox` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Querybox(element, options, bindings) {
        var _this = _super.call(this, element, Querybox.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        if (element instanceof HTMLInputElement) {
            _this.logger.error('Querybox cannot be used on an HTMLInputElement');
        }
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Querybox, options);
        new QueryboxOptionsProcessing_1.QueryboxOptionsProcessing(_this).postProcess();
        Dom_1.$$(_this.element).toggleClass('coveo-query-syntax-disabled', _this.options.enableQuerySyntax == false);
        _this.magicBox = MagicBox_1.createMagicBox(element, new Grammar_1.Grammar('Query', {
            Query: '[Term*][Spaces?]',
            Term: '[Spaces?][Word]',
            Spaces: / +/,
            Word: /[^ ]+/
        }), {
            inline: true
        });
        var input = Dom_1.$$(_this.magicBox.element).find('input');
        if (input) {
            Dom_1.$$(input).setAttribute('aria-label', _this.options.placeholder || Strings_1.l('Search'));
        }
        _this.bind.onRootElement(QueryEvents_1.QueryEvents.buildingQuery, function (args) { return _this.handleBuildingQuery(args); });
        _this.bind.onRootElement(StandaloneSearchInterfaceEvents_1.StandaloneSearchInterfaceEvents.beforeRedirect, function () { return _this.updateQueryState(); });
        _this.bind.onQueryState(Model_1.MODEL_EVENTS.CHANGE_ONE, QueryStateModel_1.QUERY_STATE_ATTRIBUTES.Q, function (args) {
            return _this.handleQueryStateChanged(args);
        });
        if (_this.options.enableSearchAsYouType) {
            Dom_1.$$(_this.element).addClass('coveo-search-as-you-type');
            _this.magicBox.onchange = function () {
                _this.searchAsYouType();
            };
        }
        _this.magicBox.onsubmit = function () {
            _this.submit();
        };
        _this.magicBox.onblur = function () {
            _this.updateQueryState();
        };
        _this.magicBox.onclear = function () {
            _this.updateQueryState();
            if (_this.options.triggerQueryOnClear) {
                _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxClear, {});
                _this.triggerNewQuery(false);
            }
        };
        return _this;
    }
    /**
     * Adds the current content of the input to the query and triggers a query if the current content of the input has
     * changed since last submit.
     *
     * Also logs the `serachboxSubmit` event in the usage analytics.
     */
    Querybox.prototype.submit = function () {
        this.magicBox.clearSuggestion();
        this.updateQueryState();
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxSubmit, {});
        this.triggerNewQuery(false);
    };
    /**
     * Sets the content of the input.
     *
     * @param text The string to set in the input.
     */
    Querybox.prototype.setText = function (text) {
        this.magicBox.setText(text);
        this.updateQueryState();
    };
    /**
     * Clears the content of the input.
     *
     * See also the [`triggerQueryOnClear`]{@link Querybox.options.triggerQueryOnClear} option.
     */
    Querybox.prototype.clear = function () {
        this.magicBox.clear();
    };
    /**
     * Gets the content of the input.
     *
     * @returns {string} The content of the input.
     */
    Querybox.prototype.getText = function () {
        return this.magicBox.getText();
    };
    /**
     * Gets the result from the input.
     *
     * @returns {Result} The result.
     */
    Querybox.prototype.getResult = function () {
        return this.magicBox.getResult();
    };
    /**
     * Gets the displayed result from the input.
     *
     * @returns {Result} The displayed result.
     */
    Querybox.prototype.getDisplayedResult = function () {
        return this.magicBox.getDisplayedResult();
    };
    /**
     * Gets the current cursor position in the input.
     *
     * @returns {number} The cursor position (index starts at 0).
     */
    Querybox.prototype.getCursor = function () {
        return this.magicBox.getCursor();
    };
    /**
     * Gets the result at cursor position.
     *
     * @param match {string | { (result): boolean }} The match condition.
     *
     * @returns {Result[]} The result.
     */
    Querybox.prototype.resultAtCursor = function (match) {
        return this.magicBox.resultAtCursor(match);
    };
    Querybox.prototype.handleBuildingQuery = function (args) {
        Assert_1.Assert.exists(args);
        Assert_1.Assert.exists(args.queryBuilder);
        this.updateQueryState();
        this.lastQuery = this.magicBox.getText();
        new QueryboxQueryParameters_1.QueryboxQueryParameters(this.options).addParameters(args.queryBuilder, this.lastQuery);
    };
    Querybox.prototype.triggerNewQuery = function (searchAsYouType) {
        clearTimeout(this.searchAsYouTypeTimeout);
        var text = this.magicBox.getText();
        if (this.lastQuery != text && text != null) {
            this.lastQuery = text;
            this.queryController.executeQuery({
                searchAsYouType: searchAsYouType,
                logInActionsHistory: true
            });
        }
    };
    Querybox.prototype.updateQueryState = function () {
        this.queryStateModel.set(QueryStateModel_1.QueryStateModel.attributesEnum.q, this.magicBox.getText());
    };
    Querybox.prototype.handleQueryStateChanged = function (args) {
        Assert_1.Assert.exists(args);
        var q = args.value;
        if (q != this.magicBox.getText()) {
            this.magicBox.setText(q);
        }
    };
    Querybox.prototype.searchAsYouType = function () {
        var _this = this;
        clearTimeout(this.searchAsYouTypeTimeout);
        this.searchAsYouTypeTimeout = window.setTimeout(function () {
            _this.usageAnalytics.logSearchAsYouType(AnalyticsActionListMeta_1.analyticsActionCauseList.searchboxAsYouType, {});
            _this.triggerNewQuery(true);
        }, this.options.searchAsYouTypeDelay);
    };
    Querybox.ID = 'Querybox';
    Querybox.doExport = function () {
        GlobalExports_1.exportGlobally({
            Querybox: Querybox,
            QueryboxQueryParameters: QueryboxQueryParameters_1.QueryboxQueryParameters
        });
    };
    /**
     * The options for the Querybox.
     * @componentOptions
     */
    Querybox.options = {
        /**
         * Specifies whether to enable the search-as-you-type feature.
         *
         * Default value is `false`.
         */
        enableSearchAsYouType: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'SearchAsYouType' }),
        /**
         * If the [`enableSearchAsYouType`]{@link Querybox.options.enableSearchAsYouType} option is `true`, specifies how
         * long to wait (in milliseconds) between each key press before triggering a new query.
         *
         * Default value is `50`. Minimum value is `0`
         */
        searchAsYouTypeDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 50, min: 0, section: 'SearchAsYouType' }),
        /**
         * Specifies whether to interpret special query syntax (e.g., `@objecttype=message`) when the end user types
         * a query in the `Querybox` (see
         * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)). Setting this
         * option to `true` also causes the `Querybox` to highlight any query syntax.
         *
         * Regardless of the value of this option, the Coveo Cloud REST Search API always interprets expressions surrounded
         * by double quotes (`"`) as exact phrase match requests.
         *
         * See also [`enableLowercaseOperators`]{@link Querybox.options.enableLowercaseOperators}.
         *
         * **Notes:**
         * > * End user preferences can override the value you specify for this option.
         * >
         * > If the end user selects a value other than **Automatic** for the **Enable query syntax** setting (see
         * > the [`enableQuerySyntax`]{@link ResultsPreferences.options.enableQuerySyntax} option of the
         * > [`ResultsPreferences`]{@link ResultsPreferences} component), the end user preference takes precedence over this
         * > option.
         * >
         * > * On-premises versions of the Coveo Search API require this option to be set to `true` in order to interpret
         * > expressions surrounded by double quotes (`"`) as exact phrase match requests.
         *
         * Default value is `false`.
         */
        enableQuerySyntax: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'QuerySyntax' }),
        /**
         * Specifies whether to expand basic expression keywords containing wildcards characters (`*`) to the possible
         * matching keywords in order to broaden the query (see
         * [Using Wildcards in Queries](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=359)).
         *
         * See also [`enableQuestionMarks`]{@link Querybox.options.enableQuestionMarks}.
         *
         *  **Note:**
         * > If you are using an on-premises version of the Coveo Search API, you need to set the
         * > [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option to `true` to be able to set
         * > `enableWildcards` to `true`.
         *
         * Default value is `false`.
         */
        enableWildcards: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, section: 'QuerySyntax' }),
        /**
         * If [`enableWildcards`]{@link Querybox.options.enableWildcards} is `true`, specifies whether to expand basic
         * expression keywords containing question mark characters (`?`) to the possible matching keywords in order to
         * broaden the query (see
         * [Using Wildcards in Queries](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=359)).
         *
         * **Note:**
         * > If you are using an on-premises version of the Coveo Search API, you also need to set the
         * > [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option to `true` in order to be able to set
         * > `enableQuestionMarks` to `true`.
         *
         * Default value is `false`.
         */
        enableQuestionMarks: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableWildcards' }),
        /**
         * If the [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option is `true`, specifies whether to
         * interpret the `AND`, `NOT`, `OR`, and `NEAR` keywords in the `Querybox` as query operators in the query, even if
         * the end user types those keywords in lowercase.
         *
         * This option applies to all query operators (see
         * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
         *
         * **Example:**
         * > If this option and the `enableQuerySyntax` option are both `true`, the Coveo Platform interprets the `near`
         * > keyword in a query such as `service center near me` as the `NEAR` query operator (not as a query term).
         *
         * > Otherwise, if the `enableQuerySyntax` option is `true` and this option is `false`, the end user has to type the
         * > `NEAR` keyword in uppercase for the Coveo Platform to interpret it as a query operator.
         *
         * Default value is `false`.
         */
        enableLowercaseOperators: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false, depend: 'enableQuerySyntax' }),
        /**
         * Whether to convert a basic expression containing at least a certain number of keywords (see the
         * [`partialMatchKeywords`]{@link Querybox.options.partialMatchKeywords} option) to a *partial match expression*, so
         * that items containing at least a certain number of those keywords (see the
         * [`partialMatchThreshold`]{@link Querybox.options.partialMatchThreshold} option) will match the expression.
         *
         * **Notes:**
         *
         * > - Only the basic expression of the query (see [`q`]{@link q}) can be converted to a partial match expression.
         * > - When the [`enableQuerySyntax`]{@link Querybox.options.enableQuerySyntax} option is set to `true`, this
         * > feature has no effect on a basic expression containing query syntax (field expressions, operators, etc.).
         *
         * **Example:**
         *
         * > With the following markup configuration, if a basic expression contains at least 4 keywords, items containing
         * > at least 75% of those keywords (round up) will match the query.
         * > ```html
         * > <div class='CoveoQuerybox' data-enable-partial-match='true' data-partial-match-keywords='4' data-partial-match-threshold='75%'></div>
         * > ```
         * > For instance, if the basic expression is `Coveo custom component configuration help`, items containing
         * > all 5 of those keywords, or 4 of them (75% of 5 rounded up) will match the query.
         *
         * Default value is `false`, which implies that an item must contain all of the basic expression keywords to match
         * the query.
         * @notSupportedIn salesforcefree
         */
        enablePartialMatch: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * The minimum number of keywords that need to be present in a basic expression to convert it to a partial match
         * expression.
         *
         * See also the [`partialMatchThreshold`]{@link Querybox.options.partialMatchThreshold} option.
         *
         * **Notes:**
         * > - This option has no meaning unless the [`enablePartialMatch`]{@link Querybox.options.enablePartialMatch}
         * > option is set to `true`.
         * > - Repeated keywords in a basic expression count as a single keyword.
         * > - Thesaurus expansions in a basic expression count towards the `partialMatchKeywords` count.
         * > - Stemming expansions **do not** count towards the `partialMatchKeywords` count.
         *
         * **Example:**
         * > If the `partialMatchKeywords` value is `7`, the basic expression will have to contain at least 7 keywords
         * > to be converted to a partial match expression.
         *
         * Default value is `5`.
         * @notSupportedIn salesforcefree
         */
        partialMatchKeywords: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1, depend: 'enablePartialMatch' }),
        /**
         * An absolute or relative value indicating the minimum number (rounded up) of partial match expression keywords an
         * item must contain to match the expression.
         *
         * See also the [`partialMatchKeywords`]{@link Querybox.options.partialMatchKeywords} option.
         *
         * **Notes:**
         * > - This option has no meaning unless the [`enablePartialMatch`]{@link Querybox.options.enablePartialMatch}
         * > option is set to `true`.
         * > - A keyword and its stemming expansions count as a single keyword when evaluating whether an item meets the
         * > `partialMatchThreshold`.
         *
         * **Examples:**
         * > If the `partialMatchThreshold` value is `50%` and the partial match expression contains exactly 9 keywords,
         * > items will have to contain at least 5 of those keywords to match the query (50% of 9, rounded up).
         *
         * > With the same configuration, if the partial match expression contains exactly 12 keywords, items will have to
         * > contain at least 6 of those keywords to match the query (50% of 12).
         *
         * > If the `partialMatchThreshold` value is `2`, items will always have to contain at least 2 of the partial match
         * > expression keywords to match the query, no matter how many keywords the partial match expression actually
         * > contains.
         *
         * Default value is `50%`.
         * @notSupportedIn salesforcefree
         */
        partialMatchThreshold: ComponentOptions_1.ComponentOptions.buildStringOption({ defaultValue: '50%', depend: 'enablePartialMatch' }),
        /**
         * Specifies whether to trigger a query when clearing the `Querybox`.
         *
         * Default value is `false`.
         */
        triggerQueryOnClear: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false })
    };
    return Querybox;
}(Component_1.Component));
exports.Querybox = Querybox;
Initialization_1.Initialization.registerAutoCreateComponent(Querybox);


/***/ })

});
//# sourceMappingURL=Querybox__f056675ccb969b1e6859.js.map