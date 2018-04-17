import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { $$ } from '../../utils/Dom';
import { IQueryResult } from '../../rest/QueryResult';
import { Assert } from '../../misc/Assert';
import { Initialization } from '../Base/Initialization';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_ResultActionsMenu';

export interface IResultActionsMenuOptions {
  openOnMouseOver?: boolean;
}

/**
 * The ResultActionsMenu is a small floating slack-like result actions menu.
 * It is designed to contain "buttons" that execute an action on a result when pressed.
 * For example you can include the Quickview inside that menu or the AttachToCase.
 *
 * Example of how to use it in a template:
 *
 * ```html
 * <script type="text/html" class="result-template" [...]
 *   <div class="coveo-result-frame">
 *     <div class="CoveoResultActionsMenu">
 *       <div class="CoveoAttachToCase" data-display-text="false"></div>
 *       <div class="CoveoQuickview"></div>
 *     </div>
 *   [...]
 * </script>
 * ```
 */
export class ResultActionsMenu extends Component {
  static ID = 'ResultActionsMenu';

  static doExport = () => {
    exportGlobally({
      ResultActionsMenu: ResultActionsMenu
    });
  };

  static readonly SHOW_CLASS: string = 'coveo-menu-opened';

  /**
   * @componentOptions
   */
  static options: IResultActionsMenuOptions = {
    /**
     * Specify that the menu should open when you mouse over the Result.
     * If this option is set to false, the menu will open only when you click on the Result.
     *
     * Default is `true`.
     */
    openOnMouseOver: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  /**
   * The rendered result that contains this menu.
   */
  parentResult: HTMLElement;

  /**
   * A list containing menu items for this menu.
   */
  menuItems: HTMLElement[];

  /**
   * Creates a new `ResultActionsMenu` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `ResultActionsMenu` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(
    public element: HTMLElement,
    public options: IResultActionsMenuOptions,
    public bindings?: IResultsComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, ResultActionsMenu.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ResultActionsMenu, options);

    // Find the result containing this ResultActionsMenu
    this.parentResult = $$(this.element).closest('CoveoResult');
    Assert.check(this.parentResult !== undefined, 'ResultActionsMenu needs to be a child of a Result');

    $$(this.parentResult).addClass('coveo-clickable');
    this.bindEvents();

    this.buildMenuItems();
  }

  private bindEvents() {
    $$(this.parentResult).on('click', () => this.show());
    $$(this.parentResult).on('mouseleave', () => this.hide());
    if (this.options.openOnMouseOver) {
      $$(this.parentResult).on('mouseenter', () => this.show());
    }
  }

  private buildMenuItems() {
    this.menuItems = [];
    _.forEach($$(this.element).children(), (elem: HTMLElement) => {
      this.menuItems.push(elem);
      $$(elem).addClass('coveo-result-actions-menu-menu-item');
    });
  }

  /**
   * Show the floating menu.
   */
  public show() {
    $$(this.element).addClass(ResultActionsMenu.SHOW_CLASS);
  }

  /**
   * Hide the floating menu.
   */
  public hide() {
    $$(this.element).removeClass(ResultActionsMenu.SHOW_CLASS);
  }
}

Initialization.registerAutoCreateComponent(ResultActionsMenu);
