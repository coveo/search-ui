import { BackOffRequest, setBackOffModule, IBackOffRequest } from '../../src/rest/BackOffRequest';

export function BackOffRequestTest() {
  describe('BackOffRequest', () => {
    const oneTimeUnit = 100;
    const mockSuccessResponse = { success: true } as any;

    beforeAll(() => stubBackOffDependency());

    function stubBackOffDependency() {
      setBackOffModule((request: IBackOffRequest<{}>) => request.fn());
    }

    function resolveInOneTimeUnit(): Promise<any> {
      return new Promise(resolve => setTimeout(() => resolve(mockSuccessResponse), oneTimeUnit));
    }

    function roundToNearestTimeUnit(duration: number) {
      const numOfUnits = Math.round(duration / oneTimeUnit);
      return numOfUnits * oneTimeUnit;
    }

    it(`when calling #enqueue with a request that resolves successfully,
    it returns the successful response`, done => {
      const request = BackOffRequest.enqueue({ fn: () => Promise.resolve(mockSuccessResponse) });

      request.then(response => {
        expect(response).toBe(mockSuccessResponse);
        done();
      });
    });

    it(`when calling #enqueue with two requests that resolve in one time unit each,
    it processes the requests in series`, done => {
      const startTime = Date.now();

      BackOffRequest.enqueue({ fn: () => resolveInOneTimeUnit() });
      const secondRequest = BackOffRequest.enqueue({ fn: () => resolveInOneTimeUnit() });

      secondRequest.then(response => {
        const endTime = Date.now();
        const duration = roundToNearestTimeUnit(endTime - startTime);

        expect(response).toBe(mockSuccessResponse);
        expect(duration).toBe(2 * oneTimeUnit);
        done();
      });
    });

    it(`when calling #enqueue with a request that returns an error,
    it returns a rejected promise with the error`, done => {
      const error = { error: true };
      const request = BackOffRequest.enqueue({ fn: () => Promise.reject(error) });

      request.catch(e => {
        expect(e).toBe(error);
        done();
      });
    });
  });
}
