webpackJsonpCoveo__temporary([67],{

/***/ 262:
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
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var SettingsEvents_1 = __webpack_require__(53);
var PreferencesPanelEvents_1 = __webpack_require__(96);
var Initialization_1 = __webpack_require__(2);
var Strings_1 = __webpack_require__(6);
var Dom_1 = __webpack_require__(1);
var GlobalExports_1 = __webpack_require__(3);
var ExternalModulesShim_1 = __webpack_require__(26);
var _ = __webpack_require__(0);
__webpack_require__(632);
var InitializationEvents_1 = __webpack_require__(17);
var SVGIcons_1 = __webpack_require__(12);
/**
 * The PreferencesPanel component renders a **Preferences** item inside the {@link Settings} component which the end
 * user can click to access a panel from which it is possible to specify certain customization options for the search
 * interface. These customization options are then saved in the browser local storage.
 *
 * This component should be used inside the {@link Settings} component.
 *
 * See also the {@link ResultsFiltersPreferences} and {@link ResultsPreferences} components.
 */
var PreferencesPanel = /** @class */ (function (_super) {
    __extends(PreferencesPanel, _super);
    /**
     * Creates a new PreferencesPanel.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the PreferencesPanel component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function PreferencesPanel(element, options, bindings, ModalBox) {
        if (ModalBox === void 0) { ModalBox = ExternalModulesShim_1.ModalBox; }
        var _this = _super.call(this, element, PreferencesPanel.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.ModalBox = ModalBox;
        _this.content = [];
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, PreferencesPanel, options);
        _this.bind.onRootElement(SettingsEvents_1.SettingsEvents.settingsPopulateMenu, function (args) {
            args.menuData.push({
                className: 'coveo-preferences-panel',
                text: Strings_1.l('Preferences'),
                onOpen: function () { return _this.open(); },
                onClose: function () { return _this.close(); },
                svgIcon: SVGIcons_1.SVGIcons.icons.dropdownPreferences,
                svgIconClassName: 'coveo-preferences-panel-svg'
            });
        });
        _this.bind.onRootElement(InitializationEvents_1.InitializationEvents.afterComponentsInitialization, function () {
            _this.content = Dom_1.$$(_this.element).children();
        });
        return _this;
    }
    /**
     * Opens the PreferencesPanel.
     */
    PreferencesPanel.prototype.open = function () {
        var _this = this;
        if (this.modalbox == null) {
            var root_1 = Dom_1.$$('div');
            _.each(this.content, function (oneChild) {
                root_1.append(oneChild);
            });
            this.modalbox = this.ModalBox.open(root_1.el, {
                title: Strings_1.l('Preferences'),
                validation: function () {
                    _this.cleanupOnExit();
                    return true;
                },
                body: this.searchInterface.options.modalContainer
            });
        }
    };
    /**
     * Closes the PreferencesPanel without saving changes.
     *
     * Also triggers the `exitPreferencesWithoutSave` event.
     */
    PreferencesPanel.prototype.close = function () {
        if (this.modalbox) {
            this.cleanupOnExit();
            this.modalbox.close();
            this.modalbox = null;
        }
    };
    /**
     * Saves the changes and executes a new query.
     *
     * Also triggers the `savePreferences` event.
     */
    PreferencesPanel.prototype.save = function () {
        Dom_1.$$(this.element).trigger(PreferencesPanelEvents_1.PreferencesPanelEvents.savePreferences);
        this.queryController.executeQuery();
    };
    PreferencesPanel.prototype.cleanupOnExit = function () {
        Dom_1.$$(this.element).trigger(PreferencesPanelEvents_1.PreferencesPanelEvents.exitPreferencesWithoutSave);
    };
    PreferencesPanel.ID = 'PreferencesPanel';
    PreferencesPanel.doExport = function () {
        GlobalExports_1.exportGlobally({
            PreferencesPanel: PreferencesPanel
        });
    };
    PreferencesPanel.options = {};
    return PreferencesPanel;
}(Component_1.Component));
exports.PreferencesPanel = PreferencesPanel;
Initialization_1.Initialization.registerAutoCreateComponent(PreferencesPanel);


/***/ }),

/***/ 632:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

});
//# sourceMappingURL=PreferencesPanel__36d30dcb7330ecf06f4d.js.map