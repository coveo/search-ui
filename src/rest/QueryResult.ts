import { IHighlight, IHighlightPhrase, IHighlightTerm } from './Highlight';
import { Promise } from 'es6-promise';
import { SearchInterface } from '../ui/SearchInterface/SearchInterface';

/**
 * The IQueryResult interface describes a single result returned by the Coveo REST Search API.
 */
export interface IQueryResult {

  /**
   * Contains the title of the document
   */
  title: string;
  titleHighlights: IHighlight[];

  /**
   * Contains the URI of the document.
   */
  uri: string;

  /**
   * Contains a printable URI (or path) to the document.
   */
  printableUri: string;
  printableUriHighlights: IHighlight[];

  /**
   * Contains the clickable URI of the document, which you can set on an `href` in your search interface.
   *
   * See the {@link ResultLink} document.
   */
  clickUri: string;

  /**
   * Contains a unique ID for the document.
   *
   * This parameter is useful when making certain calls to a {@link SearchEndpoint}.
   */
  uniqueId: string;

  /**
   * Contains the excerpt of the document. Can be empty for certain types of documents (e.g., images, videos, etc.).
   *
   * See the {@link Excerpt} component.
   */
  excerpt: string;
  excerptHighlights: IHighlight[];
  firstSentences: string;
  firstSentencesHighlights: IHighlight[];

  /**
   * Contains a value specifying whether the document has an HTML version.
   *
   * See the {@link Quickview} component.
   */
  hasHtmlVersion: boolean;
  hasMobileHtmlVersion: boolean;

  /**
   * Contains the list of flags that the document has. Each value is separated by a semicolon (`;`).
   */
  flags: string;
  summary: string;
  summaryHighlights: IHighlight[];

  /**
   * Contains a ranking information which is returned along the document if {@link IQuery.debug} is `true`.
   */
  rankingInfo: string;

  /**
   * Contains the rating of the document.
   *
   * See the {@link ResultRating} component.
   */
  rating?: number;

  /**
   * Contains the raw field values of the document, expressed as key-value pairs.
   */
  raw: any;

  /**
   * Contains the parent result if parent-child loading was performed.
   *
   * See the {@link Folding} component.
   */
  parentResult?: IQueryResult;

  /**
   * Contains the child results if parent-child loading was performed.
   *
   * See the {@link Folding} component.
   */
  childResults: IQueryResult[];

  /**
   * Contains a value that specifies whether the result was recommended by the Coveo Machine Learning service.
   *
   * See [Coveo Machine Learning](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=177).
   */
  isRecommendation: boolean;
  termsToHighlight?: IHighlightTerm;
  phrasesToHighlight: IHighlightPhrase;
  rankingModifier?: string;

  // Those fields are added by the JS UI framework
  /**
   * Contains the 0-based index value of the result, as returned by the Coveo REST Search API.
   */
  index?: number;

  /**
   * Contains The query UID, as returned by the Coveo REST Search API.
   *
   * This value is used mainly for usage analytics.
   *
   * The Coveo JavaScript Search Framework adds this property client-side to each result.
   */
  queryUid?: string;
  pipeline?: string;
  splitTestRun?: string;

  moreResults?: () => Promise<IQueryResult[]>;
  totalNumberOfChildResults?: number;
  attachments?: IQueryResult[];

  /**
   * Contains the query state of the {@link SearchInterface} inside which this result is rendered.
   *
   * This value is used mainly to allow for conditional rendering of results templates.
   *
   * The Coveo JavaScript Search Framework adds this property client-side to each result.
   */
  state: { [attribute: string]: any; };

  /**
   * The {@link SearchInterface} inside which this result is rendered.
   *
   * This value is used mainly to allow for conditional rendering of results templates.
   *
   * The Coveo JavaScript Search Framework adds this property client-side to each result.
   */
  searchInterface: SearchInterface;
  orphan?: boolean;

  fields?: { [name: string]: any };
}
