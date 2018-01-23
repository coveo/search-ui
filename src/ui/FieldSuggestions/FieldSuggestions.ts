import { ISuggestionForOmniboxOptions, SuggestionForOmnibox, ISuggestionForOmniboxTemplate } from '../Misc/SuggestionForOmnibox';
import { Component } from '../Base/Component';
import { ComponentOptions, IFieldOption } from '../Base/ComponentOptions';
import { IComponentBindings } from '../Base/ComponentBindings';
import { Assert } from '../../misc/Assert';
import { Utils } from '../../utils/Utils';
import { OmniboxEvents, IPopulateOmniboxEventArgs } from '../../events/OmniboxEvents';
import { IIndexFieldValue } from '../../rest/FieldValue';
import { IListFieldValuesRequest } from '../../rest/ListFieldValuesRequest';
import { QueryStateModel } from '../../models/QueryStateModel';
import { Initialization } from '../Base/Initialization';
import { analyticsActionCauseList, IAnalyticsNoMeta } from '../Analytics/AnalyticsActionListMeta';
import { $$ } from '../../utils/Dom';
import { ISuggestionForOmniboxOptionsOnSelect } from '../Misc/SuggestionForOmnibox';
import { IStringMap } from '../../rest/GenericParam';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_FieldSuggestions';

export interface IFieldSuggestionsOptions extends ISuggestionForOmniboxOptions {
  field?: IFieldOption;
  queryOverride?: string;
}

/**
 * The `FieldSuggestions` component provides query suggestions based on a particular facet field. For example, you could
 * use this component to provide auto-complete suggestions while the end user is typing the title of an item.
 *
 * The query suggestions provided by this component appear in the [`Omnibox`]{@link Omnibox} component.
 */
export class FieldSuggestions extends Component {
  static ID = 'FieldSuggestions';

  static doExport = () => {
    exportGlobally({
      FieldSuggestions: FieldSuggestions
    });
  };

