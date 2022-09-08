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

export const bindAnalyticsToSnippetLinks = (renderedSnippetParent: HTMLElement, logAnalytics: (link: HTMLAnchorElement) => void) => {
  Dom.nodeListToArray(renderedSnippetParent.querySelectorAll('a')).forEach(link =>
    bindAnalyticsToLink(link, () => logAnalytics(link as HTMLAnchorElement))
  );
};
