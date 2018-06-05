import { TableBuilder, ITableDataSource, ThumbnailHtmlRenderer } from '../../../src/ui/RelevanceInspector/TableBuilder';
import { FakeResults } from '../../Fake';
import { MockEnvironmentBuilder } from '../../MockEnvironment';
import { IQueryResult } from '../../../src/rest/QueryResult';
import { IComponentBindings } from '../../../src/ui/Base/ComponentBindings';
import { $$, Dom } from '../../../src/Core';

export function TableBuilderTest() {
  describe('TableBuilder', () => {
    describe('when building thumbnail cells', () => {
      let result: IQueryResult;
      let env: IComponentBindings;
      let thumbnailInfo: Record<string, ITableDataSource>;

      beforeEach(() => {
        result = FakeResults.createFakeResult();
        env = new MockEnvironmentBuilder().build();
        thumbnailInfo = TableBuilder.thumbnailCell(result, env);
      });

      it('content should contain the result', () => {
        expect(thumbnailInfo.Document.content.result).toBe(result);
      });

      it('content should contain the environment bindings', () => {
        expect(thumbnailInfo.Document.content.bindings).toBe(env);
      });

      it('should use a specific cell renderer class', () => {
        expect(thumbnailInfo.Document.cellRenderer).toBe(ThumbnailHtmlRenderer);
      });

      it('should not offer quick filtering options', () => {
        expect(thumbnailInfo.Document.getQuickFilterText(null)).toBe('');
      });
    });

    describe('when build a table', () => {
      let table: Dom;

      beforeEach(() => {
        table = $$('div');
      });

      it('should correctly build a single column and a single row', async done => {
        const built = await new TableBuilder().build(
          [
            {
              Foo: {
                content: 'bar'
              }
            }
          ],
          table
        );
        expect(built.gridOptions.rowData.length).toBe(1);
        expect(built.gridOptions.rowData[0].Foo).toBe('bar');
        expect(built.gridOptions.columnDefs.length).toBe(1);
        expect(built.gridOptions.columnDefs[0].headerName).toBe('Foo');

        done();
      });

      it('should correctly build a single row with multiple columns', async done => {
        const built = await new TableBuilder().build(
          [
            {
              Foo: {
                content: 'bar'
              },
              Bazz: {
                content: 'buzz'
              }
            }
          ],
          table
        );

        expect(built.gridOptions.rowData.length).toBe(1);
        expect(built.gridOptions.rowData[0].Foo).toBe('bar');
        expect(built.gridOptions.rowData[0].Bazz).toBe('buzz');
        expect(built.gridOptions.columnDefs.length).toBe(2);

        done();
      });

      it('should correctly build multiple row with multiple columns', async done => {
        const built = await new TableBuilder().build(
          [
            {
              Foo: {
                content: 'bar'
              },
              Bazz: {
                content: 'buzz'
              }
            },
            {
              Foo: {
                content: 'bar2'
              },
              Bazz: {
                content: 'buzz2'
              }
            }
          ],
          table
        );

        expect(built.gridOptions.rowData.length).toBe(2);
        expect(built.gridOptions.rowData[0].Foo).toBe('bar');
        expect(built.gridOptions.rowData[0].Bazz).toBe('buzz');
        expect(built.gridOptions.rowData[1].Foo).toBe('bar2');
        expect(built.gridOptions.rowData[1].Bazz).toBe('buzz2');
        expect(built.gridOptions.columnDefs.length).toBe(2);
        done();
      });

      it('should be able to render children in a row', async done => {
        const built = await new TableBuilder().build(
          [
            {
              Foo: {
                children: [
                  {
                    Bar: {
                      content: 'buzz'
                    },
                    Bazz: {
                      content: 'qwerty'
                    }
                  }
                ]
              }
            }
          ],
          table
        );
        expect(built.gridOptions.columnDefs.length).toBe(1);
        expect(built.gridOptions.columnDefs[0].headerName).toBe('Foo');
        expect(built.gridOptions.columnDefs[0]['children'].length).toBe(2);
        expect(built.gridOptions.columnDefs[0]['children'][0].headerName).toBe('Bar');
        expect(built.gridOptions.columnDefs[0]['children'][1].headerName).toBe('Bazz');
        done();
      });
    });
  });
}
