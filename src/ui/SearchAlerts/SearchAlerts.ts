import { Component } from '../Base/Component';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { SearchAlertsMessage } from './SearchAlertsMessage';
import { SettingsEvents } from '../../events/SettingsEvents';
import { QueryEvents } from '../../events/QueryEvents';
import { Assert } from '../../misc/Assert';
import { Querybox } from '../Querybox/Querybox';
import { Omnibox } from '../Omnibox/Omnibox';
import { IQuery } from '../../rest/Query';
import { AjaxError } from '../../rest/AjaxError';
import { ISettingsPopulateMenuArgs } from '../Settings/Settings';
import { SearchAlertsEvents, ISearchAlertsEventArgs, ISearchAlertsFailEventArgs } from '../../events/SearchAlertEvents';
import { ISubscription, ISubscriptionItemRequest, SUBSCRIPTION_TYPE, ISubscriptionRequest, ISubscriptionQueryRequest } from '../../rest/Subscription';
import { Initialization } from '../Base/Initialization';
import { l } from '../../strings/Strings';
import { $$, Dom } from '../../utils/Dom';
import { ModalBox } from '../../ExternalModulesShim';
import {
  analyticsActionCauseList, IAnalyticsSearchAlertsUpdateMeta, IAnalyticsSearchAlertsMeta, IAnalyticsActionCause
} from '../Analytics/AnalyticsActionListMeta';
import _ = require('underscore');

export interface ISearchAlertsOptions {
  enableManagePanel?: boolean;
  enableFollowQuery?: boolean;
  modifiedDateField?: IFieldOption;
  enableMessage?: boolean;
  messageCloseDelay?: number;
}

/**
 * The Search Alerts component renders items in the {@link Settings} menu that allow the end user to follow queries
 * and to manage search alerts. A user following a query receives email notifications when the query results change.
 *
 * **Note:**
 * > It is necessary to meet certain requirements to be able to use this component (see
 * > [Deploying Search Alerts on a Coveo JS Search Page](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=248)).
 *
 * See also the {@link FollowItem} component.
 */
export class SearchAlerts extends Component {
  static ID = 'SearchAlerts';

  /**
   * The options for the search alerts
   * @componentOptions
   */
  static options: ISearchAlertsOptions = {

    /**
     * Specifies whether to add the **Manage Alerts** item in the {@link Settings} menu to allow the end user to manage
     * search alerts.
     *
     * Clicking the **Manage Alerts** item calls the {@link SearchAlerts.openPanel} method.
     *
     * Default value is `true`.
     */
    enableManagePanel: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies whether to add the **Follow Query** item in the {@link Settings} menu to allow the end user to follow
     * the last query.
     *
     * Clicking the **Follow Query** item calls the {@link SearchAlerts.followQuery} method.
     *
     * Default value is `true`.
     */
    enableFollowQuery: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * Specifies which field to use to represent the modification date when sending the
     * {@link ISubscriptionQueryRequest}.
     *
     * Default value is `undefined`.
     */
    modifiedDateField: ComponentOptions.buildFieldOption(),

    /**
     * Specifies whether to display info and error messages when performing search alerts actions.
     *
     * If this options is `true`, the SearchAlerts constructor will automatically instantiate a
     * {@link SearchAlertsMessage} component and set it to the {@link SearchAlerts.message} attribute.
     *
     * See also {@link SearchAlerts.options.messageCloseDelay}.
     *
     * Default value is `true`.
     */
    enableMessage: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * If {@link SearchAlerts.options.enableMessage} is `true`, specifies how long to display the search alert messages
     * (in milliseconds).
     *
     * Default value is `3000`. Minimum value is `0`.
     */
    messageCloseDelay: ComponentOptions.buildNumberOption({ defaultValue: 3000, min: 0, depend: 'enableMessage' }),
  };

  private modal: Coveo.ModalBox.ModalBox;

