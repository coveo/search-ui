import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { QueryUtils } from '../../utils/QueryUtils';
import { IQueryResult } from '../../rest/QueryResult';
import { Initialization } from '../Base/Initialization';
import { FieldValue, IFieldValueOptions } from '../FieldValue/FieldValue';
import { $$ } from '../../utils/Dom';
import { KeyboardUtils, KEYBOARD } from '../../utils/KeyboardUtils';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_FieldTable';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

export interface IFieldTableOptions {
  allowMinimization: boolean;
  expandedTitle: string;
  minimizedTitle: string;
  minimizedByDefault: boolean;
}

/**
 * The FieldTable component displays a set of {@link FieldValue} components in a table that can optionally be
 * expandable and minimizable. This component automatically takes care of not displaying empty field values.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * **Example:**
 *
 * ```
 * // This is the FieldTable component itself, which holds a list of table rows.
 * // Each row is a FieldValue component.
 * <table class='CoveoFieldTable'>
 *    // Items
 *    <tr data-field='@sysdate' data-caption='Date' data-helper='dateTime' />
 *    <tr data-field='@sysauthor' data-caption='Author' />
 *    <tr data-field='@clickuri' data-html-value='true' data-caption='URL' data-helper='anchor' data-helper-options='{text: \"<%= raw.syssource %>\" , target:\"_blank\"}'>
 * </table>
 * ```
 */
export class FieldTable extends Component {
  static ID = 'FieldTable';

  static doExport = () => {
    exportGlobally({
      FieldTable: FieldTable,
      FieldValue: FieldValue
    });
  };

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IFieldTableOptions = {
    /**
     * Specifies whether to allow the minimization (collapsing) of the FieldTable.
     *
     * If you set this option to `false`, the component will not create the **Minimize** / **Expand** toggle links.
     *
     * See also {@link FieldTable.options.expandedTitle}, {@link FieldTable.options.minimizedTitle} and
     * {@link FieldTable.options.minimizedByDefault}.
     *
     * Default value is `true`.
     */
    allowMinimization: ComponentOptions.buildBooleanOption({ defaultValue: true }),

    /**
     * If {@link FieldTable.options.allowMinimization} is `true`, specifies the caption to show on the **Minimize** link
     * (the link that appears when the FieldTable is expanded).
     *
     * Default value is `"Details"`.
     */
    expandedTitle: ComponentOptions.buildLocalizedStringOption({
      defaultValue: 'Details',
      depend: 'allowMinimization'
    }),

    /**
     * If {@link FieldTable.options.allowMinimization} is `true`, specifies the caption to show on the **Expand** link
     * (the link that appears when the FieldTable is minimized).
     *
     * Default value is `"Details"`.
     */
    minimizedTitle: ComponentOptions.buildLocalizedStringOption({
      defaultValue: 'Details',
      depend: 'allowMinimization'
    }),

    /**
     * If {@link FieldTable.options.allowMinimization} is `true`, specifies whether to minimize the table by default.
     *
     * Default value is `undefined`, and the FieldTable will collapse by default if the result it is associated with has
     * a non-empty excerpt.
     */
    minimizedByDefault: ComponentOptions.buildBooleanOption({ depend: 'allowMinimization' })
  };

  public isExpanded: boolean;
  private toggleButton: HTMLElement;
  private toggleCaption: HTMLElement;
  private toggleButtonSVGContainer: HTMLElement;
  private toggleButtonInsideTable: HTMLElement;
  private toggleContainer: HTMLElement;
  private toggleContainerHeight: number;

  /**
   * Creates a new FieldTable.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the FieldTable component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(
    public element: HTMLElement,
    public options?: IFieldTableOptions,
    bindings?: IComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, ValueRow.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, FieldTable, options);

    var rows = $$(this.element).findAll('tr[data-field]');
    _.each(rows, (e: HTMLElement) => {
      new ValueRow(e, {}, bindings, result);
    });

    if ($$(this.element).find('tr') == null) {
      $$(element).detach();
    }

    if (this.isTogglable()) {
      this.toggleContainer = $$('div', { className: 'coveo-field-table-toggle-container' }).el;
      this.buildToggle();
      $$(this.toggleContainer).insertBefore(this.element);
      this.toggleContainer.appendChild(this.element);
      this.toggleContainer.appendChild(this.toggleButtonInsideTable);
    } else {
      this.isExpanded = true;
    }
  }

  /**
   * Toggles between expanding (showing) and minimizing (collapsing) the FieldTable.
   *
   * @param anim Specifies whether to show a sliding animation when toggling the display of the FieldTable.
   */
  public toggle(anim = false) {
    if (this.isTogglable()) {
      this.isExpanded = !this.isExpanded;
      this.isExpanded ? this.expand(anim) : this.minimize(anim);
    }
  }

