import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { exportGlobally } from '../../GlobalExports';
import { Utils } from '../../Core';

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
     * Whether to disable scrolling in the search interface while facets are expanded in mobile responsive mode.
     */
    lockScroll: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * The element whose scrolling is locked.
     *
     * You can change the container by specifying its selector (e.g.,
     * `data-scroll-container-selector='#someCssSelector'`).
     *
     * By default, the framework uses the first vertically scrollable parent element it finds, starting from the
     * `FacetsMobileMode` element itself. A vertically scrollable element is an element whose CSS `overflow-y` attribute is
     * `scroll`.
     *
     * This implies that if the framework can find no scrollable parent, it uses the `document.body` itself as a scrollable
     * container.
     *
     * This heuristic is not perfect, for technical reasons. There are always some corner case CSS combination which the
     * framework will not be able to correctly detect as 'scrollable'.
     *
     * It is highly recommended that you manually set this option if you wish something else than the `document.body` to be the
     * scrollable element.
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
