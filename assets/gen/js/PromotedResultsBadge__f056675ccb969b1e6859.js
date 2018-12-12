webpackJsonpCoveo__temporary([66],{

/***/ 227:
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
var Component_1 = __webpack_require__(6);
var Core_1 = __webpack_require__(49);
var GlobalExports_1 = __webpack_require__(3);
__webpack_require__(489);
/**
 * The `PromotedResultsBadge` component adds a badge to promoted results in your interface.
 *
 * To be considered promoted, a result needs to either:
 * - be a Featured Result configured through a Coveo Query Pipeline (see [Managing Query Pipeline Featured Results](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=126))
 * - be a recommended result by Coveo Machine Learning (see [Coveo Machine Learning Features](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=183)).
 *
 * You can add this component anywhere in your search interface. The component will then add a badge to your results after they have been rendered.
 */
var PromotedResultsBadge = /** @class */ (function (_super) {
    __extends(PromotedResultsBadge, _super);
    function PromotedResultsBadge(element, options, bindings) {
        var _this = _super.call(this, element, PromotedResultsBadge.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.options = Core_1.ComponentOptions.initComponentOptions(element, PromotedResultsBadge, options);
        _this.bind.onRootElement(Core_1.ResultListEvents.newResultDisplayed, function (args) {
            var badge = _this.buildBadge(args.result, args.item);
            if (badge) {
                _this.appendBadge(badge, args.item);
            }
        });
        return _this;
    }
    PromotedResultsBadge.prototype.buildBadge = function (result, resultElement) {
        if (!this.shouldShowABadge(result, resultElement)) {
            return null;
        }
        var badge = Core_1.$$('div', {
            className: this.getClassName(result)
        });
        this.applyTagline(result, badge);
        this.applyColor(result, badge);
        return badge;
    };
    PromotedResultsBadge.prototype.appendBadge = function (badge, resultElement) {
        if (this.isCardLayout(resultElement)) {
            this.addBadgeToCardLayout(badge, resultElement);
        }
        else {
            Core_1.$$(resultElement).prepend(badge.el);
        }
    };
    PromotedResultsBadge.prototype.addBadgeToCardLayout = function (badge, resultElement) {
        var container;
        if (resultElement.parentElement == null) {
            container = Core_1.$$('div', {
                className: 'coveo-promoted-result-badge-container-card-layout'
            });
            container.insertBefore(resultElement);
        }
        else {
            container = Core_1.$$(resultElement.parentElement);
        }
        container.append(badge.el);
        container.append(resultElement);
    };
    PromotedResultsBadge.prototype.applyColor = function (result, badge) {
        if (this.isFeatured(result) && this.options.colorForFeaturedResults) {
            badge.el.style.backgroundColor = this.options.colorForFeaturedResults;
        }
        if (this.isRecommended(result) && this.options.colorForRecommendedResults) {
            badge.el.style.backgroundColor = this.options.colorForRecommendedResults;
        }
    };
    PromotedResultsBadge.prototype.applyTagline = function (result, badge) {
        if (this.isFeatured(result) && this.options.showBadgeForFeaturedResults) {
            badge.text(this.options.captionForFeatured);
        }
        if (this.isRecommended(result) && this.options.showBadgeForRecommendedResults) {
            return badge.text(this.options.captionForRecommended);
        }
    };
    PromotedResultsBadge.prototype.isFeatured = function (result) {
        return result.isTopResult;
    };
    PromotedResultsBadge.prototype.isRecommended = function (result) {
        return result.isRecommendation && !result.isTopResult;
    };
    PromotedResultsBadge.prototype.isTableLayout = function (resultElement) {
        return Core_1.$$(resultElement).hasClass('coveo-table-layout');
    };
    PromotedResultsBadge.prototype.isCardLayout = function (resultElement) {
        return Core_1.$$(resultElement).hasClass('coveo-card-layout');
    };
    PromotedResultsBadge.prototype.getClassName = function (result) {
        return "coveo-promoted-result-badge coveo-" + (this.isFeatured(result) ? 'featured' : 'recommended') + "-result-badge";
    };
    PromotedResultsBadge.prototype.shouldShowABadge = function (result, resultElement) {
        if (this.isTableLayout(resultElement)) {
            return false;
        }
        if (this.isFeatured(result) && this.options.showBadgeForFeaturedResults) {
            return true;
        }
        if (this.isRecommended(result) && this.options.showBadgeForRecommendedResults) {
            return true;
        }
        return false;
    };
    PromotedResultsBadge.ID = 'PromotedResultsBadge';
    PromotedResultsBadge.doExport = function () {
        GlobalExports_1.exportGlobally({
            PromotedResultsBadge: PromotedResultsBadge
        });
    };
    /**
     * @componentOptions
     */
    PromotedResultsBadge.options = {
        /**
         * Specifies if a badge should be added to "Featured Results" configured through a [Coveo Query Pipeline](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=126).
         *
         * Default value is `true`.
         */
        showBadgeForFeaturedResults: Core_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Specifies if a badge should be added to "Recommended Results" returned by a [Coveo Machine Learning algorithm](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=183).
         *
         * Default value is `false`.
         */
        showBadgeForRecommendedResults: Core_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * Specifies the caption that should be used for "Recommended Results".
         *
         * Default value is the localized string for `Recommended`.
         */
        captionForRecommended: Core_1.ComponentOptions.buildLocalizedStringOption({
            defaultValue: Core_1.l('Recommended'),
            depend: 'showBadgeForRecommendedResults'
        }),
        /**
         * Specifies the caption that should be used for "Featured Results".
         *
         * Default value is the localized string for `Featured`.
         */
        captionForFeatured: Core_1.ComponentOptions.buildLocalizedStringOption({ defaultValue: Core_1.l('Featured'), depend: 'showBadgeForFeaturedResults' }),
        /**
         * Specifies the color that should be used for "Featured Results".
         *
         * This can be specified using:
         * - a hexadecimal value (e.g., `#f58020`)
         * - an RGB value (e.g., `rgb(125,10,36)`)
         * - a CSS color name (e.g., `red`)
         *
         * Default value is `undefined`, and is controlled through the default stylesheet of the framework.
         */
        colorForFeaturedResults: Core_1.ComponentOptions.buildColorOption({ depend: 'showBadgeForFeaturedResults' }),
        /**
         * Specifies the color that should be used for "Recommended Results".
         *
         * This can be specified using:
         * - a hexadecimal value (e.g., `#f58020`)
         * - an RGB value (e.g., `rgb(125,10,36)`)
         * - a CSS color name (e.g., `red`)
         *
         * Default value is `undefined`, and is controlled through the default stylesheet of the framework.
         */
        colorForRecommendedResults: Core_1.ComponentOptions.buildColorOption({ depend: 'showBadgeForRecommendedResults' })
    };
    return PromotedResultsBadge;
}(Component_1.Component));
exports.PromotedResultsBadge = PromotedResultsBadge;
Core_1.Initialization.registerAutoCreateComponent(PromotedResultsBadge);


/***/ }),

/***/ 489:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=PromotedResultsBadge__f056675ccb969b1e6859.js.map