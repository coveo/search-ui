import { IIndexFieldValue } from '../../src/rest/FieldValue';
import { IListFieldValuesRequest } from '../../src/rest/ListFieldValuesRequest';
import { IFieldOption } from '../../src/ui/Base/IComponentOptions';
import { IQuerySuggestionKeyword } from '../../src/ui/FacetValueSuggestions/FacetValueSuggestions';
import { FacetValueSuggestionsProvider } from '../../src/ui/FacetValueSuggestions/FacetValueSuggestionsProvider';
import * as Mock from '../MockEnvironment';

export function FacetValueSuggestionsProviderTest() {
  describe('FacetValueSuggestionsProvider', () => {
    let test: FacetValueSuggestionsProvider;
    let environment: Mock.IMockEnvironment;
    const someField: IFieldOption = '@bloupbloup';
    const valueToSearch: IQuerySuggestionKeyword = {
      text: 'cowboy',
      html: `<span class='coveo-omnibox-hightlight'>cowboy</span>`
    };
    const referenceFieldNumberOfResults = 10;
    const suggestion = 'suggestion';

    const setUpLastQuery = (aq: string = '', cq: string = '') => {
      (<jasmine.Spy>environment.queryController.getLastQuery).and.returnValue({
        aq,
        cq
      });
    };

    const setUpFieldValuesBatchResponse = (values: IIndexFieldValue[][]) => {
      const valuesWithReference: IIndexFieldValue[][] = [].concat(values).concat([getReferenceBatchResponse()]);
      (<jasmine.Spy>environment.searchEndpoint.listFieldValuesBatch).and.returnValue(Promise.resolve(valuesWithReference));
    };

    const getIndexFieldValue = (numberOfResults: number, value: string) => {
      return <IIndexFieldValue>{
        numberOfResults,
        value: value
      };
    };

    const getReferenceBatchResponse = () => {
      return <IIndexFieldValue[]>[getIndexFieldValue(referenceFieldNumberOfResults, suggestion)];
    };

    beforeEach(() => {
      environment = new Mock.MockEnvironmentBuilder().build();
      environment.queryController.getLastQuery = jasmine.createSpy('getLastQuery');
      setUpLastQuery();
      environment.searchEndpoint.listFieldValuesBatch = jasmine.createSpy('listFieldValuesBatch');
      setUpFieldValuesBatchResponse([]);
      test = new FacetValueSuggestionsProvider(environment.queryController, {
        field: <string>someField
      });
    });

    afterEach(() => {
      test = null;
      environment = null;
    });

    it('should execute listFieldValuesBatch with value to search and reference', async done => {
      await test.getSuggestions([valueToSearch]);

      expect(environment.searchEndpoint.listFieldValuesBatch).toHaveBeenCalledWith({
        batch: <IListFieldValuesRequest[]>[
          {
            field: someField,
            ignoreAccents: true,
            maximumNumberOfValues: 3,
            queryOverride: valueToSearch.text
          },
          {
            field: someField
          }
        ]
      });
      done();
    });

    describe('given field request returns suggestions', () => {
      const fieldRequestNumberOfResults = 1;
      beforeEach(() => {
        setUpFieldValuesBatchResponse([
          [
            {
              value: suggestion,
              numberOfResults: fieldRequestNumberOfResults
            }
          ]
        ]);
      });

      it('returns suggestions for the value to search', async done => {
        const results = await test.getSuggestions([valueToSearch]);

        expect(results.length).toBe(1);
        expect(results[0].value).toBe(suggestion);
        expect(results[0].score.distanceFromTotalForField).not.toBeUndefined();
        done();
      });
    });

    describe('given field request returns a lot of suggestions', () => {
      beforeEach(() => {
        const response = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => getIndexFieldValue(i, i.toString()));
        setUpFieldValuesBatchResponse([response]);
      });

      it('should return the same number of suggestions', async done => {
        const results = await test.getSuggestions([valueToSearch]);

        expect(results.length).toBe(10);
        done();
      });
    });

    describe('with an additional expression', () => {
      const anExpression = '@foofield==barvalue';

      beforeEach(() => {
        test = new FacetValueSuggestionsProvider(environment.queryController, {
          field: <string>someField,
          expression: anExpression
        });
      });

      it(`should execute listFieldValuesBatch with queryOverride containing an additional expression`, async done => {
        await test.getSuggestions([valueToSearch]);

        expect(environment.searchEndpoint.listFieldValuesBatch).toHaveBeenCalledWith({
          batch: jasmine.arrayContaining([
            jasmine.objectContaining({
              queryOverride: jasmine.stringMatching(`${anExpression}`)
            })
          ])
        });

        done();
      });
    });
  });
}
