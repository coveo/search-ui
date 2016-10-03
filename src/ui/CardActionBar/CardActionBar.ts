import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {IResultsComponentBindings} from '../Base/ResultsComponentBindings';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {Initialization, IInitializationParameters} from '../Base/Initialization';
import {IQueryResult} from '../../rest/QueryResult';

export interface ICardActionBarOptions {
  hidden?: boolean;
}

/**
 * This component displays an action bar at the bottom of the card results (see
 * {@link ResultLayout}).
 */
export class CardActionBar extends Component {
  static ID = 'CardActionBar';

  /**
   * @componentOptions
   */
  static options: ICardActionBarOptions = {
    /**
     * Specifies if the action bar is hidden unless the cursor hovers its parent
     * `Result` component.
     */
    hidden: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  constructor(public element: HTMLElement, public options?: ICardActionBarOptions, bindings?: IComponentBindings, public result?: IQueryResult) {
    super(element, CardActionBar.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, CardActionBar, options);

    let initOptions = this.searchInterface.options.originalOptionsObject;
    let resultComponentBindings: IResultsComponentBindings = _.extend({}, this.getBindings(), {
      resultElement: element
    });
    let initParameters: IInitializationParameters = {
      options: initOptions,
      bindings: resultComponentBindings,
      result: result
    };
    Initialization.automaticallyCreateComponentsInside(this.element, initParameters);
  }
}

Initialization.registerAutoCreateComponent(CardActionBar);
