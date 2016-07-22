import {Component} from '../Base/Component'
import {IComponentBindings} from '../Base/ComponentBindings'
import {ComponentOptions} from '../Base/ComponentOptions'
import {QueryUtils} from '../../utils/QueryUtils'
import {IQueryResult} from '../../rest/QueryResult'
import {Initialization} from '../Base/Initialization'
import {FieldValue, IFieldValueOptions} from './FieldValue'
import {$$} from '../../utils/Dom'

export interface IFieldTableOptions {
  allowMinimization: boolean;
  expandedTitle: string;
  minimizedTitle: string;
  minimizedByDefault: boolean;
}

/**
 * This component is used to display a set of {@link FieldValue} components in a table which
 * can be optionally expanded and minimized.<br/>
 * Automatically, it will take care of not displaying empty field values.
 */
export class FieldTable extends Component {
  static ID = 'FieldTable';

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IFieldTableOptions = {
    /**
     * Specifies whether to allow the minimization (collapsing) of the FieldTable.<br/>
     * This creates a 'minimize' and 'expand' link above the table.
     */
    allowMinimization: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Specifies the caption to show on the minimize link (when the table is expanded).<br/>
     * By default, it is set to the localized version of "Details".
     */
    expandedTitle: ComponentOptions.buildLocalizedStringOption({ defaultValue: 'Details', depend: 'allowMinimization' }),
    /**
     * Specifies the caption to show on the expand link (when the table is minimized).<br/>
     * By default, it is set to the localized version of "Details".
     */
    minimizedTitle: ComponentOptions.buildLocalizedStringOption({ defaultValue: 'Details', depend: 'allowMinimization' }),
    /**
     * Specifies whether the table is minimized by default.
     */
    minimizedByDefault: ComponentOptions.buildBooleanOption({ depend: 'allowMinimization' })
  };

  public isExpanded: boolean;
  private toggleButton: HTMLElement;
  private toggleIcon: HTMLElement;
  private toggleCaption: HTMLElement;
  private toggleButtonInsideTable: HTMLElement;
  private toggleContainer: HTMLElement;
  private toggleContainerHeight: number;

  /**
   * Create a new FieldTable
   * @param element
   * @param options
   * @param bindings
   * @param result
   */
  constructor(public element: HTMLElement, public options?: IFieldTableOptions, bindings?: IComponentBindings, public result?: IQueryResult) {
    super(element, ValueRow.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, FieldTable, options);

    var rows = $$(this.element).findAll('tr[data-field]');
    _.each(rows, (e: HTMLElement) => {
      new ValueRow(e, {}, bindings, result)
    });

    if ($$(this.element).find('tr') == null) {
      $$(element).detach();
    }

    if (this.isTogglable()) {
      this.toggleContainer = $$('div', { className: 'coveo-field-table-toggle-container' }).el;
      this.buildToggle();
      $$(this.toggleContainer).insertBefore(this.element);
      this.toggleContainer.appendChild(this.element);
    } else {
      this.isExpanded = true;
    }
  }

  /**
   * Toggle between expanding and minimizing the FieldTable
   * @param anim Specifies whether to show a sliding animation when toggling
   */
  public toggle(anim = false) {
    if (this.isTogglable()) {
      this.isExpanded = !this.isExpanded;
      this.isExpanded ? this.expand(anim) : this.minimize(anim);
    }
  }

  /**
   * Expand (show) the FieldTable
   * @param anim Specifies whether to show a sliding animation when opening
   */
  public expand(anim = false) {
    if (this.isTogglable()) {
      this.isExpanded = true;
      this.toggleCaption.textContent = this.options.expandedTitle;
      $$(this.toggleIcon).addClass('coveo-opened');
      $$(this.toggleButtonInsideTable).addClass('coveo-opened');
      anim ? this.slideToggle(true) : this.slideToggle(true, false);
    }
  }

