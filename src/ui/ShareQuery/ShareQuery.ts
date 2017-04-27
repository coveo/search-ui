import {Component} from '../Base/Component';
import {IComponentBindings} from '../Base/ComponentBindings';
import {QueryEvents, IQuerySuccessEventArgs} from '../../events/QueryEvents';
import {SettingsEvents} from '../../events/SettingsEvents';
import {ISettingsPopulateMenuArgs} from '../Settings/Settings';
import {Assert} from '../../misc/Assert';
import {$$} from '../../utils/Dom';
import {l} from '../../strings/Strings';
import {Utils} from '../../utils/Utils';
import {Initialization} from '../Base/Initialization';

export interface IShareQueryOptions {
}

/**
 * ShareQuery shows 2 text boxes, one with a shareable link and the
 * other with the complete query expression of the currently performed query.<br/>
 * It populates the {@link Settings} component's menu for easy access.
 */
export class ShareQuery extends Component {
  static ID = 'ShareQuery';
  static options: IShareQueryOptions = {};

  public dialogBoxContent: HTMLElement;
  private linkToThisQuery: HTMLInputElement;
  private completeQuery: HTMLInputElement;

  /**
   * Create a new ShareQuery component.
   * @param element
   * @param options
   * @param bindings
   */
  constructor(public element: HTMLElement, public options: IShareQueryOptions, bindings?: IComponentBindings) {
    super(element, ShareQuery.ID, bindings);
    this.dialogBoxContent = this.buildContent();
    element.appendChild(this.dialogBoxContent);
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleProcessNewQueryResults(args));

    this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
      args.menuData.push({
        className: 'coveo-share-query',
        text: l('ShareQuery'),
        onOpen: () => this.open(),
        onClose: () => this.close()
      });
    });
  }

  /**
   * Show the ShareQuery
   */
  public open() {
    $$(this.element).addClass('coveo-share-query-opened');
  }

  /**
   * Hide the ShareQuery
   */
  public close() {
    $$(this.element).removeClass('coveo-share-query-opened');
  }

  /**
   * Get the link to the current query
   */
  public getLinkToThisQuery(): string {
    return this.linkToThisQuery.value;
  }

  /**
   * Set the link to the current query
   */
  public setLinkToThisQuery(link: string): void {
    this.linkToThisQuery.value = link;
  }

  /**
   * Get the complete query string
   */
  public getCompleteQuery(): string {
    return this.completeQuery.value;
  }

  /**
   * Set the complete query string
   */
  public setCompleteQuery(completeQuery: string) {
    this.completeQuery.value = completeQuery;
  }

  private handleProcessNewQueryResults(args: IQuerySuccessEventArgs) {
    Assert.exists(args);
    Assert.exists(args.results);
    let query = args.query;

    this.linkToThisQuery.value = window.location.href;
    this.completeQuery.value = Utils.trim(this.outputIfNotNull(query.q) + ' ' + this.outputIfNotNull(query.aq) + ' ' + this.outputIfNotNull(query.cq));

    this.logger.trace('Received query results from new query', query);
  }

  private outputIfNotNull(value: string): string {
    if (value) {
      return '(' + value + ')';
    }
    return '';
  }

  private buildContent(): HTMLElement {
    let content = $$('div', { className: 'coveo-share-query-summary-info' }).el;
    content.appendChild($$('span', { className: 'coveo-query-summary-info-title' }).el);
    $$(content).text(l('ShareQuery'))

    let close = $$('div', { className: 'coveo-share-query-summary-info-close' }).el;
    close.appendChild($$('span').el);
    $$(close).on('click', () => this.close());
    content.appendChild(close);

    let boxes = $$('div', { className: 'coveo-share-query-summary-info-boxes' }).el;

    this.linkToThisQuery = <HTMLInputElement>$$('input', {
      'type': 'text',
      className: 'coveo-share-query-summary-info-input'
    }).el;
    $$(this.linkToThisQuery).on('click', () => this.linkToThisQuery.select());

    this.completeQuery = <HTMLInputElement>$$('input').el;
    this.completeQuery.setAttribute('type', 'text')
    $$(this.completeQuery).addClass('coveo-share-query-summary-info-input');

    boxes.appendChild(this.buildTextBoxWithLabel(l('Link') + ':', this.linkToThisQuery));
    boxes.appendChild(this.buildTextBoxWithLabel(l('CompleteQuery') + ':', this.completeQuery));
    content.appendChild(boxes);

    Component.pointElementsToDummyForm(content);

    return content;
  }

  private buildTextBoxWithLabel(label: string, input: HTMLInputElement): HTMLElement {
    let labelElement = $$('span', { className: 'coveo-share-query-summary-info-label' })
    labelElement.text(label);

    let returnDiv = $$('div').el;
    returnDiv.appendChild(labelElement.el);
    returnDiv.appendChild(input);
    return returnDiv;
  }

  static create(element: HTMLElement, options?: IShareQueryOptions, root?: HTMLElement): ShareQuery {
    Assert.exists(element);

    return new ShareQuery(element, options, root);
  }
}

Initialization.registerAutoCreateComponent(ShareQuery);
