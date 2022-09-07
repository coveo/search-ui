import { sanitize } from 'dompurify';
import { IQuestionAnswerResponse, IRelatedQuestionAnswerResponse } from '../../rest/QuestionAnswerResponse';

export const getDefaultSnippetStyle = (contentClassName: string) => `
  body {
    font-family: "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif, sans-serif;
  }

  .${contentClassName} > :first-child {
    margin-top: 0;
  }

  .${contentClassName} > :last-child {
    margin-bottom: 0;
  }
`;

export function getSanitizedAnswerSnippet(questionAnswer: IQuestionAnswerResponse | IRelatedQuestionAnswerResponse) {
  return (
    questionAnswer.answerSnippet &&
    sanitize(questionAnswer.answerSnippet, {
      USE_PROFILES: { html: true }
    })
  );
}