  /**
   * @componentOptions
   */
  static options: IFieldSuggestionsOptions = {
    /**
     * Specifies the facet field from which to provide suggestions.
     *
     * Specifying a value for this option is required for the `FieldSuggestions` component to work.
     */
    field: ComponentOptions.buildFieldOption({ required: true }),

    /**
     * Specifies a query override to apply when retrieving suggestions. You can use any valid query expression (see
     * [Coveo Query Syntax Reference](http://www.coveo.com/go?dest=adminhelp70&lcid=9&context=10005)).
     *
     * Default value is the empty string, and the component applies no query override.
     */
    queryOverride: ComponentOptions.buildStringOption({ defaultValue: '' }),

    /**
     * Specifies the z-index position at which the suggestions render themselves in the [`Omnibox`]{@link Omnibox}.
     *
     * When there are multiple suggestion providers, components with higher `omniboxZIndex` values render themselves
     * first.
     *
     * Default value is `51`. Minimum value is `0`.
     */
    omniboxZIndex: ComponentOptions.buildNumberOption({ defaultValue: 51, min: 0 }),

    /**
     * Specifies the title of the result suggestions group in the [`Omnibox`]{@link Omnibox} component.
     * If not provided, the component will simply not output any title.
     *
     * Default value is `null`.
     */
    headerTitle: ComponentOptions.buildLocalizedStringOption(),

    /**
     * Specifies the number of suggestions to render in the [`Omnibox`]{@link Omnibox}.
     *
     * Default value is `5`. Minimum value is `1`.
     */
    numberOfSuggestions: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 }),

    /**
     * Specifies the event handler function to execute when the end user selects a suggested value in the
     * [`Omnibox`]{@link Omnibox}. By default, the query box text is replaced by what the end user selected and a new
     * query is executed. You can, however, replace this default behavior by providing a callback function to execute
     * when the value is selected.
     *
     * **Note:**
     * > You cannot set this option directly in the component markup as an HTML attribute. You must either set it in the
     * > [`init`]{@link init} call of your search interface (see
     * > [Components - Passing Component Options in the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsintheinitCall)),
     * > or before the `init` call, using the `options` top-level function (see
     * > [Components - Passing Component Options Before the init Call](https://developers.coveo.com/x/PoGfAQ#Components-PassingComponentOptionsBeforetheinitCall)).
     *
     * **Example:**
     *
     * ```javascript
     *
     * var myOnSelectFunction = function(selectedValue, populateOmniboxEventArgs) {
     *
     *   // Close the suggestion list when the user clicks a suggestion.
     *   populateOmniboxEventArgs.closeOmnibox();
     *
     *   // Search for matching title results in the default endpoint.
     *   Coveo.SearchEndpoint.endpoints["default"].search({
     *     q: "@title=='" + selectedValue + "'"
     *   }).done(function(results) {
     *
     *     // If more than one result is found, select a result that matches the selected title.
     *     var foundResult = Coveo._.find(results.results, function(result) {
     *       return selectedValue == result.raw.title;
     *     });
     *
     *     // Open the found result in the current window, or log an error.
     *     if (foundResult) {
     *       window.location = foundResult.clickUri;
     *     }
     *     else {
     *       new Coveo.Logger.warn("Selected suggested result '" + selectedValue + "' not found.");
     *     }
     *   });
     * };
     *
     * // You can set the option in the 'init' call:
     * Coveo.init(document.querySelector("#search"), {
     *    FieldSuggestions : {
     *      onSelect : myOnSelectFunction
     *    }
     * });
     *
     * // Or before the 'init' call, using the 'options' top-level function:
     * // Coveo.options(document.querySelector("#search"), {
     * //   FieldSuggestions : {
     * //     onSelect : myOnSelectFunction
     * //   }
     * // });
     * ```
     */
    onSelect: ComponentOptions.buildCustomOption<ISuggestionForOmniboxOptionsOnSelect>(() => {
      return null;
    })
  };

  private suggestionForOmnibox: SuggestionForOmnibox;
  private currentlyDisplayedSuggestions: { [suggestion: string]: { element: HTMLElement; pos: number } };

  /**
   * Creates a new `FieldSuggestions` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `FieldSuggestions` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(element: HTMLElement, public options: IFieldSuggestionsOptions, bindings?: IComponentBindings) {
    super(element, FieldSuggestions.ID, bindings);

    if (this.options && 'omniboxSuggestionOptions' in this.options) {
      this.options = _.extend(this.options, this.options['omniboxSuggestionOptions']);
    }

    this.options = ComponentOptions.initComponentOptions(element, FieldSuggestions, options);

    Assert.check(Utils.isCoveoField(<string>this.options.field), this.options.field + ' is not a valid field');

    this.options.onSelect = this.options.onSelect || this.onRowSelection;

    let rowTemplate = (toRender: IStringMap<string>) => {
      let rowElement = $$('div', {
        className: 'magic-box-suggestion coveo-omnibox-selectable coveo-top-field-suggestion-row'
      });
      if (toRender['data']) {
        rowElement.el.innerHTML = toRender['data'];
      }
      return rowElement.el.outerHTML;
    };

    let suggestionStructure: ISuggestionForOmniboxTemplate;
    if (this.options.headerTitle == null) {
      suggestionStructure = {
        row: rowTemplate
      };
    } else {
      let headerTemplate = () => {
        let headerElement = $$('div', {
          className: 'coveo-top-field-suggestion-header'
        });

        let iconElement = $$('span', {
          className: 'coveo-icon-top-field'
        });

        let captionElement = $$('span', {
          className: 'coveo-caption'
        });

        if (this.options.headerTitle) {
          captionElement.text(this.options.headerTitle);
        }

        headerElement.append(iconElement.el);
        headerElement.append(captionElement.el);

        return headerElement.el.outerHTML;
      };

      suggestionStructure = {
        header: { template: headerTemplate, title: this.options.headerTitle },
        row: rowTemplate
      };
    }

    this.suggestionForOmnibox = new SuggestionForOmnibox(
      suggestionStructure,
      (value: string, args: IPopulateOmniboxEventArgs) => {
        this.options.onSelect.call(this, value, args);
      },
      (value: string, args: IPopulateOmniboxEventArgs) => {
        this.onRowTab(value, args);
      }
    );
    this.bind.onRootElement(OmniboxEvents.populateOmnibox, (args: IPopulateOmniboxEventArgs) => this.handlePopulateOmnibox(args));
  }

  public selectSuggestion(suggestion: number);
  public selectSuggestion(suggestion: string);

  /**
   * Selects a currently displayed query suggestion. This implies that at least one suggestion must have been returned
   * at least once.
   * @param suggestion Either a number (0-based index position of the query suggestion to select) or a string that
   * matches the suggestion to select.
   */
  public selectSuggestion(suggestion: any) {
    if (this.currentlyDisplayedSuggestions) {
      if (isNaN(suggestion)) {
        if (this.currentlyDisplayedSuggestions[suggestion]) {
          $$(this.currentlyDisplayedSuggestions[suggestion].element).trigger('click');
        }
      } else {
        let currentlySuggested = <{ element: HTMLElement; pos: number }>_.findWhere(<any>this.currentlyDisplayedSuggestions, {
          pos: suggestion
        });
        if (currentlySuggested) {
          $$(currentlySuggested.element).trigger('click');
        }
      }
    }
  }

  private handlePopulateOmnibox(args: IPopulateOmniboxEventArgs) {
    Assert.exists(args);

    let valueToSearch = args.completeQueryExpression.word;
    let promise = new Promise(resolve => {
      this.queryController
        .getEndpoint()
        .listFieldValues(this.buildListFieldValueRequest(valueToSearch))
        .then((results: IIndexFieldValue[]) => {
          let element = this.suggestionForOmnibox.buildOmniboxElement(results, args);
          this.currentlyDisplayedSuggestions = {};
          if (element) {
            _.map($$(element).findAll('.coveo-omnibox-selectable'), (selectable, i?) => {
              this.currentlyDisplayedSuggestions[$$(selectable).text()] = {
                element: selectable,
                pos: i
              };
            });
            resolve({
              element: element,
              zIndex: this.options.omniboxZIndex
            });
          } else {
            resolve({
              element: undefined
            });
          }
        })
        .catch(() => {
          resolve({
            element: undefined
          });
        });
    });
    args.rows.push({
      deferred: promise
    });
  }

  private onRowSelection(value: string, args: IPopulateOmniboxEventArgs) {
    args.clear();
    args.closeOmnibox();
    this.queryStateModel.set(QueryStateModel.attributesEnum.q, value);
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.omniboxField, {});
    this.queryController.executeQuery();
  }

  private onRowTab(value: string, args: IPopulateOmniboxEventArgs) {
    args.clear();
    args.closeOmnibox();
    this.queryStateModel.set(QueryStateModel.attributesEnum.q, `${value}`);
    this.usageAnalytics.logCustomEvent(analyticsActionCauseList.omniboxField, {}, this.element);
  }

  private buildListFieldValueRequest(valueToSearch: string): IListFieldValuesRequest {
    return {
      field: <string>this.options.field,
      ignoreAccents: true,
      sortCriteria: 'occurrences',
      maximumNumberOfValues: this.options.numberOfSuggestions,
      patternType: 'Wildcards',
      pattern: '*' + valueToSearch + '*',
      queryOverride: this.options.queryOverride
    };
  }
}

Initialization.registerAutoCreateComponent(FieldSuggestions);
