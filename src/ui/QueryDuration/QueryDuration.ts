import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {ComponentOptions} from '../Base/ComponentOptions';
import {QueryEvents, IQuerySuccessEventArgs} from '../../events/QueryEvents';
import {Assert} from '../../misc/Assert';
import {$$} from '../../utils/Dom';
import {l} from '../../strings/Strings';
import {Initialization} from '../Base/Initialization';

declare const Globalize;

export interface IQueryDurationOptions {
}

/**
 * This component is used to display the time it took to execute the query.
 * When a {@link QueryEvents.querySuccess} event is called, it shows itself and displays
 * the global duration, the index duration, the proxy duration, and the client duration in a tooltip.<br/>
 * If a {@link QueryEvents.queryError} event is called, it hides.
 */
export class QueryDuration extends Component {
  static ID = 'QueryDuration';
  /**
   * The options for the component
   * @componentOptions
   */
  static options: IQueryDurationOptions = {
  }

  private textContainer: HTMLElement;

  /**
   * Create a new QueryDuration component.
   * @param element
   * @param options
   * @param bindings
   */
  constructor(public element: HTMLElement, public options?: IQueryDurationOptions, bindings?: IComponentBindings) {
    super(element, QueryDuration.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, QueryDuration, options);

    this.bind.onRootElement(QueryEvents.querySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data))
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
