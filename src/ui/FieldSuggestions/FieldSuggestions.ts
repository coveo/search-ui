import {ISuggestionForOmniboxOptions, SuggestionForOmnibox, ISuggestionForOmniboxTemplate} from '../Misc/SuggestionForOmnibox';
import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {IComponentBindings} from '../Base/ComponentBindings';
import {Assert} from '../../misc/Assert';
import {Utils} from '../../utils/Utils';
import {OmniboxEvents, IPopulateOmniboxEventArgs} from '../../events/OmniboxEvents';
import {IIndexFieldValue} from '../../rest/FieldValue';
import {IListFieldValuesRequest} from '../../rest/ListFieldValuesRequest';
import {QueryStateModel} from '../../models/QueryStateModel';
import {Initialization} from '../Base/Initialization';
import {IOmniboxDataRow} from '../Omnibox/OmniboxInterface';
import {analyticsActionCauseList, IAnalyticsNoMeta} from '../Analytics/AnalyticsActionListMeta';
import {l} from '../../strings/Strings';
import {$$} from '../../utils/Dom';

export interface IFieldSuggestionsOptions extends ISuggestionForOmniboxOptions {
  field?: string;
  queryOverride?: string;
}

/**
 * This component provides query suggestions based on a particular facet field.
 * For example, this can be used to provide auto-complete suggestions when you type in document titles.
 */
export class FieldSuggestions extends Component {
  static ID = 'FieldSuggestions';

  /**
   * @componentOptions
   */
  static options: IFieldSuggestionsOptions = {
    /**
     * Specifies the field from which suggestions are provided.<br/>
     * This is a required option
     */
    field: ComponentOptions.buildFieldOption({ required: true }),
    /**
     * Specifies a query override (any query expression) which should be applied when retrieving suggestions
     */
    queryOverride: ComponentOptions.buildStringOption({ defaultValue: '' }),
    /**
     * Specifies the position at which the suggestions should render when there are multiple suggestions providers. (eg : {@link Facet} or {@link AnalyticsSuggestions}).<br/>
     * The default value is `51`
     */
    omniboxZIndex: ComponentOptions.buildNumberOption({ defaultValue: 51, min: 0 }),
    headerTitle: ComponentOptions.buildLocalizedStringOption({ defaultValue: l('SuggestedResults') }),
    /**
     * Specifies the number of suggestions that should be rendered in the omnibox.<br/>
     * Default value is `5`
     */
    numberOfSuggestions: ComponentOptions.buildNumberOption({ defaultValue: 5, min: 1 })
  };

  private suggestionForOmnibox: SuggestionForOmnibox;
  private currentlyDisplayedSuggestions: { [suggestion: string]: { element: HTMLElement, pos: number } };

  /**
   * Create a new FieldSuggestions component
   * @param element
   * @param options
   * @param bindings
   */
  constructor(element: HTMLElement, public options: IFieldSuggestionsOptions, bindings?: IComponentBindings) {
    super(element, FieldSuggestions.ID, bindings);

    if (this.options && 'omniboxSuggestionOptions' in this.options) {
      this.options = _.extend(this.options, this.options['omniboxSuggestionOptions'])
    }

    this.options = ComponentOptions.initComponentOptions(element, FieldSuggestions, options);

    Assert.check(Utils.isCoveoField(this.options.field), this.options.field + ' is not a valid field');

    this.options.onSelect = this.options.onSelect || this.onRowSelection;

    let rowTemplate = _.template(`<div class='magic-box-suggestion coveo-omnibox-selectable coveo-top-field-suggestion-row'><%= data %></div>`);

    let suggestionStructure: ISuggestionForOmniboxTemplate;
    if (this.searchInterface.isNewDesign()) {
      suggestionStructure = {
        row: rowTemplate
      };
    } else {
      let headerTemplate = _.template(`<div class='coveo-top-field-suggestion-header'><span class='coveo-icon-top-field'></span><span class='coveo-caption'><%= headerTitle %></span></div>`);
      suggestionStructure = {
        header: { template: headerTemplate, title: this.options.headerTitle },
        row: rowTemplate
      };
    }

    this.suggestionForOmnibox = new SuggestionForOmnibox(suggestionStructure, (value: string, args: IPopulateOmniboxEventArgs) => {
      this.options.onSelect.call(this, value, args);
    });
    this.bind.onRootElement(OmniboxEvents.populateOmnibox, (args: IPopulateOmniboxEventArgs) => this.handlePopulateOmnibox(args));
  }

  /**
   * Select a currently displayed suggestion. This means that at least one suggestion must have been returned at least once.
   * The suggestion parameter can either be a number (0 based index of the suggestion to select) or a string that match the suggestion
   * @param suggestion
   */
  public selectSuggestion(suggestion: number);
  public selectSuggestion(suggestion: string);
  public selectSuggestion(suggestion: any) {
    if (this.currentlyDisplayedSuggestions) {
      if (isNaN(suggestion)) {
        if (this.currentlyDisplayedSuggestions[suggestion]) {
          $$(this.currentlyDisplayedSuggestions[suggestion].element).trigger('click');
        }
      } else {
        let currentlySuggested = <{ element: HTMLElement, pos: number }>_.findWhere(<any>this.currentlyDisplayedSuggestions, { pos: suggestion });
        if (currentlySuggested) {
          $$(currentlySuggested.element).trigger('click');
        }
      }
    }
  }

  private handlePopulateOmnibox(args: IPopulateOmniboxEventArgs) {
    Assert.exists(args);

    let valueToSearch = args.completeQueryExpression.word;
    let promise = new Promise((resolve) => {
      this.queryController.getEndpoint().listFieldValues(this.buildListFieldValueRequest(valueToSearch)).then((results: IIndexFieldValue[]) => {
        let element = this.suggestionForOmnibox.buildOmniboxElement(results, args);
        this.currentlyDisplayedSuggestions = {};
        _.map($$(element).findAll('.coveo-omnibox-selectable'), (selectable, i?) => {
          this.currentlyDisplayedSuggestions[$$(selectable).text()] = {
            element: selectable,
            pos: i
          }
        })
        resolve({
          element: element,
          zIndex: this.options.omniboxZIndex
        })
      }).catch(() => {
        resolve({
          element: undefined
        })
      });
    })
    args.rows.push({
      deferred: promise
    })
  }

  private onRowSelection(value: string, args: IPopulateOmniboxEventArgs) {
    args.clear();
    args.closeOmnibox();
    this.queryStateModel.set(QueryStateModel.attributesEnum.q, value);
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.omniboxField, {})
    this.queryController.executeQuery();
  }

  private buildListFieldValueRequest(valueToSearch: string): IListFieldValuesRequest {
    return {
      field: this.options.field,
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
