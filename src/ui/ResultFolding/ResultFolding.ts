import {Template} from '../Templates/Template'
import {Component} from '../Base/Component'
import {IComponentBindings} from '../Base/ComponentBindings'
import {ComponentOptions} from '../Base/ComponentOptions'
import {DefaultFoldingTemplate} from './DefaultFoldingTemplate'
import {Promise} from 'es6-promise';
import {IQueryResult} from '../../rest/QueryResult'
import {Utils} from '../../utils/Utils'
import {QueryUtils} from '../../utils/QueryUtils'
import {Initialization, IInitializationParameters} from '../Base/Initialization';
import {Assert} from '../../misc/Assert'
import {$$} from '../../utils/Dom'
import {l} from '../../strings/Strings'

export interface IResultFoldingOptions {
  resultTemplate?: Template;
  normalCaption?: string;
  expandedCaption?: string;
  moreCaption?: string;
  lessCaption?: string;
  oneResultCaption?: string;
}

/**
 * This component is used to render folded result sets. It is intended to be used inside a
 * <a href='https://developers.coveo.com/display/public/JsSearchV1/Result+Templates'>Result Template</a>
 * when there is an active {@link Folding} component on the page. This component takes care of rendering
 * the parent result and its child results in a coherent manner.
 */
export class ResultFolding extends Component {
  static ID = 'ResultFolding';

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IResultFoldingOptions = {
    /**
     * Specifies the template to use to render each of the child results for a top result.<br/>
     * By default, it will use the template specified in a child element with a `<script>` tag.<br/>
     * This can be specified directly as an attribute to the element, for example :
     * ```html
     * <div class='CoveoResultFolding' data-result-template-id='Foo'></div>
     * ```
     * which will use a previously registered template ID (see {@link TemplateCache})
     */
    resultTemplate: ComponentOptions.buildTemplateOption({ defaultFunction: () => new DefaultFoldingTemplate() }),
    /**
     * Specifies the caption to show at the top of the child results when the conversation is not expanded.<br/>
     * By default, the value is undefined, which doesn't show any caption.
     */
    normalCaption: ComponentOptions.buildLocalizedStringOption(),
    /**
     * Specifies the caption to show at the top of the child results when the conversation is expanded.<br/>
     * By default, the value is undefined, which doesn't show any caption.
     */
    expandedCaption: ComponentOptions.buildLocalizedStringOption(),
    /**
     * Specifies the caption to show on the link to expand / show child results
     * The default value is the localized version of <code>ShowMore</code>.
     */
    moreCaption: ComponentOptions.buildLocalizedStringOption({ postProcessing: (value) => value || l('ShowMore') }),
    /**
     * Specifies the caption to show on the link to shrink the loaded conversation back to only the top result.
     * The default value is the localized version of <code>ShowLess</code>.
     */
    lessCaption: ComponentOptions.buildLocalizedStringOption({ postProcessing: (value) => value || l('ShowLess') }),
    /**
     * Specifies the caption to show when there is only one result in a conversation.
     * The default value is the localized version of <code>DisplayingTheOnlyMessage</code>.
     */
    oneResultCaption: ComponentOptions.buildLocalizedStringOption({ postProcessing: (value) => value || l('DisplayingTheOnlyMessage') })
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

  constructor(public element: HTMLElement, public options?: IResultFoldingOptions, bindings?: IComponentBindings, public result?: IQueryResult) {
    super(element, ResultFolding.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(this.element, ResultFolding, options);

    Assert.exists(result);

    this.buildElements();
    this.displayThoseResults(this.result.childResults);
    this.updateElementVisibility();

    if (this.result.childResults.length == 0 && !this.result.moreResults) {
      $$(this.element).hide();
    }
  }

  public showMoreResults() {
    Assert.exists(this.result.moreResults);

    this.cancelAnyPendingShowMore();
    this.moreResultsPromise = this.result.moreResults();
    this.waitAnimation = $$('div', { className: 'coveo-loading-spinner' }).el;
    this.results.appendChild(this.waitAnimation);
    this.updateElementVisibility();

    this.moreResultsPromise
      .then((results?: IQueryResult[]) => {
        this.childResults = results;
        this.showingMoreResults = true;
        this.displayThoseResults(results);
        this.updateElementVisibility(results.length);
        return results;
      })
      .finally((results?: IQueryResult[]) => {
        this.moreResultsPromise = undefined;
        $$(this.waitAnimation).detach();
        this.waitAnimation = undefined;
      });
  }

  public showLessResults() {
    this.cancelAnyPendingShowMore();
    this.showingMoreResults = false;
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

      let footerIconShowMore = $$('div', { className: 'coveo-more' }, $$('span', { className: 'coveo-folding-footer-icon' }).el).el;
      let footerIconShowLess = $$('div', { className: 'coveo-less' }, $$('span', { className: 'coveo-folding-footer-icon' }).el).el;
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

  private displayThoseResults(results: IQueryResult[]) {
    $$(this.results).empty();
    _.each(results, (result) => {
      this.renderChildResult(result);
    });
  }

  private renderChildResult(childResult: IQueryResult) {
    QueryUtils.setStateObjectOnQueryResult(this.queryStateModel.get(), childResult);

    let oneChild = this.options.resultTemplate.instantiateToElement(childResult)
    $$(oneChild).addClass('coveo-result-folding-child-result');
    this.results.appendChild(oneChild);

    $$(oneChild).toggleClass('coveo-normal-child-result', !this.showingMoreResults);
    $$(oneChild).toggleClass('coveo-expanded-child-result', this.showingMoreResults);
    this.autoCreateComponentsInsideResult(oneChild, childResult);
  }

  private autoCreateComponentsInsideResult(element: HTMLElement, result: IQueryResult) {
    Assert.exists(element);

    let initOptions = this.searchInterface.options;
    let initParameters: IInitializationParameters = { options: initOptions, bindings: this.getBindings(), result: result }
    Initialization.automaticallyCreateComponentsInside(element, initParameters);
  }

  private cancelAnyPendingShowMore() {
    if (this.moreResultsPromise) {
      this.moreResultsPromise = undefined;
    }

    Assert.doesNotExists(this.moreResultsPromise);
    Assert.doesNotExists(this.waitAnimation);
  }
}

Initialization.registerAutoCreateComponent(ResultFolding);
