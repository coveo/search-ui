import { backOff as backOffModule, IBackOffRequest } from '../misc/BackOff';
export type IBackOffRequest<T> = IBackOffRequest<T>;

let backOff = backOffModule;

export function setBackOffModule(newModule) {
  backOff = newModule;
}

export class BackOffRequest {
  private static queue: (<T>() => Promise<T>)[] = [];
  private static clearingQueue = false;

  public static enqueue<T>(request: IBackOffRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const req = BackOffRequest.getBackOffRequest<T>(request, resolve, reject);
      BackOffRequest.enqueueRequest<T>(req);
      BackOffRequest.clearQueueIfNotAlready();
    });
  }

  private static getBackOffRequest<T>(request: IBackOffRequest<T>, resolve, reject): <T>() => Promise<T> {
    return () => {
      return backOff<T>(request)
        .then(resolve)
        .catch(reject);
    };
  }

  private static enqueueRequest<T>(request: <T>() => Promise<T>) {
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
