import { IQuery } from '../../src/rest/Query';
import { IQueryResult } from '../../src/rest/QueryResult';
import { IQueryResults } from '../../src/rest/QueryResults';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { Folding, IFoldingOptions } from '../../src/ui/Folding/Folding';
import { SortCriteria } from '../../src/ui/Sort/SortCriteria';
import { $$ } from '../../src/utils/Dom';
import { FakeResults } from '../Fake';
import * as Mock from '../MockEnvironment';
import { ISimulateQueryData, Simulate } from '../Simulate';
import _ = require('underscore');
import { Utils } from '../../src/Core';

export function FoldingTest() {
  describe('Folding', () => {
    let test: Mock.IBasicComponentSetup<Folding>;
    let fakeResults: IQueryResults;

    beforeEach(() => {
      test = Mock.optionsComponentSetup<Folding, IFoldingOptions>(Folding, {
        field: '@fieldname',
        child: '@foldingchild',
        parent: '@foldingparent',
        enableExpand: true,
        expandExpression: 'expandExpr',
        range: 2
      });
      fakeResults = FakeResults.createFakeResults(1);
      fakeResults.results[0].totalNumberOfChildResults = 3;
      fakeResults.results[0].childResults = [];
      fakeResults.results[0].raw.fieldname = 'fieldvalue';
    });

    afterEach(() => {
      test = null;
      fakeResults = null;
    });

    describe('exposes options', () => {
      describe('field', () => {
        it('should send the correct field to the outgoing query', () => {
          test = Mock.optionsComponentSetup<Folding, IFoldingOptions>(Folding, {
            field: '@myfield'
          });
          const data = Simulate.query(test.env);
          expect(data.queryBuilder.filterField).toBe('@myfield');
        });

        it('should set a default value for filter field', () => {
          test = Mock.basicComponentSetup<Folding>(Folding);
          const data = Simulate.query(test.env);
          expect(data.queryBuilder.filterField).toBe('@foldingcollection');
        });

        // Connectors configures the folding fields with default value, which are the *opposite* of what the index expects.
        // These UT should ensure that the switch is intentional and desired.
        describe('swapping child and parent options', () => {
          it('should set a default value for parent, which is used in the opposite query parameter', () => {
            test = Mock.basicComponentSetup<Folding>(Folding);
            const data = Simulate.query(test.env);
            expect(data.queryBuilder.childField).toBe('@foldingparent');
          });

          it('should set a default value for child, which is used in the opposite query parameter', () => {
            test = Mock.basicComponentSetup<Folding>(Folding);
            const data = Simulate.query(test.env);
            expect(data.queryBuilder.parentField).toBe('@foldingchild');
          });

          it('should swap the parentField option to child', () => {
            test = Mock.optionsComponentSetup<Folding, IFoldingOptions>(Folding, {
              parentField: '@usingDeprecatedOption'
            });
            const data = Simulate.query(test.env);
            expect(test.cmp.options.child).toBe('@usingDeprecatedOption');
            expect(data.queryBuilder.parentField).toBe('@usingDeprecatedOption');
          });

          it('should swap the childField option to parent', () => {
            test = Mock.optionsComponentSetup<Folding, IFoldingOptions>(Folding, {
              childField: '@usingDeprecatedOption'
            });
            const data = Simulate.query(test.env);
            expect(test.cmp.options.parent).toBe('@usingDeprecatedOption');
            expect(data.queryBuilder.childField).toBe('@usingDeprecatedOption');
          });
        });
      });

      it('range should set the proper range to the outgoing query', () => {
        test = Mock.optionsComponentSetup<Folding, IFoldingOptions>(Folding, {
          field: '@fieldname',
          range: 42
        });
        const data = Simulate.query(test.env);
        expect(data.queryBuilder.filterFieldRange).toBe(42);
      });

      it('expandExpression should include the custom expand expression to the expand query', () => {
        test = Mock.optionsComponentSetup<Folding, IFoldingOptions>(Folding, {
          field: '@fieldname',
          expandExpression: 'myExpandExpression'
        });
        const data = Simulate.query(test.env, { results: fakeResults });

        data.results.results[0].moreResults();
        expect(test.env.queryController.getEndpoint().search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            cq: 'myExpandExpression'
          })
        );
      });

      it('maximumExpandedResults should set the number of results properly to the expand query', () => {
        test = Mock.optionsComponentSetup<Folding, IFoldingOptions>(Folding, {
          field: '@fieldname',
          maximumExpandedResults: 42
        });

        const data = Simulate.query(test.env, { results: fakeResults });
        test.env.queryController.getEndpoint().search = (query: IQuery) => {
          expect(query.numberOfResults).toBe(42);
          return new Promise((resolve, reject) => null);
        };
        data.results.results[0].moreResults();
      });

      it('enableExpand set to true should provide an expand function', () => {
        test = Mock.optionsComponentSetup<Folding, IFoldingOptions>(Folding, {
          field: '@fieldname',
          enableExpand: true
        });
        const data = Simulate.query(test.env, { results: fakeResults });
        expect(data.results.results[0].moreResults).toEqual(jasmine.any(Function));
      });

      it('enableExpand set to false should not provide an expand function', () => {
        test = Mock.optionsComponentSetup<Folding, IFoldingOptions>(Folding, {
          field: '@fieldname',
          enableExpand: false
        });
        const data = Simulate.query(test.env, { results: fakeResults });
        expect(data.results.results[0].moreResults).toBeUndefined();
      });
    });

    describe('should re-arrange child results client side when preprocessing results', () => {
      beforeEach(() => {
        fakeResults = FakeResults.createFakeResultsWithChildResults(10, 5, 10);

        fakeResults.results.forEach(fakeResult => {
          let i = 0;
          fakeResult.childResults.forEach(childResult => {
            childResult.raw.numericalField = i;
            i++;
          });
        });
      });

      const verifyChildOrder = (firstExpectedValue: number, lastExpectedValue: number) => {
        expect(fakeResults.results[0].childResults[0].raw.numericalField).toBe(firstExpectedValue);
        expect(fakeResults.results[0].childResults[4].raw.numericalField).toBe(lastExpectedValue);

        expect(fakeResults.results[9].childResults[0].raw.numericalField).toBe(firstExpectedValue);
        expect(fakeResults.results[9].childResults[4].raw.numericalField).toBe(lastExpectedValue);
      };

      it('by field ascending', () => {
        test = Mock.optionsComponentSetup<Folding, IFoldingOptions>(Folding, {
          rearrange: SortCriteria.parse('@numericalField ascending')
        });

        $$(test.env.root).trigger('preprocessResults', {
          results: fakeResults
        });

        verifyChildOrder(0, 4);
      });

      it('by field descending', () => {
        test = Mock.optionsComponentSetup<Folding, IFoldingOptions>(Folding, {
          rearrange: SortCriteria.parse('@numericalField descending')
        });

        $$(test.env.root).trigger('preprocessResults', {
          results: fakeResults
        });

        verifyChildOrder(4, 0);
      });

      it('by non-existing field', () => {
        test = Mock.optionsComponentSetup<Folding, IFoldingOptions>(Folding, {
          rearrange: SortCriteria.parse('@doesNotExist descending')
        });

        $$(test.env.root).trigger('preprocessResults', {
          results: fakeResults
        });

        verifyChildOrder(0, 4);
      });
    });

    describe('expand', () => {
      let queryData: ISimulateQueryData;

      beforeEach(() => {
        test = Mock.optionsComponentSetup<Folding, IFoldingOptions>(Folding, {
          field: '@fieldname',
          maximumExpandedResults: 7
        });
        queryData = Simulate.query(test.env, { query: { q: 'foo bar' }, results: fakeResults });
      });

      afterEach(() => {
        test = null;
        queryData = null;
      });

      it('should trap the error if a query error happens when getting more results', () => {
        (test.env.searchEndpoint.search as jasmine.Spy).and.returnValue(Promise.reject("That's a bad query"));
        expect(() => queryData.results.results[0].moreResults()).not.toThrowError();
      });

      it('should return an empty array if a query error happens when getting more results', async done => {
        (test.env.searchEndpoint.search as jasmine.Spy).and.returnValue(Promise.reject("That's a bad query"));
        const results = await queryData.results.results[0].moreResults();
        expect(Utils.isEmptyArray(results)).toBe(true);
        done();
      });

      describe('should clone the original query', () => {
        let query: QueryBuilder;

        beforeEach(() => {
          query = new QueryBuilder();
          query.fieldsToInclude = ['should', 'be', 'included'];
          query.expression.add('should be there');
          query.advancedExpression.add('should not be there');
          query.firstResult = 9999;
          query.facetRequests = [{ facetId: 'facet', field: '@facet' }];
          query.categoryFacets = [{ field: '@category' }];
          query.facetOptions = { freezeFacetOrder: true };
          fakeResults._folded = null;
          queryData = Simulate.query(test.env, {
            query: query.build(),
            results: fakeResults
          });
          queryData.results.results[0].moreResults();
        });

        it('and modify q', () => {
          expect(test.env.queryController.getEndpoint().search).toHaveBeenCalledWith(
            jasmine.objectContaining({
              aq: '@fieldname=fieldvalue',
              fieldsToInclude: jasmine.arrayContaining(['should', 'be', 'included']),
              filterField: null,
              filterFieldRange: null,
              q: '( <@- should be there -@> ) OR @uri'
            })
          );
        });

        it('and modify firstResult', () => {
          expect(test.env.queryController.getEndpoint().search).toHaveBeenCalledWith(
            jasmine.objectContaining({
              firstResult: 0
            })
          );
        });

        it('and modify aq', () => {
          expect(test.env.queryController.getEndpoint().search).toHaveBeenCalledWith(
            jasmine.objectContaining({
              aq: '@fieldname=fieldvalue'
            })
          );
        });

        it('and clear facets', () => {
          expect(test.env.queryController.getEndpoint().search).toHaveBeenCalledWith(
            jasmine.objectContaining({
              facets: []
            })
          );
        });

        it('and clear categoryFacets', () => {
          expect(test.env.queryController.getEndpoint().search).toHaveBeenCalledWith(
            jasmine.objectContaining({
              categoryFacets: []
            })
          );
        });

        it('and clear facetOptions', () => {
          expect(test.env.queryController.getEndpoint().search).toHaveBeenCalledWith(
            jasmine.objectContaining({
              facetOptions: {}
            })
          );
        });

        it('and modify fieldsToInclude', () => {
          expect(test.env.queryController.getEndpoint().search).toHaveBeenCalledWith(
            jasmine.objectContaining({
              fieldsToInclude: jasmine.arrayContaining(['should', 'be', 'included'])
            })
          );
        });

        it('and modify filterFieldRange', () => {
          expect(test.env.queryController.getEndpoint().search).toHaveBeenCalledWith(
            jasmine.objectContaining({
              filterFieldRange: null
            })
          );
        });

        it('and modify query syntax', () => {
          expect(test.env.queryController.getEndpoint().search).toHaveBeenCalledWith(
            jasmine.objectContaining({
              enableQuerySyntax: true
            })
          );
        });
      });

      it('should perform query with expected expression when moreResults is called', () => {
        queryData.results.results[0].moreResults();
        expect(test.env.queryController.getEndpoint().search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            aq: '@fieldname=fieldvalue'
          })
        );
      });

      it('should include query keywords for highlighting', () => {
        queryData.results.results[0].moreResults();
        expect(test.env.queryController.getEndpoint().search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            q: '( <@- foo bar -@> ) OR @uri'
          })
        );
      });

      it('should use the specified maximum number of results', () => {
        queryData.results.results[0].moreResults();
        expect(test.env.queryController.getEndpoint().search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            numberOfResults: 7
          })
        );
      });
    });

    it('should rearrange a result that is an attachment if it has a parentResult', () => {
      test = Mock.optionsComponentSetup<Folding, IFoldingOptions>(Folding, {
        field: '@fieldname',
        childField: '@childfield',
        parentField: '@parentfield'
      });
      const parent = FakeResults.createFakeResult('ParentResult');
      parent.flags = 'ContainsAttachment';
      parent.raw.parentfield = 'abc';
      fakeResults.results[0].flags = 'IsAttachment';
      fakeResults.results[0].parentResult = parent;
      fakeResults.results[0].raw.childfield = 'abc';
      const data = Simulate.query(test.env, { results: fakeResults });
      expect(data.results.results[0].title).toBe('TitleParentResult');
    });

    it('should set the proper childResults and attachments in multiple folded results', () => {
      const results: IQueryResult[] = [];
      _.times(7, n => results.push(FakeResults.createFakeResult(n.toString())));

      // 0 - 1
      //   - 2 - 3
      // 4 - 5
      // 6

      results[1].parentResult = results[0];
      results[2].parentResult = results[0];
      results[3].parentResult = results[2];
      results[5].parentResult = results[4];
      let topResult = results.shift();
      topResult.childResults = results;

      topResult = Folding.defaultGetResult(topResult);

      expect(topResult).toEqual(
        jasmine.objectContaining({
          uniqueId: 'uniqueId0',
          attachments: [
            jasmine.objectContaining({
              uniqueId: 'uniqueId1',
              attachments: []
            }),
            jasmine.objectContaining({
              uniqueId: 'uniqueId2',
              attachments: [
                jasmine.objectContaining({
                  uniqueId: 'uniqueId3',
                  attachments: []
                })
              ]
            })
          ],
          childResults: [
            jasmine.objectContaining({
              uniqueId: 'uniqueId4',
              attachments: [
                jasmine.objectContaining({
                  uniqueId: 'uniqueId5'
                })
              ]
            }),
            jasmine.objectContaining({
              uniqueId: 'uniqueId6',
              attachments: []
            })
          ]
        })
      );
    });

    it('should sort by the original position', () => {
      const results: IQueryResult[] = [];
      _.times(7, n => results.push(FakeResults.createFakeResult(n.toString())));

      // Priority is : 6, 3, 5, 4, 1, 2, 0
      // Give :
      // 6
      // 0 - 2 - 3
      //   - 1
      // 4 - 5

      results[1].parentResult = results[0];
      results[2].parentResult = results[0];
      results[3].parentResult = results[2];
      results[5].parentResult = results[4];
      let topResult = results[6];
      topResult.childResults = [results[3], results[5], results[4], results[1], results[2], results[0]];

      topResult = Folding.defaultGetResult(topResult);

      expect(topResult).toEqual(
        jasmine.objectContaining({
          uniqueId: 'uniqueId6',
          attachments: [],
          childResults: [
            jasmine.objectContaining({
              uniqueId: 'uniqueId0',
              attachments: [
                jasmine.objectContaining({
                  uniqueId: 'uniqueId2',
                  attachments: [
                    jasmine.objectContaining({
                      uniqueId: 'uniqueId3'
                    })
                  ]
                }),
                jasmine.objectContaining({
                  uniqueId: 'uniqueId1',
                  attachments: []
                })
              ]
            }),
            jasmine.objectContaining({
              uniqueId: 'uniqueId4',
              attachments: [
                jasmine.objectContaining({
                  uniqueId: 'uniqueId5',
                  attachments: []
                })
              ]
            })
          ]
        })
      );
    });

    it('should remove duplicate from the result set if one is loaded through the parentResult field', () => {
      const results: IQueryResult[] = [];
      _.times(7, n => results.push(FakeResults.createFakeResult(n.toString())));

      // 0 - 1
      //   - 2 - 3
      // 4 - 5
      // 6

      results[1].parentResult = results[0];
      results[2].parentResult = results[0];
      results[3].parentResult = results[2];
      results[5].parentResult = results[4];
      results.push(results[0], results[2], results[3], results[5], results[6]);

      let topResult = results.shift();
      topResult.childResults = results;

      topResult = Folding.defaultGetResult(topResult);

      expect(topResult).toEqual(
        jasmine.objectContaining({
          uniqueId: 'uniqueId0',
          attachments: [
            jasmine.objectContaining({
              uniqueId: 'uniqueId1',
              attachments: []
            }),
            jasmine.objectContaining({
              uniqueId: 'uniqueId2',
              attachments: [
                jasmine.objectContaining({
                  uniqueId: 'uniqueId3'
                })
              ]
            })
          ],
          childResults: [
            jasmine.objectContaining({
              uniqueId: 'uniqueId4',
              attachments: [
                jasmine.objectContaining({
                  uniqueId: 'uniqueId5'
                })
              ]
            }),
            jasmine.objectContaining({
              uniqueId: 'uniqueId6',
              attachments: []
            })
          ]
        })
      );
    });
  });
}
