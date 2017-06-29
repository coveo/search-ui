webpackJsonpCoveo__temporary([8,67],{

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SVGIcons = (function () {
    function SVGIcons() {
    }
    return SVGIcons;
}());
SVGIcons.search = __webpack_require__(466);
SVGIcons.more = __webpack_require__(464);
SVGIcons.loading = __webpack_require__(462);
SVGIcons.checkboxHookExclusionMore = __webpack_require__(451);
SVGIcons.arrowUp = __webpack_require__(449);
SVGIcons.arrowDown = __webpack_require__(448);
SVGIcons.mainClear = __webpack_require__(463);
SVGIcons.orAnd = __webpack_require__(465);
SVGIcons.sort = __webpack_require__(467);
SVGIcons.ascending = __webpack_require__(450);
SVGIcons.descending = __webpack_require__(452);
SVGIcons.dropdownMore = __webpack_require__(457);
SVGIcons.dropdownLess = __webpack_require__(456);
SVGIcons.facetCollapse = __webpack_require__(460);
SVGIcons.facetExpand = __webpack_require__(461);
SVGIcons.dropdownShareQuery = __webpack_require__(459);
SVGIcons.dropdownPreferences = __webpack_require__(458);
SVGIcons.dropdownAuthenticate = __webpack_require__(453);
SVGIcons.dropdownExport = __webpack_require__(454);
SVGIcons.dropdownFollowQuery = __webpack_require__(455);
exports.SVGIcons = SVGIcons;


/***/ }),

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SVGDom = (function () {
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
    SVGDom.getClass = function (svgElement) {
        var className = svgElement.getAttribute('class');
        return className ? className + ' ' : '';
    };
    return SVGDom;
}());
exports.SVGDom = SVGDom;


/***/ }),

/***/ 301:
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
var QueryUtils_1 = __webpack_require__(17);
var Initialization_1 = __webpack_require__(2);
var FieldValue_1 = __webpack_require__(98);
var Dom_1 = __webpack_require__(3);
var KeyboardUtils_1 = __webpack_require__(22);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
__webpack_require__(580);
var SVGIcons_1 = __webpack_require__(21);
var SVGDom_1 = __webpack_require__(28);
/**
 * The FieldTable component displays a set of {@link FieldValue} components in a table that can optionally be
 * expandable and minimizable. This component automatically takes care of not displaying empty field values.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * **Example:**
 *
 * ```
 * // This is the FieldTable component itself, which holds a list of table rows.
 * // Each row is a FieldValue component.
 * <table class='CoveoFieldTable'>
 *    // Items
 *    <tr data-field='@sysdate' data-caption='Date' data-helper='dateTime' />
 *    <tr data-field='@sysauthor' data-caption='Author' />
 *    <tr data-field='@clickuri' data-html-value='true' data-caption='URL' data-helper='anchor' data-helper-options='{text: \"<%= raw.syssource %>\" , target:\"_blank\"}'>
 * </table>
 * ```
 */
