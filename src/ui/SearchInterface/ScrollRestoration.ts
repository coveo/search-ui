import { ResultListEvents, IDisplayedNewResultsEventArgs } from '../../events/ResultListEvents';
import { $$ } from '../../utils/Dom';
import { Logger } from '../../misc/Logger';
import { StorageUtils } from '../../utils/StorageUtils';
import { QueryStateModel } from '../../models/QueryStateModel';

interface IScrollRestorationInfo {
  lastPosition: number;
  pageHeight: number;
}

export class ScrollRestoration {
  static ID = 'ScrollRestoration';

  private scrollInfoStorage: StorageUtils<Record<string, IScrollRestorationInfo>>;

  private restorationTimeOutInMs: number = 5000;
  private tryToScrollIntervalInMs: number = 50;
  private timeoutHandle = null;

  constructor(public root: HTMLElement, private queryStateModel: QueryStateModel) {
    this.scrollInfoStorage = new StorageUtils<Record<string, IScrollRestorationInfo>>(ScrollRestoration.ID, 'session');
    window.addEventListener('beforeunload', () => {
      this.saveScrollPositionInState();
    });
    $$(this.root).on(ResultListEvents.newResultsDisplayed, (event: Event, args: IDisplayedNewResultsEventArgs) =>
      this.handleNewResultsDisplayed(args)
    );
  }

  public saveScrollPositionInState() {
    const scrollInfo: IScrollRestorationInfo = {
      pageHeight: window.document.body.scrollHeight,
      lastPosition: window.pageYOffset
    };

    const key = this.getKeyForCurrentQuery();
    const prevScrollInfo = this.scrollInfoStorage.load();
    this.scrollInfoStorage.save({
      ...prevScrollInfo,
      [key]: scrollInfo
    });
  }

  public handleNewResultsDisplayed(args: IDisplayedNewResultsEventArgs) {
    if (args.infiniteScrolling) {
      new Logger(this).warn('Scroll restoration is not yet supported on result lists with infinite scrolling enabled.');
      this.resetScrollPositionState();
      return;
    }

    const scrollInfo = this.getScrollInfoForCurrentQuery();

    this.resetScrollPositionState();

    if (scrollInfo && scrollInfo.lastPosition) {
      const stopTryingAt = Date.now() + this.restorationTimeOutInMs;
      this.tryToRestoreScrollPosition(scrollInfo, stopTryingAt);
    }
  }

  private resetScrollPositionState() {
    this.scrollInfoStorage.remove(this.getKeyForCurrentQuery());
  }

  private tryToRestoreScrollPosition(scrollInfo: IScrollRestorationInfo, stopAt: number) {
    const html = window.document.documentElement;
    const body = window.document.body;

    const documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    clearTimeout(this.timeoutHandle);

    if (documentHeight >= scrollInfo.pageHeight || Date.now() >= stopAt) {
      window.scrollTo(0, scrollInfo.lastPosition);
    } else {
      this.timeoutHandle = setTimeout(() => this.tryToRestoreScrollPosition(scrollInfo, stopAt), this.tryToScrollIntervalInMs);
    }
  }

  private getScrollInfoForCurrentQuery() {
    const scrollInfo = this.scrollInfoStorage.load() || {};
    return scrollInfo[this.getKeyForCurrentQuery()];
  }

  private getKeyForCurrentQuery() {
    return JSON.stringify(this.queryStateModel.getAttributes());
  }
}
