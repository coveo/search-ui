import { exportGlobally } from '../../GlobalExports';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { QueryEvents, Initialization, $$ } from '../../Core';
import { IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { IQuestionAnswerResponse } from '../../rest/QuestionAnswerResponse';
import 'styling/_SmartSnippet';
import { find } from 'underscore';
import { IQueryResult } from '../../rest/QueryResult';

const BASE_CLASSNAME = 'coveo-smart-snippet';
const HAS_ANSWER_CLASSNAME = `${BASE_CLASSNAME}-has-answer`;
const SHADOW_CLASSNAME = `${BASE_CLASSNAME}-content`;
const CONTENT_CLASSNAME = `${BASE_CLASSNAME}-content-wrapper`;
const SOURCE_CLASSNAME = `${BASE_CLASSNAME}-source`;
const SOURCE_TITLE_CLASSNAME = `${SOURCE_CLASSNAME}-title`;
const SOURCE_URL_CLASSNAME = `${SOURCE_CLASSNAME}-url`;

export const SmartSnippetClassNames = {
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

  private shadowContainer: HTMLElement;
  private sourceContainer: HTMLElement;
  private snippetContainer: HTMLElement;

  constructor(public element: HTMLElement, public options?: ISmartSnippetOptions, bindings?: IComponentBindings) {
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
    this.buildShadow();
    this.buildSourceContainer();
  }

  private buildShadow() {
    this.element.appendChild((this.shadowContainer = $$('div', { className: SHADOW_CLASSNAME }).el));
    const shadow = this.shadowContainer.attachShadow({ mode: 'open' });
    shadow.appendChild((this.snippetContainer = $$('section', { className: CONTENT_CLASSNAME }).el));
    const style = this.buildStyle();
    if (style) {
      shadow.appendChild(style);
    }
  }

  private buildSourceContainer() {
    this.element.appendChild((this.sourceContainer = $$('div', { className: SOURCE_CLASSNAME }).el));
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
    const correspondingResult = this.getCorrespondingResult(questionAnswer);
    if (!correspondingResult) {
      return;
    }
    this.renderSource(correspondingResult);
  }

  private renderSnippet(content: string) {
    this.snippetContainer.innerHTML = content;
  }

  private renderSource(source: IQueryResult) {
    $$(this.sourceContainer).empty();
    this.sourceContainer.appendChild(this.renderSourceUrl(source.clickUri));
    this.sourceContainer.appendChild(this.renderSourceTitle(source.title, source.clickUri));
  }

  private renderSourceTitle(title: string, clickUri: string) {
    const element = $$('a', { className: SOURCE_TITLE_CLASSNAME, href: clickUri }).el;
    element.innerText = title;
    return element;
  }

  private renderSourceUrl(url: string) {
    const element = $$('a', { className: SOURCE_URL_CLASSNAME, href: url }).el;
    element.innerText = url;
    return element;
  }
}
Initialization.registerAutoCreateComponent(SmartSnippet);
