import { IStringMap } from './GenericParam';

/**
 * Describe a request to get top queries
 */
export interface ITopQueries extends IStringMap<any> {
  /**
   * Determine how many suggestions to receive
   */
  pageSize: number;
  /**
   * The query text for which to receive suggestions
   */
  queryText: string;
}
