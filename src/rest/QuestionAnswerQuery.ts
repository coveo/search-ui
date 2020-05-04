export interface IQuestionAnswerQuery {
  question: string;
  answerSnippet: string;
  documentId: {
    contentIdKey: string;
    contentIdValue: string;
  };
  score: number;
  relatedQuestions: any[];
}