  /**
   * Expands (shows) the FieldTable,
   * @param anim Specifies whether to show a sliding animation when expanding the FieldTable.
   */
  public expand(anim = false) {
    if (this.isTogglable()) {
      this.isExpanded = true;
      this.toggleCaption.textContent = this.options.expandedTitle;
      SVGDom.addClassToSVGInContainer(this.toggleButtonSVGContainer, 'coveo-opened');
      SVGDom.addClassToSVGInContainer(this.toggleButtonInsideTable, 'coveo-opened');
      anim ? this.slideToggle(true) : this.slideToggle(true, false);
    }
  }

  /**
   * Minimizes (collapses) the FieldTable.
   * @param anim Specifies whether to show a sliding animation when minimizing the FieldTable.
   */
  public minimize(anim = false) {
    if (this.isTogglable()) {
      this.isExpanded = false;
      this.toggleCaption.textContent = this.options.minimizedTitle;
      SVGDom.removeClassFromSVGInContainer(this.toggleButtonSVGContainer, 'coveo-opened');
      SVGDom.removeClassFromSVGInContainer(this.toggleButtonInsideTable, 'coveo-opened');
      anim ? this.slideToggle(false) : this.slideToggle(false, false);
    }
  }

  /**
   * Updates the toggle height if the content was dynamically resized, so that the expanding and minimizing animation
   * can match the new content size.
   */
  public updateToggleHeight() {
    this.updateToggleContainerHeight();
    this.isExpanded ? this.expand() : this.minimize();
  }

  protected isTogglable() {
    if (this.options.allowMinimization) {
      return true;
    }
    return false;
  }

  private buildToggle() {
    this.toggleCaption = $$('span', { className: 'coveo-field-table-toggle-caption', tabindex: 0 }).el;

    this.toggleButton = $$('div', { className: 'coveo-field-table-toggle coveo-field-table-toggle-down' }).el;
    this.toggleButtonSVGContainer = $$('span', null, SVGIcons.icons.arrowDown).el;
    SVGDom.addClassToSVGInContainer(this.toggleButtonSVGContainer, 'coveo-field-table-toggle-down-svg');
    this.toggleButton.appendChild(this.toggleCaption);
    this.toggleButton.appendChild(this.toggleButtonSVGContainer);
    $$(this.toggleButton).insertBefore(this.element);

    this.toggleButtonInsideTable = $$(
      'span',
      { className: 'coveo-field-table-toggle coveo-field-table-toggle-up' },
      SVGIcons.icons.arrowUp
    ).el;
    SVGDom.addClassToSVGInContainer(this.toggleButtonInsideTable, 'coveo-field-table-toggle-up-svg');

    if (this.options.minimizedByDefault === true) {
      this.isExpanded = false;
    } else if (this.options.minimizedByDefault === false) {
      this.isExpanded = true;
    } else {
      this.isExpanded = !QueryUtils.hasExcerpt(this.result);
    }

    setTimeout(() => {
      this.updateToggleHeight();
    }); // Wait until toggleContainer.scrollHeight is computed.

    const toggleAction = () => this.toggle(true);
    $$(this.toggleButton).on('click', toggleAction);
    $$(this.toggleButtonInsideTable).on('click', toggleAction);
    $$(this.toggleButton).on('keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, toggleAction));
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
    caption: ComponentOptions.buildStringOption({
      postProcessing: (value, options) => value || options.field.substr(1)
    })
  };

  static parent = FieldValue;
  private valueContainer: HTMLElement;

  constructor(public element: HTMLElement, public options: IValueRowOptions, bindings?: IComponentBindings, public result?: IQueryResult) {
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
