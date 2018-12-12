webpackJsonpCoveo__temporary([29],{

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _ = __webpack_require__(0);
var SVGDom = /** @class */ (function () {
    function SVGDom() {
    }
    SVGDom.addClassToSVGInContainer = function (svgContainer, classToAdd) {
        var svgElement = svgContainer.querySelector('svg');
        svgElement.setAttribute('class', "" + SVGDom.getClass(svgElement) + classToAdd);
    };
    SVGDom.removeClassFromSVGInContainer = function (svgContainer, classToRemove) {
        var svgElement = svgContainer.querySelector('svg');
        svgElement.setAttribute('class', SVGDom.getClass(svgElement).replace(classToRemove, ''));
    };
    SVGDom.addStyleToSVGInContainer = function (svgContainer, styleToAdd) {
        var svgElement = svgContainer.querySelector('svg');
        _.each(styleToAdd, function (styleValue, styleKey) {
            svgElement.style[styleKey] = styleValue;
        });
    };
    SVGDom.getClass = function (svgElement) {
        var className = svgElement.getAttribute('class');
        return className ? className + ' ' : '';
    };
    return SVGDom;
}());
exports.SVGDom = SVGDom;


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

/***/ 210:
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
__webpack_require__(473);
var GlobalExports_1 = __webpack_require__(3);
var AccessibleButton_1 = __webpack_require__(17);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(14);
var SVGIcons_1 = __webpack_require__(13);
var Utils_1 = __webpack_require__(4);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var RatingValues;
(function (RatingValues) {
    RatingValues[RatingValues["Undefined"] = 0] = "Undefined";
    RatingValues[RatingValues["Lowest"] = 1] = "Lowest";
    RatingValues[RatingValues["Low"] = 2] = "Low";
    RatingValues[RatingValues["Average"] = 3] = "Average";
    RatingValues[RatingValues["Good"] = 4] = "Good";
    RatingValues[RatingValues["Best"] = 5] = "Best";
})(RatingValues = exports.RatingValues || (exports.RatingValues = {}));
/**
 * The `ResultRating` component renders a 5-star rating widget. Interactive rating is possible if
 * the [`enableCollaborativeRating`]{@link SearchInterface.options.enableCollaborativeRating} option of your
 * search interface is `true`, and if collaborative rating is enabled on your Coveo index.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * @notSupportedIn salesforcefree
 */
var ResultRating = /** @class */ (function (_super) {
    __extends(ResultRating, _super);
    /**
     * Creates a new `ResultRating` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `ResultRating` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function ResultRating(element, options, bindings, result) {
        var _this = _super.call(this, element, ResultRating.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ResultRating, options);
        if (!Utils_1.Utils.isNullOrUndefined(result.rating)) {
            _this.renderComponent(element, result.rating);
        }
        return _this;
    }
    ResultRating.prototype.renderComponent = function (element, rating) {
        for (var starNumber = 1; starNumber <= 5; starNumber++) {
            this.renderStar(element, starNumber <= rating, starNumber);
        }
    };
    ResultRating.prototype.renderStar = function (element, isChecked, value) {
        var _this = this;
        var star;
        var starElement = Dom_1.$$(element).find('a[rating-value="' + value + '"]');
        if (starElement == null) {
            star = Dom_1.$$('a', { className: 'coveo-result-rating-star' }, SVGIcons_1.SVGIcons.icons.star);
            SVGDom_1.SVGDom.addClassToSVGInContainer(star.el, 'coveo-result-rating-star-svg');
            element.appendChild(star.el);
            if (this.bindings.searchInterface.options.enableCollaborativeRating) {
                new AccessibleButton_1.AccessibleButton()
                    .withElement(star)
                    .withSelectAction(function (e) {
                    var targetElement = e.currentTarget;
                    _this.rateDocument(parseInt(targetElement.getAttribute('rating-value')));
                })
                    .withLabel(value.toString())
                    .build();
                star.on('mouseover', function (e) {
                    var targetElement = e.currentTarget;
                    _this.renderComponent(element, parseInt(targetElement.getAttribute('rating-value')));
                });
                star.on('mouseout', function () {
                    _this.renderComponent(element, _this.result.rating);
                });
            }
            star.el.setAttribute('rating-value', value.toString());
        }
        else {
            star = Dom_1.$$(starElement);
        }
        star.toggleClass('coveo-result-rating-star-active', isChecked);
    };
    /**
     * Rates an item using the the specified `rating` value.
     * @param rating The rating to assign to the item.
     *
     * The possible values are:
     *
     * - `0`: renders no star.
     * - `1`: renders 1 star.
     * - `2`: renders 2 stars.
     * - `3`: renders 3 stars.
     * - `4`: renders 4 stars.
     * - `5`: renders 5 stars.
     */
    ResultRating.prototype.rateDocument = function (rating) {
        var _this = this;
        var request = {
            rating: RatingValues[rating],
            uniqueId: this.result.uniqueId
        };
        this.queryController
            .getEndpoint()
            .rateDocument(request)
            .then(function () {
            _this.result.rating = rating;
            _this.renderComponent(_this.element, rating);
        })
            .catch(function () {
            _this.logger.error('An error occurred while rating the item');
        });
    };
    ResultRating.ID = 'ResultRating';
    ResultRating.doExport = function () {
        GlobalExports_1.exportGlobally({
            ResultRating: ResultRating
        });
    };
    return ResultRating;
}(Component_1.Component));
exports.ResultRating = ResultRating;
Initialization_1.Initialization.registerAutoCreateComponent(ResultRating);


/***/ }),

/***/ 367:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 473:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=ResultRating__f056675ccb969b1e6859.js.map