import 'styling/_ResultsPerPage';
import * as _ from 'underscore';
import { InitializationEvents } from '../../events/InitializationEvents';
import { INoResultsEventArgs, IQuerySuccessEventArgs, QueryEvents } from '../../events/QueryEvents';
import { ResultListEvents } from '../../events/ResultListEvents';
import { exportGlobally } from '../../GlobalExports';
import { Assert } from '../../misc/Assert';
import { IAttributeChangedEventArg, MODEL_EVENTS } from '../../models/Model';
import { QueryStateModel, QUERY_STATE_ATTRIBUTES } from '../../models/QueryStateModel';
import { l } from '../../strings/Strings';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { DeviceUtils } from '../../utils/DeviceUtils';
import { $$ } from '../../utils/Dom';
import { ResultListUtils } from '../../utils/ResultListUtils';
import { analyticsActionCauseList, IAnalyticsActionCause, IAnalyticsResultsPerPageMeta } from '../Analytics/AnalyticsActionListMeta';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { QueryUtils } from '../../Core';

export interface IResultsPerPageOptions {
  choicesDisplayed?: number[];
  initialChoice?: number;
}

/**
 * The ResultsPerPage component attaches itself to a `div` and allows the end user to choose how many results to
 * display per page.
 *
 * **Note:** Adding a ResultPerPage component to your page overrides the value of
 * {@link SearchInterface.options.resultsPerPage}.
 */
export class ResultsPerPage extends Component {
  static ID = 'ResultsPerPage';

  static doExport = () => {
    exportGlobally({
      ResultsPerPage: ResultsPerPage
    });
  };

  /**
   * The options for the ResultsPerPage
   * @componentOptions
   */
  static options: IResultsPerPageOptions = {
    /**
     * Specifies the possible values of number of results to display per page that the end user can select from.
     *
     * See also {@link ResultsPerPage.options.initialChoice}.
     *
     * Default value is `[10, 25, 50, 100]`.
     */
    choicesDisplayed: ComponentOptions.buildCustomListOption<number[]>(
      function(list: string[]) {
        const values = _.map(list, function(value) {
          return parseInt(value, 10);
        });
        return values.length == 0 ? null : values;
      },
      {
        defaultFunction: () => {
          if (DeviceUtils.isMobileDevice()) {
            return [10, 25, 50];
          } else {
            return [10, 25, 50, 100];
          }
        }
      }
    ),
    /**
     * Specifies the value to select by default for the number of results to display per page.
     *
     * Default value is the first value of {@link ResultsPerPage.options.choicesDisplayed}.
     */
    initialChoice: ComponentOptions.buildNumberOption()
  };

  private currentResultsPerPage: number;
  private span: HTMLElement;
  private list: HTMLElement;

  /**
   * Creates a new ResultsPerPage. The component renders itself on every query success.
   * @param element The HTMLElement on which to instantiate the component (normally a `div`).
   * @param options The options for the ResultsPerPage component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IResultsPerPageOptions, bindings?: IComponentBindings) {
    super(element, ResultsPerPage.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ResultsPerPage, options);

    this.bind.onRootElement(InitializationEvents.afterInitialization, () => this.resolveInitialState());
    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.queryError, () => this.handleQueryError());
    this.bind.onRootElement(QueryEvents.noResults, (args: INoResultsEventArgs) => this.handleNoResults());
    this.bind.onQueryState(MODEL_EVENTS.CHANGE_ONE, QUERY_STATE_ATTRIBUTES.NUMBER_OF_RESULTS, (args: IAttributeChangedEventArg) =>
      this.handleQueryStateModelChanged(args)
    );
    this.addAlwaysActiveListeners();

    this.initComponent();
  }

  /**
   * Sets the current number of results per page, then executes a query.
   *
   * Also logs an event in the usage analytics (`pagerResize` by default) with the new current number of results per
   * page as meta data.
   * @param resultsPerPage The new number of results per page to select.
   * @param analyticCause The event to log in the usage analytics.
   */
  public setResultsPerPage(resultsPerPage: number, analyticCause: IAnalyticsActionCause = analyticsActionCauseList.pagerResize) {
    Assert.exists(resultsPerPage);
    Assert.check(this.isValidChoice(resultsPerPage), 'The specified number of results is not available in the options.');

    this.updateResultsPerPage(resultsPerPage);
    this.updateQueryStateModelResultsPerPage();
    this.logAnalyticsEvent(analyticCause);
    this.executeQuery();
  }

  /**
   * Returns the current number of results per page.
   */
  public get resultsPerPage() {
    return this.currentResultsPerPage;
  }

  private updateResultsPerPage(resultsPerPage: number) {
    this.queryController.options.resultsPerPage = resultsPerPage;
    this.searchInterface.resultsPerPage = resultsPerPage;
    this.currentResultsPerPage = resultsPerPage;
  }

