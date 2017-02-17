import { Component } from '../Base/Component';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { IResultsComponentBindings } from '../Base/ResultsComponentBindings';
import { IQueryResult } from '../../rest/QueryResult';
import { Assert } from '../../misc/Assert';
import { SearchAlertsEvents, ISearchAlertsEventArgs, ISearchAlertsFailEventArgs } from '../../events/SearchAlertEvents';
import { ISubscription, ISubscriptionItemRequest, SUBSCRIPTION_TYPE, ISubscriptionRequest } from '../../rest/Subscription';
import { Initialization } from '../Base/Initialization';
import { l } from '../../strings/Strings';
import { $$, Dom } from '../../utils/Dom';
import {
  analyticsActionCauseList, IAnalyticsSearchAlertsFollowDocumentMeta, IAnalyticsActionCause
} from '../Analytics/AnalyticsActionListMeta';
import { QueryUtils } from '../../utils/QueryUtils';
import _ = require('underscore');


export interface IFollowItemOptions {
  watchedFields?: IFieldOption[];
  modifiedDateField?: string;
}

/**
 * The FollowItem component renders a widget that the end user can click to follow a particular item (document). A user
 * following an item receives email notifications when the item changes.
 *
 * **Note:**
 * > A {@link SearchAlerts} component must be present in the page for this component to work. It is also necessary to
 * > meet certain requirements to be able to use this component (see
 * > [Deploying Search Alerts on a Coveo JS Search Page](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=248)).
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 */
export class FollowItem extends Component {
  static ID = 'FollowItem';

  static fields = [
    'urihash'
  ];

  /**
   * The options for the follow item component
   * @componentOptions
   */
  static options: IFollowItemOptions = {

    /**
     * Specifies the {@link ISubscriptionItemRequest.watchedFields} to use when sending the
     * {@link ISubscriptionItemRequest}.
     *
     * Default value is `undefined`.
     */
    watchedFields: ComponentOptions.buildFieldsOption(),

    /**
     * Specifies the {@link ISubscriptionItemRequest.modifiedDateField} to use when sending the
     * {@link ISubscriptionItemRequest}.
     *
     * Default value is `undefined`.
     */
    modifiedDateField: ComponentOptions.buildStringOption(),
  };

  private container: Dom;
  private text: Dom;
  private subscription: ISubscription;

  /**
   * Creates a new FollowItem component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the FollowItem component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time)
   * @param result The result to associate the component with.
   */
  constructor(public element: HTMLElement,
    public options?: IFollowItemOptions,
    public bindings?: IResultsComponentBindings,
    public result?: IQueryResult) {

    super(element, FollowItem.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, FollowItem, options);

    Assert.exists(this.result);

    this.container = $$(this.element);
    this.text = $$('span');
    this.container.append(this.text.el);
    this.container.on('click', () => this.toggleFollow());

    this.bind.onRootElement(SearchAlertsEvents.searchAlertsDeleted, (args: ISearchAlertsEventArgs) => this.handleSubscriptionDeleted(args));
    this.bind.onRootElement(SearchAlertsEvents.searchAlertsCreated, (args: ISearchAlertsEventArgs) => this.handleSubscriptionCreated(args));

    this.container.addClass('coveo-follow-item-loading');

    this.updateIsFollowed();
  }

  public setFollowed(subscription: ISubscription) {
    this.container.removeClass('coveo-follow-item-loading');
    this.subscription = subscription;
    this.container.addClass('coveo-follow-item-followed');
    this.text.text(l('SearchAlerts_unFollowing'));
  }

  public setNotFollowed() {
    this.container.removeClass('coveo-follow-item-loading');
    this.subscription = <ISubscription>FollowItem.buildFollowRequest(this.getId(), this.result.title, this.options);
    this.container.removeClass('coveo-follow-item-followed');
    this.text.text(l('SearchAlerts_follow'));
  }

