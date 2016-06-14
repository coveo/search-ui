import {Component} from '../Base/Component'
import {IComponentBindings} from '../Base/ComponentBindings'
import {ComponentOptions} from '../Base/ComponentOptions'
import {IQueryResult} from '../../rest/QueryResult'
import {Initialization} from '../Base/Initialization'
import {TemplateHelpers} from '../Templates/TemplateHelpers'
import {Assert} from '../../misc/Assert'
import {DateUtils, IDateToStringOptions} from '../../utils/DateUtils'
import {QueryStateModel} from '../../models/QueryStateModel'
import {analyticsActionCauseList} from '../Analytics/AnalyticsActionListMeta'
import {Utils} from '../../utils/Utils'
import {Facet} from '../Facet/Facet'
import {$$} from '../../utils/Dom'
import _ = require('underscore');

export interface IFieldValueOptions {
  field?: string;
  facet?: string;
  htmlValue?: boolean;
  helper?: string;
  helperOptions?: { [key: string]: any };
  splitValues?: boolean;
  separator?: string;
  displaySeparator?: string;
}

export interface IAnalyticsFieldValueMeta {
  facetId: string;
  facetValue?: string;
  facetTitle?: string;
}

function showOnlyWithHelper<T>(helpers: string[], options?: T): T {
  if (options == null) {
    options = <any>{};
  }
  (<any>options).helpers = helpers
  return options;
}

/**
 * This component can be used as part of a result template to display the value of a field
 * associated with the current search result.<br/>
 * This component is usually located inside a {@link FieldTable}.<br/>
 * A common use of this component is to display a specific field value, when that field also
 * happens to be a facet. When the field value is clicked on, the corresponding facet is activated.
 */
