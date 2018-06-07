import { QueryController } from '../../src/controllers/QueryController';
import { SentryLogger } from '../../src/misc/SentryLogger';
import { mockQueryController, mockWindow, mockSearchEndpoint } from '../MockEnvironment';
import { SearchEndpoint } from '../../src/rest/SearchEndpoint';

export function SentryLoggerTest() {
  describe('SentryLoggerTest', () => {
    let queryController: QueryController;
    let endpoint: SearchEndpoint;
    let windoh: Window;

    beforeEach(() => {
      windoh = mockWindow();
      windoh.onerror = null;
      queryController = mockQueryController();
      endpoint = mockSearchEndpoint();
      queryController.getEndpoint = () => endpoint;
      new SentryLogger(queryController, windoh);
    });

    afterEach(() => {
      windoh.onerror = null;
      queryController = null;
      endpoint = null;
    });

    it('should log the error', () => {
      windoh.location.href = 'somewhere.com';
      windoh.location.host = 'somewhere.com';
      windoh.onerror('an error happened', 'CoveoJsSearch.min.js', 123, 1, new Error('an error happened'));

      expect(endpoint.logError).toHaveBeenCalledWith(
        jasmine.objectContaining({
          level: 'DEBUG',
          title: 'somewhere.com',
          message: jasmine.any(String)
        })
      );
    });

    it('should call any error handler already set', () => {
      let spyError = jasmine.createSpy('error');
      windoh.onerror = spyError;

      new SentryLogger(queryController, windoh);
      windoh.location.href = 'somewhere.com';
      windoh.location.host = 'somewhere.com';
      windoh.onerror('an error happened', 'CoveoJsSearch.min.js', 123, 1, new Error('an error happened'));

      expect(spyError).toHaveBeenCalled();
      expect(endpoint.logError).toHaveBeenCalled();
    });

    it("should not log the error if it's localhost", () => {
      windoh.location.href = 'localhost';
      windoh.location.host = 'localhost';
      windoh.onerror('an error happened', 'CoveoJsSearch.min.js', 123, 1, new Error('an error happened'));

      expect(endpoint.logError).not.toHaveBeenCalled();
    });

    it("should not log the error if it' not a coveo file", () => {
      windoh.location.href = 'somewhere.com';
      windoh.location.host = 'somewhere.com';
      windoh.onerror('an error happened', 'randomfile.js', 123, 1, new Error('an error happened'));

      expect(endpoint.logError).not.toHaveBeenCalled();
    });
  });
}