var FieldTable = (function (_super) {
    __extends(FieldTable, _super);
    /**
     * Creates a new FieldTable.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the FieldTable component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function FieldTable(element, options, bindings, result) {
        var _this = _super.call(this, element, ValueRow.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, FieldTable, options);
        var rows = Dom_1.$$(_this.element).findAll('tr[data-field]');
        _.each(rows, function (e) {
            new ValueRow(e, {}, bindings, result);
        });
        if (Dom_1.$$(_this.element).find('tr') == null) {
            Dom_1.$$(element).detach();
        }
        if (_this.isTogglable()) {
            _this.toggleContainer = Dom_1.$$('div', { className: 'coveo-field-table-toggle-container' }).el;
            _this.buildToggle();
            Dom_1.$$(_this.toggleContainer).insertBefore(_this.element);
            _this.toggleContainer.appendChild(_this.element);
            _this.toggleContainer.appendChild(_this.toggleButtonInsideTable);
        }
        else {
            _this.isExpanded = true;
        }
        return _this;
    }
    /**
     * Toggles between expanding (showing) and minimizing (collapsing) the FieldTable.
     *
     * @param anim Specifies whether to show a sliding animation when toggling the display of the FieldTable.
     */
    FieldTable.prototype.toggle = function (anim) {
        if (anim === void 0) { anim = false; }
        if (this.isTogglable()) {
            this.isExpanded = !this.isExpanded;
            this.isExpanded ? this.expand(anim) : this.minimize(anim);
        }
    };
    /**
     * Expands (shows) the FieldTable,
     * @param anim Specifies whether to show a sliding animation when expanding the FieldTable.
     */
    FieldTable.prototype.expand = function (anim) {
        if (anim === void 0) { anim = false; }
        if (this.isTogglable()) {
            this.isExpanded = true;
            this.toggleCaption.textContent = this.options.expandedTitle;
            SVGDom_1.SVGDom.addClassToSVGInContainer(this.toggleButtonSVGContainer, 'coveo-opened');
            SVGDom_1.SVGDom.addClassToSVGInContainer(this.toggleButtonInsideTable, 'coveo-opened');
            anim ? this.slideToggle(true) : this.slideToggle(true, false);
        }
    };
    /**
     * Minimizes (collapses) the FieldTable.
     * @param anim Specifies whether to show a sliding animation when minimizing the FieldTable.
     */
    FieldTable.prototype.minimize = function (anim) {
        if (anim === void 0) { anim = false; }
        if (this.isTogglable()) {
            this.isExpanded = false;
            this.toggleCaption.textContent = this.options.minimizedTitle;
            SVGDom_1.SVGDom.removeClassFromSVGInContainer(this.toggleButtonSVGContainer, 'coveo-opened');
            SVGDom_1.SVGDom.removeClassFromSVGInContainer(this.toggleButtonInsideTable, 'coveo-opened');
            anim ? this.slideToggle(false) : this.slideToggle(false, false);
        }
    };
    /**
     * Updates the toggle height if the content was dynamically resized, so that the expanding and minimizing animation
     * can match the new content size.
     */
    FieldTable.prototype.updateToggleHeight = function () {
        this.updateToggleContainerHeight();
        this.isExpanded ? this.expand() : this.minimize();
    };
    FieldTable.prototype.isTogglable = function () {
        if (this.searchInterface.isNewDesign() && this.options.allowMinimization) {
            return true;
        }
        else if (!this.searchInterface.isNewDesign()) {
            this.logger.trace('Cannot open or close the field table with older design', this);
        }
        return false;
    };
    FieldTable.prototype.buildToggle = function () {
        var _this = this;
        this.toggleCaption = Dom_1.$$('span', { className: 'coveo-field-table-toggle-caption', tabindex: 0 }).el;
        this.toggleButton = Dom_1.$$('div', { className: 'coveo-field-table-toggle coveo-field-table-toggle-down' }).el;
        this.toggleButtonSVGContainer = Dom_1.$$('span', null, SVGIcons_1.SVGIcons.arrowDown).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.toggleButtonSVGContainer, 'coveo-field-table-toggle-down-svg');
        this.toggleButton.appendChild(this.toggleCaption);
        this.toggleButton.appendChild(this.toggleButtonSVGContainer);
        Dom_1.$$(this.toggleButton).insertBefore(this.element);
        this.toggleButtonInsideTable = Dom_1.$$('span', { className: 'coveo-field-table-toggle coveo-field-table-toggle-up' }, SVGIcons_1.SVGIcons.arrowUp).el;
        SVGDom_1.SVGDom.addClassToSVGInContainer(this.toggleButtonInsideTable, 'coveo-field-table-toggle-up-svg');
        if (this.options.minimizedByDefault === true) {
            this.isExpanded = false;
        }
        else if (this.options.minimizedByDefault === false) {
            this.isExpanded = true;
        }
        else {
            this.isExpanded = !QueryUtils_1.QueryUtils.hasExcerpt(this.result);
        }
        setTimeout(function () {
            _this.updateToggleHeight();
        }); // Wait until toggleContainer.scrollHeight is computed.
        var toggleAction = function () { return _this.toggle(true); };
        Dom_1.$$(this.toggleButton).on('click', toggleAction);
        Dom_1.$$(this.toggleButtonInsideTable).on('click', toggleAction);
        Dom_1.$$(this.toggleButton).on('keyup', KeyboardUtils_1.KeyboardUtils.keypressAction(KeyboardUtils_1.KEYBOARD.ENTER, toggleAction));
    };
    FieldTable.prototype.slideToggle = function (visible, anim) {
        if (visible === void 0) { visible = true; }
        if (anim === void 0) { anim = true; }
        if (!anim) {
            Dom_1.$$(this.toggleContainer).addClass('coveo-no-transition');
        }
        if (visible) {
            this.toggleContainer.style.display = 'block';
            this.toggleContainer.style.height = this.toggleContainerHeight + 'px';
        }
        else {
            this.toggleContainer.style.height = this.toggleContainerHeight + 'px';
            this.toggleContainer.style.height = '0';
        }
        if (!anim) {
            this.toggleContainer.offsetHeight; // Force reflow
            Dom_1.$$(this.toggleContainer).removeClass('coveo-no-transition');
        }
    };
    FieldTable.prototype.updateToggleContainerHeight = function () {
        this.toggleContainerHeight = this.toggleContainer.scrollHeight;
    };
    return FieldTable;
}(Component_1.Component));
FieldTable.ID = 'FieldTable';
FieldTable.doExport = function () {
    GlobalExports_1.exportGlobally({
        'FieldTable': FieldTable,
        'FieldValue': FieldValue_1.FieldValue
    });
};
/**
 * The options for the component
 * @componentOptions
 */
FieldTable.options = {
    /**
     * Specifies whether to allow the minimization (collapsing) of the FieldTable.
     *
     * If you set this option to `false`, the component will not create the **Minimize** / **Expand** toggle links.
     *
     * See also {@link FieldTable.options.expandedTitle}, {@link FieldTable.options.minimizedTitle} and
     * {@link FieldTable.options.minimizedByDefault}.
     *
     * Default value is `true`.
     */
    allowMinimization: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * If {@link FieldTable.options.allowMinimization} is `true`, specifies the caption to show on the **Minimize** link
     * (the link that appears when the FieldTable is expanded).
     *
     * Default value is `"Details"`.
     */
    expandedTitle: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ defaultValue: 'Details', depend: 'allowMinimization' }),
    /**
     * If {@link FieldTable.options.allowMinimization} is `true`, specifies the caption to show on the **Expand** link
     * (the link that appears when the FieldTable is minimized).
     *
     * Default value is `"Details"`.
     */
    minimizedTitle: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption({ defaultValue: 'Details', depend: 'allowMinimization' }),
    /**
     * If {@link FieldTable.options.allowMinimization} is `true`, specifies whether to minimize the table by default.
     *
     * Default value is `undefined`, and the FieldTable will collapse by default if the result it is associated with has
     * a non-empty excerpt.
     */
    minimizedByDefault: ComponentOptions_1.ComponentOptions.buildBooleanOption({ depend: 'allowMinimization' })
};
exports.FieldTable = FieldTable;
Initialization_1.Initialization.registerAutoCreateComponent(FieldTable);
var ValueRow = (function (_super) {
    __extends(ValueRow, _super);
    function ValueRow(element, options, bindings, result) {
        var _this = _super.call(this, element, options, bindings, result, ValueRow.ID) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, ValueRow, options);
        var caption = Dom_1.$$('th').el;
        caption.appendChild(document.createTextNode(_this.options.caption.toLocaleString()));
        _this.element.insertBefore(caption, _this.getValueContainer());
        return _this;
    }
    ValueRow.prototype.getValueContainer = function () {
        if (this.valueContainer == null) {
            this.valueContainer = document.createElement('td');
            this.element.appendChild(this.valueContainer);
        }
        return this.valueContainer;
    };
    return ValueRow;
}(FieldValue_1.FieldValue));
ValueRow.ID = 'ValueRow';
ValueRow.options = {
    caption: ComponentOptions_1.ComponentOptions.buildStringOption({ postProcessing: function (value, options) { return value || options.field.substr(1); } })
};
ValueRow.parent = FieldValue_1.FieldValue;


