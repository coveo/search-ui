import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Initialization } from '../Base/Initialization';
import { QueryEvents, IQuerySuccessEventArgs, INoResultsEventArgs } from '../../events/QueryEvents';
import { analyticsActionCauseList, IAnalyticsResultsPerPageMeta, IAnalyticsActionCause } from '../Analytics/AnalyticsActionListMeta';
import { Assert } from '../../misc/Assert';
import { $$ } from '../../utils/Dom';
import { KeyboardUtils, KEYBOARD } from '../../utils/KeyboardUtils';
import { DeviceUtils } from '../../utils/DeviceUtils';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import { l } from '../../strings/Strings';

import 'styling/_ResultsPerPage';

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
        let values = _.map(list, function(value) {
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

    this.currentResultsPerPage = this.getInitialChoice();
    this.queryController.options.resultsPerPage = this.currentResultsPerPage;

    this.bind.onRootElement(QueryEvents.querySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
    this.bind.onRootElement(QueryEvents.queryError, () => this.handleQueryError());
    this.bind.onRootElement(QueryEvents.noResults, (args: INoResultsEventArgs) => this.handleNoResults());
    this.initComponent(element);
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
    Assert.check(
      this.options.choicesDisplayed.indexOf(resultsPerPage) != -1,
      'The specified number of results is not available in the options.'
    );
    this.currentResultsPerPage = resultsPerPage;
    this.queryController.options.resultsPerPage = this.currentResultsPerPage;
    this.usageAnalytics.logCustomEvent<IAnalyticsResultsPerPageMeta>(
      analyticCause,
      { currentResultsPerPage: this.currentResultsPerPage },
      this.element
    );
    this.queryController.executeQuery({
      ignoreWarningSearchEvent: true,
      keepLastSearchUid: true,
      origin: this
    });
  }

  private getInitialChoice(): number {
    let initialChoice = this.options.choicesDisplayed[0];
    if (this.options.initialChoice !== undefined) {
      if (this.options.choicesDisplayed.indexOf(this.options.initialChoice) > -1) {
        initialChoice = this.options.initialChoice;
      } else {
        this.logger.warn(
          'The initial number of results is not within the choices displayed. Consider setting a value that can be selected. The first choice will be selected instead.'
        );
      }
    }
    return initialChoice;
  }

  private initComponent(element: HTMLElement) {
    this.span = $$(
      'span',
      {
        className: 'coveo-results-per-page-text'
      },
      l('ResultsPerPage')
    ).el;
    element.appendChild(this.span);
    this.list = $$('ul', {
      className: 'coveo-results-per-page-list'
    }).el;
    element.appendChild(this.list);
  }

  private render() {
    $$(this.span).removeClass('coveo-results-per-page-no-results');
    let numResultsList: number[] = this.options.choicesDisplayed;
    for (var i = 0; i < numResultsList.length; i++) {
      let listItem = $$('li', {
        className: 'coveo-results-per-page-list-item',
        tabindex: 0
      });
      if (numResultsList[i] == this.currentResultsPerPage) {
        listItem.addClass('coveo-active');
      }

      ((resultsPerPage: number) => {
        let clickAction = () => this.handleClickPage(numResultsList[resultsPerPage]);
        listItem.on('click', clickAction);
        listItem.on('keyup', KeyboardUtils.keypressAction(KEYBOARD.ENTER, clickAction));
      })(i);

      listItem.el.appendChild(
        $$(
          'a',
          {
            className: 'coveo-results-per-page-list-item-text'
          },
          numResultsList[i].toString()
        ).el
      );
      this.list.appendChild(listItem.el);
    }
  }

  private handleQueryError() {
    this.reset();
  }

  private handleNoResults() {
    this.reset();
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
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
