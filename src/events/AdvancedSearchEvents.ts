import { IExternalAdvancedSearchSection } from '../ui/AdvancedSearch/AdvancedSearchInput';
import { IQueryOptions } from '../controllers/QueryController';
import { IQueryResults } from '../rest/QueryResults';

/**
 * Argument sent to all handlers bound on {@link AdvancedSearchEvents.buildingAdvancedSearch}
 */
export interface IBuildingAdvancedSearchEventArgs {
  /**
   * Sections which external code can populate by pushing into this array.
   */
  sections: IExternalAdvancedSearchSection[];
  /**
   * An easy way to execute a new query.
   * @param options
   */
  executeQuery: (options: IQueryOptions) => Promise<IQueryResults>;
}

/**
 * This static class is there to contains the different string definition for all the events related to the {@link AdvancedSearch} component.
 */
export class AdvancedSearchEvents {
  /**
   * Triggered when the {@link AdvancedSearch} component is being built.
   *
   * Allows external code to add new sections in the **Advanced Search** panel.
   *
   * All bound handlers receive {@link IBuildingAdvancedSearchEventArgs} as an argument
   *
   * @type {string}
   */
  public static buildingAdvancedSearch = 'buildingAdvancedSearch';
  public static executeAdvancedSearch = 'executeAdvancedSearch';
}
