import * as Mock from '../MockEnvironment';
import { ErrorReport } from '../../src/ui/ErrorReport/ErrorReport';
import { IErrorReportOptions } from '../../src/ui/ErrorReport/ErrorReport';
import { Simulate } from '../Simulate';
import { QueryError } from '../../src/rest/QueryError';
import { $$ } from '../../src/utils/Dom';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { l } from '../../src/strings/Strings';

export function ErrorReportTest() {
  describe('ErrorReport', function() {
    var test: Mock.IBasicComponentSetup<ErrorReport>;

    beforeEach(function() {
      test = Mock.basicComponentSetup<ErrorReport>(ErrorReport);
    });

    afterEach(function() {
      test = null;
    });

    describe('exposes options', function() {
      it('showDetailedError allow to show the json of the error', function() {
        test = Mock.optionsComponentSetup<ErrorReport, IErrorReportOptions>(ErrorReport, {
          showDetailedError: false
        });
        Simulate.query(test.env, {
          error: new QueryError({
            statusCode: 401,
            data: {
              message: 'the message',
              type: 'the type'
            }
          })
        });
        expect($$(test.cmp.element).find('.coveo-error-report-message')).toBe(null);

        test = Mock.optionsComponentSetup<ErrorReport, IErrorReportOptions>(ErrorReport, {
          showDetailedError: true
        });

        Simulate.query(test.env, {
          error: new QueryError({
            statusCode: 401,
            data: {
              message: 'the message',
              type: 'the type'
            }
          })
        });
        expect($$(test.cmp.element).find('.coveo-error-report-message')).not.toBe(null);
      });
    });

    it('should hide by default', function() {
      expect(test.cmp.element.style.display).toBe('none');
    });

    it('should show on query error', function() {
      Simulate.query(test.env, {
        error: new QueryError({
          statusCode: 401,
          data: {
            message: 'the message',
            type: 'the type'
          }
        })
      });
      expect(test.cmp.element.style.display).toBe('block');
    });

    it('should send analytics event on retry', function() {
      Simulate.query(test.env, {
        error: new QueryError({
          statusCode: 401,
          data: {
            message: 'the message',
            type: 'the type'
          }
        })
      });
      test.cmp.retry();
      expect(test.cmp.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.errorRetry, {});
    });

    it('should send analytics event on reset', function() {
      Simulate.query(test.env, {
        error: new QueryError({
          statusCode: 401,
          data: {
            message: 'the message',
            type: 'the type'
          }
        })
      });
      test.cmp.reset();
      expect(test.cmp.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.errorClearQuery, {});
    });
    it('should display a different error message if the error is a NoEndpointsException', function() {
      Simulate.query(test.env, {
        error: new QueryError({
          statusCode: 408,
          data: {
            message: 'the message',
            type: 'NoEndpointsException',
            name: 'NoEndpointsException'
          }
        })
      });
      expect($$($$(test.cmp.root).find('.coveo-error-report-title')).text()).toEqual(l('NoEndpoints', 'foobar') + l('AddSources'));
    });

    it('should display a different error message is cause by an invalid token', function() {
      Simulate.query(test.env, {
        error: new QueryError({
          statusCode: 408,
          data: {
            message: 'the message',
            type: 'InvalidTokenException',
            name: 'InvalidTokenException'
          }
        })
      });
      expect($$($$(test.cmp.root).find('.coveo-error-report-title')).text()).toEqual(l('CannotAccess', 'foobar') + l('InvalidToken'));
    });
  });
}
