import { Initialization } from '../Base/Initialization';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Component } from '../Base/Component';
import { DistanceEvents, IResolvingPositionEventArgs, IPosition } from '../../events/DistanceEvents';
import { exportGlobally } from '../../GlobalExports';

export interface INavigatorPositionProviderOptions {}

/**
 * The `NavigatorPositionProvider` component provides the user's position to a [`DistanceResources`]{@link DistanceResources} component according to the current navigator.
 *
 * Note that most browser requires your site to be in HTTPS to use this API.
 */
export class NavigatorPositionProvider extends Component {
  public static ID = 'NavigatorPositionProvider';
  static doExport = () => {
    exportGlobally({
      NavigatorPositionProvider: NavigatorPositionProvider
    });
  };

  /**
   * The possible options for a navigator position provider.
   * @componentOptions
   */
  public static options: INavigatorPositionProviderOptions = {};

  /**
   * Creates a new `NavigatorPositionProvider` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `NavigatorPositionProvider` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
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
