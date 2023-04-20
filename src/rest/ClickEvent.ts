import { IAnalyticsEvent } from './AnalyticsEvent';

/**
 * Describes a Coveo Cloud usage analytics _click_ event.
 */
export interface IClickEvent extends IAnalyticsEvent {
  /**
   * The name of the query pipeline to which the Search API query that returned the clicked result item was routed.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related Search API query response.
   *
   * **Example:** `PartnerPortalSearchPipeline`
   */
  queryPipeline: string;
  /**
   * The name of the A/B test that applied to the related Search API query.
   *
   * **Note:** This field is normally set by the `splitTestRunName` option of the `Analytics` component. However, if this option is left undefined, the framework attempts to set this field by retrieving information from the related Search API query response.
   *
   * **Example:** `Testing new ART model`
   */
  splitTestRunName: string;
  /**
   * The version of the A/B test that applied to the related Search API query (i.e., version A or version B).
   *
   * **Note:** This field is normally set by the `splitTestRunVersion` option of the `Analytics` component. However, if this option is left undefined and the related Search API query response indicates that an A/B test was applied, the framework sets this field to the name of the query pipeline to which the query was routed.
   *
   * **Example:** `PartnerPortalSearchPipelineWithART`
   */
  splitTestRunVersion: string;
  /**
   * The URI of the clicked query result item.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related Search API query response.
   *
   * **Example:** `http://www.example.com/org:organization/articletype:FAQ/article:aB1c2000000A1BcDEF/language:en_US`
   */
  documentUri: string;
  /**
   * The hashed URI of the clicked query result item.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related Search API query response.
   *
   * **Example:** `AbCñdeFghiJKLM1n`
   */
  documentUriHash: string;
  /**
   * The URL of the clicked query result item.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related Search API query response.
   *
   * **Example:** `https://example.com/aB1c2000000A1Bc`
   */
  documentUrl: string;
  /**
   * The title of the clicked query result item.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related Search API query response.
   *
   * **Example:** `Coveo ML Frequently Asked Questions`
   */
  documentTitle: string;
  /**
   * The type of query result item that was clicked.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related Search API query response.
   *
   * **Example:** `FAQ`
   */
  documentCategory: string;
  /**
   * The name of the collection to which the clicked query result item belongs.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related Search API query response.
   *
   * **Example:** `default`
   */
  collectionName: string;
  /**
   * The name of the source that contains the clicked query result item.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related Search API query response.
   *
   * **Example:** `Product Documentation`
   */
  sourceName: string;
  /**
   * The 1-based position of the clicked item in the query results set.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related Search API query response.
   */
  documentPosition: number;
  /**
   * The way the item was clicked.
   *
   * **Note:** The framework normally sets this field to the exact same value as [`actionCause`]{@link IAnalyticsEvent.actionCause}.
   *
   * **Example:** `documentOpen`
   */
  viewMethod: string;
  /**
   * The ranking modifier that was applied to the clicked query result item.
   *
   * **Note:** The framework normally sets this field by retrieving the information from the related Search API query response.
   *
   * **Example:** `Reveal ART`
   */
  rankingModifier: string;
}
