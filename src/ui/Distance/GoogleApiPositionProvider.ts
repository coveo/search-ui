import { IComponentBindings } from '../Base/ComponentBindings';
import { Initialization } from '../Base/Initialization';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Component } from '../Base/Component';
import { DistanceEvents, IResolvingPositionEventArgs, IPosition } from '../../events/DistanceEvents';
import { exportGlobally } from '../../GlobalExports';

const GOOGLE_MAP_BASE_URL = 'https://www.googleapis.com/geolocation/v1/geolocate';

export interface IGoogleApiPositionProviderOptions {
  googleApiKey: string;
}

interface IGeolocationResponse {
  location: IGeolocationResponseLocation;
}

interface IGeolocationResponseLocation {
  lat: number;
  lng: number;
}

export class GoogleApiPositionProvider extends Component {
  public static ID = 'GoogleApiPositionProvider';
  static doExport = () => {
    exportGlobally({
      GoogleApiPositionProvider: GoogleApiPositionProvider
    });
  };
  public static options: IGoogleApiPositionProviderOptions = {
    googleApiKey: ComponentOptions.buildStringOption({
      required: true
    })
  };

  constructor(public element: HTMLElement, public options: IGoogleApiPositionProviderOptions, public bindings: IComponentBindings) {
    super(element, GoogleApiPositionProvider.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, GoogleApiPositionProvider, options);

    if (this.isUnderACoveoDistanceResources()) {
      this.bind.on(this.element.parentElement, DistanceEvents.onResolvingPosition, this.onResolvingPosition);
    } else {
      this.bind.onRootElement(DistanceEvents.onResolvingPosition, this.onResolvingPosition);
    }
    this.validateProperties();
  }

  private isUnderACoveoDistanceResources() {
    return this.element.parentElement.classList.contains('CoveoDistanceResources');
  }

  private onResolvingPosition(args: IResolvingPositionEventArgs): void {
    if (this.canProvideDistance()) {
      args.providers.push({
        getPosition: () => this.getPosition()
      });
    }
  }

  private canProvideDistance(): boolean {
    return !!this.options.googleApiKey;
  }

  private getPosition(): Promise<IPosition> {
    return fetch(`${GOOGLE_MAP_BASE_URL}?key=${this.options.googleApiKey}`)
      .then(response => {
        return response.json();
      })
      .then((responseData: IGeolocationResponse) => {
        const location = responseData.location;
        return {
          lat: location.lat,
          long: location.lng
        };
      });
  }

  private validateProperties(): void {
    if (!this.options.googleApiKey) {
      this.logger.error(`You must set the "googleApiKey" property for this component to work properly. It will be disabled.`);
    }
  }
}

Initialization.registerAutoCreateComponent(GoogleApiPositionProvider);
