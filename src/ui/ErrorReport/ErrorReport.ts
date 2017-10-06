import { Component } from '../Base/Component';
import { ComponentOptions } from '../Base/ComponentOptions';
import { Dom, $$ } from '../../utils/Dom';
import { IComponentBindings } from '../Base/ComponentBindings';
import { QueryEvents, IQueryErrorEventArgs } from '../../events/QueryEvents';
import { analyticsActionCauseList, IAnalyticsNoMeta } from '../Analytics/AnalyticsActionListMeta';
import { l } from '../../strings/Strings';
import { Assert } from '../../misc/Assert';
import { Initialization } from '../Base/Initialization';
import { IEndpointError } from '../../rest/EndpointError';
import { MissingAuthenticationError } from '../../rest/MissingAuthenticationError';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_ErrorReport';

export interface IErrorReportOptions {
  showDetailedError: boolean;
}

/**
 * The ErrorReport component takes care of handling fatal error when doing a query on the index / Search API.
 *
 * For example, the ErrorReport component displays a message when the service responds with a 401 or 503 error. This
 * component also renders a small text area with the JSON content of the error response, for debugging purposes.
 */
export class ErrorReport extends Component {
  static ID = 'ErrorReport';

  static doExport = () => {
    exportGlobally({
      ErrorReport: ErrorReport
    });
  };

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IErrorReportOptions = {
    /**
     * Specifies whether to display a detailed error message as a JSON in a text content area.
     *
     * Default value is `true`.
     */
    showDetailedError: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };
  private organizationId;
  private message: Dom;
  private container: Dom;
  private helpSuggestion: Dom;
  private closePopup: () => void;

