import {IOmniboxOptions} from '../Omnibox/Omnibox';
import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Omnibox} from '../Omnibox/Omnibox';
import {ComponentOptions} from '../Base/ComponentOptions'
import {SearchButton} from '../SearchButton/SearchButton';
import {Querybox} from '../Querybox/Querybox';
import {$$} from '../../utils/Dom';
import _ = require('underscore');
import {Initialization} from '../Base/Initialization';

export interface ISearchboxOptions extends IOmniboxOptions {
  addSearchButton?: boolean;
  enableOmnibox?: boolean;
}

/**
 * This component is mostly used for simplicity purpose because it creates 2 component that are very frequently used together.<br/>
 * This component attaches itself to a div and takes care of instantiating a {@link Querybox} Component or a {@link Omnibox} Component, depending on the options.<br/>
 * Add a {@link SearchButton} Component if desired, and appends them to the same div.
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
     * Specifies whether the search box instantiates a {@link SearchButton}.<br/>
     * Default value is true.
     */
    addSearchButton: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies whether the search box instantiates a {@link Omnibox} Component.<br/>
     * Otherwise, the search box instantiates a {@link Querybox} Component.<br/>
     * Default value is false.
     */
    enableOmnibox: ComponentOptions.buildBooleanOption({ defaultValue: false })
  }

  /**
   * Instance of the {@link SearchButton}
   */
  public searchButton: SearchButton;

  /**
   * Instance of compomnent that allows user to input query.<br/>
   * Can be a {@link Querybox} or {@link Omnibox}
   */
  public searchbox: Querybox | Omnibox;

  /**
   * Create a new Searchbox<br/>
   * Create a new Coveo.Magicbox instance and wrap magic box method (on blur, on submit etc)<br/>
   * Bind event on buildingQuery and on redirection (for standalone box)
   * @param element The HTMLElement on which the element will be instantiated. This cannot be an HTMLInputElement for technical reason
   * @param options The options for the component. Will be merged with the options from the component set directly on the HTMLElement
   * @param bindings The bindings that the component requires to function normally. If not set, will automatically resolve them (With slower execution time)
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
      this.searchbox = new Omnibox(div, this.options, bindings)
    } else {
      this.searchbox = new Querybox(div, this.options, bindings)
    }
  }
}

Searchbox.options = _.extend({}, Searchbox.options, Omnibox.options, Querybox.options);

// Only parse omnibox option if omnibox is enabled
_.each(Searchbox.options, (value, key: string) => {
  if (key in Omnibox.options && !(key in Querybox.options)) {
    Searchbox.options[key] = _.extend({ depend: 'enableOmnibox' }, value);
  }
});

Initialization.registerAutoCreateComponent(Searchbox);
