import { IOmniboxOptions } from '../Omnibox/Omnibox';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Omnibox } from '../Omnibox/Omnibox';
import { ComponentOptions } from '../Base/ComponentOptions';
import { SearchButton } from '../SearchButton/SearchButton';
import { Querybox } from '../Querybox/Querybox';
import { $$ } from '../../utils/Dom';
import { Initialization } from '../Base/Initialization';
import _ = require('underscore');

export interface ISearchboxOptions extends IOmniboxOptions {
  addSearchButton?: boolean;
  enableOmnibox?: boolean;
}

/**
 * The Searchbox component can conveniently create two components that are frequently used together to allow the end
 * user to input and submit queries.
 *
 * This component attaches itself to a `div` element and takes care of instantiating either a {@link Querybox} component
 * or an {@link Omnibox} component, depending on its configuration. Optionally, the Searchbox component can also
 * instantiate a {@link SearchButton} component and append it inside the same `div`.
 */
export class Searchbox extends Component {
  static ID = 'Searchbox';
  static parent = Omnibox;

  /**
   * Possible options for the {@link Searchbox}
   * @componentOptions
   */
  static options: ISearchboxOptions = {

    /**
     * Specifies whether to instantiate a {@link SearchButton} component.
     *
     * Default value is `true`.
     */
    addSearchButton: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether to instantiate an {@link Omnibox} component.
     *
     * When this option is `false`, the Searchbox component instantiates a {@link Querybox} component instead of an
     * Omnibox component.
     *
     * **Note:**
     * > You can use configuration options specific to the component that the Searchbox instantiates.
     *
     * **Examples:**
     *
     * In this first case, the Searchbox will instantiate a Querybox component. It is therefore possible to configure
     * that Querybox instance using any of the Querybox component options such as
     * {@link Querybox.options.triggerQueryOnClear}.
     * ```html
     * <div class='CoveoSearchbox' data-trigger-query-on-clear='true'></div>
     * ```
     *
     * In this second case, the Searchbox will instantiate an Omnibox component. It is therefore possible to configure
     * that Omnibox instance using any of the Omnibox component options such as {@link Omnibox.options.placeholder}.
     * Moreover, since the Omnibox component inherits all of the Querybox component options, the
     * `data-trigger-query-on-clear` option will also work on that Omnibox instance.
     * ```html
     * <div class='CoveoSearchbox' data-enableOmnibox='true' data-place-holder='Please enter a query'></div>
     * ```
     *
     * Default value is `false`.
     */
    enableOmnibox: ComponentOptions.buildBooleanOption({ defaultValue: false })
  };

  /**
   * The {@link SearchButton} instance.
   */
  public searchButton: SearchButton;

  /**
   * The instance of the component that allows the end user to input queries.
   *
   * Can be either a {@link Querybox} component or an {@link Omnibox} component, depending on the value of
   * {@link Searchbox.options.enableOmnibox}.
   */
  public searchbox: Querybox | Omnibox;

  /**
   * Creates a new Searchbox. Creates a new Coveo.Magicbox instance and wraps magic box methods (on blur, on submit
   * etc.). Binds event on `buildingQuery` and on redirection (for standalone box).
   * @param element The HTMLElement on which to instantiate the component. This cannot be an `HTMLInputElement` for
   * technical reasons.
   * @param options The options for the Searchbox component. These will merge with the options from the component set
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
