import { BackOff } from '../../src/rest/BackOff';
import { IErrorResponse, ISuccessResponse } from '../../src/rest/EndpointCaller';

export function BackOffTest() {
  describe('BackOff', () => {
    const oneSecond = 1000;
    const mockSuccessResponse: ISuccessResponse<{}> = {
      duration: 1,
      data: {}
    };

    function resolveInOneSecond(): Promise<ISuccessResponse<{}>> {
      return new Promise(resolve => setTimeout(() => resolve(mockSuccessResponse), oneSecond));
    }

    beforeEach(() => jasmine.clock().install());
    afterEach(() => jasmine.clock().uninstall());

    it(`when calling #is429Error with a 429 error, it returns 'true'`, () => {
      const error = { statusCode: 429 } as IErrorResponse;
      expect(BackOff.is429Error(error)).toBe(true);
    });

    it(`when calling #is429Error with a non-429 error, it returns 'false'`, () => {
      const error = { statusCode: 404 } as IErrorResponse;
      expect(BackOff.is429Error(error)).toBe(false);
    });

    // it(`when calling #request with a fake request that resolves in 1s`, done => {
    //   const request = BackOff.request(() => resolveInOneSecond());
    //   jasmine.clock().tick(oneSecond * 2);

    //   request.then(response => {
    //     expect(response).toBe(mockSuccessResponse);
    //     done();
    //   });
    // })
  });
}
