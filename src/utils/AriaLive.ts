import 'styling/accessibility/_ScreenReader.scss';
import { $$ } from './Dom';
import { QueryEvents, IQuerySuccessEventArgs, IQueryErrorEventArgs } from '../events/QueryEvents';
import { QuerySummaryUtils } from './QuerySummaryUtils';
import { l } from '../strings/Strings';

export class AriaLive {
  private ariaLiveEl: HTMLElement;

  constructor(private searchInterface: HTMLElement) {
    this.initAriaLiveEl();
    this.appendToSearchInterface();
    this.addQueryEventListeners();
  }

  public updateText(text: string) {
    this.ariaLiveEl.innerText = text;
  }

  private appendToSearchInterface() {
    this.searchInterface.appendChild(this.ariaLiveEl);
  }

  private initAriaLiveEl() {
    this.ariaLiveEl = document.createElement('div');
    this.ariaLiveEl.setAttribute('aria-live', 'polite');
    this.ariaLiveEl.setAttribute('class', 'coveo-visible-to-screen-reader-only');
  }

  private addQueryEventListeners() {
    const root = $$(this.searchInterface);
    root.on(QueryEvents.querySuccess, (e, args: IQuerySuccessEventArgs) => this.onQuerySuccess(args));
    root.on(QueryEvents.queryError, (e, args: IQueryErrorEventArgs) => this.onQueryError(args));
  }

  private onQuerySuccess(args: IQuerySuccessEventArgs) {
    const message = this.messageForResultCount(args);
    this.updateText(message);
  }

  private messageForResultCount(args: IQuerySuccessEventArgs) {
    const hasResults = args.results.results.length;

    if (hasResults) {
      return QuerySummaryUtils.message(this.searchInterface, args);
    }

    return this.noResultMessage(args.query.q);
  }

  private noResultMessage(query: string) {
    const noResultsMessage = l('noResultFor', '${query}');
    const sanitizedQuery = escape(query);
    return QuerySummaryUtils.replaceQueryTags(noResultsMessage, sanitizedQuery);
  }

  private onQueryError(args: IQueryErrorEventArgs) {
    const message = l('QueryException', args.error.message);
    this.updateText(message);
  }
}