/***/ }),

/***/ 448:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 10 6\" viewBox=\"0 0 10 6\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m5 5.932c-.222 0-.443-.084-.612-.253l-4.134-4.134c-.338-.338-.338-.886 0-1.224s.886-.338 1.224 0l3.522 3.521 3.523-3.521c.336-.338.886-.338 1.224 0s .337.886-.001 1.224l-4.135 4.134c-.168.169-.39.253-.611.253z\"></path></g></svg>"

/***/ }),

/***/ 449:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 10 6\" viewBox=\"0 0 10 6\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m5 .068c.222 0 .443.084.612.253l4.134 4.134c.338.338.338.886 0 1.224s-.886.338-1.224 0l-3.522-3.521-3.523 3.521c-.336.338-.886.338-1.224 0s-.337-.886.001-1.224l4.134-4.134c.168-.169.39-.253.612-.253z\"></path></g></svg>"

/***/ }),

/***/ 450:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 15 12\" viewBox=\"0 0 15 12\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m10.936 2.021 0 0c0 .549-.452.998-1.004.998h-1.004c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h1.004c.552 0 1.004.449 1.004.998z\"></path><path class=\"coveo-active-shape-svg\" d=\"m12.943 5.015 0 0c0 .549-.452.998-1.004.998h-3.011c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h3.011c.553 0 1.004.449 1.004.998z\"></path><path class=\"coveo-active-shape-svg\" d=\"m15 8.008 0 0c0 .549-.452.998-1.004.998h-5.068c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h5.068c.552 0 1.004.449 1.004.998z\"></path><path d=\"m6.521 2.683-2.403-2.391c-.188-.187-.444-.292-.71-.292s-.521.105-.71.292l-2.404 2.391c-.392.39-.392 1.021 0 1.411s1.027.39 1.419 0l .691-.687v7.594c0 .55.452.999 1.004.999s1.004-.449 1.004-.998v-7.594l.691.687c.392.39 1.027.39 1.419 0s .392-1.021-.001-1.412z\"></path></g></svg>"

/***/ }),

/***/ 451:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 11 11\" viewBox=\"0 0 11 11\" xmlns=\"http://www.w3.org/2000/svg\"><g class=\"coveo-more-svg\" fill=\"none\"><path d=\"m10.083 4.583h-3.666v-3.666c0-.524-.393-.917-.917-.917s-.917.393-.917.917v3.667h-3.666c-.524-.001-.917.392-.917.916s.393.917.917.917h3.667v3.667c-.001.523.392.916.916.916s.917-.393.917-.917v-3.666h3.667c.523 0 .916-.393.916-.917-.001-.524-.394-.917-.917-.917z\"></path></g><g class=\"coveo-exclusion-svg\" fill=\"none\"><path d=\"m9.233 7.989-2.489-2.489 2.489-2.489c.356-.356.356-.889 0-1.244-.356-.356-.889-.356-1.244 0l-2.489 2.489-2.489-2.489c-.356-.356-.889-.356-1.244 0-.356.356-.356.889 0 1.244l2.489 2.489-2.489 2.489c-.356.356-.356.889 0 1.244.356.356.889.356 1.244 0l2.489-2.489 2.489 2.489c.356.356.889.356 1.244 0 .356-.355.356-.889 0-1.244z\"></path></g><g class=\"coveo-hook-svg\" fill=\"none\"><path d=\"m10.252 2.213c-.155-.142-.354-.211-.573-.213-.215.005-.414.091-.561.24l-4.873 4.932-2.39-2.19c-.154-.144-.385-.214-.57-.214-.214.004-.415.09-.563.24-.148.147-.227.343-.222.549.005.207.093.4.249.542l2.905 2.662c.168.154.388.239.618.239h.022.003c.237-.007.457-.101.618-.266l5.362-5.428c.148-.148.228-.344.223-.551s-.093-.399-.248-.542z\"></path></g></svg>"

/***/ }),

/***/ 452:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 15 12\" viewBox=\"0 0 15 12\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m6.521 7.906c-.392-.39-1.027-.39-1.419 0l-.69.686v-7.594c0-.549-.452-.998-1.004-.998s-1.004.449-1.004.998v7.594l-.69-.686c-.392-.39-1.027-.39-1.419 0-.392.39-.392 1.021 0 1.411l2.404 2.391c.188.187.443.292.709.292s.522-.105.71-.292l2.404-2.391c.392-.391.392-1.022-.001-1.411z\"></path><path class=\"coveo-active-shape-svg\" d=\"m9.932 11.001h-1.004c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h1.004c.552 0 1.004.449 1.004.998l0 0c0 .549-.452.998-1.004.998z\"></path><path class=\"coveo-active-shape-svg\" d=\"m11.94 8.007h-3.012c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h3.011c.552 0 1.004.449 1.004.998l0 0c0 .549-.451.998-1.003.998z\"></path><path class=\"coveo-active-shape-svg\" d=\"m13.996 5.014h-5.068c-.552 0-1.004-.449-1.004-.998l0 0c0-.549.452-.998 1.004-.998h5.068c.552 0 1.004.449 1.004.998l0 0c0 .548-.452.998-1.004.998z\"></path></g></svg>"

/***/ }),

