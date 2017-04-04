import { Omnibox, MagicBox } from '../../src/ui/Omnibox/Omnibox';
import * as Mock from '../MockEnvironment';
import { RevealQuerySuggestAddon } from '../../src/ui/Omnibox/RevealQuerySuggestAddon';
import { SearchEndpoint } from '../../src/rest/SearchEndpoint';
import { ComponentOptionsModel } from '../../src/models/ComponentOptionsModel';
import { SearchInterface } from '../../src/ui/SearchInterface/SearchInterface';
import { QueryController } from '../../src/controllers/QueryController';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { Simulate } from '../Simulate';

export function RevealQuerySuggestAddonTest() {
  describe('RevealQuerySuggest', () => {
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
          'componentOptionsModel': cmpOptionsModel,
          'searchInterface': searchInterface,
          'queryController': queryController
        };
      };
      omnibox.options = {};
    });

    afterEach(() => {
      omnibox = null;
      endpoint = null;
    });

    describe('should call the query suggest service', () => {
      it('with the language', () => {
        let revealQuerySuggest = new RevealQuerySuggestAddon(omnibox);
        revealQuerySuggest.getSuggestion();
        expect(endpoint.getRevealQuerySuggest).toHaveBeenCalledWith(jasmine.objectContaining({
          language: jasmine.any(String)
        }));
      });

      it('with the search hub', () => {
        (<any>cmpOptionsModel).get.and.returnValue('a search hub');

        let revealQuerySuggest = new RevealQuerySuggestAddon(omnibox);
        revealQuerySuggest.getSuggestion();
        expect(endpoint.getRevealQuerySuggest).toHaveBeenCalledWith(jasmine.objectContaining({
          searchHub: 'a search hub'
        }));
      });

      it('with the pipeline', () => {
        searchInterface.options.pipeline = 'a pipeline';

        let revealQuerySuggest = new RevealQuerySuggestAddon(omnibox);
        revealQuerySuggest.getSuggestion();
        expect(endpoint.getRevealQuerySuggest).toHaveBeenCalledWith(jasmine.objectContaining({
          pipeline: 'a pipeline'
        }));
      });

      it('with the context', () => {
        queryController.getLastQuery = () => {
          return <any>{
            context: 'a context'
          };
        };

        let revealQuerySuggest = new RevealQuerySuggestAddon(omnibox);
        revealQuerySuggest.getSuggestion();
        expect(endpoint.getRevealQuerySuggest).toHaveBeenCalledWith(jasmine.objectContaining({
          context: 'a context'
        }));
      });

      // PhantomJS faulty Promise implementation causes issues here
      if (!Simulate.isPhantomJs()) {
        describe('with a cache', () => {
          it('should cache the result', (done) => {
            let revealQuerySuggest = new RevealQuerySuggestAddon(omnibox);
            let firstPromise = new Promise((resolve, reject) => {
            });

            (<any>endpoint).getRevealQuerySuggest.and.returnValue(firstPromise);
            let firstPromiseReturned = revealQuerySuggest.getSuggestion();
            expect(firstPromiseReturned).toEqual(firstPromise);

            setTimeout(() => {
              let secondPromise = new Promise((resolve, reject) => {
              });
              (<any>endpoint).getRevealQuerySuggest.and.returnValue(secondPromise);
              let secondPromiseReturned = revealQuerySuggest.getSuggestion();
              expect(secondPromiseReturned).toBe(firstPromiseReturned);
              done();
            }, 10);
          });

          it('should not cache the result if the query fails', (done) => {
            let revealQuerySuggest = new RevealQuerySuggestAddon(omnibox);
            let firstPromise = new Promise((resolve, reject) => {
              reject(false);
            });
            (<any>endpoint).getRevealQuerySuggest.and.returnValue(firstPromise);

            let firstPromiseReturned = revealQuerySuggest.getSuggestion();
            expect(firstPromiseReturned).toEqual(firstPromise);

            setTimeout(() => {
              let secondPromise = new Promise((resolve, reject) => {
              });
              (<any>endpoint).getRevealQuerySuggest.and.returnValue(secondPromise);
              let secondPromiseReturned = revealQuerySuggest.getSuggestion();
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
              'completions': [{
                'expression': 'properly',
                'score': 1012.5762345619406,
                'highlighted': '{pr}[operly]'
              }, {
                'expression': 'properly \'didn\'t',
                'score': 12.576234561940641,
                'highlighted': '{pr}[operly] [\'didn\'t]'
              }, {
                'expression': 'pointers',
                'score': 10.783334340677321,
                'highlighted': '(pointers)'
              }, {
                'expression': 'pages',
                'score': 10.485485771662475,
                'highlighted': '(pages)'
              }]
            });
          });
          (<any>endpoint).getRevealQuerySuggest.and.returnValue(results);
        });

        it('should contain the text', (done) => {
          let revealQuerySuggest = new RevealQuerySuggestAddon(omnibox);
          let results = revealQuerySuggest.getSuggestion();
          results.then((completions) => {
            expect(completions[0].text).toBe('properly');
            done();
          });
        });

        it('should contain an html version of the completion', (done) => {
          let revealQuerySuggest = new RevealQuerySuggestAddon(omnibox);
          let results = revealQuerySuggest.getSuggestion();
          results.then((completions) => {
            expect(completions[0].html).toBeDefined();
            done();
          });
        });
      });
    });

  });
}
