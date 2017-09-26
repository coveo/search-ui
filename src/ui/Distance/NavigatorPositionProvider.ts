import { Initialization } from '../Base/Initialization';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Component } from '../Base/Component';
import { DistanceEvents, IResolvingPositionEventArgs, IPosition } from '../../events/DistanceEvents';
import { exportGlobally } from '../../GlobalExports';

export interface INavigatorPositionProviderOptions {}

export class NavigatorPositionProvider extends Component {
  public static ID = 'NavigatorPositionProvider';
  static doExport = () => {
    exportGlobally({
      NavigatorPositionProvider: NavigatorPositionProvider
    });
  };
  public static options: INavigatorPositionProviderOptions = {};

  constructor(public element: HTMLElement, public options: INavigatorPositionProviderOptions, public bindings: IComponentBindings) {
    super(element, NavigatorPositionProvider.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, NavigatorPositionProvider, options);

    if (this.isUnderACoveoDistanceResources()) {
      this.bind.on(this.element.parentElement, DistanceEvents.onResolvingPosition, this.onResolvingPosition);
    } else {
      this.bind.onRootElement(DistanceEvents.onResolvingPosition, this.onResolvingPosition);
    }
  }

  private isUnderACoveoDistanceResources() {
    return this.element.parentElement.classList.contains('CoveoDistanceResources');
  }

  private onResolvingPosition(args: IResolvingPositionEventArgs): void {
    args.providers.push({
      getPosition: () => this.getPosition()
    });
  }

  private getPosition(): Promise<IPosition> {
    return new Promise<IPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            lat: position.coords.latitude,
            long: position.coords.longitude
          });
        },
        error => {
          reject(error);
        }
      );
    });
  }
}

Initialization.registerAutoCreateComponent(NavigatorPositionProvider);
