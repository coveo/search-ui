webpackJsonpCoveo__temporary([14],{

/***/ 280:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
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
var Dom_1 = __webpack_require__(3);
var DistanceEvents_1 = __webpack_require__(475);
var AnalyticsActionListMeta_1 = __webpack_require__(12);
var Component_1 = __webpack_require__(8);
var ComponentOptions_1 = __webpack_require__(9);
var EventsModules_1 = __webpack_require__(99);
var Initialization_1 = __webpack_require__(2);
var RegisteredNamedMethods_1 = __webpack_require__(34);
var GlobalExports_1 = __webpack_require__(4);
var NavigatorPositionProvider_1 = __webpack_require__(476);
var GoogleApiPositionProvider_1 = __webpack_require__(477);
var StaticPositionProvider_1 = __webpack_require__(478);
/**
 * The `DistanceResources` component defines a field that computes the distance according to the user's position.
 *
 * Components that uses the current distance should be disabled until a distance is provided by this component.
 *
 * See also [`DistanceEvents`]{@link DistanceEvents} for events triggered by this component.
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
        _this.isPositionSet = false;
        _this.options = ComponentOptions_1.ComponentOptions.initComponentOptions(element, DistanceResources, options);
        _this.registerDistanceQuery();
        _this.bind.onRootElement(EventsModules_1.InitializationEvents.afterComponentsInitialization, function () { return _this.onAfterComponentsInitialization(); });
        return _this;
    }
    /**
     * Override the current position with the provided values.
     *
     * Does not triggers a query automatically.
     * @param latitude The latitude to set.
     * @param longitude The longitude to set.
     */
    DistanceResources.prototype.setPosition = function (latitude, longitude) {
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
        this.isPositionSet = true;
        if (shouldTriggerQuery) {
            this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.positionSet, {});
            this.queryController.executeQuery();
        }
    };
    DistanceResources.prototype.shouldTriggerQueryWhenPositionSet = function () {
        // If query has been cancelled, we need to trigger the first one.
        var triggerFirstQueryWithPosition = this.options.cancelQueryUntilPositionResolved && !this.isPositionSet;
        return this.options.triggerNewQueryOnNewPosition || triggerFirstQueryWithPosition;
    };
    /**
     * Returns a promise of the last position resolved using the registered position providers.
     *
     * @returns {Promise<IPosition>} Promise for the last resolved position value.
     */
    DistanceResources.prototype.getLastPositionRequest = function () {
        return this.lastPositionRequest || Promise.reject('No position request was executed yet.');
    };
    DistanceResources.prototype.onAfterComponentsInitialization = function () {
        var _this = this;
        var args = {
            providers: this.getProvidersFromOptions()
        };
        this.bind.trigger(this.element, DistanceEvents_1.DistanceEvents.onResolvingPosition, args);
        this.lastPositionRequest = this.tryGetPositionFromProviders(args.providers)
            .then(function (position) {
            if (position) {
                _this.setPosition(position.latitude, position.longitude);
            }
            else {
                _this.triggerDistanceNotSet();
            }
            return position;
        })
            .catch(function (error) {
            _this.logger.error('An error occured when trying to resolve the current position.', error);
            _this.triggerDistanceNotSet();
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
        var _this = this;
        return new Promise(function (resolve, reject) {
            var tryNextProvider = function () {
                if (providers.length > 0) {
                    var provider = providers.shift();
                    provider
                        .getPosition()
                        .then(function (position) {
                        if (!!position.latitude && !!position.longitude) {
                            resolve(position);
                        }
                        else {
                            tryNextProvider();
                        }
                    })
                        .catch(function (error) {
                        _this.logger.warn('An error occured when tring to resolve the position within a position provider.', error);
                        tryNextProvider();
                    });
                }
                else {
                    resolve();
                }
            };
            tryNextProvider();
        });
    };
    DistanceResources.prototype.triggerDistanceNotSet = function () {
        this.isPositionSet = false;
        this.logger.warn("None of the given position providers could resolve the current position. The distance field will not be calculated and the distance components will be disabled until the next call to 'setPosition'.");
        this.bind.trigger(this.element, DistanceEvents_1.DistanceEvents.onPositionNotResolved, {});
    };
    DistanceResources.prototype.registerDistanceQuery = function () {
        var _this = this;
        this.bind.onRootElement(EventsModules_1.QueryEvents.buildingQuery, function (args) {
            if (_this.isPositionSet) {
                if (args && args.queryBuilder) {
                    var geoQueryFunction = {
                        function: _this.getConvertedUnitsFunction("dist(" + _this.options.latitudeField + ", " + _this.options.longitudeField + ", " + _this.latitude + ", " + _this.longitude + ")"),
                        fieldName: "" + _this.options.distanceField
                    };
                    args.queryBuilder.queryFunctions.push(geoQueryFunction);
                    _this.enableDistanceComponents();
                }
            }
            else if (_this.options.cancelQueryUntilPositionResolved) {
                _this.logger.info('Query cancelled, waiting for position');
                args.cancel = true;
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
         * Specifies the field that will contain the distance value.
         *
         * Specifying a value for this option is required for the `DistanceResources` component to work.
         */
        distanceField: ComponentOptions_1.ComponentOptions.buildFieldOption({
            required: true
        }),
        /**
         * Specifies the field that contains the latitude value.
         *
         * Specifying a value for this option is required for the `DistanceResources` component to work.
         */
        latitudeField: ComponentOptions_1.ComponentOptions.buildFieldOption({
            required: true
        }),
        /**
         * Specifies the field that contains the longitude value.
         *
         * Specifying a value for this option is required for the `DistanceResources` component to work.
         */
        longitudeField: ComponentOptions_1.ComponentOptions.buildFieldOption({
            required: true
        }),
        /**
         * The conversion factor to use for the distance according to the base unit, in meters.
         *
         * If you want to have Kilometers, you should set 1000 as the value.
         * If you want to have your distance in miles, you should set 1610 as the value, since a mile is approximately 1610 meters.
         *
         * The default value is `1000`.
         */
        unitConversionFactor: ComponentOptions_1.ComponentOptions.buildNumberOption({
            defaultValue: 1000,
            validator: function (value) {
                return !!value && value > 0;
            }
        }),
        /**
         * The CSS class for components that needs to be reenabled when the distance is provided.
         *
         * The default value is `coveo-distance-disabled`.
         */
        disabledDistanceCssClass: ComponentOptions_1.ComponentOptions.buildStringOption({
            defaultValue: 'coveo-distance-disabled'
        }),
        /**
         * The latitude to use if no other position was provided.
         *
         * You must also set `longitudeValue` if you specify this value.
         */
        latitudeValue: ComponentOptions_1.ComponentOptions.buildNumberOption({
            float: true
        }),
        /**
         * The longitude to use if no other position was provided.
         *
         * You must also set `latitude` if you specify this value.
         */
        longitudeValue: ComponentOptions_1.ComponentOptions.buildNumberOption({
            float: true
        }),
        /**
         * The API key to use to request the Google API geolocation service.
         *
         * If not defined, will not try to request the service.
         */
        googleApiKey: ComponentOptions_1.ComponentOptions.buildStringOption(),
        /**
         * Whether to request the browser's geolocation service.
         *
         * If not defined, will not try to request the service.
         *
         * Note that most recent browsers requires your site to be in HTTPS to use its geolocation service.
         */
        useNavigator: ComponentOptions_1.ComponentOptions.buildBooleanOption(),
        /**
         * Whether to execute a new query when a new position has been provided.
         *
         * Default value is `true`.
         */
        triggerNewQueryOnNewPosition: ComponentOptions_1.ComponentOptions.buildBooleanOption({
            defaultValue: false
        }),
        /**
         * Whether to cancel all the queries until the position is resolved.
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),

/***/ 475:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This static class contains the different string definitions for all the events related to distance.
 */
var DistanceEvents = /** @class */ (function () {
    function DistanceEvents() {
    }
    /**
     * Triggered when the [`DistanceResources`]{@link DistanceResources} component sucessfully resolves the position.
     *
     * All bound handlers will receive {@link IPositionResolvedEventArgs} as an argument.
     *
     * The string value is `onPositionResolved`.
     * @type {string}
     */
    DistanceEvents.onPositionResolved = 'onPositionResolved';
    /**
     * Triggered when the [`DistanceResources`]{@link DistanceResources} component tries to resolve the position.
     *
     * Use this event to register new position providers.
     *
     * All bound handlers will receive {@link IResolvingPositionEventArgs} as an argument.
     *
     * The string value is `onResolvingPosition`.
     * @type {string}
     */
    DistanceEvents.onResolvingPosition = 'onResolvingPosition';
    /**
     * Triggered when the [`DistanceResources`]{@link DistanceResources} component fails to resolve the position.
     *
     * Use this event to show an error to the end user, or hide components that cannot be used.
     *
     * The string value is `onPositionNotResolved`.
     * @type {string}
     */
    DistanceEvents.onPositionNotResolved = 'onPositionNotResolved';
    return DistanceEvents;
}());
exports.DistanceEvents = DistanceEvents;


/***/ }),

/***/ 476:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The `NavigatorPositionProvider` component provides the user's position to a [`DistanceResources`]{@link DistanceResources} component according to the current navigator.
 *
 * Note that most browser requires your site to be in HTTPS to use this API.
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),

/***/ 477:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EndpointCaller_1 = __webpack_require__(61);
var GOOGLE_MAP_BASE_URL = 'https://www.googleapis.com/geolocation/v1/geolocate';
/**
 * The `GoogleApiPositionProvider` component provides the user's position to a [`DistanceResources`]{@link DistanceResources} component using Google's geolocation API.
 */
var GoogleApiPositionProvider = /** @class */ (function () {
    function GoogleApiPositionProvider(googleApiKey) {
        this.googleApiKey = googleApiKey;
    }
    GoogleApiPositionProvider.prototype.getPosition = function () {
        return new EndpointCaller_1.EndpointCaller()
            .call({
            errorsAsSuccess: false,
            method: 'GET',
            queryString: ["key=" + this.googleApiKey],
            requestData: {},
            responseType: 'json',
            url: GOOGLE_MAP_BASE_URL
        })
            .then(function (responseData) {
            var location = responseData.data.location;
            return {
                longitude: location.lng,
                latitude: location.lat
            };
        });
    };
    return GoogleApiPositionProvider;
}());
exports.GoogleApiPositionProvider = GoogleApiPositionProvider;


/***/ }),

/***/ 478:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The `StaticPositionProvider` component provides a static user position to a [`DistanceResources`]{@link DistanceResources} component.
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ })

});
//# sourceMappingURL=DistanceResources.js.map