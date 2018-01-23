import { IOmniboxOptions } from '../Omnibox/Omnibox';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Omnibox } from '../Omnibox/Omnibox';
import { ComponentOptions } from '../Base/ComponentOptions';
import { SearchButton } from '../SearchButton/SearchButton';
import { Querybox } from '../Querybox/Querybox';
import { $$ } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';

import 'styling/_Searchbox';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

export interface ISearchboxOptions extends IOmniboxOptions {
  addSearchButton?: boolean;
  enableOmnibox?: boolean;
}

/**
 * The `Searchbox` component allows you to conveniently instantiate two components which end users frequently use to
 * enter and submit queries.
 *
 * This component attaches itself to a `div` element and takes care of instantiating either a
 * [`Querybox`]{@link Querybox} or an [`Omnibox`]{@link Omnibox} component (see the
 * [`enableOmnibox`]{@link Searchbox.options.enableOmnibox} option). Optionally, the `Searchbox` can also instantiate a
 * [`SearchButton`]{@link SearchButton} component, and append it inside the same `div` (see the
 * [`addSearchButton`]{@link Searchbox.options.addSearchButton} option).
 */
export class Searchbox extends Component {
  static ID = 'Searchbox';
  static parent = Omnibox;

  static doExport = () => {
    exportGlobally({
      Searchbox: Searchbox,
      SearchButton: SearchButton,
      Omnibox: Omnibox,
      Querybox: Querybox
    });
  };

  /**
   * Possible options for the {@link Searchbox}
   * @componentOptions
   */
  static options: ISearchboxOptions = {
    /**
     * Specifies whether to instantiate a [`SearchButton`]{@link SearchButton} component.
     *
     * Default value is `true`.
     */
    addSearchButton: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether to instantiate an [`Omnibox`]{@link Omnibox} component.
     *
     * When this option is `false`, the `Searchbox` instantiates a [`Querybox`]{@link Querybox} component instead.
     *
     * **Note:**
     * > You can use configuration options specific to the component you choose to instantiate with the `Searchbox`.
     *
     * **Examples:**
     *
     * In this first case, the `Searchbox` instantiates a `Querybox` component. You can configure this `Querybox`
     * instance using any of the `Querybox` component options, such as
     * [`triggerQueryOnClear`]{@link Querybox.options.triggerQueryOnClear}.
     * ```html
     * <div class='CoveoSearchbox' data-trigger-query-on-clear='true'></div>
     * ```
     *
     * In this second case, the `Searchbox` instantiates an `Omnibox` component. You can configure this `Omnibox`
     * instance using any of the `Omnibox` component options, such as
     * [`placeholder`]{@link Omnibox.options.placeholder}.
     * Moreover, since the `Omnibox` component inherits all of the `Querybox` component options, the
     * `data-trigger-query-on-clear` option from the previous example would also work on this `Omnibox` instance.
     * ```html
     * <div class='CoveoSearchbox' data-enable-omnibox='true' data-placeholder='Please enter a query'></div>
     * ```
     *
     * Default value is `true`.
     */
    enableOmnibox: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  /**
   * The [`SearchButton`]{@link SearchButton} component instance.
   */
  public searchButton: SearchButton;

  /**
   * The component instance which allows end users to input queries.
   *
   * Can be either a [`Querybox`]{@link Querybox} or an [`Omnibox`]{@link Omnibox} component, depending on the value of
   * [`enableOmnibox`]{@link Searchbox.options.enableOmnibox}.
   */
  public searchbox: Querybox | Omnibox;

  /**
   * Creates a new `Searchbox` component. Creates a new `Coveo.Magicbox` instance and wraps magic box methods (`onblur`,
   * `onsubmit`, etc.). Binds event on `buildingQuery` and on redirection (for standalone box).
   * @param element The HTMLElement on which to instantiate the component. This cannot be an HTMLInputElement for
   * technical reasons.
   * @param options The options for the `Searchbox component`. These will merge with the options from the component set
   * directly on the `HTMLElement`.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: ISearchboxOptions, bindings?: IComponentBindings) {
    super(element, Searchbox.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Searchbox, options);

    if (this.options.inline) {
      $$(element).addClass('coveo-inline');
    }

    if (this.options.addSearchButton) {
      var anchor = document.createElement('a');
      this.element.appendChild(anchor);
      this.searchButton = new SearchButton(anchor, undefined, bindings);
    }

    var div = document.createElement('div');
    this.element.appendChild(div);

    if (this.options.enableOmnibox) {
      this.searchbox = new Omnibox(div, this.options, bindings);
    } else {
      this.searchbox = new Querybox(div, this.options, bindings);
    }

    const magicBoxIcon = $$(this.element).find('.magic-box-icon');
    magicBoxIcon.innerHTML = SVGIcons.icons.mainClear;
    SVGDom.addClassToSVGInContainer(magicBoxIcon, 'magic-box-clear-svg');
  }
}

Searchbox.options = _.extend({}, Searchbox.options, Omnibox.options, Querybox.options);

// Only parse omnibox option if omnibox is enabled
_.each(<any>Searchbox.options, (value, key: string) => {
  if (key in Omnibox.options && !(key in Querybox.options)) {
    Searchbox.options[key] = _.extend({ depend: 'enableOmnibox' }, value);
  }
});

Initialization.registerAutoCreateComponent(Searchbox);
