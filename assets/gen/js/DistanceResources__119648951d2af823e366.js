webpackJsonpCoveo__temporary([21],{

/***/ 174:
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
var Dom_1 = __webpack_require__(2);
var DistanceEvents_1 = __webpack_require__(139);
var AnalyticsActionListMeta_1 = __webpack_require__(9);
var Component_1 = __webpack_require__(6);
var ComponentOptions_1 = __webpack_require__(7);
var EventsModules_1 = __webpack_require__(99);
var Initialization_1 = __webpack_require__(1);
var RegisteredNamedMethods_1 = __webpack_require__(26);
var GlobalExports_1 = __webpack_require__(3);
var NavigatorPositionProvider_1 = __webpack_require__(373);
var GoogleApiPositionProvider_1 = __webpack_require__(374);
var StaticPositionProvider_1 = __webpack_require__(375);
/**
 * The `DistanceResources` component defines a field that computes the distance according to the current position of the
 * end user.
 *
 * Components relying on the current distance should be disabled until this component successfully provides a distance.
 *
 * See also [`DistanceEvents`]{@link DistanceEvents}.
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
        _this.bind.onRootElement(EventsModules_1.InitializationEvents.afterComponentsInitialization, function () { return _this.onAfterComponentsInitialization(); });
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
            this.executeQuery();
        }
    };
    /**
     * Returns a promise of the last position resolved using the registered position providers.
     *
     * @returns {Promise<IGeolocationPosition>} A promise of the last resolved position value.
     */
    DistanceResources.prototype.getLastPositionRequest = function () {
        return this.lastPositionRequest || Promise.reject('No position request was executed yet.');
    };
    DistanceResources.prototype.executeQuery = function () {
        // Since this DistanceResource component often blocks initial queries,
        // and relaunch the query automatically when it is able to do so (when a position provider resolves)
        // we need to have a mechanism to still log something useful for usage analytics, instead of always a "position set".
        // We want it to be "interface load" on a direct page access, or a "search from link" if coming from an external standalone search box
        // Everytime this component blocks a query, we keep a copy of the pending search event, and resend this instead of a generic "position set" event.
        if (this.pendingSearchEventOnCancellation) {
            this.usageAnalytics.logSearchEvent(this.getPendingEventOnCancellation(), this.pendingSearchEventOnCancellation.getEventMeta());
            delete this.pendingSearchEventOnCancellation;
        }
        else {
            this.usageAnalytics.logSearchEvent(AnalyticsActionListMeta_1.analyticsActionCauseList.positionSet, {});
        }
        this.queryController.executeQuery();
    };
    DistanceResources.prototype.shouldTriggerQueryWhenPositionSet = function () {
        // If query has been cancelled, we need to trigger the first one.
        var triggerFirstQueryWithPosition = this.options.cancelQueryUntilPositionResolved && !this.isFirstPositionResolved;
        return this.options.triggerNewQueryOnNewPosition || triggerFirstQueryWithPosition;
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
            _this.logger.error('An error occurred while trying to resolve the current position.', error);
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
                        _this.logger.warn('An error occurred while trying to resolve the position within a position provider.', error);
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
        this.isFirstPositionResolved = true;
        this.logger.warn("None of the given position providers could resolve the current position. The distance field will not be calculated and the distance components will be disabled until the next call to 'setPosition'.");
        this.bind.trigger(this.element, DistanceEvents_1.DistanceEvents.onPositionNotResolved, {});
        this.disable();
        this.executeQuery();
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
            else if (_this.options.cancelQueryUntilPositionResolved) {
                _this.pendingSearchEventOnCancellation = _this.usageAnalytics.getPendingSearchEvent();
                _this.logger.info('Query cancelled, waiting for position.');
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
    DistanceResources.prototype.getPendingEventOnCancellation = function () {
        return {
            name: this.pendingSearchEventOnCancellation.templateSearchEvent.actionCause,
            type: this.pendingSearchEventOnCancellation.templateSearchEvent.actionType
        };
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
         * > [Fields - Page](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=287). Otherwise, your query responses
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
         * > [Fields - Page](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=287). Otherwise, your query responses
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

/***/ 373:
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

/***/ 374:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EndpointCaller_1 = __webpack_require__(64);
var GOOGLE_MAP_BASE_URL = 'https://www.googleapis.com/geolocation/v1/geolocate';
/**
 * The `GoogleApiPositionProvider` class uses the
 * [Google Maps Geolocation API]{https://developers.google.com/maps/documentation/geolocation/intro} to provide the
 * position of the end user to a [`DistanceResources`]{@link DistanceResources} component whose
 * [`googleApiKey`]{@link DistanceResources.options.googleApiKey} option is set to a valid  Google Maps Geolocation API
 * key.
 */
var GoogleApiPositionProvider = /** @class */ (function () {
    function GoogleApiPositionProvider(googleApiKey) {
        this.googleApiKey = googleApiKey;
    }
    GoogleApiPositionProvider.prototype.getPosition = function () {
        return new EndpointCaller_1.EndpointCaller()
            .call({
            errorsAsSuccess: false,
            method: 'POST',
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

/***/ 375:
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
//# sourceMappingURL=DistanceResources__119648951d2af823e366.js.map