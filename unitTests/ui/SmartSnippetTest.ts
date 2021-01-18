import { IQuestionAnswerResponse, IRelatedQuestionAnswerResponse } from '../../src/rest/QuestionAnswerResponse';
import { IQueryResult } from '../../src/rest/QueryResult';
import { $$ } from '../../src/utils/Dom';
import { QueryEvents, IQuerySuccessEventArgs } from '../../src/events/QueryEvents';
import { SmartSnippet, SmartSnippetClassNames as ClassNames } from '../../src/ui/SmartSnippet/SmartSnippet';
import { expectChildren } from '../TestUtils';
import { UserFeedbackBannerClassNames } from '../../src/ui/SmartSnippet/UserFeedbackBanner';
import { IBasicComponentSetup, advancedComponentSetup, AdvancedComponentSetupOptions } from '../MockEnvironment';
import { HeightLimiterClassNames } from '../../src/ui/SmartSnippet/HeightLimiter';
import { IQueryResults } from '../../src/rest/QueryResults';
import { Utils } from '../../src/Core';
import { getDefaultSnippetStyle } from '../../src/ui/SmartSnippet/SmartSnippetCommon';

export function SmartSnippetTest() {
  const sourceTitle = 'Google!';
  const sourceUrl = 'https://www.google.com/';
  const sourceId: IQuestionAnswerResponse['documentId'] = {
    contentIdKey: 'unique-identifier',
    contentIdValue: 'identifier-of-the-first-result'
  };
  const style = `
    .abc {
      color: red;
    }

    #hello-world {
      cursor: url('some-ugly-animated-gif-cursor.gif');
    }
  `.replace(' ', '');

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

  function mockStyling(content: string) {
    return $$('script', { type: 'text/css' }, content).el;
  }

  function mockQuestionAnswer() {
    return <IRelatedQuestionAnswerResponse>{
      question: 'abc',
      answerSnippet: mockSnippet().innerHTML,
      documentId: sourceId
    };
  }

  describe('SmartSnippet', () => {
    let test: IBasicComponentSetup<SmartSnippet>;

    function instantiateSmartSnippet(styling: string | null) {
      test = advancedComponentSetup<SmartSnippet>(
        SmartSnippet,
        new AdvancedComponentSetupOptions($$('div', {}, ...(Utils.isNullOrUndefined(styling) ? [] : [mockStyling(styling)])).el)
      );
      test.cmp['openLink'] = jasmine
        .createSpy('openLink')
        .and.callFake((href: string, newTab: boolean, sendAnalytics: () => void) => sendAnalytics());
    }

    async function triggerQuerySuccess(args: Partial<IQuerySuccessEventArgs>) {
      (test.env.queryController.getLastResults as jasmine.Spy).and.returnValue(args.results);
      $$(test.env.root).trigger(QueryEvents.deferredQuerySuccess, args);
      await test.cmp['shadowLoading'];
    }

    async function triggerQuestionAnswerQuery(withSource: boolean) {
      const results = withSource ? [mockResult()] : [];
      await triggerQuerySuccess({
        results: <IQueryResults>{
          results,
          questionAnswer: mockQuestionAnswer()
        }
      });
    }

    function getFirstChild(className: string) {
      return test.cmp.element.getElementsByClassName(className)[0] as HTMLElement;
    }

    function getShadowRoot() {
      return getFirstChild(ClassNames.SHADOW_CLASSNAME).shadowRoot;
    }

    describe('with styling without a source', () => {
      beforeEach(async done => {
        instantiateSmartSnippet(style);
        document.body.appendChild(test.env.root);
        await triggerQuestionAnswerQuery(false);
        done();
      });

      afterEach(() => {
        test.env.root.remove();
      });

      it('should render the style', () => {
        const styleElement = getShadowRoot().querySelector('style') as HTMLStyleElement;
        expect(styleElement.innerHTML).toEqual(style);
      });
    });

    describe('with default styling', () => {
      beforeEach(() => {
        instantiateSmartSnippet(null);
        document.body.appendChild(test.env.root);
      });

      afterEach(() => {
        test.env.root.remove();
      });

      it("doesn't have the has-answer class", () => {
        expect(test.cmp.element.classList.contains(ClassNames.HAS_ANSWER_CLASSNAME)).toBeFalsy();
      });

      it("doesn't render anything in the SmartSnippet element", () => {
        expect(test.cmp.element.children.length).toEqual(0);
      });

      it('with only related questions, does not render', async done => {
        await triggerQuerySuccess({ results: <IQueryResults>{ questionAnswer: { relatedQuestions: [mockQuestionAnswer()] } } });
        expect(test.cmp.element.classList.contains(ClassNames.HAS_ANSWER_CLASSNAME)).toBeFalsy();
        done();
      });

      it('with an empty question, does not render', async done => {
        await triggerQuerySuccess({
          results: <IQueryResults>{ questionAnswer: { answerSnippet: 'abc', relatedQuestions: [mockQuestionAnswer()] } }
        });
        expect(test.cmp.element.classList.contains(ClassNames.HAS_ANSWER_CLASSNAME)).toBeFalsy();
        done();
      });

      it('with an empty answer, does not render', async done => {
        await triggerQuerySuccess({
          results: <IQueryResults>{ questionAnswer: { question: 'abc', relatedQuestions: [mockQuestionAnswer()] } }
        });
        expect(test.cmp.element.classList.contains(ClassNames.HAS_ANSWER_CLASSNAME)).toBeFalsy();
        done();
      });

      it('with a question and an answer but no questions, renders', async done => {
        await triggerQuerySuccess({
          results: <IQueryResults>{ questionAnswer: { question: 'abc', answerSnippet: 'def', relatedQuestions: [] } }
        });
        expect(test.cmp.element.classList.contains(ClassNames.HAS_ANSWER_CLASSNAME)).toBeTruthy();
        done();
      });

      describe('with a source', () => {
        beforeEach(async done => {
          await triggerQuestionAnswerQuery(true);
          done();
        });

        it('has the has-answer class', () => {
          expect(test.cmp.element.classList.contains(ClassNames.HAS_ANSWER_CLASSNAME)).toBeTruthy();
        });

        it('should render the source with its url first then its title', () => {
          const [url, title] = expectChildren(getFirstChild(ClassNames.SOURCE_CLASSNAME), [
            ClassNames.SOURCE_URL_CLASSNAME,
            ClassNames.SOURCE_TITLE_CLASSNAME
          ]) as HTMLAnchorElement[];

          expect(url.href).toEqual(sourceUrl);
          expect(url.innerText).toEqual(sourceUrl);

          expect(title.href).toEqual(sourceUrl);
          expect(title.innerText).toEqual(sourceTitle);
        });
      });

      describe('without a source', () => {
        beforeEach(async done => {
          await triggerQuestionAnswerQuery(false);
          done();
        });

        it('should render the answer container followed by the feedback banner', () => {
          expectChildren(test.cmp.element, [ClassNames.ANSWER_CONTAINER_CLASSNAME, UserFeedbackBannerClassNames.ROOT_CLASSNAME]);
        });

        it('should render the snippet followed by the source in the answer container', () => {
          expectChildren(getFirstChild(ClassNames.ANSWER_CONTAINER_CLASSNAME), [
            ClassNames.QUESTION_CLASSNAME,
            ClassNames.SHADOW_CLASSNAME,
            HeightLimiterClassNames.BUTTON_CLASSNAME,
            ClassNames.SOURCE_CLASSNAME
          ]);
        });

        it('should wrap the snippet in a container in a shadow DOM', () => {
          const [shadowContainer, _] = expectChildren(getShadowRoot(), [ClassNames.CONTENT_CLASSNAME, null]);

          expect(shadowContainer.innerHTML).toEqual(mockSnippet().innerHTML);
        });

        it('should render the default style', () => {
          const [_, styleElement] = expectChildren(getShadowRoot(), [ClassNames.CONTENT_CLASSNAME, null]);

          expect(styleElement.innerHTML).toEqual(getDefaultSnippetStyle(ClassNames.CONTENT_CLASSNAME));
        });

        it('should not render any source', () => {
          expect(getFirstChild(ClassNames.SOURCE_CLASSNAME).children.length).toEqual(0);
        });
      });
    });

    describe('with no styling, without a source', () => {
      beforeEach(async done => {
        instantiateSmartSnippet('');
        document.body.appendChild(test.env.root);
        await triggerQuestionAnswerQuery(false);
        done();
      });

      afterEach(() => {
        test.env.root.remove();
      });

      it('should render an empty style', () => {
        const [_, styleElement] = expectChildren(getShadowRoot(), [ClassNames.CONTENT_CLASSNAME, null]);

        expect(styleElement.innerHTML).toEqual('');
      });
    });
  });
}