  /**
   * Creates a new ErrorReport component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the ErrorReport component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options?: IErrorReportOptions, bindings?: IComponentBindings) {
    super(element, ErrorReport.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ErrorReport, options);
    this.container = $$('div', { className: 'coveo-error-report-container' });
    const title = $$('div', { className: 'coveo-error-report-title' }, '<h1></h1><h3></h3>');
    this.element.appendChild(this.container.el);
    this.container.append(title.el);

    if (this.options.showDetailedError) {
      this.message = $$('div', {
        className: 'coveo-error-report-message'
      });
      this.container.append(this.message.el);
    }
    this.helpSuggestion = $$('div', {
      className: 'coveo-error-report-help-suggestion'
    });

    $$(this.element).hide();

    this.bind.onRootElement(QueryEvents.newQuery, () => this.handleNewQuery());
    this.bind.onRootElement(QueryEvents.queryError, (data: IQueryErrorEventArgs) => this.handleQueryError(data));
  }

  /**
   * Performs the "back" action in the browser.
   * Also logs an `errorBack` event in the usage analytics.
   */
  public back(): void {
    this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.errorBack, {}, this.root);
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.errorBack, {});
    history.back();
  }

  /**
   * Resets the current state of the query and triggers a new query.
   * Also logs an `errorClearQuery` event in the usage analytics.
   */
  public reset(): void {
    this.queryStateModel.reset();
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.errorClearQuery, {});
    this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.errorClearQuery, {}, this.root);
    this.queryController.executeQuery();
  }

  /**
   * Retries the same query, in case of a temporary service error.
   * Also logs an `errorRetry` event in the usage analytics.
   */
  public retry(): void {
    this.usageAnalytics.logSearchEvent<IAnalyticsNoMeta>(analyticsActionCauseList.errorRetry, {});
    this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(analyticsActionCauseList.errorRetry, {}, this.root);
    this.queryController.executeQuery();
  }

  private setErrorTitle(errorName?: string, helpSuggestion?: string): void {
    const errorTitle = {
      h1: errorName ? l(errorName) : l('OopsError'),
      h3: helpSuggestion ? l(helpSuggestion) : l('ProblemPersists')
    };

    const h1 = $$(this.element).find('h1');
    const h3 = $$(this.element).find('h3');
    if (h1 && h3) {
      $$(h1).text(errorTitle.h1);
      $$(h3).text(errorTitle.h3);
    }
  }

  private buildPrevious(): HTMLElement {
    const previous = $$('span', { className: 'coveo-error-report-previous' }, l('GoBack'));
    previous.on('click', () => this.back());
    return previous.el;
  }

  private buildReset(): HTMLElement {
    const reset = $$(
      'span',
      {
        className: 'coveo-error-report-clear'
      },
      l('Reset')
    );

    reset.on('click', () => this.reset());

    return reset.el;
  }

  private buildRetry(): HTMLElement {
    const retry = $$(
      'span',
      {
        className: 'coveo-error-report-retry'
      },
      l('Retry')
    );

    retry.on('click', () => this.retry());

    return retry.el;
  }

  private handleNewQuery(): void {
    $$(this.element).hide();
    if (this.closePopup != null) {
      this.closePopup();
    }
  }

  private handleQueryError(data: IQueryErrorEventArgs): void {
    Assert.exists(data);
    Assert.exists(data.error);

    if (data.endpoint.options.queryStringArguments.organizationId) {
      this.organizationId = data.endpoint.options.queryStringArguments.organizationId;
    } else {
      this.organizationId = l('CoveoOrganization');
    }

    // Do not display the panel if the error is for missing authentication. The
    // appropriate authentication provider should take care of redirecting.
    if ((<MissingAuthenticationError>data.error).isMissingAuthentication) {
      return;
    }

    switch (data.error.name) {
      case 'NoEndpointsException':
        this.options.showDetailedError = false;
        this.buildEndpointErrorElements('http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=257');
        this.setErrorTitle(l('NoEndpoints', this.organizationId), l('AddSources'));
        break;

      case 'InvalidTokenException':
        this.options.showDetailedError = false;
        this.buildEndpointErrorElements('https://developers.coveo.com/x/XICE');
        this.setErrorTitle(l('CannotAccess', this.organizationId), l('InvalidToken'));
        break;

      default:
        this.buildOptionsElement();
        this.setErrorTitle();
    }

    if (this.options.showDetailedError) {
      this.message.empty();
      const moreInfo = $$(
        'span',
        {
          className: 'coveo-error-report-more-info'
        },
        l('MoreInfo')
      );

      moreInfo.on('click', () => {
        moreInfo.empty();
        this.message.el.appendChild(this.buildErrorInfo(data.error));
      });

      this.message.el.appendChild(moreInfo.el);
    }

    $$(this.element).show();
  }

  private buildErrorInfo(data: IEndpointError): HTMLElement {
    const errorInfo = $$('div', {
      className: 'coveo-error-info'
    });

    let textArea = $$('textarea', undefined, JSON.stringify(data, null, 2));
    errorInfo.el.appendChild(textArea.el);

    const infoLabel = $$(
      'div',
      {
        className: 'coveo-error-info-label'
      },
      l('CopyPasteToSupport')
    );
    errorInfo.el.appendChild(infoLabel.el);

    return errorInfo.el;
  }

  private buildOptionsElement() {
    const oldOptions = this.container.find('.coveo-error-report-options');
    if (oldOptions) {
      $$(oldOptions).remove();
    }
    const optionsElement = $$('div', { className: 'coveo-error-report-options' });
    optionsElement.el.appendChild(this.buildPrevious());
    optionsElement.el.appendChild(this.buildReset());
    optionsElement.el.appendChild(this.buildRetry());
    this.container.append(optionsElement.el);
  }

  private buildEndpointErrorElements(helpLink: string = 'http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=254') {
    this.helpSuggestion.empty();

    const link = $$('a', {
      href: helpLink,
      className: 'coveo-error-report-help-link'
    });

    link.setHtml(l('CoveoOnlineHelp'));
    this.helpSuggestion.append(link.el);
    this.container.el.insertBefore(this.helpSuggestion.el, this.message.el);
  }
}

Initialization.registerAutoCreateComponent(ErrorReport);