/***/ 453:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 12 16\" viewBox=\"0 0 12 16\" xmlns=\"http://www.w3.org/2000/svg\"><g class=\"coveo-dropdown-authenticate-svg\" fill=\"none\"><path d=\"m10 5h-8c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2m0 1.5c.3 0 .5.2.5.5v5c0 .3-.2.5-.5.5h-8c-.3 0-.5-.2-.5-.5v-5c0-.3.2-.5.5-.5z\"></path><path d=\"m10 5h-1.6v-1.1c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v1.1h-1.6v-1.1c0-2.1 1.8-3.9 4-3.9s4 1.8 4 3.9z\"></path></g><g class=\"coveo-dropdown-authenticate-hover-svg\" fill=\"none\"><path class=\"coveo-active-shape-svg\" d=\"m10 7h-8c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2m0 1.5c.3 0 .5.2.5.5v5c0 .3-.2.5-.5.5h-8c-.3 0-.5-.2-.5-.5v-5c0-.3.2-.5.5-.5z\"></path><path d=\"m5.1.1c-1.8.4-3.1 2.1-3.1 4v2.9h1.6v-3.1c0-1.7 1.8-3 3.6-2.1.8.4 1.2 1.3 1.2 2.2v.6c0 .4.4.8.8.8s.8-.4.8-.8v-.7c0-2.4-2.3-4.4-4.9-3.8z\"></path></g></svg>"

/***/ }),

/***/ 454:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 14 14\" viewBox=\"0 0 14 14\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\" transform=\"matrix(0 1 -1 0 20 0)\"><path d=\"m7.699 8.591 1.05 1.05c.49.49 1.05 0 1.05 0s .49-.56 0-1.05l-2.31-2.381c-.28-.28-.7-.28-.98 0l-2.309 2.451c-.49.49 0 .98 0 .98s.56.49 1.05 0l1.05-1.05v7.91c0 .42.35.7.7.7s.7-.35.7-.7z\"></path><path class=\"coveo-active-shape-svg\" d=\"m10.5 12.301h2.033l.065 6.301h-11.198v-6.301h2.1c.386 0 .7-.314.7-.7l0 0c0-.386-.314-.7-.7-.7h-2.806c-.383-.001-.694.31-.694.694v7.706c0 .385.318.699.694.699h12.607c.384 0 .699-.315.699-.699v-7.7c0-.386-.316-.699-.694-.699h-2.806c-.386 0-.7.314-.7.7l0 0c0 .385.314.699.7.699z\"></path></g></svg>"

/***/ }),

/***/ 455:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 15 12\" viewBox=\"0 0 15 12\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m9.224 11.999c-.198 0-.496-.103-.694-.308-.397-.411-.397-1.025 0-1.436l3.965-4.409-3.966-4.102c-.397-.411-.397-1.025 0-1.436s.991-.411 1.388 0l4.859 4.922c.298.308.298.718 0 1.025l-4.859 5.435c-.198.206-.496.309-.693.309\"></path><path class=\"coveo-active-shape-svg\" d=\"m4.958.411c-.397-.411-.991-.411-1.388 0s-.397 1.025 0 1.436l2.973 2.974h-5.552c-.594 0-.991.41-.991 1.025s.397 1.025.991 1.025h5.651l-3.074 3.384c-.397.411-.397 1.025 0 1.436.199.206.398.309.695.309.298 0 .495-.103.694-.308l4.859-5.333c.298-.308.298-.718 0-1.025z\"></path></g></svg>"

/***/ }),

/***/ 456:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m14 2v12h-11.999v-12zm1.306-2h-14.607c-.386 0-.699.318-.699.694v14.607c0 .384.315.699.699.699h14.602c.385 0 .699-.316.699-.694v-14.612c0-.383-.311-.694-.694-.694z\"></path><path d=\"m10.969 9.055h-5.939c-.569 0-1.032-.448-1.032-1s .462-1 1.032-1h5.938c.57 0 1.032.448 1.032 1 .001.552-.46 1-1.031 1\"></path></g></svg>"

/***/ }),

/***/ 457:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m14 2v12h-12v-12zm1.306-2h-14.607c-.386 0-.699.318-.699.694v14.607c0 .384.315.699.699.699h14.602c.385 0 .699-.316.699-.694v-14.612c0-.383-.311-.694-.694-.694z\"></path><path d=\"m10.969 7.055h-1.97v-1.968c0-.571-.448-1.032-1-1.032s-1 .462-1 1.032v1.969h-1.969c-.57 0-1.032.448-1.032 1s .463 1 1.032 1h1.97v1.969c0 .57.448 1.032 1 1.032s1-.463 1-1.032v-1.97h1.969c.571 0 1.032-.448 1.032-1 .001-.552-.462-1-1.032-1z\"></path></g></svg>"

/***/ }),

/***/ 458:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 22 22\" viewBox=\"0 0 22 22\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m12.989 21.947h-3.978c-.752 0-1.388-.557-1.48-1.295l-.298-2.075c-.309-.154-.611-.33-.905-.526l-1.968.79c-.722.268-1.508-.028-1.858-.668l-1.977-3.419c-.366-.671-.207-1.47.365-1.922l1.669-1.306c-.013-.186-.019-.359-.019-.526s.006-.34.02-.526l-1.665-1.303c-.586-.462-.742-1.292-.365-1.932l1.985-3.434c.343-.633 1.136-.923 1.836-.65l1.98.796c.3-.2.6-.375.901-.527l.301-2.096c.089-.719.726-1.275 1.478-1.275h3.979c.753 0 1.39.557 1.479 1.296l.298 2.074c.31.154.611.33.905.526l1.968-.791c.721-.263 1.508.028 1.857.667l1.979 3.421c.365.671.207 1.47-.365 1.922l-1.669 1.305c.012.166.02.342.02.527s-.008.361-.02.526l1.665 1.302c.576.457.734 1.256.381 1.903l-2 3.463c-.35.636-1.146.922-1.84.649l-1.978-.794c-.301.199-.6.374-.902.526l-.3 2.095c-.088.72-.725 1.277-1.478 1.277m-3.539-2h3.1l.396-2.762.529-.217c.485-.2.964-.478 1.461-.851l.45-.337 2.585 1.038 1.554-2.688-2.198-1.718.071-.563c.035-.277.062-.555.062-.85s-.027-.572-.062-.85l-.071-.563 2.198-1.718-1.555-2.688-2.592 1.042-.452-.348c-.466-.358-.94-.633-1.451-.843l-.529-.217-.396-2.761h-3.1l-.396 2.762-.53.217c-.485.199-.962.477-1.46.85l-.451.337-2.584-1.038-1.554 2.688 2.196 1.718-.07.562c-.034.277-.061.564-.061.851s.027.573.062.852l.07.562-2.196 1.718 1.554 2.688 2.591-1.041.452.348c.465.356.939.632 1.452.843l.529.217z\"></path><path d=\"m11 15c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4m0-6c-1.103 0-2 .897-2 2s .897 2 2 2 2-.897 2-2-.897-2-2-2\"></path></g></svg>"

