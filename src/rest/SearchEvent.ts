import { IAnalyticsEvent } from './AnalyticsEvent';
import { IAnalyticsFacetState } from '../ui/Analytics/IAnalyticsFacetState';

/**
 * Describes a Coveo Cloud usage analytics _search_ event.
 */
export interface ISearchEvent extends IAnalyticsEvent {
  /**
   * The unique identifier of the related query.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related Search API query response.
   *
   * **Example:** `74682726-0e20-46eb-85ac-f37259346f57`
   */
  searchQueryUid: string;
  /**
   * The name of the query pipeline to which the related query was routed.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related Search API query response.
   *
   * **Example:** `PartnerPortalSearchPipeline`
   */
  queryPipeline: string;
  /**
   * The name of the A/B test that applied to the related query.
   *
   * **Note:** This field may be set through the `splitTestRunName` option of the `Analytics` component. However, if the option is left undefined, the framework attempts to set this field by retrieving information from the related Search API query response.
   *
   * **Example:** `Test new ART model`
   */
  splitTestRunName: string;
  /**
   * The version of the A/B test that applied to the related query (i.e., version A or version B).
   *
   * **Note:** This field may be set through the `splitTestRunVersion` option of the `Analytics` component. However, if the option is left undefined and the related Search API query response indicates that an A/B test was applied, the framework sets this field to the name of the query pipeline to which the query was routed.
   *
   * **Example:** `PartnerPortalSearchPipelineWithART`
   */
  splitTestRunVersion: string;
  /**
   * The original basic query expression (i.e., `q`) sent for the related query.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related query.
   *
   * **Example:** `coveo machine learning`
   */
  queryText: string;
  /**
   * The number of query result items returned by the related query.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related Search API query response.
   */
  numberOfResults: number;
  /**
   * The number of results per page requested for the related query.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related query.
   */
  resultsPerPage: number;
  /**
   * The 0-based page of results requested for the related query.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related query.
   */
  pageNumber: number;
  /**
   * The original advanced query expression (i.e., `aq`) sent for the related query.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related query.
   */
  advancedQuery: string;
  /**
   * Whether the _did you mean_ feature was enabled for the related query.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related query.
   *
   * **Example:** `@source=="Product Documentation"`
   */
  didYouMean: boolean;
  /**
   * Whether the related query was contextual.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related query.
   */
  contextual: boolean;
  /**
   * A representation of the state of each dynamic facet in the search interface when the action that triggered the event was executed.
   */
  facetState?: IAnalyticsFacetState[];
}
