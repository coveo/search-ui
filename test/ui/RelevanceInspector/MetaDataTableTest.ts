import { MetaDataTable } from '../../../src/ui/RelevanceInspector/MetaDataTable';
import { IQueryResult } from '../../../src/rest/QueryResult';
import { FakeResults } from '../../Fake';
import { MockEnvironmentBuilder, IMockEnvironment } from '../../MockEnvironment';

export function MetaDataTableTest() {
  describe('MetaDataTable', () => {
    let results: IQueryResult[];
    let bindings: IMockEnvironment;
    let listFieldSpy: jasmine.Spy;

    beforeEach(() => {
      results = FakeResults.createFakeResults().results;
      bindings = new MockEnvironmentBuilder().build();
      listFieldSpy = jasmine.createSpy('listField');
      listFieldSpy.and.returnValue([]);
      bindings.searchEndpoint.listFields = listFieldSpy;
    });

    it('should build one ag grid element for each result', async done => {
      const metadataTable = new MetaDataTable(results, bindings);
      const built = await metadataTable.build();
      expect(built.findAll('.ag-theme-fresh').length).toBe(results.length);
      done();
    });
  });
}
