import {PendingSearchEvent} from './PendingSearchEvent';
import {AnalyticsEndpoint} from '../../rest/AnalyticsEndpoint';
import {$$} from '../../utils/Dom';
import {InitializationEvents} from '../../events/InitializationEvents';
import {ISearchEvent} from '../../rest/SearchEvent';
import {IDuringQueryEventArgs} from '../../events/QueryEvents';
import _ = require('underscore');
import {IAnalyticsActionCause} from './AnalyticsActionListMeta';

export class PendingSearchAsYouTypeSearchEvent extends PendingSearchEvent {
  public delayBeforeSending = 5000;
  public beforeResolve: Promise<PendingSearchAsYouTypeSearchEvent>;
  private beforeUnloadHandler: (...args: any[]) => void;
  private armBatchDelay = 50;
  private toSendRightNow: () => void;

  constructor(public root: HTMLElement, public endpoint: AnalyticsEndpoint, public templateSearchEvent: ISearchEvent, public sendToCloud) {
    super(root, endpoint, templateSearchEvent, sendToCloud);
    this.beforeUnloadHandler = () => {
      this.onWindowUnload();
    }
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
    $$(root).on(InitializationEvents.nuke, () => this.handleNuke());
  }

  protected handleDuringQuery(e: Event, args: IDuringQueryEventArgs) {
    this.beforeResolve = new Promise((resolve) => {
      this.toSendRightNow = () => {
        if (!this.isCancelledOrFinished()) {
          resolve(this);
          super.handleDuringQuery(e, args);
        }
      }
      _.delay(() => {
        this.toSendRightNow();
      }, this.delayBeforeSending);
    })
  }

  public sendRightNow() {
    if (this.toSendRightNow) {
      this.toSendRightNow();
    }
  }

  public modifyCustomData(key: string, newData: any) {
    _.each(this.searchEvents, (searchEvent: ISearchEvent) => {
      searchEvent.customData[key] = newData;
    })
    if (!this.templateSearchEvent.customData) {
      this.templateSearchEvent.customData = {};
    }
    this.templateSearchEvent.customData[key] = newData;
  }

  public modifyEventCause(newCause: IAnalyticsActionCause) {
    _.each(this.searchEvents, (searchEvent: ISearchEvent) => {
      searchEvent.actionCause = newCause.name;
      searchEvent.actionType = newCause.type;
    })
    this.templateSearchEvent.actionCause = newCause.name;
    this.templateSearchEvent.actionType = newCause.type;
  }

  public stopRecording() {
    super.stopRecording();
    if (this.beforeUnloadHandler) {
      window.removeEventListener('beforeunload', this.beforeUnloadHandler);
      this.beforeUnloadHandler = undefined;
    }
  }

  private handleNuke() {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }

  private onWindowUnload() {
    if (!this.isCancelledOrFinished()) {
      this.armBatchDelay = 0;
      this.sendRightNow();
    }
  }

  private isCancelledOrFinished() {
    if (!this.cancelled) {
      if (this.finished) {
        this.cancel();
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