/***/ }),

/***/ 459:
/***/ (function(module, exports) {

module.exports = "<svg viewBox=\"0 0 18 14\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\" fill-rule=\"evenodd\"><path class=\"coveo-active-shape-svg\" d=\"m12.1 13.5c-.426 0-.771-.332-.771-.74 0-.409.346-.74.771-.74h1.862c1.374 0 2.49-1.136 2.49-2.534v-.193c0-1.144-.756-2.15-1.839-2.448l-.488-.134-.066-.484c-.132-.979-1.11-1.673-2.041-1.458l-.635.143-.253-.578c-.626-1.429-2.024-2.352-3.562-2.352-2.147 0-3.892 1.769-3.892 3.944 0 .082.002.164.007.246l.032.541-.529.192c-.986.359-1.65 1.319-1.65 2.388v.192c0 1.398 1.117 2.535 2.49 2.535h.782c.426 0 .771.332.771.74 0 .409-.346.74-.771.74h-.782c-2.224 0-4.03-1.802-4.03-4.02v-.192c0-1.496.842-2.861 2.143-3.549.097-2.908 2.496-5.243 5.432-5.243 1.968 0 3.767 1.061 4.726 2.747 1.501-.024 2.798.945 3.198 2.327 1.495.61 2.501 2.077 2.501 3.717v.193c0 2.215-1.808 4.02-4.03 4.02h-1.863\"></path><path d=\"m9 5.234c-.098-.149-.3-.233-.511-.234-.212 0-.413.084-.561.232l-3.193 3.176c-.311.309-.312.812-.003 1.123.155.156.359.233.563.233.202 0 .406-.076.56-.231l1.822-1.813v5.485c0 .438.356.794.794.794.438 0 .794-.356.794-.794v-5.504l1.82 1.83c.309.311.812.312 1.122.002.31-.309.312-.812.002-1.123l-3.21-3.176\"></path></g></svg>"

/***/ }),

/***/ 460:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m8.01 0c-4.425 0-8.01 3.581-8.01 7.992 0 4.425 3.581 8.01 7.999 8.01l.003-.003c4.417 0 7.999-3.581 7.999-7.999 0-4.417-3.581-7.999-7.992-7.999m.002 1.5c3.58 0 6.493 2.916 6.493 6.5s-2.916 6.5-6.5 6.5h-.172c-3.506-.09-6.331-2.975-6.331-6.508 0-3.58 2.92-6.493 6.51-6.492\"></path><path d=\"m11.04 10.27c-.192 0-.384-.073-.53-.22l-2.51-2.51-2.51 2.51c-.293.293-.768.293-1.061 0s-.293-.768 0-1.061l3.041-3.04c.141-.14.332-.219.53-.219l0 0c .199 0 .39.079.53.22l3.04 3.041c.293.293.293.768 0 1.061-.146.145-.337.218-.53.218z\"></path></g></svg>"

/***/ }),

/***/ 461:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m7.991 16.002c4.425 0 8.01-3.581 8.01-7.992 0-4.425-3.581-8.01-7.999-8.01l-.003.003c-4.417 0-7.999 3.581-7.999 7.999 0 4.417 3.581 7.999 7.992 7.999m-.002-1.5c-3.58 0-6.493-2.916-6.493-6.5s2.916-6.5 6.5-6.5h.172c3.506.09 6.331 2.975 6.331 6.508 0 3.58-2.92 6.493-6.51 6.493\"></path><path d=\"m4.961 5.732c.192 0 .384.073.53.22l2.51 2.51 2.51-2.51c.293-.293.768-.293 1.061 0s .293.768 0 1.061l-3.041 3.04c-.141.14-.332.219-.53.219l0 0c-.199 0-.39-.079-.53-.22l-3.04-3.041c-.293-.293-.293-.768 0-1.061.146-.145.337-.218.53-.218z\"></path></g></svg>"

/***/ }),

/***/ 462:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 18 18\" viewBox=\"0 0 18 18\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m16.76 8.051c-.448 0-.855-.303-.969-.757-.78-3.117-3.573-5.294-6.791-5.294s-6.01 2.177-6.79 5.294c-.134.537-.679.861-1.213.727-.536-.134-.861-.677-.728-1.212 1.004-4.009 4.594-6.809 8.731-6.809 4.138 0 7.728 2.8 8.73 6.809.135.536-.191 1.079-.727 1.213-.081.02-.162.029-.243.029z\"></path><path d=\"m9 18c-4.238 0-7.943-3.007-8.809-7.149-.113-.541.234-1.071.774-1.184.541-.112 1.071.232 1.184.773.674 3.222 3.555 5.56 6.851 5.56s6.178-2.338 6.852-5.56c.113-.539.634-.892 1.184-.773.54.112.887.643.773 1.184-.866 4.142-4.57 7.149-8.809 7.149z\"></path></g></svg>"

/***/ }),

/***/ 463:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 13 13\" viewBox=\"0 0 13 13\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path d=\"m7.881 6.501 4.834-4.834c.38-.38.38-1.001 0-1.381s-1.001-.38-1.381 0l-4.834 4.834-4.834-4.835c-.38-.38-1.001-.38-1.381 0s-.38 1.001 0 1.381l4.834 4.834-4.834 4.834c-.38.38-.38 1.001 0 1.381s1.001.38 1.381 0l4.834-4.834 4.834 4.834c.38.38 1.001.38 1.381 0s .38-1.001 0-1.381z\"></path></g></svg>"

