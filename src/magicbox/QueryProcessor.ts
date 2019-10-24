export interface IQueryProcessorOptions {
  timeout: number;
}

export enum ProcessingStatus {
  Finished,
  TimedOut,
  Overriden
}

export interface IQueryResult<T> {
  status: ProcessingStatus;
  results?: T[];
}

/**
 * IE11 equivalent of Promise.race
 */
function racePromises<T>(...promises: Thenable<T>[]): Promise<T> {
  let done = false;
  return new Promise<T>((resolve, reject) => {
    const finish = (func: Function) => {
      if (done) {
        return;
      }
      done = true;
      func();
    };
    promises.forEach(promise => promise.then(result => finish(() => resolve(result))).catch(err => finish(() => reject(err))));
  });
}

export class QueryProcessor<T> {
  private override: () => void;
  private options: IQueryProcessorOptions;
  private processedResults: T[];

  constructor(options: Partial<IQueryProcessorOptions> = {}) {
    this.options = { timeout: 500, ...options };
  }

  /**
   * Overrides the previous queries and accumulates the result of promise arrays with a timeout.
   */
  public async processQueries(queries: (T[] | Promise<T[]>)[]): Promise<IQueryResult<T>> {
    this.overrideIfProcessing();
    const asyncQueries = queries.map(query => (query instanceof Promise ? query : Promise.resolve(query)));

    return await racePromises(
      this.resolveQueriesAndAccumulateResults(asyncQueries).then(() => this.buildProcessResults(ProcessingStatus.Finished)),
      this.waitForOverride().then(() => this.buildProcessResults(ProcessingStatus.Overriden)),
      this.waitForTimeout().then(() => this.buildProcessResults(ProcessingStatus.TimedOut))
    );
  }

  public async overrideIfProcessing() {
    if (this.override) {
      this.override();
    }
  }

  private buildProcessResults(status: ProcessingStatus): IQueryResult<T> {
    return {
      status,
      ...(this.statusHasResults(status) && { results: this.processedResults })
    };
  }

  private statusHasResults(status: ProcessingStatus): status is ProcessingStatus.Finished | ProcessingStatus.TimedOut {
    switch (status) {
      case ProcessingStatus.Finished:
      case ProcessingStatus.TimedOut:
        return true;
    }
    return false;
  }

  /**
   * Accumulates the results of queries in this.processedResults as they are resolved.
   * When there are no unprocessed queries remaining, the returned promise is resolved.
   */
  private async resolveQueriesAndAccumulateResults(queries: Promise<T[]>[]) {
    await Promise.all(queries.map(query => query.then(items => this.processedResults.push(...items))));
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
