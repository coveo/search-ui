import { FieldValuesRenderer } from '../../../src/ui/RelevanceInspector/MetaDataTable';
import { FakeResults } from '../../Fake';
import { Dom, $$ } from '../../Test';
import { IQueryResult } from '../../../src/rest/QueryResult';
import { IFieldDescription } from '../../../src/rest/FieldDescription';

export function FieldValuesRendererTest() {
  describe('FieldValuesRenderer', () => {
    let container: Dom;
    let result: IQueryResult;
    let setRowHeightSpy: jasmine.Spy;
    let renderer: FieldValuesRenderer;

    const getInitParams = () => {
      return {
        eParentOfValue: container.el,
        node: { setRowHeight: setRowHeightSpy },
        api: { filterManager: { quickFilter: '' } },
        value: {
          result,
          fieldsDescription: <IFieldDescription[]>[
            {
              name: '@date',
              fieldType: 'Date'
            }
          ]
        }
      };
    };

    beforeEach(() => {
      container = $$('div');
      result = FakeResults.createFakeResult();
      setRowHeightSpy = jasmine.createSpy('spy');

      renderer = new FieldValuesRenderer();
      renderer.init(getInitParams());
    });

    it('should be able to render a list of fields name and their values', () => {
      const built = renderer.getGui();
      const allFieldNames = $$(built).findAll('.coveo-relevance-inspector-metadata-name');
      expect(allFieldNames.length).toBe(Object.keys(result.raw).length);
    });

    it('should format date field values', () => {
      const built = renderer.getGui();
      const allFieldNames = $$(built).findAll('.coveo-relevance-inspector-metadata-name');
      const allFieldsValues = $$(built).findAll('.coveo-relevance-inspector-metadata-value');
      expect(allFieldNames[1].textContent).toBe('date');
      expect(allFieldsValues[1].textContent).toContain(new Date(result.raw.date).toString());
    });

    describe("when there's a filter on a field name", () => {
      beforeEach(() => {
        renderer.init({
          ...getInitParams(),
          api: {
            filterManager: {
              quickFilter: 'date'
            }
          }
        });
      });

      it('should highlight the field name in the list', () => {
        const built = renderer.getGui();
        const highlighted = $$(built).find('.coveo-relevance-inspector-highlight');
        expect(highlighted).toBeDefined();
        expect(highlighted.textContent).toBe('date');
      });
    });

    describe("when there's a filter on a field value", () => {
      beforeEach(() => {
        renderer.init({
          ...getInitParams(),
          api: {
            filterManager: {
              quickFilter: 'value'
            }
          }
        });
      });

      it('should highlight the field name in the list', () => {
        const built = renderer.getGui();
        const highlighted = $$(built).find('.coveo-relevance-inspector-highlight');
        expect(highlighted).toBeDefined();
        expect(highlighted.textContent).toBe('value');
        expect(highlighted.parentElement.textContent).toBe('string value');
      });
    });
  });
}
