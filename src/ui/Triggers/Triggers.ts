import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Assert } from '../../misc/Assert';
import { QueryEvents, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { ITriggerNotify, ITriggerExecute, ITriggerRedirect, ITriggerQuery, ITrigger } from '../../rest/Trigger';
import { $$ } from '../../utils/Dom';
import {
  IAnalyticsTriggerNotify,
  analyticsActionCauseList,
  IAnalyticsTriggerRedirect,
  IAnalyticsTriggerQuery,
  IAnalyticsTriggerExecute
} from '../Analytics/AnalyticsActionListMeta';
import { QueryStateModel } from '../../models/QueryStateModel';
import { Initialization } from '../Base/Initialization';
import { object, map } from 'underscore';
import { exportGlobally } from '../../GlobalExports';

import 'styling/_Triggers';
import { IQuery } from '../../rest/Query';
import { Utils } from '../../UtilsModules';

export interface ITriggersOptions {}

function isTriggerNotify(trigger: ITrigger<any>): trigger is ITriggerNotify {
  return trigger.type === 'notify';
}

function isTriggerRedirect(trigger: ITrigger<any>): trigger is ITriggerRedirect {
  return trigger.type === 'redirect';
}

function isTriggerQuery(trigger: ITrigger<any>): trigger is ITriggerQuery {
  return trigger.type === 'query';
}

function isTriggerExecute(trigger: ITrigger<any>): trigger is ITriggerExecute {
  return trigger.type === 'execute';
}

/**
 * The Triggers component enables the use of triggers (`notify`, `execute`, `query`, `redirect`) generated by the Coveo
 * Search API (see [Trigger](https://docs.coveo.com/en/1458/)) in the query pipeline (see
 * [Managing the Query Pipeline](https://docs.coveo.com/en/1450/)).
 *
 * Note: adding the Triggers component gives query pipeline administrators the power to influence users' search experience.
 * Bad actors will be able to perform XSS attacks, or redirect users to dangerous sites. Make sure only individuals you trust
 * have query pipeline edit privileges.
 */
export class Triggers extends Component {
  static ID = 'Triggers';
  static options: ITriggersOptions = {};

  static doExport = () => {
    exportGlobally({
      Triggers: Triggers
    });
  };

  /**
   * The list of notifications returned by the Search API for the current query (via `notify` triggers).
   *
   * The Triggers component automatically renders this list visually.
   */
  public notifications: string[];

  /**
   * Creates a new Triggers component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the Triggers component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param _window The window on which to execute the triggers.
   */
  constructor(
    public element: HTMLElement,
    public options?: ITriggersOptions,
    public bindings?: IComponentBindings,
    public _window?: Window
  ) {
    super(element, Triggers.ID, bindings);

    this._window = this._window || window;
    this.options = ComponentOptions.initComponentOptions(element, Triggers, options);
    Assert.exists(element);
    Assert.exists(this.options);

    this.notifications = [];

    this.bind.onRootElement(QueryEvents.querySuccess, this.handleProcessNewQueryResults);
  }

  private handleProcessNewQueryResults(data: IQuerySuccessEventArgs) {
    Assert.exists(data);
    Assert.exists(data.results);

    $$(this.element).empty();
    this.notifications = [];

    if (Utils.isNullOrUndefined(data.results.triggers)) {
      $$(this.element).removeClass('coveo-visible');
      return;
    }

    const notifyTriggers: ITriggerNotify[] = [];
    let redirectTrigger: ITriggerRedirect | null = null;
    let queryTrigger: ITriggerQuery | null = null;
    let executeTrigger: ITriggerExecute | null = null;
    data.results.triggers.forEach(trigger => {
      if (isTriggerNotify(trigger)) {
        notifyTriggers.push(trigger);
      } else if (isTriggerRedirect(trigger)) {
        redirectTrigger = redirectTrigger || trigger;
      } else if (isTriggerQuery(trigger)) {
        queryTrigger = queryTrigger || trigger;
      } else if (isTriggerExecute(trigger)) {
        executeTrigger = executeTrigger || trigger;
      }
    });

    if (notifyTriggers.length) {
      this.processNotifyTriggers(notifyTriggers);
      $$(this.element).addClass('coveo-visible');
    }
    redirectTrigger && this.processRedirectTrigger(redirectTrigger);
    queryTrigger && this.processQueryTrigger(queryTrigger);
    executeTrigger && this.processExecuteTrigger(executeTrigger, data.query);
  }

  private processNotifyTriggers(triggers: ITriggerNotify[]) {
    this.usageAnalytics.logCustomEvent<IAnalyticsTriggerNotify>(
      analyticsActionCauseList.triggerNotify,
      {
        notifications: triggers.map(trigger => trigger.content)
      },
      this.element
    );

    triggers.forEach(trigger => {
      this.notifications.push(trigger.content);
      this.element.appendChild($$('div', { className: 'coveo-trigger-notify' }, trigger.content).el);
    });
  }

  private processRedirectTrigger(trigger: ITriggerRedirect) {
    this.usageAnalytics.logCustomEvent<IAnalyticsTriggerRedirect>(
      analyticsActionCauseList.triggerRedirect,
      {
        redirectedTo: trigger.content
      },
      this.element
    );

    this._window.location.replace(trigger.content);
  }

  private processQueryTrigger(trigger: ITriggerQuery) {
    this.queryStateModel.set(QueryStateModel.attributesEnum.q, trigger.content);
    this.queryController.executeQuery({
      beforeExecuteQuery: () => {
        this.usageAnalytics.logCustomEvent<IAnalyticsTriggerQuery>(
          analyticsActionCauseList.triggerQuery,
          {
            query: trigger.content
          },
          this.element
        );
      }
    });
  }

  private processExecuteTrigger(trigger: ITriggerExecute, query: IQuery) {
    try {
      let func: Function = this._window['' + trigger.content.name];
      if (typeof func === 'function') {
        let params = object(
          map(trigger.content.params, (value, index) => {
            return ['param' + (index + 1), value];
          })
        );
        params['element'] = this.element;

        this.usageAnalytics.logCustomEvent<IAnalyticsTriggerExecute>(
          analyticsActionCauseList.triggerExecute,
          {
            executions: [{ functionName: trigger.content.name, params: trigger.content.params }]
          },
          this.element
        );

        func.apply(this._window, [params]);
      } else {
        this.logger.error(`A trigger tried to call the function '${trigger.content.name}', which doesn't exist.`, this, query, trigger);
      }
    } catch (error) {
      this.logger.error(`A trigger called the function '${trigger.content.name}', which threw an error.`, this, query, trigger);
    }
  }
}

Initialization.registerAutoCreateComponent(Triggers);
