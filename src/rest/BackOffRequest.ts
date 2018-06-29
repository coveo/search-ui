import { ISuccessResponse } from './EndpointCaller';
import { backOff as backOffModule } from '../misc/BackOff';

let backOff = backOffModule;

export function setBackOffModule(newModule) {
  backOff = newModule;
}

type Request = () => Promise<ISuccessResponse<{}>>;

export interface IBackOffRequest {
  fn: Request;
  retry?: (e, attemptNumber: number) => boolean;
}

export class BackOffRequest {
  private static queue: Request[] = [];
  private static clearingQueue = false;

  public static enqueue(request: IBackOffRequest): Promise<ISuccessResponse<{}>> {
    return new Promise((resolve, reject) => {
      const req = BackOffRequest.getBackOffRequest(request, resolve, reject);
      BackOffRequest.enqueueRequest(req);
      BackOffRequest.clearQueueIfNotAlready();
    });
  }

  private static getBackOffRequest(request: IBackOffRequest, resolve, reject): Request {
    return () => {
      const options = { retryCondition: request.retry };

      return backOff(request.fn, options)
        .then(resolve)
        .catch(reject);
    };
  }

  private static enqueueRequest(request: Request) {
    BackOffRequest.queue.push(request);
  }

  private static async clearQueueIfNotAlready() {
    if (BackOffRequest.clearingQueue) {
      return;
    }

    BackOffRequest.clearingQueue = true;

    while (BackOffRequest.queue.length) {
      const request = BackOffRequest.queue.shift();
      await request();
    }

    BackOffRequest.clearingQueue = false;
  }
}
