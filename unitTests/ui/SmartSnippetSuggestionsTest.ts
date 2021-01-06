import { IQuerySuccessEventArgs, QueryEvents } from '../../src/events/QueryEvents';
import { IQueryResult } from '../../src/rest/QueryResult';
import { IPartialQuestionAnswerResponse, IQuestionAnswerResponse } from '../../src/rest/QuestionAnswerResponse';
import { SmartSnippetSuggestions, SmartSnippetSuggestionsClassNames } from '../../src/ui/SmartSnippet/SmartSnippetSuggestions';
import {
  SmartSnippetCollapsibleSuggestion,
  SmartSnippetCollapsibleSuggestionClassNames
} from '../../src/ui/SmartSnippet/SmartSnippetCollapsibleSuggestion';
import { $$, Dom } from '../../src/utils/Dom';
import { advancedComponentSetup, AdvancedComponentSetupOptions, IBasicComponentSetup } from '../MockEnvironment';
import { expectChildren } from '../TestUtils';
import { flatten } from 'underscore';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';

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

  function mockStyling() {
    return $$('script', { type: 'text/css' }, style).el;
  }

  function mockQuestionAnswer() {
    return <IQuestionAnswerResponse>{
      relatedQuestions: sources.map(
        (source, i) =>
          <IPartialQuestionAnswerResponse>{
            question: questions[i],
            answerSnippet: mockSnippet(i).innerHTML,
            documentId: source.id,
            score: 0
          }
      )
    };
  }

  describe('SmartSnippetSuggestions', () => {
    let test: IBasicComponentSetup<SmartSnippetSuggestions>;
    let collapsibleSuggestions: SmartSnippetCollapsibleSuggestion[];

    function instantiateSmartSnippetSuggestions(hasStyling: boolean) {
      test = advancedComponentSetup<SmartSnippetSuggestions>(
        SmartSnippetSuggestions,
        new AdvancedComponentSetupOptions($$('div', {}, ...(hasStyling ? [mockStyling()] : [])).el)
      );
    }

    async function waitForCollapsibleSuggestions() {
      collapsibleSuggestions = await test.cmp['contentLoaded'];
      collapsibleSuggestions.forEach(
        suggestion =>
          (suggestion['openLink'] = jasmine
            .createSpy('openLink')
            .and.callFake((href: string, newTab: boolean, sendAnalytics: () => void) => sendAnalytics()))
      );
    }

    async function triggerQuerySuccess(withSource: boolean) {
      const results = withSource ? mockResults() : [];
      (test.env.queryController.getLastResults as jasmine.Spy).and.returnValue({ results });
      $$(test.env.root).trigger(QueryEvents.deferredQuerySuccess, <IQuerySuccessEventArgs>{
        results: {
          results,
          questionAnswer: mockQuestionAnswer()
        }
      });
      await waitForCollapsibleSuggestions();
    }

    function findClass<T extends HTMLElement = HTMLElement>(className: string, inShadowRoot = false): T[] {
      if (inShadowRoot) {
        return flatten(getShadowRoots().map(shadowRoot => Dom.nodeListToArray(shadowRoot.querySelectorAll(`.${className}`))));
      }
      return $$(test.cmp.element).findClass(className) as T[];
    }

    function getShadowRoots() {
      return findClass(ClassNames.SHADOW_CLASSNAME).map(shadowContainer => shadowContainer.shadowRoot);
    }

    function resetAnalyticsSpyHistory() {
      (test.cmp.usageAnalytics.logCustomEvent as jasmine.Spy).calls.reset();
    }

    describe('with styling without a source', () => {
      beforeEach(async done => {
        instantiateSmartSnippetSuggestions(true);
        document.body.appendChild(test.env.root);
        await triggerQuerySuccess(false);
        done();
      });

      afterEach(() => {
        test.env.root.remove();
      });

      it('should render the style', () => {
        const renderedStyles = getShadowRoots().map(shadowRoot => shadowRoot.querySelector('style').innerHTML);
        expect(renderedStyles).toEqual([style, style, style]);
      });

      it('renders only a shadow container in collapsible containers', () => {
        findClass(ClassNames.QUESTION_SNIPPET_CLASSNAME).forEach(snippet => expectChildren(snippet, [ClassNames.SHADOW_CLASSNAME]));
      });
    });

    describe('without styling', () => {
      beforeEach(() => {
        instantiateSmartSnippetSuggestions(false);
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

      describe('with a source', () => {
        beforeEach(async done => {
          await triggerQuerySuccess(true);
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

        it('when a source title is clicked, sends analytics', () => {
          findClass(ClassNames.QUESTION_SNIPPET_CLASSNAME).forEach((snippet, i) => {
            resetAnalyticsSpyHistory();
            $$(snippet).findClass(ClassNames.SOURCE_TITLE_CLASSNAME)[0].click();
            expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
              analyticsActionCauseList.openSmartSnippetSuggestionSource,
              { documentId: sources[i].id },
              snippet
            );
          });
        });

        it('when a source url is clicked, sends analytics', () => {
          findClass(ClassNames.QUESTION_SNIPPET_CLASSNAME).forEach((snippet, i) => {
            resetAnalyticsSpyHistory();
            $$(snippet).findClass(ClassNames.SOURCE_URL_CLASSNAME)[0].click();
            expect(test.cmp.usageAnalytics.logCustomEvent).toHaveBeenCalledWith(
              analyticsActionCauseList.openSmartSnippetSuggestionSource,
              { documentId: sources[i].id },
              snippet
            );
          });
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

          it('renders a shadow container, a source url and a source title in the collapsible container', () => {
            findClass(ClassNames.QUESTION_SNIPPET_CLASSNAME).forEach(snippet =>
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
            findClass(ClassNames.RAW_CONTENT_CLASSNAME, true).forEach((content, i) =>
              expect(content.innerHTML).toEqual(mockSnippet(i).innerHTML)
            );
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
        });
      });
    });
  });
}
