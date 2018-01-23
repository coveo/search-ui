import { QueryStateModel } from '../../models/QueryStateModel';
import { ComponentStateModel } from '../../models/ComponentStateModel';
import { QueryController } from '../../controllers/QueryController';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { IAnalyticsClient } from '../Analytics/AnalyticsClient';
import { ComponentOptionsModel } from '../../models/ComponentOptionsModel';

/**
 * The bindings, or environment in which each component exists.
 */
export interface IComponentBindings {
  /**
   * The root HTMLElement of the {@link SearchInterface} in which the component exists.
   */
  root?: HTMLElement;
  /**
   * Contains the state of the query. Allows to get/set values. Triggers state event when modified. Each component can listen to those events.
   */
  queryStateModel?: QueryStateModel;
  /**
   * Contains the state of different components (enabled vs disabled). Allows to get/set values. Triggers component state event when modified. Each component can listen to those events.
   */
  componentStateModel?: ComponentStateModel;
  /**
   * Contains the singleton that allows to trigger queries.
   */
  queryController?: QueryController;
  /**
   * A reference to the root of every component, the {@link SearchInterface}.
   */
  searchInterface?: SearchInterface;
  /**
   * A reference to the {@link Analytics.client}.
   */
  usageAnalytics?: IAnalyticsClient;
  /**
   * Contains the state of options for different components. Mainly used by {@link ResultLink}.
   */
  componentOptionsModel?: ComponentOptionsModel;
}
