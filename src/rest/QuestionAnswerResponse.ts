export interface IPartialQuestionAnswerResponse {
  question: string;
  answerSnippet: string;
  documentId: {
    contentIdKey: string;
    contentIdValue: string;
  };
  score: number;
  raw: { [key: string]: any } & {
    title: string;
    uri: string;
  };
}

export interface IQuestionAnswerResponse extends IPartialQuestionAnswerResponse {
  relatedQuestions: IPartialQuestionAnswerResponse[];
}
