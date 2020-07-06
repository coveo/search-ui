import { ModalBox as ModalBoxModule } from '../../ExternalModulesShim';
import { exportGlobally } from '../../GlobalExports';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { QueryEvents, Initialization, $$ } from '../../Core';
import { IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { IQuestionAnswerResponse } from '../../rest/QuestionAnswerResponse';
import 'styling/_SmartSnippet';
import { find } from 'underscore';
import { IQueryResult } from '../../rest/QueryResult';
import { UserFeedbackBanner } from './UserFeedbackBanner';
import {
  analyticsActionCauseList,
  IAnalyticsNoMeta,
  IAnalyticsSmartSnippetContentLinkMeta,
  IAnalyticsSmartSnippetExplainWhyMeta,
  IAnalyticsSmartSnippetExplainWhyDetailedMeta
} from '../Analytics/AnalyticsActionListMeta';
import { HeightLimiter } from './HeightLimiter';
import { ExplanationModal, IExplanation } from './ExplanationModal';
import { l } from '../../strings/Strings';

interface ISmartSnippetExplaination {
  analyticsId: string;
  localizationName: string;
}

const explanations: ISmartSnippetExplaination[] = [
  {
    analyticsId: 'does_not_answer',
    localizationName: 'UsefulnessFeedbackDoesNotAnswer'
  },
  {
    analyticsId: 'is_not_useful',
    localizationName: 'UsefulnessFeedbackIsNotUseful'
  },
  {
    analyticsId: 'was_not_a_question',
    localizationName: 'UsefulnessFeedbackWasNotAQuestion'
  }
];

const BASE_CLASSNAME = 'coveo-smart-snippet';
const ANSWER_CONTAINER_CLASSNAME = `${BASE_CLASSNAME}-answer`;
const HAS_ANSWER_CLASSNAME = `${BASE_CLASSNAME}-has-answer`;
const SHADOW_CLASSNAME = `${BASE_CLASSNAME}-content`;
const CONTENT_CLASSNAME = `${BASE_CLASSNAME}-content-wrapper`;
const SOURCE_CLASSNAME = `${BASE_CLASSNAME}-source`;
const SOURCE_TITLE_CLASSNAME = `${SOURCE_CLASSNAME}-title`;
const SOURCE_URL_CLASSNAME = `${SOURCE_CLASSNAME}-url`;

export const SmartSnippetClassNames = {
  ANSWER_CONTAINER_CLASSNAME,
  HAS_ANSWER_CLASSNAME,
  SHADOW_CLASSNAME,
  CONTENT_CLASSNAME,
  SOURCE_CLASSNAME,
  SOURCE_TITLE_CLASSNAME,
  SOURCE_URL_CLASSNAME
};

export interface ISmartSnippetOptions {}

export class SmartSnippet extends Component {
  static ID = 'SmartSnippet';

  static options: ISmartSnippetOptions = {};

  static doExport = () => {
    exportGlobally({
      SmartSnippet
    });
  };

  private lastRenderedResult: IQueryResult;
  private shadowContainer: HTMLElement;
  private sourceContainer: HTMLElement;
  private snippetContainer: HTMLElement;
  private heightLimiter: HeightLimiter;
  private explanationModal: ExplanationModal;
  private feedbackBanner: UserFeedbackBanner;

  constructor(
    public element: HTMLElement,
    public options?: ISmartSnippetOptions,
    bindings?: IComponentBindings,
    private ModalBox = ModalBoxModule
  ) {
    super(element, SmartSnippet.ID, bindings);
    this.bind.onRootElement(QueryEvents.querySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data));
  }

  private get style() {
    return $$(this.element)
      .children()
      .filter(element => element instanceof HTMLScriptElement && element.type.toLowerCase() === 'text/css')
      .map(element => element.innerHTML)
      .join('\n');
  }

  private set hasAnswer(hasAnswer: boolean) {
    this.element.classList.toggle(HAS_ANSWER_CLASSNAME, hasAnswer);
  }

  public createDom() {
    this.element.appendChild(this.buildAnswerContainer());
    this.feedbackBanner = new UserFeedbackBanner(
      isUseful => (isUseful ? this.sendLikeSmartSnippetAnalytics() : this.sendDislikeSmartSnippetAnalytics()),
      () => this.openExplanationModal()
    );
    this.element.appendChild(this.feedbackBanner.build());
    this.explanationModal = new ExplanationModal({
      explanations: explanations.map(
        explanation =>
          <IExplanation>{
            displayedName: l(explanation.localizationName),
            name: explanation.analyticsId,
            onSelect: () => this.sendExplainWhyAnalytics(explanation)
          }
      ),
      onClosed: () => this.sendCloseExplainWhyAnalytics(),
      onOtherExplanationGiven: details => this.sendExplainWhyDetailedAnalytics(details),
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
      this.buildShadow(),
      this.buildHeightLimiter(),
      this.buildSourceContainer()
    ).el;
  }

  private buildShadow() {
    this.shadowContainer = $$('div', { className: SHADOW_CLASSNAME }).el;
    const shadow = this.shadowContainer.attachShadow({ mode: 'open' });
    shadow.appendChild((this.snippetContainer = $$('section', { className: CONTENT_CLASSNAME }).el));
    const style = this.buildStyle();
    if (style) {
      shadow.appendChild(style);
    }
    return this.shadowContainer;
  }

  private buildHeightLimiter() {
    return (this.heightLimiter = new HeightLimiter(
      this.shadowContainer,
      400,
      isExpanded => (isExpanded ? this.sendExpandSmartSnippetAnalytics() : this.sendCollapseSmartSnippetAnalytics())
    )).toggleButton;
  }

  private buildSourceContainer() {
    return (this.sourceContainer = $$('div', { className: SOURCE_CLASSNAME }).el);
  }

  private buildStyle() {
    const style = this.style;
    if (!style) {
      return;
    }
    const styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    return styleTag;
  }

  /**
   * @warning This method only works for the demo. In practice, the source of the answer will not always be part of the results.
   */
  private getCorrespondingResult(questionAnswer: IQuestionAnswerResponse) {
    return find(
      this.queryController.getLastResults().results,
      result => result.raw[questionAnswer.documentId.contentIdKey] === questionAnswer.documentId.contentIdValue
    );
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    const { questionAnswer } = data.results;
    if (!questionAnswer) {
      this.hasAnswer = false;
      return;
    }
    this.hasAnswer = true;
    this.render(questionAnswer);
  }

  private render(questionAnswer: IQuestionAnswerResponse) {
    this.ensureDom();
    this.renderSnippet(questionAnswer.answerSnippet);
    const lastRenderedResult = this.getCorrespondingResult(questionAnswer);
    if (lastRenderedResult) {
      this.renderSource(lastRenderedResult);
    }
    this.heightLimiter.onScrollHeightChanged();
  }

  private renderSnippet(content: string) {
    this.snippetContainer.innerHTML = content;
    $$(this.snippetContainer)
      .findAll('a')
      .forEach((link: HTMLAnchorElement) => this.enableAnalyticsOnLink(link, () => this.sendOpenContentLinkAnalytics(link)));
  }

  private renderSource(source: IQueryResult) {
    $$(this.sourceContainer).empty();
    this.sourceContainer.appendChild(this.renderSourceUrl(source.clickUri));
    this.sourceContainer.appendChild(this.renderSourceTitle(source.title, source.clickUri));
  }

  private renderSourceTitle(title: string, clickUri: string) {
    return this.renderLink(title, clickUri, SOURCE_TITLE_CLASSNAME);
  }

  private renderSourceUrl(url: string) {
    return this.renderLink(url, url, SOURCE_URL_CLASSNAME);
  }

  private renderLink(text: string, href: string, className: string) {
    const element = $$('a', { className, href }).el as HTMLAnchorElement;
    element.innerText = text;
    this.enableAnalyticsOnLink(element, () => this.sendOpenSourceAnalytics());
    return element;
  }

  private enableAnalyticsOnLink(link: HTMLAnchorElement, sendAnalytics: () => Promise<any>) {
    link.addEventListener('click', e => {
      e.preventDefault();
      this.openLink(link.href, e.ctrlKey, sendAnalytics);
    });
  }

  private openLink(href: string, newTab: boolean, sendAnalytics: () => Promise<any>) {
    sendAnalytics();
    if (newTab) {
      window.open(href);
    } else {
      window.location.href = href;
    }
  }

  private openExplanationModal() {
    this.sendPressExplainWhyAnalytics();
    this.explanationModal.open(this.feedbackBanner.explainWhy);
  }

  private sendLikeSmartSnippetAnalytics() {
    return this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(
      analyticsActionCauseList.likeSmartSnippet,
      {},
      this.element,
      this.lastRenderedResult
    );
  }

  private sendDislikeSmartSnippetAnalytics() {
    return this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(
      analyticsActionCauseList.dislikeSmartSnippet,
      {},
      this.element,
      this.lastRenderedResult
    );
  }

  private sendExpandSmartSnippetAnalytics() {
    return this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(
      analyticsActionCauseList.expandSmartSnippet,
      {},
      this.element,
      this.lastRenderedResult
    );
  }

  private sendCollapseSmartSnippetAnalytics() {
    return this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(
      analyticsActionCauseList.collapseSmartSnippet,
      {},
      this.element,
      this.lastRenderedResult
    );
  }

  private sendOpenSourceAnalytics() {
    return this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(
      analyticsActionCauseList.openSmartSnippetSource,
      {},
      this.element,
      this.lastRenderedResult
    );
  }

  private sendOpenContentLinkAnalytics(link: HTMLAnchorElement) {
    return this.usageAnalytics.logCustomEvent<IAnalyticsSmartSnippetContentLinkMeta>(
      analyticsActionCauseList.openLinkInSmartSnippetContent,
      {
        target: link.getAttribute('href'),
        outerHTML: link.outerHTML
      },
      this.element,
      this.lastRenderedResult
    );
  }

  private sendPressExplainWhyAnalytics() {
    return this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(
      analyticsActionCauseList.pressSmartSnippetExplainWhy,
      {},
      this.element,
      this.lastRenderedResult
    );
  }

  private sendCloseExplainWhyAnalytics() {
    return this.usageAnalytics.logCustomEvent<IAnalyticsNoMeta>(
      analyticsActionCauseList.closeSmartSnippetExplainWhyModal,
      {},
      this.element,
      this.lastRenderedResult
    );
  }

  private sendExplainWhyAnalytics(reason: ISmartSnippetExplaination) {
    return this.usageAnalytics.logCustomEvent<IAnalyticsSmartSnippetExplainWhyMeta>(
      analyticsActionCauseList.smartSnippetExplainedWhy,
      {
        reason: reason.analyticsId
      },
      this.element,
      this.lastRenderedResult
    );
  }

  private sendExplainWhyDetailedAnalytics(details: string) {
    return this.usageAnalytics.logCustomEvent<IAnalyticsSmartSnippetExplainWhyDetailedMeta>(
      analyticsActionCauseList.smartSnippetExplainedWhyDetailed,
      {
        details
      },
      this.element,
      this.lastRenderedResult
    );
  }
}
Initialization.registerAutoCreateComponent(SmartSnippet);
