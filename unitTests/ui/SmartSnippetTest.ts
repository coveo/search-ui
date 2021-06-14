import { IQuestionAnswerResponse, IRelatedQuestionAnswerResponse } from '../../src/rest/QuestionAnswerResponse';
import { IQueryResult } from '../../src/rest/QueryResult';
import { $$ } from '../../src/utils/Dom';
import { QueryEvents, IQuerySuccessEventArgs } from '../../src/events/QueryEvents';
import { ISmartSnippetOptions, SmartSnippet, SmartSnippetClassNames as ClassNames } from '../../src/ui/SmartSnippet/SmartSnippet';
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
  const sourceAlt = 'https://some-fake-website.com';
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
        alt: sourceAlt,
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

    function instantiateSmartSnippet(styling: string | null, options: Partial<ISmartSnippetOptions> = {}) {
      test = advancedComponentSetup<SmartSnippet>(
        SmartSnippet,
        new AdvancedComponentSetupOptions($$('div', {}, ...(Utils.isNullOrUndefined(styling) ? [] : [mockStyling(styling)])).el, options)
      );
    }

    async function triggerQuerySuccess(args: Partial<IQuerySuccessEventArgs>) {
      (test.env.queryController.getLastResults as jasmine.Spy).and.returnValue(args.results);
      $$(test.env.root).trigger(QueryEvents.deferredQuerySuccess, args);
      await test.cmp.loading;
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

    function getFirstChild<T extends HTMLElement = HTMLElement>(className: string) {
      return (test.cmp.element.getElementsByClassName(className)[0] as T) || null;
    }

    function getShadowRoot() {
      return getFirstChild(ClassNames.SHADOW_CLASSNAME).shadowRoot;
    }

    it('instantiates the heightLimiter using the maximumSnippetHeight option', () => {
      let maximumSnippetHeight = 123;
      instantiateSmartSnippet(null, { maximumSnippetHeight });
      test.cmp.ensureDom();
      expect(test.cmp['heightLimiter']['heightLimit']).toEqual(maximumSnippetHeight);
      maximumSnippetHeight = 321;
      instantiateSmartSnippet(null, { maximumSnippetHeight });
      test.cmp.ensureDom();
      expect(test.cmp['heightLimiter']['heightLimit']).toEqual(maximumSnippetHeight);
    });

    it('displays the specified titleField', async done => {
      instantiateSmartSnippet(null, { titleField: '@alt' });
      document.body.appendChild(test.env.root);
      await triggerQuestionAnswerQuery(true);
      expect(getFirstChild(ClassNames.SOURCE_TITLE_CLASSNAME).innerText).toEqual(sourceAlt);
      expect(getFirstChild(ClassNames.SOURCE_URL_CLASSNAME).innerText).toEqual(sourceUrl);
      test.env.root.remove();
      done();
    });

    it('uses and displays the specified hrefTemplate', async done => {
      instantiateSmartSnippet(null, { hrefTemplate: '${raw.alt}/?abcd=1' });
      document.body.appendChild(test.env.root);
      await triggerQuestionAnswerQuery(true);
      const expectedHref = `${sourceAlt}/?abcd=1`;
      expect(getFirstChild<HTMLAnchorElement>(ClassNames.SOURCE_URL_CLASSNAME).href).toEqual(expectedHref);
      expect(getFirstChild<HTMLAnchorElement>(ClassNames.SOURCE_URL_CLASSNAME).innerText).toEqual(expectedHref);
      expect(getFirstChild<HTMLAnchorElement>(ClassNames.SOURCE_TITLE_CLASSNAME).href).toEqual(expectedHref);
      test.env.root.remove();
      done();
    });

    it('resists XSS injections in hrefTemplate (1)', async done => {
      instantiateSmartSnippet(null, { hrefTemplate: 'https://test.com?q=<img src="abcd.png" onerror="window.XSSInjected = true;">' });
      document.body.appendChild(test.env.root);
      await triggerQuestionAnswerQuery(true);
      await Promise.resolve();
      expect('XSSInjected' in window).toBeFalsy();
      delete window['XSSInjected'];
      test.env.root.remove();
      done();
    });

    it('resists XSS injections in hrefTemplate (2)', async done => {
      instantiateSmartSnippet(null, {
        hrefTemplate: 'https://test.com?q="/><img src="abcd.png" onerror="window.XSSInjected = true;"><span title="'
      });
      document.body.appendChild(test.env.root);
      await triggerQuestionAnswerQuery(true);
      await Promise.resolve();
      expect('XSSInjected' in window).toBeFalsy();
      delete window['XSSInjected'];
      test.env.root.remove();
      done();
    });

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

        it('the thank you banner should not be active', () => {
          expect(getFirstChild(UserFeedbackBannerClassNames.THANK_YOU_BANNER_ACTIVE_CLASSNAME)).toBeNull();
        });

        it('after clicking yes or no, the thank you banner should be active', () => {
          getFirstChild(UserFeedbackBannerClassNames.NO_BUTTON_CLASSNAME).click();
          expect(getFirstChild(UserFeedbackBannerClassNames.THANK_YOU_BANNER_ACTIVE_CLASSNAME)).not.toBeNull();
        });

        it('after clicking yes or no and receiving a new answer, the thank you banner should not be active', async done => {
          getFirstChild(UserFeedbackBannerClassNames.NO_BUTTON_CLASSNAME).click();
          await triggerQuestionAnswerQuery(false);
          expect(getFirstChild(UserFeedbackBannerClassNames.THANK_YOU_BANNER_ACTIVE_CLASSNAME)).toBeNull();
          done();
        });

        it('after clicking yes or no and receiving a new answer, it should still be possible to give the same answer', async done => {
          getFirstChild(UserFeedbackBannerClassNames.NO_BUTTON_CLASSNAME).click();
          await triggerQuestionAnswerQuery(false);
          getFirstChild(UserFeedbackBannerClassNames.NO_BUTTON_CLASSNAME).click();
          expect(getFirstChild(UserFeedbackBannerClassNames.THANK_YOU_BANNER_ACTIVE_CLASSNAME)).not.toBeNull();
          done();
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
          const [shadowContainer] = expectChildren(getShadowRoot(), [ClassNames.CONTENT_CLASSNAME, null]);

          expect(shadowContainer.innerHTML).toEqual(mockSnippet().innerHTML);
        });

        it('should render the default style', () => {
          const [, styleElement] = expectChildren(getShadowRoot(), [ClassNames.CONTENT_CLASSNAME, null]);

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
        const [, styleElement] = expectChildren(getShadowRoot(), [ClassNames.CONTENT_CLASSNAME, null]);

        expect(styleElement.innerHTML).toEqual('');
      });
    });
  });
}
