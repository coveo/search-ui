import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {ComponentOptions} from '../Base/ComponentOptions';
import {InitializationEvents} from '../../events/InitializationEvents';
import {BreadcrumbEvents, IBreadcrumbItem, IPopulateBreadcrumbEventArgs, IClearBreadcrumbEventArgs} from '../../events/BreadcrumbEvents';
import {analyticsActionCauseList, IAnalyticsNoMeta} from '../Analytics/AnalyticsActionListMeta';
import {$$} from '../../utils/Dom';
import {l} from '../../strings/Strings';
import {Initialization} from '../Base/Initialization';
import {QueryEvents} from '../../events/QueryEvents';

export interface IBreadcrumbOptions {
}

/**
 * This component displays a summary of the filters currently active in the query.<br/>
 * For example, when the user selects a facet value, the value is displayed in the breadcrumbs.<br/>
 * The active filters are obtained by the component by firing an event in the breadcrumb component.<br/>
 * All other components having an active state can answer to this event by providing custom bits of HTML that will be displayed inside the breadcrumb.<br/>
 * Thus, the breadcrumb can easily be extended by custom code to display information about custom state and filters.
 */
export class Breadcrumb extends Component {
  static ID = 'Breadcrumb';
  static options: IBreadcrumbOptions = {}

  private lastBreadcrumbs: IBreadcrumbItem[];

  /**
   * Create a new breadcrumb element, bind event on deferredQuerySuccess to draw the breadcrumb
   * @param element
   * @param options
   * @param bindings
   */
  constructor(public element: HTMLElement, public options?: IBreadcrumbOptions, bindings?: IComponentBindings) {
    super(element, Breadcrumb.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Breadcrumb, options);

    this.bind.oneRootElement(InitializationEvents.afterInitialization, () => this.handleAfterInitialization());
    this.bind.onRootElement(BreadcrumbEvents.redrawBreadcrumb, () => this.redrawBreadcrumb());
    this.element.style.display = 'none';
  }

  /**
   * Trigger the event to populate breadcrumb, which component such as {@link Facet} can populate.<br/>
   * Will trigger an event with {@link IPopulateBreadcrumbEventArgs} object (an array) which other component or code can populate.
   * @returns {IBreadcrumbItem[]}
   */
  public getBreadcrumbs(): IBreadcrumbItem[] {
    let args = <IPopulateBreadcrumbEventArgs>{ breadcrumbs: [] };
    this.bind.trigger(this.root, BreadcrumbEvents.populateBreadcrumb, args);
    this.logger.debug('Retrieved breadcrumbs', args.breadcrumbs);
    this.lastBreadcrumbs = args.breadcrumbs;
    return args.breadcrumbs;
  }

  /**
   * Trigger the event to clear the current breadcrumbs, which component such as {@link Facet} can populate.<br/>
   * Trigger a new query, and log a search event
   */
  public clearBreadcrumbs() {
    let args = <IClearBreadcrumbEventArgs>{};
    this.bind.trigger(this.root, BreadcrumbEvents.clearBreadcrumb, args);
    this.logger.debug('Clearing breadcrumbs');
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.breadcrumbResetAll, {});
    this.queryController.executeQuery();
  }

  /**
   * Draw the given breadcrumbs items
   * @param breadcrumbs
   */
  public drawBreadcrumb(breadcrumbs: IBreadcrumbItem[]) {
    $$(this.element).empty();
    if (breadcrumbs.length != 0) {
      this.element.style.display = '';
    } else {
      this.element.style.display = 'none';
    }

    let breadcrumbItems = document.createElement('div');
    $$(breadcrumbItems).addClass('coveo-breadcrumb-items');
    this.element.appendChild(breadcrumbItems);
    _.each(breadcrumbs, (bcrumb: IBreadcrumbItem) => {
      let elem = bcrumb.element;
      $$(elem).addClass('coveo-breadcrumb-item');
      breadcrumbItems.appendChild(elem);
    })

    let clear = document.createElement('div');
    $$(clear).addClass('coveo-breadcrumb-clear-all');
    clear.setAttribute('title', l('ClearAllFilters'));

    let clearIcon = document.createElement('div');
    $$(clearIcon).addClass('coveo-icon coveo-breadcrumb-icon-clear-all');
    clear.appendChild(clearIcon);

    if (this.searchInterface.isNewDesign()) {
      let clearText = document.createElement('div');
      $$(clearText).text(l('Clear', ''));
      clear.appendChild(clearText);
      this.element.appendChild(clear);
    } else {
      this.element.insertBefore(clear, this.element.firstChild);
    }

    this.bind.on(clear, 'click', () => {
      this.clearBreadcrumbs();
    })
  }

  private redrawBreadcrumb() {
    this.lastBreadcrumbs ? this.drawBreadcrumb(this.lastBreadcrumbs) : this.drawBreadcrumb(this.getBreadcrumbs());
  }

  private handleDeferredQuerySuccess() {
    this.drawBreadcrumb(this.getBreadcrumbs());
  }

  private handleAfterInitialization() {
    // We must bind to these events after the initialization to make sure the breadcrumb generation
    // is made with updated components. (E.G facet, facetrange, ...)
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, () => this.handleDeferredQuerySuccess());
  }
}

Initialization.registerAutoCreateComponent(Breadcrumb);
