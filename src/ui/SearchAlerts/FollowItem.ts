


module Coveo {
  export interface FollowItemOptions {
    watchedFields?: string[];
    modifiedDateField?: string;
  }

  export class FollowItem extends Component {
    static ID = 'FollowItem';

    static fields = [
      'urihash'
    ];

    static options: FollowItemOptions = {
      watchedFields: ComponentOptions.buildFieldsOption(),
      modifiedDateField: ComponentOptions.buildStringOption(),
    };

    private container: JQuery;
    private text: JQuery;
    private subscription: ISubscription;

    constructor(public element: HTMLElement,
      public options?: FollowItemOptions,
      public bindings?: IResultsComponentBindings,
      public result?: IQueryResult) {

      super(element, FollowItem.ID, bindings);

      this.options = ComponentOptions.initComponentOptions(element, FollowItem, options);

      Assert.exists(this.result);

      this.container = $(this.element);
      this.text = $('<span />');
      this.container.append(this.text);
      this.container.on('click', $.proxy(this.toggleFollow, this));

      $(this.root).on(SearchAlertEvents.searchAlertDeleted, $.proxy(this.handleSubscriptionDeleted, this));
      $(this.root).on(SearchAlertEvents.searchAlertCreated, $.proxy(this.handleSubscriptionCreated, this));

      this.container.addClass("coveo-follow-item-loading");

      this.updateIsFollowed();
    }

    private updateIsFollowed() {
      this.queryController.getEndpoint()
        .listSubscriptions()
        .then((subscriptions: ISubscription[]) => {
          var subscription: ISubscription = _.find(subscriptions, (subscription: ISubscription) => {
            var typeConfig = <ISubscriptionItemRequest>subscription.typeConfig;
            return typeConfig.id != null && typeConfig.id == this.getId();
          });
          if (subscription != null) {
            this.setFollowed(subscription);
          } else {
            this.setNotFollowed();
          }
        })
        .catch(() => {
          this.remove();
        })
    }

    public setFollowed(subscription: ISubscription) {
      this.container.removeClass("coveo-follow-item-loading");
      this.subscription = subscription;
      this.container.addClass("coveo-follow-item-followed");
      this.text.text(l('SearchAlerts_unFollowing'));
    }

    public setNotFollowed() {
      this.container.removeClass("coveo-follow-item-loading");
      this.subscription = <ISubscription>FollowItem.buildFollowRequest(this.getId(), this.result.title, this.options);
      this.container.removeClass("coveo-follow-item-followed");
      this.text.text(l('SearchAlerts_follow'));
    }

    private toggleFollow() {
      if (!this.container.hasClass("coveo-follow-item-loading")) {
        this.container.addClass("coveo-follow-item-loading");
        if (this.subscription.id) {
          this.queryController.getEndpoint()
            .deleteSubscription(this.subscription)
            .then(() => {
              var eventArgs: SearchAlertEventArgs = {
                subscription: this.subscription,
                dom: this.element
              };
              $(this.root).trigger(SearchAlertEvents.searchAlertDeleted, eventArgs);
            })
            .catch(() => {
              this.container.removeClass("coveo-follow-item-loading");
              var eventArgs: SearchAlertsFailEventArgs = {
                dom: this.element
              };
              $(this.root).trigger(SearchAlertEvents.SearchAlertsFail, eventArgs);
            })
        } else {
          this.queryController.getEndpoint().follow(this.subscription)
            .then((subscription: ISubscription) => {
              var eventArgs: SearchAlertEventArgs = {
                subscription: subscription,
                dom: this.element
              };
              $(this.root).trigger(SearchAlertEvents.searchAlertCreated, eventArgs);
            })
            .catch(() => {
              this.container.removeClass("coveo-follow-item-loading");
              var eventArgs: SearchAlertsFailEventArgs = {
                dom: this.element
              };
              $(this.root).trigger(SearchAlertEvents.SearchAlertsFail, eventArgs);
            })
        }
      }
    }

    private handleSubscriptionDeleted(e: JQueryEventObject, args: SearchAlertEventArgs) {
      if (args.subscription.type == SubscriptionType.followDocument) {
        var typeConfig = <ISubscriptionItemRequest>args.subscription.typeConfig;
        if (typeConfig.id == this.getId()) {
          this.setNotFollowed();
        }
      }
    }

    private handleSubscriptionCreated(e: JQueryEventObject, args: SearchAlertEventArgs) {
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

    private static buildFollowRequest(id: string, title: string, options: FollowItemOptions): ISubscriptionRequest {
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
}
