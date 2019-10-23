import { defaults } from 'underscore';

export interface IQueriesProcessorOptions {
  timeout: number;
}

export enum QueryProcessResultStatus {
  Finished = 'finished',
  TimedOut = 'timedout',
  Overriden = 'overriden'
}

export type QueryProcessResult<ItemType> =
  | {
      status: QueryProcessResultStatus.Finished | QueryProcessResultStatus.TimedOut;
      items: ItemType[];
    }
  | {
      status: QueryProcessResultStatus.Overriden;
    };

export class QueriesProcessor<ItemType> {
  private static async streamQueries<ItemType>(queries: Promise<ItemType[]>[], output: ItemType[]) {
    await Promise.all(queries.map(query => query.then(items => output.push(...items))));
  }

  private override: () => any;
  private options: IQueriesProcessorOptions;

  constructor(options: Partial<IQueriesProcessorOptions> = {}) {
    this.options = defaults(options, <IQueriesProcessorOptions>{
      timeout: 500
    });
  }

  public async processQueries(queries: (ItemType[] | Promise<ItemType[]>)[]): Promise<QueryProcessResult<ItemType>> {
    this.overrideIfProcessing();
    let items: ItemType[] = [];

    const asynchronousQueries: Promise<ItemType[]>[] = [];
    for (const query of queries) {
      if (query instanceof Promise) {
        asynchronousQueries.push(query);
      } else {
        items.push(...query);
      }
    }

    let status: QueryProcessResultStatus;
    if (asynchronousQueries.length > 0) {
      status = await Promise.race([
        QueriesProcessor.streamQueries(asynchronousQueries, items).then(() => QueryProcessResultStatus.Finished),
        this.waitForOverride().then(() => QueryProcessResultStatus.Overriden),
        this.waitForTimeout().then(() => QueryProcessResultStatus.TimedOut)
      ]);
      if (status === QueryProcessResultStatus.Overriden) {
        return {
          status
        };
      }
    } else {
      status = QueryProcessResultStatus.Finished;
    }
    return {
      status,
      items
    };
  }

  public async overrideIfProcessing() {
    if (this.override) {
      this.override();
    }
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
