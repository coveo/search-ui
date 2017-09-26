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
  unitDisplayName: string;
  unitConversionFactor: number;
  disabledDistanceCssClass: string;
}

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

  public static options: IDistanceOptions = {
    distanceField: ComponentOptions.buildStringOption({
      required: true
    }),
    latitudeField: ComponentOptions.buildStringOption({
      required: true
    }),
    longitudeField: ComponentOptions.buildStringOption({
      required: true
    }),
    unitDisplayName: ComponentOptions.buildStringOption(),
    unitConversionFactor: ComponentOptions.buildNumberOption({
      defaultValue: 1000,
      validator: value => {
        return !!value && value > 0;
      }
    }),
    disabledDistanceCssClass: ComponentOptions.buildStringOption({
      defaultValue: 'coveo-distance-disabled'
    })
  };

  constructor(public element: HTMLElement, public options: IDistanceOptions, public bindings: IComponentBindings) {
    super(element, DistanceResources.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, DistanceResources, options);
    this.bind.onRootElement(InitializationEvents.afterComponentsInitialization, () => this.onAfterComponentsInitialization());
  }

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

  public getLastPositionRequest(): Promise<IPosition | void> {
    return this.lastPositionRequest;
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
