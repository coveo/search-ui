import { IStringMap } from './GenericParam';
/**
 * The IRevealQuerySuggestCompletion interface describes a completion suggestion from the Coveo Machine Learning
 * service (see [Coveo Machine Learning](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=177).
 */
export interface IRevealQuerySuggestCompletion {

  /**
   * Contains the expression to complete.
   */
  expression: string;

  /**
   * Contains a value indicating how certain the Coveo Machine Learning service is that this suggestion is actually
   * relevant.
   */
  score: number;

  /**
   * Contains the highlighted expression to complete.
   */
  highlighted: string;

  /**
   * Contains a value indicating the confidence level that this suggestion should be executed.
   */
  executableConfidence: number;
}

/**
 * The IRevealQuerySuggestResponse interface describes a response from the Coveo Machine Learning service query
 * suggestions.
 */
export interface IRevealQuerySuggestResponse {

  /**
   * Contains an array of completions.
   */
  completions: IRevealQuerySuggestCompletion[];
}

/**
 * The IRevealQuerySuggestRequest interface describes a request to the Coveo Machine Learning service query suggest.
 */
export interface IRevealQuerySuggestRequest {

  /**
   * Specifies the query / word for which to get completion.
   */
  q: string;
  /**
   * Specifies the search hub for which to get suggestions.
   */
  searchHub?: string;

  /**
   * Specifies the number of suggestions that the Coveo Machine Learning service should return.
   *
   * Default value is `5`.
   */
  count?: number;

  /**
   * Specifies the pipeline to use for the request.
   */
  pipeline?: string;

  /**
   * Specifies the context to use for the request.
   */
  context?: IStringMap<any>;
  language?: string;
  autoCompleter?: string;
  additionalData?: any;
  format?: string;
  enableWordCompletion?: boolean;
}
