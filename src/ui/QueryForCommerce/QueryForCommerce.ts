import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Assert } from '../../misc/Assert';
import { QueryEvents, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { AnalyticsEvents, IChangeAnalyticsCustomDataEventArgs } from '../../events/AnalyticsEvents';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';

export interface IQueryForCommerceOptions {
  listing?: string;
}

/**
 * The QueryForCommerce component enables to set properties for listing pages in commerce sites in a convenient way
 */
export class QueryForCommerce extends Component {
  static ID = 'QueryForCommerce';

  static doExport = () => {
    exportGlobally({
      QueryForCommerce: QueryForCommerce
    });
  };

  /**
   * The options for the QueryForCommerce.
   * @componentOptions
   */
  static options: IQueryForCommerceOptions = {
    /**
     * Setting this property will update the tab value of a query and set the originLevel2 in the analytics event
     *
     * This is useful for listing pages in commerce sites to leverage the Coveo ML features.
     */
    listing: ComponentOptions.buildStringOption()
  };

  /**
   * Creates a new QueryForCommerce component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the QueryForCommerce component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IQueryForCommerceOptions, public bindings?: IComponentBindings) {
    super(element, QueryForCommerce.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, QueryForCommerce, options);
    Assert.exists(element);
    Assert.exists(this.options);

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

Initialization.registerAutoCreateComponent(QueryForCommerce);