  /**
   * A reference to a {@link SearchAlertsMessage} component that the SearchAlerts component uses to display messages.
   */
  public message: SearchAlertsMessage;

  /**
   * Creates a new SearchAlerts component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the SearchAlerts component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options: ISearchAlertsOptions, bindings?: IComponentBindings) {

    super(element, SearchAlerts.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, SearchAlerts, options);

    if (this.options.enableMessage) {
      this.message = new SearchAlertsMessage(element, { closeDelay: this.options.messageCloseDelay }, this.getBindings());
    }

    if (!this.queryController.getEndpoint().options.isGuestUser) {
      this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
        if (this.options.enableManagePanel) {
          args.menuData.push({
            text: l('SearchAlerts_Panel'),
            className: 'coveo-subscriptions-panel',
            onOpen: () => this.openPanel(),
            onClose: () => this.close()
          });
        }
      });
    }

    let once = false;

    this.bind.onRootElement(QueryEvents.querySuccess, () => {
      if (!once) {
        once = true;
        this.queryController.getEndpoint().listSubscriptions()
          .then(() => {
            this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
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
    });
  }

  /**
   * Follows the last query. The user will start receiving email notifications when the query results change.
   *
   * Also logs the `searchAlertsFollowQuery` event in the usage analytics with the name of the request as meta data.
   */
  public followQuery() {
    let queryBuilder = this.queryController.createQueryBuilder({});
    let request = this.buildFollowQueryRequest(queryBuilder.build(), this.options);

    this.usageAnalytics.logCustomEvent<IAnalyticsSearchAlertsMeta>(analyticsActionCauseList.searchAlertsFollowQuery, {
      subscription: request.name
    }, this.element);

    this.queryController.getEndpoint().follow(request)
      .then((subscription: ISubscription) => {
        if (subscription) {
          let eventArgs: ISearchAlertsEventArgs = {
            subscription: subscription,
            dom: this.findQueryBoxDom()
          };
          $$(this.root).trigger(SearchAlertsEvents.searchAlertsCreated, eventArgs);
        } else {
          this.triggerSearchAlertsFail();
        }
      })
      .catch(() => {
        this.triggerSearchAlertsFail();
      });
  }

  /**
   * Opens the **Manage Alerts** panel. This panel allows the end user to stop following queries or items. It also
   * allows the end user to specify email notification frequency for each followed query or item.
   */
  public openPanel(): Promise<ISubscription> {
    let title = $$('div');

    let close = $$('div', {
      className: 'coveo-subscriptions-panel-close'
    }, $$('span', {
      className: 'coveo-icon'
    }));

    let titleInfo = $$('div', {
      className: 'coveo-subscriptions-panel-title'
    }, l('SearchAlerts_Panel'));

    title.append(close.el);
    title.append(titleInfo.el);

    let container = $$('div');
    container.el.innerHTML = `
      <table class='coveo-subscriptions-panel-content' cellspacing='0'>
        <thead>
          <tr>
            <th class='coveo-subscriptions-panel-content-type'>${ l('SearchAlerts_Type')}</th>
            <th>${ l('SearchAlerts_Content')}</th>
            <th>${ l('SearchAlerts_Frequency')}</th>
            <th class='coveo-subscriptions-panel-content-actions'>${ l('SearchAlerts_Actions')}</th>
          </tr>
        </thead>
        <tbody class='coveo-subscriptions-panel-spacer'>
          <tr>
            <td colsspan='3'></td>
          </tr>
        </tbody>
        <tbody class='coveo-subscriptions-panel-subscriptions'>
          <tr class='coveo-subscriptions-panel-no-subscriptions'>
            <td colsspan='3'>${ l('SearchAlerts_PanelNoSearchAlerts')}</td>
          </tr>
        </tbody>
      </table>`;

    return this.queryController.getEndpoint().listSubscriptions().then((subscriptions: ISubscription[]) => {
      _.each(subscriptions, (subscription) => {
        this.addSearchAlert(subscription, container);
      });
    })
      .catch(() => {
        container.el.innerHTML = '<div class=\'coveo-subscriptions-panel-fail\'>' + l('SearchAlerts_Fail') + '</div>';
      })
      .finally(() => {
        this.modal = ModalBox.open(container.el, {
          titleClose: false,
          overlayClose: true,
          title: title.el.outerHTML,
          className: 'coveo-subscriptions-panel'
        });
        $$($$(this.modal.modalBox).find('.coveo-subscriptions-panel-close')).on('click', () => {
          this.close();
        });
      });
  }

