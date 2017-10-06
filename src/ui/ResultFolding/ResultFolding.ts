import { Template } from '../Templates/Template';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { DefaultFoldingTemplate } from './DefaultFoldingTemplate';
import { IQueryResult } from '../../rest/QueryResult';
import { Utils } from '../../utils/Utils';
import { QueryUtils } from '../../utils/QueryUtils';
import { Initialization, IInitializationParameters, IInitResult } from '../Base/Initialization';
import { Assert } from '../../misc/Assert';
import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import { analyticsActionCauseList, IAnalyticsDocumentViewMeta } from '../Analytics/AnalyticsActionListMeta';

import 'styling/_ResultFolding';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

export interface IResultFoldingOptions {
  resultTemplate?: Template;
  normalCaption?: string;
  expandedCaption?: string;
  moreCaption?: string;
  lessCaption?: string;
  oneResultCaption?: string;
}

/**
 * The `ResultFolding` component renders folded result sets. It is usable inside a result template when there is an
 * active [`Folding`]{@link Folding} component in the page. This component takes care of rendering the parent result and
 * its child results in a coherent manner.
 *
 * This component is a result template component (see [Result Templates](https://developers.coveo.com/x/aIGfAQ)).
 *
 * See [Folding Results](https://developers.coveo.com/x/7hUvAg).
 */
export class ResultFolding extends Component {
  static ID = 'ResultFolding';

  static doExport = () => {
    exportGlobally({
      ResultFolding: ResultFolding,
      DefaultFoldingTemplate: DefaultFoldingTemplate
    });
  };

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IResultFoldingOptions = {
    /**
     * Specifies the template to use to render each of the child results for a top result.
     *
     * You can specify a previously registered template to use either by referring to its HTML `id` attribute or to a
     * CSS selector (see {@link TemplateCache}).
     *
     * **Example:**
     *
     * Specifying a previously registered template by referring to its HTML `id` attribute:
     *
     * ```html
     * <span class="CoveoResultFolding" data-result-template-id="Foo"></span>
     * ```
     *
     * Specifying a previously registered template by referring to a CSS selector:
     *
     * ```html
     * <span class='CoveoResultFolding' data-result-template-selector="#Foo"></span>
     * ```
     *
     * If you do not specify a custom folding template, the component uses the default result folding template.
     */
    resultTemplate: ComponentOptions.buildTemplateOption({ defaultFunction: () => new DefaultFoldingTemplate() }),

    /**
     * Specifies the caption to display at the top of the child results when the folding result set is not expanded.
     *
     * Default value is `undefined`, which displays no caption.
     */
    normalCaption: ComponentOptions.buildLocalizedStringOption(),

    /**
     * Specifies the caption to display at the top of the child results when the folding result set is expanded.
     *
     * Default value is `undefined`, which displays no caption.
     */
    expandedCaption: ComponentOptions.buildLocalizedStringOption(),

    /**
     * Specifies the caption to display on the link to expand / show child results.
     *
     * Default value is the localized string for `ShowMore`.
     */
    moreCaption: ComponentOptions.buildLocalizedStringOption({ postProcessing: value => value || l('ShowMore') }),

    /**
     * Specifies the caption to display on the link to shrink the loaded folding result set back to only the top result.
     *
     * Default value is the localized string for `ShowLess`.
     */
    lessCaption: ComponentOptions.buildLocalizedStringOption({ postProcessing: value => value || l('ShowLess') }),

    /**
     * Specifies the caption to display when there is only one result in a folding result set.
     *
     * Default value is the localized string for `DisplayingTheOnlyMessage`
     */
    oneResultCaption: ComponentOptions.buildLocalizedStringOption({
      postProcessing: value => value || l('DisplayingTheOnlyMessage')
    })
  };

  private normalCaption: HTMLElement;
  private expandedCaption: HTMLElement;
  private oneResultCaption: HTMLElement;
  private results: HTMLElement;
  private showMore: HTMLElement;
  private showLess: HTMLElement;
  private waitAnimation: HTMLElement;
  private moreResultsPromise: Promise<IQueryResult[]>;
  private showingMoreResults = false;

  public childResults: IQueryResult[];

