import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { SettingsEvents } from '../../events/SettingsEvents';
import { ISettingsPopulateMenuArgs } from '../Settings/Settings';
import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import { Utils } from '../../utils/Utils';
import { Initialization } from '../Base/Initialization';
import { exportGlobally } from '../../GlobalExports';
import { ModalBox as ModalBoxModule } from '../../ExternalModulesShim';

import 'styling/_ShareQuery';
import { SVGIcons } from '../../utils/SVGIcons';

export interface IShareQueryOptions {}

/**
 * The ShareQuery component populates the {@link Settings} popup menu with the **Share Query** menu item. When the end
 * user clicks this item, it displays a panel containing two input boxes: one containing a shareable link and the other
 * containing the complete current query expression.
 */
export class ShareQuery extends Component {
  static ID = 'ShareQuery';
  static options: IShareQueryOptions = {};

  static doExport = () => {
    exportGlobally({
      ShareQuery: ShareQuery
    });
  };

  public dialogBoxContent: HTMLElement;
  private linkToThisQuery: HTMLInputElement;
  private completeQuery: HTMLInputElement;
  private modalbox: Coveo.ModalBox.ModalBox;

  /**
   * Creates a new ShareQuery component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the ShareQuery component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(
    public element: HTMLElement,
    public options: IShareQueryOptions,
    bindings?: IComponentBindings,
    private ModalBox = ModalBoxModule
  ) {
    super(element, ShareQuery.ID, bindings);

    this.bind.onRootElement(SettingsEvents.settingsPopulateMenu, (args: ISettingsPopulateMenuArgs) => {
      args.menuData.push({
        className: 'coveo-share-query',
        text: l('ShareQuery'),
        onOpen: () => this.open(),
        onClose: () => this.close(),
        svgIcon: SVGIcons.icons.dropdownShareQuery,
        svgIconClassName: 'coveo-share-query-svg'
      });
    });
  }

  /**
   * Open the **Share Query** modal box.
   */
  public open() {
    if (this.modalbox == null) {
      this.dialogBoxContent = this.buildContent();
      this.modalbox = this.ModalBox.open(this.dialogBoxContent, {
        title: l('ShareQuery'),
        className: 'coveo-share-query-opened'
      });
    }
  }

  /**
   * Close the **Share Query** modal box.
   */
  public close() {
    if (this.modalbox) {
      this.modalbox.close();
      this.modalbox = null;
    }
  }

  /**
   * Gets the link to the current query.
   */
  public getLinkToThisQuery(): string {
    if (!this.linkToThisQuery) {
      this.buildLinkToThisQuery();
    }
    return this.linkToThisQuery.value;
  }

  /**
   * Sets the link to the current query.
   */
  public setLinkToThisQuery(link: string): void {
    if (!this.linkToThisQuery) {
      this.buildLinkToThisQuery();
    }
    this.linkToThisQuery.value = link;
  }

  /**
   * Gets the complete query expression string
   */
  public getCompleteQuery(): string {
    if (!this.completeQuery) {
      this.buildCompleteQuery();
    }
    return this.completeQuery.value;
  }

  /**
   * Set the complete query expression string.
   */
  public setCompleteQuery(completeQuery: string) {
    if (!this.completeQuery) {
      this.buildCompleteQuery();
    }
    this.completeQuery.value = completeQuery;
  }

  private outputIfNotNull(value: string): string {
    if (value) {
      return '(' + value + ')';
    }
    return '';
  }

  private buildContent(): HTMLElement {
    const content = $$('div', {
      className: 'coveo-share-query-summary-info'
    }).el;

    const boxes = $$('div', {
      className: 'coveo-share-query-summary-info-boxes'
    }).el;

    this.buildLinkToThisQuery();
    this.buildCompleteQuery();

    boxes.appendChild(this.buildTextBoxWithLabel(l('Link'), this.linkToThisQuery));
    boxes.appendChild(this.buildTextBoxWithLabel(l('CompleteQuery'), this.completeQuery));
    content.appendChild(boxes);

    Component.pointElementsToDummyForm(content);

    return content;
  }

  private buildCompleteQuery() {
    this.completeQuery = <HTMLInputElement>$$('input', {
      type: 'text',
      className: 'coveo-share-query-summary-info-input'
    }).el;

    const lastQuery = this.queryController.getLastQuery();
    this.completeQuery.value = Utils.trim(
      `${this.outputIfNotNull(lastQuery.q)} ${this.outputIfNotNull(lastQuery.aq)} ${this.outputIfNotNull(lastQuery.cq)}`
    );
  }

  private buildLinkToThisQuery() {
    this.linkToThisQuery = <HTMLInputElement>$$('input', {
      type: 'text',
      className: 'coveo-share-query-summary-info-input'
    }).el;

    $$(this.linkToThisQuery).on('click', () => this.linkToThisQuery.select());
    this.linkToThisQuery.value = window.location.href;
  }

  private buildTextBoxWithLabel(label: string, input: HTMLInputElement): HTMLElement {
    const labelElement = $$('span', {
      className: 'coveo-share-query-summary-info-label'
    });
    labelElement.text(label);

    const returnDiv = $$('div').el;
    returnDiv.appendChild(labelElement.el);
    returnDiv.appendChild(input);
    return returnDiv;
  }
}

Initialization.registerAutoCreateComponent(ShareQuery);
