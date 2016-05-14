import {Highlight} from './Highlight';
import {Promise} from 'es6-promise';

/**
 * Describe a single result returned by the Coveo Search API.
 */
export interface IQueryResult {
  /**
   * The title of the document
   */
  title: string;
  titleHighlights: Highlight[];
  /**
   * The uri of the document
   */
  uri: string;
  /**
   * A printable uri, or path to the document
   */
  printableUri: string;
  printableUriHighlights: Highlight[];
  /**
   * The clickable uri of the document, which can be set on an href in the interface.
   */
  clickUri: string;
  /**
   * The document unique id, useful for different call on the {@link SearchEndpoint}
   */
  uniqueId: string;
  /**
   * The excerpt for the document. Can be empty for some type of documents.
   */
  excerpt: string;
  excerptHighlights: Highlight[];
  firstSentences: string;
  firstSentencesHighlights: Highlight[];
  /**
   * Whether the document has an htmlVersion (quickview)
   */
  hasHtmlVersion: boolean;
  hasMobileHtmlVersion: boolean;
  /**
   * List of flags on the document, separated by ;<br/>
   */
  flags: string;
  summary: string;
  summaryHighlights: Highlight[];
  /**
   * Returned on a document if the {@link Query.debug} was set to true
   */
  rankingInfo: string;
  /**
   * The rating for the given document. This can be set on a document using the {@link ResultRating} component, and if the collaborative rating is enabled on the index.
   */
  rating?: number;
  /**
   * Contains the raw field values on the document, as key->value properties
   */
  raw: any;
  /**
   * The parent result, if parent child loading was performed using the {@link Folding} component.
   */
  parentResult?: IQueryResult;
  /**
   * The parent result, if parent child loading was performed using the {@link Folding} component.
   */
  childResults: IQueryResult[];
  /**
   * This value specifies whether the result was recommended by Coveo Reveal.
   */
  isRecommendation: boolean;
  termsToHighlight?: {[originalTerm: string]: string[]};
  phrasesToHighlight: {[phrase: string]: {[originalTerm: string]: string[]}};
  rankingModifier?: string;

  // Those fields are added by the JS UI framework
  index?: number;
  queryUid?: string;
  pipeline?: string;
  splitTestRun?: string;

  moreResults?: () => Promise<IQueryResult[]>;
  totalNumberOfChildResults?: number;
  attachments?: IQueryResult[];
  state: { [attribute: string]: any; }
  orphan?: boolean;

  fields?: { [name: string]: any };
}