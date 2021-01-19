import { IQuerySuccessEventArgs, QueryEvents } from '../../src/events/QueryEvents';
import { IQueryResult } from '../../src/rest/QueryResult';
import { IQuestionAnswerResponse, IRelatedQuestionAnswerResponse } from '../../src/rest/QuestionAnswerResponse';
import { SmartSnippetSuggestions, SmartSnippetSuggestionsClassNames } from '../../src/ui/SmartSnippet/SmartSnippetSuggestions';
import { advancedComponentSetup, AdvancedComponentSetupOptions, IBasicComponentSetup } from '../MockEnvironment';
import {
  SmartSnippetCollapsibleSuggestion,
  SmartSnippetCollapsibleSuggestionClassNames
} from '../../src/ui/SmartSnippet/SmartSnippetCollapsibleSuggestion';
import { $$ } from '../../src/utils/Dom';
import { expectChildren } from '../TestUtils';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { IQueryResults } from '../../src/rest/QueryResults';
import { Utils } from '../../src/Core';
import { getDefaultSnippetStyle } from '../../src/ui/SmartSnippet/SmartSnippetCommon';

const ClassNames = {
  ...SmartSnippetSuggestionsClassNames,
  ...SmartSnippetCollapsibleSuggestionClassNames
};

export function SmartSnippetSuggestionsTest() {
  const sources: { title: string; url: string; id: IQuestionAnswerResponse['documentId'] }[] = [
    {
      title: 'First title',
      url: 'https://www.google.com/1',
      id: {
        contentIdKey: 'unique-identifier-a',
        contentIdValue: 'identifier-of-the-first-result'
      }
    },
    {
      title: 'Second title',
      url: 'https://www.google.com/2',
      id: {
        contentIdKey: 'unique-identifier-b',
        contentIdValue: 'identifier-of-the-second-result'
      }
    },
    {
      title: 'Third title',
      url: 'https://www.google.com/3',
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
          clickUri: source.url,
          raw: {
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
    let collapsibleSuggestions: SmartSnippetCollapsibleSuggestion[];

    function instantiateSmartSnippetSuggestions(styling: string) {
      test = advancedComponentSetup<SmartSnippetSuggestions>(
        SmartSnippetSuggestions,
        new AdvancedComponentSetupOptions($$('div', {}, ...(Utils.isNullOrUndefined(styling) ? [] : [mockStyling(styling)])).el)
      );
    }

    async function waitForCollapsibleSuggestions() {
      collapsibleSuggestions = await test.cmp['contentLoaded'];
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
          questionAnswer: mockQuestionAnswer()
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

          it('sends expand analytics', () => {
            expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
              analyticsActionCauseList.expandSmartSnippetSuggestion,
              { documentId: sources[1].id },
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
                { documentId: sources[1].id },
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
  });
}