/***/ }),

/***/ 464:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 16 16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-more-background-svg\" fill-opacity=\"0\" d=\"m8.03.819c3.987 0 7.227 3.222 7.227 7.181s-3.239 7.181-7.227 7.181c-3.976 0-7.209-3.222-7.209-7.181s3.237-7.181 7.209-7.181\"></path><path d=\"m0 8c0 4.416 3.572 8 7.991 8 4.425 0 8.009-3.581 8.009-8 0-4.416-3.581-8-8.009-8-4.416 0-7.991 3.581-7.991 8m8.031-6.4c3.553 0 6.441 2.872 6.441 6.4s-2.887 6.4-6.441 6.4c-3.544 0-6.425-2.872-6.425-6.4s2.885-6.4 6.425-6.4\"></path><path d=\"m10.988 9.024c.551 0 1-.449 1-1s-.449-1-1-1-1 .449-1 1 .449 1 1 1\"></path><path d=\"m7.991 9c .551 0 1-.449 1-1s-.449-1-1-1-1 .449-1 1 .449 1 1 1\"></path><path d=\"m4.994 9c .551 0 1-.449 1-1s-.449-1-1-1-1 .449-1 1 .449 1 1 1\"></path></g></svg>"

/***/ }),

/***/ 465:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 18 18\" viewBox=\"0 0 18 18\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-and-svg\" d=\"m13.769 5.294h-1.063v-1.063c0-2.329-1.894-4.231-4.231-4.231h-4.244c-2.329 0-4.231 1.894-4.231 4.231v4.244c0 2.329 1.894 4.231 4.231 4.231h1.063v1.063c0 2.329 1.894 4.231 4.231 4.231h4.244c2.329 0 4.231-1.894 4.231-4.231v-4.244c0-2.329-1.894-4.231-4.231-4.231zm2.731 8.475c0 1.506-1.225 2.731-2.731 2.731h-4.244c-1.506 0-2.731-1.225-2.731-2.731v-2.563h-2.563c-1.506 0-2.731-1.225-2.731-2.731v-4.244c0-1.506 1.225-2.731 2.731-2.731h4.244c1.506 0 2.731 1.225 2.731 2.731v2.563h2.563c1.506 0 2.731 1.225 2.731 2.731z\"></path><path class=\"coveo-or-svg\" d=\"m11.206 6.794v1.909c0 1.38-1.123 2.503-2.503 2.503h-1.909v-1.909c0-1.38 1.123-2.503 2.503-2.503zm1.5-1.5h-3.409c-2.209 0-4.003 1.792-4.003 4.003v3.409h3.409c2.209 0 4.003-1.792 4.003-4.003z\"></path></g></svg>"

/***/ }),

/***/ 466:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 20 20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-magnifier-circle-svg\" d=\"m8.368 16.736c-4.614 0-8.368-3.754-8.368-8.368s3.754-8.368 8.368-8.368 8.368 3.754 8.368 8.368-3.754 8.368-8.368 8.368m0-14.161c-3.195 0-5.793 2.599-5.793 5.793s2.599 5.793 5.793 5.793 5.793-2.599 5.793-5.793-2.599-5.793-5.793-5.793\"></path><path d=\"m18.713 20c-.329 0-.659-.126-.91-.377l-4.552-4.551c-.503-.503-.503-1.318 0-1.82.503-.503 1.318-.503 1.82 0l4.552 4.551c.503.503.503 1.318 0 1.82-.252.251-.581.377-.91.377\"></path></g></svg>"

/***/ }),

/***/ 467:
/***/ (function(module, exports) {

module.exports = "<svg enable-background=\"new 0 0 15 14\" viewBox=\"0 0 15 14\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"currentColor\"><path class=\"coveo-active-shape-svg\" d=\"m13.002 4.076 0 0c0 .536-.439.975-.975.975h-2.925c-.536 0-.975-.439-.975-.975l0 0c0-.536.439-.975.975-.975h2.925c.537 0 .975.438.975.975z\"></path><path class=\"coveo-active-shape-svg\" d=\"m13.002 9.925 0 0c0 .536-.439.975-.975.975h-2.925c-.536 0-.975-.439-.975-.975l0 0c0-.536.439-.975.975-.975h2.925c.537 0 .975.439.975.975z\"></path><path class=\"coveo-active-shape-svg\" d=\"m15 7 0 0c0 .536-.439.975-.975.975h-4.923c-.536 0-.974-.438-.974-.975l0 0c0-.536.439-.975.975-.975h4.923c.535.001.974.439.974.975z\"></path><path d=\"m4.956 9.837-.671.671v-7.015l.671.671c.381.381.997.381 1.379 0 .381-.38.381-.997 0-1.379l-2.335-2.336c-.183-.184-.431-.286-.69-.286s-.506.102-.689.286l-2.335 2.336c-.381.381-.381.997 0 1.379s.997.381 1.379 0l .671-.671v7.015l-.671-.671c-.381-.381-.997-.381-1.379 0-.381.38-.381.997 0 1.379l2.335 2.336c.182.183.431.286.689.286s.506-.103.69-.287l2.335-2.336c.381-.381.381-.997 0-1.379-.382-.381-.998-.381-1.379.001z\"></path></g></svg>"

/***/ }),

/***/ 580:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 98:
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
var Initialization_1 = __webpack_require__(2);
var TemplateHelpers_1 = __webpack_require__(69);
var Assert_1 = __webpack_require__(7);
var DateUtils_1 = __webpack_require__(29);
var QueryStateModel_1 = __webpack_require__(14);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var Utils_1 = __webpack_require__(5);
var Dom_1 = __webpack_require__(3);
var _ = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(4);
var StringUtils_1 = __webpack_require__(19);
function showOnlyWithHelper(helpers, options) {
    if (options == null) {
        options = {};
    }
    options.helpers = helpers;
    return options;
}
/**
 * The FieldValue component displays the value of a field associated to its parent search result. It is normally usable
 * within a {@link FieldTable}.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * A common use of this component is to display a specific field value which also happens to be an existing
 * {@link Facet.options.field}. When the user clicks on the FieldValue component, it activates the corresponding Facet.
 */
