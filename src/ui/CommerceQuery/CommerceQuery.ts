import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Assert } from '../../misc/Assert';
import { QueryEvents, IBuildingQueryEventArgs } from '../../events/QueryEvents';
import { AnalyticsEvents, IChangeAnalyticsCustomDataEventArgs } from '../../events/AnalyticsEvents';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';

export interface ICommerceQueryOptions {
  listing?: string;
}

/**
 * The CommerceQuery component enables to set properties for listing pages in commerce sites in a convenient way
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
     * Setting this property will update the tab value of a query and set the originLevel2 in the analytics event
     *
     * This is useful for listing pages in commerce sites to leverage the Coveo ML features.
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
