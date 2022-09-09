import { IQuerySuccessEventArgs, QueryEvents } from '../../src/events/QueryEvents';
import { IQueryResult } from '../../src/rest/QueryResult';
import { IQuestionAnswerResponse, IRelatedQuestionAnswerResponse } from '../../src/rest/QuestionAnswerResponse';
import {
  ISmartSnippetSuggestionsOptions,
  SmartSnippetSuggestions,
  SmartSnippetSuggestionsClassNames
} from '../../src/ui/SmartSnippet/SmartSnippetSuggestions';
import { advancedComponentSetup, AdvancedComponentSetupOptions, IBasicComponentSetup } from '../MockEnvironment';
import { SmartSnippetCollapsibleSuggestionClassNames } from '../../src/ui/SmartSnippet/SmartSnippetCollapsibleSuggestion';
import { $$ } from '../../src/utils/Dom';
import { expectChildren } from '../TestUtils';
import { analyticsActionCauseList, IAnalyticsSmartSnippetSuggestionMeta } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { IQueryResults } from '../../src/rest/QueryResults';
import { Utils } from '../../src/Core';
import { getDefaultSnippetStyle } from '../../src/ui/SmartSnippet/SmartSnippetCommon';

const ClassNames = {
  ...SmartSnippetSuggestionsClassNames,
  ...SmartSnippetCollapsibleSuggestionClassNames
};

