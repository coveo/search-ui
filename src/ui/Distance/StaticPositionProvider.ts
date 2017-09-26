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

export class StaticPositionProvider extends Component {
  public static ID = 'StaticPositionProvider';
  static doExport = () => {
    exportGlobally({
      StaticPositionProvider: StaticPositionProvider
    });
  };
  public static options: IStaticPositionProviderOptions = {
    latitude: ComponentOptions.buildNumberOption({
      required: true,
      float: true
    }),
    longitude: ComponentOptions.buildNumberOption({
      required: true,
      float: true
    })
  };

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