  private handleSearchAlertsFail() {
    this.close();
    if (this.modal != null) {
      this.modal.content.innerHTML = '<div class=\'coveo-subscriptions-panel-fail\'>' + l('SearchAlerts_Fail') + '</div>';
    }
  }

  private close() {
    if (this.modal) {
      this.modal.close();
      this.modal = null;
    }
  }

  private addSearchAlert(subscription: ISubscription, container: Dom) {
    let frequencies = [
      { value: 'monthly', label: l('Monthly') },
      { value: 'daily', label: l('Daily') },
      { value: 'monday', label: l('Monday') },
      { value: 'tuesday', label: l('Tuesday') },
      { value: 'wednesday', label: l('Wednesday') },
      { value: 'thursday', label: l('Thursday') },
      { value: 'friday', label: l('Friday') },
      { value: 'saturday', label: l('Saturday') },
      { value: 'sunday', label: l('Sunday') }
    ];

    let context: string;
    if (subscription.name) {
      context = _.escape(subscription.name);
    } else if (subscription.type == SUBSCRIPTION_TYPE.followQuery) {
      let typeConfig = <ISubscriptionQueryRequest>subscription.typeConfig;
      context = _.escape(typeConfig.query.q) || l('EmptyQuery');
    } else {
      let typeConfig = <ISubscriptionItemRequest>subscription.typeConfig;
      context = _.escape(typeConfig.title || typeConfig.id);
    }

    let element = $$('tr');
    element.addClass('coveo-subscriptions-panel-subscription');
    element.el.innerHTML = `
      <td class='coveo-subscriptions-panel-content-type'>${ l('SearchAlerts_Type_' + subscription.type)}</td>
      <td>
        <div class='coveo-subscriptions-panel-context' title='${context}'>
          ${ context}
        </div>
      </td>
      <td>
        <div class='coveo-subscriptions-panel-frequency'>
          <select>
            ${ _.map(frequencies, (frequency) => `<option value='${frequency.value}'>${frequency.label}</option>`)}
          </select>
        </div>
      </td>
      <td class='coveo-subscriptions-panel-content-actions'>
        <div class='coveo-subscriptions-panel-action coveo-subscriptions-panel-action-unfollow'>${ l('SearchAlerts_unFollowing')}</div>
        <div class='coveo-subscriptions-panel-action coveo-subscriptions-panel-action-follow'>${ l('SearchAlerts_follow')}</div>
      </td>`;

    let noSearchAlerts = container.find('.coveo-subscriptions-panel-no-subscriptions');

    element.insertBefore(noSearchAlerts);

    let frequencyInput = <HTMLInputElement>element.find('.coveo-subscriptions-panel-frequency select');

    frequencyInput.value = subscription.frequency;

    $$(frequencyInput).on('change', (event) => {
      subscription.frequency = frequencyInput.value;
      this.usageAnalytics.logCustomEvent<IAnalyticsSearchAlertsUpdateMeta>(analyticsActionCauseList.searchAlertsUpdateSubscription, {
        subscription: subscription.name,
        frequency: subscription.frequency
      }, this.element);
      this.updateAndSyncSearchAlert(subscription);
    });

    $$(element.find('.coveo-subscriptions-panel-action-unfollow')).on('click', () => {
      element.addClass('coveo-subscription-unfollowed');

      this.queryController.getEndpoint()
        .deleteSubscription(subscription)
        .then(() => {
          if (subscription.type == SUBSCRIPTION_TYPE.followDocument) {
            this.logAnalyticsEvent(analyticsActionCauseList.searchAlertsUnfollowDocument, subscription);
          } else if (subscription.type == SUBSCRIPTION_TYPE.followQuery) {
            this.logAnalyticsEvent(analyticsActionCauseList.searchAlertsUnfollowQuery, subscription);
          }
          delete subscription.id;
          let eventArgs: ISearchAlertsEventArgs = { subscription: subscription };
          $$(this.root).trigger(SearchAlertsEvents.searchAlertsDeleted, eventArgs);
        })
        .catch(() => {
          this.handleSearchAlertsFail();
        });
    });

    $$(element.find('.coveo-subscriptions-panel-action-follow')).on('click', () => {
      element.removeClass('coveo-subscription-unfollowed');

      this.queryController.getEndpoint()
        .follow(subscription)
        .then((updatedSearchAlert) => {
          if (subscription.type == SUBSCRIPTION_TYPE.followDocument) {
            this.logAnalyticsEvent(analyticsActionCauseList.searchAlertsFollowDocument, subscription);
          } else if (subscription.type == SUBSCRIPTION_TYPE.followQuery) {
            this.logAnalyticsEvent(analyticsActionCauseList.searchAlertsFollowQuery, subscription);
          }
          subscription.id = updatedSearchAlert.id;
          let eventArgs: ISearchAlertsEventArgs = { subscription: subscription };
          $$(this.root).trigger(SearchAlertsEvents.searchAlertsCreated, eventArgs);
        })
        .catch(() => {
          this.handleSearchAlertsFail();
        });
    });
  }

