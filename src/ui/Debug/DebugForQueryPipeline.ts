import { IQueryResults } from '../../rest/QueryResults';

export class DebugForQueryPipeline {
  public generateDebugInfoForQueryPipeline(queryResults: IQueryResults) {
    if (queryResults.executionReport) {
      return {
        Execution: {
          execReport: queryResults.executionReport
        }
      };
    }
    return null;
  }
}
