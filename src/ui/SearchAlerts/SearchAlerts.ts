import { Component } from '../Base/Component';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { SearchAlertsMessage } from './SearchAlertsMessage';
import { SettingsEvents } from '../../events/SettingsEvents';
import { QueryEvents } from '../../events/QueryEvents';
import { Assert } from '../../misc/Assert';
import { IQuery } from '../../rest/Query';
import { AjaxError } from '../../rest/AjaxError';
import { ISettingsPopulateMenuArgs } from '../Settings/Settings';
import { SearchAlertsEvents, ISearchAlertsEventArgs, ISearchAlertsFailEventArgs } from '../../events/SearchAlertEvents';
import {
  ISubscription,
  ISubscriptionItemRequest,
  SUBSCRIPTION_TYPE,
  ISubscriptionRequest,
  ISubscriptionQueryRequest
} from '../../rest/Subscription';
import { Initialization } from '../Base/Initialization';
import { l } from '../../strings/Strings';
import { $$, Dom } from '../../utils/Dom';
import { ModalBox as ModalBoxModule } from '../../ExternalModulesShim';
import {
  analyticsActionCauseList,
  IAnalyticsSearchAlertsUpdateMeta,
  IAnalyticsSearchAlertsMeta,
  IAnalyticsActionCause
} from '../Analytics/AnalyticsActionListMeta';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import ModalBox = Coveo.ModalBox.ModalBox;
import { Dropdown } from '../FormWidgets/Dropdown';
import { SVGIcons } from '../../utils/SVGIcons';
import { get } from '../Base/RegisteredNamedMethods';
import { SearchInterface } from '../SearchInterface/SearchInterface';

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

  static doExport = () => {
    exportGlobally({
      SearchAlerts: SearchAlerts,
      SearchAlertsMessage: SearchAlertsMessage
    });
  };

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
     * Default value is `2000`. Minimum value is `0`.
     */
    messageCloseDelay: ComponentOptions.buildNumberOption({ defaultValue: 2000, min: 0, depend: 'enableMessage' })
  };

  private modal: ModalBox;

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
  constructor(
    public element: HTMLElement,
    public options: ISearchAlertsOptions,
    bindings?: IComponentBindings,
    private ModalBox = ModalBoxModule
  ) {
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
            onClose: () => this.close(),
            svgIcon: SVGIcons.icons.dropdownFollowQuery,
            svgIconClassName: 'coveo-subscriptions-panel-svg'
          });
        }
      });
    } else {
      this.logger.warn('Logged in as guest user, search alerts are therefore not available.');
    }

    let once = false;

    this.bind.onRootElement(QueryEvents.querySuccess, () => {
      if (!once) {
        once = true;
        this.queryController
          .getEndpoint()
          .listSubscriptions()
          .then(() => {
            this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
              if (this.options.enableFollowQuery) {
                args.menuData.push({
                  text: l('SearchAlerts_followQuery'),
                  className: 'coveo-follow-query',
                  tooltip: l('FollowQueryDescription'),
                  onOpen: () => this.followQuery(),
                  onClose: () => {},
                  svgIcon: SVGIcons.icons.dropdownFollowQuery,
                  svgIconClassName: 'coveo-follow-query-svg'
                });
              }
            });
          })
          .catch((e: AjaxError) => {
            // Trap 403 error, as the listSubscription call is called on every page initialization
            // to check for current subscriptions. By default, the search alert service is not enabled for most organization
            // Don't want to pollute the console with un-needed noise and confusion
            if (e.status != 403) {
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
    const queryBuilder = this.queryController.createQueryBuilder({});
    const request = this.buildFollowQueryRequest(queryBuilder.build(), this.options);

    this.usageAnalytics.logCustomEvent<IAnalyticsSearchAlertsMeta>(
      analyticsActionCauseList.searchAlertsFollowQuery,
      {
        subscription: request.name
      },
      this.element
    );

    this.queryController
      .getEndpoint()
      .follow(request)
      .then((subscription: ISubscription) => {
        if (subscription) {
          const eventArgs: ISearchAlertsEventArgs = {
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
    const title = $$('div');

    const titleInfo = $$(
      'div',
      {
        className: 'coveo-subscriptions-panel-title'
      },
      l('SearchAlerts_Panel')
    );

    title.append(titleInfo.el);

    const container = $$('div');
    const table = $$('table', {
      className: 'coveo-subscriptions-panel-content',
      cellspacing: 0
    });
    container.append(table.el);
    const tableHead = $$('thead');
    table.append(tableHead.el);

    const rowHead = $$('tr');
    tableHead.append(rowHead.el);

    const headerType = $$(
      'th',
      {
        className: 'coveo-subscriptions-panel-content-type'
      },
      l('SearchAlerts_Type')
    );
    const headerContent = $$('th', null, l('SearchAlerts_Content'));
    const headerFrequency = $$('th', null, l('SearchAlerts_Frequency'));
    const headerActions = $$(
      'th',
      {
        className: 'coveo-subscriptions-panel-content-actions'
      },
      l('SearchAlerts_Actions')
    );

    rowHead.append(headerType.el);
    rowHead.append(headerContent.el);
    rowHead.append(headerFrequency.el);
    rowHead.append(headerActions.el);

    const tableBodySpacer = $$(
      'tbody',
      {
        className: 'coveo-subscriptions-panel-spacer'
      },
      $$(
        'tr',
        null,
        $$('td', {
          colsspan: 3
        })
      )
    );

    table.append(tableBodySpacer.el);

    const tableBodySubscriptions = $$(
      'tbody',
      {
        className: 'coveo-subscriptions-panel-subscriptions'
      },
      $$(
        'tr',
        {
          className: 'coveo-subscriptions-panel-no-subscriptions'
        },
        $$(
          'td',
          {
            colspan: 3
          },
          l('SearchAlerts_PanelNoSearchAlerts')
        )
      )
    );

    table.append(tableBodySubscriptions.el);
    let sizeModForModalBox = 'big';

    return this.queryController
      .getEndpoint()
      .listSubscriptions()
      .then((subscriptions: ISubscription[]) => {
        _.each(subscriptions, subscription => {
          this.addSearchAlert(subscription, container);
        });
      })
      .catch(() => {
        sizeModForModalBox = 'small';
        container.empty();
        container.append(this.getFailureMessage().el);
      })
      .finally(() => {
        this.modal = this.ModalBox.open(container.el, {
          title: title.el.outerHTML,
          className: 'coveo-subscriptions-panel',
          sizeMod: sizeModForModalBox
        });
      });
  }

  private getFailureMessage(): Dom {
    return $$(
      'div',
      {
        className: 'coveo-subscriptions-panel-fail'
      },
      l('SearchAlerts_Fail')
    );
  }

  private handleSearchAlertsFail() {
    if (this.modal != null) {
      const modalBody = $$(this.modal.wrapper).find('.coveo-modal-body');
      $$(modalBody).empty();
      $$(modalBody).append(this.getFailureMessage().el);
    }
  }

  private close() {
    if (this.modal) {
      this.modal.close();
      this.modal = null;
    }
  }

  private addSearchAlert(subscription: ISubscription, container: Dom) {
    const frequencies = [
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
      if (subscription.name == '<empty>') {
        context = '&lt;empty&gt;';
      } else {
        const textExtracted = $$('div').el;
        textExtracted.innerHTML = subscription.name;
        context = $$(textExtracted).text();
      }
    } else if (subscription.type == SUBSCRIPTION_TYPE.followQuery) {
      const typeConfig = <ISubscriptionQueryRequest>subscription.typeConfig;
      context = _.escape(typeConfig.query.q) || l('EmptyQuery');
    } else {
      const typeConfig = <ISubscriptionItemRequest>subscription.typeConfig;
      context = _.escape(typeConfig.title || typeConfig.id);
    }

    const row = $$('tr', {
      className: 'coveo-subscriptions-panel-subscription'
    });

    const pluckFrequenciesValues = _.pluck(frequencies, 'value');
    const valueToLabel = (valueMappedToLabel: string) => _.findWhere(frequencies, { value: valueMappedToLabel }).label;

    const buildDropdown = () => {
      return new Dropdown(
        (dropdownInstance: Dropdown) => {
          this.usageAnalytics.logCustomEvent<IAnalyticsSearchAlertsUpdateMeta>(
            analyticsActionCauseList.searchAlertsUpdateSubscription,
            {
              subscription: context,
              frequency: dropdownInstance.getValue()
            },
            this.element
          );
          this.updateAndSyncSearchAlert(subscription);
        },
        pluckFrequenciesValues,
        valueToLabel
      ).build();
    };

    const contentTypeElement = $$(
      'td',
      {
        className: 'coveo-subscriptions-panel-content-type'
      },
      l('SearchAlerts_Type_' + subscription.type)
    );

    const contextElement = $$('td', {
      className: 'coveo-subscriptions-panel-context',
      title: context
    });
    contextElement.setHtml(context);

    const frequencyElement = $$(
      'td',
      null,
      $$(
        'div',
        {
          className: 'coveo-subscriptions-panel-frequency'
        },
        buildDropdown()
      )
    );

    const contentActionsElement = $$(
      'td',
      {
        className: 'coveo-subscriptions-panel-content-actions'
      },
      null,
      $$(
        'div',
        {
          className: 'coveo-subscriptions-panel-action coveo-subscriptions-panel-action-unfollow'
        },
        l('SearchAlerts_unFollowing')
      ),
      $$(
        'div',
        {
          className: 'coveo-subscriptions-panel-action coveo-subscriptions-panel-action-follow'
        },
        l('SearchAlerts_follow')
      )
    );

    row.append(contentTypeElement.el);
    row.append(contextElement.el);
    row.append(frequencyElement.el);
    row.append(contentActionsElement.el);

    const noSearchAlerts = container.find('.coveo-subscriptions-panel-no-subscriptions');

    row.insertBefore(noSearchAlerts);

    const frequencyInput = <HTMLSelectElement>frequencyElement.find('select');
    frequencyInput.value = subscription.frequency;

    $$(row.find('.coveo-subscriptions-panel-action-unfollow')).on('click', () => {
      row.addClass('coveo-subscription-unfollowed');

      this.queryController
        .getEndpoint()
        .deleteSubscription(subscription)
        .then(() => {
          if (subscription.type == SUBSCRIPTION_TYPE.followDocument) {
            this.logAnalyticsEvent(analyticsActionCauseList.searchAlertsUnfollowDocument, subscription);
          } else if (subscription.type == SUBSCRIPTION_TYPE.followQuery) {
            this.logAnalyticsEvent(analyticsActionCauseList.searchAlertsUnfollowQuery, subscription);
          }
          delete subscription.id;

          const eventArgs: ISearchAlertsEventArgs = { subscription: subscription };
          $$(this.root).trigger(SearchAlertsEvents.searchAlertsDeleted, eventArgs);
        })
        .catch(() => {
          this.handleSearchAlertsFail();
        });
    });

    $$(row.find('.coveo-subscriptions-panel-action-follow')).on('click', () => {
      row.removeClass('coveo-subscription-unfollowed');

      this.queryController
        .getEndpoint()
        .follow(subscription)
        .then(updatedSearchAlert => {
          if (subscription.type == SUBSCRIPTION_TYPE.followDocument) {
            this.logAnalyticsEvent(analyticsActionCauseList.searchAlertsFollowDocument, subscription);
          } else if (subscription.type == SUBSCRIPTION_TYPE.followQuery) {
            this.logAnalyticsEvent(analyticsActionCauseList.searchAlertsFollowQuery, subscription);
          }
          subscription.id = updatedSearchAlert.id;
          const eventArgs: ISearchAlertsEventArgs = { subscription: subscription };
          $$(this.root).trigger(SearchAlertsEvents.searchAlertsCreated, eventArgs);
        })
        .catch(() => {
          this.handleSearchAlertsFail();
        });
    });
  }

  private updateAndSyncSearchAlert(subscription: ISubscription) {
    this.queryController
      .getEndpoint()
      .updateSubscription(subscription)
      .then((updated: ISubscription) => _.extend(subscription, updated))
      .catch(() => {
        this.handleSearchAlertsFail();
      });
  }

  private triggerSearchAlertsFail() {
    const eventArgs: ISearchAlertsFailEventArgs = {
      dom: this.findQueryBoxDom()
    };
    $$(this.root).trigger(SearchAlertsEvents.searchAlertsFail, eventArgs);
  }

  protected findQueryBoxDom(): HTMLElement {
    let dom: HTMLElement;
    const components = this.searchInterface.getComponents<Component>('Querybox');
    if (components && components.length > 0) {
      dom = _.first(components).element;
    } else {
      const components = this.searchInterface.getComponents<Component>('Omnibox');
      if (components && components.length > 0) {
        dom = _.first(components).element;
      }
    }
    return dom;
  }

  private buildFollowQueryRequest(query: IQuery, options: ISearchAlertsOptions): ISubscriptionRequest {
    const typeConfig: ISubscriptionQueryRequest = {
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
    this.usageAnalytics.logCustomEvent<IAnalyticsSearchAlertsMeta>(
      cause,
      {
        subscription: subscription.name
      },
      this.element
    );
  }

  static create(element: HTMLElement, options?: ISearchAlertsOptions, root?: HTMLElement): SearchAlerts {
    Assert.exists(element);
    return new SearchAlerts(element, options, (<SearchInterface>get(root, SearchInterface)).getBindings());
  }
}

Initialization.registerAutoCreateComponent(SearchAlerts);
