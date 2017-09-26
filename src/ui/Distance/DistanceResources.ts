import {
  DistanceEvents,
  IResolvingPositionEventArgs,
  IPosition,
  IPositionProvider,
  IPositionResolvedEventArgs
} from '../../events/DistanceEvents';

import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { InitializationEvents, QueryEvents } from '../../EventsModules';
import { IQueryFunction } from '../../rest/QueryFunction';
import { IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { Dom } from '../../UtilsModules';
import { Initialization } from '../Base/Initialization';
import { get } from '../Base/RegisteredNamedMethods';
import { exportGlobally } from '../../GlobalExports';

export interface IDistanceOptions {
  distanceField: string;
  latitudeField: string;
  longitudeField: string;
  unitConversionFactor: number;
  disabledDistanceCssClass: string;
}

/**
 * The `DistanceResources` component defines a field that computes the distance according to the user's position.
 *
 * You must use a position provider to provide a position to this component.
 * 
 * Components that uses the current distance should be disabled until a distance is provided by this component.
 * 
 * See also [`DistanceEvents`]{@link DistanceEvents} for events triggered by this component, 
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

  private lastPositionRequest: Promise<IPosition | void>;

  /**
   * The possible options for a DistanceResources.
   * @componentOptions
   */
  public static options: IDistanceOptions = {
    /**
     * Specifies the field that will contain the distance value.
     *
     * Specifying a value for this option is required for the `DistanceResources` component to work.
     */
    distanceField: ComponentOptions.buildStringOption({
      required: true
    }),
    /**
     * Specifies the field that contains the latitude value.
     *
     * Specifying a value for this option is required for the `DistanceResources` component to work.
     */
    latitudeField: ComponentOptions.buildStringOption({
      required: true
    }),
    /**
     * Specifies the field that contains the longitude value.
     *
     * Specifying a value for this option is required for the `DistanceResources` component to work.
     */
    longitudeField: ComponentOptions.buildStringOption({
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
    unitConversionFactor: ComponentOptions.buildNumberOption({
      defaultValue: 1000,
      validator: value => {
        return !!value && value > 0;
      }
    }),
    /**
     * The CSS class for components that needs to be reenabled when the distance is provided.
     * 
     * The default value is `coveo-distance-disabled`.
     */
    disabledDistanceCssClass: ComponentOptions.buildStringOption({
      defaultValue: 'coveo-distance-disabled'
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
    this.bind.onRootElement(InitializationEvents.afterComponentsInitialization, () => this.onAfterComponentsInitialization());
  }

  /**
   * Override the current position with the provided values.
   *
   * Triggers a query automatically.
   * @param latitude The latitude to set.
   * @param latitude The longitude to set.
   */
  public setPosition(latitude: number, longitude: number): void {
    this.latitude = latitude;
    this.longitude = longitude;

    const args: IPositionResolvedEventArgs = {
      position: {
        lat: latitude,
        long: longitude
      }
    };

    this.bind.trigger(this.element, DistanceEvents.onPositionResolved, args);
    this.registerDistanceQuery();
    this.queryController.executeQuery();
  }

  /**
   * Returns a promise of the last position resolved using the registered position providers.
   * 
   * @returns {Promise<IPosition | void>} Promise for the last resolved position value.
   */
  public getLastPositionRequest(): Promise<IPosition | void> {
    return this.lastPositionRequest || Promise.reject('No position request was executed yet.');
  }

  private onAfterComponentsInitialization(): void {
    const args: IResolvingPositionEventArgs = {
      providers: []
    };

    this.bind.trigger(this.element, DistanceEvents.onResolvingPosition, args);

    this.lastPositionRequest = this.tryGetPositionFromProviders(args.providers)
      .then(position => {
        if (!!position) {
          this.setPosition(position.lat, position.long);
        } else {
          this.triggerDistanceNotSet();
        }
        return position;
      })
      .catch(error => {
        this.logger.error('An error occured when trying to resolve the current position.', error);
        this.triggerDistanceNotSet();
      });
  }

  private tryGetPositionFromProviders(providers: IPositionProvider[]): Promise<IPosition | void> {
    return new Promise<IPosition>((resolve, reject) => {
      const tryNextProvider = () => {
        if (providers.length > 0) {
          const provider = providers.shift();
          provider
            .getPosition()
            .then(position => {
              if (!!position.lat && !!position.long) {
                resolve(position);
              } else {
                tryNextProvider();
              }
            })
            .catch(error => {
              this.logger.warn('An error occured when tring to resolve the position within a position provider.', error);
              tryNextProvider();
            });
        } else {
          resolve();
        }
      };
      tryNextProvider();
    });
  }

  private triggerDistanceNotSet(): void {
    this.logger.warn(
      "None of the given position providers could resolve the current position. The distance field will not be calculated and the distance components will be disabled until the next call to 'setDistance'."
    );
    this.bind.trigger(this.element, DistanceEvents.onPositionNotResolved, {});
  }

  private registerDistanceQuery(): void {
    this.bind.onRootElement(QueryEvents.buildingQuery, (args: IBuildingQueryEventArgs) => {
      const geoQueryFunction: IQueryFunction = {
        function: this.getConvertedUnitsFunction(
          `dist(${this.options.latitudeField}, ${this.options.longitudeField}, ${this.latitude}, ${this.longitude})`
        ),
        fieldName: this.options.distanceField
      };
      if (args && args.queryBuilder) {
        args.queryBuilder.queryFunctions.push(geoQueryFunction);
        this.enableDistanceComponents();
      }
    });
  }

  private enableDistanceComponents(): void {
    const rootDomElement = new Dom(this.root);

    rootDomElement.findAll(`.${this.options.disabledDistanceCssClass}`).forEach(element => {
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
