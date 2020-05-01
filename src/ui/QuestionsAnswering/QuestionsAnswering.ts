import { exportGlobally } from '../../GlobalExports';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { QueryEvents, Initialization, $$ } from '../../Core';
import { IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { IQueryQuestionAnswer } from '../../rest/QueryQuestionAnswer';

export interface IQuestionsAnsweringOptions {}

export class QuestionsAnswering extends Component {
  static ID = 'QuestionsAnswering';

  static options: IQuestionsAnsweringOptions = {};

  static doExport = () => {
    exportGlobally({
      QuestionsAnswering: QuestionsAnswering
    });
  };

  constructor(public element: HTMLElement, public options?: IQuestionsAnsweringOptions, bindings?: IComponentBindings) {
    super(element, QuestionsAnswering.ID, bindings);
    this.bind.onRootElement(QueryEvents.querySuccess, (data: IQuerySuccessEventArgs) => this.handleQuerySuccess(data));
  }

  private handleQuerySuccess(data: IQuerySuccessEventArgs) {
    $$(this.element).empty();
    const { questionAnswer } = data.results;
    if (!questionAnswer) {
      return;
    }
    this.render(questionAnswer);
  }

  private render(questionAnswer: IQueryQuestionAnswer) {
    this.element.innerHTML = questionAnswer.answerSnippet;
  }
}
Initialization.registerAutoCreateComponent(QuestionsAnswering);
