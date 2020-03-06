import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { $$ } from '../../utils/Dom';
import { IQueryResult } from '../../rest/QueryResult';
import { Assert } from '../../misc/Assert';
import { Initialization } from '../Base/Initialization';
import { forEach } from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_ResultActionsMenu';

export interface IResultActionsMenuOptions {
  openOnMouseOver?: boolean;
}

/**
 * The _ResultActionsMenu_ component adds a floating result action menu, meant to be used inside result templates (see [Result Templates](https://docs.coveo.com/en/413/javascript-search-framework/result-templates)).
 * It is designed to contain other components that can execute actions related to the result,
 * typically the [Quickview]{@link Quickview} and AttachToCase components, available in the Coveo for Salesforce and Coveo for Dynamics integrations.
 *
 * ```html
 * <script type="text/html" class="result-template" [...]
 *   <div class="coveo-result-frame">
 *     <div class="CoveoResultActionsMenu">
 *       <div class="CoveoQuickview"></div>
 *     </div>
 *   [...]
 * </script>
 * ```
 *
 * @availablesince [July 2018 Release (v2.4382.10)](https://docs.coveo.com/410/#july-2018-release-v2438210)
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
     * Specifies whether the menu should open when the user hovers over the result.
     *
     * When set to false, the menu opens only when clicking on the result.
     *
     * Default value is `true`.
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

    this.initializeParentResult();
    this.bindEvents();

    this.buildMenuItems();
  }

  /**
   * Shows the floating menu.
   */
  public show() {
    $$(this.element).addClass(ResultActionsMenu.SHOW_CLASS);
  }

  /**
   * Hides the floating menu.
   */
  public hide() {
    $$(this.element).removeClass(ResultActionsMenu.SHOW_CLASS);
  }

  private initializeParentResult() {
    // Find the result containing this ResultActionsMenu
    this.parentResult = $$(this.element).closest('CoveoResult');
    Assert.check(this.parentResult !== undefined, 'ResultActionsMenu needs to be a child of a Result');

    $$(this.parentResult).addClass('coveo-clickable');
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
    forEach($$(this.element).children(), (elem: HTMLElement) => {
      this.menuItems.push(elem);
      $$(elem).addClass('coveo-result-actions-menu-menu-item');
    });
  }
}

Initialization.registerAutoCreateComponent(ResultActionsMenu);
