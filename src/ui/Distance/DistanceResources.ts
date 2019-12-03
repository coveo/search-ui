import {
  DistanceEvents,
  IGeolocationPosition,
  IGeolocationPositionProvider,
  IPositionResolvedEventArgs,
  IResolvingPositionEventArgs
} from '../../events/DistanceEvents';
import { IInitializationEventArgs } from '../../events/InitializationEvents';
import { IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { InitializationEvents, QueryEvents } from '../../EventsModules';
import { exportGlobally } from '../../GlobalExports';
import { IQueryFunction } from '../../rest/QueryFunction';
import { $$ } from '../../utils/Dom';
import { analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IFieldOption } from '../Base/IComponentOptions';
import { Initialization } from '../Base/Initialization';
import { get } from '../Base/RegisteredNamedMethods';
import { GoogleApiPositionProvider } from './GoogleApiPositionProvider';
import { NavigatorPositionProvider } from './NavigatorPositionProvider';
import { StaticPositionProvider } from './StaticPositionProvider';

export interface IDistanceOptions {
  distanceField: IFieldOption;
  latitudeField: IFieldOption;
  longitudeField: IFieldOption;
  unitConversionFactor: number;
  disabledDistanceCssClass: string;
  latitudeValue: number;
  longitudeValue: number;
  googleApiKey: string;
  useNavigator: boolean;
  triggerNewQueryOnNewPosition: boolean;
  cancelQueryUntilPositionResolved: boolean;
}

/**
 * The `DistanceResources` component defines a field that computes the distance according to the current position of the
 * end user.
 *
 * Components relying on the current distance should be disabled until this component successfully provides a distance.
 *
 * See also [`DistanceEvents`]{@link DistanceEvents}.
 */
export class DistanceResources extends Component {
  public static ID = 'DistanceResources';
  static doExport = () => {
    exportGlobally({
      DistanceResources: DistanceResources
    });
  };
  private latitude: number;
  private longitude: number;
  private lastPositionRequest: Promise<void>;
  private isFirstPositionResolved = false;

  /**
   * The possible options for a DistanceResources.
   * @componentOptions
   */
  public static options: IDistanceOptions = {
    /**
     * Specifies the name of the field in which to store the distance value.
     *
     * Specifying a value for this option is required for the `DistanceResources` component to work.
     */
    distanceField: ComponentOptions.buildFieldOption({
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
    latitudeField: ComponentOptions.buildFieldOption({
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
    longitudeField: ComponentOptions.buildFieldOption({
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
    unitConversionFactor: ComponentOptions.buildNumberOption({
      defaultValue: 1000,
      validator: value => {
        return !!value && value > 0;
      }
    }),

    /**
     * The CSS class for components that need to be re-enabled when the `DistanceResources` component successfully
     * provides a distance.
     *
     * Default value is `coveo-distance-disabled`.
     */
    disabledDistanceCssClass: ComponentOptions.buildStringOption({
      defaultValue: 'coveo-distance-disabled'
    }),

    /**
     * The latitude to use if no other position was provided.
     *
     * **Note:**
     * > You must also specify a [`longitudeValue`]{@link DistanceResources.options.longitudeValue} if you specify a
     * > `latitudeValue`.
     */
    latitudeValue: ComponentOptions.buildNumberOption({
      float: true
    }),

    /**
     * The longitude to use if no other position was provided.
     *
     * **Note:**
     * > You must also specify a [`latitudeValue`]{@link DistanceResources.options.latitudeValue} if you specify a
     * > `longitudeValue`.
     */
    longitudeValue: ComponentOptions.buildNumberOption({
      float: true
    }),

    /**
     * The API key to use to request the Google API geolocation service.
     *
     * If you do not specify a value for this option, the `DistanceResources` component does not try to request the
     * service.
     */
    googleApiKey: ComponentOptions.buildStringOption(),

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
    useNavigator: ComponentOptions.buildBooleanOption(),

    /**
     * Whether to execute a new query when the `DistanceResources` component successfully provides a new position.
     *
     * Default value is `false`.
     */
    triggerNewQueryOnNewPosition: ComponentOptions.buildBooleanOption({
      defaultValue: false
    }),

    /**
     * Whether to cancel all the queries until the `DistanceResources` component successfully resolves a position.
     *
     * Default value is `true`
     */
    cancelQueryUntilPositionResolved: ComponentOptions.buildBooleanOption({
      defaultValue: true
    })
  };

  /**
   * Creates a new `DistanceResources` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `DistanceResources` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options: IDistanceOptions, public bindings: IComponentBindings) {
    super(element, DistanceResources.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, DistanceResources, options);
    this.registerDistanceQuery();
    this.bind.onRootElement(InitializationEvents.afterComponentsInitialization, (args: IInitializationEventArgs) =>
      this.onAfterComponentsInitialization(args)
    );
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
  public setPosition(latitude: number, longitude: number): void {
    this.enable();
    this.latitude = latitude;
    this.longitude = longitude;

    const args: IPositionResolvedEventArgs = {
      position: {
        latitude: latitude,
        longitude: longitude
      }
    };

    this.bind.trigger(this.element, DistanceEvents.onPositionResolved, args);

    const shouldTriggerQuery = this.shouldTriggerQueryWhenPositionSet();
    this.isFirstPositionResolved = true;
    if (shouldTriggerQuery) {
      this.sendAnalytics();
      this.queryController.executeQuery();
    }
  }

  /**
   * Returns a promise of the last position resolved using the registered position providers.
   *
   * @returns {Promise<IGeolocationPosition>} A promise of the last resolved position value.
   */
  public async getLastPositionRequest(): Promise<IGeolocationPosition> {
    if (!!this.lastPositionRequest) {
      await this.lastPositionRequest;
      return {
        latitude: this.latitude,
        longitude: this.longitude
      };
    } else {
      Promise.reject('No position request was executed yet.');
    }
  }

  private sendAnalytics() {
    this.usageAnalytics.logSearchEvent(analyticsActionCauseList.positionSet, {});
  }

  private shouldTriggerQueryWhenPositionSet() {
    // Don't trigger the query if the first one is not yet executed.
    return !this.queryController.firstQuery && this.options.triggerNewQueryOnNewPosition;
  }

  private onAfterComponentsInitialization(afterComponentsInitializationArgs: IInitializationEventArgs): void {
    const args: IResolvingPositionEventArgs = {
      providers: this.getProvidersFromOptions()
    };

    this.bind.trigger(this.element, DistanceEvents.onResolvingPosition, args);

    this.lastPositionRequest = this.tryToSetPositionFromProviders(args.providers);

    if (this.options.cancelQueryUntilPositionResolved) {
      afterComponentsInitializationArgs.defer.push(this.lastPositionRequest);
    }
  }

  private async tryToSetPositionFromProviders(providers: IGeolocationPositionProvider[]): Promise<void> {
    try {
      const position = await this.tryGetPositionFromProviders(providers);
      if (position) {
        this.setPosition(position.latitude, position.longitude);
      } else {
        this.triggerDistanceNotSet();
      }
    } catch (error) {
      this.logger.error('An error occurred while trying to resolve the current position.', error);
      this.triggerDistanceNotSet();
    }
  }

  private getProvidersFromOptions(): IGeolocationPositionProvider[] {
    const providers: IGeolocationPositionProvider[] = [];

    if (this.options.useNavigator) {
      providers.push(new NavigatorPositionProvider());
    }

    if (this.options.googleApiKey) {
      providers.push(new GoogleApiPositionProvider(this.options.googleApiKey));
    }

    if (this.options.longitudeValue && this.options.latitudeValue) {
      providers.push(new StaticPositionProvider(this.options.latitudeValue, this.options.longitudeValue));
    }

    return providers;
  }

  private async tryGetPositionFromProviders(providers: IGeolocationPositionProvider[]): Promise<IGeolocationPosition> {
    while (providers.length > 0) {
      const provider = providers.shift();
      try {
        const position = await provider.getPosition();
        if (!!position.latitude && !!position.longitude) {
          return position;
        }
      } catch (error) {
        this.logger.warn('An error occurred while trying to resolve the position within a position provider.', error);
      }
    }
    return;
  }

  private triggerDistanceNotSet(): void {
    this.isFirstPositionResolved = true;
    this.logger.warn(
      `None of the given position providers could resolve the current position. The distance field will not be calculated and the distance components will be disabled until the next call to 'setPosition'.`
    );
    this.bind.trigger(this.element, DistanceEvents.onPositionNotResolved, {});
    this.disable();
  }

  private registerDistanceQuery(): void {
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => {
      if (this.isFirstPositionResolved) {
        if (args && args.queryBuilder) {
          const geoQueryFunction: IQueryFunction = {
            function: this.getConvertedUnitsFunction(
              `dist(${this.options.latitudeField}, ${this.options.longitudeField}, ${this.latitude}, ${this.longitude})`
            ),
            fieldName: `${this.options.distanceField}`
          };
          args.queryBuilder.queryFunctions.push(geoQueryFunction);
          this.enableDistanceComponents();
        }
      }
    });
  }

  private enableDistanceComponents(): void {
    $$(this.root)
      .findAll(`.${this.options.disabledDistanceCssClass}`)
      .forEach(element => {
        try {
          element.classList.remove(this.options.disabledDistanceCssClass);
          const coveoComponent = get(element);
          if (coveoComponent) {
            coveoComponent.enable();
          }
        } catch (exception) {
          this.logger.error('Could not re-enable distance component.', exception, element);
        }
      });
  }

  private getConvertedUnitsFunction(queryFunction: string): string {
    return `${queryFunction}/${this.options.unitConversionFactor}`;
  }
}

Initialization.registerAutoCreateComponent(DistanceResources);
