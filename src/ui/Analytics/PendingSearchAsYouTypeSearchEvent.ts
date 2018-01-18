import { PendingSearchEvent } from './PendingSearchEvent';
import { AnalyticsEndpoint } from '../../rest/AnalyticsEndpoint';
import { $$ } from '../../utils/Dom';
import { InitializationEvents } from '../../events/InitializationEvents';
import { ISearchEvent } from '../../rest/SearchEvent';
import { IDuringQueryEventArgs } from '../../events/QueryEvents';
import { IAnalyticsActionCause } from './AnalyticsActionListMeta';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { Component } from '../Base/Component';
import { QueryStateModel } from '../../models/QueryStateModel';
import * as _ from 'underscore';

export class PendingSearchAsYouTypeSearchEvent extends PendingSearchEvent {
  public delayBeforeSending = 5000;
  public beforeResolve: Promise<PendingSearchAsYouTypeSearchEvent>;
  private beforeUnloadHandler: (...args: any[]) => void;
  private toSendRightNow: () => void;
  private queryContent = '';

  constructor(public root: HTMLElement, public endpoint: AnalyticsEndpoint, public templateSearchEvent: ISearchEvent, public sendToCloud) {
    super(root, endpoint, templateSearchEvent, sendToCloud);
    this.beforeUnloadHandler = () => {
      this.onWindowUnload();
    };
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
    $$(root).on(InitializationEvents.nuke, () => this.handleNuke());
  }

  protected handleDuringQuery(e: Event, args: IDuringQueryEventArgs) {
    const event = _.clone(e);
    // We need to "snapshot" the current query before the delay is applied
    // Otherwise, this means that after 5 second, the original query is possibly modified
    // For example, DidYouMean would be wrong in that case.
    const eventTarget: HTMLElement = <HTMLElement>e.target;
    const searchInterface = <SearchInterface>Component.get(eventTarget, SearchInterface);
    this.modifyQueryContent(searchInterface.queryStateModel.get(QueryStateModel.attributesEnum.q));
    this.beforeResolve = new Promise(resolve => {
      this.toSendRightNow = () => {
        if (!this.isCancelledOrFinished()) {
          resolve(this);
          super.handleDuringQuery(event, args, this.queryContent);
        }
      };
      _.delay(() => {
        this.toSendRightNow();
      }, this.delayBeforeSending);
    });
  }

  public sendRightNow() {
    if (this.toSendRightNow) {
      this.toSendRightNow();
    }
  }

  public modifyCustomData(key: string, newData: any) {
    _.each(this.searchEvents, (searchEvent: ISearchEvent) => {
      searchEvent.customData[key] = newData;
    });
    if (!this.templateSearchEvent.customData) {
      this.templateSearchEvent.customData = {};
    }
    this.templateSearchEvent.customData[key] = newData;
  }

  public modifyEventCause(newCause: IAnalyticsActionCause) {
    _.each(this.searchEvents, (searchEvent: ISearchEvent) => {
      searchEvent.actionCause = newCause.name;
      searchEvent.actionType = newCause.type;
    });
    this.templateSearchEvent.actionCause = newCause.name;
    this.templateSearchEvent.actionType = newCause.type;
  }

  public modifyQueryContent(query: string) {
    this.queryContent = query;
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