var FieldValue = (function (_super) {
    __extends(FieldValue, _super);
    /**
     * Creates a new FieldValue.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the FieldValue component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     * @param result The result to associate the component with.
     */
    function FieldValue(element, options, bindings, result, fieldValueClassId) {
        if (fieldValueClassId === void 0) { fieldValueClassId = FieldValue.ID; }
        var _this = _super.call(this, element, fieldValueClassId, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.result = result;
        _this.options = ComponentOptions_1.ComponentOptions.initOptions(element, FieldValue.simpleOptions, options);
        if (_this.options.helper != null) {
            _this.options = ComponentOptions_1.ComponentOptions.initOptions(element, FieldValue.helperOptions, _this.options);
            var toFilter = _.keys(FieldValue.options.helperOptions['subOptions']);
            var toKeep_1 = _.filter(toFilter, function (optionKey) {
                var optionDefinition = FieldValue.options.helperOptions['subOptions'][optionKey];
                if (optionDefinition) {
                    var helpers = optionDefinition.helpers;
                    return helpers != null && _.contains(helpers, _this.options.helper);
                }
                return false;
            });
            _this.options.helperOptions = _.omit(_this.options.helperOptions, function (value, key) {
                return !_.contains(toKeep_1, key);
            });
        }
        _this.result = _this.result || _this.resolveResult();
        Assert_1.Assert.exists(_this.result);
        var loadedValueFromComponent = _this.getValue();
        if (loadedValueFromComponent == null) {
            // Completely remove the element to ease stuff such as adding separators in CSS
            if (_this.element.parentElement != null) {
                _this.element.parentElement.removeChild(_this.element);
            }
        }
        else {
            var values = void 0;
            if (_.isArray(loadedValueFromComponent)) {
                values = loadedValueFromComponent;
            }
            else if (_this.options.splitValues) {
                if (_.isString(loadedValueFromComponent)) {
                    values = _.map(loadedValueFromComponent.split(_this.options.separator), function (v) {
                        return v.trim();
                    });
                }
            }
            else {
                loadedValueFromComponent = loadedValueFromComponent.toString();
                values = [loadedValueFromComponent];
            }
            _this.appendValuesToDom(values);
            if (_this.options.textCaption != null) {
                _this.prependTextCaptionToDom();
            }
        }
        return _this;
    }
    /**
     * Gets the current FieldValue from the current {@link IQueryResult}.
     *
     * @returns {any} The current FieldValue or `null` if value is and `Object`.
     */
    FieldValue.prototype.getValue = function () {
        var value = Utils_1.Utils.getFieldValue(this.result, this.options.field);
        if (!_.isArray(value) && _.isObject(value)) {
            value = null;
        }
        return value;
    };
    /**
     * Renders a value to HTML using all of the current FieldValue component options.
     * @param value The value to render.
     * @returns {HTMLElement} The element containing the rendered value.
     */
    FieldValue.prototype.renderOneValue = function (value) {
        var element = Dom_1.$$('span').el;
        var toRender = value;
        if (this.options.helper) {
            toRender = TemplateHelpers_1.TemplateHelpers.getHelper(this.options.helper).call(this, value, this.getHelperOptions());
            var fullDateStr = this.getFullDate(value, this.options.helper);
            if (fullDateStr) {
                element.setAttribute('title', fullDateStr);
            }
        }
        if (this.options.helper == 'date' || this.options.helper == 'dateTime' || this.options.helper == 'emailDateTime') {
            toRender = StringUtils_1.StringUtils.capitalizeFirstLetter(toRender);
        }
        if (this.options.htmlValue) {
            element.innerHTML = toRender;
        }
        else {
            element.appendChild(document.createTextNode(toRender));
        }
        this.bindEventOnValue(element, value);
        return element;
    };
    FieldValue.prototype.getValueContainer = function () {
        return this.element;
    };
    FieldValue.prototype.getHelperOptions = function () {
        var inlineOptions = ComponentOptions_1.ComponentOptions.loadStringOption(this.element, 'helperOptions', {});
        if (Utils_1.Utils.isNonEmptyString(inlineOptions)) {
            return _.extend({}, this.options.helperOptions, eval('(' + inlineOptions + ')'));
        }
        return this.options.helperOptions;
    };
    FieldValue.prototype.getFullDate = function (date, helper) {
        var fullDateOptions = {
            useLongDateFormat: true,
            useTodayYesterdayAndTomorrow: false,
            useWeekdayIfThisWeek: false,
            omitYearIfCurrentOne: false
        };
        if (helper == 'date') {
            return DateUtils_1.DateUtils.dateToString(new Date(parseInt(date)), fullDateOptions);
        }
        else if (helper == 'dateTime' || helper == 'emailDateTime') {
            return DateUtils_1.DateUtils.dateTimeToString(new Date(parseInt(date)), fullDateOptions);
        }
        return '';
    };
    FieldValue.prototype.appendValuesToDom = function (values) {
        var _this = this;
        _.each(values, function (value, index) {
            if (value != undefined) {
                _this.getValueContainer().appendChild(_this.renderOneValue(value));
                if (index !== values.length - 1) {
                    _this.getValueContainer().appendChild(document.createTextNode(_this.options.displaySeparator));
                }
            }
        });
    };
    FieldValue.prototype.renderTextCaption = function () {
        var element = Dom_1.$$('span', { className: 'coveo-field-caption' }, _.escape(this.options.textCaption));
        return element.el;
    };
    FieldValue.prototype.prependTextCaptionToDom = function () {
        var elem = this.getValueContainer();
        Dom_1.$$(elem).prepend(this.renderTextCaption());
        // Add a class to the container so the value and the caption wrap together.
        Dom_1.$$(elem).addClass('coveo-with-label');
    };
    FieldValue.prototype.bindEventOnValue = function (element, value) {
        var _this = this;
        if (Utils_1.Utils.isUndefined(Coveo['FacetRange'])) {
            return;
        }
        var facetAttributeName = QueryStateModel_1.QueryStateModel.getFacetId(this.options.facet);
        var facets = _.filter(this.componentStateModel.get(facetAttributeName), function (facet) {
            return !facet.disabled && Coveo['FacetRange'] && !(facet instanceof Coveo['FacetRange']);
        });
        var atLeastOneFacetIsEnabled = facets.length > 0;
        if (atLeastOneFacetIsEnabled) {
            var selected_1 = _.find(facets, function (facet) {
                var facetValue = facet.values.get(value);
                return facetValue && facetValue.selected;
            });
            Dom_1.$$(element).on('click', function () {
                if (selected_1 != null) {
                    _.each(facets, function (facet) { return facet.deselectValue(value); });
                }
                else {
                    _.each(facets, function (facet) { return facet.selectValue(value); });
                }
                _this.queryController.deferExecuteQuery({
                    beforeExecuteQuery: function () { return _this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.documentField, {
                        facetId: _this.options.facet,
                        facetValue: value.toLowerCase()
                    }); }
                });
            });
            if (selected_1) {
                Dom_1.$$(element).addClass('coveo-selected');
            }
            Dom_1.$$(element).addClass('coveo-clickable');
        }
    };
    return FieldValue;
}(Component_1.Component));
FieldValue.ID = 'FieldValue';
FieldValue.doExport = function () {
    GlobalExports_1.exportGlobally({
        'FieldValue': FieldValue
    });
};
/**
 * The options for the component
 * @componentOptions
 */
