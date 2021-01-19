webpackJsonpCoveo__temporary([30],{

/***/ 247:
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
var DistanceEvents_1 = __webpack_require__(200);
var EventsModules_1 = __webpack_require__(138);
var GlobalExports_1 = __webpack_require__(3);
var Dom_1 = __webpack_require__(1);
var AnalyticsActionListMeta_1 = __webpack_require__(10);
var Component_1 = __webpack_require__(7);
var ComponentOptions_1 = __webpack_require__(8);
var Initialization_1 = __webpack_require__(2);
var RegisteredNamedMethods_1 = __webpack_require__(30);
var GoogleApiPositionProvider_1 = __webpack_require__(602);
var NavigatorPositionProvider_1 = __webpack_require__(603);
var StaticPositionProvider_1 = __webpack_require__(604);
/**
 * The `DistanceResources` component defines a field that computes the distance according to the current position of the
 * end user.
 *
 * Components relying on the current distance should be disabled until this component successfully provides a distance.
 *
 * See also [`DistanceEvents`]{@link DistanceEvents}.
 *
 * @availablesince [November 2017 Release (v2.3477.9)](https://docs.coveo.com/en/373/#november-2017-release-v234779)
 */
var DistanceResources = /** @class */ (function (_super) {
    __extends(DistanceResources, _super);
    /**
     * Creates a new `DistanceResources` component.
     * @param element The HTMLElement on which to instantiate the component.
     * @param options The options for the `DistanceResources` component.
     * @param bindings The bindings that the component requires to function normally. If not set, these will be
     * automatically resolved (with a slower execution time).
     */
    function DistanceResources(element, options, bindings) {
        var _this = _super.call(this, element, DistanceResources.ID, bindings) || this;
        _this.element = element;
        _this.options = options;
        _this.bindings = bindings;
        _this.isFirstPositionResolved = false;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, DistanceResources, options);
        _this.registerDistanceQuery();
        _this.bind.onRootElement(EventsModules_1.InitializationEvents.afterComponentsInitialization, function (args) {
            return _this.onAfterComponentsInitialization(args);
        });
        return _this;
    }
    /**
     * Overrides the current position with the provided values.
     *
     * **Note:**
     * > Calling this method does not automatically trigger a query.
     *
     * @param latitude The latitude to set.
     * @param longitude The longitude to set.
     */
    DistanceResources.prototype.setPosition = function (latitude, longitude) {
        this.enable();
        this.latitude = latitude;
        this.longitude = longitude;
        var args = {
            position: {
                latitude: latitude,
                longitude: longitude
            }
        };
        this.bind.trigger(this.element, DistanceEvents_1.DistanceEvents.onPositionResolved, args);
        var shouldTriggerQuery = this.shouldTriggerQueryWhenPositionSet();
        this.isFirstPositionResolved = true;
        if (shouldTriggerQuery) {
            this.sendAnalytics();
            this.queryController.executeQuery();
        }
    };
    /**
     * Returns a promise of the last position resolved using the registered position providers.
     *
     * @returns {Promise<IGeolocationPosition>} A promise of the last resolved position value.
     */
    DistanceResources.prototype.getLastPositionRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!!this.lastPositionRequest) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.lastPositionRequest];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                latitude: this.latitude,
                                longitude: this.longitude
                            }];
                    case 2:
                        Promise.reject('No position request was executed yet.');
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DistanceResources.prototype.sendAnalytics = function () {
        this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.positionSet, {});
    };
    DistanceResources.prototype.shouldTriggerQueryWhenPositionSet = function () {
        // Don't trigger the query if the first one is not yet executed.
        return !this.queryController.firstQuery && this.options.triggerNewQueryOnNewPosition;
    };
    DistanceResources.prototype.onAfterComponentsInitialization = function (afterComponentsInitializationArgs) {
        var args = {
            providers: this.getProvidersFromOptions()
        };
        this.bind.trigger(this.element, DistanceEvents_1.DistanceEvents.onResolvingPosition, args);
        this.lastPositionRequest = this.tryToSetPositionFromProviders(args.providers);
        if (this.options.cancelQueryUntilPositionResolved) {
            afterComponentsInitializationArgs.defer.push(this.lastPositionRequest);
        }
    };
    DistanceResources.prototype.tryToSetPositionFromProviders = function (providers) {
        return __awaiter(this, void 0, void 0, function () {
            var position, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.tryGetPositionFromProviders(providers)];
                    case 1:
                        position = _a.sent();
                        if (position) {
                            this.setPosition(position.latitude, position.longitude);
                        }
                        else {
                            this.triggerDistanceNotSet();
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.logger.error('An error occurred while trying to resolve the current position.', error_1);
                        this.triggerDistanceNotSet();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DistanceResources.prototype.getProvidersFromOptions = function () {
        var providers = [];
        if (this.options.useNavigator) {
            providers.push(new NavigatorPositionProvider_1.NavigatorPositionProvider());
        }
        if (this.options.googleApiKey) {
            providers.push(new GoogleApiPositionProvider_1.GoogleApiPositionProvider(this.options.googleApiKey));
        }
        if (this.options.longitudeValue && this.options.latitudeValue) {
            providers.push(new StaticPositionProvider_1.StaticPositionProvider(this.options.latitudeValue, this.options.longitudeValue));
        }
        return providers;
    };
    DistanceResources.prototype.tryGetPositionFromProviders = function (providers) {
        return __awaiter(this, void 0, void 0, function () {
            var provider, position, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(providers.length > 0)) return [3 /*break*/, 5];
                        provider = providers.shift();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, provider.getPosition()];
                    case 2:
                        position = _a.sent();
                        if (!!position.latitude && !!position.longitude) {
                            return [2 /*return*/, position];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        this.logger.warn('An error occurred while trying to resolve the position within a position provider.', error_2);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 0];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DistanceResources.prototype.triggerDistanceNotSet = function () {
        this.isFirstPositionResolved = true;
        this.logger.warn("None of the given position providers could resolve the current position. The distance field will not be calculated and the distance components will be disabled until the next call to 'setPosition'.");
        this.bind.trigger(this.element, DistanceEvents_1.DistanceEvents.onPositionNotResolved, {});
        this.disable();
    };
    DistanceResources.prototype.registerDistanceQuery = function () {
        var _this = this;
        this.bind.onRootElement(EventsModules_1.QueryEvents.buildingQuery, function (args) {
            if (_this.isFirstPositionResolved) {
                if (args && args.queryBuilder) {
                    var geoQueryFunction = {
                        function: _this.getConvertedUnitsFunction("dist(" + _this.options.latitudeField + ", " + _this.options.longitudeField + ", " + _this.latitude + ", " + _this.longitude + ")"),
                        fieldName: "" + _this.options.distanceField
                    };
                    args.queryBuilder.queryFunctions.push(geoQueryFunction);
                    _this.enableDistanceComponents();
                }
            }
        });
    };
    DistanceResources.prototype.enableDistanceComponents = function () {
        var _this = this;
        Dom_1.$$(this.root)
            .findAll("." + this.options.disabledDistanceCssClass)
            .forEach(function (element) {
            try {
                element.classList.remove(_this.options.disabledDistanceCssClass);
                var coveoComponent = RegisteredNamedMethods_1.get(element);
                if (coveoComponent) {
                    coveoComponent.enable();
                }
            }
            catch (exception) {
                _this.logger.error('Could not re-enable distance component.', exception, element);
            }
        });
    };
    DistanceResources.prototype.getConvertedUnitsFunction = function (queryFunction) {
        return queryFunction + "/" + this.options.unitConversionFactor;
    };
    DistanceResources.ID = 'DistanceResources';
    DistanceResources.doExport = function () {
        GlobalExports_1.exportGlobally({
            DistanceResources: DistanceResources
        });
    };
    /**
     * The possible options for a DistanceResources.
     * @componentOptions
     */
    DistanceResources.options = {
        /**
         * Specifies the name of the field in which to store the distance value.
         *
         * Specifying a value for this option is required for the `DistanceResources` component to work.
         */
        distanceField: ComponentOptions_1.ComponentOptions.buildFieldOption({
            required: true
        }),
        /**
         * Specifies the name of the field that contains the latitude value.
         *
         * **Note:**
         * > The field you specify for this option must be an existing numerical field in your index (see
         * > [Adding and Managing Fields](https://docs.coveo.com/en/1833/). Otherwise, your query responses
         * > will contain a `QueryExceptionInvalidQueryFunctionField` or QueryExceptionInvalidQueryFunctionFieldType`
         * > exception, and the DistanceResources component will be unable to evaluate distances.
         *
         * Specifying a value for this option is required for the `DistanceResources` component to work.
         */
        latitudeField: ComponentOptions_1.ComponentOptions.buildFieldOption({
            required: true
        }),
        /**
         * Specifies the name of the field that contains the longitude value.
         *
         * **Note:**
         * > The field you specify for this option must be an existing numerical field in your index (see
         * > [Adding and Managing Fields](https://docs.coveo.com/en/1833/). Otherwise, your query responses
         * > will contain a `QueryExceptionInvalidQueryFunctionField` or QueryExceptionInvalidQueryFunctionFieldType`
         * > exception, and the DistanceResources component will be unable to evaluate distances.
         *
         * Specifying a value for this option is required for the `DistanceResources` component to work.
         */
        longitudeField: ComponentOptions_1.ComponentOptions.buildFieldOption({
            required: true
        }),
        /**
         * The conversion factor to apply to the base distance unit (meter).
         *
         * **Note:**
         * > - If you want to convert distances to kilometers, you should set the `unitConversionFactor` to `1000`.
         * > - If you want to convert distance to miles, you should set the `unitConversionFactor` to `1610` (one mile is
         * > approximately equal to 1610 meters).
         *
         * Default value is `1000`.
         */
        unitConversionFactor: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultValue: 1000,
            validator: function (value) {
                return !!value && value > 0;
            }
        }),
        /**
         * The CSS class for components that need to be re-enabled when the `DistanceResources` component successfully
         * provides a distance.
         *
         * Default value is `coveo-distance-disabled`.
         */
        disabledDistanceCssClass: ComponentOptions_1.ComponentOptions.buildStringOption({
            defaultValue: 'coveo-distance-disabled'
        }),
        /**
         * The latitude to use if no other position was provided.
         *
         * **Note:**
         * > You must also specify a [`longitudeValue`]{@link DistanceResources.options.longitudeValue} if you specify a
         * > `latitudeValue`.
         */
        latitudeValue: ComponentOptions_1.ComponentOptions.buildNumberOption({
            float: true
        }),
        /**
         * The longitude to use if no other position was provided.
         *
         * **Note:**
         * > You must also specify a [`latitudeValue`]{@link DistanceResources.options.latitudeValue} if you specify a
         * > `longitudeValue`.
         */
        longitudeValue: ComponentOptions_1.ComponentOptions.buildNumberOption({
            float: true
        }),
        /**
         * The API key to use to request the Google API geolocation service.
         *
         * If you do not specify a value for this option, the `DistanceResources` component does not try to request the
         * service.
         */
        googleApiKey: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Whether to request the geolocation service of the web browser.
         *
         * If not defined, will not try to request the service.
         *
         * **Note:**
         * > Recent web browsers typically require a site to be in HTTPS to enable their geolocation service.
         *
         * If you do not specify a value for this option, the `DistanceResources` component does not try to request the
         * service.
         */
        useNavigator: ComponentOptions_1.ComponentOptions.buildBooleanOption(),
        /**
         * Whether to execute a new query when the `DistanceResources` component successfully provides a new position.
         *
         * Default value is `false`.
         */
        triggerNewQueryOnNewPosition: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false
        }),
        /**
         * Whether to cancel all the queries until the `DistanceResources` component successfully resolves a position.
         *
         * Default value is `true`
         */
        cancelQueryUntilPositionResolved: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: true
        })
    };
    return DistanceResources;
}(Component_1.Component));
exports.DistanceResources = DistanceResources;
Initialization_1.Initialization.registerAutoCreateComponent(DistanceResources);


