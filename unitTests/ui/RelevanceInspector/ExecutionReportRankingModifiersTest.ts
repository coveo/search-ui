import { ExecutionReportRankingModifiers } from '../../../src/ui/RelevanceInspector/ExecutionReportRankingModifiers';
import { IQueryResult } from '../../../src/rest/QueryResult';
import { IRankingExpression } from '../../../src/rest/RankingExpression';
import { IMockEnvironment, MockEnvironmentBuilder } from '../../MockEnvironment';
import { FakeResults } from '../../Fake';

export function ExecutionReportRankingModifiersTest() {
  describe('ExecutionReportRankingModifiers', () => {
    let results: IQueryResult[];
    let rankingExpressions: IRankingExpression[];
    let bindings: IMockEnvironment;

    beforeEach(() => {
      bindings = new MockEnvironmentBuilder().build();
      results = FakeResults.createFakeResults().results;
      rankingExpressions = [
        {
          expression: '@expression1',
          modifier: '100'
        }
      ];
    });

    it('should output an ag grid element as a container', async done => {
      const { container } = await new ExecutionReportRankingModifiers().build(results, rankingExpressions, bindings);
      expect(container.find('ag-grid-fresh')).toBeDefined();
      done();
    });

    it('should output a valid underlying ag grid data structure when the ranking expression is generic', async done => {
      const { gridOptions } = await new ExecutionReportRankingModifiers().build(results, rankingExpressions, bindings);
      expect(gridOptions.rowData[0].Expression).toBe('@expression1');
      expect(gridOptions.rowData[0].Modifier).toBe('100');
      expect(gridOptions.rowData[0].ReturnedByIndexForCurrentQuery).toBe('-- NULL --');
      expect(gridOptions.rowData[0].IsRecommendation).toBe('-- NULL --');
      expect(gridOptions.rowData[0].Document.result).toBeNull();
      done();
    });

    describe('when the ranking expression matches a machine learning automatic boost', () => {
      beforeEach(() => {
        rankingExpressions = [
          {
            expression: '@permanentid=qwerty',
            modifier: '200'
          }
        ];
      });

      it('when theres a result in the result set for that boost, it should build a valid underlying ag grid data structure', async done => {
        results[0].raw.permanentid = 'qwerty';
        results[0].isRecommendation = true;
        const { gridOptions } = await new ExecutionReportRankingModifiers().build(results, rankingExpressions, bindings);
        expect(gridOptions.rowData[0].Document.result).toBe(results[0]);
        expect(gridOptions.rowData[0].ReturnedByIndexForCurrentQuery).toBe('true');
        expect(gridOptions.rowData[0].IsRecommendation).toBe('true');
        done();
      });

      it('when theres no result in the result set for that boost it should launch a query to retrieve it', async done => {
        const spy = jasmine.createSpy('searchSpy');
        const fakeResults = FakeResults.createFakeResults();
        spy.and.returnValue(Promise.resolve(fakeResults));
        bindings.searchEndpoint.search = spy;
        await new ExecutionReportRankingModifiers().build(results, rankingExpressions, bindings);
        expect(bindings.searchEndpoint.search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            aq: '@permanentid=qwerty'
          })
        );
        done();
      });
    });
  });
}
