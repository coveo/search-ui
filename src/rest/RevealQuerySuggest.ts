import { IStringMap } from './GenericParam';
/**
 * Describe a suggestion of completion from reveal
 */
export interface IRevealQuerySuggestCompletion {
  /**
   * The expression to complete
   */
  expression: string;
  /**
   * The degree of confidence from reveal that the suggestion is relevant
   */
  score: number;
  /**
   * The highlighted expression to complete
   */
  highlighted: string;
  /**
   * The confidence level that this suggestion should be executed
   */
  executableConfidence: number;
}

/**
 * Describe a response from reveal query suggestions
 */
export interface IRevealQuerySuggestResponse {
  /**
   * An array of completions
   */
  completions: IRevealQuerySuggestCompletion[];
}

/**
 * Describe a request to reveal query suggest
 */
export interface IRevealQuerySuggestRequest {
  /**
   * Query / word for which to get completions
   */
  q: string;
  /**
   * The search hub for which to get suggestions
   */
  searchHub?: string;
  /**
   * Number of suggestions that the service should return. Default to 5
   */
  count?: number;
  /**
   * The pipeline to use for the request.
   */
  pipeline?: string;
  /**
   * The context to use for the request
   */
  context?: IStringMap<any>;
  language?: string;
  autoCompleter?: string;
  additionalData?: any;
  format?: string;
  enableWordCompletion?: boolean;
}