/***/ }),

/***/ 602:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
var EndpointCaller_1 = __webpack_require__(86);
var GOOGLE_MAP_BASE_URL = 'https://www.googleapis.com/geolocation/v1/geolocate';
/**
 * The `GoogleApiPositionProvider` class uses the
 * [Google Maps Geolocation API](https://developers.google.com/maps/documentation/geolocation/intro) to provide the
 * position of the end user to a [`DistanceResources`]{@link DistanceResources} component whose
 * [`googleApiKey`]{@link DistanceResources.options.googleApiKey} option is set to a valid  Google Maps Geolocation API
 * key.
 */
var GoogleApiPositionProvider = /** @class */ (function () {
    function GoogleApiPositionProvider(googleApiKey) {
        this.googleApiKey = googleApiKey;
    }
    GoogleApiPositionProvider.prototype.getPosition = function () {
        return __awaiter(this, void 0, void 0, function () {
            var responseData, location;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new EndpointCaller_1.EndpointCaller().call({
                            errorsAsSuccess: false,
                            method: 'POST',
                            queryString: ["key=" + this.googleApiKey],
                            requestData: {},
                            responseType: 'json',
                            url: GOOGLE_MAP_BASE_URL
                        })];
                    case 1:
                        responseData = _a.sent();
                        location = responseData.data.location;
                        return [2 /*return*/, {
                                longitude: location.lng,
                                latitude: location.lat
                            }];
                }
            });
        });
    };
    return GoogleApiPositionProvider;
}());
exports.GoogleApiPositionProvider = GoogleApiPositionProvider;


