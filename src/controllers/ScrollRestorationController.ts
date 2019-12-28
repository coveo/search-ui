import { Assert } from '../misc/Assert';
import { ResultListEvents } from '../events/ResultListEvents';
import { QueryStateModel } from '../models/QueryStateModel';
import { RootComponent } from '../ui/Base/RootComponent';
import { $$ } from '../utils/Dom';

/**
 * This class is instantiated on the root of {@link SearchInterface}
 * if the {@link SearchInterface.options.enableScrollRestoration} option is set to true.
 *
 * Its job is to wait until the search results are displayed and the page height is long enough to
 * restore to the last scroll position. It'll wait for up to `scrollRestorationTimeOutInMs` milliseconds.
 *
 * This is useful when back and forth navigation between the interface and results is needed on the same tab.
 */

export class ScrollRestorationController extends RootComponent {
  static ID = 'ScrollRestorationController';
  static stateName: string = 'yoffset';
  public scrollRestorationTimeOutInMs: number = 5000;

  private defaultYOffset: number = 0;
  private tryToScrollIntervalInMs: number = 50;
  private timeoutHandle = null;

  constructor(element: HTMLElement, public window: Window, public queryStateModel: QueryStateModel) {
    super(element, ScrollRestorationController.ID);

    Assert.exists(this.queryStateModel);

    this.initStateAttribute();

    this.window.addEventListener(
      'beforeunload',
      () => {
        this.saveScrollPosition();
      },
      false
    );

    $$(this.element).on(ResultListEvents.newResultsDisplayed, () => this.handleNewResultsDisplayed());
  }

  private initStateAttribute() {
    this.queryStateModel.registerNewAttribute(ScrollRestorationController.stateName, this.defaultYOffset);
  }

  private saveScrollPosition() {
    this.queryStateModel.set(ScrollRestorationController.stateName, this.window.pageYOffset);
  }

  private handleNewResultsDisplayed() {
    const lastPosition = this.queryStateModel.get(ScrollRestorationController.stateName);

    if (lastPosition) {
      this.resetScrollPositionState();
      const stopTryingAt = Date.now() + this.scrollRestorationTimeOutInMs;
      this.tryToRestoreScrollPosition(lastPosition, stopTryingAt);
    }
  }

  private resetScrollPositionState() {
    this.queryStateModel.set(ScrollRestorationController.stateName, this.defaultYOffset);
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
