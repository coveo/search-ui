export interface IQueryQuestionAnswer {
  question: string;
  answerSnippet: string;
  documentId: {
    contentIdKey: string;
    contentIdValue: string;
  };
  score: number;
  relatedQuestions: any[];
}
