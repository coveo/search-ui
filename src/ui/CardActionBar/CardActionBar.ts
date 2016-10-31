import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {IResultsComponentBindings} from '../Base/ResultsComponentBindings';
import {QueryEvents, IBuildingQueryEventArgs} from '../../events/QueryEvents';
import {Initialization, IInitializationParameters} from '../Base/Initialization';
import {IQueryResult} from '../../rest/QueryResult';
import {Assert} from '../../misc/Assert';
import {$$} from '../../utils/Dom';

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
     * Specifies if the action bar is hidden unless the cursor clicks its parent
     * `Result` component.
     */
    hidden: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  constructor(public element: HTMLElement, public options?: ICardActionBarOptions, bindings?: IComponentBindings, public result?: IQueryResult) {
    super(element, CardActionBar.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, CardActionBar, options);

    if (this.options.hidden) {
      this.bindEvents();
    } else {
      this.element.style.transition = 'none';
      this.element.style.transform = 'none';
    }
  }

  /**
   * Show the ActionBar
   */
  public show() {
    $$(this.element).addClass('coveo-opened');
  }

  /**
   * Hide the ActionBar
   */

  public hide() {
    $$(this.element).removeClass('coveo-opened');
  }

  private bindEvents() {
    let resultList = $$(this.element).closest('CoveoResult');
    Assert.check(resultList !== undefined, 'ActionBar needs to be a child of a Result')
    $$(resultList).on('click', () => this.show());
    $$(resultList).on('mouseleave', () => this.hide());
  }

}

Initialization.registerAutoCreateComponent(CardActionBar);
