import 'styling/_Breadcrumb';
import { each, find, isEmpty } from 'underscore';
import { BreadcrumbEvents, IBreadcrumbItem, IClearBreadcrumbEventArgs, IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { InitializationEvents } from '../../events/InitializationEvents';
import { QueryEvents } from '../../events/QueryEvents';
import { exportGlobally } from '../../GlobalExports';
import { l } from '../../strings/Strings';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { $$ } from '../../utils/Dom';
import { analyticsActionCauseList, IAnalyticsNoMeta } from '../Analytics/AnalyticsActionListMeta';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';

export interface IBreadcrumbOptions {}

/**
 * The Breadcrumb component displays a summary of the currently active query filters.
 *
 * For example, when the user selects a {@link Facet} value, the breadcrumbs display this value.
 *
 * The active filters are obtained by the component by firing an event in the Breadcrumb component.
 *
 * All other components having an active state can react to this event by providing custom bits of HTML to display
 * inside the breadcrumbs.
 *
 * Thus, it is possible to easily extend the Breadcrumb component using custom code to display information about custom
 * states and filters.
 *
 * See {@link BreadcrumbEvents} for the list of events and parameters sent when a Breadcrumb component is populated.
 */
export class Breadcrumb extends Component {
  static ID = 'Breadcrumb';
  static options: IBreadcrumbOptions = {};

  static doExport = () => {
    exportGlobally({
      Breadcrumb: Breadcrumb
    });
  };

  private lastBreadcrumbs: IBreadcrumbItem[];

  /**
   * Creates a new Breadcrumb component. Binds event on {@link QueryEvents.deferredQuerySuccess} to draw the
   * breadcrumbs.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Breadcrumb component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IBreadcrumbOptions, bindings?: IComponentBindings) {
    super(element, Breadcrumb.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Breadcrumb, options);

    this.bind.oneRootElement(InitializationEvents.afterInitialization, () => this.handleAfterInitialization());
    this.bind.onRootElement(BreadcrumbEvents.redrawBreadcrumb, () => this.redrawBreadcrumb());
    this.element.style.display = 'none';
    this.element.setAttribute('tabindex', '-1');
    this.addDefaultAccessibilityAttributes();
  }

  /**
   * Triggers the event to populate the breadcrumbs. Components such as {@link Facet} can populate the breadcrumbs.
   *
   * This method triggers a {@link BreadcrumbEvents.populateBreadcrumb} event with an
   * {@link IPopulateBreadcrumbEventArgs} object (an array) that other components or code can populate.
   * @returns {IBreadcrumbItem[]} A populated breadcrumb item list.
   */
  public getBreadcrumbs(): IBreadcrumbItem[] {
    const args = <IPopulateBreadcrumbEventArgs>{ breadcrumbs: [] };
    this.bind.trigger(this.root, BreadcrumbEvents.populateBreadcrumb, args);
    this.logger.debug('Retrieved breadcrumbs', args.breadcrumbs);

    // If newly received breadcrumbs are empty, and last breadcrumbs were not.
    // this means end user removed the last filter:
    // We want to shift keyboard focus to the result list container in that case, for ease of use of the interface
    // https://coveord.atlassian.net/browse/JSUI-3078
    if (isEmpty(args.breadcrumbs) && !isEmpty(this.lastBreadcrumbs)) {
      this.focusFirstEnabledResultList();
    }
    this.lastBreadcrumbs = args.breadcrumbs;
    return args.breadcrumbs;
  }

  /**
   * Triggers the event to clear the current breadcrumbs that components such as {@link Facet} can populate.
   *
   * Also triggers a new query and logs the `breadcrumbResetAll` event in the usage analytics.
   */
  public clearBreadcrumbs() {
    const args = <IClearBreadcrumbEventArgs>{};
    this.bind.trigger(this.root, BreadcrumbEvents.clearBreadcrumb, args);
    this.logger.debug('Clearing breadcrumbs');
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.breadcrumbResetAll, {});
    this.queryController.executeQuery();
  }

  /**
   * Draws the specified breadcrumb items.
   * @param breadcrumbs The breadcrumb items to draw.
   */
  public drawBreadcrumb(breadcrumbs: IBreadcrumbItem[]) {
    $$(this.element).empty();
    if (breadcrumbs.length != 0) {
      this.element.style.display = '';
    } else {
      this.element.style.display = 'none';
    }

    const breadcrumbItems = document.createElement('div');
    $$(breadcrumbItems).addClass('coveo-breadcrumb-items');
    this.element.appendChild(breadcrumbItems);
    each(breadcrumbs, (bcrumb: IBreadcrumbItem) => {
      const elem = bcrumb.element;
      $$(elem).addClass('coveo-breadcrumb-item');
      breadcrumbItems.appendChild(elem);
    });

    const clearText = $$('div', undefined, l('ClearAllFilters')).el;
    const clear = $$(
      'div',
      {
        className: 'coveo-breadcrumb-clear-all'
      },
      clearText
    ).el;

    new AccessibleButton()
      .withElement(clear)
      .withSelectAction(() => this.clearBreadcrumbs())
      .withOwner(this.bind)
      .withoutLabelOrTitle()
      .build();

    this.element.appendChild(clear);
  }

  private redrawBreadcrumb() {
    this.lastBreadcrumbs ? this.drawBreadcrumb(this.lastBreadcrumbs) : this.drawBreadcrumb(this.getBreadcrumbs());
  }

  private handleDeferredQuerySuccess() {
    this.drawBreadcrumb(this.getBreadcrumbs());
  }

  private handleQueryError() {
    this.drawBreadcrumb(this.getBreadcrumbs());
  }

  private handleAfterInitialization() {
    // We must bind to these events after the initialization to make sure the breadcrumb generation
    // is made with updated components. (E.G facet, facetrange, ...)
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, () => this.handleDeferredQuerySuccess());
    this.bind.onRootElement(QueryEvents.queryError, () => this.handleQueryError());
  }

  private focusFirstEnabledResultList() {
    const resultLists = this.searchInterface.getComponents<Component>('ResultList');
    const firstEnabledResultList = find(resultLists, resultList => resultList.disabled === false);
    if (firstEnabledResultList) {
      $$(firstEnabledResultList.element).focus(true);
    }
  }

  private addDefaultAccessibilityAttributes() {
    if (!this.element.getAttribute('role')) {
      this.element.setAttribute('role', 'navigation');
    }
    if (!this.element.getAttribute('aria-label')) {
      this.element.setAttribute('aria-label', l('Breadcrumb'));
    }
  }
}

Initialization.registerAutoCreateComponent(Breadcrumb);
