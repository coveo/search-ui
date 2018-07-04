export interface IBackOffRequest<T> {
  fn: () => Promise<T>;
  retry?: (e, attemptNumber: number) => boolean;
}

export interface IBackOffOptions {
  numOfAttempts?: number;
  timeMultiple?: number;
  startingDelay?: number;
}

const defaultOptions: IBackOffOptions = {
  numOfAttempts: 10,
  timeMultiple: 2,
  startingDelay: 100
};

export async function backOff<T>(request: IBackOffRequest<T>, options?: IBackOffOptions): Promise<T> {
  const sanitizedOptions = getSanitizedOptions(options);

  let attemptNumber = 0;
  let delay = sanitizedOptions.startingDelay;

  while (attemptNumber < sanitizedOptions.numOfAttempts) {
    try {
      await delayBeforeExecuting(delay);
      attemptNumber++;
      return await request.fn();
    } catch (e) {
      const shouldRetry = request.retry ? request.retry(e, attemptNumber) : true;
      const reachedRetryLimit = attemptNumber >= sanitizedOptions.numOfAttempts;

      if (!shouldRetry || reachedRetryLimit) {
        throw e;
      }

      delay *= sanitizedOptions.timeMultiple;
    }
  }
}

function getSanitizedOptions(options: IBackOffOptions) {
  options = { ...defaultOptions, ...options };

  if (options.numOfAttempts < 1) {
    options.numOfAttempts = 1;
  }

  return options;
}

function delayBeforeExecuting(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay));
}
