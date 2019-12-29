import { Assert } from '../misc/Assert';
import { ResultListEvents, IDisplayedNewResultsEventArgs } from '../events/ResultListEvents';
import { QueryStateModel } from '../models/QueryStateModel';
import { $$ } from '../utils/Dom';
import { Logger } from '../misc/Logger';

/**
 * This class is instantiated on the root of {@link SearchInterface}
 * if the {@link SearchInterface.options.enableScrollRestoration} option is set to true.
 *
 * Its job is to wait until the search results are displayed and the page height is long enough to
 * restore to the last scroll position. It'll wait for up to `restorationTimeOutInMs` milliseconds for the page to reach its height.
 *
 * This is useful when back and forth navigation between the search interface and results is needed on the same tab.
 *
 */

export class ScrollRestorationController {
  static stateAttributeName: string = 'yoffset';

  /**
   * Specifies the max amount of time to wait to restore the last scroll position.
   */
  public restorationTimeOutInMs: number = 5000;

  private defaultYOffset: number = 0;
  private tryToScrollIntervalInMs: number = 50;
  private timeoutHandle = null;

  constructor(public element: HTMLElement, public window: Window, public queryStateModel: QueryStateModel) {
    Assert.exists(this.queryStateModel);

    this.initStateAttribute();

    this.window.addEventListener('beforeunload', () => this.saveScrollPositionInState());
    $$(this.element).on(ResultListEvents.newResultsDisplayed, (event: Event, args: IDisplayedNewResultsEventArgs) =>
      this.handleNewResultsDisplayed(args)
    );
  }

  private initStateAttribute() {
    this.queryStateModel.registerNewAttribute(ScrollRestorationController.stateAttributeName, this.defaultYOffset);
  }

  private saveScrollPositionInState() {
    this.queryStateModel.set(ScrollRestorationController.stateAttributeName, this.window.pageYOffset);
  }

  private handleNewResultsDisplayed(args: IDisplayedNewResultsEventArgs) {
    if (args.infiniteScrolling) {
      new Logger(this).warn('Scroll restoration is not yet supported on result lists with infinite scrolling enabled.');
      this.resetScrollPositionState();
      return;
    }

    const lastPosition = this.queryStateModel.get(ScrollRestorationController.stateAttributeName);

    if (lastPosition) {
      this.resetScrollPositionState();
      const stopTryingAt = Date.now() + this.restorationTimeOutInMs;
      this.tryToRestoreScrollPosition(lastPosition, stopTryingAt);
    }
  }

  private resetScrollPositionState() {
    this.queryStateModel.set(ScrollRestorationController.stateAttributeName, this.defaultYOffset);
  }

  private tryToRestoreScrollPosition(lastPosition: number, stopAt: number) {
    const html = this.window.document.documentElement;
    const body = this.window.document.body;

    const documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    clearTimeout(this.timeoutHandle);

    if (documentHeight >= lastPosition || Date.now() > stopAt) {
      window.scrollTo(0, lastPosition);
    } else {
      this.timeoutHandle = setTimeout(() => this.tryToRestoreScrollPosition(lastPosition, stopAt), this.tryToScrollIntervalInMs);
    }
  }
}
