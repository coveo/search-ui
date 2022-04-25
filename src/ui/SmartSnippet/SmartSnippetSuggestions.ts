import 'styling/_SmartSnippetSuggestions';
import { Component } from '../Base/Component';
import { exportGlobally } from '../../GlobalExports';
import { IComponentBindings } from '../Base/ComponentBindings';
import { QueryEvents, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { IRelatedQuestionAnswerResponse, IQuestionAnswerResponse } from '../../rest/QuestionAnswerResponse';
import { $$, Dom } from '../../utils/Dom';
import { uniqueId, isEqual, find } from 'underscore';
import { SmartSnippetCollapsibleSuggestion, SmartSnippetCollapsibleSuggestionClassNames } from './SmartSnippetCollapsibleSuggestion';
import { l } from '../../strings/Strings';
import { Initialization } from '../Base/Initialization';
import { Utils } from '../../utils/Utils';
import { getDefaultSnippetStyle } from './SmartSnippetCommon';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IFieldOption } from '../Base/IComponentOptions';

const BASE_CLASSNAME = 'coveo-smart-snippet-suggestions';
const HAS_QUESTIONS_CLASSNAME = `${BASE_CLASSNAME}-has-questions`;
const QUESTIONS_LIST_CLASSNAME = `${BASE_CLASSNAME}-questions`;
const QUESTIONS_LIST_TITLE_CLASSNAME = `${QUESTIONS_LIST_CLASSNAME}-title`;

export const SmartSnippetSuggestionsClassNames = {
  HAS_QUESTIONS_CLASSNAME,
  QUESTIONS_LIST_CLASSNAME,
  QUESTIONS_LIST_TITLE_CLASSNAME
};

export interface ISmartSnippetSuggestionsOptions {
  titleField: IFieldOption;
  hrefTemplate?: string;
  useIFrame?: boolean;
}

/**
 * The SmartSnippetSuggestions component displays additional queries for which a Coveo Smart Snippets model can provide relevant excerpts.
 */
export class SmartSnippetSuggestions extends Component {
  static ID = 'SmartSnippetSuggestions';

  static doExport = () => {
    exportGlobally({
      SmartSnippetSuggestions
    });
  };

  /**
   * The options for the SmartSnippetSuggestions
   * @componentOptions
   */
  static options: ISmartSnippetSuggestionsOptions = {
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
     * Specify if the SmartSnippetSuggestion snippet should be displayed inside an iframe or not.
     *
     * Use this option in specific cases where your environment has limitations around iframe usage.
     *
     * **Examples:**
     *
     * ```html
     * <div class='CoveoSmartSnippetSuggestions' data-use-i-frame='true'></div>
     * ```
     *
     * Default value is `true`.
     */
    useIFrame: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  private readonly titleId = uniqueId(QUESTIONS_LIST_TITLE_CLASSNAME);
  private contentLoaded: Promise<SmartSnippetCollapsibleSuggestion[]>;
  private title: Dom;
  private questionAnswers: Dom;
  private renderedQuestionAnswer: IQuestionAnswerResponse;
  private searchUid: string;

  constructor(public element: HTMLElement, public options?: ISmartSnippetSuggestionsOptions, bindings?: IComponentBindings) {
    super(element, SmartSnippetSuggestions.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, SmartSnippetSuggestions, options);
    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data));
  }

  public get loading() {
    return this.contentLoaded;
  }

  /**
   * @warning This method only works for the demo. In practice, the source of the answer will not always be part of the results.
   */
  private getCorrespondingResult(questionAnswer: IRelatedQuestionAnswerResponse) {
    return find(
      this.queryController.getLastResults().results,
      result => result.raw[questionAnswer.documentId.contentIdKey] === questionAnswer.documentId.contentIdValue
    );
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    const questionAnswer = data.results.questionAnswer;
    const hasQuestions = !!(questionAnswer && questionAnswer.relatedQuestions.length);
    $$(this.element).toggleClass(HAS_QUESTIONS_CLASSNAME, hasQuestions);
    if (hasQuestions) {
      this.searchUid = data.results.searchUid;
      if (this.renderedQuestionAnswer && isEqual(questionAnswer, this.renderedQuestionAnswer)) {
        return;
      }
      this.detachContent();
      this.element.appendChild((this.title = this.buildTitle()).el);
      this.element.appendChild((this.questionAnswers = this.buildQuestionAnswers(questionAnswer.relatedQuestions)).el);
    } else {
      this.detachContent();
    }
    this.renderedQuestionAnswer = questionAnswer;
  }

  private detachContent() {
    this.title && this.title.detach();
    this.questionAnswers && this.questionAnswers.detach();
    this.title = this.questionAnswers = null;
  }

  private buildTitle() {
    return $$('span', { className: QUESTIONS_LIST_TITLE_CLASSNAME, id: this.titleId }, l('SuggestedQuestions'));
  }

  private buildQuestionAnswers(questionAnswers: IRelatedQuestionAnswerResponse[]) {
    const innerCSS = this.getInnerCSS();
    const answers = questionAnswers.map(
      questionAnswer =>
        new SmartSnippetCollapsibleSuggestion({
          questionAnswer,
          bindings: this.getBindings(),
          innerCSS: Utils.isNullOrUndefined(innerCSS)
            ? getDefaultSnippetStyle(SmartSnippetCollapsibleSuggestionClassNames.RAW_CONTENT_CLASSNAME)
            : innerCSS,
          searchUid: this.searchUid,
          titleField: this.options.titleField,
          hrefTemplate: this.options.hrefTemplate,
          source: this.getCorrespondingResult(questionAnswer),
          useIFrame: this.options.useIFrame
        })
    );
    const container = $$(
      'ul',
      { className: QUESTIONS_LIST_CLASSNAME, ariaLabelledby: this.titleId },
      ...answers.map(answer => answer.build())
    );
    this.contentLoaded = Promise.all(answers.map(answer => answer.loading.then(() => answer)));
    return container;
  }

  private getInnerCSS() {
    const styles = $$(this.element)
      .children()
      .filter(element => element instanceof HTMLScriptElement && element.type.toLowerCase() === 'text/css')
      .map(element => element.innerHTML);
    return styles.length ? styles.join('\n') : null;
  }
}

Initialization.registerAutoCreateComponent(SmartSnippetSuggestions);
SmartSnippetSuggestions.doExport();
