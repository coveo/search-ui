





module Coveo {
  export interface SearchAlertsOptions {
    enableManagePanel?: boolean;
    enableFollowQuery?: boolean;
    modifiedDateField?: string;
    enableMessage?: boolean;
    messageCloseDelay?: number;
  }

  export class SearchAlerts extends Component {
    static ID = 'SearchAlerts';
    static options: SearchAlertsOptions = {
      enableManagePanel: ComponentOptions.buildBooleanOption({ defaultValue: true }),
      enableFollowQuery: ComponentOptions.buildBooleanOption({ defaultValue: true }),
      modifiedDateField: ComponentOptions.buildStringOption(),
      enableMessage: ComponentOptions.buildBooleanOption({ defaultValue: true }),
      messageCloseDelay: ComponentOptions.buildNumberOption({ defaultValue: 3000 }),
    };

    private modal: ModalBox.ModalBox;

    constructor(public element: HTMLElement,
      public options: SearchAlertsOptions,
      bindings?: IComponentBindings) {

      super(element, SearchAlerts.ID, bindings);

      this.options = ComponentOptions.initComponentOptions(element, SearchAlerts, options);

      if (this.options.enableMessage) {
        new SearchAlertMessage(element, { closeDelay: this.options.messageCloseDelay }, this.getBindings());
      }

      var once = false;

      this.bind.onRootElement(QueryEvents.querySuccess, () => {
        if (!once) {
          once = true;
          this.queryController.getEndpoint().listSubscriptions()
            .then(() => {
              this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
                if (this.options.enableManagePanel) {
                  args.menuData.push({
                    text: l('SearchAlerts_Panel'),
                    className: 'coveo-subscriptions-panel',
                    onOpen: () => this.openPanel(),
                    onClose: () => this.close()
                  });
                }
                if (this.options.enableFollowQuery) {
                  args.menuData.push({
                    text: l('SearchAlerts_followQuery'),
                    className: 'coveo-follow-query',
                    tooltip: l('FollowQueryDescription'),
                    onOpen: () => this.followQuery(),
                    onClose: () => {
                    }
                  });
                }
              });
            })
            .catch((e: AjaxError) => {
              // Trap 503 error, as the listSubscription call is called on every page initialization
              // to check for current subscriptions. By default, the search alert service is not enabled for most organization
              // Don't want to pollute the console with un-needed noise and confusion
              if (e.status != 503) {
                throw e;
              }
            });
        }
      })
    }

    public openPanel() {
      var title = $(`<div><div class="coveo-subscriptions-panel-close"><span></span></div><div class="coveo-subscriptions-panel-title">${l("SearchAlerts_Panel")}</div>`);
      title.find('.coveo-subscriptions-panel-close').on('click', () => {
        this.close();
      });

      var container = $(`<div>
        <table class="coveo-subscriptions-panel-content" cellspacing="0">
          <thead>
            <tr>
              <th class="coveo-subscriptions-panel-content-type">${ l("SearchAlerts_Type")}</th>
              <th>${ l("SearchAlerts_Content")}</th>
              <th>${ l("SearchAlerts_Frequency")}</th>
              <th class="coveo-subscriptions-panel-content-actions">${ l("SearchAlerts_Actions")}</th>
            </tr>
          </thead>
          <tbody class="coveo-subscriptions-panel-spacer">
            <tr>
              <td colsspan="3"></td>
            </tr>
          </tbody>
          <tbody class="coveo-subscriptions-panel-subscriptions">
            <tr class="coveo-subscriptions-panel-no-subscriptions">
              <td colsspan="3">${ l("SearchAlerts_PanelNoSearchAlerts")}</td>
            </tr>
          </tbody>
        </table>
      </div>`);

      this.queryController.getEndpoint().listSubscriptions()
        .then((subscriptions: ISubscription[]) => {
          _.each(subscriptions, (subscription) => {
            this.addSearchAlert(subscription, container)
          });
        })
        .catch(() => {
          container.html('<div class="coveo-subscriptions-panel-fail">' + l("SearchAlerts_Fail") + '</div>');
        })
        .finally(() => {
          this.modal = ModalBox.open(container.get(0), {
            titleClose: true,
            overlayClose: true,
            title: $$(title.get(0)).text(),
            className: 'coveo-subscriptions-panel'
          });
        })
    }

    private handleSearchAlertsFail() {
      this.close();
      if (this.modal != null) {
        $(this.modal.content).html('<div class="coveo-subscriptions-panel-fail">' + l("SearchAlerts_Fail") + '</div>');
      }
    }

    private close() {
      if (this.modal) {
        this.modal.close();
        this.modal = null;
      }
    }

    private addSearchAlert(subscription: ISubscription, container: JQuery) {
      var frequencies = [
        { value: 'daily', label: l("Daily") },
        { value: 'monday', label: l("Monday") },
        { value: 'tuesday', label: l("Tuesday") },
        { value: 'wednesday', label: l("Wednesday") },
        { value: 'thursday', label: l("Thursday") },
        { value: 'friday', label: l("Friday") },
        { value: 'saturday', label: l("Saturday") },
        { value: 'sunday', label: l("Sunday") }
      ];

      var context: string;
      if (subscription.type == SubscriptionType.followQuery) {
        let typeConfig = <ISubscriptionQueryRequest>subscription.typeConfig;
        context = _.escape(typeConfig.query.q) || l("EmptyQuery")
      } else {
        let typeConfig = <ISubscriptionItemRequest>subscription.typeConfig;
        context = _.escape(typeConfig.title || typeConfig.id);
      }

      var element = $(`<tr class="coveo-subscriptions-panel-subscription">
        <td class="coveo-subscriptions-panel-content-type">${ l("SearchAlerts_Type_" + subscription.type)}</td>
        <td>
          <div class="coveo-subscriptions-panel-context">
            ${ context}
          </div>
        </td>
        <td>
          <div class="coveo-subscriptions-panel-frequency">
            <select>
             ${ _.map(frequencies, (frequency) => `<option value="${frequency.value}">${frequency.label}</option>`)}
            </select>
          </div>
        </td>
        <td class="coveo-subscriptions-panel-content-actions">
          <div class="coveo-subscriptions-panel-action coveo-subscriptions-panel-action-unfollow">${ l("SearchAlerts_unFollowing")}</div>
          <div class="coveo-subscriptions-panel-action coveo-subscriptions-panel-action-follow">${ l("SearchAlerts_follow")}</div>
        </td>
      </tr>`)

      var noSearchAlerts = container.find('.coveo-subscriptions-panel-no-subscriptions');

      element.insertBefore(noSearchAlerts)

      var frequencyInput = element.find('.coveo-subscriptions-panel-frequency select');

      frequencyInput.val(subscription.frequency);

      frequencyInput.on('change', (event) => {
        subscription.frequency = frequencyInput.val();
        this.updateAndSyncSearchAlert(subscription);
      })

      element.find('.coveo-subscriptions-panel-action-unfollow').click(() => {
        element.addClass('coveo-subscription-unfollowed');
        this.queryController.getEndpoint()
          .deleteSubscription(subscription)
          .then(() => {
            delete subscription.id;
            var eventArgs: SearchAlertEventArgs = { subscription: subscription };
            $(this.root).trigger(SearchAlertEvents.searchAlertDeleted, eventArgs);
          })
          .catch(() => {
            this.handleSearchAlertsFail();
          })
      });

      element.find('.coveo-subscriptions-panel-action-follow').click(() => {
        element.removeClass('coveo-subscription-unfollowed');
        this.queryController.getEndpoint()
          .follow(subscription)
          .then((updatedSearchAlert) => {
            subscription.id = updatedSearchAlert.id;
            var eventArgs: SearchAlertEventArgs = { subscription: subscription };
            $(this.root).trigger(SearchAlertEvents.searchAlertCreated, eventArgs);
          })
          .catch(() => {
            this.handleSearchAlertsFail();
          })
      });
    }

    private updateAndSyncSearchAlert(subscription: ISubscription) {
      this.queryController.getEndpoint()
        .updateSubscription(subscription)
        .then((updated: ISubscription) => $.extend(subscription, updated))
        .catch(() => {
          this.handleSearchAlertsFail();
        });
    }

    // FollowQuery
    public followQuery() {
      var queryBuilder = this.queryController.createQueryBuilder({});
      var request = SearchAlerts.buildFollowQueryRequest(queryBuilder.build(), this.options);

      this.queryController.getEndpoint().follow(request)
        .then((subscription: ISubscription) => {
          var eventArgs: SearchAlertEventArgs = {
            subscription: subscription,
            dom: this.findQueryBoxDom()
          };
          $(this.root).trigger(SearchAlertEvents.searchAlertCreated, eventArgs);
        })
        .catch(() => {
          var eventArgs: SearchAlertsFailEventArgs = {
            dom: this.findQueryBoxDom()
          };
          $(this.root).trigger(SearchAlertEvents.SearchAlertsFail, eventArgs);
        })
    }

    public findQueryBoxDom() {
      var dom: HTMLElement;
      var components = this.searchInterface.getComponents<Component>(Querybox.ID);
      if (components && components.length > 0) {
        dom = _.first(components).element;
      } else {
        var components = this.searchInterface.getComponents<Component>(Omnibox.ID);
        if (components && components.length > 0) {
          dom = _.first(components).element;
        }
      }
      return dom;
    }

    private static buildFollowQueryRequest(query: IQuery, options: SearchAlertsOptions): ISubscriptionRequest {
      var typeCofig: ISubscriptionQueryRequest = {
        query: query
      }

      if (options.modifiedDateField) {
        typeCofig.modifiedDateField = options.modifiedDateField;
      }

      return {
        type: SubscriptionType.followQuery,
        typeConfig: typeCofig
      }
    }

    static create(element: HTMLElement, options?: SearchAlertsOptions, root?: HTMLElement): SearchAlerts {
      Assert.exists(element);
      return new SearchAlerts(element, options, root);
    }
  }

  Initialization.registerAutoCreateComponent(SearchAlerts);
}