  /**
   * Minimize (collapse) the FieldTable
   * @param anim Specifies whether to show a sliding animation when collapsing
   */
  public minimize(anim = false) {
    if (this.isTogglable()) {
      this.isExpanded = false;
      this.toggleCaption.textContent = this.options.minimizedTitle;
      $$(this.toggleIcon).removeClass('coveo-opened');
      $$(this.toggleButtonInsideTable).removeClass('coveo-opened');
      anim ? this.slideToggle(false) : this.slideToggle(false, false);
    }
  }

  protected isTogglable() {
    if (this.searchInterface.isNewDesign() && this.options.allowMinimization) {
      return true;
    }
    this.logger.info('Cannot open or close the field table with older design', this);
    return false;
  }

  private buildToggle() {
    this.toggleIcon = $$('span', { className: 'coveo-field-table-toggle-icon' }).el;
    this.toggleCaption = $$('span', { className: 'coveo-field-table-toggle-caption' }).el;

    this.toggleButton = $$('div', { className: 'coveo-field-table-toggle' }).el;
    this.toggleButton.appendChild(this.toggleCaption);
    this.toggleButton.appendChild(this.toggleIcon);
    $$(this.toggleButton).insertBefore(this.element);

    this.toggleButtonInsideTable = $$('span', { className: 'coveo-field-table-toggle-icon-up coveo-field-table-toggle' }).el;
    this.element.appendChild(this.toggleButtonInsideTable);

    if (this.options.minimizedByDefault === true) {
      this.isExpanded = false;
    } else if (this.options.minimizedByDefault === false) {
      this.isExpanded = true;
    } else {
      this.isExpanded = !QueryUtils.hasExcerpt(this.result);
    }

    setTimeout(() => {
      this.updateToggleContainerHeight();
      this.isExpanded ? this.expand() : this.minimize()
    }); // Wait until toggleContainer.scrollHeight is computed.

    $$(this.toggleButton).on('click', () => this.toggle(true));
    $$(this.toggleButtonInsideTable).on('click', () => this.toggle(true));
  }

  private slideToggle(visible: boolean = true, anim: boolean = true) {
    if (!anim) {
      $$(this.toggleContainer).addClass('coveo-no-transition');
    }
    if (visible) {
      this.toggleContainer.style.display = 'block';
      this.toggleContainer.style.height = this.toggleContainerHeight + 'px';
    } else {
      this.toggleContainer.style.height = this.toggleContainerHeight + 'px';
      this.toggleContainer.style.height = '0';
    }
    if (!anim) {
      this.toggleContainer.offsetHeight; // Force reflow
      $$(this.toggleContainer).removeClass('coveo-no-transition');
    }
  }

  private updateToggleContainerHeight() {
    this.toggleContainerHeight = this.toggleContainer.scrollHeight;
  }
}

Initialization.registerAutoCreateComponent(FieldTable);

export interface IValueRowOptions extends IFieldValueOptions {
  caption?: string;
}

class ValueRow extends FieldValue {
  static ID = 'ValueRow';
  static options: IValueRowOptions = {
    caption: ComponentOptions.buildStringOption({ postProcessing: (value, options) => value || options.field.substr(1) })
  }

  static parent = FieldValue;
  private valueContainer: HTMLElement;

  constructor(public element: HTMLElement, public options?: IValueRowOptions, bindings?: IComponentBindings, public result?: IQueryResult) {
    super(element, options, bindings, result, ValueRow.ID);
    this.options = ComponentOptions.initComponentOptions(element, ValueRow, options);

    var caption = $$('th').el;
    caption.appendChild(document.createTextNode(this.options.caption.toLocaleString()));
    this.element.insertBefore(caption, this.getValueContainer());
  }

  protected getValueContainer() {
    if (this.valueContainer == null) {
      this.valueContainer = document.createElement('td');
      this.element.appendChild(this.valueContainer);
    }
    return this.valueContainer;
  }
}
