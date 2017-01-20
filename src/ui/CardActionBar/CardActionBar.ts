import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Initialization} from '../Base/Initialization';
import {IQueryResult} from '../../rest/QueryResult';
import {Assert} from '../../misc/Assert';
import {$$} from '../../utils/Dom';

export interface ICardActionBarOptions {
  hidden?: boolean;
  openOnMouseOver?: boolean;
}

/**
 * The CardActionBar component displays an action bar at the bottom of a Card result (see {ResultList.options.layout}
 * and {@link ResultLayout}). It is a simple container for buttons or complementary information.
 *
 * This component is meant to be placed at the bottom of a Card result (i.e., as the last child of the surrounding
 * `result-frame`.
 *
 * ### Example
 * ```html
 * <div class="coveo-result-frame">
 *   ...content...
 *   <div class="CoveoCardActionBar">
 *     <some-button></some-button>
 *     <some-additional-info></some-additional-info>
 *   </div>
 * </div>
 * ```
 *
 * A CardActionBar component is a two-state widget. Its default state is `hidden`.
 */
export class CardActionBar extends Component {
  static ID = 'CardActionBar';

  parentResult: HTMLElement;
  arrowContainer: HTMLElement;

  /**
   * @componentOptions
   */
  static options: ICardActionBarOptions = {

    /**
     * Specifies whether the CardActionBar is hidden by default unless the user clicks its parent {@link IQueryResult}.
     *
     * Default value is `true`, which means the component is hidden and a visual indicator is appended to its parent
     * IQueryResult.
     */
    hidden: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * If {CardActionBar.options.hidden} is set to `true`, specifies whether the CardActionBar should open when it is
     * hovered over.
     *
     * Default value is `true`.
     */
    openOnMouseOver: ComponentOptions.buildBooleanOption({ defaultValue: true, depend: 'hidden' })
  };

  /**
   * Creates a new CardActionBar component.
   * @param element The HTMLElement on which the component will be instantiated.
   * @param options The options for the CardActionBar component.
   * @param bindings The bindings that the component requires to function normally. If not set, it will be automatically
   * resolved (with a slower execution time).
   * @param result The {@link IQueryResult}.
   */
  constructor(public element: HTMLElement, public options?: ICardActionBarOptions, bindings?: IComponentBindings, public result?: IQueryResult) {
    super(element, CardActionBar.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, CardActionBar, options);

    this.parentResult = $$(this.element).closest('CoveoResult');
    Assert.check(this.parentResult !== undefined, 'ActionBar needs to be a child of a Result');

    if (this.options.hidden) {
      $$(this.parentResult).addClass('coveo-clickable');
      this.appendArrow();
      this.bindEvents();
    } else {
      this.element.style.transition = 'none';
      this.element.style.transform = 'none';
    }
  }

  /**
   * Shows the CardActionBar.
   */
  public show() {
    $$(this.element).addClass('coveo-opened');
  }

  /**
   * Hides the CardActionBar.
   */
  public hide() {
    $$(this.element).removeClass('coveo-opened');
  }

  private bindEvents() {
    $$(this.parentResult).on('click', () => this.show());
    $$(this.parentResult).on('mouseleave', () => this.hide());
    if (this.options.openOnMouseOver) {
      $$(this.arrowContainer).on('mouseenter', () => this.show());
    }
  }

  private appendArrow() {
    this.arrowContainer = $$('div', { className: 'coveo-card-action-bar-arrow-container' }).el;
    this.arrowContainer.appendChild($$('span', { className: 'coveo-icon coveo-sprites-arrow-up' }).el);
    this.parentResult.appendChild(this.arrowContainer);
  }
}

Initialization.registerAutoCreateComponent(CardActionBar);