  /**
   * Follows the item if not already following it. Stops following the item otherwise.
   *
   * Also logs the appropriate event in the usage analytics (either `searchAlertsFollowDocument` or
   * `searchAlertsUnfollowDocument`).
   */
  public toggleFollow() {
    if (!this.container.hasClass('coveo-follow-item-loading')) {
      this.container.removeClass('coveo-follow-item-followed');
      this.container.addClass('coveo-follow-item-loading');
      if (this.subscription.id) {
        this.logAnalyticsEvent(analyticsActionCauseList.searchAlertsUnfollowDocument);
        this.queryController.getEndpoint()
          .deleteSubscription(this.subscription)
          .then(() => {
            let eventArgs: ISearchAlertsEventArgs = {
              subscription: this.subscription,
              dom: this.element
            };
            $$(this.root).trigger(SearchAlertsEvents.searchAlertsDeleted, eventArgs);
          })
          .catch(() => {
            this.container.removeClass('coveo-follow-item-loading');
            let eventArgs: ISearchAlertsFailEventArgs = {
              dom: this.element
            };
            $$(this.root).trigger(SearchAlertsEvents.searchAlertsFail, eventArgs);
          });
      } else {
        this.logAnalyticsEvent(analyticsActionCauseList.searchAlertsFollowDocument);
        this.queryController.getEndpoint().follow(this.subscription)
          .then((subscription: ISubscription) => {
            let eventArgs: ISearchAlertsEventArgs = {
              subscription: subscription,
              dom: this.element
            };
            $$(this.root).trigger(SearchAlertsEvents.searchAlertsCreated, eventArgs);
          })
          .catch(() => {
            this.container.removeClass('coveo-follow-item-loading');
            let eventArgs: ISearchAlertsFailEventArgs = {
              dom: this.element
            };
            $$(this.root).trigger(SearchAlertsEvents.searchAlertsFail, eventArgs);
          });
      }
    }
  }

  protected getText(): string {
    return this.text.text();
  }

  private updateIsFollowed() {
    this.queryController.getEndpoint()
      .listSubscriptions()
      .then((subscriptions: ISubscription[]) => {
        if (_.isArray(subscriptions)) {
          let subscription: ISubscription = _.find(subscriptions, (subscription: ISubscription) => {
            let typeConfig = <ISubscriptionItemRequest>subscription.typeConfig;
            return typeConfig && typeConfig.id != null && typeConfig.id == this.getId();
          });
          if (subscription != null) {
            this.setFollowed(subscription);
          } else {
            this.setNotFollowed();
          }
        } else {
          this.remove();
        }
      })
      .catch(() => {
        this.remove();
      });
  }

  private handleSubscriptionDeleted(args: ISearchAlertsEventArgs) {
    if (args.subscription && args.subscription.type == SUBSCRIPTION_TYPE.followDocument) {
      let typeConfig = <ISubscriptionItemRequest>args.subscription.typeConfig;
      if (typeConfig.id == this.getId()) {
        this.setNotFollowed();
      }
    }
  }

  private handleSubscriptionCreated(args: ISearchAlertsEventArgs) {
    if (args.subscription && args.subscription.type == SUBSCRIPTION_TYPE.followDocument) {
      let typeConfig = <ISubscriptionItemRequest>args.subscription.typeConfig;
      if (typeConfig.id == this.getId()) {
        this.setFollowed(args.subscription);
      }
    }
  }

  private remove() {
    this.element.parentElement && this.element.parentElement.removeChild(this.element);
  }

  private getId() {
    return this.result.raw.sysurihash || this.result.raw.urihash;
  }

  private static buildFollowRequest(id: string, title: string, options: IFollowItemOptions): ISubscriptionRequest {
    let typeCofig: ISubscriptionItemRequest = {
      id: id,
      title: title
    };

    if (options.modifiedDateField) {
      typeCofig.modifiedDateField = options.modifiedDateField;
    }

    if (options.watchedFields) {
      typeCofig.watchedFields = <string[]>options.watchedFields;
    }

    return {
      type: SUBSCRIPTION_TYPE.followDocument,
      typeConfig: typeCofig,
      name: title
    };
  }

  private logAnalyticsEvent(type: IAnalyticsActionCause) {
    this.usageAnalytics.logCustomEvent<IAnalyticsSearchAlertsFollowDocumentMeta>(type, {
      author: QueryUtils.getAuthor(this.result),
      documentLanguage: QueryUtils.getLanguage(this.result),
      documentSource: QueryUtils.getSource(this.result),
      documentTitle: this.result.title,
      contentIDValue: QueryUtils.getUniqueId(this.result).fieldValue,
      contentIDKey: QueryUtils.getUniqueId(this.result).fieldUsed
    }, this.element);
  }
}

Initialization.registerAutoCreateComponent(FollowItem);