  private updateAndSyncSearchAlert(subscription: ISubscription) {
    this.queryController.getEndpoint()
      .updateSubscription(subscription)
      .then((updated: ISubscription) => _.extend(subscription, updated))
      .catch(() => {
        this.handleSearchAlertsFail();
      });
  }

  private triggerSearchAlertsFail() {
    let eventArgs: ISearchAlertsFailEventArgs = {
      dom: this.findQueryBoxDom()
    };
    $$(this.root).trigger(SearchAlertsEvents.searchAlertsFail, eventArgs);
  }

  protected findQueryBoxDom(): HTMLElement {
    let dom: HTMLElement;
    let components = this.searchInterface.getComponents<Component>(Querybox.ID);
    if (components && components.length > 0) {
      dom = _.first(components).element;
    } else {
      let components = this.searchInterface.getComponents<Component>(Omnibox.ID);
      if (components && components.length > 0) {
        dom = _.first(components).element;
      }
    }
    return dom;
  }

  private buildFollowQueryRequest(query: IQuery, options: ISearchAlertsOptions): ISubscriptionRequest {
    let typeConfig: ISubscriptionQueryRequest = {
      query: query
    };

    if (options.modifiedDateField) {
      typeConfig.modifiedDateField = <string>options.modifiedDateField;
    }

    return {
      type: SUBSCRIPTION_TYPE.followQuery,
      typeConfig: typeConfig,
      name: this.message.getFollowQueryMessage(query.q)
    };
  }

  private logAnalyticsEvent(cause: IAnalyticsActionCause, subscription: ISubscription) {
    this.usageAnalytics.logCustomEvent<IAnalyticsSearchAlertsMeta>(cause, {
      subscription: subscription.name
    }, this.element);
  }

  static create(element: HTMLElement, options?: ISearchAlertsOptions, root?: HTMLElement): SearchAlerts {
    Assert.exists(element);
    return new SearchAlerts(element, options, root);
  }
}

Initialization.registerAutoCreateComponent(SearchAlerts);
