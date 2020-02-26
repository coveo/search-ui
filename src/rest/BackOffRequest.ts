import { backOff as originalBackOff, IBackOffOptions } from 'exponential-backoff';

let backOff = originalBackOff;

export function setBackOffModule(newModule?: (request: () => Promise<any>, options?: Partial<IBackOffOptions>) => Promise<any>) {
  backOff = newModule || originalBackOff;
}

export class BackOffRequest {
  private static queue: (() => Promise<any>)[] = [];
  private static clearingQueue = false;

  public static enqueue<T>(request: () => Promise<T>, options: Partial<IBackOffOptions> = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      BackOffRequest.enqueueRequest<T>(request, options, resolve, reject);
      BackOffRequest.clearQueueIfNotAlready();
    });
  }

  private static enqueueRequest<T>(request: () => Promise<T>, options: Partial<IBackOffOptions>, resolve, reject) {
    const req = () =>
      backOff<T>(request, options)
        .then(resolve)
        .catch(reject);
    BackOffRequest.queue.push(req);
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
