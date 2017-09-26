import { Initialization } from '../Base/Initialization';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Component } from '../Base/Component';
import { DistanceEvents, IResolvingPositionEventArgs, IPosition } from '../../events/DistanceEvents';
import { exportGlobally } from '../../GlobalExports';

export interface IStaticPositionProviderOptions {
  longitude: number;
  latitude: number;
}

/**
 * The `StaticPositionProvider` component provides a static user position to a [`DistanceResources`]{@link DistanceResources} component.
 */
export class StaticPositionProvider extends Component {
  public static ID = 'StaticPositionProvider';
  static doExport = () => {
    exportGlobally({
      StaticPositionProvider: StaticPositionProvider
    });
  };

  /**
   * The possible options for a static position provider.
   * @componentOptions
   */
  public static options: IStaticPositionProviderOptions = {
    /**
     * Specifies the latitude to use.
     *
     * Specifying a value for this option is required for the `StaticPositionProvider` component to work.
     */
    latitude: ComponentOptions.buildNumberOption({
      required: true,
      float: true
    }),
    /**
     * Specifies the longitude to use.
     *
     * Specifying a value for this option is required for the `StaticPositionProvider` component to work.
     */
    longitude: ComponentOptions.buildNumberOption({
      required: true,
      float: true
    })
  };

  /**
   * Creates a new `StaticPositionProvider` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `StaticPositionProvider` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options: IStaticPositionProviderOptions, public bindings: IComponentBindings) {
    super(element, StaticPositionProvider.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, StaticPositionProvider, options);

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
    if (this.canGetPosition()) {
      args.providers.push({
        getPosition: () => this.getPosition()
      });
    }
  }

  private canGetPosition(): boolean {
    return !!this.options.latitude && !!this.options.longitude;
  }

  private getPosition(): Promise<IPosition> {
    return Promise.resolve({
      long: this.options.longitude,
      lat: this.options.latitude
    });
  }
}

Initialization.registerAutoCreateComponent(StaticPositionProvider);
