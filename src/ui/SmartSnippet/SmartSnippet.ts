import { ModalBox as ModalBoxModule } from '../../ExternalModulesShim';
import { exportGlobally } from '../../GlobalExports';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { QueryEvents, Initialization, $$ } from '../../Core';
import { IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { IQuestionAnswerResponse } from '../../rest/QuestionAnswerResponse';
import 'styling/_SmartSnippet';
import { find, map, flatten, compact } from 'underscore';
import { IQueryResult } from '../../rest/QueryResult';
import { UserFeedbackBanner } from './UserFeedbackBanner';
import {
  analyticsActionCauseList,
  IAnalyticsNoMeta,
  IAnalyticsSmartSnippetFeedbackMeta,
  AnalyticsSmartSnippetFeedbackReason
} from '../Analytics/AnalyticsActionListMeta';
import { HeightLimiter } from './HeightLimiter';
import { ExplanationModal, IReason } from './ExplanationModal';
import { l } from '../../strings/Strings';
import { attachShadow } from '../../misc/AttachShadowPolyfill';
import { Utils } from '../../utils/Utils';
import { ComponentOptions } from '../Base/ComponentOptions';
import { getDefaultSnippetStyle } from './SmartSnippetCommon';
import { ResultLink } from '../ResultLink/ResultLink';
import { IFieldOption } from '../Base/IComponentOptions';

interface ISmartSnippetReason {
  analytics: AnalyticsSmartSnippetFeedbackReason;
  localeKey: string;
  hasDetails?: boolean;
}

const reasons: ISmartSnippetReason[] = [
  {
    analytics: AnalyticsSmartSnippetFeedbackReason.DoesNotAnswer,
    localeKey: 'UsefulnessFeedbackDoesNotAnswer'
  },
  {
    analytics: AnalyticsSmartSnippetFeedbackReason.PartiallyAnswers,
    localeKey: 'UsefulnessFeedbackPartiallyAnswers'
  },
  {
    analytics: AnalyticsSmartSnippetFeedbackReason.WasNotAQuestion,
    localeKey: 'UsefulnessFeedbackWasNotAQuestion'
  },
  {
    analytics: AnalyticsSmartSnippetFeedbackReason.Other,
    localeKey: 'Other',
    hasDetails: true
  }
];

const BASE_CLASSNAME = 'coveo-smart-snippet';
const QUESTION_CLASSNAME = `${BASE_CLASSNAME}-question`;
const ANSWER_CONTAINER_CLASSNAME = `${BASE_CLASSNAME}-answer`;
const HAS_ANSWER_CLASSNAME = `${BASE_CLASSNAME}-has-answer`;
const SHADOW_CLASSNAME = `${BASE_CLASSNAME}-content`;
const CONTENT_CLASSNAME = `${BASE_CLASSNAME}-content-wrapper`;
const SOURCE_CLASSNAME = `${BASE_CLASSNAME}-source`;
const SOURCE_TITLE_CLASSNAME = `${SOURCE_CLASSNAME}-title`;
const SOURCE_URL_CLASSNAME = `${SOURCE_CLASSNAME}-url`;

export const SmartSnippetClassNames = {
  QUESTION_CLASSNAME,
  ANSWER_CONTAINER_CLASSNAME,
  HAS_ANSWER_CLASSNAME,
  SHADOW_CLASSNAME,
  CONTENT_CLASSNAME,
  SOURCE_CLASSNAME,
  SOURCE_TITLE_CLASSNAME,
  SOURCE_URL_CLASSNAME
};

export interface ISmartSnippetOptions {
  maximumSnippetHeight: number;
  titleField: IFieldOption;
  hrefTemplate?: string;
  useIFrame?: boolean;
}
/**
 * The SmartSnippet component displays the excerpt of a document that would be most likely to answer a particular query.
 *
 * This excerpt can be visually customized using inline styling.
 */
export class SmartSnippet extends Component {
  static ID = 'SmartSnippet';

  static doExport = () => {
    exportGlobally({
      SmartSnippet
    });
  };

  /**
   * The options for the SmartSnippet
   * @componentOptions
   */
  static options: ISmartSnippetOptions = {
    /**
     * The maximum height an answer can have in pixels.
     * Any part of an answer exceeding this height will be hidden by default and expendable via a "show more" button.
     * Default value is `250`.
     */
    maximumSnippetHeight: ComponentOptions.buildNumberOption({ defaultValue: 250, min: 0 }),

    /**
     * The field to display for the title.
     */
    titleField: ComponentOptions.buildFieldOption({ defaultValue: '@title' }),

    /**
     * Specifies a template literal from which to generate the title and URI's `href` attribute value (see
     * [Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)).
     *
     * This option overrides the [`field`]{@link SmartSnippet.options.uriField} option value.
     *
     * The template literal can reference any number of fields from the parent result. It can also reference global
     * scope properties.
     *
     * **Examples:**
     *
     * - The following markup generates an `href` value such as `http://uri.com?id=itemTitle`:
     *
     * ```html
     * <a class='CoveoSmartSnippet' data-href-template='${clickUri}?id=${raw.title}'></a>
     * ```
     *
     * - The following markup generates an `href` value such as `localhost/fooBar`:
     *
     * ```html
     * <a class='CoveoSmartSnippet' data-href-template='${window.location.hostname}/{Foo.Bar}'></a>
     * ```
     *
     * Default value is `undefined`.
     */
    hrefTemplate: ComponentOptions.buildStringOption(),

    /**
     * Specify if the SmartSnippet should be displayed inside an iframe or not.
     *
     * Use this option in specific cases where your environment has limitations around iframe usage.
     *
     * **Examples:**
     *
     * ```html
     * <div class='CoveoSmartSnippet' data-use-i-frame='true'></div>
     * ```
     *
     * Default value is `true`.
     */
    useIFrame: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  private lastRenderedResult: IQueryResult = null;
  private searchUid: string;
  private questionContainer: HTMLElement;
  private shadowContainer: HTMLElement;
  private sourceContainer: HTMLElement;
  private snippetContainer: HTMLElement;
  private heightLimiter: HeightLimiter;
  private explanationModal: ExplanationModal;
  private feedbackBanner: UserFeedbackBanner;
  private shadowLoading: Promise<HTMLElement>;

  constructor(
    public element: HTMLElement,
    public options?: ISmartSnippetOptions,
    bindings?: IComponentBindings,
    private ModalBox = ModalBoxModule
  ) {
    super(element, SmartSnippet.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, SmartSnippet, options);
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data));
  }

  public get loading() {
    return this.shadowLoading;
  }

  private get style() {
    const styles = $$(this.element)
      .children()
      .filter(element => element instanceof HTMLScriptElement && element.type.toLowerCase() === 'text/css')
      .map(element => element.innerHTML);
    return styles.length ? styles.join('\n') : null;
  }

  private set hasAnswer(hasAnswer: boolean) {
    $$(this.element).toggleClass(HAS_ANSWER_CLASSNAME, hasAnswer);
  }

  public createDom() {
    this.element.appendChild(this.buildAnswerContainer());
    this.feedbackBanner = new UserFeedbackBanner(
      isUseful => (isUseful ? this.sendLikeSmartSnippetAnalytics() : this.sendDislikeSmartSnippetAnalytics()),
      () => this.openExplanationModal()
    );
    this.element.appendChild(this.feedbackBanner.build());
    this.explanationModal = new ExplanationModal({
      reasons: reasons.map(
        reason =>
          <IReason>{
            label: l(reason.localeKey),
            id: reason.analytics.replace(/_/g, '-'),
            onSelect: () => this.sendExplanationAnalytics(reason.analytics, this.explanationModal.details),
            hasDetails: reason.hasDetails
          }
      ),
      onClosed: () => this.sendCloseFeedbackModalAnalytics(),
      ownerElement: this.searchInterface.options.modalContainer,
      modalBoxModule: this.ModalBox
    });
  }

  private buildAnswerContainer() {
    return $$(
      'div',
      {
        className: ANSWER_CONTAINER_CLASSNAME
      },
      this.buildQuestion(),
      this.buildShadow(),
      this.buildHeightLimiter(),
      this.buildSourceContainer()
    ).el;
  }

  private buildQuestion() {
    return (this.questionContainer = $$('div', { className: QUESTION_CLASSNAME }).el);
  }

  private buildShadow() {
    this.shadowContainer = $$('div', { className: SHADOW_CLASSNAME }).el;
    this.snippetContainer = $$('section', { className: CONTENT_CLASSNAME }).el;
    this.shadowLoading = attachShadow(this.shadowContainer, {
      mode: 'open',
      title: l('AnswerSnippet'),
      onSizeChanged: () => this.handleAnswerSizeChanged(),
      useIFrame: this.options.useIFrame
    }).then(shadow => {
      shadow.appendChild(this.snippetContainer);
      const style = this.buildStyle();
      shadow.appendChild(style);
      return shadow;
    });
    return this.shadowContainer;
  }

  private buildHeightLimiter() {
    return (this.heightLimiter = new HeightLimiter(
      this.shadowContainer,
      this.shadowContainer.childNodes.item(0) as HTMLElement,
      this.options.maximumSnippetHeight,
      isExpanded => (isExpanded ? this.sendExpandSmartSnippetAnalytics() : this.sendCollapseSmartSnippetAnalytics())
    )).toggleButton;
  }

  private buildSourceContainer() {
    return (this.sourceContainer = $$('div', { className: SOURCE_CLASSNAME }).el);
  }

  private buildStyle() {
    const style = Utils.isNullOrUndefined(this.style) ? getDefaultSnippetStyle(CONTENT_CLASSNAME) : this.style;
    const styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    return styleTag;
  }

  private handleAnswerSizeChanged() {
    this.heightLimiter.onContentHeightChanged();
  }

  /**
   * @warning This method only works for the demo. In practice, the source of the answer will not always be part of the results.
   */
  private getCorrespondingResult(questionAnswer: IQuestionAnswerResponse) {
    const lastResults = this.queryController.getLastResults().results;
    const childResults = flatten(map(lastResults, lastResult => lastResult.childResults)) as IQueryResult[];
    const attachments = flatten(map(lastResults, lastResult => lastResult.attachments)) as IQueryResult[];

    return find(
      compact(lastResults.concat(childResults, attachments)),
      result => result.raw[questionAnswer.documentId.contentIdKey] === questionAnswer.documentId.contentIdValue
    );
  }

  private async handleQuerySuccess(data: IQuerySuccessEventArgs) {
    const { questionAnswer } = data.results;
    if (!this.containsQuestionAnswer(questionAnswer)) {
      this.hasAnswer = false;
      return;
    }
    this.hasAnswer = true;
    this.searchUid = data.results.searchUid;
    await this.render(questionAnswer);
  }

  private containsQuestionAnswer(questionAnswer: IQuestionAnswerResponse) {
    return questionAnswer && questionAnswer.question && questionAnswer.answerSnippet;
  }

  private async render(questionAnswer: IQuestionAnswerResponse) {
    this.ensureDom();
    this.feedbackBanner.reset();
    this.questionContainer.innerText = questionAnswer.question;
    this.renderSnippet(questionAnswer.answerSnippet);
    this.lastRenderedResult = this.getCorrespondingResult(questionAnswer);
    if (this.lastRenderedResult) {
      this.renderSource();
    } else {
      this.lastRenderedResult = null;
    }
  }

  private renderSnippet(content: string) {
    this.snippetContainer.innerHTML = content;
  }

  private renderSource() {
    const container = $$(this.sourceContainer);
    container.empty();
    container.append(this.renderSourceUrl().el);
    container.append(this.renderSourceTitle().el);
  }

  private renderSourceTitle() {
    const link = this.buildLink(SOURCE_TITLE_CLASSNAME);
    link.text(Utils.getFieldValue(this.lastRenderedResult, <string>this.options.titleField));
    return link;
  }

  private renderSourceUrl() {
    const link = this.buildLink(SOURCE_URL_CLASSNAME);
    link.text((link.el as HTMLAnchorElement).href);
    return link;
  }

  private buildLink(className: string) {
    const element = $$('a', { className: 'CoveoResultLink' });
    element.addClass(className);
    new ResultLink(
      element.el,
      { hrefTemplate: this.options.hrefTemplate },
      { ...this.getBindings(), resultElement: this.element },
      this.lastRenderedResult
    );
    return element;
  }

  private openExplanationModal() {
    this.sendOpenFeedbackModalAnalytics();
    this.explanationModal.open(this.feedbackBanner.explainWhy);
  }

  private sendLikeSmartSnippetAnalytics() {
    return this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(
      analyticsActionCauseList.likeSmartSnippet,
      { searchQueryUid: this.searchUid },
      this.element
    );
  }

  private sendDislikeSmartSnippetAnalytics() {
    return this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(
      analyticsActionCauseList.dislikeSmartSnippet,
      { searchQueryUid: this.searchUid },
      this.element
    );
  }

  private sendExpandSmartSnippetAnalytics() {
    return this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(
      analyticsActionCauseList.expandSmartSnippet,
      { searchQueryUid: this.searchUid },
      this.element
    );
  }

  private sendCollapseSmartSnippetAnalytics() {
    return this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(
      analyticsActionCauseList.collapseSmartSnippet,
      { searchQueryUid: this.searchUid },
      this.element
    );
  }

  private sendOpenFeedbackModalAnalytics() {
    return this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(
      analyticsActionCauseList.openSmartSnippetFeedbackModal,
      { searchQueryUid: this.searchUid },
      this.element
    );
  }

  private sendCloseFeedbackModalAnalytics() {
    return this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(
      analyticsActionCauseList.closeSmartSnippetFeedbackModal,
      { searchQueryUid: this.searchUid },
      this.element
    );
  }

  private sendExplanationAnalytics(reason: AnalyticsSmartSnippetFeedbackReason, details?: string) {
    return this.usageAnalytics.logCustomEvent<IAnalyticsSmartSnippetFeedbackMeta>(
      analyticsActionCauseList.sendSmartSnippetReason,
      {
        searchQueryUid: this.searchUid,
        reason,
        details
      },
      this.element
    );
  }
}
Initialization.registerAutoCreateComponent(SmartSnippet);
