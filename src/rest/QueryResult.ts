import { IHighlight, IHighlightPhrase, IHighlightTerm } from './Highlight';
import { SearchInterface } from '../ui/SearchInterface/SearchInterface';

/**
 * The `IQueryResult` interface describes a single result returned by the Coveo REST Search API.
 */
export interface IQueryResult {
  /**
   * Contains the title of the item.
   */
  title: string;
  titleHighlights: IHighlight[];

  /**
   * Contains the URI of the item.
   */
  uri: string;

  /**
   * Contains a printable URI (or path) to the item.
   */
  printableUri: string;
  printableUriHighlights: IHighlight[];

  /**
   * Contains the clickable URI of the item, which you can set on an `href` in your search interface.
   *
   * See the [`ResultLink`]{@link ResultLink} component.
   */
  clickUri: string;

  /**
   * Contains the unique ID of the item.
   *
   * This parameter is useful when making certain calls to a [`SearchEndpoint`]{@link SearchEndpoint}.
   */
  uniqueId: string;

  /**
   * Contains an excerpt of the item. Can be empty for certain types of items (e.g., images, videos, etc.).
   *
   * See the [`Excerpt`]{@link Excerpt} component.
   */
  excerpt: string;
  excerptHighlights: IHighlight[];
  firstSentences: string;
  firstSentencesHighlights: IHighlight[];

  /**
   * Contains a value specifying whether the item has an HTML version.
   *
   * See the [`Quickview`]{@link Quickview} component.
   */
  hasHtmlVersion: boolean;
  hasMobileHtmlVersion: boolean;

  /**
   * Contains the list of flags for the item. Values are separated by a semicolon characters (`;`).
   */
  flags: string;
  summary: string;
  summaryHighlights: IHighlight[];

  /**
   * Contains ranking information, which the Coveo REST Search API returns along with the item when the query
   * [`debug`]{@link IQuery.debug} property is `true`.
   */
  rankingInfo: string;

  /**
   * **Note:**
   *
   * > The Coveo Cloud V2 platform does not support collaborative rating. Therefore, this property is obsolete in Coveo Cloud V2.
   *
   * Contains the collaborative rating value for the item.
   *
   * See the [`ResultRating`]{@link ResultRating} component.
   */
  rating?: number;

  /**
   * Contains the raw field values of the item, expressed as key-value pairs.
   */
  raw: any;

  /**
   * Contains the parent result of the item, if parent-child loading was performed.
   *
   * See the [`Folding`]{@link Folding} component.
   */
  parentResult?: IQueryResult;

  /**
   * Contains the child results of the item, if parent-child loading was performed.
   *
   * See the [`Folding`]{@link Folding} component.
   */
  childResults: IQueryResult[];

  /**
   * Contains a value that specifies whether the result was recommended by the Coveo Machine Learning service.
   *
   * See the [`Recommendation`]{@link Recommendation} component.
   *
   * See also [Coveo Machine Learning](https://docs.coveo.com/en/1727/).
   */
  isRecommendation: boolean;

  /**
   * Whether the result item was previously viewed by the user specified in the [userActions]{@link IQuery.userActions} request of the query.
   */
  isUserActionView?: boolean;

  /**
   * Specifies whether the result is a Featured Result in the Coveo Query Pipeline (see [Adding and Managing Query Pipeline Featured Results](https://docs.coveo.com/en/1961/)).
   */
  isTopResult: boolean;
  termsToHighlight?: IHighlightTerm;
  phrasesToHighlight: IHighlightPhrase;
  rankingModifier?: string;

  // Those fields are added by the JS UI framework
  /**
   * Contains the 0-based index value of the result, as returned by the Coveo REST Search API.
   */
  index?: number;

  /**
   * Contains the query UID, as returned by the Coveo REST Search API.
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
   * Contains the query state of the [`SearchInterface`]{@link SearchInterface} inside which this result is rendered.
   *
   * This value is used mainly to allow for conditional rendering of results templates.
   *
   * The Coveo JavaScript Search Framework adds this property client-side to each result.
   */
  state: { [attribute: string]: any };

  /**
   * The [`SearchInterface`]{@link SearchInterface} inside which this result is rendered.
   *
   * This value is used mainly to allow for conditional rendering of results templates.
   *
   * The Coveo JavaScript Search Framework adds this property client-side to each result.
   */
  searchInterface: SearchInterface;
  orphan?: boolean;

  fields?: { [name: string]: any };

  /**
   * The query terms that are not matched by the result.
   */
  absentTerms: string[];
}
