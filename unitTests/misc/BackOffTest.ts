import { backOff } from '../../src/misc/BackOff';

export function BackOffTest() {
  describe('BackOffTest', () => {
    const mockSuccessResponse = { success: true };

    it(`when calling #backOff with a function that throws an error the first time, and succeeds the second time,
    it returns a successful response`, done => {
      const failOnceBeforeSuccess = (() => {
        let firstAttempt = true;

        const request = () => {
          if (firstAttempt) {
            firstAttempt = false;
            return Promise.reject({});
          }

          return Promise.resolve(mockSuccessResponse);
        };

        return request;
      })();

      const request = backOff(failOnceBeforeSuccess);
      request.then(response => {
        expect(response).toBe(mockSuccessResponse);
        done();
      });
    });
  });
}