export class FieldValue extends Component {
  static ID = 'FieldValue';

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IFieldValueOptions = {
    /**
     * Specifies the field to be displayed by the FieldValue.<br/>
     * This field is required.
     */
    field: ComponentOptions.buildFieldOption({ required: true }),
    /**
     * Specifies the facet to be toggled when the component is clicked on.<br/>
     * When no value is specified, the value of the <code>field</code> option is used.<br/>
     * If the facet id is custom (e.g. not the same name as its field), you must specify
     * manually this option in order to link the correct facet.
     */
    facet: ComponentOptions.buildStringOption({ postProcessing: (value, options) => value || options.field }),
    /**
     * Specifies if the content to display is an HTML element.<br/>
     * The default value is <code>false</code>
     */
    htmlValue: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies if the field value is to be split at each {@link separator}.
     * This is useful for splitting groups by a facet field.<br/>
     * The values displayed are split by the {@link displaySeparator}.<br/>
     * The default value is <code>false</code>.
     */
    splitValues: ComponentOptions.buildBooleanOption({ defaultValue: false }),
    /**
     * Specifies the string used to split multi-value fields from the index.
     * The default value is <code>;</code>.
     */
    separator: ComponentOptions.buildStringOption({ defaultValue: ';' }),
    /**
     * Specifies the string used to display multi-value fields in the UI.
     * It is inserted between the displayed values.
     * The default value is <code>, </code>.
     */
    displaySeparator: ComponentOptions.buildStringOption({ defaultValue: ', ' }),
    /**
     * Specifies the helper to be used by the FieldValue to display its content.<br/>
     * A few helpers exist by default (see {@link CoreHelpers}), and new ones can be
     * custom-created (see {@link TemplateHelpers}).
     */
    helper: ComponentOptions.buildHelperOption(),
    /**
     * Specifies the options to call on the specified helper.<br/>
     */
    helperOptions: ComponentOptions.buildObjectOption({
      subOptions: {
        text: ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),
        target: ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),
        'class': ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),

        decimals: ComponentOptions.buildNumberOption(showOnlyWithHelper(['currency'], { min: 0 })),
        symbol: ComponentOptions.buildStringOption(showOnlyWithHelper(['currency'])),

        useTodayYesterdayAndTomorrow: ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
        useWeekdayIfThisWeek: ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
        omitYearIfCurrentOne: ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
        useLongDateFormat: ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: false })),
        includeTimeIfToday: ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
        includeTimeIfThisWeek: ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })),
        alwaysIncludeTime: ComponentOptions.buildBooleanOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: false })),
        predefinedFormat: ComponentOptions.buildStringOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'])),

        companyDomain: ComponentOptions.buildStringOption(showOnlyWithHelper(['email'])),
        lengthLimit: ComponentOptions.buildNumberOption(showOnlyWithHelper(['email'], { min: 1 })),
        truncateName: ComponentOptions.buildBooleanOption(showOnlyWithHelper(['email'])),

        alt: ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
        height: ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
        width: ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),

        presision: ComponentOptions.buildNumberOption(showOnlyWithHelper(['size'], { min: 0, defaultValue: 2 })),
        base: ComponentOptions.buildNumberOption(showOnlyWithHelper(['size'], { min: 0, defaultValue: 0 })),
        isMilliseconds: ComponentOptions.buildBooleanOption(showOnlyWithHelper(['timeSpan'])),
      }
    })
  }

  static simpleOptions = _.omit(FieldValue.options, 'helperOptions');

  static helperOptions = <any>{
    helperOptions: FieldValue.options.helperOptions
  }

  /**
   * Build a new FieldValue
   * @param element
   * @param options
   * @param bindings
   * @param result
   */
  constructor(public element: HTMLElement, public options?: IFieldValueOptions, bindings?: IComponentBindings, public result?: IQueryResult, fieldValueClassId: string = FieldValue.ID) {
    super(element, fieldValueClassId, bindings);

    this.options = ComponentOptions.initOptions(element, FieldValue.simpleOptions, options);

    if (this.options.helper != null) {
      this.options = ComponentOptions.initOptions(element, FieldValue.helperOptions, this.options);
    }

    this.result = this.result || this.resolveResult();
    Assert.exists(this.result);

    this.options.field = this.options.field || '@field';

    let loadedValueFromComponent = this.getValue();
    if (loadedValueFromComponent == null) {
      // Completely remove the element to ease stuff such as adding separators in CSS
      if (this.element.parentElement != null) {
        this.element.parentElement.removeChild(this.element);
      }
    } else {
      let values: string[];

      if (_.isArray(loadedValueFromComponent)) {
        values = loadedValueFromComponent;
      } else if (this.options.splitValues) {
        if (_.isString(loadedValueFromComponent)) {
          values = _.map(loadedValueFromComponent.split(this.options.separator), (v: string) => {
            return v.trim();
          });
        }
      } else {
        loadedValueFromComponent = loadedValueFromComponent.toString();
        values = [loadedValueFromComponent];
      }
      this.appendValuesToDom(values);
    }
  }

  /**
   * Get the current field value from the current result.<br/>
   * Returns <code>null</code> if value is an <code>Object</code>.
   */
  public getValue() {
    let value = Utils.getFieldValue(this.result, this.options.field);
    if (!_.isArray(value) && _.isObject(value)) {
      value = null;
    }
    return value;
  }

  /**
   * Render the passed value string with all of the component's options.<br/>
   * Returns an <code>HTMLElement</code> containing the rendered value.
   */
  public renderOneValue(value: string): HTMLElement {
    let element = $$('span').el;
    let toRender = value;
    if (this.options.helper) {
      toRender = TemplateHelpers.getHelper(this.options.helper).call(this, value, this.getHelperOptions());

      let fullDateStr = this.getFullDate(value, this.options.helper);
      if (fullDateStr) {
        element.setAttribute('title', fullDateStr);
      }
    }

    if (this.options.htmlValue) {
      element.innerHTML = toRender;
    } else {
      element.appendChild(document.createTextNode(toRender));
    }
    this.bindEventOnValue(element, value);
    return element;
  }

  protected getValueContainer() {
    return this.element;
  }

  private getHelperOptions() {
    let inlineOptions = ComponentOptions.loadStringOption(this.element, 'helperOptions', {});
    if (Utils.isNonEmptyString(inlineOptions)) {
      return _.extend({}, this.options.helperOptions, eval('(' + inlineOptions + ')'));
    }
    return this.options.helperOptions;
  }

  private getFullDate(date: string, helper: string) {
    let fullDateOptions: IDateToStringOptions = {
      useLongDateFormat: true,
      useTodayYesterdayAndTomorrow: false,
      useWeekdayIfThisWeek: false,
      omitYearIfCurrentOne: false
    };

    if (helper == 'date') {
      return DateUtils.dateToString(new Date(parseInt(date)), fullDateOptions);
    } else if (helper == 'dateTime' || helper == 'emailDateTime') {
      return DateUtils.dateTimeToString(new Date(parseInt(date)), fullDateOptions);
    }
    return '';
  }

  private appendValuesToDom(values: string[]): void {
    _.each(values, (value, index) => {
      if (value != undefined) {
        this.getValueContainer().appendChild(this.renderOneValue(value));
        if (index !== values.length - 1) {
          this.getValueContainer().appendChild(document.createTextNode(this.options.displaySeparator));
        }
      }
    })
  }

  private bindEventOnValue(element: HTMLElement, value: string) {
    let facetAttributeName = QueryStateModel.getFacetId(this.options.facet);
    let facets: Component[] = _.filter(this.componentStateModel.get(facetAttributeName), (facet: Component) => !facet.disabled);
    let atLeastOneFacetIsEnabled = facets.length > 0;

    if (atLeastOneFacetIsEnabled) {
      let selected = _.find(facets, (facet: Facet) => {
        let facetValue = facet.values.get(value);
        return facetValue && facetValue.selected;
      });
      $$(element).on('click', () => {
        if (selected != null) {
          _.each(facets, (facet: Facet) => facet.deselectValue(value));
        } else {
          _.each(facets, (facet: Facet) => facet.selectValue(value));
        }
        this.queryController.deferExecuteQuery({
          beforeExecuteQuery: () => this.usageAnalytics.logSearchEvent<IAnalyticsFieldValueMeta>(analyticsActionCauseList.documentField, {
            facetId: this.options.facet,
            facetValue: value.toLowerCase()
          })
        });
      })

      if (selected) {
        $$(element).addClass('coveo-selected');
      }
      $$(element).addClass('coveo-clickable');
    }
  }

  private static initSimpleOptions() {
    let options = {};
    for (let key in FieldValue.options) {
      if (key != 'helperOptions') {
        options[key] = FieldValue.options[key];
      }
    }
  }

}

Initialization.registerAutoCreateComponent(FieldValue);
