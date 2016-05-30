import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {SearchAlertEvents, ISearchAlertEventArgs, ISearchAlertsFailEventArgs} from '../../events/SearchAlertEvents';
import {QueryEvents} from '../../events/QueryEvents';
import {ISubscriptionItemRequest, SubscriptionType, ISubscriptionQueryRequest} from '../../rest/Subscription';
import {PopupUtils, HorizontalAlignment, VerticalAlignment} from '../../utils/PopupUtils';
import {l} from '../../strings/Strings';
import {$$, Dom} from '../../utils/Dom';

export interface ISearchAlertMessageOptions {
  closeDelay: number;
}

export class SearchAlertsMessage extends Component {
  static ID = 'SubscriptionsMessages';

  private message: Dom;
  private closeTimeout: number;

  constructor(public element: HTMLElement,
    public options: ISearchAlertMessageOptions,
    public bindings?: IComponentBindings) {

    super(element, SearchAlertsMessage.ID, bindings);

    $$(this.root).on(SearchAlertEvents.searchAlertCreated, (e: Event, args: ISearchAlertEventArgs)=>{this.handleSubscriptionCreated(e, args)});
    $$(this.root).on(SearchAlertEvents.SearchAlertsFail, (e: Event, args: ISearchAlertEventArgs)=>{this.handleSearchAlerts_Fail(e, args)});
    $$(this.root).on(SearchAlertEvents.searchAlertDeleted, ()=>{this.close()});

    $$(this.root).on(QueryEvents.newQuery, ()=>{this.close()});
  }

  public getCssClass(): string {
    return 'coveo-subscriptions-messages';
  }

  public showMessage(dom: Dom, message: string, error: boolean) {
    this.message = $$('div');
    this.message.el.innerHTML = `<div class='coveo-subscriptions-messages-message'>
        <div class='coveo-subscriptions-messages-info-close'></div>
        <div class='coveo-subscriptions-messages-content'>${ message}</div>
      </div>`;

    this.message.toggleClass('coveo-subscriptions-messages-error', error);
    let closeButton = this.message.find('.coveo-subscriptions-messages-info-close');
    $$(closeButton).on('click', () => this.close());

    PopupUtils.positionPopup(this.message.el, dom.el, this.root, this.root, {
      horizontal: HorizontalAlignment.INNERLEFT,
      vertical: VerticalAlignment.BOTTOM,
      verticalOffset: 12,
      horizontalClip: true
    });

    this.startCloseDelay();

    this.message.on('mouseleave', () => {
      this.startCloseDelay();
    })
    this.message.on('mouseenter', () => {
      this.stopCloseDelay();
    })
  }

  private handleSubscriptionCreated(e: Event, args: ISearchAlertEventArgs) {
    this.close();
    if (args.dom != null) {
      if (args.subscription.type == SubscriptionType.followQuery) {
        let typeConfig = <ISubscriptionQueryRequest>args.subscription.typeConfig;
        this.showMessage($$(args.dom), l('SubscriptionsMessageFollowQuery', _.escape(typeConfig.query.q) || l('EmptyQuery')), false);
      } else {
        let typeConfig = <ISubscriptionItemRequest>args.subscription.typeConfig;
        this.showMessage($$(args.dom), l('SubscriptionsMessageFollow', _.escape(typeConfig.title)), false);
      }
    }
  }

  private handleSearchAlerts_Fail(e: Event, args: ISearchAlertsFailEventArgs) {
    this.close();
    if (args.dom != null) {
      this.showMessage($$(args.dom), l('SearchAlerts_Fail'), true);
    }
  }

  private startCloseDelay() {
    clearTimeout(this.closeTimeout);
    this.closeTimeout = setTimeout(() => {
      this.close();
    }, this.options.closeDelay);
  }

  private stopCloseDelay() {
    clearTimeout(this.closeTimeout)
  }

  private close() {
    if (this.message != null) {
      clearTimeout(this.closeTimeout);
      this.message.remove();
      this.message = null;
    }
  }
}
