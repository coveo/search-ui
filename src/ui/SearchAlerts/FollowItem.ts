import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IResultsComponentBindings} from '../Base/ResultsComponentBindings';
import {IQueryResult} from '../../rest/QueryResult';
import {Assert} from '../../misc/Assert';
import {SearchAlertsEvents, ISearchAlertsEventArgs, ISearchAlertsFailEventArgs} from '../../events/SearchAlertEvents';
import {ISubscription, ISubscriptionItemRequest, SubscriptionType, ISubscriptionRequest} from '../../rest/Subscription';
import {Initialization} from '../Base/Initialization';
import {l} from '../../strings/Strings';
import {$$, Dom} from '../../utils/Dom';


  export interface IFollowItemOptions {
    watchedFields?: string[];
    modifiedDateField?: string;
  }

  export class FollowItem extends Component {
    static ID = 'FollowItem';

    static fields = [
      'urihash'
    ];

    static options: IFollowItemOptions = {
      watchedFields: ComponentOptions.buildFieldsOption(),
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
      this.container.on('click', ()=>{this.toggleFollow()});

      $$(this.root).on(SearchAlertsEvents.searchAlertsDeleted, (e: Event, args: ISearchAlertsEventArgs)=>{this.handleSubscriptionDeleted(e, args)});
      $$(this.root).on(SearchAlertsEvents.searchAlertsCreated, (e: Event, args: ISearchAlertsEventArgs)=>{this.handleSubscriptionCreated(e, args)});

      this.container.addClass('coveo-follow-item-loading');

      this.updateIsFollowed();
    }

    private updateIsFollowed() {
      this.queryController.getEndpoint()
        .listSubscriptions()
        .then((subscriptions: ISubscription[]) => {
          if (_.isArray(subscriptions)){
            var subscription: ISubscription = _.find(subscriptions, (subscription: ISubscription) => {
              var typeConfig = <ISubscriptionItemRequest>subscription.typeConfig;
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
    
    public getText(): string {
      return this.text.text();
    }

    public toggleFollow() {
      if (!this.container.hasClass('coveo-follow-item-loading')) {
        this.container.addClass('coveo-follow-item-loading');
        if (this.subscription.id) {
          this.queryController.getEndpoint()
            .deleteSubscription(this.subscription)
            .then(() => {
              var eventArgs: ISearchAlertsEventArgs = {
                subscription: this.subscription,
                dom: this.element
              };
              $$(this.root).trigger(SearchAlertsEvents.searchAlertsDeleted, eventArgs);
            })
            .catch(() => {
              this.container.removeClass('coveo-follow-item-loading');
              var eventArgs: ISearchAlertsFailEventArgs = {
                dom: this.element
              };
              $$(this.root).trigger(SearchAlertsEvents.searchAlertsFail, eventArgs);
            })
        } else {
          this.queryController.getEndpoint().follow(this.subscription)
            .then((subscription: ISubscription) => {
              var eventArgs: ISearchAlertsEventArgs = {
                subscription: subscription,
                dom: this.element
              };
              $$(this.root).trigger(SearchAlertsEvents.searchAlertsCreated, eventArgs);
            })
            .catch(() => {
              this.container.removeClass('coveo-follow-item-loading');
              var eventArgs: ISearchAlertsFailEventArgs = {
                dom: this.element
              };
              $$(this.root).trigger(SearchAlertsEvents.searchAlertsFail, eventArgs);
            })
        }
      }
    }

    private handleSubscriptionDeleted(e: Event, args: ISearchAlertsEventArgs) {
      if (args.subscription.type == SubscriptionType.followDocument) {
        var typeConfig = <ISubscriptionItemRequest>args.subscription.typeConfig;
        if (typeConfig.id == this.getId()) {
          this.setNotFollowed();
        }
      }
    }

    private handleSubscriptionCreated(e: Event, args: ISearchAlertsEventArgs) {
      if (args.subscription.type == SubscriptionType.followDocument) {
        var typeConfig = <ISubscriptionItemRequest>args.subscription.typeConfig;
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
      var typeCofig: ISubscriptionItemRequest = {
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
        type: SubscriptionType.followDocument,
        typeConfig: typeCofig
      }
    }
  }

  Initialization.registerAutoCreateComponent(FollowItem);
