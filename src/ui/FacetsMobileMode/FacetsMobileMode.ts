import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { exportGlobally } from '../../GlobalExports';
import { Utils } from '../../Core';
import { Initialization } from '../Base/Initialization';

export interface IFacetsMobileModeOptions {
  breakpoint?: number;
  isModal?: boolean;
  showBackgroundWhileOpen?: boolean;
  lockScroll?: boolean;
  scrollContainer?: HTMLElement;
}

/**
 * This component lets you customize the mobile responsive behavior of facets in your search interface.
 *
 * **Notes:**
 * - You can include this component anywhere under the root element of your search interface.
 * - You should only include this component once in your search interface.
 * - If you do not include this component in your search interface, facets will still have a default mobile responsive behavior.
 */
export class FacetsMobileMode extends Component {
  static ID = 'FacetsMobileMode';

  /**
   * @componentOptions
   */
  static options: IFacetsMobileModeOptions = {
    /**
     * The screen width (in number of pixels) at which facets should enter mobile responsive mode and be collapsed under a single button.
     *
     * **Default:** `800`
     */
    breakpoint: ComponentOptions.buildNumberOption(),
    /**
     * Whether to display the facets in a modal instead of a pop-up when the end user expands them in mobile responsive mode.
     */
    isModal: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Whether to display a background behind the facets when the end user expands them in mobile responsive mode.
     */
    showBackgroundWhileOpen: ComponentOptions.buildBooleanOption({
      postProcessing: (value, options) => (Utils.isNullOrUndefined(value) ? !options.isModal : value)
    }),
    /**
     * Whether to disable vertical scrolling on the specified or resolved [`scrollContainer`]{@link FacetsMobileMode.options.scrollContainer} while facets are expanded in mobile responsive mode.
     */
    lockScroll: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * The HTML element whose vertical scrolling should be locked while facets are expanded in mobile responsive mode.
     *
     * By default, the component tries to detect and use the first ancestor element whose CSS `overflow-y` attribute is set to `scroll`, starting from the `FacetsMobileMode`'s element itself. If no such element is found, the `document.body` element is used.
     *
     * Since this heuristic is not perfect, we strongly recommend that you manually set this option by explicitly specifying the desired CSS selector.
     *
     * **Example:** `data-scroll-container-selector='#someCssSelector'`
     */
    scrollContainer: ComponentOptions.buildChildHtmlElementOption({
      depend: 'lockScroll',
      defaultFunction: element => ComponentOptions.findParentScrollLockable(element)
    })
  };

  static doExport = () => {
    exportGlobally({
      FacetsMobileMode: FacetsMobileMode
    });
  };

  public options: IFacetsMobileModeOptions;

  constructor(public element: HTMLElement, options?: IFacetsMobileModeOptions, bindings?: IComponentBindings) {
    super(element, FacetsMobileMode.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, FacetsMobileMode, options);
    if (this.options.lockScroll && !this.options.scrollContainer) {
      this.options.scrollContainer = ComponentOptions.findParentScrollLockable(this.searchInterface.element);
    }
  }
}

Initialization.registerAutoCreateComponent(FacetsMobileMode);
