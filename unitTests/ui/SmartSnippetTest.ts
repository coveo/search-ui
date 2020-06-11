import { IQuestionAnswerResponse } from '../../src/rest/QuestionAnswerResponse';
import { IQueryResult } from '../../src/rest/QueryResult';
import { $$ } from '../../src/utils/Dom';
import { QueryEvents, IQuerySuccessEventArgs } from '../../src/events/QueryEvents';
import { SmartSnippet, SmartSnippetClassNames as ClassNames } from '../../src/ui/SmartSnippet/SmartSnippet';
import { Component } from '../../src/Core';
import { expectChildren } from '../TestUtils';
import { UserFeedbackBannerClassNames } from '../../src/ui/SmartSnippet/UserFeedbackBanner';

export function SmartSnippetTest() {
  const sourceTitle = 'Google!';
  const sourceUrl = 'https://www.google.com/';
  const sourceId: IQuestionAnswerResponse['documentId'] = {
    contentIdKey: 'unique-identifier',
    contentIdValue: 'identifier-of-the-first-result'
  };

  function mockResult() {
    return (<Partial<IQueryResult>>{
      title: sourceTitle,
      clickUri: sourceUrl,
      raw: {
        [sourceId.contentIdKey]: sourceId.contentIdValue
      }
    }) as IQueryResult;
  }

  function mockSnippet() {
    return $$(
      'main',
      {
        className: 'abc'
      },
      $$(
        'header',
        {
          className: 'def--abc'
        },
        $$('span', {}, 'Some text here')
      ),
      $$('span', {}, 'Some more text'),
      $$(
        'a',
        {
          href: 'https://somewebsite.com'
        },
        'Some external link'
      )
    ).el;
  }

  function mockQuestionAnswer() {
    return <IQuestionAnswerResponse>{
      answerSnippet: mockSnippet().innerHTML,
      documentId: sourceId
    };
  }

  describe('SmartSnippet', () => {
    let root: HTMLElement;
    let smartSnippetElement: HTMLElement;
    let smartSnippet: SmartSnippet;

    function createRoot() {
      root = $$('div').el;
    }

    function instantiateSmartSnippet() {
      smartSnippet = new SmartSnippet(
        (smartSnippetElement = $$('div', { className: Component.computeCssClassName(SmartSnippet) }).el),
        {},
        { root }
      );
    }

    function triggerQuerySuccess(withSource: boolean = true) {
      $$(root).trigger(QueryEvents.querySuccess, <IQuerySuccessEventArgs>{
        results: {
          results: withSource ? [mockResult()] : [],
          questionAnswer: mockQuestionAnswer()
        }
      });
    }

    beforeEach(() => {
      createRoot();
      instantiateSmartSnippet();
      triggerQuerySuccess();
    });

    it('should render the answer container followed by the feedback banner', () => {
      expectChildren(smartSnippetElement, [ClassNames.ANSWER_CONTAINER_CLASSNAME, UserFeedbackBannerClassNames.ROOT_CLASSNAME]);
    });

    it('should render the snippet followed by the source in the answer container', () => {
      expectChildren(smartSnippetElement.querySelector<HTMLElement>(`.${ClassNames.ANSWER_CONTAINER_CLASSNAME}`), [
        ClassNames.SHADOW_CLASSNAME,
        ClassNames.SOURCE_CLASSNAME
      ]);
    });

    it('should wrap the snippet in a container in a shadow DOM', () => {
      const [shadowContainer] = expectChildren(smartSnippetElement.querySelector(`.${ClassNames.SHADOW_CLASSNAME}`).shadowRoot, [
        ClassNames.CONTENT_CLASSNAME
      ]);

      expect(shadowContainer.innerHTML).toEqual(mockSnippet().innerHTML);
    });

    it('should render the source with its url first then its title', () => {
      const [url, title] = expectChildren(smartSnippetElement.querySelector<HTMLElement>(`.${ClassNames.SOURCE_CLASSNAME}`), [
        ClassNames.SOURCE_URL_CLASSNAME,
        ClassNames.SOURCE_TITLE_CLASSNAME
      ]) as HTMLAnchorElement[];

      expect(url.href).toEqual(sourceUrl);
      expect(url.innerText).toEqual(sourceUrl);

      expect(title.href).toEqual(sourceUrl);
      expect(title.innerText).toEqual(sourceTitle);
    });
  });
}
