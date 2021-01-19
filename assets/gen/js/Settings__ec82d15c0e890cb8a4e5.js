webpackJsonpCoveo__temporary([60],{

/***/ 279:
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
var popper_js_1 = __webpack_require__(93);
__webpack_require__(666);
var underscore_1 = __webpack_require__(0);
var InitializationEvents_1 = __webpack_require__(17);
var SettingsEvents_1 = __webpack_require__(53);
var GlobalExports_1 = __webpack_require__(3);
var Strings_1 = __webpack_require__(6);
var AccessibleButton_1 = __webpack_require__(15);
var Dom_1 = __webpack_require__(1);
var SVGDom_1 = __webpack_require__(16);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
/**
 * The Settings component renders a **Settings** button that the end user can click to access a popup menu from which
 * it is possible to perform several contextual actions. The usual location of the **Settings** button in the page is to
 * the right of the {@link Searchbox}.
 *
 * This component can reference several components to populate its popup menu:
 * - {@link AdvancedSearch}
 * - {@link ExportToExcel}
 * - {@link PreferencesPanel} (see also {@link ResultsFiltersPreferences} and {@link ResultsPreferences})
 * - {@link SearchAlerts} (see also {@link SearchAlertsMessage})
 * - {@link ShareQuery}
 */
var Settings = /** @class */ (function (_super) {
    __extends(Settings, _super);
    /**
     * Creates a new Settings component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the Settings component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function Settings(element, options, bindings) {
        var _this = _super.call(this, element, Settings.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.isOpened = false;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, Settings, options);
        _this.bind.onRootElement(InitializationEvents_1.InitializationEvents.afterInitialization, function () { return _this.init(); });
        return _this;
    }
    /**
     * Opens the **Settings** popup menu.
     */
    Settings.prototype.open = function () {
        this.isOpened = true;
        if (this.menu != null) {
            Dom_1.$$(this.menu).detach();
        }
        this.menu = this.buildMenu();
        Dom_1.$$(this.menu).insertAfter(this.element);
        new popper_js_1.default(this.element, this.menu, {
            placement: 'bottom-end',
            modifiers: {
                offset: {
                    offset: '0, 5'
                },
                preventOverflow: {
                    boundariesElement: this.root
                }
            }
        });
    };
    /**
     * Closes the **Settings** popup menu.
     */
    Settings.prototype.close = function () {
        this.isOpened = false;
        if (this.menu != null) {
            Dom_1.$$(this.menu).detach();
            this.menu = null;
        }
    };
    Settings.prototype.toggle = function () {
        if (this.isOpened) {
            this.close();
        }
        else {
            this.open();
        }
    };
    Settings.prototype.init = function () {
        var _this = this;
        var square = Dom_1.$$('span', { className: 'coveo-settings-square' }).el;
        var squares = Dom_1.$$('span', { className: 'coveo-settings-squares' }).el;
        underscore_1.times(3, function () { return squares.appendChild(square.cloneNode()); });
        this.element.appendChild(squares);
        new AccessibleButton_1.AccessibleButton()
            .withElement(this.element)
            .withOwner(this.bind)
            .withSelectAction(function () { return _this.toggle(); })
            .withFocusAndMouseEnterAction(function () { return _this.onfocus(); })
            .withBlurAndMouseLeaveAction(function () { return _this.onblur(); })
            .withLabel(Strings_1.l('Settings'))
            .build();
    };
    Settings.prototype.buildMenu = function () {
        var _this = this;
        var menu = Dom_1.$$('div', { className: 'coveo-settings-advanced-menu' }).el;
        var settingsPopulateMenuArgs = {
            settings: this,
            menuData: []
        };
        Dom_1.$$(this.root).trigger(SettingsEvents_1.SettingsEvents.settingsPopulateMenu, settingsPopulateMenuArgs);
        underscore_1.each(settingsPopulateMenuArgs.menuData, function (menuItem) {
            var _a = _this.buildMenuItem(menuItem, settingsPopulateMenuArgs), menuItemElement = _a.menuItemElement, menuItemIcon = _a.menuItemIcon, menuItemText = _a.menuItemText;
            menuItemElement.appendChild(menuItemIcon);
            menuItemElement.appendChild(menuItemText);
            menu.appendChild(menuItemElement);
        });
        return menu;
    };
    Settings.prototype.buildMenuItem = function (menuItem, settingsPopulateMenuArgs) {
        var _this = this;
        var menuItemElement = Dom_1.$$('div', {
            className: "coveo-settings-item " + menuItem.className
        }).el;
        var selectAction = function () {
            underscore_1.each(settingsPopulateMenuArgs.menuData, function (menuItem) {
                menuItem.onClose && menuItem.onClose();
            });
            _this.close();
            menuItem.onOpen();
        };
        new AccessibleButton_1.AccessibleButton()
            .withElement(menuItemElement)
            .withSelectAction(selectAction)
            .withFocusAndMouseEnterAction(function () { return _this.onfocus(); })
            .withBlurAndMouseLeaveAction(function () { return _this.onblur(); })
            .withLabel(menuItem.tooltip || menuItem.text)
            .build();
        return {
            menuItemElement: menuItemElement,
            menuItemIcon: this.buildMenuItemIcon(menuItem),
            menuItemText: this.buildMenuItemText(menuItem)
        };
    };
    Settings.prototype.buildMenuItemIcon = function (menuItem) {
        var iconElement = Dom_1.$$('div', {
            className: 'coveo-icon'
        }).el;
        if (menuItem.svgIcon) {
            iconElement.innerHTML = menuItem.svgIcon;
        }
        if (menuItem.svgIconClassName) {
            SVGDom_1.SVGDom.addClassToSVGInContainer(iconElement, menuItem.svgIconClassName);
        }
        return iconElement;
    };
    Settings.prototype.buildMenuItemText = function (menuItem) {
        var textElement = Dom_1.$$('div', {
            className: 'coveo-settings-text'
        }, underscore_1.escape(menuItem.text)).el;
        return textElement;
    };
    Settings.prototype.onblur = function () {
        var _this = this;
        clearTimeout(this.closeTimeout);
        this.closeTimeout = window.setTimeout(function () {
            _this.close();
        }, this.options.menuDelay);
    };
    Settings.prototype.onfocus = function () {
        clearTimeout(this.closeTimeout);
    };
    Settings.ID = 'Settings';
    Settings.doExport = function () {
        GlobalExports_1.exportGlobally({
            Settings: Settings
        });
    };
    /**
     * The options for Settings
     * @componentOptions
     */
    Settings.options = {
        /**
         * Specifies the delay (in milliseconds) before hiding the popup menu when the cursor is not hovering over it.
         *
         * Default value is `300`. Minimum value is `0 `.
         */
        menuDelay: ComponentOptions_1.ComponentOptions.buildNumberOption({ defaultValue: 300, min: 0 })
    };
    return Settings;
}(Component_1.Component));
exports.Settings = Settings;
Initialization_1.Initialization.registerAutoCreateComponent(Settings);


/***/ }),

/***/ 666:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=Settings__ec82d15c0e890cb8a4e5.js.map