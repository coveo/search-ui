import { IQuery } from '../Query';

/**
 * A Search API facet search request.
 *
 * TODO: documentation
 */
export interface IFacetSearchRequest {
  field: string;
  ignoreValues?: String[];
  numberOfValues?: number;
  query?: string;
  captions?: Record<string, string>;
  searchContext?: IQuery;
}
