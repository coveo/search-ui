export interface IQuestionAnswerMeta {
  documentId: {
    contentIdKey: string;
    contentIdValue: string;
  };
  score: number;
}

export interface IRelatedQuestionAnswerResponse extends IQuestionAnswerMeta {
  question: string;
  answerSnippet: string;
}

export interface IQuestionAnswerResponse extends IQuestionAnswerMeta {
  question?: string;
  answerSnippet?: string;
  relatedQuestions: IRelatedQuestionAnswerResponse[];
}
