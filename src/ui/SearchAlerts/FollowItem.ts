import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IResultsComponentBindings} from '../Base/ResultsComponentBindings';
import {IQueryResult} from '../../rest/QueryResult';
import {Assert} from '../../misc/Assert';
import {SearchAlertsEvents, ISearchAlertsEventArgs, ISearchAlertsFailEventArgs} from '../../events/SearchAlertEvents';
import {ISubscription, ISubscriptionItemRequest, SUBSCRIPTION_TYPE, ISubscriptionRequest} from '../../rest/Subscription';
import {Initialization} from '../Base/Initialization';
import {l} from '../../strings/Strings';
import {$$, Dom} from '../../utils/Dom';


export interface IFollowItemOptions {
  watchedFields?: string[];
  modifiedDateField?: string;
}

/**
 * This component allows the user to follow a particular result. 
 * By following a result, the user will receive emails informing him when the result has changed.
 * A @link{SearchAlerts} component must be present in the page for this component to work.
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
     * Specifies the watchedFields to use when sending the follow query request.
     * This default value is undefined.
     */
    watchedFields: ComponentOptions.buildFieldsOption(),
    /**
     * Specifies the modifiedDateField to use when sending the follow query request.
     * This default value is undefined.
     */
    modifiedDateField: ComponentOptions.buildStringOption(),
  };

  private container: Dom;
  private text: Dom;
  private subscription: ISubscription;

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
    this.container.on('click', () => { this.toggleFollow() });

    this.bind.onRootElement(SearchAlertsEvents.searchAlertsDeleted, (args: ISearchAlertsEventArgs) => { this.handleSubscriptionDeleted(args) });
    this.bind.onRootElement(SearchAlertsEvents.searchAlertsCreated, (args: ISearchAlertsEventArgs) => { this.handleSubscriptionCreated(args) });

    this.container.addClass('coveo-follow-item-loading');

    this.updateIsFollowed();
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
      })
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

  protected getText(): string {
    return this.text.text();
  }

  /**
   * Follows the result if it was not followed and stops following the result if it was followed.
   */
  public toggleFollow() {
    if (!this.container.hasClass('coveo-follow-item-loading')) {
      this.container.addClass('coveo-follow-item-loading');
      if (this.subscription.id) {
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
          })
      } else {
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
          })
      }
    }
  }

  private handleSubscriptionDeleted(args: ISearchAlertsEventArgs) {
    if (args.subscription.type == SUBSCRIPTION_TYPE.followDocument) {
      let typeConfig = <ISubscriptionItemRequest>args.subscription.typeConfig;
      if (typeConfig.id == this.getId()) {
        this.setNotFollowed();
      }
    }
  }

  private handleSubscriptionCreated(args: ISearchAlertsEventArgs) {
    if (args.subscription.type == SUBSCRIPTION_TYPE.followDocument) {
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
    }

    if (options.modifiedDateField) {
      typeCofig.modifiedDateField = options.modifiedDateField;
    }

    if (options.watchedFields) {
      typeCofig.watchedFields = options.watchedFields;
    }

    return {
      type: SUBSCRIPTION_TYPE.followDocument,
      typeConfig: typeCofig
    }
  }
}

Initialization.registerAutoCreateComponent(FollowItem);
