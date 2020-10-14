import * as axe from 'axe-core';
import { Dom, SmartSnippetSuggestions, Component, $$, IQuerySuccessEventArgs } from 'coveo-search-ui';
import { getRoot, afterDeferredQuerySuccess, getResultsColumn } from './Testing';

export const AccessibilitySmartSnippetSuggestions = () => {
  describe('SmartSnippetSuggestions', () => {
    function fakeNextQuestionAnswer() {
      $$(getRoot()).one('querySuccess', (_, e: IQuerySuccessEventArgs) => {
        e.results.questionAnswer = {
          question: 'Getting Query Suggestions',
          answerSnippet:
            '<p>You can request <a class="coveo-glossary-entry-link" href="/en/178/">basic query expression (q)</a> completions from a <a class="coveo-glossary-entry-link" href="/en/188/">Coveo Machine Learning (Coveo ML)</a> <a class="coveo-glossary-entry-link" href="/en/1015/">Query Suggestions (QS)</a> <a class="coveo-glossary-entry-link" href="/en/1012/">model</a> by sending a GET or POST HTTP request to https://platform.cloud.coveo.com/rest/search/v2/querySuggest (or https://cloudplatform.coveo.com/rest/search/querySuggest on Coveo Cloud V1).</p> <p>The Search API query suggestion route supports several parameters which you can include either in the query string of a GET request, or in the JSON body of a POST request (see <a href="#qs-parameters">QS Parameters</a>).</p> <div class="box note"> \n <p>When using an OAuth2 token to authenticate a GET or POST HTTP request to the Search API query suggestion route, you must specify the unique identifier of the target <a class="coveo-glossary-entry-link" href="/en/185/">Coveo Cloud organization</a> by including the organizationId argument in the query string of your request.</p> \n</div> <div class="box examples"> \n <ol> \n  <li> <p>Requesting query suggestions using the GET method:</p> \n   <div class="language-http highlighter-rouge"> \n    <div class="highlight">\n      GET https://platform.cloud.coveo.com/rest/search/v2/querySuggest?locale=en&amp;q=twa&amp;searchHub=BookstoreSearch HTTP/1.1 &nbsp; Accept: application/json Authorization: Bearer **********-****-****-****-************ \n    </div> \n   </div> </li> \n  <li> <p>Requesting query suggestions using the POST method:</p> \n   <div class="language-http highlighter-rouge"> \n    <div class="highlight">\n      POST https://platform.cloud.coveo.com/rest/search/v2/querySuggest HTTP/1.1 &nbsp; Content-Type: application/json Accept: application/json Authorization: Bearer **********-****-****-****-************ \n    </div> \n   </div> <p>Payload</p> \n   <div class="language-json highlighter-rouge"> \n    <div class="highlight">\n      { "locale": "en", "q": "twa", "searchHub": "BookstoreSearch" } \n    </div> \n   </div> \n   <div class="box success"> \n    <p><strong>200 OK response body (excerpt)</strong></p> \n    <div class="language-json highlighter-rouge"> \n     <div class="highlight">\n       { "completions": [ { "executableConfidence": 1, "expression": "mark twain", "highlighted": "[mark] {twa}[in]", "score": 14.525258530973204 }, { "executableConfidence": 0.6666666666666666, "expression": "[wes]{twa}[rd] [ho]", "highlighted": "", "score": 8.50548085208594 }, { "executableConfidence": 0.5, "expression": "hot water music", "highlighted": "[hot] (wat)[er] [music]", "score": 7.107770631785241 }, ... ] } \n     </div> \n    </div> \n   </div> </li> \n </ol> \n</div> <div class="box notes"> \n <ul> \n  <li> <p>If the query suggestion request is routed to a <a class="coveo-glossary-entry-link" href="/en/180/">query pipeline</a> with no associated Coveo ML QS model, the request will return an empty completions array.</p> </li> \n  <li> <p>In a completions array item:</p> \n   <ul> \n    <li> <p>The score property value only has relative significance within the same completions array.</p> <p>For instance, a suggestion with a score of 14.811407079917723 in the completions array of response <strong>A</strong> isn’t necessarily less relevant than a suggestion with a score of 24.325728875625282 in the completions array of response <strong>B</strong>.</p> </li> \n    <li> <p>The highlighted property uses the following logic:</p> \n     <ul> \n      <li> <p>Characters between curly braces (e.g., {cat}) indicate an exact match with <a href="#q-string">q</a>.</p> </li> \n      <li> <p>Characters between square braces (e.g., [cher]) indicate completions.</p> </li> \n      <li> <p>Characters between parentheses (e.g., (act)) indicate corrections to q.</p> </li> \n     </ul> </li> \n    <li> <p>The executableConfidence property contains a floating-point value between 0 and 1 indicating how "convinced" Coveo ML is that performing a query with this suggestion as a basic query expression will return relevant results. The threshold from which Coveo ML considers a query suggestion executable is 0.8.</p> </li> \n   </ul> </li> \n </ul> \n</div>',
          documentId: {
            contentIdKey: 'permanentid',
            contentIdValue: e.results.results[0].raw.permanentid
          },
          score: 0.99,
          relatedQuestions: [
            {
              question:
                'What does Lorem Ipsum mean? What does Lorem Ipsum mean? What does Lorem Ipsum mean? What does Lorem Ipsum mean? What does Lorem Ipsum mean?',
              answerSnippet:
                "<p>Lorem ipsum is a name for a common type of placeholder text. Also known as filler or dummy text, this is simply copy that serves to fill a space without actually saying anything meaningful. It's essentially nonsense text, but gives an idea of what real text will look like in the final product.</p>",
              documentId: { contentIdKey: 'permanentid', contentIdValue: e.results.results[0].raw.permanentid },
              score: 0.95
            },
            {
              question: 'What is the use of Lorem Ipsum?',
              answerSnippet:
                "<p>Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups.</p>",
              documentId: { contentIdKey: 'permanentid', contentIdValue: e.results.results[0].raw.permanentid },
              score: 0.9
            },
            {
              question: 'What does Lorem mean?',
              answerSnippet:
                '<p>But it wasn\'t long before I realized that Lorem Ipsum is mostly gibberish, a garbling of Latin that makes no real sense. The first word, "Lorem," isn\'t even a word; instead it\'s a piece of the word "dolorem," meaning pain, suffering, or sorrow.</p>',
              documentId: { contentIdKey: 'permanentid', contentIdValue: e.results.results[0].raw.permanentid },
              score: 0.85
            },
            {
              question: 'Is Lorem Ipsum Latin or Greek?',
              answerSnippet:
                '<p>"Lorem" isn\'t even a Latin word -- it\'s the second half of "dolorem," meaning "pain" or "sorrow". Thus Lorem Ipsum was born, and began its long journey to ubiquity. The Guardian quoted a Latin scholar on just what the scrambled Cicero "means" to someone who understands Latin.</p>',
              documentId: { contentIdKey: 'permanentid', contentIdValue: e.results.results[0].raw.permanentid },
              score: 0.8
            },
            {
              question: 'What language is Lorem Ipsum?',
              answerSnippet:
                '<p><strong>Latin</strong></p> <p>The phrase "Lorem ipsum dolor sit amet consectetuer" appears in Microsoft Word online Help. This phrase has the appearance of an intelligent Latin idiom.</p>',
              documentId: { contentIdKey: 'permanentid', contentIdValue: e.results.results[0].raw.permanentid },
              score: 0.75
            },
            {
              question: 'Who invented Lorem Ipsum?',
              answerSnippet:
                '<p><strong>Richard McClintock</strong><p> <p>Richard McClintock, a Latin scholar from Hampden-Sydney College, is credited with discovering the source behind the ubiquitous filler text. In seeing a sample of lorem ipsum, his interest was piqued by consectetur—a genuine, albeit rare, Latin word.</p>',
              documentId: { contentIdKey: 'permanentid', contentIdValue: e.results.results[0].raw.permanentid },
              score: 0.7
            }
          ]
        };
      });
    }

    let smartSnippetSuggestionsElement: Dom;
    beforeEach(async done => {
      smartSnippetSuggestionsElement = $$('div', { className: Component.computeCssClassName(SmartSnippetSuggestions) });
      fakeNextQuestionAnswer();
      getResultsColumn().appendChild(smartSnippetSuggestionsElement.el);
      await afterDeferredQuerySuccess();
      smartSnippetSuggestionsElement.findClass('coveo-smart-snippet-suggestions-question-title-checkbox')[1].click();
      done();
    });

    it('should be accessible', async done => {
      const axeResults = await axe.run(smartSnippetSuggestionsElement.el);
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