FieldValue.options = {
    /**
     * Specifies the field that the FieldValue should display.
     *
     * Specifying a value for this parameter is required in order for the FieldValue component to work.
     */
    field: ComponentOptions_1.ComponentOptions.buildFieldOption({ defaultValue: '@field', required: true }),
    /**
     * Specifies the {@link Facet} component to toggle when the end user clicks the FieldValue.
     *
     * Default value is the value of {@link FieldValue.options.field}.
     *
     * **Note:**
     * > If the target {@link Facet.options.id} is is not the same as its {@link Facet.options.field}), you must specify
     * > this option manually in order to link to the correct Facet.
     */
    facet: ComponentOptions_1.ComponentOptions.buildStringOption({ postProcessing: function (value, options) { return value || options.field; } }),
    /**
     * Specifies whether the content to display is an HTML element.
     *
     * Default value is `false`.
     */
    htmlValue: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies whether to split the FieldValue at each {@link FieldValue.options.separator}.
     *
     * This is useful for splitting groups using a {@link Facet.options.field}.
     *
     * When this option is `true`, the displayed values are split by the {@link FieldValue.options.displaySeparator}.
     *
     * Default value is `false`.
     */
    splitValues: ComponentOptions_1.ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * If {@link FieldValue.options.splitValues} is `true`, specifies the separator string which separates multi-value
     * fields in the index.
     *
     * See {@link FieldValue.options.displaySeparator}.
     *
     * Default value is `";"`.
     */
    separator: ComponentOptions_1.ComponentOptions.buildStringOption({ depend: 'splitValues', defaultValue: ';' }),
    /**
     * If {@link FieldValue.options.splitValues} is `true`, specifies the string to use when displaying multi-value
     * fields in the UI.
     *
     * The component will insert this string between each value it displays from a multi-value field.
     *
     * See also {@link FieldValue.options.separator}.
     *
     * Default value is `", "`.
     */
    displaySeparator: ComponentOptions_1.ComponentOptions.buildStringOption({ depend: 'splitValues', defaultValue: ', ' }),
    /**
     * Specifies the helper that the FieldValue should use to display its content.
     *
     * While several helpers exist by default (see {@link ICoreHelpers}), it is also possible for you to create your own
     * custom helpers (see {@link TemplateHelpers}).
     */
    helper: ComponentOptions_1.ComponentOptions.buildHelperOption(),
    /**
     * Specifies the options to call on the specified helper.
     */
    helperOptions: ComponentOptions_1.ComponentOptions.buildObjectOption({
        subOptions: {
            text: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),
            target: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),
            'class': ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),
            decimals: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['currency'], { min: 0 })),
            symbol: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['currency'])),
            useTodayYesterdayAndTomorrow: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
            useWeekdayIfThisWeek: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
            omitYearIfCurrentOne: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
            useLongDateFormat: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: false })),
            includeTimeIfToday: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
            includeTimeIfThisWeek: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
            alwaysIncludeTime: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: false })),
            predefinedFormat: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'])),
            companyDomain: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['email'])),
            lengthLimit: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['email'], { min: 1 })),
            truncateName: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['email'])),
            alt: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
            height: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
            width: ComponentOptions_1.ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
            presision: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['size'], { min: 0, defaultValue: 2 })),
            base: ComponentOptions_1.ComponentOptions.buildNumberOption(showOnlyWithHelper(['size'], { min: 0, defaultValue: 0 })),
            isMilliseconds: ComponentOptions_1.ComponentOptions.buildBooleanOption(showOnlyWithHelper(['timeSpan'])),
        }
    }),
    /**
     * Specifies a caption to display before the value.
     *
     * Default value is `undefined`.
     */
    textCaption: ComponentOptions_1.ComponentOptions.buildLocalizedStringOption()
};
FieldValue.simpleOptions = _.omit(FieldValue.options, 'helperOptions');
FieldValue.helperOptions = {
    helperOptions: FieldValue.options.helperOptions
};
exports.FieldValue = FieldValue;
Initialization_1.Initialization.registerAutoCreateComponent(FieldValue);


/***/ })

});
//# sourceMappingURL=FieldTable.js.map