  private updateQueryStateModelResultsPerPage() {
    this.queryStateModel.set(QueryStateModel.attributesEnum.numberOfResults, this.currentResultsPerPage);
  }

  private logAnalyticsEvent(analyticCause: IAnalyticsActionCause) {
    this.usageAnalytics.logCustomEvent<IAnalyticsResultsPerPageMeta>(
      analyticCause,
      { currentResultsPerPage: this.currentResultsPerPage },
      this.element
    );
  }

  private executeQuery() {
    this.queryController.executeQuery({
      ignoreWarningSearchEvent: true,
      keepLastSearchUid: true,
      origin: this
    });
  }

  private handleQueryStateModelChanged(args: IAttributeChangedEventArg) {
    const valueToSet = args.value;

    if (!this.isValidChoice(valueToSet)) {
      this.logInvalidConfiguredChoiceWarning(valueToSet);
      this.resolveInitialState();
    } else {
      this.updateResultsPerPage(valueToSet);
    }
  }

  private addAlwaysActiveListeners() {
    this.searchInterface.element.addEventListener(ResultListEvents.newResultsDisplayed, () =>
      ResultListUtils.hideIfInfiniteScrollEnabled(this)
    );
  }

  private resolveInitialState() {
    this.updateResultsPerPage(this.getInitialChoice());
    this.updateQueryStateModelResultsPerPage();
  }

  private getInitialChoice(): number {
    const firstDisplayedChoice = this.options.choicesDisplayed[0];
    const configuredChoice = this.options.initialChoice;
    const queryStateModelChoice = this.queryStateModel.get(QueryStateModel.attributesEnum.numberOfResults);
    const queryStateModelChoiceIsNotDefault = queryStateModelChoice !== QueryStateModel.defaultAttributes.numberOfResults;

    if (queryStateModelChoiceIsNotDefault && this.isValidChoice(queryStateModelChoice)) {
      return queryStateModelChoice;
    }

    if (configuredChoice !== undefined) {
      if (this.isValidChoice(configuredChoice)) {
        return configuredChoice;
      }
      this.logInvalidConfiguredChoiceWarning(configuredChoice);
    }

    return firstDisplayedChoice;
  }

  private isValidChoice(choice: number) {
    return this.options.choicesDisplayed.indexOf(choice) !== -1;
  }

  private logInvalidConfiguredChoiceWarning(configuredChoice: number) {
    const validChoices = this.options.choicesDisplayed;

    this.logger.warn(
      `The choice ${configuredChoice} is not within the choices displayed. Consider setting a value that is valid: ${validChoices}. The first choice will be selected instead.`
    );
  }

  private initComponent() {
    this.span = $$(
      'span',
      {
        id: `coveo-results-per-page-text-${QueryUtils.createGuid()}`,
        className: 'coveo-results-per-page-text'
      },
      l('ResultsPerPage')
    ).el;
    this.element.appendChild(this.span);
    this.list = $$('ul', {
      className: 'coveo-results-per-page-list',
      role: 'group',
      'aria-labelledby': this.span.id
    }).el;
    this.element.appendChild(this.list);
  }

  private render() {
    $$(this.span).removeClass('coveo-results-per-page-no-results');
    const numResultsList: number[] = this.options.choicesDisplayed;
    for (var i = 0; i < numResultsList.length; i++) {
      const listItem = $$('li', {
        className: 'coveo-results-per-page-list-item',
        tabindex: 0
      }).el;
      const resultsPerPage = numResultsList[i];
      if (resultsPerPage === this.currentResultsPerPage) {
        $$(listItem).addClass('coveo-active');
      }

      const clickAction = () => this.handleClickPage(resultsPerPage);

      new AccessibleButton()
        .withElement(listItem)
        .withLabel(l('DisplayResultsPerPage', numResultsList[i].toString()))
        .withClickAction(clickAction)
        .withEnterKeyboardAction(clickAction)
        .build();

      listItem.appendChild(
        $$(
          'a',
          {
            className: 'coveo-results-per-page-list-item-text'
          },
          numResultsList[i].toString()
        ).el
      );
      this.list.appendChild(listItem);
    }
  }

  private handleQueryError() {
    this.reset();
  }

  private handleNoResults() {
    this.reset();
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    if (this.searchInterface.isResultsPerPageModifiedByPipeline) {
      this.logger.info('Results per page was modified by backend code (query pipeline). ResultsPerPage component will be hidden', this);
      this.reset();
      const resultsPerPage = this.getInitialChoice();
      this.updateResultsPerPage(resultsPerPage);
      return;
    }

    if (data.results.results.length != 0) {
      this.reset();
      this.render();
    }
  }

  private handleClickPage(resultsPerPage: number) {
    Assert.exists(resultsPerPage);
    this.setResultsPerPage(resultsPerPage);
  }

  private reset() {
    $$(this.span).addClass('coveo-results-per-page-no-results');
    $$(this.list).empty();
  }
}

Initialization.registerAutoCreateComponent(ResultsPerPage);