/***/ }),

/***/ 603:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The `NavigatorPositionProvider` class uses the current web browser to provide the position of the end user to
 * a [`DistanceResources`]{@link DistanceResources} component whose
 * [`useNavigator`]{DistanceResources.options.useNavigator} option is set to `true`.
 *
 * **Note:**
 * > Recent web browsers typically require a site to be in HTTPS to enable their geolocation service.
 */
var NavigatorPositionProvider = /** @class */ (function () {
    function NavigatorPositionProvider() {
    }
    NavigatorPositionProvider.prototype.getPosition = function () {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(function (position) {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, function (error) {
                reject(error);
            });
        });
    };
    return NavigatorPositionProvider;
}());
exports.NavigatorPositionProvider = NavigatorPositionProvider;


/***/ }),

/***/ 604:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The `StaticPositionProvider` class provides a static end user position to a
 * [`DistanceResources`]{@link DistanceResources} component.
 */
var StaticPositionProvider = /** @class */ (function () {
    function StaticPositionProvider(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    StaticPositionProvider.prototype.getPosition = function () {
        return Promise.resolve({
            longitude: this.longitude,
            latitude: this.latitude
        });
    };
    return StaticPositionProvider;
}());
exports.StaticPositionProvider = StaticPositionProvider;


/***/ })

});
//# sourceMappingURL=DistanceResources__36d30dcb7330ecf06f4d.js.map