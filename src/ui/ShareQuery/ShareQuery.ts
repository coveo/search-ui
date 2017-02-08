import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { QueryEvents, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { SettingsEvents } from '../../events/SettingsEvents';
import { ISettingsPopulateMenuArgs } from '../Settings/Settings';
import { Assert } from '../../misc/Assert';
import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import { Utils } from '../../utils/Utils';
import { Initialization } from '../Base/Initialization';

export interface IShareQueryOptions {
}

/**
 * The ShareQuery component populates the {@link Settings} popup menu with the **Share Query** menu item. When the end
 * user clicks this item, it displays a panel containing two input boxes: one containing a shareable link and the other
 * containing the complete current query expression.
 */
export class ShareQuery extends Component {
  static ID = 'ShareQuery';
  static options: IShareQueryOptions = {};

  public dialogBoxContent: HTMLElement;
  private linkToThisQuery: HTMLInputElement;
  private completeQuery: HTMLInputElement;

  /**
   * Creates a new ShareQuery component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the ShareQuery component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
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
   * Shows the **Share Query** panel.
   */
  public open() {
    $$(this.element).addClass('coveo-share-query-opened');
  }

  /**
   * Hides the **Share Query** panel.
   */
  public close() {
    $$(this.element).removeClass('coveo-share-query-opened');
  }

  /**
   * Gets the link to the current query.
   */
  public getLinkToThisQuery(): string {
    return this.linkToThisQuery.value;
  }

  /**
   * Sets the link to the current query.
   */
  public setLinkToThisQuery(link: string): void {
    this.linkToThisQuery.value = link;
  }

  /**
   * Gets the complete query expression string
   */
  public getCompleteQuery(): string {
    return this.completeQuery.value;
  }

  /**
   * Set the complete query expression string.
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
    content.appendChild($$('span', { className: 'coveo-query-summary-info-title' }, l('ShareQuery')).el);

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
    this.completeQuery.setAttribute('type', 'text');
    $$(this.completeQuery).addClass('coveo-share-query-summary-info-input');

    boxes.appendChild(this.buildTextBoxWithLabel(l('Link') + ':', this.linkToThisQuery));
    boxes.appendChild(this.buildTextBoxWithLabel(l('CompleteQuery') + ':', this.completeQuery));
    content.appendChild(boxes);

    Component.pointElementsToDummyForm(content);

    return content;
  }

  private buildTextBoxWithLabel(label: string, input: HTMLInputElement): HTMLElement {
    let labelElement = $$('span', { className: 'coveo-share-query-summary-info-label' });
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
