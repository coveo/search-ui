import { BackOff } from '../../src/rest/BackOff';
import { IErrorResponse, ISuccessResponse } from '../../src/rest/EndpointCaller';

export function BackOffTest() {
  describe('BackOff', () => {
    const oneTimeUnit = 50;
    const mockSuccessResponse: ISuccessResponse<{}> = {
      duration: 1,
      data: {}
    };

    function resolveInOneTimeUnit(): Promise<ISuccessResponse<{}>> {
      return new Promise(resolve => setTimeout(() => resolve(mockSuccessResponse), oneTimeUnit));
    }

    function roundToNearestTimeUnit(duration: number) {
      const numOfUnits = Math.round(duration / oneTimeUnit);
      return numOfUnits * oneTimeUnit;
    }

    function getErrorWithCode(statusCode: number) {
      return { statusCode } as IErrorResponse;
    }

    it(`when calling #is429Error with a 429 error, it returns 'true'`, () => {
      const error = getErrorWithCode(429);
      expect(BackOff.is429Error(error)).toBe(true);
    });

    it(`when calling #is429Error with a non-429 error, it returns 'false'`, () => {
      const error = getErrorWithCode(404);
      expect(BackOff.is429Error(error)).toBe(false);
    });

    it(`when calling #request with a request that resolves successfully,
    it returns the successful response`, done => {
      const request = BackOff.request(() => Promise.resolve(mockSuccessResponse));

      request.then(response => {
        expect(response).toBe(mockSuccessResponse);
        done();
      });
    });

    it(`when calling #request with two requests that resolve in one time unit each,
    it processes the requests in series`, done => {
      const startTime = Date.now();

      BackOff.request(() => resolveInOneTimeUnit());
      const secondRequest = BackOff.request(() => resolveInOneTimeUnit());

      secondRequest.then(response => {
        const endTime = Date.now();
        const duration = roundToNearestTimeUnit(endTime - startTime);

        expect(response).toBe(mockSuccessResponse);
        expect(duration).toBe(2 * oneTimeUnit);
        done();
      });
    });

    it(`when calling #request with a request that returns a non-429 error,
    it returns a rejected promise with the error`, done => {
      const error = getErrorWithCode(404);
      const request = BackOff.request(() => Promise.reject(error));

      request.catch(e => {
        expect(e).toBe(error);
        done();
      });
    });

    // it(`when calling #request with a request that returns a 429 error the first time, and a successful response the second time,
    // it returns a successful response`, done => {
    //   let firstAttempt = true;

    //   const failOnceBeforeSuccess = () => {
    //     if (firstAttempt) {
    //       firstAttempt = false;
    //       const error = getErrorWithCode(429);
    //       return Promise.reject(error);
    //     }

    //     return Promise.resolve(mockSuccessResponse);
    //   }

    //   const request = BackOff.request(failOnceBeforeSuccess);
    //   request.then(response => {
    //     expect(response).toBe(mockSuccessResponse);
    //     done();
    //   });
    // });
  });
}
