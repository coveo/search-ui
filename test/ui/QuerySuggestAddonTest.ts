import { Omnibox, MagicBox } from '../../src/ui/Omnibox/Omnibox';
import * as Mock from '../MockEnvironment';
import { QuerySuggestAddon } from '../../src/ui/Omnibox/QuerySuggestAddon';
import { SearchEndpoint } from '../../src/rest/SearchEndpoint';
import { ComponentOptionsModel } from '../../src/models/ComponentOptionsModel';
import { SearchInterface } from '../../src/ui/SearchInterface/SearchInterface';
import { QueryController } from '../../src/controllers/QueryController';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { Simulate } from '../Simulate';

export function QuerySuggestAddonTest() {
  describe('QuerySuggest', () => {
    let omnibox: Omnibox;
    let endpoint: SearchEndpoint;
    let cmpOptionsModel: ComponentOptionsModel;
    let searchInterface: SearchInterface;
    let queryController: QueryController;

    beforeEach(() => {
      omnibox = Mock.mockComponent<Omnibox>(Omnibox);
      omnibox.element = document.createElement('div');

      queryController = Mock.mockQueryController();
      endpoint = Mock.mockSearchEndpoint();
      queryController.getEndpoint = () => endpoint;
      omnibox.queryController = queryController;
      queryController.getLastQuery = () => new QueryBuilder().build();

      let magicBox = Mock.mock<any>(MagicBox);
      magicBox.getText = () => 'hello world';
      omnibox.magicBox = magicBox;

      cmpOptionsModel = new Mock.MockEnvironmentBuilder().build().componentOptionsModel;
      searchInterface = new Mock.MockEnvironmentBuilder().build().searchInterface;

      omnibox.getBindings = () => {
        return {
          componentOptionsModel: cmpOptionsModel,
          searchInterface: searchInterface,
          queryController: queryController
        };
      };
      omnibox.options = {};
    });

    afterEach(() => {
      omnibox = null;
      endpoint = null;
    });

    describe('should call the query suggest service', () => {
      it('with the locale', () => {
        let querySuggest = new QuerySuggestAddon(omnibox);
        querySuggest.getSuggestion();
        expect(endpoint.getQuerySuggest).toHaveBeenCalledWith(
          jasmine.objectContaining({
            locale: jasmine.any(String)
          })
        );
      });

      it('with the search hub', () => {
        (<any>cmpOptionsModel).get.and.returnValue('a search hub');

        let querySuggest = new QuerySuggestAddon(omnibox);
        querySuggest.getSuggestion();
        expect(endpoint.getQuerySuggest).toHaveBeenCalledWith(
          jasmine.objectContaining({
            searchHub: 'a search hub'
          })
        );
      });

      it('with the pipeline', () => {
        searchInterface.options.pipeline = 'a pipeline';

        let querySuggest = new QuerySuggestAddon(omnibox);
        querySuggest.getSuggestion();
        expect(endpoint.getQuerySuggest).toHaveBeenCalledWith(
          jasmine.objectContaining({
            pipeline: 'a pipeline'
          })
        );
      });

      it('with the context', () => {
        searchInterface.getQueryContext = () => {
          return <any>{
            'context key': 'context value'
          };
        };

        let querySuggest = new QuerySuggestAddon(omnibox);
        querySuggest.getSuggestion();
        expect(endpoint.getQuerySuggest).toHaveBeenCalledWith(
          jasmine.objectContaining({
            context: { 'context key': 'context value' }
          })
        );
      });

      // PhantomJS faulty Promise implementation causes issues here
      if (!Simulate.isPhantomJs()) {
        describe('with a cache', () => {
          it('should cache the result', done => {
            let querySuggest = new QuerySuggestAddon(omnibox);
            let firstPromise = new Promise((resolve, reject) => {});

            (<any>endpoint).getQuerySuggest.and.returnValue(firstPromise);
            let firstPromiseReturned = querySuggest.getSuggestion();
            expect(firstPromiseReturned).toEqual(firstPromise);

            setTimeout(() => {
              let secondPromise = new Promise((resolve, reject) => {});
              (<any>endpoint).getQuerySuggest.and.returnValue(secondPromise);
              let secondPromiseReturned = querySuggest.getSuggestion();
              expect(secondPromiseReturned).toBe(firstPromiseReturned);
              done();
            }, 10);
          });

          it('should not cache the result if the query fails', done => {
            let querySuggest = new QuerySuggestAddon(omnibox);
            let firstPromise = new Promise((resolve, reject) => {
              reject(false);
            });
            (<any>endpoint).getQuerySuggest.and.returnValue(firstPromise);

            let firstPromiseReturned = querySuggest.getSuggestion();
            expect(firstPromiseReturned).toEqual(firstPromise);

            setTimeout(() => {
              let secondPromise = new Promise((resolve, reject) => {});
              (<any>endpoint).getQuerySuggest.and.returnValue(secondPromise);
              let secondPromiseReturned = querySuggest.getSuggestion();
              expect(secondPromiseReturned).not.toBe(firstPromiseReturned);
              done();
            }, 10);
          });
        });
      }

      describe('when the call returns', () => {
        beforeEach(() => {
          let results = new Promise((resolve, reject) => {
            resolve({
              completions: [
                {
                  expression: 'properly',
                  score: 1012.5762345619406,
                  highlighted: '{pr}[operly]'
                },
                {
                  expression: "properly 'didn't",
                  score: 12.576234561940641,
                  highlighted: "{pr}[operly] ['didn't]"
                },
                {
                  expression: 'pointers',
                  score: 10.783334340677321,
                  highlighted: '(pointers)'
                },
                {
                  expression: 'pages',
                  score: 10.485485771662475,
                  highlighted: '(pages)'
                }
              ]
            });
          });
          (<any>endpoint).getQuerySuggest.and.returnValue(results);
        });

        it('should contain the text', done => {
          let querySuggest = new QuerySuggestAddon(omnibox);
          let results = querySuggest.getSuggestion();
          results.then(completions => {
            expect(completions[0].text).toBe('properly');
            done();
          });
        });

        it('should contain an html version of the completion', done => {
          let querySuggest = new QuerySuggestAddon(omnibox);
          let results = querySuggest.getSuggestion();
          results.then(completions => {
            expect(completions[0].html).toBeDefined();
            done();
          });
        });
      });
    });
  });
}
