


import {l} from '../../Base';

module Coveo {
  export interface SearchAlertMessageOptions {
    closeDelay: number;
  }

  export class SearchAlertMessage extends Component {
    static ID = 'SubscriptionsMessages';

    private message: JQuery;
    private closeTimeout: number;

    constructor(public element: HTMLElement,
      public options: SearchAlertMessageOptions,
      public bindings?: IComponentBindings) {

      super(element, SearchAlertMessage.ID, bindings);

      $(this.root).on(SearchAlertEvents.searchAlertCreated, $.proxy(this.handleSubscriptionCreated, this));
      $(this.root).on(SearchAlertEvents.SearchAlertsFail, $.proxy(this.handleSearchAlerts_Fail, this));
      $(this.root).on(SearchAlertEvents.searchAlertDeleted, $.proxy(this.close, this));

      $(this.root).on(QueryEvents.newQuery, $.proxy(this.close, this));
    }

    public getCssClass(): string {
      return 'coveo-subscriptions-messages';
    }

    private showMessage(dom: JQuery, message: string, error: boolean) {
      this.message = $(`<div class="coveo-subscriptions-messages-message">
          <div class="coveo-subscriptions-messages-info-close"></div>
          <div class="coveo-subscriptions-messages-content">${ message }</div>
        </div>`);

      this.message.toggleClass('coveo-subscriptions-messages-error', error)
        .find('.coveo-subscriptions-messages-info-close').on('click', () => this.close());

      JQueryUtils.positionPopup(this.message, dom, $(this.root), $(this.root), {
        horizontal: JQueryUtils.HorizontalAlignment.innerLeft,
        vertical: JQueryUtils.VerticalAlignment.bottom,
        verticalOffset: 12,
        horizontalClip: true
      });

      this.startCloseDelay();

      this.message.mouseleave(() => {
        this.startCloseDelay();
      })
      this.message.mouseenter(() => {
        this.stopCloseDelay();
      })
    }

    private handleSubscriptionCreated(e: JQueryEventObject, args: SearchAlertEventArgs) {
      this.close();
      if (args.dom != null) {
        if (args.subscription.type == SubscriptionType.followQuery) {
          let typeConfig = <ISubscriptionQueryRequest>args.subscription.typeConfig;
          this.showMessage($(args.dom), l("SubscriptionsMessageFollowQuery", _.escape(typeConfig.query.q) || l("EmptyQuery")), false);
        } else {
          let typeConfig = <ISubscriptionItemRequest>args.subscription.typeConfig;
          this.showMessage($(args.dom), l("SubscriptionsMessageFollow", _.escape(typeConfig.title)), false);
        }
      }
    }

    private handleSearchAlerts_Fail(e: JQueryEventObject, args: SearchAlertsFailEventArgs) {
      this.close();
      if (args.dom != null) {
        this.showMessage($(args.dom), l("SearchAlerts_Fail"), true);
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
}
