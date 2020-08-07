import * as axe from 'axe-core';
import { Dom, SmartSnippet, Component, $$, IQuerySuccessEventArgs } from 'coveo-search-ui';
import { getRoot, afterDeferredQuerySuccess, getResultsColumn, waitUntilSelectorIsPresent } from './Testing';

export const AccessibilitySmartSnippet = () => {
  describe('SmartSnippet', () => {
    function fakeNextQuestionAnswer() {
      $$(getRoot()).one('querySuccess', (_, e: IQuerySuccessEventArgs) => {
        e.results.questionAnswer = {
          question: 'Getting Query Suggestions',
          answerSnippet:
            '<p>You can request basic query expression (q) completions from a Coveo Machine Learning (Coveo ML) Query Suggestions (QS) model by sending a GET or POST HTTP request to https://platform.cloud.coveo.com/rest/search/v2/querySuggest (or https://cloudplatform.coveo.com/rest/search/querySuggest on Coveo Cloud V1).</p> <p>The Search API query suggestion route supports several parameters which you can include either in the query string of a GET request, or in the JSON body of a POST request (see QS Parameters).</p> <div class="box note"> \n <p>When using an OAuth2 token to authenticate a GET or POST HTTP request to the Search API query suggestion route, you must specify the unique identifier of the target Coveo Cloud organization by including the organizationId argument in the query string of your request.</p> \n</div> <div class="box examples"> \n <ol> \n  <li> <p>Requesting query suggestions using the GET method:</p> \n   <div class="language-http highlighter-rouge"> \n    <div class="highlight">\n      GET https://platform.cloud.coveo.com/rest/search/v2/querySuggest?locale=en&amp;q=twa&amp;searchHub=BookstoreSearch HTTP/1.1 &nbsp; Accept: application/json Authorization: Bearer **********-****-****-****-************ \n    </div> \n   </div> </li> \n  <li> <p>Requesting query suggestions using the POST method:</p> \n   <div class="language-http highlighter-rouge"> \n    <div class="highlight">\n      POST https://platform.cloud.coveo.com/rest/search/v2/querySuggest HTTP/1.1 &nbsp; Content-Type: application/json Accept: application/json Authorization: Bearer **********-****-****-****-************ \n    </div> \n   </div> <p>Payload</p> \n   <div class="language-json highlighter-rouge"> \n    <div class="highlight">\n      { "locale": "en", "q": "twa", "searchHub": "BookstoreSearch" } \n    </div> \n   </div> \n   <div class="box success"> \n    <p><strong>200 OK response body (excerpt)</strong></p> \n    <div class="language-json highlighter-rouge"> \n     <div class="highlight">\n       { "completions": [ { "executableConfidence": 1, "expression": "mark twain", "highlighted": "[mark] {twa}[in]", "score": 14.525258530973204 }, { "executableConfidence": 0.6666666666666666, "expression": "[wes]{twa}[rd] [ho]", "highlighted": "", "score": 8.50548085208594 }, { "executableConfidence": 0.5, "expression": "hot water music", "highlighted": "[hot] (wat)[er] [music]", "score": 7.107770631785241 }, ... ] } \n     </div> \n    </div> \n   </div> </li> \n </ol> \n</div> <div class="box notes"> \n <ul> \n  <li> <p>If the query suggestion request is routed to a query pipeline with no associated Coveo ML QS model, the request will return an empty completions array.</p> </li> \n  <li> <p>In a completions array item:</p> \n   <ul> \n    <li> <p>The score property value only has relative significance within the same completions array.</p> <p>For instance, a suggestion with a score of 14.811407079917723 in the completions array of response <strong>A</strong> isn’t necessarily less relevant than a suggestion with a score of 24.325728875625282 in the completions array of response <strong>B</strong>.</p> </li> \n    <li> <p>The highlighted property uses the following logic:</p> \n     <ul> \n      <li> <p>Characters between curly braces (e.g., {cat}) indicate an exact match with q.</p> </li> \n      <li> <p>Characters between square braces (e.g., [cher]) indicate completions.</p> </li> \n      <li> <p>Characters between parentheses (e.g., (act)) indicate corrections to q.</p> </li> \n     </ul> </li> \n    <li> <p>The executableConfidence property contains a floating-point value between 0 and 1 indicating how “convinced” Coveo ML is that performing a query with this suggestion as a basic query expression will return relevant results. The threshold from which Coveo ML considers a query suggestion executable is 0.8.</p> </li> \n   </ul> </li> \n </ul> \n</div>',
          documentId: {
            contentIdKey: 'permanentid',
            contentIdValue: e.results.results[0].raw.permanentid
          },
          score: 0.471416,
          relatedQuestions: []
        };
      });
    }

    function getFirstChild(className: string) {
      return smartSnippetElement.findClass(className)[0];
    }

    let smartSnippetElement: Dom;
    beforeEach(async done => {
      smartSnippetElement = $$('div', { className: Component.computeCssClassName(SmartSnippet) });
      fakeNextQuestionAnswer();
      getResultsColumn().appendChild(smartSnippetElement.el);
      await afterDeferredQuerySuccess();
      done();
    });

    it('should be accessible', async done => {
      const axeResults = await axe.run(smartSnippetElement.el);
      expect(axeResults).toBeAccessible();
      done();
    });

    describe('after responding "Yes" to "Was this helpful?"', () => {
      beforeEach(() => {
        getFirstChild('coveo-user-feedback-banner-yes-button').click();
      });

      it('should be accessible', async done => {
        const axeResults = await axe.run(smartSnippetElement.el);
        expect(axeResults).toBeAccessible();
        done();
      });
    });

    describe('after responding "No" to "Was this helpful?"', () => {
      beforeEach(() => {
        getFirstChild('coveo-user-feedback-banner-no-button').click();
      });

      it('should be accessible', async done => {
        const axeResults = await axe.run(smartSnippetElement.el);
        expect(axeResults).toBeAccessible();
        done();
      });

      describe('after pressing "Explain why"', () => {
        let modalContainer: HTMLElement;
        beforeEach(async done => {
          getFirstChild('coveo-user-feedback-banner-explain-why').click();
          modalContainer = await waitUntilSelectorIsPresent<HTMLElement>(document.body, '.coveo-user-explanation-modal');
          done();
        });

        it('should be accessible', async done => {
          const axeResults = await axe.run(modalContainer);
          expect(axeResults).toBeAccessible();
          done();
        });

        it('should be accessible after selecting other', async done => {
          modalContainer.querySelector<HTMLInputElement>('#coveo-reason-other').click();
          const axeResults = await axe.run(modalContainer);
          expect(axeResults).toBeAccessible();
          done();
        });

        it('should be accessible after selecting other and focusing the details', async done => {
          modalContainer.querySelector<HTMLInputElement>('#coveo-reason-other').click();
          modalContainer.querySelector<HTMLTextAreaElement>('#coveo-user-explanation-modal-details').focus();
          const axeResults = await axe.run(modalContainer);
          expect(axeResults).toBeAccessible();
          done();
        });
      });
    });

    describe('after pressing show more', () => {
      beforeEach(() => {
        getFirstChild('coveo-height-limiter-button').click();
      });

      it('should be accessible', async done => {
        const axeResults = await axe.run(smartSnippetElement.el);
        expect(axeResults).toBeAccessible();
        done();
      });
    });
  });
};
