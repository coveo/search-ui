import { flatten } from 'underscore';

export interface IQueryProcessorOptions {
  timeout: number;
}

export enum ProcessingStatus {
  Finished,
  TimedOut,
  Overriden
}

export interface IQueryProcessResult<T> {
  status: ProcessingStatus;
  results: T[];
}

/**
 * IE11 equivalent of Promise.race
 * Adapted from Promise.race(iterable) polyfill on https://www.promisejs.org/api/
 */
function racePromises<T>(promises: Thenable<T>[]): Promise<T> {
  return new Promise<T>((resolve, reject) => promises.forEach(value => Promise.resolve(value).then(resolve, reject)));
}

export class QueryProcessor<T> {
  private override: () => void;
  private options: IQueryProcessorOptions;
  private processedResults: T[][];

  constructor(options: Partial<IQueryProcessorOptions> = {}) {
    this.options = { timeout: 500, ...options };
  }

  /**
   * Overrides the previous queries and accumulates the result of promise arrays with a timeout.
   */
  public async processQueries(queries: (T[] | Promise<T[]>)[]): Promise<IQueryProcessResult<T>> {
    this.overrideIfProcessing();
    this.processedResults = new Array(queries.length);
    const asyncQueries = queries.map(query => (query instanceof Promise ? query : Promise.resolve(query)));

    return racePromises([
      this.accumulateResultsChronologically(asyncQueries).then(() => this.buildProcessResults(ProcessingStatus.Finished)),
      this.waitForOverride().then(() => this.buildProcessResults(ProcessingStatus.Overriden)),
      this.waitForTimeout().then(() => this.buildProcessResults(ProcessingStatus.TimedOut))
    ]);
  }

  public async overrideIfProcessing() {
    if (this.override) {
      this.override();
    }
  }

  private get orderedResults(): T[] {
    return flatten(this.processedResults.filter(result => !!result), true);
  }

  private buildProcessResults(status: ProcessingStatus): IQueryProcessResult<T> {
    return {
      status,
      results: status !== ProcessingStatus.Overriden ? this.orderedResults : []
    };
  }

  private async accumulateResultsChronologically(queries: Promise<T[]>[]) {
    const output = this.processedResults;
    await Promise.all(queries.map((query, i) => query.then(items => (output[i] = items))));
  }

  private waitForOverride() {
    return new Promise<void>(resolve => {
      this.override = () => {
        this.override = null;
        resolve();
      };
    });
  }

  private waitForTimeout() {
    return new Promise<void>(resolve => setTimeout(() => resolve(), this.options.timeout));
  }
}
