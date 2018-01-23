import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions, IFieldOption, IComponentOptionsObjectOptionArgs } from '../Base/ComponentOptions';
import { IQueryResult } from '../../rest/QueryResult';
import { Initialization } from '../Base/Initialization';
import { TemplateHelpers } from '../Templates/TemplateHelpers';
import { Assert } from '../../misc/Assert';
import { DateUtils, IDateToStringOptions } from '../../utils/DateUtils';
import { QueryStateModel } from '../../models/QueryStateModel';
import { analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import { Utils } from '../../utils/Utils';
import { Facet } from '../Facet/Facet';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import { StringUtils } from '../../utils/StringUtils';
import { FacetUtils } from '../Facet/FacetUtils';

export interface IFieldValueOptions {
  field?: IFieldOption;
  facet?: string;
  htmlValue?: boolean;
  helper?: string;
  helperOptions?: { [key: string]: any };
  splitValues?: boolean;
  separator?: string;
  displaySeparator?: string;
  textCaption?: string;
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
  (<any>options).helpers = helpers;
  return options;
}

/**
 * The FieldValue component displays the value of a field associated to its parent search result. It is normally usable
 * within a {@link FieldTable}.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * A common use of this component is to display a specific field value which also happens to be an existing
 * {@link Facet.options.field}. When the user clicks on the FieldValue component, it activates the corresponding Facet.
 */
export class FieldValue extends Component {
  static ID = 'FieldValue';

  static doExport = () => {
    exportGlobally({
      FieldValue: FieldValue
    });
  };

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IFieldValueOptions = {
    /**
     * Specifies the field that the FieldValue should display.
     *
     * Specifying a value for this parameter is required in order for the FieldValue component to work.
     */
    field: ComponentOptions.buildFieldOption({ defaultValue: '@field', required: true }),

    /**
     * Specifies the {@link Facet} component to toggle when the end user clicks the FieldValue.
     *
     * Default value is the value of {@link FieldValue.options.field}.
     *
     * **Note:**
     * > If the target {@link Facet.options.id} is is not the same as its {@link Facet.options.field}), you must specify
     * > this option manually in order to link to the correct Facet.
     */
    facet: ComponentOptions.buildStringOption({ postProcessing: (value, options) => value || options.field }),

    /**
     * Specifies whether the content to display is an HTML element.
     *
     * Default value is `false`.
     */
    htmlValue: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * Specifies whether to split the FieldValue at each {@link FieldValue.options.separator}.
     *
     * This is useful for splitting groups using a {@link Facet.options.field}.
     *
     * When this option is `true`, the displayed values are split by the {@link FieldValue.options.displaySeparator}.
     *
     * Default value is `false`.
     */
    splitValues: ComponentOptions.buildBooleanOption({ defaultValue: false }),

    /**
     * If {@link FieldValue.options.splitValues} is `true`, specifies the separator string which separates multi-value
     * fields in the index.
     *
     * See {@link FieldValue.options.displaySeparator}.
     *
     * Default value is `";"`.
     */
    separator: ComponentOptions.buildStringOption({ depend: 'splitValues', defaultValue: ';' }),

    /**
     * If {@link FieldValue.options.splitValues} is `true`, specifies the string to use when displaying multi-value
     * fields in the UI.
     *
     * The component will insert this string between each value it displays from a multi-value field.
     *
     * See also {@link FieldValue.options.separator}.
     *
     * Default value is `", "`.
     */
    displaySeparator: ComponentOptions.buildStringOption({ depend: 'splitValues', defaultValue: ', ' }),

    /**
     * Specifies the helper that the FieldValue should use to display its content.
     *
     * While several helpers exist by default (see {@link ICoreHelpers}), it is also possible for you to create your own
     * custom helpers (see {@link TemplateHelpers}).
     */
    helper: ComponentOptions.buildHelperOption(),

    /**
     * Specifies the options to call on the specified helper.
     */
    helperOptions: ComponentOptions.buildObjectOption(<IComponentOptionsObjectOptionArgs>{
      subOptions: {
        text: ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),
        target: ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),
        class: ComponentOptions.buildStringOption(showOnlyWithHelper(['anchor'])),

        decimals: ComponentOptions.buildNumberOption(showOnlyWithHelper(['currency'], { min: 0 })),
        symbol: ComponentOptions.buildStringOption(showOnlyWithHelper(['currency'])),

        useTodayYesterdayAndTomorrow: ComponentOptions.buildBooleanOption(
          showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })
        ),
        useWeekdayIfThisWeek: ComponentOptions.buildBooleanOption(
          showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })
        ),
        omitYearIfCurrentOne: ComponentOptions.buildBooleanOption(
          showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })
        ),
        useLongDateFormat: ComponentOptions.buildBooleanOption(
          showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: false })
        ),
        includeTimeIfToday: ComponentOptions.buildBooleanOption(
          showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })
        ),
        includeTimeIfThisWeek: ComponentOptions.buildBooleanOption(
          showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: true })
        ),
        alwaysIncludeTime: ComponentOptions.buildBooleanOption(
          showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'], { defaultValue: false })
        ),
        predefinedFormat: ComponentOptions.buildStringOption(showOnlyWithHelper(['date', 'dateTime', 'emailDateTime', 'time'])),

        companyDomain: ComponentOptions.buildStringOption(showOnlyWithHelper(['email'])),
        me: ComponentOptions.buildStringOption(showOnlyWithHelper(['email'])),
        lengthLimit: ComponentOptions.buildNumberOption(showOnlyWithHelper(['email'], { min: 1 })),
        truncateName: ComponentOptions.buildBooleanOption(showOnlyWithHelper(['email'])),

        alt: ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
        height: ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),
        width: ComponentOptions.buildStringOption(showOnlyWithHelper(['image'])),

        precision: ComponentOptions.buildNumberOption(showOnlyWithHelper(['size'], { min: 0, defaultValue: 2 })),
        base: ComponentOptions.buildNumberOption(showOnlyWithHelper(['size'], { min: 0, defaultValue: 0 })),
        isMilliseconds: ComponentOptions.buildBooleanOption(showOnlyWithHelper(['timeSpan'])),

        length: ComponentOptions.buildNumberOption(showOnlyWithHelper(['shorten', 'shortenPath', 'shortenUri'], { defaultValue: 200 }))
      }
    }),

    /**
     * Specifies a caption to display before the value.
     *
     * Default value is `undefined`.
     */
    textCaption: ComponentOptions.buildLocalizedStringOption()
  };

  static simpleOptions = _.omit(FieldValue.options, 'helperOptions');

  static helperOptions = <any>{
    helperOptions: FieldValue.options.helperOptions
  };

  /**
   * Creates a new FieldValue.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the FieldValue component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(
    public element: HTMLElement,
    public options: IFieldValueOptions,
    bindings?: IComponentBindings,
    public result?: IQueryResult,
    fieldValueClassId: string = FieldValue.ID
  ) {
    super(element, fieldValueClassId, bindings);

    this.options = ComponentOptions.initOptions(element, FieldValue.simpleOptions, options);

    if (this.options.helper != null) {
      this.normalizeHelperAndOptions();
    }

    this.result = this.result || this.resolveResult();
    Assert.exists(this.result);

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
      if (this.options.textCaption != null) {
        this.prependTextCaptionToDom();
      }
    }
  }

  /**
   * Gets the current FieldValue from the current {@link IQueryResult}.
   *
   * @returns {any} The current FieldValue or `null` if value is and `Object`.
   */
  public getValue() {
    let value = Utils.getFieldValue(this.result, <string>this.options.field);
    if (!_.isArray(value) && _.isObject(value)) {
      value = null;
    }
    return value;
  }

  /**
   * Renders a value to HTML using all of the current FieldValue component options.
   * @param value The value to render.
   * @returns {HTMLElement} The element containing the rendered value.
   */
  public renderOneValue(value: string): HTMLElement {
    const element = $$('span').el;
    let toRender = FacetUtils.tryToGetTranslatedCaption(this.options.field as string, value);

    if (this.options.helper) {
      // Try to resolve and execute version 2 of each helper function if available
      const helper = TemplateHelpers.getHelper(`${this.options.helper}v2`) || TemplateHelpers.getHelper(`${this.options.helper}`);

      if (Utils.exists(helper)) {
        toRender = helper.call(this, value, this.getHelperOptions());
      } else {
        this.logger.warn(
          `Helper ${this.options.helper} is not found in available helpers. The list of supported helpers is :`,
          _.keys(TemplateHelpers.getHelpers())
        );
      }

      const fullDateStr = this.getFullDate(value, this.options.helper);
      if (fullDateStr) {
        element.setAttribute('title', fullDateStr);
      }
      if (this.options.helper == 'date' || this.options.helper == 'dateTime' || this.options.helper == 'emailDateTime') {
        toRender = StringUtils.capitalizeFirstLetter(toRender);
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

  private normalizeHelperAndOptions() {
    this.options = ComponentOptions.initOptions(this.element, FieldValue.helperOptions, this.options);
    const toFilter = _.keys(FieldValue.options.helperOptions['subOptions']);
    const toKeep = _.filter(toFilter, optionKey => {
      const optionDefinition = FieldValue.options.helperOptions['subOptions'][optionKey];
      if (optionDefinition) {
        const helpers = optionDefinition.helpers;
        return helpers != null && _.contains(helpers, this.options.helper);
      }
      return false;
    });
    this.options.helperOptions = _.omit(this.options.helperOptions, (value, key) => {
      return !_.contains(toKeep, key);
    });
  }

  private getHelperOptions() {
    const inlineOptions = ComponentOptions.loadStringOption(this.element, 'helperOptions', {});
    if (Utils.isNonEmptyString(inlineOptions)) {
      return _.extend({}, this.options.helperOptions, eval('(' + inlineOptions + ')'));
    }
    return this.options.helperOptions;
  }

  private getFullDate(date: string, helper: string) {
    const fullDateOptions: IDateToStringOptions = {
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
    });
  }

  private renderTextCaption(): HTMLElement {
    const element = $$('span', { className: 'coveo-field-caption' }, _.escape(this.options.textCaption));
    return element.el;
  }

  protected prependTextCaptionToDom(): void {
    const elem = this.getValueContainer();
    $$(elem).prepend(this.renderTextCaption());
    // Add a class to the container so the value and the caption wrap together.
    $$(elem).addClass('coveo-with-label');
  }

  private bindEventOnValue(element: HTMLElement, value: string) {
    const facetAttributeName = QueryStateModel.getFacetId(this.options.facet);
    const facets: Component[] = _.filter(this.componentStateModel.get(facetAttributeName), (possibleFacetComponent: Component) => {
      // Here, we need to check if a potential facet component (as returned by the component state model) is a "standard" facet.
      // It's also possible that the FacetRange and FacetSlider constructor are not available (lazy loading mode)
      // For that reason we also need to check that the constructor event exist before calling the instanceof operator or an exception would explode (cannot use instanceof "undefined")
      let componentIsAStandardFacet = true;
      const facetRangeConstructorExists = Component.getComponentRef('FacetRange');
      const facetSliderConstructorExists = Component.getComponentRef('FacetSlider');

      if (possibleFacetComponent.disabled) {
        return false;
      }

      if (componentIsAStandardFacet && facetRangeConstructorExists) {
        componentIsAStandardFacet = !(possibleFacetComponent instanceof facetRangeConstructorExists);
      }

      if (componentIsAStandardFacet && facetSliderConstructorExists) {
        componentIsAStandardFacet = !(possibleFacetComponent instanceof facetSliderConstructorExists);
      }

      return componentIsAStandardFacet;
    });

    const atLeastOneFacetIsEnabled = facets.length > 0;

    if (atLeastOneFacetIsEnabled) {
      const selected = _.find(facets, (facet: Facet) => {
        const facetValue = facet.values.get(value);
        return facetValue && facetValue.selected;
      });
      $$(element).on('click', () => {
        if (selected != null) {
          _.each(facets, (facet: Facet) => facet.deselectValue(value));
        } else {
          _.each(facets, (facet: Facet) => facet.selectValue(value));
        }
        this.queryController.deferExecuteQuery({
          beforeExecuteQuery: () =>
            this.usageAnalytics.logSearchEvent<IAnalyticsFieldValueMeta>(analyticsActionCauseList.documentField, {
              facetId: this.options.facet,
              facetValue: value.toLowerCase()
            })
        });
      });

      if (selected) {
        $$(element).addClass('coveo-selected');
      }
      $$(element).addClass('coveo-clickable');
    }
  }
}

Initialization.registerAutoCreateComponent(FieldValue);
