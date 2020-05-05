import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { exportGlobally } from '../../GlobalExports';
import { Utils } from '../../Core';

export interface IMobileFacetOptions {
  breakpoint?: number;
  isModal?: boolean;
  showBackgroundWhileOpen?: boolean;
  lockScroll?: boolean;
}

/**
 * Allows the customization of how facets are displayed to mobile users.
 */
export class MobileFacet extends Component {
  static ID = 'MobileFacet';

  /**
   * @componentOptions
   */
  static options: IMobileFacetOptions = {
    /**
     * Under which screen width facets should be in a mobile state and collapsed into a button.
     */
    breakpoint: ComponentOptions.buildNumberOption(),
    /**
     * Whether facets should be displayed in a modal instead of a pop-up when they are opened from their mobile state.
     */
    isModal: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Whether a background should be displayed behind facets when they are opened from their mobile state.
     */
    showBackgroundWhileOpen: ComponentOptions.buildBooleanOption({
      postProcessing: (value, options) => (Utils.isNullOrUndefined(value) ? !options.isModal : value)
    }),
    /**
     * Whether scroll should be locked while facets are opened from their mobile state.
     */
    lockScroll: ComponentOptions.buildBooleanOption({ defaultValue: false })
  };

  static doExport = () => {
    exportGlobally({
      MobileFacet
    });
  };

  public options: IMobileFacetOptions;

  constructor(public element: HTMLElement, options?: IMobileFacetOptions, bindings?: IComponentBindings) {
    super(element, MobileFacet.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, MobileFacet, options);
  }
}
