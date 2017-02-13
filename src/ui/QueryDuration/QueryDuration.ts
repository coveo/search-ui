import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { QueryEvents, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { Assert } from '../../misc/Assert';
import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import { Initialization } from '../Base/Initialization';
import Globalize = require('globalize');

export interface IQueryDurationOptions {
}

/**
 * The QueryDuration component displays the duration of the last query execution.
 *
 * When a {@link QueryEvents.querySuccess} event is triggered, the QueryDuration component becomes visible. It also
 * displays the global duration, the index duration, the proxy duration, and the client duration in a single tooltip.
 *
 * If a {@link QueryEvents.queryError} event is triggered, the QueryDuration component becomes hidden.
 */
export class QueryDuration extends Component {
  static ID = 'QueryDuration';

  static options: IQueryDurationOptions = {
  };

  private textContainer: HTMLElement;

  /**
   * Creates a new QueryDuration component.
   * Binds handlers on the {@link QueryEvents.querySuccess} and {@link QueryEvents.queryError} events.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the QueryDuration component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IQueryDurationOptions, bindings?: IComponentBindings) {
    super(element, QueryDuration.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, QueryDuration, options);

    this.bind.onRootElement(QueryEvents.querySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data));
    this.bind.onRootElement(QueryEvents.queryError, () => $$(this.element).hide());
    this.element.style.display = 'none';
    this.textContainer = $$('span').el;
    this.element.appendChild(this.textContainer);
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    if (!this.disabled && data.results.results.length > 0) {
      Assert.exists(data);

      let tooltip = [
        l('Duration', this.formatQueryDuration(data.results.duration)),
        l('IndexDuration', this.formatQueryDuration(data.results.indexDuration)),
        l('ProxyDuration', this.formatQueryDuration(data.results.proxyDuration)),
        l('ClientDuration', this.formatQueryDuration(data.results.clientDuration))
      ].join('\n');

      this.textContainer.textContent = this.formatQueryDuration(data.results.duration);
      this.element.setAttribute('title', tooltip);
      this.element.style.display = 'inline';
    } else {
      this.element.style.display = 'none';
    }
  }

  private formatQueryDuration(durationInMillis: number): string {
    if (durationInMillis == undefined) {
      return l('Unavailable');
    } else {
      var seconds = Math.max(durationInMillis / 1000, 0.01);
      if (String['locale'] === 'en') {
        return l('Seconds', Globalize.format(seconds, 'n2'), seconds, true);
      } else {
        return l('Seconds', Globalize.format(seconds, 'n2'), seconds);
      }
    }
  }
}
Initialization.registerAutoCreateComponent(QueryDuration);
