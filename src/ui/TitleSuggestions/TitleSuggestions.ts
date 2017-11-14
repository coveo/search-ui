import {
  ISuggestionForOmniboxOptions,
  SuggestionForOmnibox,
  ISuggestionForOmniboxTemplate,
  ISuggestionForOmniboxResult
} from '../Misc/SuggestionForOmnibox';
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
import { l } from '../../strings/Strings';
import { $$ } from '../../utils/Dom';
import { ISuggestionForOmniboxOptionsOnSelect, ISuggestionForOmniboxRowTemplateOptions } from '../Misc/SuggestionForOmnibox';
import { IStringMap } from '../../rest/GenericParam';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_FieldSuggestions';
import { DomUtils } from '../../UtilsModules';
import { Facet } from '../Facet/Facet';
import { result } from '../../Lazy';
import { SearchEndpoint } from '../../rest/SearchEndpoint';
import { EndpointCaller } from '../../rest/EndpointCaller';
import { IQueryResult } from '../../rest/QueryResult';

export interface ITitleServiceResponse {
  results: ITitleServiceResult[];
}

export interface ITitleServiceResult {
  title: string;
  clickUri: string;
  documentUniqueId: string;
}

export interface ITitleSuggestionForOmniboxResult extends ISuggestionForOmniboxResult {
  clickUri: string;
  documentUniqueId: string;
  title: string;
}

export interface ITitleSuggestionsOptions extends ISuggestionForOmniboxOptions {
  endpoint: string;
}

/**
 * The `FieldSuggestions` component provides query suggestions based on a particular facet field. For example, you could
 * use this component to provide auto-complete suggestions while the end user is typing the title of an item.
 *
 * The query suggestions provided by this component appear in the [`Omnibox`]{@link Omnibox} component.
 */
export class TitleSuggestions extends Component {
  static ID = 'TitleSuggestions';

  static doExport = () => {
    exportGlobally({
      TitleSuggestions: TitleSuggestions
    });
  };

  /**
   * @componentOptions
   */
  static options: ITitleSuggestionsOptions = {
    /**
     * Specifies the facet field from which to provide suggestions.
     *
     * Specifying a value for this option is required for the `FieldSuggestions` component to work.
     */
    endpoint: ComponentOptions.buildStringOption({
      defaultValue: 'http://localhost:3000/title'
    }),

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

  private queryStateFieldId;

  private suggestionForOmnibox: SuggestionForOmnibox<ITitleSuggestionForOmniboxResult>;
  private currentlyDisplayedSuggestions: { [suggestion: string]: { element: HTMLElement; pos: number } };

  /**
   * Creates a new `FieldSuggestions` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `FieldSuggestions` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(element: HTMLElement, public options: ITitleSuggestionsOptions, bindings?: IComponentBindings) {
    super(element, TitleSuggestions.ID, bindings);

    if (this.options && 'omniboxSuggestionOptions' in this.options) {
      this.options = _.extend(this.options, this.options['omniboxSuggestionOptions']);
    }

    this.options = ComponentOptions.initComponentOptions(element, TitleSuggestions, options);

    this.options.onSelect = this.options.onSelect || this.onRowSelection;

    const rowTemplate = (rowTemplateOptions: ISuggestionForOmniboxRowTemplateOptions<ITitleSuggestionForOmniboxResult>) => {
      const rowElement = $$('div', {
        className: 'magic-box-suggestion coveo-omnibox-selectable coveo-top-field-suggestion-row'
      });
      rowElement.el.innerHTML = `${rowTemplateOptions.result.title}`;
      return rowElement.el.outerHTML;
    };

    const suggestionStructure: ISuggestionForOmniboxTemplate = {
      row: rowTemplate
    };
    if (this.options.headerTitle != null) {
      suggestionStructure.header = { template: this.createHeaderTemplate(), title: this.options.headerTitle };
    }

    this.suggestionForOmnibox = new SuggestionForOmnibox(
      suggestionStructure,
      (result: string, args: IPopulateOmniboxEventArgs) => {
        this.options.onSelect.call(this, result, args);
      },
      (result: string, args: IPopulateOmniboxEventArgs) => {
        // this.onRowTab(result, args);
      }
    );
    this.bind.onRootElement(OmniboxEvents.populateOmnibox, (args: IPopulateOmniboxEventArgs) => this.handlePopulateOmnibox(args));
  }

  private createHeaderTemplate(): () => string {
    return () => {
      const headerElement = $$('div', {
        className: 'coveo-top-field-suggestion-header'
      });

      const iconElement = $$('span', {
        className: 'coveo-icon-top-field'
      });

      const captionElement = $$('span', {
        className: 'coveo-caption'
      });

      if (this.options.headerTitle) {
        captionElement.text(this.options.headerTitle);
      }

      headerElement.append(iconElement.el);
      headerElement.append(captionElement.el);

      return headerElement.el.outerHTML;
    };
  }

  private handlePopulateOmnibox(args: IPopulateOmniboxEventArgs) {
    Assert.exists(args);

    const valueToSearch = args.completeQueryExpression.word;
    const promise = new Promise(resolve => {
      const defaultEndpoint: SearchEndpoint = SearchEndpoint.endpoints['default'];
      const titleServiceCaller = new EndpointCaller(defaultEndpoint.options);
      titleServiceCaller
        .call({
          method: 'GET',
          requestData: {
            keyword: args.completeQueryExpression.word
          },
          errorsAsSuccess: false,
          queryString: [''],
          requestDataType: 'json',
          responseType: 'json',
          url: this.options.endpoint
        })
        .then(value => value.data)
        .then((response: ITitleServiceResponse) => {
          const results: ITitleSuggestionForOmniboxResult[] = response.results.map(result => {
            return <ITitleSuggestionForOmniboxResult>{
              clickUri: result.clickUri,
              documentUniqueId: result.documentUniqueId,
              title: result.title,
              value: result.documentUniqueId
            };
          });
          const element = this.suggestionForOmnibox.buildOmniboxElement(results, args);
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

  private onRowSelection(result: string, args: IPopulateOmniboxEventArgs) {
    const endpoint = this.queryController.getEndpoint();
    endpoint.getDocument(result).then(result => {
      this.usageAnalytics.logClickEvent(
        analyticsActionCauseList.documentOpen,
        { author: Utils.getFieldValue(result, 'author') },
        result,
        this.root
      );
      window.location.href = result.clickUri;
    });
  }
}

Initialization.registerAutoCreateComponent(TitleSuggestions);
