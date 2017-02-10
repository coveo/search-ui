import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import {
  SearchAlertsEvents, ISearchAlertsEventArgs, ISearchAlertsFailEventArgs,
  ISearchAlertsPopulateMessageEventArgs
} from '../../events/SearchAlertEvents';
import { QueryEvents } from '../../events/QueryEvents';
import { ISubscriptionItemRequest, SUBSCRIPTION_TYPE, ISubscriptionQueryRequest } from '../../rest/Subscription';
import { PopupUtils, HorizontalAlignment, VerticalAlignment } from '../../utils/PopupUtils';
import { l } from '../../strings/Strings';
import { $$, Dom } from '../../utils/Dom';
import _ = require('underscore');

export interface ISearchAlertMessageOptions {
  closeDelay: number;
}

/**
 * The SearchAlertsMessage component allows the {@link SearchAlerts} component to display messages.
 *
 * You should not include this component in your page. Instead, use a {@link SearchAlerts} component, and access the
 * {@link SearchAlerts.message} attribute.
 */
export class SearchAlertsMessage extends Component {
  static ID = 'SubscriptionsMessages';

  /**
   * The options for the SearchAlertsMessage component
   * @componentOptions
   */
  static options: ISearchAlertMessageOptions = {

    /**
     * Specifies how long to display the search alerts messages (in milliseconds).
     *
     * Default value is `3000`. Minimum value is `0`.
     */
    closeDelay: ComponentOptions.buildNumberOption({ defaultValue: 3000, min: 0 }),
  };

  private message: Dom;
  private closeTimeout: number;

  /**
   * Creates a new SearchAlertsMessage component
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the SearchAlertsMessage component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement,
    public options: ISearchAlertMessageOptions,
    public bindings?: IComponentBindings) {

    super(element, SearchAlertsMessage.ID, bindings);

    this.bind.onRootElement(SearchAlertsEvents.searchAlertsCreated, (args: ISearchAlertsEventArgs) => this.handleSubscriptionCreated(args));
    this.bind.oneRootElement(SearchAlertsEvents.searchAlertsFail, (args: ISearchAlertsEventArgs) => this.handleSearchAlertsFail(args));
    this.bind.oneRootElement(SearchAlertsEvents.searchAlertsDeleted, () => this.close());

    this.bind.oneRootElement(QueryEvents.newQuery, () => this.close());
  }

  public getCssClass(): string {
    return 'coveo-subscriptions-messages';
  }

  public getFollowQueryMessage(query?: string, htmlFormatted = false): string {
    let populateMessageArguments: ISearchAlertsPopulateMessageEventArgs = {
      text: []
    };

    let getAdditionalTextFormatted = () => {
      return _.map(populateMessageArguments.text, (text) => {
        return `${htmlFormatted ? '<li>' : '('}${_.escape(text)}${htmlFormatted ? '</li>' : ')'}`;
      }).join(' ');
    };

    $$(this.root).trigger(SearchAlertsEvents.searchAlertsPopulateMessage, populateMessageArguments);
    let additionalMessage = `${htmlFormatted ? '<ul>' : ''}${getAdditionalTextFormatted()}${htmlFormatted ? '</ul>' : ''}`;

    let automaticallyBuiltMessage;

    if (query && populateMessageArguments.text.length != 0) {
      automaticallyBuiltMessage = `${_.escape(query)} ${additionalMessage}`;
    }

    if (query && populateMessageArguments.text.length == 0) {
      automaticallyBuiltMessage = `${_.escape(query)}`;
    }
    if (!query && populateMessageArguments.text.length != 0) {
      automaticallyBuiltMessage = `${additionalMessage}`;
    }

    if (!query && populateMessageArguments.text.length == 0) {
      automaticallyBuiltMessage = htmlFormatted ? l('EmptyQuery') : _.unescape(l('EmptyQuery'));
    }

    return automaticallyBuiltMessage;
  }

  /**
   * Displays a message near the passed dom attribute.
   * @param dom Specifies where to display the message.
   * @param message The message.
   * @param error Specifies whether the message is an error message.
   */
  public showMessage(dom: Dom, message: string, error: boolean) {
    this.message = $$('div');
    this.message.el.innerHTML = `
      <div class='coveo-subscriptions-messages-message'>
        <div class='coveo-subscriptions-messages-info-close'></div>
        <div class='coveo-subscriptions-messages-content' title='${message}'>${message}</div>
      </div>`;

    this.message.toggleClass('coveo-subscriptions-messages-error', error);
    let closeButton = this.message.find('.coveo-subscriptions-messages-info-close');
    $$(closeButton).on('click', () => this.close());

    PopupUtils.positionPopup(this.message.el, dom.el, this.root, {
      horizontal: HorizontalAlignment.INNERLEFT,
      vertical: VerticalAlignment.BOTTOM,
      verticalOffset: 12,
      horizontalClip: true
    }, this.root);

    this.startCloseDelay();

    this.message.on('mouseleave', () => {
      this.startCloseDelay();
    });
    this.message.on('mouseenter', () => {
      this.stopCloseDelay();
    });
  }

  private handleSubscriptionCreated(args: ISearchAlertsEventArgs) {
    this.close();
    if (args.dom != null) {
      if (args.subscription.type == SUBSCRIPTION_TYPE.followQuery) {
        let typeConfig = <ISubscriptionQueryRequest>args.subscription.typeConfig;
        this.showMessage($$(args.dom), l('SubscriptionsMessageFollowQuery', this.getFollowQueryMessage(typeConfig.query.q, true)), false);
      } else {
        let typeConfig = <ISubscriptionItemRequest>args.subscription.typeConfig;
        this.showMessage($$(args.dom), l('SubscriptionsMessageFollow', _.escape(typeConfig.title)), false);
      }
    }
  }

  private handleSearchAlertsFail(args: ISearchAlertsFailEventArgs) {
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
    clearTimeout(this.closeTimeout);
  }

  private close() {
    if (this.message != null) {
      clearTimeout(this.closeTimeout);
      this.message.remove();
      this.message = null;
    }
  }
}
