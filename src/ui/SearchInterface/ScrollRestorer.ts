import { ResultListEvents, IDisplayedNewResultsEventArgs } from '../../events/ResultListEvents';
import { $$ } from '../../utils/Dom';
import { Logger } from '../../misc/Logger';
import { StorageUtils } from '../../utils/StorageUtils';
import { QueryStateModel } from '../../models/QueryStateModel';

interface IScrollRestorationInfo {
  lastPosition: number;
  pageHeight: number;
}

export class ScrollRestorer {
  private ID = 'ScrollRestorer';

  private scrollInfoStorage: StorageUtils<Record<string, IScrollRestorationInfo>>;

  private restorationTimeOutInMs = 5000;
  private tryToScrollIntervalInMs = 50;
  private timeoutHandle;

  constructor(public root: HTMLElement, private queryStateModel: QueryStateModel) {
    this.scrollInfoStorage = new StorageUtils<Record<string, IScrollRestorationInfo>>(this.ID, 'session');
    window.addEventListener('beforeunload', () => {
      this.saveScrollInfo();
    });
    $$(this.root).on(ResultListEvents.newResultsDisplayed, (event: Event, args: IDisplayedNewResultsEventArgs) =>
      this.handleNewResultsDisplayed(args)
    );
  }

  private saveScrollInfo() {
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
    if (args.isInfiniteScrollEnabled) {
      new Logger(this).warn('Scroll restoration is not supported on result lists with infinite scrolling enabled.');
      this.resetScrollInfo();
      return;
    }

    const scrollInfo = this.getScrollInfoForCurrentQuery();

    this.resetScrollInfo();

    if (scrollInfo && scrollInfo.lastPosition) {
      const stopTryingAt = Date.now() + this.restorationTimeOutInMs;
      this.tryToRestoreScrollPosition(scrollInfo, stopTryingAt);
    }
  }

  private resetScrollInfo() {
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
