import { IQueryResult } from '../rest/QueryResult';
import { IQueryResults } from '../rest/QueryResults';
import { ValidLayout } from '../ui/ResultLayout/ResultLayout';

/**
 * The `IDisplayedNewResultEventArgs` interface describes the object that all
 * [`newResultDisplayed`]{@link ResultListEvents.newResultDisplayed} event handlers receive as an argument.
 */
export interface IDisplayedNewResultEventArgs {
  /**
   * The query result that was just displayed by the [`ResultList`]{@link ResultList} component.
   */
  result: IQueryResult;

  /**
   * The HTML element which was rendered by the  the displayed result.
   */
  item: HTMLElement;
}

/**
 * The `IOpenQuickviewEventArgs` interface describes the object that all
 * [`openQuickview`]{@link ResultList.openQuickview} event handlers receive as an argument.
 */
export interface IOpenQuickviewEventArgs {
  /**
   * The array of query expression terms to highlight in the quickview modal window.
   */
  termsToHighlight: any;
}

/**
 * The `IChangeLayoutEventArgs` interface describes the object that all
 * [`ChangeLayout`]{@link ResultListEvents.changeLayout} event handlers receive as an argument.
 */
export interface IChangeLayoutEventArgs {
  /**
   * The name of the new layout.
   *
   */
  layout: ValidLayout;

  /**
   * The current page of results.
   */
  results?: IQueryResults;
}

/**
 * The `ResultListEvents` static class contains the string definitions of all events that strongly relate to the result
 * list.
 *
 * See [Events](https://developers.coveo.com/x/bYGfAQ).
 */
export class ResultListEvents {
  /**
   * Triggered when the result list has just finished rendering the current page of results.
   *
   * @type {string} The string value is `newResultsDisplayed`.
   */
  public static newResultsDisplayed = 'newResultsDisplayed';

  /**
   * Triggered each time the result list has just finished rendering a single result.
   *
   * All `newResultDisplayed` event handlers receive a
   * [`DisplayedNewResultEventArgs`]{@link IDisplayedNewResultEventArgs} object as an argument.
   *
   * @type {string} The string value is `newResultDisplayed`.
   */
  public static newResultDisplayed = 'newResultDisplayed';

  /**
   * Triggered by the [`ResultLink`]{@link ResultLink} result template component when its
   * [`openQuickview`]{@link ResultLink.options.openQuickview} option is set to `true` and the end user clicks the
   * result link. The [`Quickview`]{@link Quickview} component listens to this event to be able to open the quickview
   * modal window in reaction.
   *
   * See also the [`openQuickview`]{@link QuickviewEvents.openQuickview} event (which is identical to this one, except
   * that it is triggered by the [`QuickviewDocument`] result template component instead).
   *
   * All `openQuickview` event handlers receive an [`OpenQuickviewEventArgs`]{@link IOpenQuickviewEventArgs} object as
   * an argument
   *
   * @type {string} The string value is `openQuickview`.
   */
  public static openQuickview = 'openQuickview';

  /**
   * Triggered by the [`ResultLayout`]{@link ResultLayout} component whenever the current result layout changes (see
   * [Result Layouts](https://developers.coveo.com/x/yQUvAg)).
   *
   * All `changeLayout` event handlers receive a [`ChangeLayoutEventArgs`]{@link IChangeLayoutEventArgs} object as an
   * argument.
   *
   * @type {string} The string value is `changeLayout`.
   */
  public static changeLayout = 'changeLayout';
}
