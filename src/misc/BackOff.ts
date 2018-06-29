export interface IBackOffOptions {
  numOfAttempts: number;
  timeStep: number;
  startingDelay: number;
  retryCondition: (e: any, attemptNumber: number) => boolean;
}

const defaultOptions: IBackOffOptions = {
  numOfAttempts: 10,
  timeStep: 2,
  startingDelay: 100,
  retryCondition: () => true
};

export async function backOff(func, options?: Partial<IBackOffOptions>) {
  options = { ...defaultOptions, ...options };
  let attemptNumber = 0;
  let delay = options.startingDelay;

  while (attemptNumber < options.numOfAttempts) {
    try {
      await new Promise(resolve => setTimeout(resolve, delay));
      attemptNumber++;
      return await func();
    } catch (e) {
      const shouldRetry = options.retryCondition(e, attemptNumber);
      const reachedRetryLimit = attemptNumber >= options.numOfAttempts;

      if (!shouldRetry || reachedRetryLimit) {
        throw e;
      }

      delay *= options.timeStep;
    }
  }

  throw {};
}
