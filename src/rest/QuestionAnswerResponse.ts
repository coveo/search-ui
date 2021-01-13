export interface IPartialQuestionAnswerResponse {
  question: string;
  answerSnippet: string;
  documentId: {
    contentIdKey: string;
    contentIdValue: string;
  };
  score: number;
}

export interface IQuestionAnswerResponse extends Partial<IPartialQuestionAnswerResponse> {
  relatedQuestions: IPartialQuestionAnswerResponse[];
}