  /**
   * Creates a new ResultFolding component.
   * @param options The options for the ResultFolding component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   * @param result The result to associate the component with.
   */
  constructor(
    public element: HTMLElement,
    public options?: IResultFoldingOptions,
    bindings?: IComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, ResultFolding.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(this.element, ResultFolding, options);

    Assert.exists(result);

    this.buildElements();
    this.displayThoseResults(this.result.childResults).then(() => {
      this.updateElementVisibility();

      if ($$(this.element.parentElement).hasClass('CoveoCardOverlay')) {
        this.bindOverlayEvents();
      }

      if (this.result.childResults.length == 0 && !this.result.moreResults) {
        $$(this.element).hide();
      }
    });
  }

  /**
   * Show more results by fetching additional results from the index, which match the current folded conversation.
   * This is the equivalent of clicking "Show all conversation".
   * @returns {Promise<IQueryResult[]>}
   */
  public showMoreResults() {
    Assert.exists(this.result.moreResults);

    this.cancelAnyPendingShowMore();
    this.moreResultsPromise = this.result.moreResults();
    this.waitAnimation = $$('div', { className: 'coveo-loading-spinner' }).el;
    this.results.appendChild(this.waitAnimation);
    this.updateElementVisibility();

    let ret = this.moreResultsPromise.then((results?: IQueryResult[]) => {
      this.childResults = results;
      this.showingMoreResults = true;
      this.usageAnalytics.logClickEvent<IAnalyticsDocumentViewMeta>(
        analyticsActionCauseList.foldingShowMore,
        this.getAnalyticsMetadata(),
        this.result,
        this.element
      );
      return this.displayThoseResults(results).then(() => {
        this.updateElementVisibility(results.length);
        return results;
      });
    });

    ret.finally(() => {
      this.moreResultsPromise = undefined;
      $$(this.waitAnimation).detach();
      this.waitAnimation = undefined;
    });

    return ret;
  }

  /**
   * Show less results for a given conversation. This is the equivalent of clicking "Show less"
   */
  public showLessResults() {
    this.cancelAnyPendingShowMore();
    this.showingMoreResults = false;
    this.usageAnalytics.logCustomEvent<IAnalyticsDocumentViewMeta>(
      analyticsActionCauseList.foldingShowLess,
      this.getAnalyticsMetadata(),
      this.element
    );
    this.displayThoseResults(this.result.childResults);
    this.updateElementVisibility();
    this.scrollToResultElement();
  }

  private buildElements() {
    this.buildHeader();
    this.buildResults();
    this.buildFooter();
  }

  private buildHeader() {
    let header = $$('div', { className: 'coveo-folding-header' }).el;
    this.element.appendChild(header);
    if (this.options.normalCaption != undefined && this.options.expandedCaption != undefined) {
      this.normalCaption = $$('div', { className: 'coveo-folding-normal-caption' }, this.options.normalCaption).el;
      header.appendChild(this.normalCaption);

      this.expandedCaption = $$('div', { className: 'coveo-folding-expanded-caption' }, this.options.expandedCaption).el;
      header.appendChild(this.expandedCaption);
    }
    this.oneResultCaption = $$('div', { className: 'coveo-folding-oneresult-caption' }, this.options.oneResultCaption).el;
    header.appendChild(this.oneResultCaption);
  }

  private buildResults() {
    this.results = $$('div', { className: 'coveo-folding-results' }).el;
    this.element.appendChild(this.results);
  }

  private buildFooter() {
    let footer = $$('div', { className: 'coveo-folding-footer' }).el;
    this.element.parentElement.appendChild(footer);

    if (this.result.moreResults) {
      this.showMore = $$('div', { className: 'coveo-folding-footer-section-for-less' }).el;
      $$(this.showMore).on('click', () => this.showMoreResults());
      footer.appendChild(this.showMore);

      this.showLess = $$('div', { className: 'coveo-folding-footer-section-for-more' }).el;
      $$(this.showLess).on('click', () => this.showLessResults());
      footer.appendChild(this.showLess);

      let footerIconShowMore = $$(
        'div',
        { className: 'coveo-folding-more' },
        $$('span', { className: 'coveo-folding-footer-icon' }, SVGIcons.icons.arrowDown).el
      ).el;
      SVGDom.addClassToSVGInContainer(footerIconShowMore, 'coveo-folding-more-svg');
      let footerIconShowLess = $$(
        'div',
        { className: 'coveo-folding-less' },
        $$('span', { className: 'coveo-folding-footer-icon' }, SVGIcons.icons.arrowUp).el
      ).el;
      SVGDom.addClassToSVGInContainer(footerIconShowLess, 'coveo-folding-less-svg');
      let showMoreLink = $$('a', { className: 'coveo-folding-show-more' }, this.options.moreCaption).el;
      let showLessLink = $$('a', { className: 'coveo-folding-show-less' }, this.options.lessCaption).el;
      this.showMore.appendChild(showMoreLink);
      this.showLess.appendChild(showLessLink);
      this.showMore.appendChild(footerIconShowMore);
      this.showLess.appendChild(footerIconShowLess);
    }
  }