export function SmartSnippetSuggestionsTest() {
  const sources: { title: string; url: string; alt: string; id: IQuestionAnswerResponse['documentId'] }[] = [
    {
      title: 'First title',
      url: 'https://www.google.com/1',
      alt: 'http://127.0.0.1/1',
      id: {
        contentIdKey: 'unique-identifier-a',
        contentIdValue: 'identifier-of-the-first-result'
      }
    },
    {
      title: 'Second title',
      url: 'https://www.google.com/2',
      alt: 'http://127.0.0.1/2',
      id: {
        contentIdKey: 'unique-identifier-b',
        contentIdValue: 'identifier-of-the-second-result'
      }
    },
    {
      title: 'Third title',
      url: 'https://www.google.com/3',
      alt: 'http://127.0.0.1/3',
      id: {
        contentIdKey: 'unique-identifier-c',
        contentIdValue: 'identifier-of-the-third-result'
      }
    }
  ];
  const questions = ['Question A', 'Question B', 'Question C'];
  const style = `
  .abc {
    color: red;
  }

  #hello-world {
    cursor: url('some-ugly-animated-gif-cursor.gif');
  }
`.replace(' ', '');

  function mockResults() {
    return sources.map(
      source =>
        <Partial<IQueryResult>>{
          title: source.title,
          titleHighlights: [],
          clickUri: source.url,
          raw: {
            alt: source.alt,
            [source.id.contentIdKey]: source.id.contentIdValue
          }
        }
    ) as IQueryResult[];
  }

  function mockSnippet(id: number) {
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
        $$('span', {}, `Hello, my id is ${id}!`)
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

  function mockRelatedQuestions() {
    return sources.map(
      (source, i) =>
        <IRelatedQuestionAnswerResponse>{
          question: questions[i],
          answerSnippet: mockSnippet(i).innerHTML,
          documentId: source.id,
          score: 0
        }
    );
  }

  function mockQuestionAnswer() {
    return <IQuestionAnswerResponse>{
      relatedQuestions: mockRelatedQuestions()
    };
  }

  describe('SmartSnippetSuggestions', () => {
    let test: IBasicComponentSetup<SmartSnippetSuggestions>;
    let searchUid: string;

    function instantiateSmartSnippetSuggestions(styling: string | null, options: Partial<ISmartSnippetSuggestionsOptions> = {}) {
      test = advancedComponentSetup<SmartSnippetSuggestions>(
        SmartSnippetSuggestions,
        new AdvancedComponentSetupOptions($$('div', {}, ...(Utils.isNullOrUndefined(styling) ? [] : [mockStyling(styling!)])).el, options)
      );
    }

    async function waitForCollapsibleSuggestions() {
      await test.cmp['contentLoaded'];
    }

    async function triggerQuerySuccess(args: Partial<IQuerySuccessEventArgs>) {
      (test.env.queryController.getLastResults as jasmine.Spy).and.returnValue(args.results);
      $$(test.env.root).trigger(QueryEvents.deferredQuerySuccess, args);
      await test.cmp.loading;
    }

    async function triggerQuestionAnswerQuery(withSource: boolean) {
      const results = withSource ? mockResults() : [];
      await triggerQuerySuccess({
        results: <IQueryResults>{
          results,
          questionAnswer: mockQuestionAnswer(),
          searchUid: searchUid = Math.random().toString().substr(2)
        }
      });
      await waitForCollapsibleSuggestions();
    }

    function findClass<T extends HTMLElement = HTMLElement>(className: string): T[] {
      return $$(test.cmp.element).findClass(className) as T[];
    }

    function getShadowRoots() {
      return findClass(ClassNames.SHADOW_CLASSNAME).map(shadowContainer => shadowContainer.shadowRoot.childNodes.item(0) as HTMLElement);
    }

    function resetAnalyticsSpyHistory() {
      (test.cmp.usageAnalytics.logCustomEvent as jasmine.Spy).calls.reset();
    }

    describe('with styling without a source', () => {
      beforeEach(async done => {
        instantiateSmartSnippetSuggestions(style);
        document.body.appendChild(test.env.root);
        await triggerQuestionAnswerQuery(false);
        done();
      });

      afterEach(() => {
        test.env.root.remove();
      });

      it('should render the style', () => {
        const renderedStyles = getShadowRoots().map(shadowRoot => shadowRoot.querySelector('style').innerHTML);
        expect(renderedStyles).toEqual([style, style, style]);
      });

      it('renders only a shadow container in snippet containers', () => {
        findClass(ClassNames.QUESTION_SNIPPET_CONTAINER_CLASSNAME).forEach(snippet =>
          expectChildren(snippet, [ClassNames.SHADOW_CLASSNAME])
        );
      });
    });

    describe('with default styling', () => {
      beforeEach(() => {
        instantiateSmartSnippetSuggestions(null);
        document.body.appendChild(test.env.root);
      });

      afterEach(() => {
        test.env.root.remove();
      });

      it("doesn't have the has-question class", () => {
        expect(test.cmp.element.classList.contains(ClassNames.HAS_QUESTIONS_CLASSNAME)).toBeFalsy();
      });

      it("doesn't render anything in the SmartSnippetSuggestions element", () => {
        expect(test.cmp.element.children.length).toEqual(0);
      });

      it('with only a question answer, does not render', async done => {
        await triggerQuerySuccess({
          results: <IQueryResults>{ questionAnswer: { question: 'abc', answerSnippet: 'def', relatedQuestions: [] } }
        });
        expect(test.cmp.element.classList.contains(ClassNames.HAS_QUESTIONS_CLASSNAME)).toBeFalsy();
        done();
      });

      it('with only related questions, renders', async done => {
        await triggerQuerySuccess({
          results: <IQueryResults>{ questionAnswer: { relatedQuestions: mockRelatedQuestions() } }
        });
        expect(test.cmp.element.classList.contains(ClassNames.HAS_QUESTIONS_CLASSNAME)).toBeTruthy();
        done();
      });

      it('with both a question answer and related questions, renders', async done => {
        await triggerQuerySuccess({
          results: <IQueryResults>{ questionAnswer: { question: 'abc', answerSnippet: 'def', relatedQuestions: mockRelatedQuestions() } }
        });
        expect(test.cmp.element.classList.contains(ClassNames.HAS_QUESTIONS_CLASSNAME)).toBeTruthy();
        done();
      });

      describe('with a source', () => {
        beforeEach(async done => {
          await triggerQuestionAnswerQuery(true);
          done();
        });

        it('the iframe of the second question has tabindex=-1', () => {
          expect(findClass(ClassNames.SHADOW_CLASSNAME)[1].querySelector('iframe').getAttribute('tabindex')).toEqual('-1');
        });

        it('has the has-question class', () => {
          expect(test.cmp.element.classList.contains(ClassNames.HAS_QUESTIONS_CLASSNAME)).toBeTruthy();
        });

        it('renders a questions list title and a questions list', () => {
          expectChildren(test.cmp.element, [ClassNames.QUESTIONS_LIST_TITLE_CLASSNAME, ClassNames.QUESTIONS_LIST_CLASSNAME]);
        });

        it('renders 3 questions', () => {
          expectChildren(findClass(ClassNames.QUESTIONS_LIST_CLASSNAME)[0], [
            ClassNames.QUESTION_CLASSNAME,
            ClassNames.QUESTION_CLASSNAME,
            ClassNames.QUESTION_CLASSNAME
          ]);
        });

        describe('each SmartSnippetCollapsibleSuggestion', () => {
          it('renders a title and a collapsible container', () => {
            findClass(ClassNames.QUESTION_CLASSNAME).forEach(question =>
              expectChildren(question, [ClassNames.QUESTION_TITLE_CLASSNAME, ClassNames.QUESTION_SNIPPET_CLASSNAME])
            );
          });

          it('renders a label and a checkbox in the title', () => {
            findClass(ClassNames.QUESTION_TITLE_CLASSNAME).forEach(title =>
              expectChildren(title, [ClassNames.QUESTION_TITLE_LABEL_CLASSNAME, ClassNames.QUESTION_TITLE_CHECKBOX_CLASSNAME])
            );
          });

          it('renders its question in its title', () => {
            findClass(ClassNames.QUESTION_TITLE_LABEL_CLASSNAME).forEach((label, i) => expect(label.innerText).toEqual(questions[i]));
          });

          it('renders a snippet container in the collapsible container', () => {
            findClass(ClassNames.QUESTION_SNIPPET_CLASSNAME).forEach(snippet =>
              expectChildren(snippet, [ClassNames.QUESTION_SNIPPET_CONTAINER_CLASSNAME])
            );
          });

          it('renders a shadow container, a source url and a source title in the collapsible container', () => {
            findClass(ClassNames.QUESTION_SNIPPET_CONTAINER_CLASSNAME).forEach(snippet =>
              expectChildren(snippet, [ClassNames.SHADOW_CLASSNAME, ClassNames.SOURCE_URL_CLASSNAME, ClassNames.SOURCE_TITLE_CLASSNAME])
            );
          });

          it('gives the right href for each source element', () => {
            findClass<HTMLLinkElement>(ClassNames.SOURCE_URL_CLASSNAME).forEach((sourceUrl, i) =>
              expect(sourceUrl.href).toEqual(sources[i].url)
            );
            findClass<HTMLLinkElement>(ClassNames.SOURCE_TITLE_CLASSNAME).forEach((sourceUrl, i) =>
              expect(sourceUrl.href).toEqual(sources[i].url)
            );
          });

          it('gives the right text for each source element', () => {
            findClass(ClassNames.SOURCE_URL_CLASSNAME).forEach((sourceUrl, i) => expect(sourceUrl.innerText).toEqual(sources[i].url));
            findClass(ClassNames.SOURCE_TITLE_CLASSNAME).forEach((sourceUrl, i) => expect(sourceUrl.innerText).toEqual(sources[i].title));
          });

          it('is collapsed', () => {
            expect(
              findClass(ClassNames.QUESTION_SNIPPET_CLASSNAME).map(question =>
                question.classList.contains(ClassNames.QUESTION_SNIPPET_HIDDEN_CLASSNAME)
              )
            ).toEqual([true, true, true]);
          });

          it('renders the expected shadow content', () => {
            getShadowRoots().forEach((shadowRoot, i) => {
              const [shadowContainer] = expectChildren(shadowRoot, [ClassNames.RAW_CONTENT_CLASSNAME, null]);

              expect(shadowContainer.innerHTML).toEqual(mockSnippet(i).innerHTML);
            });
          });
        });

        describe('when the second question is expanded', () => {
          beforeEach(() => {
            resetAnalyticsSpyHistory();
            findClass(ClassNames.QUESTION_TITLE_CHECKBOX_CLASSNAME)[1].click();
          });

          it("the iframe doesn't have a tabindex", () => {
            expect(findClass(ClassNames.SHADOW_CLASSNAME)[1].querySelector('iframe').hasAttribute('tabindex')).toBeFalsy();
          });

          it('sends expand analytics', () => {
            expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
              analyticsActionCauseList.expandSmartSnippetSuggestion,
              <IAnalyticsSmartSnippetSuggestionMeta>{ documentId: sources[1].id, searchQueryUid: searchUid },
              findClass(ClassNames.QUESTION_TITLE_CHECKBOX_CLASSNAME)[1]
            );
          });

          it('is collapsed, apart from the second question', () => {
            expect(
              findClass(ClassNames.QUESTION_SNIPPET_CLASSNAME).map(question =>
                question.classList.contains(ClassNames.QUESTION_SNIPPET_HIDDEN_CLASSNAME)
              )
            ).toEqual([true, false, true]);
          });

          describe('then collapsed', () => {
            beforeEach(() => {
              resetAnalyticsSpyHistory();
              findClass(ClassNames.QUESTION_TITLE_CHECKBOX_CLASSNAME)[1].click();
            });

            it('sends collapse analytics', () => {
              expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
                analyticsActionCauseList.collapseSmartSnippetSuggestion,
                <IAnalyticsSmartSnippetSuggestionMeta>{ documentId: sources[1].id, searchQueryUid: searchUid },
                findClass(ClassNames.QUESTION_TITLE_CHECKBOX_CLASSNAME)[1]
              );
            });
          });

          it('should wrap the snippet in a container in a shadow DOM', () => {
            getShadowRoots().forEach((shadowRoot, i) => {
              const [shadowContainer] = expectChildren(shadowRoot, [ClassNames.RAW_CONTENT_CLASSNAME, null]);

              expect(shadowContainer.innerHTML).toEqual(mockSnippet(i).innerHTML);
            });
          });

          it('should render the default style', () => {
            getShadowRoots().forEach(shadowRoot => {
              const [, styleElement] = expectChildren(shadowRoot, [ClassNames.RAW_CONTENT_CLASSNAME, null]);

              expect(styleElement.innerHTML).toEqual(getDefaultSnippetStyle(ClassNames.RAW_CONTENT_CLASSNAME));
            });
          });
        });
      });
    });

    describe('with the useIFrame option', () => {
      afterEach(() => {
        test.env.root.remove();
      });

      it('renders a div instead of an iframe when the option is false', async done => {
        const IFRAME_CLASSNAME = 'coveo-shadow-iframe';
        instantiateSmartSnippetSuggestions(null, {
          useIFrame: false
        });
        document.body.appendChild(test.env.root);
        await triggerQuestionAnswerQuery(true);
        expect(test.cmp.element.querySelector(`.${IFRAME_CLASSNAME}`).nodeName).toEqual('DIV');
        done();
      });

      it('renders an iframe by default', async done => {
        const IFRAME_CLASSNAME = 'coveo-shadow-iframe';
        instantiateSmartSnippetSuggestions(null);
        document.body.appendChild(test.env.root);
        await triggerQuestionAnswerQuery(true);
        expect(test.cmp.element.querySelector(`.${IFRAME_CLASSNAME}`).nodeName).toEqual('IFRAME');
        done();
      });
    });

    describe('with no styling, without sources', () => {
      beforeEach(async done => {
        instantiateSmartSnippetSuggestions('');
        document.body.appendChild(test.env.root);
        await triggerQuestionAnswerQuery(false);
        done();
      });

      afterEach(() => {
        test.env.root.remove();
      });

      it('should render the no style', () => {
        getShadowRoots().forEach(shadowRoot => {
          const [, styleElement] = expectChildren(shadowRoot, [ClassNames.RAW_CONTENT_CLASSNAME, null]);

          expect(styleElement.innerHTML).toEqual('');
        });
      });
    });

    it('displays the specified titleField', async done => {
      instantiateSmartSnippetSuggestions(null, { titleField: '@alt' });
      document.body.appendChild(test.env.root);
      await triggerQuestionAnswerQuery(true);
      findClass(ClassNames.SOURCE_TITLE_CLASSNAME).forEach((title, i) => expect(title.innerText).toEqual(sources[i].alt));
      findClass(ClassNames.SOURCE_URL_CLASSNAME).forEach((source, i) => expect(source.innerText).toEqual(sources[i].url));
      test.env.root.remove();
      done();
    });

    it('uses and displays the specified hrefTemplate', async done => {
      instantiateSmartSnippetSuggestions(null, { hrefTemplate: '${raw.alt}/?abcd=1' });
      document.body.appendChild(test.env.root);
      await triggerQuestionAnswerQuery(true);
      const expectedHref = (i: number) => `${sources[i].alt}/?abcd=1`;
      findClass<HTMLAnchorElement>(ClassNames.SOURCE_TITLE_CLASSNAME).forEach((title, i) => expect(title.href).toEqual(expectedHref(i)));
      findClass<HTMLAnchorElement>(ClassNames.SOURCE_URL_CLASSNAME).forEach((source, i) => {
        expect(source.innerText).toEqual(expectedHref(i));
        expect(source.innerText).toEqual(expectedHref(i));
      });
      test.env.root.remove();
      done();
    });

    it('displays resolved relative URLs when specified in the hrefTemplate', async done => {
      instantiateSmartSnippetSuggestions(null, { hrefTemplate: '../${raw.alt}' });
      document.body.appendChild(test.env.root);
      await triggerQuestionAnswerQuery(true);
      findClass(ClassNames.SOURCE_URL_CLASSNAME).forEach((title, i) =>
        expect(title.innerText.indexOf(window.location.protocol)).toEqual(0)
      );
      test.env.root.remove();
      done();
    });

    it('resists XSS injections in hrefTemplate (1)', async done => {
      instantiateSmartSnippetSuggestions(null, {
        hrefTemplate: 'https://test.com?q=<img src="abcd.png" onerror="window.XSSInjected = true;">'
      });
      document.body.appendChild(test.env.root);
      await triggerQuestionAnswerQuery(true);
      await Promise.resolve();
      expect('XSSInjected' in window).toBeFalsy();
      delete window['XSSInjected'];
      test.env.root.remove();
      done();
    });

    it('resists XSS injections in hrefTemplate (2)', async done => {
      instantiateSmartSnippetSuggestions(null, {
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

    it('resists XSS injections in content', async done => {
      instantiateSmartSnippetSuggestions(null, { useIFrame: false });
      document.body.appendChild(test.env.root);
      await triggerQuerySuccess({
        results: <IQueryResults>{
          results: mockResults(),
          questionAnswer: {
            ...mockQuestionAnswer(),
            relatedQuestions: [{ ...mockRelatedQuestions()[0], answerSnippet: '<img src="abcd.png" onerror="window.XSSInjected = true;">' }]
          },
          searchUid: searchUid = Math.random().toString().substr(2)
        }
      });
      await Utils.resolveAfter(100);
      expect('XSSInjected' in window).toBeFalsy();
      delete window['XSSInjected'];
      test.env.root.remove();
      done();
    });

    it("doesn't set the target when alwaysOpenInNewWindow is unset", async done => {
      instantiateSmartSnippetSuggestions(null);
      document.body.appendChild(test.env.root);
      await triggerQuestionAnswerQuery(true);
      expect(findClass<HTMLAnchorElement>(ClassNames.SOURCE_URL_CLASSNAME)[0].target).toEqual('');
      expect(findClass<HTMLAnchorElement>(ClassNames.SOURCE_TITLE_CLASSNAME)[0].target).toEqual('');
      test.env.root.remove();
      done();
    });

    it('sets the target when alwaysOpenInNewWindow is set', async done => {
      instantiateSmartSnippetSuggestions(null, { alwaysOpenInNewWindow: true });
      document.body.appendChild(test.env.root);
      await triggerQuestionAnswerQuery(true);
      expect(findClass<HTMLAnchorElement>(ClassNames.SOURCE_URL_CLASSNAME)[0].target).toEqual('_blank');
      expect(findClass<HTMLAnchorElement>(ClassNames.SOURCE_TITLE_CLASSNAME)[0].target).toEqual('_blank');
      test.env.root.remove();
      done();
    });
  });
}
