webpackJsonpCoveo__temporary([66],{

/***/ 287:
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
__webpack_require__(674);
var Core_1 = __webpack_require__(20);
var GlobalExports_1 = __webpack_require__(3);
var Component_1 = __webpack_require__(7);
/**
 * Depending on its configuration, this component will render badges on query result items whose ranking scores were increased by [featured results](https://docs.coveo.com/en/1961/) query pipeline rules and/or [Coveo ML ART](https://docs.coveo.com/en/1671/#automatic-relevance-tuning-art-feature).
 *
 * This component can be put anywhere in the markup configuration of a search interface. However, it is meant to be initialized only once, and should thus never be included in a result template.
 *
 * @externaldocs [Adding Promoted Results Badges](https://docs.coveo.com/en/3123/)
 * @availablesince [July 2018 Release (v2.4382.10)](https://docs.coveo.com/en/1360/)
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
         * Whether to show a badge when a result was promoted by a featured results query pipeline rule.
         */
        showBadgeForFeaturedResults: Core_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
        /**
         * Whether to show a badge when a result was promoted by Coveo ML ART.
         */
        showBadgeForRecommendedResults: Core_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
        /**
         * The caption to show on the badge for results promoted by Coveo ML ART.
         *
         * Default value is the localized string for `Recommended`.
         *
         * @examples Recommended by Coveo ML
         */
        captionForRecommended: Core_1.ComponentOptions.buildLocalizedStringOption({
            localizedString: function () { return Core_1.l('Recommended'); },
            depend: 'showBadgeForRecommendedResults'
        }),
        /**
         * The caption to show on the badge for results promoted by a _featured results_ query pipeline rule.
         *
         * Default value is the localized string for `Featured`.
         *
         * @examples Recommended by ACME
         */
        captionForFeatured: Core_1.ComponentOptions.buildLocalizedStringOption({
            localizedString: function () { return Core_1.l('Featured'); },
            depend: 'showBadgeForFeaturedResults'
        }),
        /**
         * The badge color for results promoted by a _featured results_ query pipeline rule.
         *
         * Can be specified using:
         * - a hexadecimal value
         * - an RGB value
         * - a CSS color name
         *
         * @examples #f58020, rgb(125 10 36), red
         *
         * Default value is controlled through the default stylesheet of the framework.
         */
        colorForFeaturedResults: Core_1.ComponentOptions.buildColorOption({ depend: 'showBadgeForFeaturedResults' }),
        /**
         * The badge color for results promoted by Coveo ML ART.
         *
         * Can be specified using:
         * - a hexadecimal value
         * - an RGB value
         * - a CSS color name
         *
         * @examples #f58020, rgb(125 10 36), red
         *
         * Default value is controlled through the default stylesheet of the framework.
         */
        colorForRecommendedResults: Core_1.ComponentOptions.buildColorOption({ depend: 'showBadgeForRecommendedResults' })
    };
    return PromotedResultsBadge;
}(Component_1.Component));
exports.PromotedResultsBadge = PromotedResultsBadge;
Core_1.Initialization.registerAutoCreateComponent(PromotedResultsBadge);


/***/ }),

/***/ 674:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=PromotedResultsBadge__36d30dcb7330ecf06f4d.js.map