  private updateElementVisibility(subResultsLength?: number) {
    if (this.normalCaption) {
      $$(this.normalCaption).toggle(!this.showingMoreResults && this.result.childResults.length > 0);
    }
    if (this.expandedCaption) {
      $$(this.expandedCaption).toggle(this.showingMoreResults);
    }
    $$(this.oneResultCaption).toggleClass('coveo-hidden', !(subResultsLength && subResultsLength == 1));

    if (this.showMore) {
      $$(this.showMore).toggle(!this.showingMoreResults && !Utils.exists(this.moreResultsPromise));
      $$(this.showLess).toggle(this.showingMoreResults);
    }

    let showIfNormal = $$(this.element).find('.coveo-show-if-normal');
    if (showIfNormal) {
      $$(showIfNormal).toggle(!this.showingMoreResults);
    }

    let showIfExpanded = $$(this.element).find('.coveo-show-if-expanded');
    if (showIfExpanded) {
      $$(showIfExpanded).toggle(this.showingMoreResults);
    }
  }

  private scrollToResultElement() {
    let resultElem = $$(this.element).closest('CoveoResult');
    window.scrollTo(0, window.scrollY + resultElem.getBoundingClientRect().top);
  }

  private displayThoseResults(results: IQueryResult[]): Promise<boolean> {
    const childResultsPromises = _.map(results, result => {
      return this.renderChildResult(result);
    });

    return Promise.all(childResultsPromises).then((childsToAppend: HTMLElement[]) => {
      $$(this.results).empty();
      _.each(childsToAppend, oneChild => {
        this.results.appendChild(oneChild);
      });
      return true;
    });
  }

  private renderChildResult(childResult: IQueryResult): Promise<HTMLElement> {
    QueryUtils.setStateObjectOnQueryResult(this.queryStateModel.get(), childResult);
    QueryUtils.setSearchInterfaceObjectOnQueryResult(this.searchInterface, childResult);

    return this.options.resultTemplate
      .instantiateToElement(childResult, {
        wrapInDiv: false,
        checkCondition: false,
        responsiveComponents: this.searchInterface.responsiveComponents
      })
      .then((oneChild: HTMLElement) => {
        $$(oneChild).addClass('coveo-result-folding-child-result');

        $$(oneChild).toggleClass('coveo-normal-child-result', !this.showingMoreResults);
        $$(oneChild).toggleClass('coveo-expanded-child-result', this.showingMoreResults);
        return this.autoCreateComponentsInsideResult(oneChild, childResult).initResult.then(() => {
          return oneChild;
        });
      });
  }

  private autoCreateComponentsInsideResult(element: HTMLElement, result: IQueryResult): IInitResult {
    Assert.exists(element);

    let initOptions = this.searchInterface.options;
    let initParameters: IInitializationParameters = {
      options: initOptions,
      bindings: this.getBindings(),
      result: result
    };
    return Initialization.automaticallyCreateComponentsInside(element, initParameters);
  }

  private cancelAnyPendingShowMore() {
    if (this.moreResultsPromise) {
      this.moreResultsPromise = undefined;
    }

    Assert.doesNotExists(this.moreResultsPromise);
    Assert.doesNotExists(this.waitAnimation);
  }

  private bindOverlayEvents() {
    this.bind.one(this.element.parentElement, 'openCardOverlay', () => {
      if (this.result.moreResults) {
        this.showMoreResults();
      }
    });
  }

  private getAnalyticsMetadata(): IAnalyticsDocumentViewMeta {
    return {
      documentURL: this.result.clickUri,
      documentTitle: this.result.title,
      author: Utils.getFieldValue(this.result, 'author')
    };
  }
}

Initialization.registerAutoCreateComponent(ResultFolding);
