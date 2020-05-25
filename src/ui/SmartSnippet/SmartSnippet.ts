import { exportGlobally } from '../../GlobalExports';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { QueryEvents, Initialization, $$ } from '../../Core';
import { IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { IQueryAnswerResponse } from '../../rest/QueryAnswerResponse';

export interface ISmartSnippetOptions {}

export class SmartSnippet extends Component {
  static ID = 'SmartSnippet';

  static options: ISmartSnippetOptions = {};

  static doExport = () => {
    exportGlobally({
      SmartSnippet
    });
  };

  private snippetContainer: HTMLElement;

  constructor(public element: HTMLElement, public options?: ISmartSnippetOptions, bindings?: IComponentBindings) {
    super(element, SmartSnippet.ID, bindings);
    this.buildShadow();
    this.bind.onRootElement(QueryEvents.querySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data));
  }

  private get style() {
    return $$(this.element)
      .children()
      .filter(element => element instanceof HTMLScriptElement && element.type.toLowerCase() === 'text/css')
      .map(element => element.innerHTML)
      .join('\n');
  }

  private buildShadow() {
    const shadow = this.element.attachShadow({ mode: 'open' });
    shadow.appendChild((this.snippetContainer = $$('main').el));
    shadow.appendChild(this.buildStyle());
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

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    $$(this.element).empty();
    const { questionAnswer } = data.results;
    if (!questionAnswer) {
      return;
    }
    this.render(questionAnswer);
  }

  private render(questionAnswer: IQueryAnswerResponse) {
    this.snippetContainer.innerHTML = questionAnswer.answerSnippet;
  }
}
Initialization.registerAutoCreateComponent(SmartSnippet);
