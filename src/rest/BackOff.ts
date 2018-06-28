import { IErrorResponse, ISuccessResponse } from './EndpointCaller';
import * as PromiseRetry from 'promise-retry';
import { Logger } from '../misc/Logger';

type Request = () => Promise<ISuccessResponse<{}>>;

export class BackOff {
  private static queue: Request[] = [];
  private static clearingQueue = false;

  public static request(fn: Request): Promise<ISuccessResponse<{}>> {
    return new Promise((resolve, reject) => {
      const request = BackOff.getBackOffRequest(fn, resolve, reject);
      BackOff.enqueueRequest(request);
      BackOff.clearQueueIfNotAlready();
    });
  }

  private static getBackOffRequest(fn: Request, resolve, reject): Request {
    return () =>
      PromiseRetry((retry, attemptNumber) => {
        return fn()
          .then(resolve)
          .catch(e => BackOff.handleIf429Error(e, retry, attemptNumber))
          .catch(reject);
      });
  }

  private static enqueueRequest(request: Request) {
    BackOff.queue.push(request);
  }

  private static async clearQueueIfNotAlready() {
    if (BackOff.clearingQueue) {
      return;
    }

    BackOff.clearingQueue = true;

    while (BackOff.queue.length) {
      const request = BackOff.queue.shift();
      await request();
    }

    BackOff.clearingQueue = false;
  }

  private static handleIf429Error(e: IErrorResponse, retry: (e: IErrorResponse) => Promise<any>, attempt: number) {
    if (BackOff.is429Error(e)) {
      new Logger(BackOff).info(`Resending the request because it was throttled. Retry attempt ${attempt}`);
      return retry(e);
    }

    throw e;
  }

  public static is429Error(error: IErrorResponse) {
    return error && error.statusCode === 429;
  }
}
