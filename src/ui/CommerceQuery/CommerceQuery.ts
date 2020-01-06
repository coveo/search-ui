import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { QueryEvents, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { AnalyticsEvents, IChangeAnalyticsCustomDataEventArgs } from '../../events/AnalyticsEvents';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';

export interface ICommerceQueryOptions {
  listing?: string;
}

/**
 * This component exposes options to handle commerce-related queries.
 */
export class CommerceQuery extends Component {
  static ID = 'CommerceQuery';

  static doExport = () => {
    exportGlobally({
      CommerceQuery: CommerceQuery
    });
  };

  /**
   * The options for the CommerceQuery.
   * @componentOptions
   */
  static options: ICommerceQueryOptions = {
    /**
     * The listing page identifier.
     *
     * In a typical Coveo for Commerce solution, all listing pages should share the same `searchHub`/`originLevel1` and be differentiated by setting this option to a unique, human-readable value.
     *
     * When specified, this option sets the `tab`/`originLevel2` parameter, as well as the `listing` property of the `context`/`customData` object of each query/usage analytics event originating from the listing page. This allows Coveo ML to provide relevant output for the listing page, and can also be useful for usage analytics reporting purposes.
     *
     * @examples ACME Furniture, ACME Jewelry, ACME Clothes
     */
    listing: ComponentOptions.buildStringOption()
  };

  /**
   * Creates a new CommerceQuery component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the CommerceQuery component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: ICommerceQueryOptions, public bindings?: IComponentBindings) {
    super(element, CommerceQuery.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, CommerceQuery, options);

    this.bind.onRootElement(QueryEvents.doneBuildingQuery, this.handleDoneBuildingQuery);
    this.bind.onRootElement(AnalyticsEvents.changeAnalyticsCustomData, this.handleChangeAnalytics);
  }

  private handleDoneBuildingQuery(event: IBuildingQueryEventArgs) {
    if (this.options.listing) {
      event.queryBuilder.tab = this.options.listing;
      event.queryBuilder.addContextValue('listing', this.options.listing);
    }
  }

  private handleChangeAnalytics(event: IChangeAnalyticsCustomDataEventArgs) {
    if (this.options.listing) {
      event.originLevel2 = this.options.listing;
    }
  }
}

Initialization.registerAutoCreateComponent(CommerceQuery);
