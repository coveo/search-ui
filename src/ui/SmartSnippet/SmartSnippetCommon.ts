import { sanitize } from 'dompurify';
import { IQuestionAnswerResponse, IRelatedQuestionAnswerResponse } from '../../rest/QuestionAnswerResponse';
import { Dom } from '../../utils/Dom';
import { bindAnalyticsToLink } from '../ResultLink/ResultLinkCommon';

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
  if (!questionAnswer.answerSnippet) {
    return '';
  }
  // dompurify can fail to execute in some environment (salesforce locker service)
  try {
    return sanitize(questionAnswer.answerSnippet, {
      USE_PROFILES: { html: true }
    });
  } catch (e) {
    questionAnswer.answerSnippet;
  }
}

export const transformSnippetLinks = (
  renderedSnippetParent: HTMLElement,
  alwaysOpenInNewWindow: boolean,
  logAnalytics: (link: HTMLAnchorElement) => void
) => {
  Dom.nodeListToArray(renderedSnippetParent.querySelectorAll('a')).forEach((link: HTMLAnchorElement) => {
    bindAnalyticsToLink(link, () => logAnalytics(link));
    link.target = alwaysOpenInNewWindow ? '_blank' : '_top';
  });
};
