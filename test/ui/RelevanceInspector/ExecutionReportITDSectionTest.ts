import { EXECUTION_REPORT_SECTION, IExecutionReport, IExecutionReportSection } from '../../../src/ui/RelevanceInspector/ExecutionReport';
import {
  ExecutionReportITDSection,
  IRefinedQueriesFromTopClicks,
  IExecutionReportITDSection
} from '../../../src/ui/RelevanceInspector/ExecutionReportITDSection';
import { Dom } from '../../../src/utils/Dom';
import { StreamHighlightUtils } from '../../../src/Core';
import { isArray } from 'util';

export function ExecutionReportITDSectionTest() {
  describe('ExecutionReportITDSection', () => {
    const getExecutionReportSection = (childSection: IExecutionReportSection | IExecutionReportSection[], lq: string): IExecutionReport => {
      return {
        duration: 123,
        children: [
          {
            name: EXECUTION_REPORT_SECTION.PREPROCESS_QUERY,
            duration: 456,

            result: {
              in: {
                lq
              }
            },
            description: 'Preprocess query',
            children: isArray(childSection) ? childSection : [childSection]
          }
        ]
      };
    };

    const getExecutionReportSectionForITD = (refinedQueries: IRefinedQueriesFromTopClicks[]): IExecutionReportITDSection => {
      return {
        description: 'MLExtraction',
        duration: 789,
        name: EXECUTION_REPORT_SECTION.TOP_CLICKS,
        result: {},
        refinedQueries
      };
    };

    const getKeywordExtractedRowData = (gridOptions): Dom => {
      return gridOptions.rowData[0]['Keyword(s) extracted'];
    };

    const getLongQueryRecall = (gridOptions): string => {
      return gridOptions.rowData[0]['Original large query'];
    };

    describe('when dealing with ML keywords extraction', () => {
      it('should output an ag grid element as a container', async done => {
        const { container } = await new ExecutionReportITDSection().build(
          getExecutionReportSection(getExecutionReportSectionForITD([]), '')
        );
        expect(container.find('ag-grid-fresh')).toBeDefined();
        done();
      });

      it('should output a fallback if the long query is empty', async done => {
        const { container } = await new ExecutionReportITDSection().build(
          getExecutionReportSection(getExecutionReportSectionForITD([]), '')
        );
        expect(container.text()).toContain('NO DATA AVAILABLE');
        done();
      });

      it('should output a fallback if the long query is not empty but no refined query was identified by ML', async done => {
        const { gridOptions } = await new ExecutionReportITDSection().build(
          getExecutionReportSection(getExecutionReportSectionForITD([]), 'the long query is not empty')
        );
        expect(getKeywordExtractedRowData(gridOptions).text()).toContain('No keywords were extracted');
        done();
      });

      describe('with keywords extracted', () => {
        let execReport: IExecutionReport;

        beforeEach(() => {
          execReport = getExecutionReportSection(
            getExecutionReportSectionForITD([{ q: 'query', score: 0.9 }, { q: 'long', score: 0.5 }]),
            'the long query is not empty'
          );
        });

        it('should output the keywords extracted if available', async done => {
          const { gridOptions } = await new ExecutionReportITDSection().build(execReport);

          expect(getKeywordExtractedRowData(gridOptions).text()).toContain('performed using Coveo Machine Learning');

          expect(getKeywordExtractedRowData(gridOptions).text()).toContain('Keyword: query');
          expect(getKeywordExtractedRowData(gridOptions).text()).toContain('Score: 0.9');

          expect(getKeywordExtractedRowData(gridOptions).text()).toContain('Keyword: long');
          expect(getKeywordExtractedRowData(gridOptions).text()).toContain('Score: 0.5');

          done();
        });

        it('should highlight the keywords extracted if available', async done => {
          const { gridOptions } = await new ExecutionReportITDSection().build(execReport);

          expect(getLongQueryRecall(gridOptions)).toContain(
            StreamHighlightUtils.highlightStreamText('the long query is not empty', { query: [], long: [] }, {})
          );
          done();
        });
      });
    });

    describe('when dealing with index partial match', () => {
      const getExecutionReportSectionForPartialMatch = (partialMatchApplied: string): IExecutionReportSection[] => {
        return [
          {
            description: 'PartialMatch',
            duration: 789,
            name: EXECUTION_REPORT_SECTION.PARTIAL_MATCH,
            result: {
              out: partialMatchApplied
            }
          },
          getExecutionReportSectionForITD([])
        ];
      };

      it('should output a fallback if the long query is empty', async done => {
        const execReport = getExecutionReportSection(getExecutionReportSectionForPartialMatch(''), '');
        const { container } = await new ExecutionReportITDSection().build(execReport);
        expect(container.text()).toContain('NO DATA AVAILABLE');
        done();
      });

      it('should output a fallback if the long query is not empty but no partial match was executed by the index', async done => {
        const { gridOptions } = await new ExecutionReportITDSection().build(
          getExecutionReportSection(getExecutionReportSectionForPartialMatch(''), 'the long query is not empty')
        );
        expect(getKeywordExtractedRowData(gridOptions).text()).toContain('No keywords were extracted');
        done();
      });

      it('should output a fallback if the long query is not empty but partial match is not matching an actual partial match query expression', async done => {
        const { gridOptions } = await new ExecutionReportITDSection().build(
          getExecutionReportSection(
            getExecutionReportSectionForPartialMatch('this is not a partial match query expression'),
            'the long query is not empty'
          )
        );
        expect(getKeywordExtractedRowData(gridOptions).text()).toContain('No keywords were extracted');
        done();
      });

      it('should output the partial match query expression performed by the index', async done => {
        const partialMatchQueryExpression =
          'PartialMatch(keywords=a couple of random keywords; match=50%; pick=Unspecified(); stopWords=; noRanking=false; noHighlight=false)';
        const { gridOptions } = await new ExecutionReportITDSection().build(
          getExecutionReportSection(getExecutionReportSectionForPartialMatch(partialMatchQueryExpression), 'the long query is not empty')
        );
        expect(getKeywordExtractedRowData(gridOptions).text()).toContain('Fallback on Coveo Index partial match feature');
        expect(getKeywordExtractedRowData(gridOptions).text()).toContain(partialMatchQueryExpression);

        done();
      });
    });
  });
}
