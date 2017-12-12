import { IUserIdentity } from './UserIdentity';
import { IRankingExpression } from './RankingExpression';
import { IQueryException } from './QueryException';
import { IQueryResult } from './QueryResult';
import { IGroupByResult } from './GroupByResult';
import { IQueryCorrection } from './QueryCorrection';
import { ITrigger } from './Trigger';

/**
 * Describe a set a results returned by the Search API
 */
export interface IQueryResults {
  /**
   * When an error occurs, and the errorsAsSuccess flag is passed, the error will be returned in the body of the response
   */
  error?: {
    /**
     * The error message
     */
    message: string;
    /**
     * The type of error
     */
    type: string;
    /**
     * A detailed execution report sent by the Search API
     */
    executionReport: any;
  };

  // Those are only included when the debug=1 flag is passed
  /**
   * A detailed execution report sent by the Search API.<br/>
   * Only sent if {@link IQuery.debug} is true
   */
  executionReport?: any;
  /**
   * The basic expression that was executed.<br/>
   * Only sent if {@link IQuery.debug} is true
   */
  basicExpression?: string;
  /**
   * The advanced expression that was executed.<br/>
   * Only sent if {@link IQuery.debug} is true
   */
  advancedExpression?: string;
  /**
   * The constant expression that was executed.<br/>
   * Only sent if {@link IQuery.debug} is true
   */
  constantExpression?: string;
  /**
   * A list of user identities that were used to perform this query.<br/>
   * Only sent if {@link IQuery.debug} is true
   */
  userIdentities?: IUserIdentity[];
  /**
   * A list of ranking expression that were used to tweak the relevance.<br/>
   * Only sent if {@link IQuery.debug} is true
   */
  rankingExpressions?: IRankingExpression[];
  /**
   * The total number of results that matched the query in the index.
   */
  totalCount: number;
  /**
   * The total number of results that matched the query in the index, but with the duplicate filtered.
   */
  totalCountFiltered: number;
  /**
   * The total query duration, which is the sum of the `indexDuration` and `searchAPIDuration`, including any latency incurred through the necessary network hops.
   */
  duration: number;
  /**
   * The part of the total query `duration` that was spent in the index.
   */
  indexDuration: number;
  /**
   * The part of the total query `duration` that was spent in the Coveo Search API.
   */
  searchAPIDuration: number;
  /**
   * The duration of the query on the proxy (not always applicable, can be optional)
   * 
   * @deprecated Use duration, indexDuration and searchAPIDuration instead.
   */
  proxyDuration?: number;
  /**
   * The duration of the query for the client.
   * 
   * @deprecated Use searchAPIDuration instead.
   */
  clientDuration: number;
  /**
   * A unique identifier for this query, used mainly for the {@link Analytics} service.
   */
  searchUid?: string;
  /**
   * The pipeline that was used for this query.
   */
  pipeline?: string;
  /**
   * The search api version that was used for this query.
   */
  apiVersion?: number;
  /**
   * The split test run that was used for this query. (A/B tests feature of the Coveo Query Pipeline)
   */
  splitTestRun?: string;
  /**
   * The exception that can be returned by the index if the query triggered an error
   */
  exception?: IQueryException;
  /**
   * The results of the query
   */
  results: IQueryResult[];
  /**
   * The group by results of the query
   */
  groupByResults: IGroupByResult[];
  /**
   * Possible query corrections (eg : {@link DidYouMean})
   */
  queryCorrections: IQueryCorrection[];
  /**
   * Terms to highlight (with stemming) in the results
   */
  termsToHighlight: { [originalTerm: string]: string[] };
  /**
   * Phrases to highlight (with stemming) in the results
   */
  phrasesToHighlight: { [originalTerm: string]: string[] };
  /**
   * The Coveo Query Pipeline triggers, if any were configured.
   */
  triggers: ITrigger<any>[];
  /**
   * The keywords selected by Coveo Machine Learning Refined Query feature
   */
  refinedKeywords?: string[];
  _folded: boolean;
  _reusedSearchUid?: boolean;
}
